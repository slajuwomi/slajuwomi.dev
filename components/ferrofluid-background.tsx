"use client";

import Ferrofluid from "@/components/ferrofluid/Ferrofluid";

export function FerrofluidBackground() {
  return (
    <div className="ferrofluid-background" aria-hidden="true">
      <Ferrofluid
        colors={["#ffffff", "#ffffff", "#c42323"]}
        spikeHeight={1}
        sharpness={2.5}
        tilt={48}
        mouseInteraction
        clickPulse
      />
    </div>
  );
}
