"use client";

import { GrainGradient } from "@paper-design/shaders-react";

/** Paper Design grain gradient (wave) with a maroon palette and diagonal rotation. */
export function GrainGradientBackground() {
  return (
    <div className="grain-gradient-background" aria-hidden="true">
      <GrainGradient
        colorBack="#0a0508"
        colors={["#8b1a28", "#a85860", "#d4a8a8"]}
        shape="wave"
        softness={0.7}
        intensity={0.15}
        noise={0.5}
        speed={0.94}
        scale={1}
        rotation={232}
        style={{ width: "100%", height: "100%", opacity: 0.8 }}
      />
    </div>
  );
}
