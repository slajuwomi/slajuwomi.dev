# Crystalline Void — Throwaway Prototype

Question: can a stable, seeded crystalline 3D world replace the portfolio's dotted background while keeping its narrow content column effortless to read?

This is deliberately isolated from the production Next.js application. It does not import or modify production components.

**Current verdict:** the direction is visually viable. The default Crystal treatment creates a recognizable crystalline perimeter around a readable central void. It is still prototype code and should be rewritten—not copied wholesale—before production integration.

For the complete architecture, visual reasoning, constants, iteration history, failure analysis, known debt, and production next steps, read [`docs/crystalline-void-prototype-handoff.md`](../../docs/crystalline-void-prototype-handoff.md).

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

Production build check:

```bash
npm run build
```

The build currently passes with a non-blocking Vite chunk-size warning expected for this isolated prototype.

## Rendering treatments

- `?variant=crystal` — translucent crystalline shells, dark cores, and energy pockets (default)
- `?variant=monolith` — heavier, darker, larger voxel architecture
- `?variant=wireframe` — brighter signal-lattice treatment

Use the floating arrows or keyboard left/right arrows to switch. The tuning panel can adjust composition, rendering, motion, and quality; its values are in-memory only.

The default composition is fixed by the seed `stephen-crystalline-void-07`. The “new seed” control is only for exploration.

## Validated design rules

- Protect the center through procedural rejection, not a visible content card.
- Keep cyan dominant and use magenta/orange as localized energy.
- Apply scaling per instance; scaling an `InstancedMesh` also moves its instances around the origin.
- Keep structural materials uniform unless per-instance color is cross-browser tested.
- Mobile uses top/bottom formations and a cleared central reading band.
- Interaction should reveal depth while remaining subordinate to reading.

## Immediate next steps

1. Compare all three treatments and tune the Crystal default.
2. Save preferred settings with **copy configuration**.
3. Test physical devices and multiple browsers.
4. Establish production performance and bundle budgets.
5. Rewrite the selected renderer as a client-only component behind a feature flag.
6. Design a separate light-mode interpretation.
