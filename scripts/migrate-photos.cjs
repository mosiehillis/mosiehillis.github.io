#!/usr/bin/env node
/*
 * One-time migration of the legacy flat photo set into the new folder layout.
 *
 *   photos/original/concerts_Mosie-GavinDeGraw-091322-1.jpg
 *     ->  photos/concerts/Gavin DeGraw 2022-09-13/01.jpg
 *
 * Dependency-free (runs on the old Node already on this machine). Safe to read
 * before running: it only moves files within photos/ and prints a summary.
 *
 * Run with:  node scripts/migrate-photos.cjs            (dry run, prints plan)
 *            node scripts/migrate-photos.cjs --apply     (actually moves files)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "photos", "original");
const PHOTOS = path.join(ROOT, "photos");
const APPLY = process.argv.includes("--apply");

// Pretty display names for the artists/events present in the legacy set.
const PRETTY = {
  alexhoward: "Alex Howard",
  bangahrang: "Bangahrang",
  bewell: "Be Well",
  fouryearstrong: "Four Year Strong",
  gavindegraw: "Gavin DeGraw",
  judahandthelion: "Judah and the Lion",
  mattnathanson: "Matt Nathanson",
  mattthiessen: "Matt Thiessen",
  maxbemis: "Max Bemis",
  ncmf: "NCMF",
  newfoundglory: "New Found Glory",
  relientk: "Relient K",
  roara: "Roara",
  shakeygraves: "Shakey Graves",
  thebeaches: "The Beaches",
  theheadandtheheart: "The Head and the Heart",
  thenationalparks: "The National Parks",
};

// Parse a 5- or 6-digit MMDDYY / MDDYY token into { iso, sort }.
function parseDate(token) {
  if (!/^\d{5,6}$/.test(token)) return null;
  let mm, dd, yy;
  if (token.length === 6) {
    mm = token.slice(0, 2);
    dd = token.slice(2, 4);
    yy = token.slice(4, 6);
  } else {
    mm = "0" + token.slice(0, 1);
    dd = token.slice(1, 3);
    yy = token.slice(3, 5);
  }
  const iso = `20${yy}-${mm}-${dd}`;
  return { iso, sort: Number(`20${yy}${mm}${dd}`) };
}

function main() {
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const plan = []; // { folder, dateSort, seq, src, ext }
  const skipped = [];

  for (const file of files) {
    // Drop the two stray test dupes (a concert frame mislabeled wedding/portrait).
    if (/^(weddings|portraits)_/i.test(file)) {
      skipped.push(file);
      continue;
    }
    const stem = file.replace(/\.[^.]+$/, "");
    const ext = (file.match(/\.[^.]+$/) || [".jpg"])[0].toLowerCase();
    // tokens, dropping the "concerts" prefix and the "mosie"/"Mosie" credit.
    const tokens = stem
      .split(/[-_]/)
      .filter((t) => t && t.toLowerCase() !== "concerts" && t.toLowerCase() !== "mosie");

    const artistKey = (tokens[0] || "").toLowerCase();
    const rest = tokens.slice(1);
    const dateToken = rest.find((t) => /^\d{5,6}$/.test(t));
    const date = dateToken ? parseDate(dateToken) : null;
    const seqToken = rest[rest.length - 1];
    const seq = /^\d{1,2}$/.test(seqToken) ? Number(seqToken) : 0;

    const pretty = PRETTY[artistKey] || tokens[0] || "Unknown";

    let folder;
    if (artistKey === "ncmf") {
      folder = "NCMF 2022"; // multi-day festival -> one shoot
    } else if (date) {
      folder = `${pretty} ${date.iso}`;
    } else {
      folder = pretty; // e.g. "The Beaches" (no date in the legacy name)
    }

    plan.push({
      folder,
      dateSort: date ? date.sort : 0,
      seq,
      src: path.join(SRC, file),
      ext,
    });
  }

  // Group by folder, order within each by (date, seq), renumber 01..NN.
  const byFolder = {};
  for (const item of plan) (byFolder[item.folder] = byFolder[item.folder] || []).push(item);

  const moves = [];
  for (const folder of Object.keys(byFolder).sort()) {
    const items = byFolder[folder].sort(
      (a, b) => a.dateSort - b.dateSort || a.seq - b.seq
    );
    items.forEach((item, i) => {
      const n = String(i + 1).padStart(2, "0");
      moves.push({
        src: item.src,
        dest: path.join(PHOTOS, "concerts", folder, `${n}${item.ext}`),
      });
    });
  }

  // Report.
  console.log(`Found ${files.length} files in photos/original`);
  console.log(`Skipping ${skipped.length} stray test dupe(s): ${skipped.join(", ")}`);
  console.log(`Planning ${moves.length} moves into ${Object.keys(byFolder).length} shoot folders:\n`);
  for (const folder of Object.keys(byFolder).sort()) {
    console.log(`  concerts/${folder}/  (${byFolder[folder].length})`);
  }

  if (!APPLY) {
    console.log(`\nDry run only. Re-run with --apply to move files.`);
    return;
  }

  for (const m of moves) {
    fs.mkdirSync(path.dirname(m.dest), { recursive: true });
    fs.renameSync(m.src, m.dest);
  }
  for (const f of skipped) fs.unlinkSync(path.join(SRC, f));

  // Ensure the other category folders exist (empty for now).
  for (const cat of ["weddings", "portraits"]) {
    const dir = path.join(PHOTOS, cat);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, ".gitkeep"), "");
  }
  // Remove the now-empty legacy original/ dir.
  try {
    if (fs.readdirSync(SRC).length === 0) fs.rmdirSync(SRC);
  } catch (e) {}

  console.log(`\nApplied. Moved ${moves.length} files; created weddings/ and portraits/.`);
}

main();
