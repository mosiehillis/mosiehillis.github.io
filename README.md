# mosiehillis.com

Photography portfolio for Mosie Hillis. The site is **driven entirely by the
`photos/` folder** — add a folder of photos, and a new gallery appears on the
site automatically. No code, no manual build.

The site has three levels:

1. **Categories** — Concerts, Weddings, Portraits (each shows a cover photo)
2. **Shoots** — within a category, one tile per shoot (band + date, the couple,
   the person/family)
3. **Gallery** — all the photos from that shoot

---

## Adding photos (for Mosie)

You only ever do one thing: **put photos in a folder inside the right category,
then save.** A robot does the rest (resizes the photos, cleans up the name and
date, and publishes the site — usually within a couple of minutes).

The folders live under `photos/`:

```
photos/
  concerts/     <- put concert shoots here
  weddings/     <- put wedding shoots here
  portraits/    <- put portrait shoots here
```

Make a **new folder** inside one of those, named however you like — it doesn't
have to be perfect. Good examples:

- `photos/concerts/Gavin DeGraw 9-13-22`
- `photos/weddings/Sarah and James`
- `photos/portraits/The Johnson Family`

Drop the photos into that folder. That's it. The site figures out a clean name
and the date for you.

### Option A — GitHub Desktop (on your Mac)

1. Open **GitHub Desktop** (one-time setup: install it and sign in, then
   "clone" this project — ask once and it's done forever).
2. Click **"Show in Finder"** to open the project folder.
3. Go into `photos/concerts` (or `weddings` / `portraits`), make a **new
   folder** for the shoot, and drag your JPGs into it.
4. Back in GitHub Desktop, type a short note in the bottom-left box (e.g.
   "Add Gavin DeGraw"), click **Commit to master**, then **Push origin**.
5. Wait ~2 minutes. The site updates itself.

### Option B — GitHub website (from your phone or any browser)

1. Go to the project on **github.com** → open the `photos` folder → open
   `concerts` (or `weddings` / `portraits`).
2. Click **Add file → Upload files**.
3. Drag your photos in. To put them in a new shoot folder, type the folder name
   followed by a `/` at the start of the file path box (e.g. `Gavin DeGraw/`).
4. Click **Commit changes**.
5. Wait ~2 minutes. The site updates itself.

### Choosing the cover photo

Each tile shows a random photo from the shoot, leaning toward recent ones. To
**always** use a specific photo as the cover, just include the word `cover` in
that photo's filename (e.g. `cover-01.jpg`).

### Fixing a name or date the site got wrong

The site usually names things correctly, but if it ever gets one wrong, open
`data/overrides.yml` (the GitHub website editor works on your phone) and add a
few lines. There are examples right in that file. For instance:

```yaml
"concerts/Gavin DeGraw 9-13-22":
  label: "Gavin DeGraw"
  date: "2022-09-13"
```

Save it, and the site fixes itself on the next update.

---

## How it works (for developers)

A small Node build script (`src/build.mjs`) does everything, run by GitHub
Actions on every push:

1. **scan** `photos/<category>/<shoot>/` and hash each folder's contents
2. **EXIF** read each photo's dimensions + date (`exifr` / `sharp`)
3. **metadata** turn the messy folder name + EXIF into `{label, date, slug}`
   via a Claude API call (`claude-haiku-4-5`), **cached by folder-hash** so each
   shoot is only ever sent once; `data/overrides.yml` wins over the AI guess
4. **images** generate `large` / `thumb` / `tint` derivatives with `sharp`
5. **manifest** + **render** the 3 page types and `manifest.json`
6. **deploy** `dist/` to GitHub Pages via `actions/deploy-pages`

Build output (`dist/`) is never committed — it's produced fresh in CI.

### Local development

Requires Node 18+.

```sh
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # optional; without it, names are derived
                                      # by a simple heuristic instead of the LLM
npm run build       # builds into dist/
npm run serve       # preview at http://localhost:8080
```

The one-time photo migration script (already run) lives at
`scripts/migrate-photos.cjs`.

### One-time GitHub setup

- **Settings → Pages → Source = "GitHub Actions"** (not "deploy from a branch").
- **Settings → Secrets and variables → Actions** → add `ANTHROPIC_API_KEY`.
- Confirm the custom domain `mosiehillis.com` and "Enforce HTTPS".
- After the first successful Actions deploy, the old `gh-pages` branch can be
  deleted.
- Optional speed-up: run `npm install` once and commit the generated
  `package-lock.json`, then switch the workflow's install step to `npm ci` and
  re-enable `cache: npm`.
