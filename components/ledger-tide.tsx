"use client";

import { useEffect, useRef } from "react";

type LedgerTideProps = {
  placement: "header" | "footer";
};

const vertexShaderSource = `#version 300 es
in vec2 position;
out vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 resolution;
uniform float time;
uniform float hover;
uniform float placement;
uniform vec3 paper;
uniform vec3 paperRaised;
uniform vec3 accent;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float inkField(vec2 p, float layer) {
  vec2 baseCell = floor(p);
  float field = 0.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 cell = baseCell + vec2(float(x), float(y));
      float random = hash(cell + layer * 19.7);
      vec2 center = cell + vec2(
        0.18 + 0.64 * random,
        0.28 + 0.44 * hash(cell + layer * 31.1)
      );
      center.x += sin(time * (0.12 + layer * 0.035) + random * 6.283) * 0.10;
      center.y += cos(time * (0.09 + layer * 0.025) + random * 4.7) * 0.06;

      vec2 delta = p - center;
      delta.x *= 0.72;
      float radius = 0.24 + random * 0.18;
      float falloff = max(0.0, 1.0 - dot(delta, delta) / radius);
      field += falloff * falloff * falloff;
    }
  }

  return field;
}

void main() {
  vec2 uv = vUv;
  float aspect = resolution.x / max(resolution.y, 1.0);
  float edgeY = placement < 0.5 ? uv.y : 1.0 - uv.y;

  // Snap the field into ledger-height shelves before applying slow domain drift.
  float shelfY = floor(edgeY * 22.0) / 22.0;
  vec2 domain = vec2(uv.x * (7.2 + aspect * 0.35), shelfY * 3.15);
  float warp = valueNoise(vec2(domain.x * 0.42, time * 0.035 + placement * 9.0));
  domain.x += (warp - 0.5) * 0.46;
  domain.y += (valueNoise(vec2(domain.x * 0.27, time * 0.026)) - 0.5) * 0.20;

  float slowInk = inkField(domain, 1.0);
  float quickInk = inkField(domain * vec2(1.08, 1.0) + vec2(2.7, 0.15), 2.0);

  // A stepped tide line makes the field collect into rows rather than float freely.
  float tideLine = 1.42 + (valueNoise(vec2(domain.x * 0.34, time * 0.022)) - 0.5) * 0.72;
  float pooled = smoothstep(0.12, -0.08, domain.y - tideLine) * 0.58;
  float field = slowInk * 0.78 + quickInk * 0.42 + pooled;

  float body = smoothstep(0.54, 0.64, field);
  float inner = smoothstep(0.73, 0.90, field);
  float ledgerLine = 1.0 - smoothstep(0.025, 0.085, abs(fract(edgeY * 22.0) - 0.5));
  float edgeFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x);
  edgeFade *= smoothstep(0.02, 0.18, edgeY) * smoothstep(0.0, 0.18, 1.0 - edgeY);

  float stagger = smoothstep(0.28, 0.82, hover + valueNoise(domain * 0.31) - 0.5);
  vec3 quietInk = mix(paperRaised, accent, 0.28 + ledgerLine * 0.12);
  vec3 activeInk = mix(quietInk, accent, 0.42 + stagger * 0.34);
  vec3 color = mix(quietInk, activeInk, hover);
  color = mix(color, paper, inner * 0.16);

  float alpha = (body * 0.13 + inner * 0.08 + ledgerLine * body * 0.055) * edgeFade;
  alpha *= 0.86 + hover * 0.42;
  outColor = vec4(color, alpha);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create a WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function readColor(styles: CSSStyleDeclaration, name: string) {
  const value = styles.getPropertyValue(name).trim();
  const shortHex = /^#([\da-f])([\da-f])([\da-f])$/i.exec(value);
  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value);
  const rgb = /^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/.exec(value);

  const channels = shortHex
    ? shortHex.slice(1).map((channel) => Number.parseInt(`${channel}${channel}`, 16))
    : hex
      ? hex.slice(1).map((channel) => Number.parseInt(channel, 16))
      : rgb
        ? rgb.slice(1).map(Number)
        : [0, 0, 0];

  return new Float32Array(channels.map((channel) => channel / 255));
}

export function LedgerTide({ placement }: LedgerTideProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    });
    if (!gl) {
      host.dataset.webgl = "unavailable";
      return;
    }

    let program: WebGLProgram | null = null;
    let frame = 0;
    let visible = false;
    let disposed = false;
    let hoverTarget = 0;
    let hoverValue = 0;
    let lastRender = 0;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const frameInterval = 1000 / (coarsePointer ? 20 : 30);
    const startedAt = performance.now();

    try {
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      );
      program = gl.createProgram();
      if (!program) throw new Error("Could not create the WebGL program.");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Shader linking failed.");
      }
    } catch (error) {
      host.dataset.webgl = "failed";
      console.warn("The ledger tide background could not start.", error);
      if (program) gl.deleteProgram(program);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "position");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const timeLocation = gl.getUniformLocation(program, "time");
    const hoverLocation = gl.getUniformLocation(program, "hover");
    const placementLocation = gl.getUniformLocation(program, "placement");
    const paperLocation = gl.getUniformLocation(program, "paper");
    const raisedLocation = gl.getUniformLocation(program, "paperRaised");
    const accentLocation = gl.getUniformLocation(program, "accent");
    const buffer = gl.createBuffer();
    const styles = getComputedStyle(document.documentElement);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(placementLocation, placement === "header" ? 0 : 1);
    gl.uniform3fv(paperLocation, readColor(styles, "--color-paper"));
    gl.uniform3fv(raisedLocation, readColor(styles, "--color-paper-2"));
    gl.uniform3fv(accentLocation, readColor(styles, "--color-accent"));
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, coarsePointer ? 1 : 1.5);
      const scale = coarsePointer ? 0.7 : 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr * scale));
      canvas.height = Math.max(1, Math.round(rect.height * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.visibilityState !== "visible") return;

      if (now - lastRender >= frameInterval) {
        lastRender = now;
        hoverValue += (hoverTarget - hoverValue) * 0.08;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, (now - startedAt) / 1000);
        gl.uniform1f(hoverLocation, hoverValue);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      frame = requestAnimationFrame(render);
    };

    const syncAnimation = () => {
      const shouldRun = visible && document.visibilityState === "visible";
      if (shouldRun && frame === 0) frame = requestAnimationFrame(render);
      if (!shouldRun && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onPointerEnter = () => {
      hoverTarget = 1;
    };
    const onPointerLeave = () => {
      hoverTarget = 0;
    };
    const onVisibilityChange = () => syncAnimation();
    const onContextLost = (event: Event) => {
      event.preventDefault();
      visible = false;
      syncAnimation();
      host.dataset.webgl = "lost";
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    host.parentElement?.addEventListener("pointerenter", onPointerEnter);
    host.parentElement?.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    resize();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.parentElement?.removeEventListener("pointerenter", onPointerEnter);
      host.parentElement?.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [placement]);

  return (
    <span className={`ledger-tide ledger-tide--${placement}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </span>
  );
}
