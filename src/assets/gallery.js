// Lightbox + keyboard navigation for a shoot gallery.
// Ported from the original site's inline handlers (Jekyll bits removed).
(function () {
  var ESCAPE = 27, RIGHT = 39, LEFT = 37;
  var TARGET_CLASS = "target";

  function clickNavigationButton(buttonClass) {
    var id = window.history.state && window.history.state.id;
    if (id) {
      var button = document.querySelector("#" + id + " " + buttonClass);
      if (button) button.click();
    }
  }

  function removeTargetClass() {
    var targets = document.querySelectorAll("." + TARGET_CLASS);
    [].forEach.call(targets, function (t) {
      t.classList.remove(TARGET_CLASS);
    });
  }

  function openPhoto(id, href) {
    var photo = document.getElementById(id);
    if (!photo) return;
    removeTargetClass();
    photo.classList.add(TARGET_CLASS);
    document.title = photo.getAttribute("title") || document.title;
    if (href) window.history.pushState({ id: id }, "", href);
  }

  function closePhoto(href) {
    var titleEl = document.querySelector("head title");
    removeTargetClass();
    if (titleEl) document.title = titleEl.getAttribute("data-title") || document.title;
    if (href) window.history.pushState({}, "", href);
  }

  function handleClick(selector, event, cb) {
    if (event.target.matches && event.target.matches(selector)) {
      cb();
      event.preventDefault();
    }
  }

  function handleKey(keyCode, event, cb) {
    if (event.keyCode === keyCode) {
      cb();
      event.preventDefault();
    }
  }

  window.onpopstate = function (event) {
    if (event.state && event.state.id) openPhoto(event.state.id, null);
    else closePhoto(null);
  };

  document.addEventListener("keydown", function (event) {
    handleKey(ESCAPE, event, function () { clickNavigationButton(".close"); });
    handleKey(RIGHT, event, function () { clickNavigationButton(".next"); });
    handleKey(LEFT, event, function () { clickNavigationButton(".previous"); });
  });

  document.addEventListener("click", function (event) {
    handleClick("[data-target][href]", event, function () {
      openPhoto(event.target.getAttribute("data-target"), event.target.getAttribute("href"));
    });
    handleClick("[href].close", event, function () {
      closePhoto(event.target.getAttribute("href"));
    });
  });
})();
