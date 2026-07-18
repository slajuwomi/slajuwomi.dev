# Shader Ideas Log

This is the working record for background-shader exploration on slajuwomi.dev. Update it after each prototype round so promising directions, rejected ideas, and the reasons behind those decisions are not lost.

## Design constraints

- The shader should feel distinctive enough to become part of the site's identity.
- It must support the portfolio instead of competing with the narrow reading column.
- Interaction should reveal character rather than be required to understand the effect.
- Light and dark themes both need an intentional treatment.
- Motion must have a reduced-motion fallback.
- The production version should degrade gracefully on low-power and touch devices.

## Preference signals

- Stephen likes game development, pixel art, and voxel art.
- Strong visual structure is more compelling than generic fluid motion.
- The effect can be striking, but should remain tasteful around editorial content.

## Current leader

### Topographic Ether

**Status:** Strong contender — prototype this direction further.

A flowing height field expressed through animated topographic contour lines. The surface bends the site's dot grid, while pointer movement creates a temporary hill, basin, or pressure wave.

What worked:

- It had a recognizable visual language rather than reading as another ambient blob effect.
- The contour system connected naturally to the site's existing geometric dot grid.
- It balanced organic movement with a technical, simulation-like appearance.
- It remained visually interesting in monochrome.

Promising extensions:

- Render the field as discrete terrain elevations instead of perfectly smooth noise.
- Let contour lines break into pixel stair-steps as they approach the pointer.
- Add rare map-like features: peaks, craters, rivers, or coordinate markers.
- Use scroll position as altitude, gradually revealing different terrain layers.
- Explore a voxel interpretation where contour bands occasionally lift into shallow 3D terraces.

## Saved concepts

### Marching-Squares World

**Status:** Saved contender — selected after prototype round 2.

A deliberately low-resolution scalar field is divided into discrete terrain bands, producing a continuously evolving pixel overworld. Islands, shorelines, plains, peaks, and rare ruin-like marks emerge and erode over time. Pointer movement raises nearby terrain, while clicking sends a temporary land-forming wave through the map.

Preserve these defining qualities in future iterations:

- Chunky, clearly intentional pixel geometry rather than smooth fluid gradients.
- Large readable landmasses with distinct elevation bands and bright coastlines.
- A procedural game-world feeling without becoming a literal playable map.
- Slow geological evolution at rest, with stronger terrain formation during interaction.
- Enough contrast to feel striking while keeping the central reading column legible.

Potential refinements:

- Try tighter, authored color ramps for both light and dark themes.
- Explore biome-like bands without relying on conventional green land and blue water.
- Add extremely rare structures, paths, craters, or map symbols as discovery moments.
- Keep pixel scale adjustable so the effect can move between retro and more refined.
- Test whether terrain should avoid the content column or continue naturally behind it.

## Prototype round 1 — 2026-07-17

### Rejected directions

The first round also explored Magnetic Ink, Ink in Water, Gravitational Lens, Mercury Veins, Living Signature Field, Spectral Oil Glass, and Digital Weather.

**Result:** The vast majority were not visually successful enough to pursue. Do not iterate on them without a substantially new premise. Topographic Ether was the clear exception.

## Exploration round 2

These directions use game-development, pixel-art, and voxel-art ideas as source material. They are proposals, not yet validated concepts.

### 1. Voxel Tides

**Status:** Proposed

An isometric field of tiny monochrome voxel columns behaves like a slow ocean. Broad waves travel through the height map, but each column moves in discrete steps. The pointer creates a circular terrain swell that rises, holds for a moment, and collapses outward.

The content column sits over a calm valley with taller terrain in the margins. In dark mode, only the lit top faces and occasional edge glints are visible; in light mode, the terrain resembles an architectural paper model.

### 2. Pixel Aurora

**Status:** Proposed

An aurora rendered through a deliberately low-resolution simulation buffer. Instead of smooth gradients, translucent pixel clusters climb, curl, and dissolve in ordered color ramps inspired by limited game palettes.

Pointer movement acts like wind. Moving quickly tears small pixels from the main ribbon; remaining still lets them rejoin it. The pixels stay large enough to feel intentional, not like compression artifacts.

### 3. Marching-Squares World

**Status:** Saved contender — prototype validated on 2026-07-17.

A scalar noise field is converted into shifting islands using the marching-squares algorithm. The result looks like a procedural overworld map continuously generating and eroding itself.

Different elevation bands can suggest water, shoreline, land, and mountain without literal colors. The pointer raises land from the field, while clicking could briefly generate a tiny island chain before erosion reclaims it.

This is a close relative of Topographic Ether and may be the strongest next prototype.

### 4. Raymarched Ruins

**Status:** Proposed

Sparse voxel monoliths emerge from darkness at the far edges of the viewport. A slow, low-angle light moves across them, revealing silhouettes, long shadows, and drifting particles. The structures are abstract enough to avoid becoming a literal game scene.

As the pointer moves, the light source subtly follows it. The central reading area remains an empty clearing surrounded by the suggestion of a much larger procedural world.

### 5. Cellular Dungeon

**Status:** Proposed

A cellular-automata cave system slowly evolves behind the page as chunky pixel regions. Caverns open, connect, and close over long intervals. Thin luminous paths occasionally search through the cave network like an NPC running a pathfinding algorithm.

The visitor's pointer becomes a temporary waypoint. A path finds them, reaches the destination, and fades—an interaction with a beginning and end rather than permanent cursor-following.

### 6. Voxel Rain Garden

**Status:** Proposed

Pixel-sized rain falls onto an invisible voxel terrain. Each impact sends a tiny stepped ripple across nearby blocks, slowly revealing the topography through accumulated reactions.

The background begins nearly empty. Over time, rain exposes ridges, pools, and drainage paths. Pointer movement creates a wind corridor that bends the rain and changes where the terrain becomes visible.

### 7. Sprite-Light Field

**Status:** Proposed

A dark field contains a few tiny wandering light sprites. Each sprite illuminates the procedural terrain immediately around it using a low-resolution, dithered light falloff. Most of the world remains unseen.

The pointer does not control the sprites directly; it leaves a fading trail they may become curious about and investigate. This gives the background a small amount of autonomous life without turning it into a toy.

### 8. Chunk Loader

**Status:** Proposed

The viewport behaves like a game world's chunk grid. As the visitor moves the pointer or scrolls, square regions quietly load into existence as terrain, height lines, ruins, or vegetation-like marks. Old chunks unload into particles or wireframes.

The visual hook is the transition between ungenerated space, wireframe calculation, and finished terrain. It could make the engineering behind game worlds visible while remaining abstract and monochrome.

### 9. Pixel Caustics

**Status:** Proposed

Underwater light caustics are reconstructed from hard-edged pixel clusters rather than smooth curves. Bright cells join, split, and skate over a barely visible tiled surface.

Pointer movement depresses the virtual water surface and refracts the caustic field around it. This retains some liquid energy while giving it a much stronger pixel-art identity.

### 10. Terrain Scan

**Status:** Proposed

A mostly invisible voxel landscape is revealed by a slow horizontal or radial scan. Wherever the scan passes, it exposes stepped elevation, contour lines, coordinate ticks, and occasional points of interest before the terrain fades back into darkness.

The pointer can bend or split the scanning wave. This direction could combine the strongest parts of Topographic Ether with the drama of a game-engine debug visualization.

## Next prototype recommendation

Prototype a focused set instead of another broad collection:

1. **Marching-Squares World** — closest evolution of the current winner.
2. **Voxel Tides** — clearest test of whether isometric voxel depth belongs on the site.
3. **Terrain Scan** — most dramatic extension of the topographic language.
4. **Sprite-Light Field** — strongest test of a more emotional, game-like atmosphere.

Keep Topographic Ether in the comparison as the control. The next round should evaluate five concepts total.

## Prototype round 3 — Crystalline Void — 2026-07-17

### Status

**Validated high-potential direction.** Stephen's first reaction to the completed prototype was strongly positive: “wow that looks insane!” Keep this direction alongside Topographic Ether and Marching-Squares World for final background selection.

The prototype is isolated at [`prototypes/crystalline-void/`](../prototypes/crystalline-void/). The full technical and agent handoff is [`docs/crystalline-void-prototype-handoff.md`](crystalline-void-prototype-handoff.md).

### Question tested

Can a stable procedural crystalline world, based on the supplied GPT Image 2 concept, replace the site's dotted background while keeping the narrow content column readable?

### Result

Yes—the composition is viable. Dense edge-anchored voxel walls surround a genuinely empty center. It feels distinctive, connects with Stephen's voxel/game-development preferences, and remains readable when representative portfolio content is placed directly over the void.

### Validated qualities

- Large negative space matters more than raw cube density.
- A fixed seed feels authored rather than arbitrarily randomized.
- Cyan is the structural color; magenta and orange work best as energy pockets.
- Stylized dark cores, additive shells, wire edges, and internal light are more practical than multi-object refraction.
- Slight common cube rotation is necessary to reveal top and side faces.
- Slow camera parallax communicates depth without turning the background into a toy.
- Mobile needs a different composition rule, not only fewer instances: clear the center band and keep formations near the top and bottom.
- Real page copy must remain present during every evaluation.

### Important technical findings

- Scaling an entire `InstancedMesh` also scales positions around the origin; scale instance matrices instead.
- Per-instance color attributes rendered near-black on the tested browser/GPU path. Uniform structural materials plus separate color-specific energy groups were reliable.
- A center vignette can conceal composition problems. Safe-zone rejection should create the void.
- The cube architecture is deterministic, but the particle field is not yet seeded.
- The isolated Vite build passes with an expected prototype warning around `505 kB` before gzip.
- The panel reported approximately `60 fps` in the tested desktop browser; broad device testing is still required.

### Current default

```json
{
  "seed": "stephen-crystalline-void-07",
  "density": 1,
  "safeZone": 1,
  "glow": 0.85,
  "fog": 0.018,
  "motion": 0.55,
  "pointer": 0.45,
  "quality": "auto",
  "variant": "crystal"
}
```

### Rendering treatments

1. **Crystal** — current winner and closest to the concept.
2. **Monolith** — darker, heavier architectural comparison.
3. **Signal Lattice** — wire-heavy technical/debug comparison.

### Next evaluation steps

1. Tune and save two or three Crystal configurations using the copy control.
2. Compare the scene behind project and writing-page content densities.
3. Test Chrome, Safari, Firefox, and physical mobile devices.
4. Measure frame time, memory, battery, and thermal behavior.
5. Decide whether Crystalline Void replaces or complements Topographic Ether/Marching-Squares World.
6. Establish production bundle and GPU budgets.
7. Rewrite with seeded particles, full cleanup, context-loss recovery, adaptive quality, and a static fallback.
8. Design light mode as a separate visual language rather than an inversion.
