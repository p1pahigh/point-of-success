/* Тёплый световой след и золотая пыль за курсором. Только для мыши: на телефоне эффекта нет */
(function () {
  "use strict";
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const STEP = 9;           // через сколько пикселей пути оставлять новую точку следа
  const DUST_CHANCE = 0.14; // как часто вместе со светом появляется пылинка
  const SIZE_REM = 1.75;    // радиус света относительно размера шрифта страницы
  const MAX_GLOW = 40;
  const MAX_DUST = 24;
  const GLOW_LIFE = 420;

  const THEMES = {
    light: { glow: "196, 115, 79", alpha: 0.12, blend: "source-over", dust: ["#C4734F", "#A6522C", "#D99A7C"] },
    dark: { glow: "201, 122, 82", alpha: 0.14, blend: "lighter", dust: ["#B55A30", "#C97A52", "#E3B08F"] }
  };

  const root = document.documentElement;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:40;pointer-events:none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function makeSprite(rgb) {
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 128;
    const paint = sprite.getContext("2d");
    const gradient = paint.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(" + rgb + ", 1)");
    gradient.addColorStop(0.4, "rgba(" + rgb + ", .45)");
    gradient.addColorStop(1, "rgba(" + rgb + ", 0)");
    paint.fillStyle = gradient;
    paint.fillRect(0, 0, 128, 128);
    return sprite;
  }
  Object.keys(THEMES).forEach(function (name) { THEMES[name].sprite = makeSprite(THEMES[name].glow); });

  let width = 0, height = 0, ratio = 1, radius = 72;
  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    radius = parseFloat(window.getComputedStyle(root).fontSize) * SIZE_REM;
  }
  resize();
  window.addEventListener("resize", resize);

  const glows = [];
  const dust = [];
  let lastX = null, lastY = null, rest = 0;
  let running = false, previous = 0;

  function random(from, to) { return from + Math.random() * (to - from); }

  function emit(x, y) {
    glows.push({ x: x, y: y, age: 0 });
    if (glows.length > MAX_GLOW) glows.shift();
    if (Math.random() > DUST_CHANCE) return;
    dust.push({
      x: x + random(-4, 4),
      y: y + random(-4, 4),
      vx: random(-0.01, 0.01),
      vy: random(0.006, 0.024),
      size: random(0.5, 1.2),
      age: 0,
      life: random(500, 850),
      phase: random(0, 6.28),
      tone: Math.floor(random(0, 3))
    });
    if (dust.length > MAX_DUST) dust.shift();
  }

  function frame(now) {
    const delta = Math.min(now - previous, 50);
    previous = now;
    const theme = THEMES[root.getAttribute("data-theme") === "dark" ? "dark" : "light"];

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = theme.blend;

    let kept = 0;
    for (let i = 0; i < glows.length; i++) {
      const glow = glows[i];
      glow.age += delta;
      if (glow.age >= GLOW_LIFE) continue;
      glows[kept++] = glow;
      const left = 1 - glow.age / GLOW_LIFE;
      const size = radius * (0.75 + 0.25 * left);
      ctx.globalAlpha = theme.alpha * left;
      ctx.drawImage(theme.sprite, glow.x - size, glow.y - size, size * 2, size * 2);
    }
    glows.length = kept;

    kept = 0;
    for (let i = 0; i < dust.length; i++) {
      const speck = dust[i];
      speck.age += delta;
      if (speck.age >= speck.life) continue;
      dust[kept++] = speck;
      speck.vy += 0.00002 * delta;
      speck.x += (speck.vx + Math.sin(speck.phase + speck.age * 0.004) * 0.012) * delta;
      speck.y += speck.vy * delta;
      const left = 1 - speck.age / speck.life;
      ctx.globalAlpha = Math.min(1, left * 1.6) * (0.6 + 0.4 * Math.sin(speck.phase + speck.age * 0.012));
      ctx.fillStyle = theme.dust[speck.tone];
      ctx.beginPath();
      ctx.arc(speck.x, speck.y, speck.size, 0, 6.2832);
      ctx.fill();
    }
    dust.length = kept;

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    if (glows.length || dust.length) {
      window.requestAnimationFrame(frame);
    } else {
      running = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  window.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;
    const x = event.clientX;
    const y = event.clientY;
    if (lastX === null) { lastX = x; lastY = y; rest = 0; return; }

    const dx = x - lastX;
    const dy = y - lastY;
    const distance = Math.hypot(dx, dy);
    let walked = STEP - rest;
    while (walked <= distance) {
      emit(lastX + dx * walked / distance, lastY + dy * walked / distance);
      walked += STEP;
    }
    rest = distance - (walked - STEP);
    lastX = x;
    lastY = y;

    if (!running && (glows.length || dust.length)) {
      running = true;
      previous = window.performance.now();
      window.requestAnimationFrame(frame);
    }
  }, { passive: true });

  root.addEventListener("mouseleave", function () { lastX = null; });
})();
