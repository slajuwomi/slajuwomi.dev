# React Bits Liquid Ether Demo — Process and Development Path

> Last updated: 2026-07-26  
> Branch: `demo/liquid-ether-background`  
> Status: Saved demo only — not intended for production merge  
> Source: [React Bits Liquid Ether](https://reactbits.dev/backgrounds/liquid-ether) (via [Ch3mson/personal-portfolio-v3](https://github.com/Ch3mson/personal-portfolio-v3))  
> Component: [`components/liquid-ether-background.tsx`](../components/liquid-ether-background.tsx)

## Purpose

Local visual comparison of React Bits' Liquid Ether fluid simulation against the existing Three.js crystalline background. The crystalline implementation was left intact; this branch only swaps the mount in `app/layout.tsx`.

No pull request. Keep the branch on the remote as a reference.

## Why a branch

A dedicated branch let us A/B the interactive fluid look without risking `main` or deleting crystalline code. Checkout `main` for the production crystalline background; checkout this branch for the Liquid Ether demo.

## What changed

| Area | Change |
|------|--------|
| Background | Vendored `LiquidEther` + `LiquidEtherBackground` client wrapper |
| Layout | Root layout mounts liquid ether instead of crystalline |
| Styles | `.liquid-ether-background` host (theme-aware cream / black base) |
| Interaction | Removed hover transforms/sweeps site-wide so they do not fight mouse tracking |
| Content | Sample writing post for long-form readability testing |

Crystalline files under `components/crystalline-background.tsx` and `lib/crystalline-background/` were not removed or rewritten.

`three` was already a project dependency; no new package was required.

## Development path

### 1. First calming blue mount

Started from React Bits Liquid Ether with a soft blue palette and mid auto-demo settings:

```text
colors: #0A2E4A, #1B6B8A, #4AA8C8 → later brightened
autoSpeed: 0.4–0.5
autoIntensity: 1.8–2.4
```

**Result:** Effect ran, but early dark blues read as a full-screen navy wash. Brightening helped visibility at the cost of aggression.

### 2. Quieter motion (Ch3mson settings)

Aligned mount props with [Ch3mson/personal-portfolio-v3](https://github.com/Ch3mson/personal-portfolio-v3/blob/main/app/layout.tsx) and swapped in their `LiquidEther` component (including `pointer-events-none` on the mount):

```text
mouseForce: 20
cursorSize: 100
autoSpeed: 0.3
autoIntensity: 1.5
colors: muted blues ending toward dark
```

Also removed hover translate/scale/sweep animations across the site. Those transforms were interfering with the shader's window-level mouse state.

Restored `site-canvas` / `html` light and dark text colors to match `main` so theme tokens stayed correct.

### 3. Black base vs blue wash

Forcing a blue host color made the whole viewport feel solid blue. Ending the palette in black and using a pure black dark-mode host let transparent / low-velocity regions read as black, with blue only in the flowing field.

Overshooting into near-invisible blues required a later brightening pass and theme-aware host colors (cream in light, black in dark).

### 4. Sample writing content

Added `content/writing/learning-to-code-in-the-agentic-era.mdx` so the shader could be judged behind real post length and muted body text — without changing type styles on `main`.

### 5. Viscous blue React Bits preview

Applied a viscous blue/cyan palette from the React Bits preview controls:

```text
colors: #1730fd, #00d7ff, #561dfa
isViscous: true
viscous: 30
autoSpeed: 0.5
autoIntensity: 2.2
mouseForce: 20
cursorSize: 100
resolution: 0.5
```

### 6. Final saved state — viscous gold

Switched to a warmer gold palette with stronger auto motion for the saved demo:

```text
colors: #cc9b03, #ffd85d, #9a9000
mouseForce: 23
cursorSize: 90
isViscous: true
viscous: 25
autoDemo: true
autoSpeed: 1.2
autoIntensity: 4.3
isBounce: false
resolution: 0.5
```

Host remains full-viewport (`width/height: 100%`), not the 1080×1080 preview box from the React Bits sandbox.

## Final verdict

| Question | Answer |
|----------|--------|
| Is the effect interesting? | Yes — interactive fluid + auto demo is distinctive. |
| Usable behind editorial copy? | Needs care: strong palettes and high `autoIntensity` compete with body text. |
| Replace crystalline on `main`? | No — this branch is a saved experiment. |
| Main lessons | (1) Hover motion on content fights ether mouse tracking. (2) Palette end-stop and host background decide whether you get “black with color flow” or a solid color wash. (3) Keep light/dark text tokens from `main`; do not force a black canvas in light mode. |

## How to revisit

```bash
git checkout demo/liquid-ether-background
npm install
npm run dev
# open / and /writing/learning-to-code-in-the-agentic-era
```

To restore the production background locally:

```bash
git checkout main
```

## Key files

- `components/liquid-ether.tsx` — vendored React Bits / Ch3mson Liquid Ether
- `components/liquid-ether-background.tsx` — demo params and mount
- `app/layout.tsx` — demo background swap
- `app/globals.css` — host styles; hover sweep disabled on this branch
- `content/writing/learning-to-code-in-the-agentic-era.mdx` — readability fixture

## Commit trail (high level)

1. Mount Liquid Ether with calming blues
2. Brighten blues for visibility
3. Quiet motion, drop hover animations, restore theme text colors
4. Black base so blue only appears in the flow
5. Theme text / visibility fixes
6. Sample writing post
7. Viscous blue preview params
8. Viscous gold final params
9. This process document
