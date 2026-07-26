"use client";

import LiquidEther from "@/components/liquid-ether";

/**
 * React Bits Liquid Ether, mounted like Ch3mson/personal-portfolio-v3.
 * Black base with muted blue only in the flowing velocity field.
 */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        colors={["#4A90B8", "#2C5F7A", "#000000"]}
        mouseForce={20}
        cursorSize={100}
        autoDemo
        autoSpeed={0.3}
        autoIntensity={1.5}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
