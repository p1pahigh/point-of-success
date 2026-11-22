/* Волна от нажатия на кнопки: общая для сайта, входа и кабинета */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", function (event) {
    const button = event.target.closest(".btn");
    if (!button) return;
    const box = button.getBoundingClientRect();
    const size = Math.max(box.width, box.height) * 2.2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = event.clientX - box.left - size / 2 + "px";
    ripple.style.top = event.clientY - box.top - size / 2 + "px";
    ripple.addEventListener("animationend", function () { ripple.remove(); });
    button.appendChild(ripple);
  });
})();
