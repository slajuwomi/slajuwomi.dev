"use client";

import { Signature } from "@/components/signature";

// Client boundary so the signature can measure SVG paths in the browser.
export function AnimatedSignature() {
  return <Signature />;
}
