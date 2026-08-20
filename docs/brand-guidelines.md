# Brand Guidelines

> Historical. The locked production system is Night Ledger in [`DESIGN.md`](../DESIGN.md) and `tokens.css`. This file records the earlier archival-dossier extraction. Do not implement from it.

S.SYSTEMS // DEV_LOG_2024

Production-ready brand guidelines extracted from the design code.

## 1. Brand Overview / Design Aesthetic

**Visual Style:** Brutalist, utilitarian, archival dossier aesthetic. The design mimics restricted-access technical documentation, terminal readouts, and military personnel files.

**Mood:** Industrial, technical, authoritative, and raw. Evokes the feeling of a secure terminal or a field equipment manual.

### Design Principles

- **Function First:** Strip away decorative UI in favor of raw data, dense metadata, and clear structural hierarchy.
- **Brutalist Contrast:** Heavy use of grid lines, sharp corners, and stark borders with zero decorative flourish.
- **Constrained Scale:** The layout is intentionally narrow and never spans the full viewport width.
- **Mono-Everything:** A single monospace typeface is used for all text, establishing a machine-readable, systematic tone.

### Key Characteristics

- Absolute zero border radius (pure square edges).
- Heavy reliance on 1px and 2px solid borders for containment and separation.
- Viewport corner "registration marks" to frame the page like a technical document.
- Field reference annotations and uppercase metadata labels.
- All imagery is fully desaturated and treated with technical filters.

## 2. Color Palette

The system uses CSS variables to support three distinct themes. The Archival theme is the default and primary identity.

### Primary Theme: Archival

| Token | Hex | RGB | Usage |
| --- | --- | --- | --- |
| Background | `#2d2f21` | 45, 47, 33 | Page background, surface base |
| Foreground | `#e0e2d1` | 224, 226, 209 | Primary text, inactive links, labels |
| Accent | `#8b7355` | 139, 115, 85 | Active labels, hover states, active buttons, registration marks, image borders, footer text |
| Border | `#4a4d38` | 74, 77, 56 | Dividers, grid lines, inactive button borders, image placeholders |

### Alternate Theme: Gruvbox

| Token | Hex | Usage |
| --- | --- | --- |
| Background | `#282828` | Dark surface |
| Foreground | `#ebdbb2` | Warm cream text |
| Accent | `#d79921` | Amber/gold highlights |
| Border | `#3c3836` | Muted dividers |

### Alternate Theme: Sepia

| Token | Hex | Usage |
| --- | --- | --- |
| Background | `#d4c7b5` | Light paper surface |
| Foreground | `#433422` | Dark brown text |
| Accent | `#8b5e34` | Deep sepia highlights |
| Border | `#b5a48e` | Warm grey dividers |

### Special Color Treatments

- **Log Entry Hover:** `rgba(139, 115, 85, 0.1)` (static 10% tint of the Archival accent).
- **Log Detail Background:** `rgba(0, 0, 0, 0.1)` (static dark overlay for expanded content).
- No gradients or shadows are used anywhere.

### Image Filters

Images are never displayed raw. They must pass through a theme-specific CSS filter stack.

| Theme | Filter |
| --- | --- |
| Archival | `grayscale(100%) contrast(1.1) brightness(0.8) sepia(0.3)` |
| Gruvbox | `grayscale(100%) contrast(1.1) sepia(0.2) invert(0.9)` |
| Sepia | `grayscale(100%) sepia(0.5) contrast(1.1)` |

## 3. Typography

**Primary Font:** `'Roboto Mono', monospace` (Google Fonts: weights 400 and 700)

The hierarchy is established almost entirely through weight, color, and letter spacing rather than size. The base design is aggressively minimal.

| Element | Size | Weight | Line Height | Letter Spacing | Transform | Color |
| --- | --- | --- | --- | --- | --- | --- |
| Body / Base | 11px | 400 | 1.4 | -0.01em | uppercase | `var(--fg)` |
| H2 / Section Header | 10px | 400 | 1.4 | 0.2em | uppercase | `var(--accent)` |
| Label / Meta Key | 11px | 700 | 1.4 | -0.01em | uppercase | `var(--accent)` |
| Value / Meta Data | 11px | 400 | 1.4 | -0.01em | uppercase | `var(--fg)` |
| Project Title | 14px | 700 | 1.4 | -0.01em | uppercase | `var(--fg)` |
| Log ID | 11px | 700 | 1.4 | -0.01em | uppercase | `var(--accent)` |
| Log Status | 11px | 400 | 1.4 | -0.01em | uppercase | `var(--fg)` (opacity: 0.8) |
| Body Copy (Bio) | 12px | 400 | 1.6 | normal | none | `var(--fg)` |
| Button / Theme Toggle | 9px | 400 | 1.4 | normal | uppercase | `var(--fg)` |
| Footer Text | 9px | 400 | 1.4 | normal | uppercase | `var(--accent)` |
| Field Reference Annotation | 8px | 400 | 1.4 | normal | uppercase | `var(--accent)` |

### Typography Rules

- All UI text, labels, navigation, and metadata must be uppercase.
- The only exception to uppercase is longform bio paragraph text (`.bio-text`).
- Do not use serif or sans-serif fonts.

## 4. Spacing & Layout System

### Container

- **Max Width:** 720px
- **Alignment:** Centered horizontally within the viewport.
- **Page Padding:** 40px top and bottom, 20px left and right.

### Spacing Scale

| Token | Value | Usage |
| --- | --- | --- |
| xs | 2px | Inner frame padding (visual-frame) |
| sm | 5px | Control button stack gap |
| md | 10px | Nav padding-bottom, visual-frame margin-top |
| lg | 20px | Header gap, header/footer padding, nav item gap, meta-block margins |
| xl | 40px | Dossier grid gap, divider margin |
| 2xl | 60px | Main layout vertical gap between major sections |
| 3xl | 100px | Footer margin-top |

### Grid Patterns

- **Header:** `grid-template-columns: 1fr 1fr; gap: 20px;`
- **Dossier (About):** `grid-template-columns: 200px 1fr; gap: 40px;`
- **Log Entry (List Row):** `grid-template-columns: 100px 1fr 120px; align-items: baseline;`

### Borders

- **Heavy Divider:** `2px solid var(--border)` — used for major structural breaks (header bottom, footer top, nav bottom).
- **Light Divider:** `1px solid var(--border)` — used for contained elements (log entries, image frames, inactive buttons, portrait borders).

### Shapes & Elevation

- **Border Radius:** 0px everywhere. No rounding whatsoever.
- **Shadows:** None. Flat design with zero elevation.
- **Z-Index:** Only the `.controls` (theme switcher) uses `z-index: 100` to remain fixed above content.

## 5. Components & UI Elements

### Theme Toggle Button

```css
background: none;
border: 1px solid var(--border);
color: var(--fg);
padding: 4px 8px;
width: 80px;
font-family: 'Roboto Mono', monospace;
font-size: 9px;
text-transform: uppercase;
text-align: left;
cursor: pointer;
```

**Active/Hover:** `background: var(--accent); color: var(--bg); border-color: var(--accent);`

### Navigation Links

- **Layout:** `display: flex; gap: 20px;`
- **Container:** `border-bottom: 2px solid var(--border); padding-bottom: 10px;`
- **Style:** `font-weight: 700; color: var(--fg); text-decoration: none; text-transform: uppercase;`
- **Hover:** `color: var(--accent);`

### Log Entry (Accordion Row)

```css
display: grid;
grid-template-columns: 100px 1fr 120px;
align-items: baseline;
border-top: 1px solid var(--border);
padding: 20px 0;
cursor: pointer;
```

**Hover:** `background: rgba(139, 115, 85, 0.1);` (static Archival tint; does not change with theme).

**Expansion:** Clicking toggles the `.expanded` class on the row.

### Log Detail (Expanded Panel)

- **Collapsed:** `max-height: 0; overflow: hidden;`
- **Expanded:** `max-height: 500px; padding: 0 10px 20px 10px;`
- **Transition:** `max-height 0.3s ease;`
- **Background:** `rgba(0, 0, 0, 0.1);` (static overlay; does not change with theme).

### Visual Frame (Image Wrapper)

```css
border: 1px solid var(--border);
padding: 2px;
width: 100%;
```

Inner images must be `width: 100%; display: block; filter: var(--img-filter);`

### Portrait Image

```css
width: 100%;
height: 280px;
background: var(--border);
object-fit: cover;
filter: var(--img-filter);
border: 1px solid var(--accent);
```

### Registration Marks

Decorative corner marks positioned absolutely at the viewport edges.

- **Size:** 12px × 12px
- **Style:** `border-top: 2px solid var(--accent); border-left: 2px solid var(--accent);`
- **Placement:** Four corners using `rotate(90deg)`, `rotate(-90deg)`, and `rotate(180deg)` for the respective corners.

### Divider Line

```css
height: 1px;
background: var(--border);
margin: 40px 0;
position: relative;
```

**Annotation:** A pseudo-element `::after` containing the exact text `FIELD_REF_BLOCK` is positioned absolutely at `right: 0; top: -12px;` with `background: var(--bg); padding: 0 10px; font-size: 8px; color: var(--accent);`.

### Footer

```css
margin-top: 100px;
border-top: 2px solid var(--border);
padding-top: 20px;
display: flex;
justify-content: space-between;
font-size: 9px;
color: var(--accent);
text-transform: uppercase;
```

## 6. Additional Guidelines

### Imagery & Illustration

- No decorative icons or illustrations. The aesthetic is purely typographic and structural.
- All photos must be filtered. Never use raw, unfiltered photography. Images should look like technical scans or archival documentation.
- Use `object-fit: cover` for all contained images.

### Motion & Interaction

- **Theme Switch:** `background` and `color` transition over `0.3s ease`.
- **Accordion Open/Close:** `max-height` transition over `0.3s ease`.
- **Section Switch:** `fadeIn` keyframe animation (`0.4s ease`) — opacity 0 to 1, `translateY(5px)` to 0.
- **Hover States:** Immediate color change on links and buttons; static background tint on log rows.

### Accessibility Considerations

- **Font Size Warning:** The base size of 11px is extremely small. Ensure browser zoom is not disabled. For production, consider setting `font-size: 16px` on inputs to prevent mobile browser zoom.
- **Contrast:** The Archival accent (`#8b7355`) on the background (`#2d2f21`) may fail WCAG AA for small text. Consider a lighter accent or larger sizing for critical labels.
- **Focus States:** Currently undefined. For keyboard accessibility, implement `:focus-visible` with a `2px solid var(--accent)` outline and 2px offset.
- **Uppercase Density:** Extensive uppercase reduces readability. Keep uppercase restricted to metadata and short UI labels; use sentence case for any paragraph text longer than two lines.

### Do's and Don'ts

| Do | Don't |
| --- | --- |
| Keep the layout constrained to a max-width of 720px. | Use full-width fluid containers or stretch layouts. |
| Use 0px border radius everywhere. | Introduce rounded corners, pills, or soft shapes. |
| Use only Roboto Mono at weights 400 and 700. | Use serif, sans-serif, or variable-width fonts. |
| Maintain strict uppercase for all UI labels and metadata. | Use lowercase for buttons, navigation, or labels. |
| Use heavy 2px borders for structural sections. | Use subtle shadows or gradients to create elevation. |
| Use 1px borders for contained elements like images and rows. | Use decorative icons, emoji, or illustrations. |
| Treat images as grayscale/filtered technical documentation. | Display raw, unfiltered photography. |
