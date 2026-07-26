"use client";

import LiquidEther from "@/components/liquid-ether";

/** React Bits Liquid Ether with a calming blue palette. */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        colors={["#1A6FA8", "#4EB3E0", "#B8E6F8"]}
        mouseForce={22}
        cursorSize={140}
        isViscous={false}
        resolution={0.55}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.4}
        takeoverDuration={0.25}
        autoResumeDelay={900}
        autoRampDuration={0.5}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
