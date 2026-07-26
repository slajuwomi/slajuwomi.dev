"use client";

import LiquidEther from "@/components/liquid-ether";

/** React Bits Liquid Ether with the tuned viscous gold palette. */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether-background" aria-hidden="true">
      <LiquidEther
        mouseForce={23}
        cursorSize={90}
        isViscous
        viscous={25}
        colors={["#cc9b03", "#ffd85d", "#9a9000"]}
        autoDemo
        autoSpeed={1.2}
        autoIntensity={4.3}
        isBounce={false}
        resolution={0.5}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
