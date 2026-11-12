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

## doc.css: the document base stylesheet

`doc.css` is the base stylesheet for COCOLO's document pages — roadbooks,
proposals, and apps. It turns the [Document scale](/guidelines/typography/#document-scale)
above into ready classes (`t-title`, `t-section`, `row`, `callout`, `chip`,
`btn`, the bottom tab bar, print rules) instead of every app reimplementing
them by hand. Like `tokens.css`, everything in it reads tokens — no hex
colors, no pixel sizes.

It needs `tokens.css` first, so load it second:

```html
<link rel="stylesheet" href="https://assets.cocolotravel.com/brand/tokens.css" />
<link rel="stylesheet" href="https://assets.cocolotravel.com/brand/doc.css" />
<body class="doc">...</body>
```

See [`docs/doc-css.md`](https://github.com/axelder/assets/blob/main/docs/doc-css.md)
in the `axelder/assets` repo for the full class list, the rules it enforces,
and how to change and test it.

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

`tokens.css` is **hand-edited**, directly, in the `axelder/assets` repo —
there is no generator and nothing to regenerate it from.

```text
public/brand/tokens.css edited on a branch (axelder/assets repo)
   → opened as a pull request
   → CI validates it (scripts/check-tokens.mjs)
   → merging to main uploads it to assets.cocolotravel.com/brand/tokens.css
   → the published file is cached for 5 minutes at the edge, so the deploy
     workflow waits out that cache before it triggers this site's rebuild
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
