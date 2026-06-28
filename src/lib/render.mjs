// Write the generated site to dist/: the 3 page types, manifest.json, compiled
// CSS, JS assets, favicons, and CNAME.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";
import { categoryIndex, categoryShoots, shootGallery } from "../templates/pages.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(__dirname, "..", "assets");

function writePage(outRoot, relPath, html) {
  const dest = path.join(outRoot, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function buildManifest(categories) {
  return {
    categories: categories.map((cat) => ({
      slug: cat.slug,
      label: cat.label,
      shoots: cat.shoots.map((shoot) => ({
        slug: shoot.slug,
        label: shoot.label,
        date: shoot.date,
        photos: shoot.photos.map((p) => ({
          thumb: p.thumb,
          large: p.large,
          date: p.date,
          cover: p.cover,
        })),
      })),
    })),
  };
}

export function renderSite({ site, categories, outRoot }) {
  // Pages
  writePage(outRoot, "index.html", categoryIndex({ site, categories }));
  for (const category of categories) {
    writePage(outRoot, `${category.slug}/index.html`, categoryShoots({ site, category }));
    for (const shoot of category.shoots) {
      writePage(
        outRoot,
        `${category.slug}/${shoot.slug}/index.html`,
        shootGallery({ site, category, shoot })
      );
    }
  }

  // Manifest (single source for client cover picker)
  fs.writeFileSync(
    path.join(outRoot, "manifest.json"),
    JSON.stringify(buildManifest(categories))
  );

  // CSS (compile scss)
  const css = sass.compile(path.join(ASSETS, "master.scss")).css;
  fs.mkdirSync(path.join(outRoot, "css"), { recursive: true });
  fs.writeFileSync(path.join(outRoot, "css", "master.css"), css);

  // JS assets
  fs.mkdirSync(path.join(outRoot, "js"), { recursive: true });
  for (const js of ["lazyload.js", "gallery.js", "covers.js"]) {
    fs.copyFileSync(path.join(ASSETS, js), path.join(outRoot, "js", js));
  }

  // Static passthrough
  copyDir(path.join(ROOT, "favicons"), path.join(outRoot, "favicons"));
  // master.css references ../img/icon-*.svg -> served at /img alongside photo dirs
  copyDir(path.join(ROOT, "img"), path.join(outRoot, "img"));
  const cname = path.join(ROOT, "CNAME");
  if (fs.existsSync(cname)) fs.copyFileSync(cname, path.join(outRoot, "CNAME"));
}
