// Build orchestrator: scan photos -> read EXIF -> derive metadata (LLM+cache)
// -> apply overrides -> assign unique slugs -> process images -> render site.
//
//   node src/build.mjs        builds into dist/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { scanPhotos } from "./lib/scan.mjs";
import { readPhoto } from "./lib/exif.mjs";
import { deriveMetadata } from "./lib/metadata-llm.mjs";
import { loadCache, saveCache } from "./lib/cache.mjs";
import { loadOverrides, applyOverride } from "./lib/overrides.mjs";
import { processShoot } from "./lib/images.mjs";
import { renderSite } from "./lib/render.mjs";
import { slugify, assignSlugs } from "./lib/util.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTOS = path.join(ROOT, "photos");
const OUT = path.join(ROOT, "dist");
const DATA = path.join(ROOT, "data");

const loadSite = () => JSON.parse(fs.readFileSync(path.join(DATA, "site.json"), "utf8"));
const titleCase = (s) => s.replace(/(^|\s)\w/g, (m) => m.toUpperCase());

function orderCategories(found, order) {
  const bySlug = new Map(found.map((c) => [c.slug, c]));
  const ordered = [];
  for (const slug of order || []) if (bySlug.has(slug)) ordered.push(bySlug.get(slug));
  for (const c of found) if (!(order || []).includes(c.slug)) ordered.push(c);
  return ordered;
}

async function build() {
  const site = loadSite();
  const overrides = loadOverrides(path.join(DATA, "overrides.yml"));
  const cachePath = path.join(DATA, "llm-cache.json");
  const cache = loadCache(cachePath);

  fs.rmSync(OUT, { recursive: true, force: true });

  const scanned = orderCategories(scanPhotos(PHOTOS), site.categoryOrder);
  let llmCalls = 0, cacheHits = 0;
  const categories = [];

  for (const cat of scanned) {
    const category = {
      slug: cat.slug,
      label: (site.categoryLabels && site.categoryLabels[cat.slug]) || titleCase(cat.slug),
      shoots: [],
    };

    // Pass 1: EXIF + metadata (no images yet — slugs aren't final).
    for (const shoot of cat.shoots) {
      const photoMeta = [];
      for (const file of shoot.files) {
        photoMeta.push({ file, ...(await readPhoto(path.join(shoot.dir, file))) });
      }
      const exifDates = [...new Set(photoMeta.map((p) => p.date).filter(Boolean))].sort();

      let derived = cache[shoot.hash];
      if (derived) {
        cacheHits++;
      } else {
        derived = await deriveMetadata({ folder: shoot.folder, category: cat.slug, exifDates });
        cache[shoot.hash] = derived;
        if (derived.source === "llm") llmCalls++;
        console.log(`  derived "${shoot.folder}" -> "${derived.label}" (${derived.source})`);
      }

      const ov = overrides[shoot.dirRel];
      const meta = applyOverride({ label: derived.label, date: derived.date, slug: derived.slug }, ov);

      category.shoots.push({
        raw: shoot,
        photoMeta,
        label: meta.label,
        date: meta.date || exifDates[0] || null,
        baseSlug: slugify(meta.slug || meta.label) || "shoot",
        coverFile: ov && ov.cover,
      });
    }

    assignSlugs(category.shoots);

    // Pass 2: images with final slugs.
    for (const shoot of category.shoots) {
      shoot.photos = await processShoot({
        shoot: shoot.raw,
        slug: shoot.slug,
        photos: shoot.photoMeta,
        outRoot: OUT,
        coverFile: shoot.coverFile,
      });
      delete shoot.raw;
      delete shoot.photoMeta;
    }

    category.shoots.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    category.allPhotos = category.shoots.flatMap((s) => s.photos);
    categories.push(category);
  }

  renderSite({ site, categories, outRoot: OUT });
  saveCache(cachePath, cache);

  const shootCount = categories.reduce((n, c) => n + c.shoots.length, 0);
  console.log(
    `\nBuilt ${categories.length} categories, ${shootCount} shoots into dist/ ` +
      `(${cacheHits} cached, ${llmCalls} LLM calls).`
  );
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
