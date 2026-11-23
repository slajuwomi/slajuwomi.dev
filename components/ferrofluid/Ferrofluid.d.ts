import type { CSSProperties, HTMLAttributes, ReactElement } from "react";

export interface FerrofluidProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  brightness?: number;
  scale?: number;
  spikeHeight?: number;
  sharpness?: number;
  tilt?: number;
  turbulence?: number;
  fluidity?: number;
  speed?: number;
  magnetism?: number;
  variation?: number;
  flowDirection?: "down" | "up" | "left" | "right" | "none";
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  clickPulse?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  transparent?: boolean;
  color?: string;
  opacity?: number;
  paused?: boolean;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare function Ferrofluid(props: FerrofluidProps): ReactElement;
export default Ferrofluid;
