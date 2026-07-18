import * as THREE from "three";

export type EnergyRole = "moss" | "gold" | "amber";

export type CubeRecord = {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  energy: EnergyRole;
  shell: boolean;
  bright: boolean;
};

export function createSeededRandom(seed: string): () => number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  let value = hash >>> 0;
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
  aspect: number,
  qualityScale: number,
): CubeRecord[] {
  const random = createSeededRandom("slajuwomi-mineral-crystal-01");
  const mobile = aspect < 0.8;
  const halfHeight = 7.2;
  const halfWidth = mobile
    ? halfHeight * aspect
    : Math.max(8.2, halfHeight * aspect);
  const count = Math.round((mobile ? 400 : 920) * qualityScale);
  const edgeX = halfWidth * (mobile ? 0.82 : 0.7);
  const safeHalfWidth = mobile ? 1.75 : 5.2;
  const anchors: Array<{
    x: number;
    y: number;
    energy: EnergyRole;
    spreadX: number;
    spreadY: number;
  }> = [
    { x: -edgeX, y: halfHeight * 0.78, energy: "moss", spreadX: 0.2, spreadY: 0.33 },
    { x: -halfWidth * 0.82, y: 0, energy: "gold", spreadX: 0.15, spreadY: 0.48 },
    { x: -edgeX, y: -halfHeight * 0.8, energy: "amber", spreadX: 0.2, spreadY: 0.3 },
    { x: edgeX, y: halfHeight * 0.86, energy: "moss", spreadX: 0.21, spreadY: 0.34 },
    { x: halfWidth * 0.82, y: halfHeight * 0.08, energy: "gold", spreadX: 0.15, spreadY: 0.47 },
    { x: edgeX, y: -halfHeight * 0.68, energy: "moss", spreadX: 0.2, spreadY: 0.36 },
  ];

  const records: CubeRecord[] = [];
  const unit = 0.4;

  for (let index = 0; index < count; index += 1) {
    const anchor = anchors[Math.floor(random() * anchors.length)];
    const tier = random();
    const size = unit * (
      tier > 0.965 ? 4.1 : tier > 0.8 ? 2.1 : tier > 0.34 ? 1.18 : 0.66
    );
    let x = anchor.x + bell(random) * halfWidth * anchor.spreadX;
    let y = anchor.y + bell(random) * halfHeight * anchor.spreadY;
    x = Math.round(x / unit) * unit;
    y = Math.round(y / unit) * unit;

    const inReadingVoid = mobile
      ? Math.abs(y) < halfHeight * 0.69
      : Math.abs(x) < safeHalfWidth + size && Math.abs(y) < halfHeight * 0.84;
    if (inReadingVoid && (mobile || random() > 0.03)) continue;

    const roleRoll = random();
    const energy: EnergyRole = roleRoll < 0.74
      ? "moss"
      : roleRoll < 0.94
        ? "gold"
        : "amber";

    records.push({
      position: new THREE.Vector3(
        x,
        y,
        bell(random) * 5.2 - Math.abs(x / halfWidth) * 0.8,
      ),
      scale: new THREE.Vector3(
        size * (0.8 + random() * 0.5),
        size * (0.8 + random() * 0.5),
        size * (0.85 + random() * 1.05),
      ),
      rotation: new THREE.Euler(
        -0.16 + (random() - 0.5) * 0.05,
        -0.24 + (random() - 0.5) * 0.06,
        (random() - 0.5) * 0.018,
      ),
      energy: anchor.energy === "amber" && roleRoll > 0.55 ? "amber" : energy,
      shell: random() > 0.5,
      bright: random() > 0.7,
    });
  }

  const detachedCount = Math.round((mobile ? 6 : 34) * qualityScale);
  for (let index = 0; index < detachedCount; index += 1) {
    const side = random() > 0.5 ? 1 : -1;
    const x = side * (
      safeHalfWidth + random() * Math.max(0.5, halfWidth - safeHalfWidth)
    );
    const size = 0.1 + random() * 0.22;
    records.push({
      position: new THREE.Vector3(
        x,
        (random() - 0.5) * halfHeight * 1.7,
        (random() - 0.5) * 5.5,
      ),
      scale: new THREE.Vector3(size, size, size),
      rotation: new THREE.Euler(random(), random(), random()),
      energy: random() > 0.82 ? "gold" : "moss",
      shell: true,
      bright: random() > 0.55,
    });
  }

  return records;
}
