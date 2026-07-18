import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  buildComposition,
  createSeededRandom,
  type CubeRecord,
  type EnergyRole,
} from "./composition";

type Theme = "light" | "dark";
type Quality = "high" | "medium" | "low";

type Palette = {
  fog: string;
  solid: string;
  shell: string;
  wire: string;
  energy: Record<EnergyRole, string>;
  particle: [string, string];
  shellOpacity: number;
  wireOpacity: number;
  energyOpacity: number;
  particleOpacity: number;
  bloom: number;
  exposure: number;
};

const PALETTES: Record<Theme, Palette> = {
  dark: {
    fog: "#030303",
    solid: "#07140c",
    shell: "#527052",
    wire: "#82915c",
    energy: { moss: "#789260", gold: "#c1a044", amber: "#98702f" },
    particle: ["#789260", "#c1a044"],
    shellOpacity: 0.085,
    wireOpacity: 0.075,
    energyOpacity: 0.2,
    particleOpacity: 0.5,
    bloom: 0.48,
    exposure: 0.86,
  },
  light: {
    fog: "#f1f0e8",
    solid: "#89967c",
    shell: "#4f6549",
    wire: "#6f7443",
    energy: { moss: "#526b45", gold: "#a17b22", amber: "#905927" },
    particle: ["#526b45", "#a17b22"],
    shellOpacity: 0.14,
    wireOpacity: 0.11,
    energyOpacity: 0.48,
    particleOpacity: 0.4,
    bloom: 0.04,
    exposure: 1,
  },
};

type MeshSet = {
  root: THREE.Group;
  geometry: THREE.BoxGeometry;
  solids: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  shells: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  wires: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  glows: Array<THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>;
  materials: THREE.Material[];
};

function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function initialQuality(): Quality {
  const mobile = matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (mobile || memory <= 4) return "low";
  if (devicePixelRatio > 1.5 || memory <= 8) return "medium";
  return "high";
}

export class CrystallineBackgroundRenderer {
  private readonly host: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(43, 1, 0.1, 80);
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly pointer = new THREE.Vector2();
  private readonly smoothPointer = new THREE.Vector2();
  private readonly reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  private readonly themeObserver: MutationObserver;
  private theme = currentTheme();
  private quality = initialQuality();
  private meshSet?: MeshSet;
  private particles?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private frame = 0;
  private resizeFrame = 0;
  private lastTime = performance.now();
  private reducedMotion = this.reducedMotionQuery.matches;
  private contextLost = false;
  private disposed = false;
  private sampleTime = 0;
  private sampleFrames = 0;

  constructor(host: HTMLElement) {
    this.host = host;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.setAttribute("role", "presentation");
    this.host.append(this.renderer.domElement);

    this.scene.background = null;
    this.camera.position.set(0, 0, 17);
    this.scene.fog = new THREE.FogExp2(PALETTES[this.theme].fog, this.theme === "dark" ? 0.018 : 0.012);

    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0, 0.5, 0.42);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(this.bloom);

    this.themeObserver = new MutationObserver(this.onThemeMutation);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    this.addEvents();
    this.resize();
    this.rebuild();
    this.start();
  }

  private qualitySettings(): { scale: number; dpr: number; particles: number } {
    if (this.quality === "high") return { scale: 1, dpr: 1.55, particles: 440 };
    if (this.quality === "medium") return { scale: 0.72, dpr: 1.2, particles: 280 };
    return { scale: 0.44, dpr: 1, particles: 120 };
  }

  private makeMesh(
    geometry: THREE.BoxGeometry,
    material: THREE.MeshBasicMaterial,
    records: CubeRecord[],
    filter: (record: CubeRecord) => boolean,
    scale = 1,
  ): THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> {
    const selected = records.filter(filter);
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      Math.max(1, selected.length),
    );
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const instanceScale = new THREE.Vector3();

    selected.forEach((record, index) => {
      quaternion.setFromEuler(record.rotation);
      instanceScale.copy(record.scale).multiplyScalar(scale);
      matrix.compose(record.position, quaternion, instanceScale);
      mesh.setMatrixAt(index, matrix);
    });

    mesh.count = selected.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
  }

  private rebuild(): void {
    this.disposeSceneObjects();

    const palette = PALETTES[this.theme];
    const settings = this.qualitySettings();
    const records = buildComposition(this.camera.aspect, settings.scale);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const solidMaterial = new THREE.MeshBasicMaterial({ color: palette.solid });
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: palette.shell,
      transparent: true,
      opacity: palette.shellOpacity,
      blending: this.theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: palette.wire,
      wireframe: true,
      transparent: true,
      opacity: palette.wireOpacity,
      blending: this.theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const solids = this.makeMesh(geometry, solidMaterial, records, () => true);
    const shells = this.makeMesh(geometry, shellMaterial, records, (record) => record.shell, 1.035);
    const wires = this.makeMesh(
      geometry,
      wireMaterial,
      records,
      (record) => record.shell || record.bright,
      1.065,
    );
    const materials: THREE.Material[] = [solidMaterial, shellMaterial, wireMaterial];
    const glows = (["moss", "gold", "amber"] as const).map((role) => {
      const material = new THREE.MeshBasicMaterial({
        color: palette.energy[role],
        transparent: true,
        opacity: palette.energyOpacity,
        blending: this.theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
        depthTest: false,
      });
      materials.push(material);
      const mesh = this.makeMesh(
        geometry,
        material,
        records,
        (record) => record.bright && record.energy === role,
        0.52,
      );
      mesh.renderOrder = 3;
      return mesh;
    });

    const root = new THREE.Group();
    root.add(solids, shells, wires, ...glows);
    this.scene.add(root);
    this.meshSet = { root, geometry, solids, shells, wires, glows, materials };
    this.addParticles(settings.particles);
    this.applyPalette();
  }

  private addParticles(count: number): void {
    const random = createSeededRandom("slajuwomi-mineral-particles-01");
    const palette = PALETTES[this.theme];
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const primary = new THREE.Color(palette.particle[0]);
    const secondary = new THREE.Color(palette.particle[1]);

    for (let index = 0; index < count; index += 1) {
      const side = random() > 0.5 ? 1 : -1;
      positions[index * 3] = side * (4.6 + random() * 10);
      positions[index * 3 + 1] = (random() - 0.5) * 16;
      positions[index * 3 + 2] = (random() - 0.5) * 11;
      colors.set((random() > 0.84 ? secondary : primary).toArray(), index * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: palette.particleOpacity,
      blending: this.theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      vertexColors: true,
    });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private applyPalette(): void {
    const palette = PALETTES[this.theme];
    // UnrealBloomPass does not preserve the renderer's transparent alpha in a
    // reliable way. Clearing to the theme surface prevents its black composer
    // buffer from showing through on the light theme.
    this.renderer.setClearColor(palette.fog, 1);
    this.renderer.toneMappingExposure = palette.exposure;
    this.bloom.strength = palette.bloom;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.set(palette.fog);
      this.scene.fog.density = this.theme === "dark" ? 0.018 : 0.012;
    }
  }

  private disposeSceneObjects(): void {
    if (this.meshSet) {
      this.scene.remove(this.meshSet.root);
      this.meshSet.geometry.dispose();
      this.meshSet.materials.forEach((material) => material.dispose());
      this.meshSet = undefined;
    }
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
      this.particles = undefined;
    }
  }

  private resize(): void {
    const width = innerWidth;
    const height = Math.max(1, innerHeight);
    const { dpr } = this.qualitySettings();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, dpr));
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
  }

  private start(): void {
    if (this.frame || this.disposed || this.contextLost || document.hidden) return;
    this.lastTime = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    this.frame = 0;
    if (this.disposed || this.contextLost || document.hidden) return;

    const delta = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const motion = this.reducedMotion ? 0 : 0.42;

    this.smoothPointer.lerp(this.pointer, 1 - Math.exp(-delta * 2.4));
    const pointerStrength = innerWidth < 700 ? 0.1 : 0.34;
    this.camera.position.x = THREE.MathUtils.lerp(
      this.camera.position.x,
      this.smoothPointer.x * pointerStrength,
      1 - Math.exp(-delta * 2.2),
    );
    this.camera.position.y = THREE.MathUtils.lerp(
      this.camera.position.y,
      this.smoothPointer.y * pointerStrength * 0.58 - scrollY * 0.0002,
      1 - Math.exp(-delta * 2.2),
    );
    this.camera.lookAt(0, 0, 0);

    if (this.meshSet) {
      const time = now * 0.001;
      this.meshSet.root.rotation.y = this.smoothPointer.x * 0.01 + Math.sin(time * 0.07) * 0.004 * motion;
      this.meshSet.root.rotation.x = -this.smoothPointer.y * 0.006;
      const baseOpacity = PALETTES[this.theme].energyOpacity;
      this.meshSet.glows.forEach((mesh, index) => {
        mesh.material.opacity = Math.max(
          0,
          baseOpacity + Math.sin(time * (0.2 + index * 0.025) + index * 2) * 0.025 * motion,
        );
      });
    }
    if (this.particles) {
      this.particles.rotation.z += delta * 0.002 * motion;
      this.particles.position.y = Math.sin(now * 0.00006) * 0.1 * motion;
    }

    this.composer.render();
    this.host.dataset.ready = "true";
    this.sampleTime += delta;
    this.sampleFrames += 1;
    this.maybeReduceQuality();

    if (!this.reducedMotion) this.frame = requestAnimationFrame(this.tick);
  };

  private maybeReduceQuality(): void {
    if (this.sampleFrames < 150 || this.quality === "low") return;
    const averageFps = this.sampleFrames / Math.max(0.001, this.sampleTime);
    this.sampleFrames = 0;
    this.sampleTime = 0;
    if (averageFps >= 46) return;

    this.quality = this.quality === "high" ? "medium" : "low";
    this.resize();
    this.rebuild();
  }

  private onPointer = (event: PointerEvent): void => {
    if (this.reducedMotion) return;
    this.pointer.set(
      (event.clientX / innerWidth) * 2 - 1,
      -(event.clientY / innerHeight) * 2 + 1,
    );
  };

  private onResize = (): void => {
    cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = requestAnimationFrame(() => {
      this.resize();
      this.rebuild();
      this.start();
    });
  };

  private onVisibility = (): void => {
    if (!document.hidden) this.start();
  };

  private onReducedMotion = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches;
    this.start();
  };

  private onThemeChange = (): void => {
    const nextTheme = currentTheme();
    if (nextTheme === this.theme) return;
    this.theme = nextTheme;
    this.rebuild();
    this.start();
  };

  private onThemeMutation = (): void => {
    this.onThemeChange();
  };

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.host.dataset.failed = "true";
    delete this.host.dataset.ready;
  };

  private onContextRestored = (): void => {
    this.contextLost = false;
    delete this.host.dataset.failed;
    this.resize();
    this.rebuild();
    this.start();
  };

  private addEvents(): void {
    addEventListener("pointermove", this.onPointer, { passive: true });
    addEventListener("resize", this.onResize, { passive: true });
    addEventListener("themechange", this.onThemeChange);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.reducedMotionQuery.addEventListener("change", this.onReducedMotion);
    this.renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);
    this.renderer.domElement.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.resizeFrame);
    removeEventListener("pointermove", this.onPointer);
    removeEventListener("resize", this.onResize);
    removeEventListener("themechange", this.onThemeChange);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.reducedMotionQuery.removeEventListener("change", this.onReducedMotion);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.renderer.domElement.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.themeObserver.disconnect();
    this.disposeSceneObjects();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
