# Design — slajuwomi.dev

Locked design system. Future design work reads this file first; pages defer
to it. Amend intentionally — the file is the rule.

Canonical Paper page: [Night Ledger system](https://app.paper.design/file/01M0G23BZ7JQY2RACP0945SX4B/3-0)

## System

- Genre · editorial (serif, document-led)
- Macrostructure · Night Ledger
- Theme · custom (vibe: "ferrofluid under studio light")
- Axes · dark / serif / chrome + magnet red

Colors come from the Ferrofluid background: near-black fluid, white key
lights, red fill light. The earlier gruvbox mono theme lives on branch
`preserve/wheat-field-background`.

Chosen over the Archival Dossier, Letter, and Sepia File prototypes.
Corner registration marks, the amber top bar, and structural borders are
out. Hierarchy comes from type, color, and space only.

`docs/brand-guidelines.md` is historical (the earlier archival dossier).
This file wins when they disagree.

## Tokens (canonical · `tokens.css` is the source of truth)

```css
:root {
  --color-paper:      #0f0e11;
  --color-paper-2:    #1b191e;
  --color-ink:        #ece8e4;
  --color-ink-2:      #c9c4c6;
  --color-muted:      #9a949c;
  --color-accent:     #e5534b;
  --color-accent-ink: #0f0e11;
  --color-focus:      #e5534b;

  --font-display: var(--font-lora), Georgia, serif;
  --font-body:    var(--font-lora), Georgia, serif;
  --font-mono:    ui-monospace, "SF Mono", Menlo, monospace;

  --radius-card:  0;
  --radius-pill:  0;
  --radius-input: 0;
}
```

## Type

Single face: Lora (variable), weights 400–600,
with italic for page titles. Mono only for code inside posts. No sans.

| Role | Size | Weight | Line height | Color | Case |
| --- | --- | --- | --- | --- | --- |
| Site name | 17px | 400 | 26px | ink | Title case |
| Nav | 17px | 600 | 26px | ink; accent when current | Title case |
| Page title (Projects, Writing) | 28px | 500 italic | 36px | accent | Title case |
| Product / list title | 20px | 600 | 26px | ink | Title case |
| Bio / project copy | 17px | 400 | 26px | ink | Sentence case |
| Article body | 18px | 400 | 30px | ink | Sentence case |
| Meta / date | 15px | 400 | 22px | accent | as written |
| Footer link | 15px | 400 | 22px | accent | Title case |
| Post title | 28px | 600 | 36px | ink | Sentence case |

Longform writing is the only place sentence case is required. Nav and
labels stay short and readable — never `001_index` or `FIELD_REF_BLOCK`.

## Layout

- Page measure: 720px, centered.
- Viewport: dark paper, no persistent full-page texture or WebGL scene.
- Decorative exception: raw-WebGL2 bands occupy separate full-width rows above
  the header and below the footer, never behind navigation or reading content.
  The page must remain complete when they are unavailable.
- Production uses 180px Perlin noise bands: gold islands on page charcoal,
  with an irregular retreat toward the content and a vertically mirrored footer.
  The approved shader-picker selection is speed 0.9, contrast 0.8,
  density 4, proportion 0.42, softness 0.11, octaveCount 3, persistence 0.5,
  lacunarity 2, scale 1, rotation 127, retreat 0.4; colors #282828 / #fabd2f.
  The picker is preserved on branch `prototype/shader-picker` at
  `public/shader-picker.html`, not served in production. Older shader experiments
  are unmounted.
- Vertical rhythm: 48px between major blocks; 20px inside a list row.
- No box borders. No hairline rules under the header or above the footer.
- No corner marks, no top accent bar, no theme switcher chrome.

## Components

**Header.** Name left, About / Writing right. Current route uses accent.
No underline, no border, no icons.

**Project row.** Stacked: product name, then one-line description. Name is a
text link if the project has a URL. Spacing, not rules, separates rows.

**Writing row.** Date in accent, title in ink, optional one-line excerpt
in ink. Stacked. The whole row is the hit target.

**Footer.** Text links only: GitHub, LinkedIn, X. No icons. Accent color.

**Post.** Date, title, then body at 18px / 30px. Section heads in the post
use 15px accent, 600.

**Focus.** `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`
No other chrome.

## Motion

- Route change: 240ms opacity + 5px translateY. Transform and opacity only.
- Reduced motion: 150ms opacity crossfade, no translation.
- Perlin tide: decorative only; 30fps maximum on desktop and 20fps on coarse
  pointers, low-power GPU preference, capped DPR, and reduced mobile render
  scale. Pause while off-screen or while the tab is hidden. Do not initialize
  it under `prefers-reduced-motion: reduce`; hide it in forced-colors mode.
- No hover elevation, no shadows, no card lifts.

## Imagery

If a photo appears, it is filtered, never raw. Default Night Ledger
filter: `grayscale(100%) contrast(1.1) invert(0.92)`. Prefer no
images on About and Writing.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep the 720px measure. | Full-bleed fluid layouts. |
| Use Lora only. | Sans, mono for prose, or a second display face. |
| Name pages About and Writing. | Coded IDs, theme names in the UI. |
| Separate with space and type. | 1px rules, boxes, cards, corner marks. |
| Footer as words. | Lucide or brand icons. |
| One dark theme. | Light/dark toggle in this system. |

## CTA voice

- Primary · text in accent · no fill · no radius
- Secondary · unused. This site has no marketing CTA.

## Exports

`tokens.css` is the source of truth. Tailwind v4 `@theme` mapping lives in
that file. Do not introduce a parallel token set in `app/globals.css`.
