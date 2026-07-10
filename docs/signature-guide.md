# Custom signature guide

The site does not include a fake signature. `components/signature.tsx` returns `null` until Stephen supplies real SVG path data.

## What the app expects

The signature component expects:

- A real signature exported as SVG paths.
- A `viewBox` that fits those paths.
- One or more `d` values copied into the `signaturePaths` array in `components/signature.tsx`.

Keep the source scan or photo outside the app. Only the cleaned SVG data belongs in the repo.

## Create the SVG

1. Sign your name on plain white paper with a dark pen.
2. Take a clear, straight photo or scan it.
3. Import the image into Figma, Illustrator, or Inkscape.
4. Use a vector trace tool to turn the dark strokes into paths.
5. Remove the paper background and stray points.
6. Convert outlined shapes to a single stroke when possible.
7. Export a plain SVG.

Figma plugins and Illustrator Image Trace can handle the trace. Inkscape also has Path > Trace Bitmap. Review the result by hand. Auto-tracing often adds rough points.

## Wire the paths into the site

Open the SVG in a text editor. Copy each `<path>` element's `d` value into the array:

```ts
const signaturePaths: readonly string[] = [
  "M12 80 C...",
  "M210 74 C...",
];
```

Then update the component's `viewBox` to match the SVG export. The component uses `currentColor`, so the stroke follows the light and dark theme colors.

If the source uses filled shapes instead of strokes, the component needs a small change. Set `fill="currentColor"` and remove the stroke props. Do not paste a base64 image into the component.

## Optional stroke animation

Animation should follow the real stroke order. Add a path length animation only after the static signature looks right. Respect `prefers-reduced-motion` and show the complete path when reduced motion is enabled.

## Preview locally

1. Run `npm run dev`.
2. Open `http://localhost:3000`.
3. Check the bottom of the About page.
4. Test both themes.
5. Test at narrow and wide sizes.
6. Run `npm run lint` and `npm run build`.

## What Stephen provides

Stephen provides one of these:

- Best: a cleaned SVG export with the correct path order.
- Good: a high-resolution scan or photo on plain white paper.

The implementation work covers path cleanup, the final `viewBox`, theme colors, sizing, and an optional accessible animation.

Until a real source is supplied, the component must keep rendering nothing. Do not copy another person's signature or draw a placeholder scribble.
