"use client";

import LiquidEther from "@/components/liquid-ether";

/**
 * React Bits Liquid Ether, mounted like Ch3mson/personal-portfolio-v3
 * with a calming blue palette and their quieter motion settings.
 */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        colors={["#A8C8D8", "#6B9BB0", "#1A2832"]}
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
