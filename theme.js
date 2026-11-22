/* Светлая и тёмная тема: подключается в head, чтобы страница не мигала при загрузке */
(function () {
  "use strict";
  const KEY = "tpos.theme";
  const root = document.documentElement;
  let latest = 0;
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }
  const saved = read();
  if (saved) root.setAttribute("data-theme", saved);

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next);
      return;
    }
    const box = button.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const ticket = ++latest;
    window.setTimeout(function () { if (ticket === latest) apply(next); }, 250);
    const transition = document.startViewTransition(function () { apply(next); });
    transition.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
        { duration: 550, easing: "cubic-bezier(.2, .75, .2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  });
})();
