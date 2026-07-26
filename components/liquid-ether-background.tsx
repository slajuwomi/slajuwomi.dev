"use client";

import LiquidEther from "@/components/liquid-ether";

/** React Bits Liquid Ether with a calming blue palette. */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        colors={["#0A2E4A", "#1B6B8A", "#4AA8C8"]}
        mouseForce={18}
        cursorSize={110}
        isViscous={false}
        resolution={0.5}
        autoDemo
        autoSpeed={0.4}
        autoIntensity={1.8}
        takeoverDuration={0.25}
        autoResumeDelay={1200}
        autoRampDuration={0.6}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
