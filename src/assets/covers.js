// Picks the cover image for category cards (level 1) and shoot cards (level 2)
// on each visit. Pinned covers win; otherwise a recency-weighted random photo
// is chosen so covers feel lively. Reads the site manifest.
(function () {
  function recencyWeight(dateStr) {
    if (!dateStr) return 0.25; // undated -> low weight
    var then = Date.parse(dateStr);
    if (isNaN(then)) return 0.25;
    var ageDays = (Date.now() - then) / 86400000;
    return 1 / (1 + Math.max(0, ageDays) / 365);
  }

  function weightedPick(photos) {
    if (!photos || !photos.length) return null;
    var pinned = photos.filter(function (p) { return p.cover; });
    if (pinned.length) return pinned[Math.floor(Math.random() * pinned.length)];
    var total = 0, weights = photos.map(function (p) {
      var w = recencyWeight(p.date); total += w; return w;
    });
    var r = Math.random() * total;
    for (var i = 0; i < photos.length; i++) {
      r -= weights[i];
      if (r <= 0) return photos[i];
    }
    return photos[photos.length - 1];
  }

  function setCover(el, photo) {
    if (!photo) return;
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    if (img && photo.thumb) img.src = photo.thumb;
  }

  fetch("/manifest.json")
    .then(function (r) { return r.json(); })
    .then(function (manifest) {
      var byCategory = {}, byShoot = {};
      (manifest.categories || []).forEach(function (cat) {
        var all = [];
        (cat.shoots || []).forEach(function (shoot) {
          byShoot[cat.slug + "/" + shoot.slug] = shoot.photos || [];
          all = all.concat(shoot.photos || []);
        });
        byCategory[cat.slug] = all;
      });

      [].forEach.call(document.querySelectorAll("[data-cover-category]"), function (el) {
        setCover(el, weightedPick(byCategory[el.getAttribute("data-cover-category")]));
      });
      [].forEach.call(document.querySelectorAll("[data-cover-shoot]"), function (el) {
        setCover(el, weightedPick(byShoot[el.getAttribute("data-cover-shoot")]));
      });
    })
    .catch(function () { /* keep server-rendered default cover */ });
})();
