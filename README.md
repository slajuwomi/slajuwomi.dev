# slajuwomi.dev

Stephen Lajuwomi's public portfolio. It uses Next.js 16, TypeScript, Tailwind CSS, and MDX.

## Local development

Install dependencies and start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the local portfolio milestone.

## Routes

- `/` contains the About list.
- `/projects` contains searchable project cards.
- `/writing` lists MDX posts.
- `/writing/[slug]` renders a post from `content/writing`.

Old `/productivity` routes permanently redirect to `productivity.slajuwomi.dev`.

## Add writing

Add an `.mdx` file under `content/writing`. See `content/writing/README.md` for the frontmatter shape.

## Real asset blockers

The source repo did not contain these real assets:

- Directors Investment Group logo.
- Hardin-Simmons University logo.
- Screenshots for Cowboy Cards, Books4Sale, and Drake Lyrics Generator.
- Stephen's signature SVG paths.

The UI marks missing logos and project media. The signature renders nothing until a real signature is supplied. Do not replace these with fake logos, stock screenshots, or generated signature marks.

Follow `docs/signature-guide.md` for the signature workflow. Add real project screenshots under `public/assets/projects`, then set each `image` path in `lib/site-data.ts`.

## Checks

```bash
npm run lint
npm run build
```

## Deploy

Create a Vercel project from this repo and attach `slajuwomi.dev`. The app has no server database or runtime secrets.
