# Crystalline Void Background Prototype

> Co-design plan — 2026-07-17
> Status: Prototype implemented and visually validated
>
> Implementation handoff: [`docs/crystalline-void-prototype-handoff.md`](../docs/crystalline-void-prototype-handoff.md)
>
> Note: The checklists below preserve the original planned scope; use the handoff's “Validation Performed” and “Known Prototype Debt” sections as the actual completion record.

## Problem & Goals

Build an isolated, interactive prototype of a crystalline voxel background inspired by the supplied GPT Image 2 concept. The prototype should test whether a dramatic 3D environment can eventually replace the portfolio's dotted background without compromising the site's narrow, editorial reading experience.

The prototype must remain separate from the production Next.js application. It should recreate the concept's visual grammar rather than copy its exact cube placement: dense edge formations surround a dark central void, cyan carries most of the structure, magenta and orange act as localized energy sources, and fog plus sparse detached cubes create depth.

The goal is to validate composition, motion, readability, interaction, responsiveness, and rendering cost before making any website integration decision.

## Success Criteria

- [ ] At rest, the scene feels like a living version of the concept image: crystalline, deep, asymmetrical, and atmospheric.
- [ ] A fixed procedural seed produces the same recognizable composition on every load.
- [ ] Dense formations remain anchored around the viewport perimeter while a configurable central safe region protects the content column.
- [ ] Representative portfolio content remains comfortably readable without an opaque card or visible backing panel.
- [ ] Pointer movement reveals depth through damped camera parallax without making the scene feel cursor-driven.
- [ ] Scrolling produces only a restrained depth shift while the WebGL scene stays fixed behind the document.
- [ ] Ambient motion is slow and cinematic: gentle breathing, drifting haze, sparse cube pulses, and restrained detached-cube movement.
- [ ] The prototype targets 60 fps on a typical modern laptop and at least 30 fps on supported phones.
- [ ] Mobile uses a quieter composition with fewer cubes, weaker post-processing, and a proportionally larger content clearing.
- [ ] Reduced-motion mode removes continuous motion while preserving a composed static scene.
- [ ] Unsupported or failed WebGL initialization produces a deliberate static dark fallback.
- [ ] A collapsible tuning panel exposes the important artistic and performance parameters without being part of the final visual composition.
- [ ] No production application files, routes, styles, dependencies, or components are modified.

## Design Decisions

| Area | Decision | Alternatives Considered | Rationale |
|------|----------|-------------------------|-----------|
| Fidelity | Preserve the reference's visual grammar with a procedural composition | Exact cube-for-cube recreation; flat image animation | Procedural generation creates real depth and motion while a fixed seed retains an authored identity. |
| Prototype boundary | Create an independent project under `prototypes/crystalline-void/` | Add a hidden Next.js route; alter the current site background | Isolation prevents experiments and dependencies from affecting the production website. |
| Rendering stack | Vite, TypeScript, and Three.js | Raw WebGL; React Three Fiber; CSS-only effects | Three.js provides the required rendering primitives and post-processing with less prototype overhead; React adds little value to this scene-first experiment. |
| Geometry strategy | Use seeded instanced cube populations split into material/render groups | Hundreds of independent meshes; full-screen raymarching | Instancing makes a dense voxel field practical while separate groups allow different dark, luminous, and translucent treatments. |
| Glass treatment | Use stylized translucent shells, dark cores, emissive faces, and edge highlights | Physically accurate refraction/transmission | The stylized approach better preserves performance and legibility across a large population of overlapping cubes. |
| Composition | Anchor asymmetric formations to edges and corners around a protected central void | Uniform cube field; symmetric frame; content card | The negative space is the reference's main compositional device and lets content sit directly in the scene. |
| Color | Cyan-dominant structure with localized magenta and orange energy regions | Even rainbow distribution; monochrome | Uneven color roles reproduce the hierarchy and heat-source feeling of the reference. |
| World stability | Use a fixed default seed with a temporary “new seed” exploration control | New random world per visit | A stable scene can become recognizable visual identity and makes comparisons repeatable. |
| Content test | Recreate a visual snapshot of the real portfolio header and homepage copy | Lorem ipsum; no overlay content | Real line lengths, navigation, and hierarchy are necessary to judge readability honestly. |
| Content surface | Place content directly over the central void with no visible backing card | Opaque column; frosted-glass card | The void and localized contrast should carry readability without weakening the cinematic composition. |
| Pointer interaction | Apply low-amplitude, spring-damped camera parallax | Direct cube repulsion; cursor light; click explosions | Camera parallax reveals three-dimensionality while remaining unobtrusive during reading. |
| Scroll interaction | Keep the canvas fixed and map scroll to a very small depth/fog offset | Move the whole world with the page; large scroll choreography | A subtle response gives continuity without competing with content navigation. |
| Desktop/mobile | Full desktop composition; reduced mobile density, bloom, fog, pixel ratio, and motion | Identical rendering everywhere; static-only mobile | Mobile should retain the identity while respecting smaller screens, thermal limits, and touch interaction. |
| Accessibility | Respect `prefers-reduced-motion` with a stable static scene | Hide the scene entirely; ignore the preference | A composed static frame preserves the design while removing nonessential motion. |
| Quality control | Automatic quality tier plus manual tuning controls | One fixed quality level | Adaptive limits provide a realistic path to acceptable laptop and phone performance. |
| Prototype theme | Dark mode only | Simultaneous light-mode design; simple inversion | The supplied concept is inherently dark; a light interpretation should be designed separately after validation. |

## Architecture Overview

The prototype is a separate Vite application. A small DOM shell supplies representative content and the tuning interface. A Three.js renderer owns one fixed full-viewport canvas behind that content.

```text
Seeded configuration
        |
        v
Composition generator -----> Cube instance groups
        |                          |
        |                          v
        +------------------> Three.js scene
                                   |
Pointer + scroll ----------> Camera controller
Time + reduced motion -----> Animation controller
Quality tier --------------> Renderer / effects settings
                                   |
                                   v
                     Render pass -> bloom -> screen

Representative content DOM ----------------------^ (layered above canvas)
Tuning panel --------> live configuration + regenerate/rebuild actions
```

### Proposed module boundaries

```text
prototypes/crystalline-void/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    main.ts                  # Bootstraps DOM, renderer, lifecycle, and fallback
    styles.css               # Canvas, content snapshot, panel, responsive styles
    scene/
      create-scene.ts        # Renderer, scene, camera, lights, post-processing
      composition.ts         # Seeded cluster and detached-cube generation
      cube-field.ts          # Instanced geometry and material populations
      crystalline-materials.ts
      atmosphere.ts          # Fog, haze cards/volume approximation, particles
      animation.ts           # Ambient pulses, breathing, and per-frame updates
      camera-controller.ts   # Damped pointer and scroll response
    config/
      defaults.ts            # Authored seed and approved starting values
      quality.ts             # Desktop/mobile/automatic quality tiers
      schema.ts              # Typed tunable configuration
    ui/
      content-snapshot.ts    # Representative portfolio markup
      tuning-panel.ts        # Collapsible controls and seed exploration
      fallback.ts            # Static non-WebGL presentation
    utils/
      seeded-random.ts
      performance-monitor.ts
```

The exact file split may be reduced during implementation if a module would contain only trivial forwarding code. The boundaries—composition, rendering, behavior, quality, and UI—should remain distinct.

## Data Model

No database or persistent user data is required. Runtime state consists of typed configuration and generated instance records.

```text
SceneConfig
  - seed: string
  - safeZone: { width, feather, verticalBias }
  - clusters: { count, density, spread, cubeSizeRange, depthRange }
  - palette: { cyan, magenta, orange, dark, background }
  - materials: { shellOpacity, emission, edgeStrength, roughness }
  - atmosphere: { fogDensity, hazeStrength, particleCount }
  - motion: { breathing, pulseRate, drift, pointerInfluence, scrollInfluence }
  - postprocessing: { bloomStrength, threshold, radius }
  - quality: auto | high | medium | low

CubeInstance
  - position: Vector3
  - scale: Vector3
  - rotation: Euler or Quaternion
  - clusterId: number
  - visualClass: dark | shell | emissive | detached
  - colorRole: cyan | magenta | orange | neutral
  - phase: number
  - pulseWeight: number
```

Configuration lives in memory. The chosen default seed and final tuned values are committed as source constants. The tuning panel may serialize a configuration snapshot to the clipboard for iteration, but it does not need storage or a backend.

## API / Backend

There is no backend, authentication, network API, or analytics in the prototype.

Internal interfaces should separate expensive rebuild operations from live uniform/property updates:

| Interface | Purpose |
|-----------|---------|
| `createComposition(config)` | Deterministically generate cluster and cube instance data from a seed. |
| `rebuildScene(config)` | Replace geometry/material groups after structural settings or seed changes. |
| `updateVisuals(config)` | Apply inexpensive lighting, fog, motion, and post-processing changes live. |
| `setQualityTier(tier)` | Apply pixel ratio, instance-count, haze, and bloom limits. |
| `updateInteraction(pointer, scroll, dt)` | Advance damped camera and atmospheric response. |
| `dispose()` | Release geometries, materials, render targets, listeners, and animation loops. |

## Frontend

- **Page:** One standalone prototype page with a fixed WebGL background, long representative content, and a collapsible tuning panel.
- **Canvas layer:** Full viewport, fixed, non-interactive at the DOM level, and visually behind all content.
- **Content layer:** A close visual snapshot of the real portfolio's narrow column, header, homepage sections, CTA, and enough continuation content to test scrolling.
- **Tuning layer:** A compact panel that can collapse completely and remains above the content only while testing.
- **Fallback layer:** A dark radial/gradient composition that preserves the central void and basic color placement when WebGL is unavailable.
- **Data flow:** Defaults initialize the seeded composition. Controls update configuration; cheap values update immediately, while structural controls debounce a deterministic scene rebuild. Pointer and scroll input feed damped controllers rather than mutating cubes directly.

### Initial tuning controls

- Fixed seed and “new seed” exploration action
- Cube density and cluster spread
- Central safe-zone width and feathering
- Shell opacity, edge intensity, and emissive intensity
- Cyan/magenta/orange balance
- Fog density and haze strength
- Bloom strength and radius
- Ambient motion, pulse frequency, pointer influence, and scroll influence
- Automatic/high/medium/low quality tier
- Pause motion and reset-to-defaults actions
- Optional performance readout while the panel is open

## Implementation Steps

### Phase 1: Isolated prototype shell

- [ ] Create `prototypes/crystalline-void/` as a self-contained Vite + TypeScript application.
- [ ] Add Three.js and only the small development/runtime dependencies needed by the isolated prototype.
- [ ] Add run and build instructions in the prototype directory.
- [ ] Establish the fixed canvas, DOM layering, responsive content column, and dark static fallback.
- [ ] Recreate a representative snapshot of the current portfolio content without importing production components.
- [ ] Add enough vertical content to verify fixed-background scrolling behavior.
- [ ] Confirm that the production Next.js package and source tree remain unchanged.

### Phase 2: Deterministic crystalline composition

- [ ] Implement a tested seeded pseudo-random generator.
- [ ] Define edge and corner cluster anchors with intentionally uneven color roles.
- [ ] Generate stepped, multi-scale cube formations with a center-safe-zone rejection/attenuation function.
- [ ] Add sparse detached cubes across multiple depth planes.
- [ ] Split generated cubes into efficient instanced render groups by visual treatment.
- [ ] Author the default seed and starting composition against the reference image.
- [ ] Verify deterministic output for the same seed and visibly different output for exploration seeds.

### Phase 3: Crystalline rendering and atmosphere

- [ ] Build dark-core, translucent-shell, emissive, and edge-highlight material treatments.
- [ ] Establish cyan as the dominant structural light and constrain magenta/orange to localized regions.
- [ ] Add restrained scene lighting that reveals cube silhouettes without flattening the void.
- [ ] Add depth fog, layered haze, and sparse particles without obscuring text.
- [ ] Add selective or carefully thresholded bloom so text and UI do not glow.
- [ ] Tune near/mid/far depth layers and camera framing to resemble the reference's scale.
- [ ] Check for transparency sorting artifacts and replace problematic shells with cheaper stylized treatments if needed.

### Phase 4: Motion and interaction

- [ ] Add slow, low-amplitude breathing across cluster groups.
- [ ] Add infrequent deterministic emissive pulses and minimal detached-cube drift.
- [ ] Implement spring-damped pointer camera parallax with strict amplitude limits.
- [ ] Map page scroll to a very small camera/fog depth response.
- [ ] Pause or throttle rendering when the document is hidden.
- [ ] Implement reduced-motion behavior that renders a stable authored frame with no continuous animation.

### Phase 5: Tuning and quality controls

- [ ] Implement a collapsible prototype-only tuning panel.
- [ ] Separate cheap live adjustments from debounced structural rebuilds.
- [ ] Add seed exploration, reset, pause, quality selection, and optional FPS readout.
- [ ] Add a way to copy the current configuration as JSON for comparison and handoff.
- [ ] Implement automatic desktop/mobile quality selection using conservative feature and viewport signals.
- [ ] Cap device pixel ratio and scale instance counts, fog layers, particles, and post-processing by quality tier.
- [ ] Ensure resize and orientation changes preserve the central safe region.

### Phase 6: Visual and performance validation

- [ ] Compare desktop screenshots against the reference for silhouette, negative space, depth, and color hierarchy.
- [ ] Test content legibility at the top, middle, and bottom of the representative page.
- [ ] Tune the default seed and values until the scene recedes while reading and reveals depth on interaction.
- [ ] Measure frame pacing on a modern laptop at representative viewport sizes.
- [ ] Verify the quiet mobile tier at narrow portrait and landscape sizes.
- [ ] Verify reduced motion, WebGL failure fallback, tab visibility behavior, resize, and cleanup.
- [ ] Run the isolated production build and document any visual or performance limitations discovered.
- [ ] Record the selected seed, tuned parameters, rejected settings, and conclusions in the shader exploration log only after prototype evaluation.

## Testing Strategy

- **Unit tests:** Seed determinism, safe-zone attenuation/rejection, cluster bounds, quality-tier selection, and configuration normalization.
- **Integration tests:** Prototype boot, WebGL failure fallback, control-driven rebuilds, resize behavior, reduced-motion initialization, and disposal where practical.
- **Visual checks:** Capture consistent desktop and mobile frames using the fixed seed; compare composition, central clearing, color concentration, and content contrast.
- **Performance checks:** Observe average FPS and frame spikes with the panel closed; verify pixel-ratio and instance-count reductions by tier; check that hidden tabs stop or throttle work.
- **Manual interaction:** Read and scroll the full content column, move the pointer slowly and quickly, leave the scene idle, resize the window, rotate a mobile viewport, and test touch-only behavior.
- **Accessibility:** Confirm the DOM content remains normal selectable text, keyboard focus is visible, the tuning panel is keyboard operable, the canvas is decorative, and reduced motion removes continuous movement.
- **Isolation check:** Review the final diff to verify that changes are confined to the prototype directory, this plan, and—after evaluation only—the existing shader ideas log.

## Out of Scope

- Integrating the renderer into the production Next.js layout or replacing the current dotted background.
- Reusing production components or changing the existing homepage content/styles.
- Designing the eventual light-mode interpretation.
- Physically accurate multi-object refraction, path tracing, or photoreal glass simulation.
- Click interactions, cube explosions, cursor attraction/repulsion, or game-like controls.
- Randomizing the final composition on every visit.
- Persisting user settings, analytics, accounts, APIs, or backend services.
- Guaranteeing support for devices without WebGL; they receive the static fallback.
- Final production bundle optimization, route-transition integration, or cross-page renderer persistence.

## Open Questions

No questions block prototype implementation. Evaluation should answer these follow-ups before any production integration:

- Does the crystalline identity remain tasteful behind every route, especially long-form writing pages?
- Is the chosen desktop composition still recognizable after mobile quality reductions?
- Which stylized shell treatment provides the best glass illusion without transparency artifacts?
- What final seed and tuning values should become the authored production default?
- Should the eventual light theme use a paper-crystal, architectural, or entirely separate visual language?
- Is the rendering cost justified compared with a prerendered or hybrid fallback for production?
