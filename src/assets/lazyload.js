// Minimal lazy-loader. Swaps data-src -> src for img.lazyload when near viewport.
// Exposes a global lazyload() (re-callable after DOM changes), matching the
// markup's expectations.
(function () {
  function load(img) {
    var src = img.getAttribute("data-src");
    if (src) {
      img.src = src;
      img.removeAttribute("data-src");
    }
    img.classList.add("loaded");
  }

  window.lazyload = function () {
    var imgs = [].slice.call(document.querySelectorAll("img.lazyload[data-src]"));
    if (!("IntersectionObserver" in window)) {
      imgs.forEach(load);
      return;
    }
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            load(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px" }
    );
    imgs.forEach(function (img) {
      io.observe(img);
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    window.lazyload();
  });
})();
