/*
  Wheat field background. Ported from prototypes/wheat-field/index.html.

  Everything is drawn into a low-res buffer (about 216 px tall) and scaled up
  by a whole number, so every art pixel is the same size. Every animated value
  is a pure function of time, so the scene never drifts and can run for hours.

  mountWheatField(canvas, { palette }) starts the scene, sized to the canvas's
  parent element, and returns a cleanup function that stops it.
*/

const TARGET_H = 216;
const SEED = 7;

// ---------- palettes ----------

const PALETTES = {
  meadow: {
    page: "#0072fd",
    sky: [
      ["#0072fd", 0], ["#0175fd", 0.085], ["#0679fd", 0.13], ["#0d7dfd", 0.17],
      ["#1281fd", 0.21], ["#1884fd", 0.25], ["#1d89fd", 0.29], ["#238efd", 0.33],
      ["#2b94fd", 0.37], ["#3a9afc", 0.41], ["#52a4fb", 0.45], ["#74b0fb", 0.48],
      ["#89b6fc", 0.51], ["#93bdfc", 0.535], ["#9ac4fb", 0.555], ["#a3cbfa", 0.575],
    ],
    cloud: ["#86b3fc", "#91bafc", "#b4cff9", "#e3eaf5", "#fbf8f0"],
    streak: ["#6aaafc", "#7fb4fc", "#9cc3fb"],
    far: ["#2652a1", "#3367c4", "#3d74d6", "#4b8cf0", "#6e94c1", "#8ab7f2", "#a3cef6"],
    tree: ["#13438e", "#1c4b96", "#265096", "#355793", "#4b71a1", "#7d888a", "#8b9891", "#a9b6b4"],
    big: ["#05367b", "#134083", "#1f498a", "#284d8b", "#406593", "#698086", "#829293", "#cfd8df"],
    pine: ["#1f4a9a", "#2a54a9", "#3c5eac", "#5f82b1"],
    house: ["#e7bfa6", "#c1837f", "#7f6d93", "#b37254", "#925256", "#cf9270", "#2d4695", "#59619c"],
    field: [
      "#0b2f66", "#173a73", "#283b6f", "#4d4065", "#614a65", "#794657", "#925256", "#b37254",
      "#e19442", "#eea74c", "#fbc35f", "#fdce6d", "#fed376", "#fada92", "#fce7ab",
    ],
    hedge: ["#c9c49a", "#9fa88f", "#2757a7", "#e7cb91"],
    fg: ["#082c60", "#10336b", "#1c3d78", "#2a4683"],
    flower: ["#1a3fb0", "#2065f5", "#2b8af3", "#33b6f9"],
    bird: "#1f4a9a",
    pollen: ["#fffbe6", "#fdf0c0"],
    smoke: ["#d6d2e2", "#b9bcd8"],
  },
  gruvbox: {
    page: "#282828",
    sky: [
      ["#076678", 0], ["#0f6b7b", 0.085], ["#17707e", 0.13], ["#1f7581", 0.17],
      ["#277a83", 0.21], ["#307e85", 0.25], ["#3a8287", 0.29], ["#458588", 0.33],
      ["#548e8c", 0.37], ["#63968f", 0.41], ["#739e93", 0.45], ["#83a598", 0.48],
      ["#92ad9c", 0.51], ["#a2b4a0", 0.535], ["#b3bda4", 0.555], ["#c3c5a8", 0.575],
    ],
    cloud: ["#8aa597", "#9db29f", "#bfc3aa", "#e2d9b8", "#fbf1c7"],
    streak: ["#5f9a90", "#74a295", "#93b09e"],
    far: ["#2e5a55", "#3a6a60", "#467868", "#5f8f6e", "#7a9c88", "#95ad98", "#b3bea4"],
    tree: ["#1f302b", "#273b33", "#30483c", "#3b5a45", "#4f6e4f", "#6f8a5c", "#8a9a5b", "#a8a86a"],
    big: ["#1a2723", "#21302b", "#293b33", "#33493d", "#427b58", "#689d6a", "#8ec07c", "#d5c4a1"],
    pine: ["#22342d", "#2c4238", "#3a5846", "#557457"],
    house: ["#ebdbb2", "#bdae93", "#7c6f64", "#d65d0e", "#af3a03", "#fe8019", "#3c3836", "#665c54"],
    field: [
      "#1d2021", "#282828", "#32302f", "#3c3836", "#504945", "#6e3b25", "#8f3f14", "#af3a03",
      "#d65d0e", "#d77e18", "#d79921", "#e9ab28", "#fabd2f", "#f6d67e", "#f2e5bc",
    ],
    hedge: ["#c8b98a", "#a2a07a", "#427b58", "#d5c4a1"],
    fg: ["#1d2021", "#232323", "#2c2a29", "#373432"],
    flower: ["#076678", "#458588", "#6e9e98", "#a7c4b5"],
    bird: "#3c3836",
    pollen: ["#fbf1c7", "#f2e5bc"],
    smoke: ["#d5c4a1", "#bdae93"],
  },
};

function rgba(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (0xff000000 | ((n & 0xff) << 16) | (n & 0xff00) | (n >>> 16)) >>> 0;
}
function compile(p) {
  const out = {};
  for (const [k, v] of Object.entries(p)) {
    if (k === "page") out[k] = v;
    else if (k === "sky") out[k] = v.map(([c, y]) => [rgba(c), y]);
    else out[k] = Array.isArray(v) ? v.map(rgba) : rgba(v);
  }
  return out;
}

// ---------- noise and randomness ----------

function rng(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(x, y, s) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s, period = 0) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  let x0 = ix, x1 = ix + 1, y0 = iy, y1 = iy + 1;
  if (period) {
    x0 = ((x0 % period) + period) % period; x1 = ((x1 % period) + period) % period;
    y0 = ((y0 % period) + period) % period; y1 = ((y1 % period) + period) % period;
  }
  const a = hash(x0, y0, s), b = hash(x1, y0, s), c = hash(x0, y1, s), d = hash(x1, y1, s);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
// Square noise texture that wraps on both axes, values 0..1.
function tileNoise(size, cells, seed, octaves) {
  const out = new Float32Array(size * size);
  let norm = 0;
  for (let o = 0; o < octaves; o++) norm += 0.5 ** o;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (let o = 0; o < octaves; o++) {
        const c = cells * 2 ** o;
        v += 0.5 ** o * vnoise((x / size) * c, (y / size) * c, seed + o, c);
      }
      out[y * size + x] = v / norm;
    }
  }
  return out;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bump = (f, c, r) => Math.max(0, 1 - ((f - c) / r) ** 2);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function interp(keys, v) {
  for (let i = 1; i < keys.length; i++) {
    if (v <= keys[i][0]) {
      const [a0, a1] = keys[i - 1], [b0, b1] = keys[i];
      return a1 + ((b1 - a1) * (v - a0)) / (b0 - a0);
    }
  }
  return keys[keys.length - 1][1];
}

export function mountWheatField(canvas, { palette = "gruvbox" } = {}) {
  const FPS = matchMedia("(pointer: coarse)").matches ? 20 : 30;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const P = compile(PALETTES[palette] ?? PALETTES.gruvbox);

  // ---------- state ----------

  const host = canvas.parentElement;
  const ctx = canvas.getContext("2d", { alpha: false });
  let w = 0, h = 0, S = 1, horizon = 0;
  let img, buf;
  let sky, cloudBig, cloudSmall, tileW = 0;
  let land, landTop = 0, landBot = 0;
  let fieldBase, fieldDith, fieldHedge, rowZ;
  let tree = null;
  let plants = [], pollen = [], chimneys = [];
  const gustTex = tileNoise(256, 4, SEED + 101, 3);
  const shadowTex = tileNoise(256, 3, SEED + 202, 2);
  const leafTex = tileNoise(64, 20, SEED + 303, 2);

  // ---------- layout ----------

  function layout() {
    const dpr = window.devicePixelRatio || 1;
    const box = host.getBoundingClientRect();
    const devW = Math.round(box.width * dpr);
    const devH = Math.round(box.height * dpr);
    const px = Math.max(1, Math.round(devH / TARGET_H));
    w = Math.ceil(devW / px);
    h = Math.ceil(devH / px);
    S = h / 270;
    horizon = Math.round(h * 0.612);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = (w * px) / dpr + "px";
    canvas.style.height = (h * px) / dpr + "px";
    img = ctx.createImageData(w, h);
    buf = new Uint32Array(img.data.buffer);
    build();
  }

  function build() {
    buildSky();
    buildClouds();
    buildLand();
    buildField();
    buildTree();
    buildPlants();
  }

  // ---------- sky ----------

  function buildSky() {
    const stops = P.sky;
    sky = new Uint32Array(w * horizon);
    for (let y = 0; y < horizon; y++) {
      const f = y / h;
      let i = 0;
      while (i < stops.length - 1 && f >= stops[i + 1][1]) i++;
      const a = stops[i], b = stops[i + 1];
      let blend = 0;
      if (b) {
        const local = (f - a[1]) / (b[1] - a[1]);
        blend = local > 0.55 ? (local - 0.55) / 0.45 : 0;
      }
      for (let x = 0; x < w; x++) {
        sky[y * w + x] = b && blend > BAYER[(y & 3) * 4 + (x & 3)] ? b[0] : a[0];
      }
    }
  }

  // ---------- clouds ----------

  function tileSet(t, x, y, c) {
    if (y < 0 || y >= horizon) return;
    x = Math.round(x) % tileW;
    if (x < 0) x += tileW;
    t[y * tileW + x] = c;
  }

  // Clouds are built as a density field (the highest puff cone at each pixel),
  // then shaded by comparing each pixel with a sample toward the sun. Stepping
  // toward the sun into thinner cloud means a lit rim; into thicker cloud
  // means the pixel sits in the shadow of the lobe above it.
  const wrapX = (x) => ((x % tileW) + tileW) % tileW;

  function cumulus(D, Dd, cx, baseY, W, Hc, towerU, rnd) {
    const prof = (u) =>
      Math.max(0.5 * Math.pow(Math.max(0, 1 - u * u), 0.6), Math.exp(-((u - towerU) ** 2) / 0.14) * (1 - 0.25 * u * u));
    const puffs = [];
    const count = Math.max(4, Math.round((W * Hc) / (120 * S * S)));
    for (let k = 0; k < count; k++) {
      const u = rnd() * 2 - 1;
      const pr = prof(u);
      const top = baseY - Hc * pr * (0.85 + rnd() * 0.25);
      const r = Math.max(2, (7 + rnd() * 10) * S * (0.7 + 0.5 * pr) * Math.min(1, W / (70 * S) + 0.3));
      const y = top + r + Math.pow(rnd(), 1.4) * Math.max(0, baseY - top - r);
      puffs.push({ x: cx + u * W * 0.5, y, r });
    }
    puffs.sort((a, b) => a.y - b.y);
    let cloudTop = Infinity;
    for (const p of puffs) cloudTop = Math.min(cloudTop, p.y - p.r);
    const span = Math.max(1, baseY - cloudTop);
    for (const p of puffs) {
      const R = Math.ceil(p.r + 1);
      const pcx = Math.round(p.x), pcy = Math.round(p.y);
      for (let dy = -R; dy <= R; dy++) {
        const yy = pcy + dy;
        if (yy < 0 || yy >= horizon || yy > baseY + 1) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = wrapX(pcx + dx);
          const rr = p.r * (1 + (vnoise(xx * 0.45, yy * 0.45, 11) - 0.5) * 0.3) + (hash(xx, yy, 12) - 0.5) * 0.8;
          const val = 1 - Math.hypot(dx, dy) / rr;
          if (val <= 0) continue;
          const i = yy * tileW + xx;
          if (val > D[i]) { D[i] = val; Dd[i] = clamp((yy - cloudTop) / span, 0, 1); }
        }
      }
    }
    // plug holes: gaps with cloud above and below, and in the core of the
    // cloud, everything down to the flat base
    const x0 = Math.floor(cx - W * 0.6), x1 = Math.ceil(cx + W * 0.6);
    const y0 = Math.max(0, Math.floor(cloudTop)), y1 = Math.min(horizon - 1, Math.ceil(baseY + 1));
    for (let x = x0; x <= x1; x++) {
      const xx = wrapX(x);
      let first = -1, last = -1;
      for (let y = y0; y <= y1; y++) if (D[y * tileW + xx]) { if (first < 0) first = y; last = y; }
      if (first >= 0 && Math.abs(x - cx) < W * 0.42) last = Math.min(y1, Math.round(baseY));
      for (let y = first + 1; first >= 0 && y < last; y++) {
        const i = y * tileW + xx;
        if (!D[i]) { D[i] = 0.04; Dd[i] = clamp((y - cloudTop) / span, 0, 1); }
      }
    }
    return puffs;
  }

  function shadeClouds(tile, D, Dd) {
    const C = P.cloud;
    const lx = Math.max(1, Math.round(3 * S)), ly = Math.max(1, Math.round(4 * S));
    for (let y = 0; y < horizon; y++) {
      for (let x = 0; x < tileW; x++) {
        const i = y * tileW + x;
        const d = D[i];
        if (!d) continue;
        const d2 = y - ly >= 0 ? D[(y - ly) * tileW + wrapX(x - lx)] : 0;
        const lit = (d - d2) * 2.6 + 0.34 - Dd[i] * 0.85 + (vnoise(x * 0.5, y * 0.5, 5) - 0.5) * 0.16;
        tile[i] = lit > 0.3 ? C[4] : lit > 0.16 ? C[3] : lit > -0.12 ? C[2] : lit > -0.85 ? C[1] : C[0];
      }
    }
  }

  function flecks(tile, D, puffs, W, rnd) {
    const C = P.cloud;
    const upper = puffs.slice(0, Math.max(1, Math.ceil(puffs.length * 0.55)));
    const n = Math.round(W / (2.5 * S));
    const empty = (x, y) => y >= 0 && y < horizon && !D[y * tileW + wrapX(x)] && !tile[y * tileW + wrapX(x)];
    for (let k = 0; k < n; k++) {
      const p = upper[Math.floor(rnd() * upper.length)];
      const a = -Math.PI * (rnd() * 1.2 - 0.1);
      const dist = p.r + (1.5 + rnd() * 7) * S;
      const x = Math.round(p.x + Math.cos(a) * dist), y = Math.round(p.y + Math.sin(a) * dist);
      if (!empty(x, y) || !empty(x - 1, y) || !empty(x + 1, y)) continue;
      const c = rnd() < 0.7 ? C[4] : C[2];
      tileSet(tile, x, y, c);
      if (rnd() < 0.35) tileSet(tile, x + 1, y, c);
      if (rnd() < 0.15) tileSet(tile, x, y + 1, c);
    }
  }

  function buildClouds() {
    const rnd = rng(SEED * 31 + 1);
    const spacing = Math.round(300 * S);
    const n = Math.max(3, Math.ceil((w * 2) / spacing));
    tileW = n * spacing;
    cloudBig = new Uint32Array(tileW * horizon);
    cloudSmall = new Uint32Array(tileW * horizon);
    const baseY = Math.round(h * 0.54);
    let D = new Float32Array(tileW * horizon), Dd = new Float32Array(tileW * horizon);
    const fleckList = [];
    for (let i = 0; i < n; i++) {
      const tall = i % 2 === 0;
      const cx = spacing * i + spacing * (tall ? 0.37 : 0.42) + (rnd() - 0.5) * spacing * 0.12;
      const W = (tall ? 215 : 205) * S * (0.9 + rnd() * 0.2);
      const Hc = (tall ? 122 : 100) * S * (0.92 + rnd() * 0.16);
      fleckList.push([cumulus(D, Dd, cx, baseY, W, Hc, tall ? -0.15 : -0.3, rnd), W]);
      // low shoulder that trails off toward the next cloud
      cumulus(D, Dd, cx + W * 0.55, baseY + 2 * S, W * 0.45, Hc * 0.28, 0, rnd);
    }
    shadeClouds(cloudBig, D, Dd);
    for (const [puffs, W] of fleckList) flecks(cloudBig, D, puffs, W, rnd);
    // small drifting puffs in the upper sky
    D = new Float32Array(tileW * horizon); Dd = new Float32Array(tileW * horizon);
    const smalls = Math.round(tileW / (90 * S));
    const smallList = [];
    for (let k = 0; k < smalls; k++) {
      const W = (10 + rnd() * 26) * S;
      const x = rnd() * tileW, y = Math.round((0.06 + rnd() * 0.32) * h);
      // two or three offset clumps so the silhouette is uneven
      const parts = 2 + Math.floor(rnd() * 2);
      for (let q = 0; q < parts; q++) {
        const pw = W * (0.35 + rnd() * 0.4);
        const puffs = cumulus(D, Dd, x + (rnd() - 0.5) * W * 0.8, y + (rnd() - 0.5) * 4 * S, pw, pw * (0.25 + rnd() * 0.25), (rnd() - 0.5) * 0.8, rnd);
        smallList.push([puffs, pw]);
      }
    }
    shadeClouds(cloudSmall, D, Dd);
    for (const [puffs, W] of smallList) flecks(cloudSmall, D, puffs, W * 0.6, rnd);
    // soft flat wisps: a few stacked, staggered runs, lighter on top
    const wisps = Math.round(tileW / (95 * S));
    for (let k = 0; k < wisps; k++) {
      const y0 = Math.round((0.12 + rnd() * 0.28) * h);
      const x0 = rnd() * tileW;
      const len = (18 + rnd() * 40) * S;
      const rows = 2 + Math.floor(rnd() * 3);
      for (let r = 0; r < rows; r++) {
        const mid = (rows - 1) / 2;
        const lr = len * (1 - Math.abs(r - mid) / (rows * 0.75)) * (0.8 + rnd() * 0.3);
        const start = x0 + (len - lr) * (0.3 + rnd() * 0.5) + (r - mid) * 3 * S;
        const c = P.streak[r === 0 ? 2 : r < rows - 1 ? 1 : 0];
        for (let i = 0; i < lr; i++) {
          if ((i < 2 || i > lr - 3) && hash(i, r, k) < 0.5) continue;
          if (!cloudSmall[(y0 + r) * tileW + wrapX(Math.round(start + i))]) tileSet(cloudSmall, start + i, y0 + r, c);
        }
      }
    }
  }

  // ---------- land: far forest, trees, houses ----------

  function landSet(x, y, c) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    land[y * w + x] = c;
    if (y < landTop) landTop = y;
    if (y + 1 > landBot) landBot = y + 1;
  }

  function clumpTree(cx, baseY, r, pal, seed, trunk = true) {
    const rnd = rng(seed);
    const cy = Math.round(baseY - r * 0.82);
    if (trunk) for (let y = cy; y <= baseY; y++) { landSet(cx, y, pal[0]); landSet(cx + 1, y, pal[1]); }
    const clumps = [{ x: cx, y: cy, r: r * 0.72 }];
    const n = 4 + Math.round(r / (3 * S));
    for (let k = 0; k < n; k++) {
      const a = rnd() * Math.PI * 2, d = rnd() * r * 0.5;
      clumps.push({ x: cx + Math.cos(a) * d * 1.35, y: cy + Math.sin(a) * d * 0.8, r: r * (0.42 + rnd() * 0.26) });
    }
    clumps.sort((a, b) => a.y - b.y);
    const top = cy - r;
    for (const c of clumps) {
      const R = Math.ceil(c.r + 1);
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const x = Math.round(c.x) + dx, y = Math.round(c.y) + dy;
          if (y > baseY) continue;
          if (Math.hypot(dx, dy) > c.r + (hash(x, y, seed) - 0.5) * 1.3) continue;
          const gy = (y - top) / (2 * r);
          const lit = (-dy / c.r) * 0.75 - (dx / c.r) * 0.35 - gy * 0.8 + 0.12 + (vnoise(x * 0.55, y * 0.55, seed) - 0.5) * 0.8;
          landSet(x, y, pal[clamp(Math.floor((lit * 0.5 + 0.5) * pal.length), 0, pal.length - 1)]);
        }
      }
    }
  }

  function pine(cx, baseY, ht, hw, seed) {
    const pal = P.pine;
    const trunkH = Math.max(1, Math.round(1.5 * S));
    for (let y = baseY - trunkH; y <= baseY; y++) landSet(cx, y, pal[0]);
    const tier = Math.max(3, Math.round(3.5 * S));
    for (let k = 0; k < ht; k++) {
      const y = baseY - trunkH - ht + k;
      const half = Math.round((k / ht) * hw * 0.8 + (k % tier) * 0.55 * S);
      for (let dx = -half; dx <= half; dx++) {
        const lit = (-dx / (hw + 1)) * 0.8 - (k % tier) / tier * 0.4 + (hash(cx + dx, y, seed) - 0.5) * 0.5 + 0.1;
        landSet(cx + dx, y, pal[clamp(Math.floor((lit * 0.5 + 0.5) * pal.length), 0, pal.length - 1)]);
      }
    }
  }

  function house(x0, base, wid, wallH, roofH, chimney) {
    const [wallLit, wall, wallShade, roof, roofShade, roofLit, dark, trim] = P.house;
    x0 = Math.round(x0);
    const wallTop = base - wallH;
    const gable = Math.max(2, Math.round(wid * 0.28));
    for (let y = wallTop; y < base; y++) {
      for (let x = x0; x < x0 + wid; x++) {
        let c = x >= x0 + wid - gable ? wall : wallLit;
        if (y === base - 1) c = wallShade;
        landSet(x, y, c);
      }
    }
    // windows and a door on the long wall
    const wy = wallTop + Math.max(1, Math.round(wallH * 0.3));
    for (let x = x0 + 2; x < x0 + wid - gable - 1; x += Math.max(3, Math.round(4 * S))) {
      landSet(x, wy, dark);
      landSet(x, wy + 1, trim);
    }
    const gx = x0 + wid - Math.ceil(gable / 2) - 1;
    landSet(gx, wy, dark);
    // roof: trapezoid with an overhang, light along the ridge
    for (let k = 0; k < roofH; k++) {
      const y = wallTop - roofH + k;
      const inset = roofH - 1 - k;
      for (let x = x0 - 1 + inset; x <= x0 + wid + (k === roofH - 1 ? 1 : 0) - inset; x++) {
        let c = k === 0 ? roofLit : k === roofH - 1 ? roofShade : roof;
        if (k > 0 && k < roofH - 1 && (x - x0) % 3 === 0) c = roofShade;
        landSet(x, y, c);
      }
    }
    if (chimney) {
      const cx = x0 + Math.round(wid * 0.68);
      const top = wallTop - roofH - Math.round(2 * S);
      for (let y = top; y < wallTop - roofH + 1; y++) { landSet(cx, y, trim); landSet(cx + 1, y, dark); }
      chimneys.push({ x: cx + 0.5, y: top - 1 });
    }
  }

  function buildLand() {
    land = new Uint32Array(w * h);
    landTop = h; landBot = 0;
    chimneys = [];
    const F = P.far;
    // pale back band, then the darker front band of tree crowns
    for (let x = 0; x < w; x++) {
      const back = horizon - Math.round((7 + 4 * vnoise(x * 0.05, 1, 21) + 2.5 * vnoise(x * 0.28, 2, 22)) * S);
      for (let y = back; y < horizon; y++) landSet(x, y, y === back ? F[6] : vnoise(x * 0.6, y * 0.6, 23) > 0.55 ? F[5] : F[4]);
      const front = horizon - Math.round((3 + 3 * vnoise(x * 0.09, 3, 24) + 1.8 * vnoise(x * 0.45, 4, 25)) * S);
      for (let y = front; y < horizon; y++) {
        const n = vnoise(x * 0.7, y * 0.8, 26);
        let c = n > 0.62 ? F[3] : n > 0.38 ? F[2] : n > 0.22 ? F[1] : F[0];
        if (y === front && n > 0.3) c = F[3];
        if (y === horizon - 1) c = F[0];
        landSet(x, y, c);
      }
    }
    const T = P.tree;
    // Narrow screens see the middle of a wider layout instead of a squashed one.
    const vw = Math.max(w, 330 * S);
    const g = (f) => f * vw - (vw - w) / 2;
    const b = horizon + Math.round(1 * S);
    // left group
    clumpTree(g(0.268), b, 11 * S, T, 401);
    pine(Math.round(g(0.302)), b, Math.round(22 * S), 5 * S, 402);
    pine(Math.round(g(0.338)), b - 1, Math.round(19 * S), 4.5 * S, 403);
    house(g(0.312), b + Math.round(2 * S), Math.round(15 * S), Math.round(6 * S), Math.round(4 * S), false);
    house(g(0.35), b + Math.round(2 * S), Math.round(11 * S), Math.round(5 * S), Math.round(3 * S), false);
    clumpTree(g(0.388), b, 9 * S, T, 404);
    // middle clump
    clumpTree(g(0.425), b, 13 * S, T, 405);
    clumpTree(g(0.468), b, 15 * S, T, 406);
    clumpTree(g(0.505), b, 11 * S, T, 407);
    clumpTree(g(0.598), b + 1, 4.5 * S, T, 408, false);
    // right group
    clumpTree(g(0.745), b, 11 * S, T, 409);
    pine(Math.round(g(0.915)), b, Math.round(28 * S), 5.5 * S, 410);
    clumpTree(g(0.868), b, 17 * S, T, 411);
    clumpTree(g(0.972), b, 13 * S, T, 412);
    house(g(0.765), b + Math.round(2 * S), Math.round(13 * S), Math.round(5 * S), Math.round(4 * S), false);
    house(g(0.8), b + Math.round(3 * S), Math.round(19 * S), Math.round(6 * S), Math.round(5 * S), true);
    house(g(0.897), b + Math.round(3 * S), Math.round(17 * S), Math.round(6 * S), Math.round(5 * S), false);
    house(g(0.953), b + Math.round(2 * S), Math.round(12 * S), Math.round(5 * S), Math.round(4 * S), false);
  }

  // ---------- field ----------

  const FIELD_KEYS = [
    [0, 13.2], [0.12, 12.2], [0.2, 11.5], [0.4, 11], [0.5, 10.1], [0.555, 8.8], [0.6, 7.6],
    [0.65, 6.4], [0.72, 5.2], [0.78, 4.1], [0.82, 3.1], [0.86, 2], [0.9, 1.2], [1, 0.8],
  ];

  function buildField() {
    const fh = h - horizon;
    fieldBase = new Float32Array(w * fh);
    fieldDith = new Float32Array(w * fh);
    fieldHedge = new Uint32Array(w * fh);
    rowZ = new Float32Array(fh);
    const H = P.hedge;
    // base gradient; the far field gets short horizontal runs instead of dots
    for (let y = 0; y < fh; y++) {
      const v = y / fh;
      rowZ[y] = 1 / (v + 0.1);
      const base = interp(FIELD_KEYS, v);
      const run = 3 + Math.floor(hash(y, 1, SEED) * 7);
      const shift = Math.floor(hash(y, 2, SEED) * 9);
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        fieldBase[i] = base;
        fieldDith[i] = hash(Math.floor((x + shift) / run), y, SEED + 5);
        if (v < 0.13 && v > 0.02) {
          const n = vnoise(x * 0.018, y * 0.8, 61);
          if (n > 0.83 && hash(x, y, 63) > 0.1) fieldHedge[i] = n > 0.91 ? H[1] : H[0];
          else if (n < 0.08) fieldHedge[i] = H[3];
        }
        if (y === 0 && vnoise(x * 0.08, 7, 62) > 0.45) fieldHedge[i] = H[2];
      }
    }
    // wheat stalks: 1 px vertical strokes that grow toward the viewer. Each
    // stroke carries one dither value, so gradients break up into stalks
    // rather than a checkerboard.
    const start = 0.07;
    for (let x = 0; x < w; x++) {
      let y = Math.floor(fh * start + hash(x, 90, SEED) * 3);
      let k = 0;
      while (y < fh) {
        const v = y / fh;
        const len = Math.max(1, Math.round((1.5 + v * 12) * S * (0.45 + hash(x, k, SEED + 1))));
        const r = hash(x, k, SEED + 4);
        const pick = hash(x, k, SEED + 6);
        const reach = 0.7 + v * 1.6;
        const tone = pick < 0.26 ? -reach * (1 + pick * 2) : pick > 0.72 ? reach * (0.6 + (pick - 0.72) * 2.5) : 0;
        const head = v < 0.6 ? 1 : 0.4;
        for (let j = 0; j < len && y + j < fh; j++) {
          const i = (y + j) * w + x;
          const mix = clamp((v - start) / 0.05, 0, 1);
          fieldDith[i] = fieldDith[i] * (1 - mix) + r * mix;
          fieldBase[i] += (tone + (j === 0 ? head : 0)) * mix;
        }
        y += len;
        if (y < fh && hash(x, k, SEED + 3) < 0.45) {
          const i = y * w + x;
          fieldDith[i] = r;
          fieldBase[i] -= 1.2 + v * 1.2;
          y++;
        }
        k++;
      }
    }
    // dark tufts along two furrow lines
    for (const tv of [0.1, 0.285]) {
      const ty = Math.round(fh * tv);
      for (let x = 0; x < w; x++) {
        if (hash(x, ty, 71) < 0.45) continue;
        const tall = 1 + Math.floor(hash(x, ty, 72) * (1 + 5 * S * tv));
        for (let k = 0; k < tall; k++) {
          const yy = ty - k;
          if (yy >= 0) fieldBase[yy * w + x] -= 2.2;
        }
      }
    }
    // shade cast by the big tree, trailing to the right
    for (let y = 0; y < fh; y++) {
      const v = y / fh;
      if (v < 0.05 || v > 0.24) continue;
      const jitter = (hash(y, 3, 82) - 0.5) * 18 * S;
      const nearEnd = (40 + (0.24 - v) * 60) * S + jitter * 0.5;
      const bandEnd = v > 0.16 ? 150 * S - (v - 0.2) ** 2 * 9000 * S + jitter : 0;
      const end = Math.max(nearEnd, bandEnd);
      const depth = v > 0.205 ? 4.6 : 5.6;
      for (let x = 0; x < end + 10 * S && x < w; x++) {
        fieldBase[y * w + x] -= depth * clamp((end - x) / (10 * S), 0, 1);
      }
    }
  }

  function drawField(t) {
    const fh = h - horizon;
    const F = P.field, FMAX = F.length - 1;
    const gOff = t * 7, sOff = t * 1.6;
    for (let y = 0; y < fh; y++) {
      const v = y / fh;
      const z = rowZ[y];
      const gRow = v > 0.05 && v < 0.62;
      const sRow = v < 0.6;
      const gv = ((z * 28) | 0) & 255, sv = ((z * 9) | 0) & 255;
      const row = (horizon + y) * w;
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const hedge = fieldHedge[i];
        if (hedge) { buf[row + x] = hedge; continue; }
        let b = fieldBase[i];
        const wx = (x - w * 0.5) * z;
        if (gRow) {
          const g = gustTex[((((wx * 0.5 - gOff) | 0) & 255) | (gv << 8))];
          if (g > 0.54) b += Math.min(2, (g - 0.54) * 15);
          else if (g < 0.42) b -= Math.min(1, (0.42 - g) * 8);
        }
        if (sRow) {
          const s = shadowTex[((((wx * 0.28 - sOff) | 0) & 255) | (sv << 8))];
          if (s > 0.58) b -= Math.min(1.8, (s - 0.58) * 20);
        }
        const k = Math.floor(b + fieldDith[i]);
        buf[row + x] = F[k < 0 ? 0 : k > FMAX ? FMAX : k];
      }
    }
  }

  // ---------- big tree on the left ----------

  function buildTree() {
    const rnd = rng(SEED * 13 + 5);
    const cx = Math.round(26 * S), cy = Math.round(h * 0.525);
    const rx = 56 * S, ry = 40 * S;
    const clumps = [];
    while (clumps.length < 36) {
      const u = rnd() * 2 - 1, v = rnd() * 2 - 1;
      if (u * u + v * v > 1) continue;
      clumps.push({ x: cx + u * rx * 0.78, y: cy + v * ry * 0.72, r: (8 + rnd() * 8) * S });
    }
    // low bushes along its foot
    for (let k = 0; k < 16; k++) {
      clumps.push({ x: rnd() * 80 * S - 6 * S, y: horizon + (rnd() * 6 - 1) * S, r: (3 + rnd() * 4) * S, bush: true });
    }
    clumps.sort((a, b) => a.y - b.y);
    const top = cy - ry;
    const map = new Map();
    for (const c of clumps) {
      const R = Math.ceil(c.r + 1);
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const x = Math.round(c.x) + dx, y = Math.round(c.y) + dy;
          if (x < 0 || x >= w || y < 0 || y >= h) continue;
          if (c.bush && y > horizon + 5 * S) continue;
          if (Math.hypot(dx, dy) > c.r + (hash(x, y, 91) - 0.5) * 1.6) continue;
          const gy = (y - top) / (2 * ry);
          const lit = (-dy / c.r) * 0.85 - (dx / c.r) * 0.35 - gy * 0.8 + 0.08 - (c.bush ? 0.25 : 0);
          map.set(y * w + x, lit);
        }
      }
    }
    const n = map.size;
    tree = { idx: new Int32Array(n), lit: new Float32Array(n) };
    let k = 0;
    for (const [i, lit] of map) { tree.idx[k] = i; tree.lit[k] = lit; k++; }
  }

  function drawTree(t) {
    const B = P.big, n = B.length;
    const g = windAt(20, t);
    const amp = Math.max(0, g - 0.42) * 3;
    const { idx, lit } = tree;
    for (let k = 0; k < idx.length; k++) {
      const i = idx[k];
      const y = (i / w) | 0, x = i - y * w;
      const ox = Math.round(amp * Math.sin(y * 0.45 + t * 1.7));
      const nz = leafTex[((x + ox) & 63) | ((y & 63) << 6)];
      const l = lit[k] + (nz - 0.5) * 0.75;
      buf[i] = B[clamp(Math.floor((l * 0.5 + 0.44) * n), 0, n - 1)];
    }
  }

  // ---------- foreground plants ----------

  const FLOWER_BIG = [" h m p ", "hhhmmpp", "hhmccpp", "hmmccpp", " pmmpp ", "p p p p"];
  const FLOWER_SMALL = ["hm ", "hcp", " pp"];

  function buildPlants() {
    const rnd = rng(SEED * 97 + 3);
    plants = [];
    const zone = (f) => Math.max(bump(f, 0.19, 0.25), bump(f, 0.93, 0.15), 0.85 * bump(f, 0.6, 0.11));
    const add = (p) => plants.push(Object.assign({ freq: 0.8 + rnd() * 0.9, phase: rnd() * 6.283 }, p));
    // low dense grass
    for (let k = 0, n = Math.round(w * 1.2); k < n; k++) {
      const x = rnd() * w, z = zone(x / w);
      add({ kind: 0, x, y: h + 1, len: (5 + rnd() * 11 + z * 9) * S, a0: (rnd() - 0.45) * 1.1, curve: (rnd() - 0.3) * 1.3,
        width: rnd() < 0.45 ? 2 : 1, shade: rnd() < 0.5 ? 0 : 1, flex: 0.15 + rnd() * 0.2, layer: 2 });
    }
    // tall blades
    for (let k = 0, n = Math.round(w * 0.75); k < n; k++) {
      const x = rnd() * w, z = zone(x / w);
      if (rnd() > z * 0.95 + 0.06) continue;
      const dir = rnd() < 0.75 ? 1 : -1;
      add({ kind: 0, x, y: h + 1, len: (18 + rnd() * 52) * S * (0.45 + 0.6 * z), a0: dir * (rnd() * 0.4 - 0.1),
        curve: dir * (0.25 + rnd() * 1.6), width: rnd() < 0.05 ? 3 : rnd() < 0.25 ? 2 : 1,
        shade: 1 + Math.floor(rnd() * 3), flex: 0.3 + rnd() * 0.35, layer: 1 });
    }
    // tall upright stems
    for (let k = 0, n = Math.round(w * 0.35); k < n; k++) {
      const x = rnd() * w, z = zone(x / w);
      if (rnd() > z * 0.9) continue;
      const dir = rnd() < 0.7 ? 1 : -1;
      add({ kind: 0, x, y: h + 1, len: (50 + rnd() * 42) * S * (0.6 + 0.4 * z), a0: dir * (rnd() * 0.22 - 0.04),
        curve: dir * (0.1 + rnd() * 0.5), width: 1, shade: 1 + Math.floor(rnd() * 3), flex: 0.35 + rnd() * 0.3, layer: 0.5 });
    }
    // plumed reeds
    for (let k = 0, n = Math.round(w * 0.065); k < n; k++) {
      const x = rnd() * w, z = zone(x / w);
      if (rnd() > z * 1.1) continue;
      const dir = rnd() < 0.8 ? 1 : -1;
      add({ kind: 2, x, y: h + 1, len: (66 + rnd() * 36) * S * (0.7 + 0.35 * z), a0: dir * (rnd() * 0.25 - 0.06),
        curve: dir * (1.4 + rnd() * 1.1), width: 1, shade: 1 + Math.floor(rnd() * 3), flex: 0.45 + rnd() * 0.3, layer: 1 });
    }
    // cornflowers
    for (let k = 0, n = Math.round(w * 0.045); k < n; k++) {
      const x = rnd() * w;
      const len = (4 + rnd() * 24) * S;
      add({ kind: 3, x, y: h + 1, len, a0: (rnd() - 0.5) * 0.3, curve: (rnd() - 0.4) * 0.5, width: 1, shade: 1,
        flex: 0.25 + rnd() * 0.2, layer: 1.5, big: len > 17 * S });
    }
    // back to front: lighter shades first so darker ones overlap them
    plants.sort((a, b) => a.layer - b.layer || b.shade - a.shade);
    // pollen and seed fluff
    pollen = [];
    for (let k = 0, n = Math.round(w * 0.06); k < n; k++) {
      pollen.push({ x0: rnd() * w, y0: (0.6 + rnd() * 0.32) * h, vx: (3 + rnd() * 7) * S, amp: (2 + rnd() * 6) * S,
        f: 0.25 + rnd() * 0.5, ph: rnd() * 6.283, tw: rnd() * 6.283, tf: 1 + rnd() * 2 });
    }
  }

  function plot(x, y, c) {
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    buf[y * w + x] = c;
  }

  function windAt(x, t) {
    return vnoise(x * 0.012 - t * 0.22, 0.5, 77);
  }

  function drawPlant(p, t) {
    const g = windAt(p.x, t);
    const bend = p.curve + p.flex * (0.2 * Math.sin(t * p.freq + p.phase) + 1.0 * (g - 0.35));
    const col = P.fg[p.shade];
    const step = 0.6;
    const n = Math.max(2, Math.ceil(p.len / step));
    const pow = p.kind === 2 ? 2.2 : 1.7;
    let x = p.x, y = p.y, a = p.a0;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      a = p.a0 + bend * f ** pow;
      x += Math.sin(a) * step;
      y -= Math.cos(a) * step;
      plot(x, y, col);
      if (p.width > 1 && f < 0.4) plot(x + 1, y, col);
      if (p.width > 2 && f < 0.18) plot(x - 1, y, col);
      // plume: a fringe of barbs hanging from the crook, short ticks on top
      if (p.kind === 2 && f > 0.58 && i % 3 === 0) {
        const pf = (f - 0.58) / 0.42;
        const bl = (1 + 3.6 * Math.sin(Math.PI * Math.min(1, 0.12 + pf * 0.92))) * Math.max(0.85, S);
        for (const side of [1, -1]) {
          const ba = a + side * 0.95;
          const len = side * Math.sign(bend) > 0 ? bl * 0.75 : bl;
          for (let s = 1; s <= len; s += 0.75) plot(x + Math.sin(ba) * s, y - Math.cos(ba) * s + s * s * 0.07, col);
        }
      }
    }
    if (p.kind === 3) {
      const F = P.flower;
      const spr = p.big ? FLOWER_BIG : FLOWER_SMALL;
      const ox = Math.floor(spr[0].length / 2), oy = spr.length - 2;
      for (let r = 0; r < spr.length; r++) {
        for (let q = 0; q < spr[r].length; q++) {
          const ch = spr[r][q];
          if (ch === " ") continue;
          plot(x - ox + q, y - oy + r, ch === "h" ? F[3] : ch === "m" ? F[2] : ch === "c" ? F[0] : F[1]);
        }
      }
    }
  }

  function drawPollen(t) {
    const C = P.pollen;
    for (const p of pollen) {
      const tw = Math.sin(t * p.tf + p.tw);
      if (tw < -0.55) continue;
      const span = w + 8;
      let x = (p.x0 + p.vx * t) % span;
      x = x - 4;
      const y = p.y0 + p.amp * Math.sin(t * p.f + p.ph) + Math.sin(t * p.f * 2.3 + p.ph) * 1.2;
      plot(x, y, tw > 0.4 ? C[0] : C[1]);
    }
  }

  // ---------- birds and smoke ----------

  const BIRD = [
    ["x...x", ".x.x.", "..x.."],
    ["xx.xx", "..x.."],
    ["..x..", ".x.x.", "x...x"],
    ["xx.xx", "..x.."],
  ];

  function drawBirds(t) {
    const period = 46;
    const cycle = Math.floor(t / period);
    const local = t - cycle * period;
    const speed = 15 * S;
    const count = 2 + Math.floor(hash(cycle, 1, 5) * 3);
    const y0 = (0.12 + hash(cycle, 2, 5) * 0.2) * h;
    const x0 = -20 + local * speed;
    if (x0 > w + 60) return;
    for (let i = 0; i < count; i++) {
      const bx = x0 - i * 8 * S - hash(cycle, i, 9) * 4;
      const by = y0 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 4 * S + Math.sin(t * 0.9 + i) * 1.5;
      const spr = BIRD[Math.floor(t * 7 + i * 1.7) % 4];
      for (let r = 0; r < spr.length; r++) {
        for (let q = 0; q < 5; q++) if (spr[r][q] === "x") plot(bx + q - 2, by + r - 1, P.bird);
      }
    }
  }

  function drawSmoke(t) {
    const C = P.smoke;
    const N = 9;
    for (const ch of chimneys) {
      for (let i = 0; i < N; i++) {
        const phase = t * 0.08 + i / N;
        const a = phase - Math.floor(phase);
        const x = ch.x + a * 10 * S + Math.sin(a * 6 + i) * 1.2;
        const y = ch.y - a * 15 * S;
        if (a > 0.3 && hash(i, Math.floor(phase), 3) < a) continue;
        plot(x, y, a < 0.4 ? C[0] : C[1]);
        if (a < 0.25) plot(x + 1, y, C[0]);
        if (a > 0.3 && a < 0.6) plot(x, y - 1, C[1]);
      }
    }
  }

  // ---------- frame ----------

  function blitTile(t, off) {
    for (let y = 0; y < horizon; y++) {
      const src = y * tileW, dst = y * w;
      let sx = ((-off % tileW) + tileW) % tileW;
      for (let x = 0; x < w; x++) {
        const c = t[src + sx];
        if (c) buf[dst + x] = c;
        if (++sx === tileW) sx = 0;
      }
    }
  }


  function render(t) {
    buf.set(sky);
    blitTile(cloudSmall, Math.floor(t * 0.45));
    blitTile(cloudBig, Math.floor(t * 0.2));
    drawBirds(t);
    drawField(t);
    for (let i = landTop * w, end = landBot * w; i < end; i++) if (land[i]) buf[i] = land[i];
    drawSmoke(t);
    drawTree(t);
    for (const p of plants) drawPlant(p, t);
    drawPollen(t);
    ctx.putImageData(img, 0, 0);
  }

  // ---------- loop ----------

  let start = performance.now();
  let pausedAt = 0, lastDraw = 0, raf = 0;
  const now = () => (performance.now() - start) / 1000;

  function tick(ms) {
    raf = requestAnimationFrame(tick);
    if (ms - lastDraw < 1000 / FPS - 2) return;
    lastDraw = ms;
    render(now());
  }

  function run() {
    cancelAnimationFrame(raf);
    if (REDUCED || document.hidden) { render(REDUCED ? 0 : now()); return; }
    raf = requestAnimationFrame(tick);
  }

  // The host is sized to the large viewport, so a mobile address bar showing
  // or hiding does not trigger a rebuild.
  let lastW = 0, lastH = 0, resizeTimer = 0;
  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width === lastW && height === lastH) return;
    const first = lastW === 0;
    lastW = width; lastH = height;
    if (first) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layout();
      render(REDUCED ? 0 : now());
    }, 120);
  });
  function onVisibility() {
    if (document.hidden) { cancelAnimationFrame(raf); pausedAt = now(); }
    else { start = performance.now() - pausedAt * 1000; run(); }
  }
  observer.observe(host);
  document.addEventListener("visibilitychange", onVisibility);

  const box = host.getBoundingClientRect();
  lastW = box.width; lastH = box.height;
  layout();
  run();

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
