# Design — slajuwomi.dev

Locked design system. Future design work reads this file first; pages defer
to it. Amend intentionally — the file is the rule.

Canonical Paper page: [Night Ledger system](https://app.paper.design/file/01M0G23BZ7JQY2RACP0945SX4B/3-0)

## System

- Genre · editorial (mono, document-led)
- Macrostructure · Night Ledger
- Theme · custom (vibe: "dark terminal ledger")
- Axes · dark / mono / warm amber

Chosen over the Archival Dossier, Letter, and Sepia File prototypes.
Corner registration marks, the amber top bar, and structural borders are
out. Hierarchy comes from type, color, and space only.

`docs/brand-guidelines.md` is historical (the earlier archival dossier).
This file wins when they disagree.

## Tokens (canonical · `tokens.css` is the source of truth)

```css
:root {
  --color-paper:      #282828;
  --color-paper-2:    #32302f;
  --color-ink:        #ebdbb2;
  --color-ink-2:      #d5c4a1;
  --color-muted:      #a89984;
  --color-accent:     #d79921;
  --color-accent-ink: #282828;
  --color-focus:      #d79921;

  --font-display: "Roboto Mono", ui-monospace, monospace;
  --font-body:    "Roboto Mono", ui-monospace, monospace;
  --font-mono:    "Roboto Mono", ui-monospace, monospace;

  --radius-card:  0;
  --radius-pill:  0;
  --radius-input: 0;
}
```

## Type

Single face: Roboto Mono, weights 400 and 700. No serif, no sans.

| Role | Size | Weight | Line height | Color | Case |
| --- | --- | --- | --- | --- | --- |
| Site name | 14px | 400 | 20px | ink | Title case |
| Nav | 14px | 700 | 20px | ink; accent when current | Title case |
| Page title (Projects, Writing) | 22px | 700 | 28px | accent | Title case |
| Product / post title | 16px | 700 | 22px | ink | Title case |
| Body / bio | 15px | 400 | 26px | ink | Sentence case |
| Meta / date | 12px | 400 | 16px | accent | as written |
| Footer link | 12px | 400 | 16px | accent | Title case |
| Post title | 22px | 700 | 30px | ink | Sentence case |

Longform writing is the only place sentence case is required. Nav and
labels stay short and readable — never `001_index` or `FIELD_REF_BLOCK`.

## Layout

- Page measure: 720px, centered.
- Viewport: dark paper, no texture, no WebGL.
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

**Post.** Date, title, then body at 15px / 26px. Section heads in the post
use 12px accent, 700.

**Focus.** `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`
No other chrome.

## Motion

- Route change: 240ms opacity + 5px translateY. Transform and opacity only.
- Reduced motion: 150ms opacity crossfade, no translation.
- No hover elevation, no shadows, no card lifts.

## Imagery

If a photo appears, it is filtered, never raw. Default Night Ledger
filter: `grayscale(100%) contrast(1.1) sepia(0.2) invert(0.9)`. Prefer no
images on About and Writing.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep the 720px measure. | Full-bleed fluid layouts. |
| Use Roboto Mono 400/700 only. | Geist, serif, or a second display face. |
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
