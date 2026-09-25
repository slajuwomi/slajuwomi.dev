"use client";

import { useEffect, useRef } from "react";
import { mountWheatField } from "@/lib/wheat-field/scene";

export function WheatFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountWheatField(canvas, { palette: "gruvbox" });
  }, []);

  return (
    <div className="wheat-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
