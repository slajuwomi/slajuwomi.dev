import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { buildComposition, type CubeRecord } from "./composition";
import { resolvedQuality, type SceneConfig } from "./config";

const colors = {
  cyan: new THREE.Color("#00bfff"),
  magenta: new THREE.Color("#ff2acb"),
  orange: new THREE.Color("#ff6a20"),
};

type MeshSet = {
  root: THREE.Group;
  solids: THREE.InstancedMesh;
  shells: THREE.InstancedMesh;
  wires: THREE.InstancedMesh;
  glows: THREE.InstancedMesh[];
  records: CubeRecord[];
};

export class CrystallineScene {
  private host: HTMLElement;
  private config: SceneConfig;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(43, 1, 0.1, 80);
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private meshSet?: MeshSet;
  private particles?: THREE.Points;
  private raf = 0;
  private lastTime = performance.now();
  private pointer = new THREE.Vector2();
  private smoothPointer = new THREE.Vector2();
  private paused = false;
  private reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private frames = 0;
  private fpsStart = performance.now();
  private fpsCallback: (fps: number) => void = () => undefined;

  constructor(host: HTMLElement, config: SceneConfig) {
    this.host = host;
    this.config = { ...config };
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.94;
    this.host.append(this.renderer.domElement);
    this.scene.background = new THREE.Color("#01050d");
    this.scene.fog = new THREE.FogExp2("#031020", this.config.fog);
    this.camera.position.set(0, 0, 17);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), this.config.glow, 0.55, 0.34);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloom);

    this.addLighting();
    this.resize();
    this.rebuild();
    this.addEvents();
    this.tick(performance.now());
  }

  onFps(callback: (fps: number) => void): void {
    this.fpsCallback = callback;
  }

  private qualitySettings(): { scale: number; dpr: number; particles: number } {
    const quality = resolvedQuality(this.config.quality);
    if (quality === "high") return { scale: 1, dpr: 1.65, particles: 560 };
    if (quality === "medium") return { scale: 0.72, dpr: 1.25, particles: 330 };
    return { scale: 0.44, dpr: 1, particles: 150 };
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight("#35bff3", "#010205", 0.72));
    const cyan = new THREE.PointLight("#00aaff", 48, 37, 1.7);
    cyan.position.set(7, 6, 8);
    const magenta = new THREE.PointLight("#ff20cf", 32, 28, 1.8);
    magenta.position.set(-8, 5, 6);
    const orange = new THREE.PointLight("#ff5b18", 29, 25, 1.9);
    orange.position.set(-8, -6, 5);
    this.scene.add(cyan, magenta, orange);
  }

  private makeMesh(
    geometry: THREE.BoxGeometry,
    material: THREE.Material,
    records: CubeRecord[],
    filter: (record: CubeRecord) => boolean,
    instanceScale = 1,
  ): THREE.InstancedMesh {
    const selected = records.filter(filter);
    const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, selected.length));
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    selected.forEach((record, index) => {
      quaternion.setFromEuler(record.rotation);
      matrix.compose(record.position, quaternion, record.scale.clone().multiplyScalar(instanceScale));
      mesh.setMatrixAt(index, matrix);
    });
    mesh.count = selected.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
  }

  private rebuild(): void {
    if (this.meshSet) {
      this.scene.remove(this.meshSet.root);
      this.meshSet.root.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    }
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }

    const settings = this.qualitySettings();
    const records = buildComposition(this.config, this.camera.aspect, settings.scale);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const root = new THREE.Group();
    const variant = this.config.variant;

    const solidMaterial = new THREE.MeshBasicMaterial({
      color: variant === "monolith" ? "#050b14" : "#061a2b",
    });
    solidMaterial.color.multiplyScalar(variant === "wireframe" ? 0.55 : 1);
    const solids = this.makeMesh(geometry, solidMaterial, records, () => true);

    const shellMaterial = new THREE.MeshBasicMaterial({
      color: "#087aad",
      transparent: true,
      opacity: variant === "crystal" ? 0.1 : 0.04,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const shells = this.makeMesh(geometry, shellMaterial, records, (record) => record.shell, 1.035);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: "#0cbcff",
      wireframe: true,
      transparent: true,
      opacity: variant === "wireframe" ? 0.42 : variant === "crystal" ? 0.1 : 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wires = this.makeMesh(geometry, wireMaterial, records, (record) => record.shell || record.bright, 1.07);

    const glows = (["cyan", "magenta", "orange"] as const).map((color) => {
      const material = new THREE.MeshBasicMaterial({
        color: colors[color],
        transparent: true,
        opacity: variant === "monolith" ? 0.18 : 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });
      const mesh = this.makeMesh(
        geometry,
        material,
        records,
        (record) => record.bright && record.color === color,
        variant === "wireframe" ? 0.18 : 0.56,
      );
      mesh.renderOrder = 3;
      return mesh;
    });

    root.add(solids, shells, wires, ...glows);
    this.scene.add(root);
    this.meshSet = { root, solids, shells, wires, glows, records };
    this.addParticles(settings.particles);
    this.applyLiveSettings();
  }

  private addParticles(count: number): void {
    const positions = new Float32Array(count * 3);
    const colorsArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const side = Math.random() > 0.5 ? 1 : -1;
      positions[i * 3] = side * (4 + Math.random() * 11);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const color = Math.random() > 0.76 ? colors.magenta : colors.cyan;
      colorsArray.set(color.toArray(), i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));
    const material = new THREE.PointsMaterial({
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private applyLiveSettings(): void {
    this.bloom.strength = this.config.glow;
    if (this.scene.fog instanceof THREE.FogExp2) this.scene.fog.density = this.config.fog;
    if (this.meshSet) {
      const shell = this.meshSet.shells.material as THREE.MeshBasicMaterial;
      shell.opacity = this.config.variant === "crystal" ? 0.1 : 0.04;
      this.meshSet.glows.forEach((mesh) => {
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.62, 0.12 + this.config.glow * 0.14);
      });
    }
  }

  updateConfig(next: SceneConfig, structural = false): void {
    const qualityChanged = next.quality !== this.config.quality;
    const variantChanged = next.variant !== this.config.variant;
    this.config = { ...next };
    if (structural || qualityChanged || variantChanged) this.rebuild();
    else this.applyLiveSettings();
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
  }

  private resize = (): void => {
    const width = innerWidth;
    const height = innerHeight;
    const settings = this.qualitySettings();
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, settings.dpr));
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
  };

  private onPointer = (event: PointerEvent): void => {
    this.pointer.set((event.clientX / innerWidth) * 2 - 1, -(event.clientY / innerHeight) * 2 + 1);
  };

  private addEvents(): void {
    addEventListener("resize", () => {
      this.resize();
      this.rebuild();
    });
    addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", () => {
      this.lastTime = performance.now();
    });
  }

  private tick = (now: number): void => {
    this.raf = requestAnimationFrame(this.tick);
    if (document.hidden) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const animate = !this.reducedMotion && !this.paused;
    const motion = animate ? this.config.motion : 0;

    this.smoothPointer.lerp(this.pointer, 1 - Math.exp(-dt * 2.4));
    const pointerStrength = this.config.pointer * (innerWidth < 700 ? 0.25 : 1);
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.smoothPointer.x * pointerStrength, 1 - Math.exp(-dt * 2.3));
    this.camera.position.y = THREE.MathUtils.lerp(
      this.camera.position.y,
      this.smoothPointer.y * pointerStrength * 0.6 - scrollY * 0.00024,
      1 - Math.exp(-dt * 2.3),
    );
    this.camera.lookAt(0, 0, 0);

    if (this.meshSet) {
      const time = now * 0.001;
      this.meshSet.root.rotation.y = this.smoothPointer.x * 0.012 + Math.sin(time * 0.08) * 0.006 * motion;
      this.meshSet.root.rotation.x = -this.smoothPointer.y * 0.008;
      const breath = 1 + Math.sin(time * 0.22) * 0.004 * motion;
      this.meshSet.solids.scale.setScalar(breath);
      this.meshSet.glows.forEach((mesh, index) => {
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = Math.min(0.65, 0.12 + this.config.glow * 0.14 + Math.sin(time * (0.25 + index * 0.03) + index * 2) * 0.045 * motion);
      });
    }
    if (this.particles) {
      this.particles.rotation.z += dt * 0.003 * motion;
      this.particles.position.y = Math.sin(now * 0.00007) * 0.16 * motion;
    }

    this.composer.render();
    this.frames += 1;
    if (now - this.fpsStart > 700) {
      this.fpsCallback(Math.round((this.frames * 1000) / (now - this.fpsStart)));
      this.frames = 0;
      this.fpsStart = now;
    }
  };

  dispose(): void {
    cancelAnimationFrame(this.raf);
    removeEventListener("pointermove", this.onPointer);
    this.renderer.dispose();
    this.composer.dispose();
  }
}
