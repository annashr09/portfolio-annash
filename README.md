# Annash Ragil Putra Supartono — Portfolio

React + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
```

## Update content (no component edits needed)

Everything is in `src/data/content.ts`:

- `profile` – name, email, LinkedIn, location, CV path
- `experiences`, `education`, `skillGroups`, `achievements`
- `projects` – set `link` to a real URL and the "coming soon" label in the
  project dialog becomes a working button. Add `linkLabel` text as you like.

Replace the CV at `public/Annash-Ragil-Putra-Supartono-CV.pdf` to update
the "Download CV" button.

## Notes

- Liquid glass: `.liquid-glass` (+ `.liquid-glass-accent`, `.lg-lens`) in `src/index.css`.
  The refractive lens (`#lg-distort`) works in Chromium; other browsers get the
  blur + saturation + specular-highlight version.
- Theme: dark/light toggle (stored in localStorage). Lemon stays the signature in both.
- Motion: respects `prefers-reduced-motion` (no cursor, intro, parallax, or autoplay).
- Fonts load from Google Fonts (Bricolage Grotesque, Instrument Serif, JetBrains Mono).
- The CV PDF intentionally omits the phone number from your CV file; add it back if you want it public.
