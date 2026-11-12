# Cocolo Brand Guidelines

The brand identity, voice, and visual rules for Cocolo Travel — built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Getting started

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

## Scripts

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the local dev server                   |
| `npm run build`    | Build the static site to `./dist/`           |
| `npm run preview`  | Preview the production build locally         |

## Project structure

```
src/
  content/docs/guidelines/   Guideline pages (colors, typography, spacing, layout, print, logo, voice, imagery, tokens...)
  components/                Astro components used in the docs (color swatches, type/doc/display scales, contrast table)
  styles/                    Brand CSS layered on top of Starlight's theme
public/
  brand/tokens.css           Offline/local-dev fallback snapshot of the published tokens (see below)
```

Sidebar navigation and site metadata are configured in [astro.config.mjs](astro.config.mjs).

## Design tokens

Colors, type, spacing, layout, and print values are all read **at build time** from the live `tokens.css` published by the `axelder/assets` repo (`src/components/tokens.js` fetches it; see the "Using the tokens" guidelines page for how the publish pipeline works and how to consume the tokens in other projects).

`public/brand/tokens.css` in this repo is **not** that live source — it's a hand-maintained fallback snapshot used only if the live fetch fails (e.g. offline local dev). It must be refreshed by hand (copy it from the assets repo) whenever the published tokens change; `tokens.js` logs a warning and the build fails outright if the source in use is missing a token the site depends on.

## Deployment

This site deploys to Netlify. See [NETLIFY-SETUP.md](NETLIFY-SETUP.md) for connecting the repo and setting up auto-rebuilds when brand tokens change.
