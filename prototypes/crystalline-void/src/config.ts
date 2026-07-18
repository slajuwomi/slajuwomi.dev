export type Variant = "crystal" | "monolith" | "wireframe";
export type Quality = "auto" | "high" | "medium" | "low";

export type SceneConfig = {
  seed: string;
  density: number;
  safeZone: number;
  glow: number;
  fog: number;
  motion: number;
  pointer: number;
  quality: Quality;
  variant: Variant;
};

export const variants: { key: Variant; label: string }[] = [
  { key: "crystal", label: "A — Crystal" },
  { key: "monolith", label: "B — Monolith" },
  { key: "wireframe", label: "C — Signal lattice" },
];

export const defaults: SceneConfig = {
  seed: "stephen-crystalline-void-07",
  density: 1,
  safeZone: 1,
  glow: 0.85,
  fog: 0.018,
  motion: 0.55,
  pointer: 0.45,
  quality: "auto",
  variant: "crystal",
};

export function resolvedQuality(requested: Quality): Exclude<Quality, "auto"> {
  if (requested !== "auto") return requested;
  const mobile = matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (mobile || memory <= 4) return "low";
  if (devicePixelRatio > 1.5 || memory <= 8) return "medium";
  return "high";
}
