# Avinash Patnala — Portfolio

Personal portfolio site: product management, design and research work.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
shadcn/ui and Motion. Adapted from a friend's portfolio template.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build — run before deploying |
| `npm start` | Serve the production build |
| `npm run lint` | Check the code |

## Editing content

Almost everything on the page comes from **`lib/data.ts`**: name, bio, stats,
journey, projects, experience, education, achievements and skills. Edit it
there, not in the components.

- **Photo, résumé, logos** live in `public/`. Paths in `lib/data.ts` must match
  the file names exactly, including upper/lower case.
- **Project images**: drop one in `public/projects/` and set that project's
  `image`. Until then each card draws its own placeholder.
- **Text sizes** are defined once, at the end of `app/globals.css`
  (`text-body`, `text-meta`, `text-label`).

## Switched-off sections

- **Achievements** — built, commented out in `app/page.tsx`.
- **AI chat assistant** — commented out in `app/page.tsx`; needs
  `GEMINI_API_KEY`.

Uncomment them there (and their entries in `components/sections/Navbar.tsx`
and `components/command-palette/CommandPalette.tsx`) to turn them on.

## Environment variables

Put these in `.env.local` (never committed), and in Vercel's project settings
when deploying:

| Variable | Needed for |
|---|---|
| `RESEND_API_KEY` | The contact form. Without it the form opens the visitor's mail app instead. |
| `GEMINI_API_KEY` | The chat assistant, if switched on. |
| `NEXT_PUBLIC_SITE_URL` | Optional: the site's address, once it has a custom domain. |
