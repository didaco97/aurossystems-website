# AurosSystems — website (draft)

Marketing site for an AI-first software services startup: ready management
products for schools, colleges and small businesses, plus custom software.

**Status: draft.** Company name, tagline, email and phone are placeholders
(clearly marked on the site). No client names, numbers or testimonials are
claimed anywhere.

## Stack

Plain HTML/CSS/JS, no frameworks, no runtime dependencies.

- `src/pages/` — page sources (11 pages: home, products hub, 4 product
  pages, AI, industries, about, FAQ, contact)
- `src/assets/css/site.css` — design system (Inter + Fraunces, teal palette,
  sticky nav, reveal-on-scroll, `prefers-reduced-motion` support, responsive
  at 960/760px)
- `src/assets/js/site.js` — nav toggle, scroll reveals, demo form
- `src/assets/img/`, `src/assets/video/` — imagery and the hero demo clip
- `build.mjs` — tiny static generator; rewrites root-relative URLs so the
  output works from any subpath (GitHub Pages project sites included)
- `docs/` — built output, ready to serve

## Build & preview

```
node build.mjs          # regenerate docs/
python3 -m http.server  # serve docs/ locally
```

## Deploy

GitHub Pages: Settings → Pages → Deploy from branch → `main` / `docs`.
Or drag `docs/` onto Netlify Drop. No build step needed on the host.

## Renaming the brand

All brand strings (name, tagline, email, phone, location) live in the
`BRAND` constant at the top of `build.mjs`. Edit once, rebuild, done.
