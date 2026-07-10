# Design Reference: [martinsit.ca](https://martinsit.ca/)

Visual and structural reference for Stephen Lajuwomi's new portfolio at `slajuwomi.dev`.

**Source of truth:** live site + public repo [`martin226/v2`](https://github.com/martin226/v2) (Next.js + Tailwind, tagged `minimalistic` / `personal-website`).

**Supersedes:** the previous kaikim.ca reference used by this monolith.

---

## Brand & Visual Feel

- **Aesthetic:** Extreme minimal personal site. Narrow column, soft stone neutrals, dotted grid background, almost no chrome.
- **Mood:** Quiet, confident, engineer-personal. Reads like a resume written as a short list, not a marketing page.
- **Density:** Very tight. Content column is `md:max-w-[500px]`. Large outer margins (`m-6` mobile, `md:m-20`, `md:mt-[60px]`).
- **Motion:** Small and intentional — diamond bullets rotate on hover, list rows nudge right, links get a sweeping underline, project media grows on hover, footer icons scale + reveal labels, command palette fades/slides in.
- **What it is not:** No hero photo stack, no floating dock, no skill pills, no experience timeline cards, no purple accents, no heavy shadows, no dashboard layout.

---

## Color Palette

All colors come from Tailwind `stone` / `neutral` scales plus a yellow text selection. No custom brand accent color.

### Light mode (default)

| Role | Tailwind / value | Hex (approx) | Usage |
|------|------------------|--------------|--------|
| Page background | `bg-stone-100` | `#f5f5f4` | Full-page canvas |
| Dot grid | `#e5e7eb` at 1px | gray-200 | Radial 16px grid |
| Body text | `text-neutral-500` | `#737373` | Default column text |
| Brand name | `text-neutral-700` | `#404040` | Header "martin sit" |
| Muted copy | `text-stone-600` | `#57534e` | About list body |
| Softer muted | `text-stone-500` | `#78716c` | ↳ markers, footer, kbd hints |
| Strong text | `text-stone-800` / `neutral-800` | `#292524` / `#262626` | Writing titles, project titles |
| Diamonds | `bg-stone-800` | `#292524` | Rotated square bullets |
| Surfaces | `bg-stone-50` | `#fafaf9` | CTA button, ⌘K chip |
| Borders | `border-stone-200`–`400` | `#e7e5e4`–`#a8a29e` | Buttons, palette, CTA |
| Selection | `selection:bg-yellow-200` | `#fef08a` | Text highlight |
| Scrollbar track | `#f5f5f4` | stone-100 | Custom scrollbar |
| Scrollbar thumb | `#d6d3d1` → `#a8a29e` hover | stone-300/400 | Custom scrollbar |

### Dark mode (`class` strategy on `<html>`)

| Role | Tailwind / value | Hex (approx) |
|------|------------------|--------------|
| Page background | `bg-black` | `#000000` |
| Dot grid | `#1f2937` at 1px | gray-800 |
| Body text | `text-neutral-400` | `#a3a3a3` |
| Brand name | `text-neutral-300` | `#d4d4d4` |
| Muted copy | `text-stone-400` | `#a8a29e` |
| Diamonds | `bg-stone-200` | `#e7e5e4` |
| Surfaces | `bg-stone-800` / `neutral-900` | `#292524` / `#171717` |
| Borders | `border-stone-600`–`900` | muted dark borders |
| Selection | `selection:bg-yellow-800` | `#854d0e` |
| Scrollbar | track `#292524`, thumb `#44403c` | stone-800/700 |
| Webring icon | `dark:invert` | inverted SVG |

### Theme behavior

- Stored in `localStorage` key `theme`
- Falls back to `prefers-color-scheme: dark`
- Toggles `dark` class on `document.documentElement`
- Swaps favicon between `favicon.ico` (light) and `favicon.dark.ico` (dark)

---

## Typography

| Role | Font | Notes |
|------|------|-------|
| Entire site | **Geist Sans** (`geist/font/sans`) | Applied on `<body>` via `GeistSans.className` |
| Weight default | `font-extralight` (200) | Layout + about column default |
| Brand / emphasis | `font-semibold` / `font-medium` | Header name; company/product links |
| Section labels | `italic font-medium` | "what i've been building:", "previously:" |
| Base size | `text-base` on about list | Browser-default scale, not shrunk |
| Project titles | `text-2xl font-medium` | On project cards |
| Writing titles | `text-sm sm:text-base` | List row titles |
| Meta / kbd | `text-xs` / `text-sm` + `font-mono` on kbd | ⌘K chip, dates |
| Micro utility | `fontSize.micro = 0.625rem` | Defined in Tailwind config (rarely used) |

**Copy voice:** lowercase brand name (`martin sit`), casual lowercase section labels, short achievement lines with metrics, `↳` nested bullets, CTA "see what i've built".

---

## Layout Shell

```
┌──────────────────────────────────────────────────────────────┐
│  ░░░░░ radial 16px dot grid on stone-100 / black ░░░░░░░░░░  │
│                                                              │
│              ┌──────── max-w 500px ────────┐                 │
│              │  martin sit     about …  ☾ ⌘K│  ← header      │
│              │                              │                 │
│              │  ◆ Engineering  [logo] Co    │  ← about list  │
│              │  ◆ CS           [logo] School│                 │
│              │  ◆ what i've been building:  │                 │
│              │      ↳ …                     │                 │
│              │  ◆ previously:               │                 │
│              │      ↳ …                     │                 │
│              │  [ see what i've built  ▤ ]  │  ← bordered CTA │
│              │                    signature │                 │
│              │  ─── footer ───  webring ←→  │                 │
│              └──────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

### Shell classes (from `layout.js`)

```text
main:
  flex justify-center
  bg-stone-100 dark:bg-black
  font-extralight min-h-screen
  selection:bg-yellow-200 dark:selection:bg-yellow-800
  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]
  dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]
  [background-size:16px_16px]

column:
  flex flex-col gap-4
  w-full md:max-w-[500px]
  m-6 md:m-20 md:mt-[60px]
  text-neutral-500 dark:text-neutral-400
```

---

## Information Architecture

| Route | Purpose |
|-------|---------|
| `/` (about) | Current role, school, building highlights, previous roles, CTA to projects, animated signature |
| `/projects` | Searchable project cards (image or looping video) + link to full GitHub repos |
| `/writing` | MDX post index (title + date) |
| `/writing/[slug]` | Long-form MDX posts with typography plugin, Prism highlighting, tweets |

### Global chrome

- **Header:** brand link + `about` / `projects` / `writing` nav + sun/moon toggle + ⌘K opener (desktop)
- **Footer:** social icons (x, linkedin, github, email, repo) + CS Webring prev/next + `© Year Name`
- **Command palette:** `cmdk` + Radix Dialog, desktop only, `⌘/Ctrl+K`, Shift+letter shortcuts

---

## Component Patterns

### Diamond bullets (about page)

- `6×6px` square, `rotate-45`, `bg-stone-800` / `dark:bg-stone-200`
- On row hover: `rotate-90` + `scale-110`
- Row hover: `translate-x-1` over 200ms

### Nested `↳` items

- Absolute `↳` at `left-[-20px]`, `text-stone-500`
- Body stays `text-stone-600 dark:text-stone-400`
- Linked product/company names use custom `Link` with `font-medium`

### Custom `Link`

- Inactive: faint bottom underline (`stone-300` / dark `stone-600`)
- Hover: darker text + animated `sweep` underline (scaleX left→right then erase)
- Active nav links skip the underline animation

### Primary CTA (about → projects)

```text
text-center mt-4 py-4 px-6 rounded-lg
border border-stone-400 dark:border-stone-600
bg-stone-50 dark:bg-stone-900
text-stone-600 dark:text-stone-400
font-extralight shadow-sm
hover:scale-[1.02] active:scale-[0.98]
+ GalleryHorizontalEnd icon
```

### Project cards

- Surface: `bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-md hover:shadow-lg`
- Media: `h-[250px]` → `h-[275px]` on group hover, 500ms
- Supports `video` (autoplay/muted/loop) or `Image` with SVG shimmer placeholder
- Title `text-2xl`; GitHub + external demo icon buttons

### Command palette

- Overlay `bg-black/50`, panel `max-w-[500px]`, `rounded-xl`, white / `neutral-900`
- Groups: Navigation, Links, Other (theme toggle)
- First-open curved arrow hint until `localStorage.hasOpenedCommandPalette`

### Signature

- Client-only dynamic import (`ssr: false`)
- Large SVG path animation component at bottom of about page

---

## Stack (reference implementation)

| Layer | Choice |
|-------|--------|
| Framework | Next.js **14.2.x** App Router |
| Language | JavaScript (no TypeScript in upstream) |
| Styling | Tailwind CSS 3.4 + `@tailwindcss/typography` |
| Font | `geist` |
| Motion | Framer Motion (available); mostly CSS transitions |
| Icons | `lucide-react` |
| Command palette | `cmdk` + `@radix-ui/react-dialog` |
| Content | MDX via `@next/mdx`, `rehype-prism-plus`, `rehype-slug`, `remark-toc` |
| Embeds | `react-tweet` |
| Analytics | Google Analytics + Vercel Speed Insights |
| Dark mode | `darkMode: "class"` in Tailwind |

### Notable files in [`martin226/v2`](https://github.com/martin226/v2)

```text
src/app/layout.js              # shell, grid bg, Header/Footer/CommandPalette
src/app/page.js                # about list + CTA + Signature
src/app/projects/page.js       # ProjectSearch
src/app/writing/**             # MDX posts
src/app/components/Header.js
src/app/components/Footer.js
src/app/components/Link.js     # sweep underline
src/app/components/ProjectCard.js
src/app/components/CommandPalette.js
src/app/components/ThemeProvider.js
src/app/components/Signature.js
src/app/globals.css            # scrollbars + fade/slide animations
tailwind.config.js
```

---

## About-page content structure (template for Stephen)

Map Stephen's data into this shape — do not invent a different home layout:

1. **Current role** — `Role` + company logo + company link
2. **Education / school** — short label + school logo + link
3. **what i've been building:** — 3–5 nested `↳` lines with linked product names + metrics
4. **previously:** — nested past roles / research with logos
5. **CTA** — "see what i've built" → `/projects`
6. **Signature** — optional personal mark

Source content for Stephen already lives in `lib/site-data.ts` + `resources/` in the current monolith (to be moved into the new portfolio repo).

---

## Explicit non-goals (do not copy from current monolith)

When building the new portfolio, leave these behind:

- Floating dock navigation
- Grid bloom / cursor spotlight from current site
- Like / flame counter
- Photo gallery stack in the hero
- Skills pill sections
- Card-heavy experience / education blocks
- Productivity tool links in the portfolio chrome
- Inter / JetBrains Mono / Source Serif pairing from the current site

---

## Accessibility & interaction notes

- Theme toggle has `aria-label="Toggle theme"`
- Footer social links use `aria-label` + `rel="noopener noreferrer"`
- Command palette disabled on mobile (`useMobileDevice`)
- Text selection uses high-visibility yellow in both themes
- Hover affordances are motion-based, not color-only (translate, rotate, underline sweep)

---

## Audit provenance

| Source | What was extracted |
|--------|--------------------|
| https://martinsit.ca/ | Live about copy, IA, visual feel |
| https://martinsit.ca/projects | Project blurbs / card content |
| https://martinsit.ca/writing | Writing index structure |
| https://github.com/martin226/v2 | Exact classes, shell, components, stack, theme, palette |

Audited July 2026.
