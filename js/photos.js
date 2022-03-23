---
---
{% assign images = site.static_files | where: "image", true %}
(function(html) {
  const id = document.currentScript.getAttribute('data-photo-id');
  const url = document.currentScript.getAttribute('data-photo-url');
  const target = document.currentScript.getAttribute('data-target-id');
  const container = document.querySelector(`#${target}`);
  container.innerHTML = html;
  openPhoto("id-"+id, url);
  lazyload();
})(`{% include photos.html %}`);
