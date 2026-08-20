"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LiquidEther = dynamic(() => import("@/components/liquid-ether"), {
  ssr: false,
});

/** React Bits Liquid Ether with the tuned viscous gold palette. */
export function LiquidEtherBackground() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const startWhenIdle = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setIsReady(true), {
          timeout: 1_500,
        });
      } else {
        timeoutId = setTimeout(() => setIsReady(true), 1_500);
      }
    };

    if (document.readyState === "complete") {
      startWhenIdle();
    } else {
      window.addEventListener("load", startWhenIdle, { once: true });
    }

    return () => {
      window.removeEventListener("load", startWhenIdle);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="liquid-ether-background" aria-hidden="true">
      {isReady ? (
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
      ) : null}
    </div>
  );
}
