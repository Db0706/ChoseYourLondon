# Choose Your London

A Superteam UK campaign site for Solana Breakpoint 2026 (Olympia London, 15–17 November). Pick a London landmark, add your community, and download a 2400 × 1350 card to post on X.

Built with [Next.js](https://nextjs.org) (App Router) and TypeScript. The card is drawn in the browser on a `<canvas>`, so uploaded photos never leave the user's device.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Configuration

Copy `.env.example` to `.env.local` and set any of these (all optional):

| Variable | Default | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_LUMA_URL` | `https://lu.ma/` | "Get notified" buttons |
| `NEXT_PUBLIC_WATCH_URL` | `https://x.com/SuperteamUK` | "Watch on X" and released episodes |
| `NEXT_PUBLIC_SITE_URL` | `https://choseyourlondon.com` | Link in the "Post on X" text, and social preview image URLs |

## Project layout

```
app/
  layout.tsx        fonts, metadata
  globals.css       per-theme base styles
  page.tsx          homepage
components/
  Night.tsx + .module.css   the whole page
lib/
  cyl-card.ts       landmarks, colours, episode schedule, canvas card renderer
  useCardStudio.ts  shared card-studio state (handle, name, uploads, download, post)
  fonts.ts          Instrument Serif, JetBrains Mono, Hanken Grotesk via next/font
  config.ts         site links
public/assets/      logo and landmark photos
```

To add a landmark or change the episode schedule, edit `lib/cyl-card.ts`.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). No extra settings are needed.

---

Unofficial and just for fun. Built by [@deandev10](https://x.com/deandev10) for [Superteam UK](https://x.com/SuperteamUK).
