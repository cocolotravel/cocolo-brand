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
  content/docs/guidelines/   Guideline pages (colors, typography, spacing, logo, voice, imagery, tokens...)
  components/                Astro components used in the docs (color swatches, type/spacing scales)
  styles/                    Brand CSS layered on top of Starlight's theme
public/
  brand/tokens.css           Live design tokens
```

Sidebar navigation and site metadata are configured in [astro.config.mjs](astro.config.mjs).

## Design tokens

Colors, type, and spacing are driven by tokens pulled from the `axelder/assets` repo (see `public/brand/tokens.css` and `src/styles/tokens.css`). See the "Using the tokens" guidelines page for how to consume them in other projects.

## Deployment

This site deploys to Netlify. See [NETLIFY-SETUP.md](NETLIFY-SETUP.md) for connecting the repo and setting up auto-rebuilds when brand tokens change.
