// Loads the live brand tokens at BUILD time by fetching the published
// tokens.css from the assets bucket and parsing the CSS custom properties.
// This keeps the guidelines site reading from the same single source of truth
// as every other app — no duplicated values.
//
// If the fetch fails (e.g. offline local dev), it falls back to a bundled
// snapshot at public/brand/tokens.css so the build never hard-breaks.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TOKENS_URL =
  process.env.TOKENS_URL ?? "https://assets.cocolotravel.com/brand/tokens.css";

async function getCss() {
  // Try the live published tokens first (single source of truth).
  if (TOKENS_URL) {
    try {
      const res = await fetch(TOKENS_URL);
      if (res.ok) return await res.text();
    } catch {
      /* fall through to the bundled snapshot */
    }
  }
  // Fallback: the snapshot bundled at public/brand/tokens.css, resolved from
  // the project root (process.cwd()) so it works regardless of where Astro
  // places the compiled module.
  return readFileSync(resolve(process.cwd(), "public/brand/tokens.css"), "utf8");
}

// Parse `--name: value;` declarations into {name, value} pairs.
function parseVars(css) {
  const out = [];
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(css)) !== null) {
    out.push({ name: m[1].trim(), value: m[2].trim() });
  }
  return out;
}

const all = parseVars(await getCss());

// Categorize by prefix so each page can render the right group.
// Two tiers: semantic tokens (background/text/border — what code should use)
// and brand primitives (the palette itself, group "brand").
const GROUP_ORDER = ["background", "text", "border", "brand"];
const GROUP_LABELS = {
  background: "Background",
  text: "Text",
  border: "Border",
  brand: "Brand primitives",
};

export const colors = all
  .filter((t) => t.name.startsWith("color-"))
  .map((t) => ({
    ...t,
    // color-background-primary -> group "background", label "primary"
    group: t.name.split("-")[1] ?? "",
    label: t.name.split("-").slice(2).join(" ") || t.name,
    cssVar: `--${t.name}`,
  }))
  .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));

export function groupLabel(group) {
  return GROUP_LABELS[group] ?? group;
}

export const typographySizes = all
  .filter((t) => t.name.startsWith("font-size-"))
  .map((t) => ({ ...t, label: t.name.replace("font-size-", ""), cssVar: `--${t.name}` }));

export const typographyFamilies = all
  .filter((t) => t.name.startsWith("font-style-"))
  .map((t) => ({ ...t, label: t.name.replace("font-style-", ""), cssVar: `--${t.name}` }));

export const typographyWeights = all
  .filter((t) => t.name.startsWith("font-weights-"))
  .map((t) => ({ ...t, label: t.name.replace("font-weights-", ""), cssVar: `--${t.name}` }));

// No dedicated spacing tokens are published yet — the brand rule is an 8px
// scale (see references/tokens.md), not named steps. This is an illustrative
// scale, not read from the live token file.
export const spacing = [8, 16, 24, 32, 40, 48, 64, 96, 128].map((px) => ({
  label: `${px}px`,
  value: `${px}px`,
}));

// WCAG contrast helpers (hex only)
function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum(rgb) {
  const a = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
export function contrast(hex1, hex2) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  if (!a || !b) return null;
  const l1 = lum(a), l2 = lum(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
export function grade(ratio) {
  if (ratio == null) return { label: "—", pass: null };
  if (ratio >= 7) return { label: "AAA", pass: true };
  if (ratio >= 4.5) return { label: "AA", pass: true };
  if (ratio >= 3) return { label: "AA Lg", pass: true };
  return { label: "Fail", pass: false };
}
