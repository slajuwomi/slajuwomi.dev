import "./styles.css";
import { CrystallineScene } from "./crystalline-scene";
import { defaults, variants, type SceneConfig, type Variant } from "./config";

// PROTOTYPE QUESTION: Can a seeded crystalline void replace the portfolio's dotted
// background while preserving reading comfort? Treatments switch via ?variant=.

const host = document.querySelector<HTMLElement>("#scene");
if (!host) throw new Error("Scene host missing");

const params = new URLSearchParams(location.search);
const requestedVariant = params.get("variant") as Variant | null;
let config: SceneConfig = {
  ...defaults,
  variant: variants.some((variant) => variant.key === requestedVariant) ? requestedVariant! : defaults.variant,
};
let scene: CrystallineScene | undefined;

try {
  scene = new CrystallineScene(host, config);
  document.body.classList.add("webgl-ready");
} catch (error) {
  console.warn("Crystalline prototype fell back to the static composition.", error);
  document.body.classList.add("webgl-failed");
}

const structuralKeys = new Set(["density", "safeZone"]);
let rebuildTimer = 0;
document.querySelectorAll<HTMLInputElement>("input[data-key]").forEach((input) => {
  input.addEventListener("input", () => {
    const key = input.dataset.key as keyof Pick<SceneConfig, "density" | "safeZone" | "glow" | "fog" | "motion" | "pointer">;
    config = { ...config, [key]: Number(input.value) };
    document.querySelector<HTMLOutputElement>(`[data-output="${key}"]`)!.value = Number(input.value).toFixed(key === "fog" ? 3 : 2);
    clearTimeout(rebuildTimer);
    if (structuralKeys.has(key)) {
      rebuildTimer = window.setTimeout(() => scene?.updateConfig(config, true), 100);
    } else {
      scene?.updateConfig(config);
    }
  });
});

const controls = document.querySelector<HTMLElement>("#controls")!;
const controlsToggle = document.querySelector<HTMLButtonElement>("#controls-toggle")!;
controlsToggle.addEventListener("click", () => {
  const open = controls.classList.toggle("open");
  controlsToggle.setAttribute("aria-expanded", String(open));
  controlsToggle.querySelector("b")!.textContent = open ? "−" : "+";
});

document.querySelector<HTMLSelectElement>("#quality")!.addEventListener("change", (event) => {
  config = { ...config, quality: (event.currentTarget as HTMLSelectElement).value as SceneConfig["quality"] };
  scene?.updateConfig(config, true);
});

function syncControls(): void {
  document.querySelectorAll<HTMLInputElement>("input[data-key]").forEach((input) => {
    const key = input.dataset.key as keyof SceneConfig;
    input.value = String(config[key]);
    const output = document.querySelector<HTMLOutputElement>(`[data-output="${key}"]`);
    if (output) output.value = Number(config[key]).toFixed(key === "fog" ? 3 : 2);
  });
  document.querySelector<HTMLSelectElement>("#quality")!.value = config.quality;
}

document.querySelector<HTMLButtonElement>("#new-seed")!.addEventListener("click", () => {
  config = { ...config, seed: `explore-${Math.random().toString(36).slice(2, 9)}` };
  scene?.updateConfig(config, true);
});

document.querySelector<HTMLButtonElement>("#reset")!.addEventListener("click", () => {
  config = { ...defaults, variant: config.variant };
  syncControls();
  scene?.updateConfig(config, true);
});

let paused = false;
document.querySelector<HTMLButtonElement>("#pause")!.addEventListener("click", (event) => {
  paused = !paused;
  (event.currentTarget as HTMLButtonElement).textContent = paused ? "resume" : "pause";
  scene?.setPaused(paused);
});

document.querySelector<HTMLButtonElement>("#copy-config")!.addEventListener("click", async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
  button.textContent = "copied";
  window.setTimeout(() => (button.textContent = "copy configuration"), 1100);
});

const label = document.querySelector<HTMLElement>("#variant-label")!;
function setVariant(index: number): void {
  const normalized = (index + variants.length) % variants.length;
  const variant = variants[normalized];
  config = { ...config, variant: variant.key };
  label.textContent = variant.label;
  params.set("variant", variant.key);
  history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
  scene?.updateConfig(config, true);
}
function currentVariantIndex(): number {
  return variants.findIndex((variant) => variant.key === config.variant);
}
document.querySelector<HTMLButtonElement>("#variant-prev")!.addEventListener("click", () => setVariant(currentVariantIndex() - 1));
document.querySelector<HTMLButtonElement>("#variant-next")!.addEventListener("click", () => setVariant(currentVariantIndex() + 1));
addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("input, select, textarea, [contenteditable]")) return;
  if (event.key === "ArrowLeft") setVariant(currentVariantIndex() - 1);
  if (event.key === "ArrowRight") setVariant(currentVariantIndex() + 1);
});

label.textContent = variants[currentVariantIndex()].label;
scene?.onFps((fps) => {
  document.querySelector<HTMLOutputElement>("#fps")!.value = `${fps} fps`;
});

addEventListener("beforeunload", () => scene?.dispose());
