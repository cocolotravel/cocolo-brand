# Connecting the guidelines site to Netlify + auto-rebuild

This sets up the `cocolo-brand` guidelines site on Netlify and makes it rebuild
automatically whenever the brand tokens change.

There are TWO repos involved — keep them straight:

- **`axelder/assets`** — holds `tokens.json` + the token-deploy Action (already set up)
- **`cocolo-brand`** — the new guidelines site (this project)

---

## Part 1 — Push this project to the `cocolo-brand` repo

Create the repo on GitHub (empty, no README), then from this project folder:

```bash
git init
git add .
git commit -m "Cocolo brand guidelines site"
git branch -M main
git remote add origin https://github.com/axelder/cocolo-brand.git
git push -u origin main
```

---

## Part 2 — Connect it to Netlify

1. Netlify dashboard → **Add new site → Import an existing project**
2. Pick GitHub → the `cocolo-brand` repo
3. Netlify reads `netlify.toml` and fills in build command (`npm run build`) and
   publish dir (`dist`) automatically — just confirm
4. Deploy. You'll get a URL like `https://cocolo-brand.netlify.app`
5. **Update `astro.config.mjs`** — set `site:` to that URL (or your custom domain),
   commit, push. (Needed for the sitemap.)

At this point the site rebuilds on every push to `cocolo-brand` — standard
Netlify behavior. The next part adds the *token-driven* rebuild.

---

## Part 3 — Create a Netlify build hook

1. In the `cocolo-brand` site → **Site configuration → Build & deploy →
   Build hooks → Add build hook**
2. Name it `tokens-changed`, branch `main`
3. Netlify gives you a URL like:
   `https://api.netlify.com/build_hooks/abc123def456`
4. Copy it.

---

## Part 4 — Store the hook URL as a secret in the ASSETS repo

The hook URL is a trigger credential — anyone with it can start a build, so don't
hardcode it. In the **`axelder/assets`** repo (not cocolo-brand):

GitHub → Settings → Secrets and variables → Actions → New repository secret
- Name: `NETLIFY_BUILD_HOOK`
- Value: the build hook URL from Part 3

---

## Part 5 — Add one step to the existing token Action

Edit `.github/workflows/deploy-tokens.yml` in the **`axelder/assets`** repo. After
the existing "Upload tokens.css to the assets bucket" step, add this new step
(shown here with the step before it for placement):

```yaml
      - name: Upload tokens.css to the assets bucket
        env:
          ACCESS_KEY: ${{ secrets.LINODE_ACCESS_KEY }}
          SECRET_KEY: ${{ secrets.LINODE_SECRET_KEY }}
        run: |
          s3cmd \
            --access_key="$ACCESS_KEY" \
            --secret_key="$SECRET_KEY" \
            --host="$ENDPOINT" \
            --host-bucket="%(bucket)s.$ENDPOINT" \
            --acl-public \
            --no-mime-magic --guess-mime-type \
            --add-header="Cache-Control:public, max-age=300" \
            put public/brand/tokens.css "s3://$BUCKET/$OBJECT_KEY"

      # ── NEW STEP: trigger the Netlify rebuild of the guidelines site ──
      - name: Rebuild guidelines site on Netlify
        if: ${{ env.HOOK != '' }}
        env:
          HOOK: ${{ secrets.NETLIFY_BUILD_HOOK }}
        run: |
          echo "Pinging Netlify build hook to rebuild the guidelines site…"
          curl -fsS -X POST -d '{}' "$HOOK"
          echo "Triggered."
```

That's the whole change — one step, one `curl`. The `if:` guard means it simply
skips (rather than fails) if the secret isn't set yet, so you can add the step
now and the secret later without breaking runs.

---

## The result

```
Designer edits in Figma (Tokens Studio)
  → pushes tokens.json to axelder/assets
  → Action regenerates tokens.css + uploads to the bucket
  → Action pings the Netlify build hook              ← the new step
  → Netlify rebuilds cocolo-brand, fetching the fresh tokens
  → guidelines site shows the new values
```

Why a build hook and not a second workflow: the docs site reads tokens at BUILD
time, so it needs an explicit nudge after each token change. Triggering it from
the assets Action — *after* the upload — guarantees the rebuild picks up the new
values instead of racing the upload.

## Quick test

After everything's wired: make a trivial change to `tokens.json` in `axelder/assets`,
commit, and watch (a) the assets Action run and ping the hook, then (b) a new
deploy appear in the Netlify dashboard for `cocolo-brand`. When it finishes, the
swatches reflect the change.
