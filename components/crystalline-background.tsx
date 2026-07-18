"use client";

import { useEffect, useRef } from "react";

export function CrystallineBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: { dispose: () => void } | undefined;

    void import("@/lib/crystalline-background/renderer")
      .then(({ CrystallineBackgroundRenderer }) => {
        if (disposed) return;
        renderer = new CrystallineBackgroundRenderer(host);
      })
      .catch((error: unknown) => {
        host.dataset.failed = "true";
        console.warn("The crystalline background could not start.", error);
      });

    return () => {
      disposed = true;
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="crystalline-background"
      aria-hidden="true"
    />
  );
}
