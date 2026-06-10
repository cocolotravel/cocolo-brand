---
title: Using the tokens
description: How to consume the brand tokens in any Cocolo app.
---

Every brand value lives in one place and is published as a single CSS file. Any
app links to it and uses the variables — no hard-coded hex values, no copies that
drift.

## Link the stylesheet

Add this to the `<head>` of any site or app you control:

```html
<link rel="stylesheet" href="https://assets.cocolotravel.com/brand/tokens.css" />
```

## Use the variables

Then reference the tokens instead of literal values:

```css
.button {
  background: var(--color-cloud-sky);
  color: var(--color-cloud-white);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--typography-family-body);
}

.heading {
  font-family: var(--typography-family-display);
  font-size: var(--typography-size-3xl);
  color: var(--color-cloud-ink);
}
```

When a value changes at the source, every app that links the file updates with it.

## Where the values come from

```
Designer edits in Figma (Tokens Studio)
   → pushes tokens.json to the brand repo
   → a GitHub Action regenerates tokens.css
   → publishes it to assets.cocolotravel.com/brand/tokens.css
   → every app linking the file updates; this site re-renders from it too
```

## Notes

- **Caching:** the file is served with a short cache (5 minutes), so changes
  propagate quickly. Don't hard-cache it for longer in your app.
- **CORS:** the assets bucket allows cross-origin reads, so loading the stylesheet
  (and the brand fonts) from another domain works — including partner sites.
- **Don't copy values.** If you find yourself pasting a hex code, reach for the
  variable instead. The whole point is a single source of truth.
