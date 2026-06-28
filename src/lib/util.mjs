// Small shared helpers used across the build.

export function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// Assign a unique slug per shoot. Each shoot has { baseSlug, date }. On a
// baseSlug collision, the date disambiguates (relient-k-2022-03-18); if there's
// no date, fall back to -2/-3. Sets `slug` on each shoot.
export function assignSlugs(shoots) {
  const counts = {};
  for (const s of shoots) counts[s.baseSlug] = (counts[s.baseSlug] || 0) + 1;
  const used = new Set();
  for (const s of shoots) {
    let slug = s.baseSlug || "shoot";
    if (counts[s.baseSlug] > 1 && s.date) slug = `${s.baseSlug}-${s.date}`;
    let candidate = slug, n = 1;
    while (used.has(candidate)) candidate = `${slug}-${++n}`;
    used.add(candidate);
    s.slug = candidate;
  }
}

// "2022-09-13" -> "September 13, 2022". Returns "" for falsy input.
export function prettyDate(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

// Escape text for safe insertion into HTML.
export function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Encode each path segment so URLs with spaces/specials work in href/src.
export function encodePath(p) {
  return p.split("/").map(encodeURIComponent).join("/");
}

// A Date -> "YYYY-MM-DD" (local-agnostic, uses UTC parts of the value as given).
export function toIso(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
