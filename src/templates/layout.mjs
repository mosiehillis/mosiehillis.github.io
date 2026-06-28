import { esc } from "../lib/util.mjs";

// Renders the full HTML shell. `breadcrumb` is an array of { label, href? };
// the last item is treated as the current page. `extraScripts` is an array of
// absolute script srcs included before </body>.
export function layout({ site, title, description, ogImage, breadcrumb = [], body, extraScripts = [] }) {
  const pageTitle = title ? `${title} — ${site.title}` : site.title;
  const desc = description || site.description || "";
  const img = ogImage || `${site.url}social-preview.png`;

  const crumbHtml = breadcrumb
    .map((c, i) => {
      const last = i === breadcrumb.length - 1;
      if (last || !c.href) return `<span class="here">${esc(c.label)}</span>`;
      return `<a href="${esc(c.href)}">${esc(c.label)}</a>`;
    })
    .join('<span class="sep">/</span>');

  const scripts = extraScripts
    .map((s) => `<script defer src="${esc(s)}"></script>`)
    .join("\n\t");

  return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<title data-title="${esc(site.title)}">${esc(pageTitle)}</title>
	<meta name="description" content="${esc(desc)}">
	<meta property="og:title" content="${esc(title || site.title)}">
	<meta property="og:type" content="website">
	<meta property="og:image" content="${esc(img)}">
	<meta property="og:site_name" content="${esc(site.title)}">
	<meta property="og:description" content="${esc(desc)}">
	<meta name="twitter:card" content="summary_large_image">
	${site.twitter ? `<meta name="twitter:site" content="@${esc(site.twitter)}">` : ""}
	<meta name="twitter:image" content="${esc(img)}">
	<link rel="stylesheet" type="text/css" href="/css/master.css">
	<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
	<link rel="manifest" href="/favicons/site.webmanifest">
	<script defer src="/js/lazyload.js"></script>
	<script defer src="/js/covers.js"></script>
	${scripts}
</head>
<body>
	<header class="site-header">
		<div class="title"><a href="/">${esc(site.title)}</a></div>
		${crumbHtml ? `<nav class="breadcrumb">${crumbHtml}</nav>` : ""}
	</header>
	${body}
	<ul class="links">
		${site.instagram ? `<li class="instagram"><a rel="me" href="https://instagram.com/${esc(site.instagram)}" title="Instagram">Instagram</a></li>` : ""}
		${site.twitter ? `<li class="twitter"><a rel="me" href="https://twitter.com/${esc(site.twitter)}" title="Twitter">Twitter</a></li>` : ""}
		${site.email ? `<li class="email"><a rel="me" href="mailto:${esc(site.email)}" title="Email">Email</a></li>` : ""}
	</ul>
</body>
</html>
`;
}
