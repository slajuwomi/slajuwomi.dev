"use client";

import { GrainGradient } from "@paper-design/shaders-react";

/** Paper Design grain gradient (wave) with a maroon palette and diagonal rotation. */
export function GrainGradientBackground() {
  return (
    <div className="grain-gradient-background" aria-hidden="true">
      <GrainGradient
        colorBack="#050203"
        colors={["#4a1018", "#6b2430", "#7e3844"]}
        shape="wave"
        softness={0.7}
        intensity={0.15}
        noise={0.5}
        speed={0.94}
        scale={1}
        rotation={232}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
