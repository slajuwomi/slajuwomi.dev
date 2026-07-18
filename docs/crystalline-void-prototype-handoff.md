# Crystalline Void Prototype — Technical, Visual, and Agent Handoff

> Last updated: 2026-07-17  
> Prototype status: Implemented and visually validated  
> Production status: Not integrated  
> Default seed: `stephen-crystalline-void-07`  
> Implementation: [`prototypes/crystalline-void/`](../prototypes/crystalline-void/)  
> Co-design plan: [`plans/crystalline-void-background-prototype.md`](../plans/crystalline-void-background-prototype.md)

## Executive Summary

This prototype answers one question:

> Can a stable, procedural crystalline 3D world replace the dotted background on `slajuwomi.dev` without compromising the narrow editorial reading experience?

The answer from this round is **yes, the direction is viable and visually distinctive**.

The successful composition is not a general cube field. It is a dark central reading void framed by dense, asymmetric voxel formations. Cyan carries the structure, while magenta and orange appear as localized energy pockets. Pointer movement exposes depth through restrained camera parallax. Scrolling shifts the camera only slightly. On mobile, the middle reading band is deliberately cleared and formations are concentrated near the top and bottom.

This remains throwaway prototype code. It proves the visual idea, composition logic, interaction intensity, and approximate performance strategy. A production implementation should preserve the validated decisions while rewriting lifecycle management, quality detection, testing, and integration boundaries more rigorously.

## Source Concept and Visual Reading

The prototype was developed from the GPT Image 2 concept supplied by Stephen:

```text
/Users/stephenlajuwomi/Downloads/ChatGPT Image Jul 17, 2026, 11_04_33 PM.png
```

The image was interpreted through five defining qualities:

1. **The center is the subject.** The apparent subject is not the cubes themselves; it is the calm void created by the cubes.
2. **The formations grow inward from the perimeter.** They are dense, stepped, and asymmetrical—not a uniform starfield.
3. **Cyan defines structure.** Magenta and orange behave like heat or energy sources rather than equal palette members.
4. **Depth comes from layers.** Dark cores, transparent shells, bright internal fragments, fog, and detached cubes establish scale.
5. **The scene is cinematic, not game-like.** Interaction reveals depth without becoming a cursor toy.

The prototype recreates this visual grammar instead of attempting a cube-for-cube copy.

## Locked Product Decisions

| Area | Decision |
|------|----------|
| Fidelity | Generate a living procedural interpretation, not an exact reconstruction. |
| Eventual role | Candidate replacement for the dotted background across the website. |
| Current scope | Isolated prototype only; do not modify the production site. |
| Motion | Slow breathing, drifting particles, sparse energy pulses, subtle pointer parallax, tiny scroll depth. |
| Composition | Large central reading void with asymmetric edge-anchored formations. |
| Stability | Fixed seed so the composition is recognizable on every load. |
| Content test | Representative real portfolio content over the scene. |
| Content surface | No opaque or frosted content card; negative space must provide readability. |
| Theme | Dark mode first; design light mode separately. |
| Desktop/mobile | Full desktop scene; quieter mobile scene with a protected reading region. |
| Performance | Aim for 60 fps on a typical modern laptop and 30 fps on supported phones. |
| Accessibility | Reduced-motion behavior and static non-WebGL fallback. |
| Exploration | Tuning controls and shareable rendering treatments. |

## Outcome and Verdict

### What succeeded

- The central reading void remains clean without placing content on a card.
- Dense crystalline walls feel visually strong enough to become part of the site's identity.
- Real portfolio content remains readable at desktop width.
- A fixed cube seed makes visual iteration repeatable.
- Pointer parallax reveals dimensionality without direct cube interaction.
- The fixed background works while a long document scrolls above it.
- A mobile-specific composition retains crystalline identity while protecting the reading band.
- The tuning panel displayed approximately `60 fps` in the tested desktop browser.
- The isolated production build passes.

### What remains unproven

- Performance across a representative range of physical phones, GPUs, and browsers.
- Readability behind every production route, especially long-form writing.
- Whether a persistent WebGL canvas justifies its bundle and battery cost.
- A light-mode visual language.
- Robust WebGL context-loss recovery.
- Automated visual regression coverage.

## Run and Build

```bash
cd prototypes/crystalline-void
npm install
npm run dev
```

Vite normally serves the prototype at `http://127.0.0.1:5173/`.

Build verification:

```bash
npm run build
```

The build succeeds. Vite reports a non-blocking warning because the prototype JavaScript chunk is approximately `505 kB` before gzip and `128 kB` after gzip. Treat that as expected prototype debt, not an acceptable production baseline.

## Rendering Treatments

| Query | Name | Purpose |
|-------|------|---------|
| `?variant=crystal` | A — Crystal | Default and closest to the source: dark cores, cyan shells, wire edges, and colored internal energy. |
| `?variant=monolith` | B — Monolith | Larger, darker, lower-density architecture. |
| `?variant=wireframe` | C — Signal Lattice | Technical/debug-like edge treatment emphasizing spatial structure. |

The floating bottom switcher and left/right arrow keys cycle treatments. `history.replaceState` updates the URL so a choice can be shared and reloaded.

The current recommendation is **Crystal**. Monolith and Signal Lattice are comparison tools, not selected production directions.

## File Map

```text
prototypes/crystalline-void/
  index.html              Representative portfolio DOM and controls
  package.json            Isolated Vite/Three.js dependencies and scripts
  package-lock.json       Isolated dependency lock
  tsconfig.json           Strict prototype TypeScript configuration
  README.md               Quick-start and evaluation guide
  src/
    config.ts             Defaults, variants, and quality selection
    composition.ts        Seeded procedural cube generation
    crystalline-scene.ts  Three.js scene, materials, effects, and animation
    main.ts               DOM wiring, controls, variants, and fallback boot
    styles.css            Content, canvas layering, UI, and responsive styling
```

The production Next.js application does not import any prototype file.

## Runtime Architecture

```text
URL variant + defaults
        |
        v
  main.ts bootstrap
     /          \
DOM controls   CrystallineScene
     |              |
     |              +--> quality resolution
     |              +--> seeded composition
     |              +--> instanced render groups
     |              +--> particles and fog
     |              +--> render pass and bloom
     |              +--> animation loop
     |
     +--> live update or debounced structural rebuild

Representative content remains normal selectable DOM above the canvas.
```

There is no backend, persistence, authentication, analytics, or network data flow.

## Composition Generator

Implementation: [`composition.ts`](../prototypes/crystalline-void/src/composition.ts)

### Seeded random source

The generator hashes a string using an FNV-like integer hash and advances a compact deterministic pseudo-random function. The effective seed includes the variant:

```text
${config.seed}:${config.variant}
```

Consequences:

- The same seed and variant recreate the same cube architecture.
- Changing variant changes the composition as well as the material treatment.
- `new seed` creates an in-memory exploration seed.
- The authored default remains `stephen-crystalline-void-07`.

The helper `bell(random)` sums three uniform samples and subtracts `1.5`, producing a cheap center-weighted distribution. Clusters are dense near their anchors and sparse around their boundaries.

### Authored cluster system

Six anchors form the world:

- upper-left, magenta-biased;
- left-middle, cyan;
- lower-left, orange-biased;
- upper-right, cyan;
- right-middle, magenta-biased;
- lower-right, cyan.

The global palette remains cyan-dominant:

- about `63%` of rolls are forced toward cyan;
- rolls above `91%` become orange;
- the middle range can preserve an anchor's magenta/orange bias;
- records above the `0.62` brightness threshold can receive an energy core.

### Voxel character

Positions are quantized rather than continuous:

- Crystal/Signal Lattice grid unit: `0.38` world units.
- Monolith grid unit: `0.58` world units.

Cube sizes use four tiers, producing many small blocks, a middle population, occasional large masses, and rare hero blocks. Each axis receives independent variation so formations do not read as a uniform grid.

Every cube uses a slightly tilted base orientation with small jitter:

```text
x rotation ≈ -0.16 radians
y rotation ≈ -0.24 radians
z rotation ≈ near zero
```

This tilt is essential. Earlier near-zero rotations made the objects read as flat squares because too little of the side and top faces was visible.

### Desktop reading void

Desktop width follows camera aspect. Main anchors sit around `68%` of the visible half-width, with side-middle clusters near `80%`.

A candidate cube is normally rejected when:

```text
abs(x) < (5.05 * safeZone) + cubeSize
abs(y) < 82% of half-height
```

Approximately `5.5%` of rejected desktop candidates are allowed through to keep the boundary organic. These intrusions remain sparse and near the edge of the clearing.

### Mobile composition

Portrait mode is `aspect < 0.8`. Mobile must use its true narrow camera width:

```text
halfWidth = halfHeight * aspect
```

Do not reuse the desktop minimum world width. An earlier version did so and placed almost all mobile cubes outside the camera.

Mobile rejects every main-cluster cube across the central vertical band:

```text
abs(y) < 68% of half-height
```

This concentrates formations near the top and bottom. Only a few small detached cubes appear through the middle.

### Detached depth cubes

- Desktop target: `40 * qualityScale`.
- Mobile target: `8 * qualityScale`.
- Size: roughly `0.12–0.36` world units.
- Placement: outside the safe horizontal region and across multiple Z planes.

## Rendering Pipeline

Implementation: [`crystalline-scene.ts`](../prototypes/crystalline-void/src/crystalline-scene.ts)

### Core renderer settings

| Setting | Value |
|---------|-------|
| Renderer | `THREE.WebGLRenderer` |
| Antialias | Disabled |
| Power preference | `high-performance` |
| Output | sRGB |
| Tone mapping | ACES Filmic |
| Exposure | `0.94` |
| Camera | Perspective, `43°` FOV |
| Near/far | `0.1 / 80` |
| Camera Z | `17` |
| Background | `#01050d` |
| Fog | `FogExp2`, `#031020`, default `0.018` |

### Instanced visual layers

One cube record can appear in multiple instanced layers:

| Layer | Behavior | Purpose |
|-------|----------|---------|
| Solid core | Dark `MeshBasicMaterial` | Mass and black-blue silhouette. |
| Shell | Slightly enlarged additive cyan box | Cheap transparent-volume illusion. |
| Wire | Slightly larger wireframe box | Reveals edges and layered structure. |
| Energy core | Smaller additive cyan/magenta/orange box | Localized internal light and palette hierarchy. |

All layers use `InstancedMesh`. Shell, wire, and energy size multipliers are applied during each instance matrix composition. Never resize individual cubes by scaling the entire `InstancedMesh`: that also scales instance positions around the origin and pulls formations into the reading void.

### Stylized glass strategy

True refraction across hundreds of overlapping boxes is expensive and prone to sorting artifacts. The validated illusion combines:

- dark cores;
- low-opacity additive shells;
- additive wire edges;
- smaller internal light boxes;
- exponential fog;
- bloom;
- edge-biased CSS haze;
- sparse particles.

Keep this art-directed strategy unless a later performance budget explicitly supports transmission/refraction.

### Per-instance color warning

An earlier version used `InstancedMesh.setColorAt()` and `vertexColors`. In the tested browser/GPU path, those groups rendered near-black even though record count, bounds, camera, and matrices were correct.

The validated workaround is:

- uniform cyan/dark materials for large structural groups;
- three separate energy-core instanced meshes with uniform cyan, magenta, or orange materials;
- record filtering based on stored color role.

Do not casually reintroduce per-instance material color. If revisiting it, validate every target browser first.

### Post-processing and atmosphere

The composer uses `RenderPass` followed by `UnrealBloomPass`.

Current bloom defaults:

```text
strength  = 0.85
radius    = 0.55
threshold = 0.34
```

Text is DOM above the canvas and never enters bloom.

Atmosphere combines exponential fog, an additive side-biased particle field, and CSS radial haze. The cube world is deterministic, but particles currently use `Math.random()`. Production should seed particles from the same world seed.

## Motion and Interaction

### Pointer parallax

Pointer coordinates are normalized to `[-1, 1]` and damped using frame-rate-independent exponential interpolation:

```text
smoothPointer.lerp(pointer, 1 - exp(-dt * 2.4))
```

Camera movement stays below one world unit. Mobile reduces pointer influence to `25%`.

### Scroll response

The fixed camera receives a tiny vertical shift:

```text
-scrollY * 0.00024
```

This must remain subtle. The world should feel deep and fixed, not attached to the document.

### Ambient behavior

- Root rotation is only a few thousandths of a radian.
- Solid geometry breathes by about `±0.4%` at the default motion setting.
- Three energy groups pulse using slow, slightly different sine frequencies.
- Particles rotate and drift vertically at very low amplitude.

`prefers-reduced-motion: reduce` sets continuous motion intensity to zero while preserving the scene. Hidden documents skip rendering. Production should observe preference changes live instead of reading reduced motion only at construction.

## Quality Tiers

| Tier | Cube multiplier | DPR cap | Particles |
|------|-----------------|---------|-----------|
| High | `1.00` | `1.65` | `560` |
| Medium | `0.72` | `1.25` | `330` |
| Low | `0.44` | `1.00` | `150` |

Automatic selection currently uses viewport/pointer signals, device pixel ratio, and optional `navigator.deviceMemory`:

- coarse pointer, width below `700px`, or memory at/below `4 GB` → Low;
- high DPR or memory at/below `8 GB` → Medium;
- otherwise → High.

These are prototype heuristics. Production should measure frame time during a short warmup and step down when sustained frame time is poor.

## Tuning Panel

The panel exposes:

- density;
- center clearing;
- glow/bloom;
- fog;
- motion;
- pointer depth;
- quality tier;
- new exploration seed;
- reset;
- pause/resume;
- copy configuration;
- live FPS.

Density and clearing trigger debounced scene rebuilds. Glow, fog, motion, and pointer update live. Quality and variant changes rebuild. State is memory-only; only the variant survives via the URL.

## Iteration History and Critical Failures

### 1. Initial field invaded the content

The first composition looked like colored blocks behind text. The safe region was too narrow, cluster spread reached too far inward, and cubes were too front-facing.

Fixes: widen the safe region, tighten spread, increase shared cube tilt, and evaluate against real content rather than an empty canvas.

### 2. A center vignette concealed the scene

A CSS center mask improved readability but hid formations and composition mistakes.

Fix: remove the center mask and make procedural rejection responsible for the void. Keep only subtle edge haze.

### 3. Energy groups collapsed toward the origin

Calling `mesh.scale.setScalar(0.46)` on an `InstancedMesh` changed both cube sizes and positions. Bright edge cubes moved into the center.

Fix: multiply each record's scale while composing its matrix; keep the instanced group transform at identity.

### 4. Per-instance colors rendered near-black

The generator reported over one thousand records and hundreds inside the camera, yet most geometry remained invisible. A temporary ordinary `Mesh` proved the camera and post-processing were working. Removing `setColorAt()` made the full field render immediately.

Fix: uniform structure materials and separate color-specific energy meshes.

### 5. The revealed field was overexposed

Once visible, additive shells, wires, and energy combined into white walls.

Fixes: lower exposure and bloom, darken solid cores, lower shell/wire opacity, shrink energy cores, and reduce energy opacity.

### 6. Mobile formations were offscreen

A desktop-like minimum world width placed portrait clusters beyond the camera.

Fix: calculate mobile width directly from aspect ratio.

### 7. Corrected mobile formations covered text

Moving clusters onscreen caused desktop-style side walls to consume the narrow reading area.

Fix: reject all main clusters in the middle `68%` of mobile world height and retain only top/bottom formations plus eight quality-scaled detached cubes.

## Validation Performed

- Strict TypeScript compilation with `tsc --noEmit`.
- Vite production build.
- Desktop visual inspection against the concept.
- Portrait inspection at `390 × 844`.
- Representative homepage readability.
- Long-content fixed-background scrolling.
- Crystal, Monolith, and Signal Lattice URL variants.
- Tuning-panel expansion and live controls.
- Variant switching and URL synchronization.
- Final browser console inspection with no errors or warnings.
- Approximately `60 fps` observed in the tested desktop browser.

## Known Prototype Debt

1. Particle positions are not seeded.
2. Resize and visibility listeners use anonymous callbacks and are not fully removed by `dispose()`.
3. WebGL context loss/restoration is not handled.
4. Reduced-motion changes are not observed after construction.
5. Quality is heuristic; there is no adaptive frame-time controller.
6. No automated tests or screenshot baselines were added.
7. The bundle is too large for blind production inclusion.
8. Materials are stylized, not physically refractive.
9. Lights have limited effect because validated structure materials are `MeshBasicMaterial`.
10. `CubeRecord.phase` is reserved but currently unused.
11. Resize rebuilds are immediate and allocate new scene resources.
12. Shared box-geometry ownership/disposal needs an explicit production lifecycle.
13. The CSS fallback is atmospheric and does not reproduce cube architecture.
14. The content snapshot is duplicated HTML and must never become a production source of truth.

## Recommended Next Steps

### Phase 1 — Select and tune the winner

1. Compare all treatments at the top, middle, and bottom of the page.
2. Test slightly lower Crystal density and at least two clearing values.
3. Save promising settings with **copy configuration**.
4. Confirm Crystal or specify which parts to borrow from the other treatments.
5. Record the final seed and settings in `docs/shader-ideas-log.md`.

### Phase 2 — Validate feasibility

1. Test Safari, Chrome, and Firefox.
2. Test Apple Silicon, an integrated-GPU laptop if available, and two physical phones.
3. Measure frame time and long frames, not only average FPS.
4. Measure battery and thermal behavior during a five-minute idle session.
5. Compare live WebGL with a prerendered WebP/AVIF fallback.
6. Set production budgets for JavaScript, GPU memory, render targets, and instance count.

### Phase 3 — Rewrite as a production renderer

Do not directly move the prototype class into `app/layout.tsx`.

1. Create a client-only background component with a small lifecycle API.
2. Dynamically import Three.js code after initial content is interactive.
3. Seed cubes and particles from one seed.
4. Implement complete listener and resource cleanup.
5. Add context-loss handling.
6. Add measured adaptive-quality step-down.
7. Pause when hidden and when rendering is unnecessary.
8. Observe reduced-motion and theme changes live.
9. Keep canvas decorative and content as selectable DOM.
10. Render the static fallback immediately and crossfade after the first successful WebGL frame.

### Phase 4 — Feature-flagged site integration

1. Mount behind `.site-canvas` without removing the dotted grid.
2. Gate with a local feature flag or query parameter.
3. Test `/`, `/projects`, `/writing`, and `/writing/[slug]`.
4. Verify command palette, focus rings, text selection, and theme controls.
5. Decide whether the renderer persists across route changes.
6. Remove the dotted grid only after route-wide readability succeeds.

### Phase 5 — Design light mode separately

Do not invert the dark scene. Explore translucent paper crystals, architectural white resin, pale cyan glass over warm stone, or a simplified topographic/voxel language.

### Phase 6 — Production verification

1. Unit-test seed determinism and safe-zone rejection.
2. Add screenshot baselines for desktop, tablet, and mobile.
3. Test reduced motion and fallback behavior.
4. Track initialization cost and frame time in development.
5. Add a performance ceiling to CI if a reliable headless GPU environment is available.

## Guidance for Future Agents

1. Read this handoff and the co-design plan before editing.
2. Treat the center void, fixed seed, cyan dominance, and low-amplitude interaction as requirements.
3. Do not modify the production website without explicit authorization.
4. Keep experiments isolated until a production rewrite is approved.
5. Use the real content overlay for every visual decision.
6. Inspect actual desktop and portrait frames after composition or material changes.
7. Wait for WebGL to settle before judging screenshots; immediate reloads can show transient compositor artifacts.
8. Never scale an instanced group to resize its cubes.
9. Do not reintroduce per-instance colors without cross-browser testing.
10. Prefer composition-based readability over a content-shaped black overlay.
11. Save every promising seed/configuration before replacing it.
12. Update `docs/shader-ideas-log.md` after meaningful evaluation rounds.

## Definition of Ready for Production Integration

The direction is ready only when:

- one treatment and configuration are selected;
- physical-device tests meet the frame-time budget;
- a static fallback is approved;
- lifecycle and context-loss handling are complete;
- cubes and particles are deterministic;
- reduced motion is verified;
- all site routes remain readable;
- light mode is implemented or the renderer is intentionally dark-only;
- bundle loading and route persistence are decided;
- production integration is explicitly authorized.

## Production Integration — July 18, 2026

The selected Crystal treatment is now integrated into the real portfolio shell. The implementation is a production rewrite, not a copy of the prototype renderer.

### Visual direction

The original electric cyan/magenta palette was replaced because it read as generically AI-generated. The production palette uses:

- deep moss and forest-green structure in dark mode;
- muted ochre, antique gold, and restrained amber for energy cells;
- warm near-black instead of blue-black for the dark surface;
- pale sage, mineral grey-green, and warm stone for light mode;
- lower bloom and opacity than the prototype, especially in light mode.

The composition remains deterministic and preserves the signature central void. Desktop uses left/right formations. Portrait layouts reject formations from the middle reading band and emphasize the top/bottom edges.

### Production files

- `components/crystalline-background.tsx` is the client boundary. It dynamically imports the renderer, marks the first successful frame, preserves the CSS fallback on failure, and disposes the renderer on unmount.
- `lib/crystalline-background/composition.ts` owns the deterministic PRNG, cube records, desktop/portrait placement rules, detached cubes, and energy-role assignment.
- `lib/crystalline-background/renderer.ts` owns Three.js setup, instancing, bloom, particles, quality tiers, theme changes, reduced motion, visibility pausing, responsive rebuilding, context-loss handling, and resource cleanup.
- `app/layout.tsx` mounts the decorative background once behind the shared portfolio shell so it persists across routes.
- `app/globals.css` supplies the immediate no-WebGL fallback, stacking context, canvas crossfade, theme surfaces, and reduced-motion transition rule. The old dotted background has been removed.
- `package.json` adds `three`; development types are supplied by `@types/three`.
- `eslint.config.mjs` ignores generated `dist` and dependency folders so repository linting evaluates source rather than the prototype build output.

### Lifecycle and accessibility behavior

- The canvas is decorative, pointer-transparent, and never replaces selectable DOM content.
- WebGL is dynamically loaded after the client mounts.
- A CSS green/gold atmosphere appears immediately and remains if WebGL startup fails.
- The canvas fades in only after the renderer reports a successful frame.
- Theme changes rebuild materials and particles against separate light/dark palettes.
- Reduced motion renders a stable frame and responds to preference changes at runtime.
- Rendering pauses while the document is hidden.
- Named event handlers and Three.js resources are removed by `dispose()`.
- A fixed seed makes both cube placement and particles stable across reloads.
- Quality starts from pointer type, viewport/device memory, and pixel ratio, then can step down from measured frame time.

### Important compositor detail

`UnrealBloomPass` does not reliably preserve a transparent alpha channel. A transparent composer therefore produced a black buffer in light mode even though the scene background was `null`. The production renderer deliberately clears to the current theme's surface color with full alpha. This keeps bloom predictable and makes the canvas visually identical to the page surface wherever no geometry is present.

### Verification completed

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- visual inspection in dark and light themes at the default desktop viewport
- visual inspection at `390 × 844` in dark and light themes
- live theme switching without renderer failure
- central reading-lane inspection against real homepage content
- browser-log inspection with no renderer errors

The browser still reports a pre-existing Next.js warning for `/assets/logos/hsu-logo.png` because CSS changes only one image dimension. It is unrelated to the background integration.

### Remaining next steps

1. Inspect `/projects`, `/writing`, and a long `/writing/[slug]` page at desktop and mobile sizes.
2. Test Safari and Firefox, with particular attention to bloom, WebGL context restoration, and fixed-canvas scrolling.
3. Test at least one physical iPhone and one lower-power Android device for thermals and sustained frame time.
4. Add unit tests for seed determinism and portrait safe-zone rejection.
5. Add screenshot baselines for the four validated theme/viewport combinations.
6. Consider a prerendered AVIF fallback if physical-device testing shows the live canvas is too expensive.
7. Fix the separate HSU logo aspect-ratio warning.
8. Revisit density and gold intensity only after judging the background behind the longest article; avoid increasing saturation before that route-wide check.
