// Persistent cache of derived metadata, keyed by a shoot's folder-content hash.
// This is what keeps the LLM from being re-called for unchanged folders.
// In CI it is restored/saved via actions/cache; locally it lives in data/.

import fs from "node:fs";
import path from "node:path";

export function loadCache(cachePath) {
  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch {
    return {};
  }
}

export function saveCache(cachePath, cache) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + "\n");
}
