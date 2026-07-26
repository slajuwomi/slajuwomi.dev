"use client";

import LiquidEther from "@/components/liquid-ether";

/** React Bits Liquid Ether with the tuned viscous blue palette. */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        colors={["#1730fd", "#00d7ff", "#561dfa"]}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        isBounce={false}
        resolution={0.5}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
