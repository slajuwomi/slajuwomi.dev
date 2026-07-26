"use client";

import { GrainGradient } from "@paper-design/shaders-react";

/** Paper Design grain gradient (corners) with a maroon-to-light ring palette. */
export function GrainGradientBackground() {
  return (
    <div className="grain-gradient-background" aria-hidden="true">
      <GrainGradient
        colorBack="#000000"
        colors={["#3d0810", "#7a1528", "#c45c6a", "#e8b0b8"]}
        shape="corners"
        softness={0.5}
        intensity={0.5}
        noise={0.25}
        speed={1}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
