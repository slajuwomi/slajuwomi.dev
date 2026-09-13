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

Vercel project: `slajuwomis-projects/slajuwomi.dev`. Production tracks the GitHub
`master` branch and serves `https://slajuwomi.dev`. The app has no server database
or runtime secrets.

### CLI access for local agents

The Vercel CLI is installed globally on this Mac and authenticated as `slajuwomi`.
Agents running under the same macOS account can use that local login; no token
needs to be added to the repository or an `.env` file. The ignored
`.vercel/project.json` links this checkout to the project.

Run commands from the repository root:

```bash
vercel whoami
vercel project inspect slajuwomi.dev --scope slajuwomis-projects
vercel inspect https://slajuwomi.dev --scope slajuwomis-projects
```

If `vercel` is missing from an agent's PATH, use `npx --yes vercel@59.16.0` in
its place. A new machine or expired session requires an interactive
`vercel login`; do not copy credentials into source control. To link a fresh
checkout after login:

```bash
vercel link --yes --project slajuwomi.dev --scope slajuwomis-projects
```

Production releases normally use `git push origin master`, after the user has
authorized deployment. Verify the resulting deployment with `vercel inspect`.
Avoid `vercel --prod` unless specifically needed: it uploads the local working
tree, which may include changes that have not been committed. Authentication
provides access; it is not standing permission to deploy or change project settings.
