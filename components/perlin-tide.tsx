"use client";

import { useEffect, useRef } from "react";

const vertexSource = `#version 300 es
in vec2 position;
out vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`;

// Selected in /shader-picker.html: speed .9, contrast .8, density 4,
// proportion .42, softness .11, octaves 3, persistence .5, lacunarity 2,
// scale 1, rotation 127 degrees, retreat .4. Colors: #282828 / #fabd2f.
const fragmentSource = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 color;
uniform vec2 resolution;
uniform float time;
uniform float placement;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
vec3 gradient(vec3 cell){
  vec3 h=fract(sin(vec3(dot(cell,vec3(127.1,311.7,74.7)),dot(cell,vec3(269.5,183.3,246.1)),dot(cell,vec3(113.5,271.9,124.6))))*43758.5453)*2.-1.;
  return h*inversesqrt(max(dot(h,h),.0001));
}
float perlin(vec3 p){
  vec3 cell=floor(p),f=fract(p),fade=f*f*f*(f*(f*6.-15.)+10.);
  float result=0.;
  for(int z=0;z<2;z++){for(int y=0;y<2;y++){for(int x=0;x<2;x++){
    vec3 corner=vec3(float(x),float(y),float(z));
    vec3 weight=mix(1.-fade,fade,corner);
    result+=dot(gradient(cell+corner),f-corner)*weight.x*weight.y*weight.z;
  }}}
  return result;
}
void main(){
  vec2 bandUv=vec2(uv.x,placement<.5?uv.y:1.-uv.y);
  float aspect=resolution.x/max(resolution.y,1.);
  vec2 p=vec2(bandUv.x*aspect,bandUv.y)*2.3;
  float angle=radians(127.);
  vec2 domain=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*(p-vec2(aspect,1.)*1.15)*4.;
  vec3 samplePoint=vec3(domain+vec2(8.3,2.7),time*.22+4.2);
  float sum=0.,weight=1.,total=0.;
  for(int octave=0;octave<3;octave++){
    float footprint=max(length(dFdx(samplePoint.xy)),length(dFdy(samplePoint.xy)));
    float detail=1.-smoothstep(.35,1.,footprint);
    sum+=perlin(samplePoint)*weight*detail;
    total+=weight;
    samplePoint=samplePoint*2.+vec3(17.1,9.2,3.4);
    weight*=.5;
  }
  float field=.5+sum/total*1.5;
  float coast=.4*(.65+.35*noise(vec2(bandUv.x*aspect*1.5,time*.08)));
  float withdrawal=1.-smoothstep(.015,coast,bandUv.y);
  float feather=.11*.25;
  float shape=smoothstep(.58-feather,.58+feather,field-withdrawal);
  shape*=smoothstep(0.,.025,bandUv.y);
  // Transparent charcoal areas inherit the page background exactly. With blending
  // disabled, browser compositing produces the picker's .8 contrast mix once.
  color=vec4(vec3(250.,189.,47.)/255.,shape*.8);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message ?? "Shader compilation failed");
  }
  return shader;
}

export function PerlinTide({ placement }: { placement: "header" | "footer" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const forced = matchMedia("(forced-colors: active)");
    let stop: (() => void) | undefined;

    const start = () => {
      stop?.();
      stop = undefined;
      if (reduced.matches || forced.matches) return;
      const gl = canvas.getContext("webgl2", {
        alpha: true, antialias: false, depth: false,
        powerPreference: "low-power", premultipliedAlpha: false,
      });
      if (!gl) { host.dataset.webgl = "unavailable"; return; }
      const shaders: WebGLShader[] = [];
      const program = gl.createProgram();
      const buffer = gl.createBuffer();
      const release = () => {
        shaders.forEach(shader => gl.deleteShader(shader));
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
      try {
        if (!program || !buffer) throw new Error("Could not allocate WebGL resources");
        shaders.push(compile(gl, gl.VERTEX_SHADER, vertexSource));
        shaders.push(compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
        shaders.forEach(shader => gl.attachShader(program, shader));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) ?? "Shader linking failed");
        }
      } catch (error) {
        release();
        host.dataset.webgl = "failed";
        console.warn("The Perlin background could not start.", error);
        return;
      }
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const resolution = gl.getUniformLocation(program, "resolution");
      const timeUniform = gl.getUniformLocation(program, "time");
      gl.uniform1f(gl.getUniformLocation(program, "placement"), placement === "header" ? 0 : 1);
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      const coarse = matchMedia("(pointer: coarse)").matches;
      const interval = 1000 / (coarse ? 20 : 30);
      let frame = 0, last = 0, time = 0;
      let visible = false, lost = false;
      const draw = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(timeUniform, time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const render = (now: number) => {
        frame = 0;
        if (!visible || document.hidden || lost) return;
        if (now - last >= interval) {
          time += Math.min((now - last) / 1000, .1) * .9;
          last = now;
          draw();
        }
        frame = requestAnimationFrame(render);
      };
      const sync = () => {
        if (visible && !document.hidden && !lost) {
          if (!frame) { last = performance.now(); frame = requestAnimationFrame(render); }
        } else { cancelAnimationFrame(frame); frame = 0; }
      };
      const resize = () => {
        const rect = host.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio, coarse ? 1 : 1.5) * (coarse ? .7 : 1);
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        if (!lost) draw();
      };
      const onLost = (event: Event) => {
        event.preventDefault(); lost = true; host.dataset.webgl = "lost"; sync();
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      const sizing = new ResizeObserver(resize);
      observer.observe(host); sizing.observe(host);
      document.addEventListener("visibilitychange", sync);
      canvas.addEventListener("webglcontextlost", onLost);
      host.dataset.webgl = "ready";
      resize();
      stop = () => {
        cancelAnimationFrame(frame);
        observer.disconnect(); sizing.disconnect();
        document.removeEventListener("visibilitychange", sync);
        canvas.removeEventListener("webglcontextlost", onLost);
        release();
      };
    };
    start();
    reduced.addEventListener("change", start);
    forced.addEventListener("change", start);
    return () => {
      stop?.();
      reduced.removeEventListener("change", start);
      forced.removeEventListener("change", start);
    };
  }, [placement]);

  return <span className={`perlin-tide perlin-tide--${placement}`} aria-hidden="true"><canvas ref={canvasRef} /></span>;
}
