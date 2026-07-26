"use client";

import { GrainGradient } from "@paper-design/shaders-react";

/** Paper Design grain gradient (corners) with a maroon-to-light ring palette. */
export function GrainGradientBackground() {
  return (
    <div className="grain-gradient-background" aria-hidden="true">
      <GrainGradient
        colorBack="#000000"
        colors={["#22050a", "#4a1018", "#6e2834", "#8f4a55"]}
        shape="corners"
        softness={0.5}
        intensity={0.45}
        noise={0.25}
        speed={1}
        style={{ width: "100%", height: "100%", opacity: 0.55 }}
      />
    </div>
  );
}
