// Скрипты страниц start.html и login.html на заглушках браузера. Запуск: tools/tests/run.sh
var ROOT = arguments[0] + "/";
var DIR = arguments[1] + "/"; // сюда run.sh кладёт встроенные скрипты страниц
var fails = 0;
function ok(cond, label) { print((cond ? "ok   " : "FAIL ") + label); if (!cond) fails++; }

function env(storage, search) {
  var els = {}, checked = [];
  globalThis.window = globalThis;
  globalThis.scrollTo = function () {};
  globalThis.localStorage = {
    getItem: function (k) { return k in storage ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; }
  };
  globalThis.location = { search: search || "", href: "" };
  globalThis.URLSearchParams = function (s) {
    var map = {};
    s.replace(/^\?/, "").split("&").forEach(function (p) { if (p) { var kv = p.split("="); map[kv[0]] = decodeURIComponent(kv[1] || ""); } });
    this.get = function (k) { return k in map ? map[k] : null; };
  };
  globalThis.FormData = function (form) { this.get = function (k) { return k in form.data ? form.data[k] : null; }; };
  globalThis.document = {
    getElementById: function (id) {
      return els[id] || (els[id] = { id: id, innerHTML: "", textContent: "", hidden: id === "step-account" || /error/.test(id), value: "", handlers: {}, focus: function () {}, addEventListener: function (n, f) { this.handlers[n] = f; } });
    },
    querySelectorAll: function (sel) {
      if (sel.indexOf("data-demo") >= 0) return [];
      return checked.map(function (v) { return { value: v }; });
    }
  };
  return { el: function (id) { return document.getElementById(id); }, check: function (list) { checked = list; }, storage: storage };
}

// --- start.html
var store = {};
var page = env(store, "?s=lang-it,nope");
load(ROOT + "catalog.js");
load(DIR + "start-inline.js");
var picks = page.el("picks").innerHTML;
ok(picks.indexOf("Подготовка к ЕГЭ") >= 0 && picks.indexOf("Язык для всех") >= 0, "две группы предметов");
ok((picks.match(/name="subject"/g) || []).length === 4, "четыре галочки: профиль, база, английский, итальянский");
ok(/value="lang-it" checked/.test(picks) && !/value="ege-math-pro" checked/.test(picks), "предмет из ссылки ?s= отмечен заранее");

page.check([]);
page.el("to-account").handlers.click();
ok(page.el("subjects-error").hidden === false && page.el("step-account").hidden === true, "без предметов дальше не пускает");
page.check(["ege-math-pro", "lang-it"]);
page.el("to-account").handlers.click();
ok(page.el("step-account").hidden === false && page.el("step-subjects").hidden === true, "переход ко второму шагу");
ok(page.el("chosen-list").textContent === "Предметы: Математика · профиль, Итальянский", "показаны выбранные предметы");

function submit(data) { page.el("account-form").handlers.submit({ preventDefault: function () {}, target: { data: data } }); }
submit({ name: " Иван Петров ", email: "Ivan@Test.ru ", phone: "+7 900", password: "secret1" });
var acc = JSON.parse(store["tpos.accounts"] || "{}")["ivan@test.ru"];
ok(acc && acc.name === "Иван Петров" && acc.subjects.join() === "ege-math-pro,lang-it" && acc.package === null, "аккаунт сохранён с предметами");
ok(JSON.parse(store["tpos.session"]).email === "ivan@test.ru", "ученик сразу вошёл");
ok(location.href === "app.html#student/dashboard", "переход в кабинет");

location.href = "";
page.el("account-error").hidden = true;
submit({ name: "Другой", email: "ivan@test.ru", phone: "1", password: "123456" });
ok(page.el("account-error").hidden === false && location.href === "", "повторная почта не регистрируется");
page.el("account-error").hidden = true;
submit({ name: "Демо", email: "student@demo.ru", phone: "1", password: "123456" });
ok(page.el("account-error").hidden === false, "почту демо-доступа занять нельзя");

// --- login.html: вход зарегистрированного и демо
var loginStore = { "tpos.accounts": store["tpos.accounts"] };
var login = env(loginStore, "");
load(DIR + "login-inline.js");
function tryLogin(mail, pass) {
  location.href = "";
  login.el("login-email").value = mail;
  login.el("login-password").value = pass;
  login.el("login-error").hidden = true;
  login.el("login-form").handlers.submit({ preventDefault: function () {} });
}
tryLogin("IVAN@test.ru", "secret1");
ok(location.href === "app.html#student/dashboard" && JSON.parse(loginStore["tpos.session"]).email === "ivan@test.ru", "зарегистрированный входит своим паролем");
tryLogin("ivan@test.ru", "wrong");
ok(location.href === "" && login.el("login-error").hidden === false, "чужой пароль не подходит");
tryLogin("teacher@demo.ru", "demo123");
var s = JSON.parse(loginStore["tpos.session"]);
ok(location.href === "app.html#teacher/dashboard" && s.role === "teacher" && !s.email, "демо-доступ преподавателя как раньше");

print(fails ? fails + " FAILED" : "ALL PASSED");
