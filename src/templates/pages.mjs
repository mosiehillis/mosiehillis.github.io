import { esc, prettyDate } from "../lib/util.mjs";
import { layout } from "./layout.mjs";

// Server-rendered default cover (before covers.js swaps in a random pick):
// a pinned photo, else the most recent, else the first.
export function defaultCover(photos) {
  if (!photos || !photos.length) return null;
  const pinned = photos.find((p) => p.cover);
  if (pinned) return pinned;
  const dated = photos.filter((p) => p.date).sort((a, b) => b.date.localeCompare(a.date));
  return dated[0] || photos[0];
}

function card({ href, coverAttr, coverVal, cover, labelHtml }) {
  const tint = cover ? cover.tint : "";
  const src = cover ? cover.thumb : "";
  const dims = cover && cover.w && cover.h ? ` width="${cover.w}" height="${cover.h}"` : "";
  return `<li class="item card" style="background-image:url('${esc(tint)}')">
		<a href="${esc(href)}">
			<img src="${esc(src)}"${dims} ${esc(coverAttr)}="${esc(coverVal)}" alt="">
			<span class="label">${labelHtml}</span>
		</a>
	</li>`;
}

// LEVEL 1 — category index
export function categoryIndex({ site, categories }) {
  const cards = categories
    .map((cat) =>
      card({
        href: `/${cat.slug}/`,
        coverAttr: "data-cover-category",
        coverVal: cat.slug,
        cover: defaultCover(cat.allPhotos),
        labelHtml: esc(cat.label),
      })
    )
    .join("\n\t\t");

  const body = `<ul class="grid">\n\t\t${cards}\n\t</ul>`;
  return layout({ site, body });
}

// LEVEL 2 — shoots within a category
export function categoryShoots({ site, category }) {
  let body;
  if (!category.shoots.length) {
    body = `<ul class="grid"><li class="empty">No ${esc(category.label.toLowerCase())} shoots yet.</li></ul>`;
  } else {
    const cards = category.shoots
      .map((shoot) =>
        card({
          href: `/${category.slug}/${shoot.slug}/`,
          coverAttr: "data-cover-shoot",
          coverVal: `${category.slug}/${shoot.slug}`,
          cover: defaultCover(shoot.photos),
          labelHtml:
            esc(shoot.label) +
            (shoot.date ? `<span class="date">${esc(prettyDate(shoot.date))}</span>` : ""),
        })
      )
      .join("\n\t\t");
    body = `<ul class="grid">\n\t\t${cards}\n\t</ul>`;
  }

  return layout({
    site,
    title: category.label,
    breadcrumb: [{ label: category.label }],
    ogImage: coverUrl(site, defaultCover(category.allPhotos)),
    body,
  });
}

// LEVEL 3 — shoot gallery
export function shootGallery({ site, category, shoot }) {
  const items = shoot.photos
    .map((p, i) => {
      const id = `id-${shoot.slug}-${i + 1}`;
      const dims = p.w && p.h ? ` width="${p.w}" height="${p.h}"` : "";
      const prev =
        i > 0
          ? `<a href="#id-${esc(shoot.slug)}-${i}" data-target="id-${esc(shoot.slug)}-${i}" class="previous" title="Previous"><span>Previous</span></a>`
          : "";
      const next =
        i < shoot.photos.length - 1
          ? `<a href="#id-${esc(shoot.slug)}-${i + 2}" data-target="id-${esc(shoot.slug)}-${i + 2}" class="next" title="Next"><span>Next</span></a>`
          : "";
      return `<li class="item" id="${id}" style="background-image:url('${esc(p.tint)}')" title="${esc(shoot.label)}">
			<img class="lazyload" data-src="${esc(p.thumb)}" src="${esc(p.tint)}"${dims} alt="">
			<span class="full"><span style="background-image:url('${esc(p.large)}')"></span></span>
			<a class="open" href="#${id}" data-target="${id}">Open</a>
			<a class="close" href="#">Close</a>
			${prev}
			${next}
		</li>`;
    })
    .join("\n\t\t");

  const body = `<ul class="grid" id="target">\n\t\t${items}\n\t</ul>`;

  return layout({
    site,
    title: shoot.label,
    description: `${shoot.label}${shoot.date ? " — " + prettyDate(shoot.date) : ""} · ${category.label} photography by ${site.author}.`,
    breadcrumb: [{ label: category.label, href: `/${category.slug}/` }, { label: shoot.label }],
    ogImage: coverUrl(site, defaultCover(shoot.photos)),
    body,
    extraScripts: ["/js/gallery.js"],
  });
}

function coverUrl(site, cover) {
  if (!cover) return null;
  const base = site.url.replace(/\/$/, "");
  return base + cover.large;
}
