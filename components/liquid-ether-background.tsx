"use client";

import { useSyncExternalStore } from "react";
import LiquidEther from "@/components/liquid-ether";

/** Soft blue on black — visible without washing the canvas. */
const darkColors = ["#6EB6D9", "#3D8FB5", "#0A0A0A"];
/** Deeper blue on the cream light canvas. */
const lightColors = ["#5B9FBF", "#3D7A9A", "#2A5568"];

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("themechange", onStoreChange);
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    window.removeEventListener("themechange", onStoreChange);
    observer.disconnect();
  };
}

/**
 * React Bits Liquid Ether, mounted like Ch3mson/personal-portfolio-v3.
 * Black (dark) / cream (light) base with blue only in the flowing field.
 */
export function LiquidEtherBackground() {
  const isDark = useSyncExternalStore(subscribeTheme, getIsDark, () => true);

  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        key={isDark ? "dark" : "light"}
        colors={isDark ? darkColors : lightColors}
        mouseForce={20}
        cursorSize={100}
        autoDemo
        autoSpeed={0.3}
        autoIntensity={1.8}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
