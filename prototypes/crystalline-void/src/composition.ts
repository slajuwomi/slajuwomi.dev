import * as THREE from "three";
import type { SceneConfig } from "./config";

export type CubeRecord = {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  color: "cyan" | "magenta" | "orange";
  shell: boolean;
  bright: boolean;
  phase: number;
};

function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFactory(seed: string): () => number {
  let value = hashSeed(seed);
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function bell(random: () => number): number {
  return random() + random() + random() - 1.5;
}

export function buildComposition(
  config: SceneConfig,
  aspect: number,
  qualityScale: number,
): CubeRecord[] {
  const random = randomFactory(`${config.seed}:${config.variant}`);
  const mobile = aspect < 0.8;
  const halfH = 7.2;
  const halfW = mobile ? halfH * aspect : Math.max(8.2, halfH * aspect);
  const baseCount = mobile ? 440 : 1080;
  const variantDensity = config.variant === "monolith" ? 0.68 : config.variant === "wireframe" ? 0.88 : 1;
  const count = Math.round(baseCount * config.density * qualityScale * variantDensity);
  const edgeX = halfW * (mobile ? 0.82 : 0.68);
  const safeHalf = (mobile ? 1.72 : 5.05) * config.safeZone;
  const anchors = [
    { x: -edgeX, y: halfH * 0.78, color: "magenta" as const, spreadX: 0.2, spreadY: 0.33 },
    { x: -halfW * 0.8, y: 0, color: "cyan" as const, spreadX: 0.15, spreadY: 0.48 },
    { x: -edgeX, y: -halfH * 0.8, color: "orange" as const, spreadX: 0.2, spreadY: 0.3 },
    { x: edgeX, y: halfH * 0.86, color: "cyan" as const, spreadX: 0.21, spreadY: 0.34 },
    { x: halfW * 0.8, y: halfH * 0.08, color: "magenta" as const, spreadX: 0.15, spreadY: 0.47 },
    { x: edgeX, y: -halfH * 0.68, color: "cyan" as const, spreadX: 0.2, spreadY: 0.36 },
  ];

  const records: CubeRecord[] = [];
  for (let i = 0; i < count; i += 1) {
    const anchor = anchors[Math.floor(random() * anchors.length)];
    const unit = config.variant === "monolith" ? 0.58 : 0.38;
    const tier = random();
    const size = unit * (tier > 0.96 ? 4.3 : tier > 0.78 ? 2.25 : tier > 0.32 ? 1.22 : 0.68);
    let x = anchor.x + bell(random) * halfW * anchor.spreadX;
    let y = anchor.y + bell(random) * halfH * anchor.spreadY;
    x = Math.round(x / unit) * unit;
    y = Math.round(y / unit) * unit;

    const inReadingVoid = mobile
      ? Math.abs(y) < halfH * 0.68
      : Math.abs(x) < safeHalf + size && Math.abs(y) < halfH * 0.82;
    if (inReadingVoid && (mobile || random() > 0.055)) continue;

    const colorRoll = random();
    let color = anchor.color;
    if (colorRoll < 0.63) color = "cyan";
    else if (colorRoll > 0.91) color = "orange";
    else if (anchor.color !== "cyan") color = anchor.color;

    records.push({
      position: new THREE.Vector3(x, y, bell(random) * 5.5 - Math.abs(x / halfW) * 0.8),
      scale: new THREE.Vector3(
        size * (0.78 + random() * 0.55),
        size * (0.78 + random() * 0.55),
        size * (0.8 + random() * 1.15),
      ),
      rotation: new THREE.Euler(
        -0.16 + (random() - 0.5) * 0.055,
        -0.24 + (random() - 0.5) * 0.065,
        (random() - 0.5) * 0.018,
      ),
      color,
      shell: random() > (config.variant === "crystal" ? 0.46 : 0.78),
      bright: random() > 0.62,
      phase: random() * Math.PI * 2,
    });
  }

  const detached = Math.round((mobile ? 8 : 40) * qualityScale);
  for (let i = 0; i < detached; i += 1) {
    const side = random() > 0.5 ? 1 : -1;
    const x = side * (safeHalf + random() * Math.max(1, halfW - safeHalf));
    records.push({
      position: new THREE.Vector3(x, (random() - 0.5) * halfH * 1.75, (random() - 0.5) * 6),
      scale: new THREE.Vector3(0.12 + random() * 0.24, 0.12 + random() * 0.24, 0.12 + random() * 0.24),
      rotation: new THREE.Euler(random(), random(), random()),
      color: random() > 0.82 ? "magenta" : "cyan",
      shell: true,
      bright: random() > 0.45,
      phase: random() * Math.PI * 2,
    });
  }
  return records;
}
