---
title: Using the tokens
description: How to consume the brand tokens in any COCOLO app.
---

Every brand value lives in one place and is published as a single CSS file.
Any app links to it and uses the variables — no hard-coded hex values, no
copies that drift.

## Link the stylesheet

Add this to the `<head>` of any site or app you control:

```html
<link rel="stylesheet" href="https://assets.cocolotravel.com/brand/tokens.css" />
```

## Use the semantic tokens, not the brand primitives

The system has two tiers. **Semantic tokens** (`--color-text-*`,
`--color-background-*`, `--color-border-*`) describe a *job* — this is what
code should use. **Brand primitives** (`--color-brand-*`) define the palette
itself; reach for them only when no semantic token fits.

```css
.button {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-family: var(--font-style-inter);
  font-size: var(--font-size-base);
}

.heading {
  font-family: var(--font-style-roslindale);
  font-size: var(--font-size-h2);
  color: var(--color-text-primary);
}
```

Writing `var(--color-text-primary)` instead of `var(--color-brand-sumi)`
means that if the brand ever re-points its text color, your code follows
automatically.

## Where the values come from

```
Designer edits in Figma (Tokens Studio)
   → pushes DTCG tokens.json to the axelder/assets repo
   → a GitHub Action regenerates tokens.css
   → publishes it to assets.cocolotravel.com/brand/tokens.css
   → every app linking the file updates; this site re-renders from it too
```

## Notes

- **Caching:** the file is served with a short cache, so changes propagate
  quickly. Don't hard-cache it for longer in your app.
- **CORS:** the assets bucket allows cross-origin reads, so loading the
  stylesheet (and the brand fonts) from another domain works — including
  partner sites.
- **Don't copy values.** If you find yourself pasting a hex code or a pixel
  value, reach for the token instead. The whole point is a single source of
  truth.
- **No spacing tokens yet.** The 8px scale on the [Spacing](/guidelines/spacing/)
  page is a rule, not a published token set — there's nothing to import for
  it today.
