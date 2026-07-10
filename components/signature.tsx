"use client";

import { RotateCcw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  signaturePaths,
  signatureViewBox,
} from "@/lib/signature-paths";

// Listen for the OS "reduce motion" setting so we can skip the draw-on effect.
function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInViewport(node: Element) {
  const rect = node.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export function Signature() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const hasAutoPlayedRef = useRef(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const preparePaths = useCallback(
    (hideStrokes: boolean) => {
      pathRefs.current.forEach((path) => {
        if (!path) return;

        const length = path.getTotalLength();
        if (length <= 0) return;

        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset =
          hideStrokes && !prefersReducedMotion ? `${length}` : "0";
        path.style.animation = "none";
      });
    },
    [prefersReducedMotion],
  );

  const playAnimation = useCallback(() => {
    preparePaths(!prefersReducedMotion);

    if (prefersReducedMotion) return;

    // Reset styles so the browser will replay keyframes on demand.
    void svgRef.current?.getBoundingClientRect();

    pathRefs.current.forEach((path, index) => {
      if (!path) return;

      const length = path.getTotalLength();
      if (length <= 0) return;

      const duration = Math.min(420, Math.max(60, length * 1.8));
      const delay = index * 14;

      path.style.animation = `signature-draw ${duration}ms ease forwards`;
      path.style.animationDelay = `${delay}ms`;
    });
  }, [prefersReducedMotion, preparePaths]);

  const replay = useCallback(() => {
    playAnimation();
  }, [playAnimation]);

  // Draw once when the signature first comes into view.
  useEffect(() => {
    preparePaths(!prefersReducedMotion);

    if (prefersReducedMotion) {
      playAnimation();
      return;
    }

    const node = svgRef.current;
    if (!node) return;

    const beginAutoPlay = () => {
      if (hasAutoPlayedRef.current) return;
      hasAutoPlayedRef.current = true;
      playAnimation();
    };

    if (isInViewport(node)) {
      beginAutoPlay();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          beginAutoPlay();
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);

    const fallback = window.setTimeout(() => {
      beginAutoPlay();
      observer.disconnect();
    }, 800);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [prefersReducedMotion, playAnimation, preparePaths]);

  return (
    <div className="ml-auto flex w-80 max-w-full flex-col items-end gap-2">
      <svg
        ref={svgRef}
        viewBox={signatureViewBox}
        role="img"
        aria-label="Stephen Lajuwomi signature"
        className="signature-svg block h-auto w-full text-stone-700 dark:text-stone-300"
      >
        {signaturePaths.map((path, index) => (
          <path
            key={`${index}-${path.d.slice(0, 12)}`}
            ref={(element) => {
              pathRefs.current[index] = element;
            }}
            d={path.d}
            className="signature-path"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={path.strokeWidth}
          />
        ))}
      </svg>

      <button
        type="button"
        onClick={replay}
        aria-label="Replay signature animation"
        title="Replay signature"
        className="rounded-md p-1.5 text-stone-500 transition-transform hover:scale-110 hover:text-stone-800 active:scale-95 dark:hover:text-stone-200"
      >
        <RotateCcw size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
