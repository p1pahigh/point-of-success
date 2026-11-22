/* Курсор-пчёлка на лендинге: вместо стрелки мыши, клик по носику пчёлки.
   Только для мыши (на телефоне нет), в полях ввода обычный курсор. */
(function () {
  "use strict";
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SIZE = 40;            // размер пчёлки в пикселях
  const HOT = { x: 12, y: 12 }; // точка клика (носик) внутри картинки 40×40
  const CLICKABLE = "a, button, summary, label, select, [role=button], [data-theme-toggle]";
  const TEXT = "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, [contenteditable]";

  const css = document.createElement("style");
  css.textContent =
    "html.bee-on, html.bee-on * { cursor: none !important; }" +
    "html.bee-on " + TEXT.split(", ").join(", html.bee-on ") + " { cursor: text !important; }" +
    ".bee { position: fixed; left: 0; top: 0; z-index: 9999; width: " + SIZE + "px; height: " + SIZE + "px; pointer-events: none; opacity: 0; transition: opacity .2s ease; will-change: transform; }" +
    ".bee.is-on { opacity: 1; }" +
    ".bee-body { width: 100%; height: 100%; transform-origin: " + HOT.x + "px " + HOT.y + "px; transition: transform .25s cubic-bezier(.2,.8,.2,1); }" +
    ".bee.is-link .bee-body { transform: scale(1.18); }" +
    ".bee.is-down .bee-body { transform: scale(.88); transition-duration: .1s; }" +
    ".bee svg { display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 2px 2px rgba(24, 34, 48, .28)); }" +
    "[data-theme=dark] .bee svg { filter: drop-shadow(0 0 1.5px rgba(245, 242, 235, .55)) drop-shadow(0 2px 3px rgba(0, 0, 0, .5)); }" +
    ".bee-wing { transform-box: fill-box; transform-origin: 50% 100%; animation: bee-flap .11s ease-in-out infinite alternate; }" +
    ".bee-wing--back { animation-delay: -.055s; }" +
    ".bee.is-link .bee-wing { animation-duration: .07s; }" +
    ".bee-float { animation: bee-float 1.6s ease-in-out infinite alternate; }" +
    "@keyframes bee-flap { from { transform: scaleY(1); } to { transform: scaleY(.35); } }" +
    "@keyframes bee-float { from { transform: translateY(-.6px); } to { transform: translateY(.6px); } }" +
    (calm ? ".bee-wing, .bee-float { animation: none; }" : "");
  document.head.appendChild(css);

  /* Пчела смотрит влево-вверх: голова у точки клика. Рисунок в клетке 40×40, повёрнут на 45°. */
  const INK = "#182230";
  const bee = document.createElement("div");
  bee.className = "bee";
  bee.setAttribute("aria-hidden", "true");
  bee.innerHTML =
    "<div class=\"bee-body\"><svg viewBox=\"0 0 40 40\"><defs>" +
    "<linearGradient id=\"bee-honey\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#F2C46B\"/><stop offset=\"1\" stop-color=\"#D99A3D\"/></linearGradient>" +
    "<clipPath id=\"bee-clip\"><ellipse cx=\"24\" cy=\"20\" rx=\"9\" ry=\"6.6\"/></clipPath></defs>" +
    "<g class=\"bee-float\"><g transform=\"rotate(45 20 20)\">" +
    /* крылья */
    "<g transform=\"rotate(18 27.5 17)\"><ellipse class=\"bee-wing bee-wing--back\" cx=\"27.5\" cy=\"11.6\" rx=\"3.6\" ry=\"6\" fill=\"rgba(255,255,255,.72)\" stroke=\"" + INK + "\" stroke-opacity=\".55\" stroke-width=\".9\"/></g>" +
    "<g transform=\"rotate(-16 22.5 17)\"><ellipse class=\"bee-wing\" cx=\"22.5\" cy=\"11\" rx=\"4.2\" ry=\"6.8\" fill=\"rgba(255,255,255,.85)\" stroke=\"" + INK + "\" stroke-opacity=\".6\" stroke-width=\".9\"/></g>" +
    /* жало */
    "<path d=\"M32.4 18.6 L36.2 20 L32.4 21.4 Z\" fill=\"" + INK + "\"/>" +
    /* брюшко с полосками */
    "<ellipse cx=\"24\" cy=\"20\" rx=\"9\" ry=\"6.6\" fill=\"url(#bee-honey)\"/>" +
    "<g clip-path=\"url(#bee-clip)\" fill=\"" + INK + "\"><rect x=\"21.2\" y=\"10\" width=\"2.6\" height=\"20\"/><rect x=\"26.4\" y=\"10\" width=\"2.6\" height=\"20\"/><rect x=\"31.2\" y=\"10\" width=\"3\" height=\"20\"/></g>" +
    "<ellipse cx=\"24\" cy=\"20\" rx=\"9\" ry=\"6.6\" fill=\"none\" stroke=\"" + INK + "\" stroke-width=\"1.3\"/>" +
    /* голова, глаз, усики */
    "<path d=\"M12.4 16.4 Q10.6 12.4 7.4 12.2 M13.8 15.9 Q13.2 11.6 10.4 10.2\" fill=\"none\" stroke=\"" + INK + "\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>" +
    "<circle cx=\"7.3\" cy=\"12.2\" r=\"1\" fill=\"" + INK + "\"/><circle cx=\"10.3\" cy=\"10.1\" r=\"1\" fill=\"" + INK + "\"/>" +
    "<circle cx=\"14.2\" cy=\"20\" r=\"4.4\" fill=\"" + INK + "\"/>" +
    "<circle cx=\"12.6\" cy=\"18.7\" r=\"1.25\" fill=\"#F5F2EB\"/><circle cx=\"12.3\" cy=\"18.5\" r=\".5\" fill=\"" + INK + "\"/>" +
    "</g></g></svg></div>";
  document.body.appendChild(bee);
  document.documentElement.classList.add("bee-on");

  let x = -100, y = -100, lastX = null, lastY = null, tilt = 0, target = 0, queued = false, idle = 0;
  /* Запасная проверка для Safari: он не всегда сообщает, что мышь ушла за край.
     Если мышь шла к левому, правому или нижнему краю и следующим шагом оказалась бы за ним (или стоит вплотную к краю) и замерла, прячем. */
  function leaving() {
    const w = window.innerWidth, h = window.innerHeight;
    const nx = lastX === null ? x : x + (x - lastX) * 1.5, ny = lastY === null ? y : y + (y - lastY) * 1.5;
    /* верхний край не проверяем: там шапка сайта, а уход на панель Safari браузер сообщает сам */
    return nx < 0 || nx > w || ny > h || x < 4 || x > w - 4 || y > h - 4;
  }

  function draw() {
    queued = false;
    tilt += (target - tilt) * 0.25;
    target *= 0.8;
    bee.style.transform = "translate(" + (x - HOT.x) + "px, " + (y - HOT.y) + "px) rotate(" + tilt.toFixed(2) + "deg)";
    bee.style.transformOrigin = HOT.x + "px " + HOT.y + "px";
    if (Math.abs(tilt) > 0.2 || Math.abs(target) > 0.2) schedule();
  }
  function schedule() { if (!queued) { queued = true; window.requestAnimationFrame(draw); } }

  window.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;
    const px = x, py = y, had = lastX !== null;
    x = event.clientX; y = event.clientY;
    if (had && !calm) target = Math.max(-16, Math.min(16, target + (x - px) * 0.6));
    lastX = had ? px : null; lastY = had ? py : null;
    window.clearTimeout(idle);
    if (leaving()) idle = window.setTimeout(hide, 200);
    lastX = x; lastY = y;
    const over = event.target instanceof Element ? event.target : null;
    const inText = !!(over && over.closest(TEXT));
    bee.classList.toggle("is-on", !inText);
    bee.classList.toggle("is-link", !!(over && !inText && over.closest(CLICKABLE)));
    schedule();
  }, { passive: true });
  window.addEventListener("pointerdown", function (event) { if (event.pointerType === "mouse") bee.classList.add("is-down"); });
  window.addEventListener("pointerup", function () { bee.classList.remove("is-down"); });
  /* мышь ушла за край окна: пчёлка прячется, при возвращении появляется снова */
  function hide() { window.clearTimeout(idle); bee.classList.remove("is-on", "is-link", "is-down"); lastX = null; lastY = null; }
  document.documentElement.addEventListener("mouseleave", hide);
  document.addEventListener("mouseout", function (event) { if (!event.relatedTarget) hide(); });
  document.documentElement.addEventListener("pointerleave", hide);
  window.addEventListener("mouseout", function (event) { if (!event.relatedTarget) hide(); });
  window.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", function () { if (document.hidden) hide(); });
})();
