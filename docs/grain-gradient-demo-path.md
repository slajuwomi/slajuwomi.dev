# Paper Design Grain Gradient Demo — Process and Development Path

> Last updated: 2026-07-26  
> Branch: `demo/grain-gradient-background`  
> Status: Saved demo only — not intended for production merge  
> Package: `@paper-design/shaders-react`  
> Component: [`components/grain-gradient-background.tsx`](../components/grain-gradient-background.tsx)

## Purpose

Local visual comparison of Paper Design's Grain Gradient shader against the existing Three.js crystalline background. The crystalline implementation was left intact; this branch only swaps the mount in `app/layout.tsx`.

No pull request. Keep the branch on the remote as a reference.

## Why a branch

A dedicated branch let us A/B the look without risking `main` or deleting crystalline code. Checkout `main` for the production crystalline background; checkout this branch for the Paper Design demo.

## What changed

| Area | Change |
|------|--------|
| Dependency | Added `@paper-design/shaders-react` |
| Background | New `GrainGradientBackground` client component |
| Layout | Root layout mounts grain gradient instead of crystalline |
| Styles | `.grain-gradient-background` host + dark scrim |
| Content | Sample writing post for long-form readability testing |

Crystalline files under `components/crystalline-background.tsx` and `lib/crystalline-background/` were not removed or rewritten.

## Development path

### 1. Corners, first maroon palette

Started from the Paper Shaders Grain Gradient “corners” demo (purple/cyan rings on black). Swapped to a dark-red / maroon ring that lightened toward the center:

```text
colors: #3d0810 → #7a1528 → #c45c6a → #e8b0b8
shape: corners
softness / intensity / noise: 0.5 / 0.5 / 0.25
```

**Result:** Visually striking, but the pale inner ring washed out body copy.

### 2. Exposure tuning (corners)

| Pass | Adjustment | Outcome |
|------|------------|---------|
| Quiet | Darker maroons + `opacity: 0.55` | Too dark; effect nearly disappeared |
| Middle | Mid maroons + `opacity: 0.75` | Better balance for corners |

Lesson: opacity alone is a blunt tool. The lightest color in the ramp dominates readability.

### 3. Sample writing content

Added `content/writing/learning-to-code-in-the-agentic-era.mdx` so the shader could be judged behind real post length, headings, and muted body text (`#a8a29e` in dark mode) — without changing type styles.

### 4. Wave variation

Moved to the Paper Shaders “wave” preset structure (diagonal flow, softer bands):

```text
shape: wave
rotation: 232
softness: 0.7
intensity: 0.15
noise: 0.5
speed: 0.94
```

First wave palette mapped gold/beige → maroon/rose:

```text
colorBack: #0a0508
colors: #8b1a28, #a85860, #d4a8a8
opacity: 0.8
```

**Result:** Cool motion and grain, but `#d4a8a8` destroyed contrast with light gray body text. Constraint: fix contrast without changing text color.

### 5. Contrast fix (final saved state)

Kept wave geometry and rotation. Darkened the entire ramp so no band approached body-text luminance, and added a CSS black scrim over the shader:

```text
colorBack: #050203
colors: #4a1018, #6b2430, #7e3844
shape: wave
rotation: 232
softness: 0.7
intensity: 0.15
noise: 0.5
speed: 0.94
scrim: rgb(0 0 0 / 45%) via .grain-gradient-background::after
```

Text colors were left alone. Readability recovered while the maroon wave remained visible.

## Final verdict

| Question | Answer |
|----------|--------|
| Is the effect interesting? | Yes — especially wave + grain + diagonal rotation. |
| Usable behind editorial copy? | Only after aggressive darkening + scrim. |
| Replace crystalline on `main`? | No — this branch is a saved experiment. |
| Main lesson | Paper Design shaders need a readability budget early: lightest ramp color and overlay strategy matter as much as shape choice. |

## How to revisit

```bash
git checkout demo/grain-gradient-background
npm install
npm run dev
# open /writing/learning-to-code-in-the-agentic-era
```

To restore the production background locally:

```bash
git checkout main
```

## Key files

- `components/grain-gradient-background.tsx` — shader mount and params
- `app/layout.tsx` — demo background swap
- `app/globals.css` — host + scrim
- `content/writing/learning-to-code-in-the-agentic-era.mdx` — readability fixture
- `package.json` — `@paper-design/shaders-react` dependency

## Commit trail (high level)

1. Mount Paper Design grain gradient (corners, first maroon palette)
2. Sample writing post for layout demo
3. Quiet / lift exposure passes on corners
4. Switch to wave + diagonal rotation
5. Darken ramp + scrim for contrast
6. This process document
