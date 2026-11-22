// Путь ученика в кабинете app.js на заглушках браузера. Запуск: tools/tests/run.sh
var ROOT = arguments[0] + "/";
var fails = 0;
function ok(cond, label) { print((cond ? "ok   " : "FAIL ") + label); if (!cond) fails++; }

function boot(storage, hash) {
  var els = {}, docHandlers = {}, winHandlers = {};
  var replaced = null;
  globalThis.window = globalThis;
  globalThis.setInterval = function () { return 1; };
  globalThis.clearInterval = function () {};
  globalThis.scrollTo = function () {};
  globalThis.matchMedia = function () { return { matches: false }; };
  globalThis.addEventListener = function (n, f) { winHandlers[n] = f; };
  globalThis.localStorage = {
    getItem: function (k) { return k in storage ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; }
  };
  globalThis.location = { hash: hash, href: "", replace: function (u) { replaced = u; } };
  globalThis.FormData = function (form) { this.get = function (k) { return k in form.data ? form.data[k] : null; }; };
  globalThis.document = {
    documentElement: {},
    getElementById: function (id) { return els[id] || (els[id] = { id: id, innerHTML: "", hidden: true, setAttribute: function () {} }); },
    querySelector: function () { return { classList: { add: function () {} }, scrollIntoView: function () {} }; },
    querySelectorAll: function () { return []; },
    addEventListener: function (n, f) { docHandlers[n] = f; }
  };
  load(ROOT + "catalog.js");
  load(ROOT + "app.js");
  return {
    html: function () { return els.app ? els.app.innerHTML : ""; },
    el: function (id) { return document.getElementById(id); },
    go: function (h) { location.hash = h; winHandlers.hashchange(); },
    submit: function (form) { docHandlers.submit({ target: { closest: function () { return form; } }, preventDefault: function () {} }); },
    click: function (act, id) { docHandlers.click({ target: { closest: function () { return { dataset: { act: act, id: id } }; } } }); },
    change: function (name, id, value, field) { docHandlers.change({ target: { closest: function () { return { dataset: { change: name, id: id, field: field }, value: value, checked: !!value }; } } }); },
    replaced: function () { return replaced; },
    storage: storage
  };
}

var email = "ivan@test.ru";
var store = {
  "tpos.accounts": JSON.stringify({ "ivan@test.ru": { name: "Иван Петров", email: email, phone: "+7", password: "secret1", subjects: ["ege-math-pro", "lang-it"], diag: {}, package: null } }),
  "tpos.session": JSON.stringify({ role: "student", email: email })
};
var app = boot(store, "#student/dashboard");
var h = app.html();
ok(h.indexOf("Здравствуйте, Иван!") >= 0 || h.indexOf("Иван!") >= 0, "приветствие по имени нового ученика");
ok(h.indexOf("Бесплатная диагностика") >= 0, "на главной блок диагностики");
ok(h.indexOf("#student/diag/ege-math-pro") >= 0 && h.indexOf("#student/diag/lang-it") >= 0, "кнопки диагностики по обоим предметам");
ok(h.indexOf("#student/courses") < 0 && h.indexOf("#student/homework") < 0, "до оплаты нет курсов и домашних работ в меню");
ok(h.indexOf("#student/plans") < 0, "выбор пакета закрыт до диагностики");

app.go("#student/courses");
ok(app.html().indexOf("Бесплатная диагностика") >= 0, "прямой переход в курсы до оплаты возвращает на главную");
app.go("#student/plans");
ok(app.html().indexOf("Выберите пакет</h1>") < 0, "страница пакетов закрыта до диагностики");

app.go("#student/diag/ege-math-pro");
ok(app.html().indexOf("data-form=\"diag\"") >= 0 && app.html().indexOf("log₂ 16") >= 0, "открылась диагностика по математике");
app.submit({ dataset: { form: "diag", id: "ege-math-pro" }, data: { q0: "1", q1: "2" } });
ok(app.el("test-error").hidden === false, "без всех ответов показывается ошибка");
app.submit({ dataset: { form: "diag", id: "ege-math-pro" }, data: { q0: "1", q1: "2", q2: "1", q3: "0" } });
ok(app.html().indexOf("Высокий") >= 0, "4 из 4 по математике дают уровень «Высокий»");
var saved = JSON.parse(store["tpos.accounts"])[email];
ok(saved.diag["ege-math-pro"] && saved.diag["ege-math-pro"].score === 4, "результат сохранён в аккаунте");

app.go("#student/dashboard");
ok(app.html().indexOf("1 из 2") >= 0 && app.html().indexOf("#student/plans") < 0, "после одной диагностики: 1 из 2, пакеты ещё закрыты");

app.go("#student/diag/lang-it");
app.submit({ dataset: { form: "diag", id: "lang-it" }, data: { q0: "0", q1: "1", q2: "0", q3: "3" } });
ok(app.html().indexOf("A2") >= 0, "2 из 4 по итальянскому дают уровень A2");

app.go("#student/dashboard");
ok(app.html().indexOf("#student/plans") >= 0, "после всех диагностик открылась кнопка выбора пакета");
app.go("#student/plans");
var p = app.html();
ok(p.indexOf("База") >= 0 && p.indexOf("Практика") >= 0 && p.indexOf("Наставничество") >= 0, "три пакета на странице выбора");
ok(p.indexOf("Математика · профиль: <b>Высокий</b>") >= 0 && p.indexOf("Итальянский: <b>A2</b>") >= 0, "на странице пакетов видны уровни");
app.go("#student/pay/practice");
ok(app.html().indexOf("data-act=\"pay\"") >= 0 && app.html().indexOf("6 500–8 500 ₽") >= 0, "экран оплаты с ценой пакета");
app.go("#student/pay/nope");
ok(app.html().indexOf("data-act=\"pay\"") < 0, "несуществующий пакет не открывает оплату");

app.go("#student/pay/practice");
app.click("pay", "practice");
ok(location.hash === "#student/dashboard", "после оплаты переход на главную");
app.go(location.hash);
var after = app.html();
ok(after.indexOf("#student/courses") >= 0 && after.indexOf("#student/homework") >= 0, "после оплаты открыт весь кабинет");
ok(after.indexOf("Бесплатная диагностика") < 0, "главная после оплаты обычная");
ok(JSON.parse(store["tpos.accounts"])[email].package.id === "practice", "пакет сохранён");
app.go("#student/settings");
ok(app.html().indexOf("Пакет обучения: Практика") >= 0 && app.html().indexOf("ivan@test.ru") >= 0, "в настройках видны почта и пакет");
app.go("#student/plans");
ok(app.html().indexOf("Выберите пакет</h1>") < 0, "после оплаты страница пакетов закрыта");

// демо-доступ не изменился
var demo = boot({ "tpos.session": JSON.stringify({ role: "student" }) }, "#student/dashboard");
ok(demo.html().indexOf("Анна") >= 0 && demo.html().indexOf("#student/courses") >= 0, "демо-ученица видит прежний кабинет");
demo.go("#student/diag/ege-math-pro");
ok(demo.html().indexOf("data-form=\"diag\"") < 0, "у демо-ученицы нет страниц диагностики");
var teacher = boot({ "tpos.session": JSON.stringify({ role: "teacher" }) }, "#teacher/plans");
ok(teacher.html().indexOf("Выберите пакет") < 0 && teacher.html().indexOf("Мария") >= 0, "преподаватель не видит страниц ученика");

// сессия без аккаунта
var lost = boot({ "tpos.session": JSON.stringify({ role: "student", email: "gone@test.ru" }) }, "#student/dashboard");
ok(lost.replaced() === "login.html" && !("tpos.session" in lost.storage), "сессия удалённого аккаунта ведёт на вход");

// конструктор курсов: преподаватель собирает урок, ученица в том же браузере его проходит
var shared = { "tpos.session": JSON.stringify({ role: "teacher" }) };
var tch = boot(shared, "#teacher/content");
var th = tch.html();
ok(th.indexOf("data-act=\"togglePlus\"") >= 0 && th.indexOf("data-act=\"newCourse\"") >= 0 && th.indexOf("data-act=\"newFolder\"") >= 0, "в материалах плюсик с меню «Курс» и «Папка»");
ok(th.indexOf("ЕГЭ по математике: профиль") >= 0 && th.indexOf("ЕГЭ по английскому") < 0, "преподаватель видит только свои курсы");
tch.click("newFolder", "");
var fid = JSON.parse(shared["tpos.demo.v3"]).folders[0].id;
tch.go(location.hash);
ok(location.hash === "#teacher/content/" + fid && tch.html().indexOf("Новая папка") >= 0, "папка создана и открыта");
tch.click("newCourse", fid);
var st = JSON.parse(shared["tpos.demo.v3"]);
var course = st.courses[st.courses.length - 1];
ok(course.folder === fid && course.status === "draft", "курс создан в папке черновиком");
tch.go(location.hash);
ok(tch.html().indexOf("Введите название курса") >= 0 && tch.html().indexOf("В курсе ещё нет уроков") >= 0, "страница нового курса с пустым списком уроков");
tch.change("courseField", course.id, "Проценты за неделю", "title");
tch.click("openPicker", "lesson");
ok(tch.html().indexOf("Новый урок") >= 0 && tch.html().indexOf("Диагностика") >= 0 && tch.html().indexOf("Шаблон рефлексии после урока") >= 0, "окно шаблонов уроков");
tch.click("useTemplate", "blank");
st = JSON.parse(shared["tpos.demo.v3"]);
var lesson = st.courses[st.courses.length - 1].items[0];
tch.go(location.hash);
ok(location.hash === "#teacher/build/" + lesson.id && tch.html().indexOf("Введите название урока") >= 0, "открылся редактор урока");
tch.change("lessonField", lesson.id, "Что такое процент", "title");
tch.click("addBlock", "text");
tch.click("addBlock", "input");
st = JSON.parse(shared["tpos.demo.v3"]);
lesson = st.courses[st.courses.length - 1].items[0];
var pg = lesson.pages[0], textB = pg.blocks[0], inputB = pg.blocks[1];
ok(textB.type === "text" && inputB.type === "input", "блоки добавлены на страницу");
tch.change("blk", lesson.id + "|" + pg.id + "|" + textB.id, "Процент — сотая часть числа.", "text");
tch.change("blk", lesson.id + "|" + pg.id + "|" + inputB.id, "Сколько будет 25% от 100?", "q");
tch.change("blk", lesson.id + "|" + pg.id + "|" + inputB.id, "25; 25,0", "answer");
tch.go("#teacher/preview/" + lesson.id);
ok(tch.html().indexOf("Процент — сотая часть числа.") >= 0 && tch.html().indexOf("Сколько будет 25% от 100?") >= 0, "просмотр урока глазами ученика");
var stu0 = boot({ "tpos.session": JSON.stringify({ role: "student" }), "tpos.demo.v3": shared["tpos.demo.v3"] }, "#student/courses");
ok(stu0.html().indexOf("Проценты за неделю") < 0, "черновик ученице не виден");
tch = boot(shared, "#teacher/tcourse/" + course.id); // заглушки браузера общие: после второго запуска пересоздаём кабинет преподавателя
tch.change("courseField", course.id, "live", "status");
shared["tpos.session"] = JSON.stringify({ role: "student" });
var stu = boot(shared, "#student/courses");
ok(stu.html().indexOf("Проценты за неделю") >= 0, "опубликованный курс появился у ученицы");
stu.go("#student/learn/" + lesson.id);
ok(stu.html().indexOf("data-form=\"lesson\"") >= 0 && stu.html().indexOf("Сколько будет 25% от 100?") >= 0, "ученица открыла урок");
stu.submit({ dataset: { form: "lesson", id: lesson.id }, data: {} });
ok(stu.el("lesson-error").hidden === false, "без ответа урок не завершается");
stu.submit({ dataset: { form: "lesson", id: lesson.id }, data: (function () { var d = {}; d[inputB.id] = " 25,0 "; return d; })() });
var res = JSON.parse(shared["tpos.demo.v3"]).results[lesson.id];
ok(res && res.score === 1 && res.total === 1, "ответ «25,0» засчитан");
ok(stu.html().indexOf("Урок пройден") >= 0, "показан результат урока");
stu.go("#student/grades");
ok(stu.html().indexOf("Что такое процент") >= 0, "результат урока попал в оценки");

// шаг 2: контрольная со сроком и онлайн-занятие
var s2 = { "tpos.session": JSON.stringify({ role: "student" }) };
var st2 = boot(s2, "#student/homework");
ok(st2.html().indexOf("Логарифмы: контрольная работа") >= 0 && st2.html().indexOf("#student/learn/x1") >= 0, "контрольная из курса появилась в «Домашних работах» с кнопкой «Выполнить»");
st2.go("#student/schedule");
ok(st2.html().indexOf("#student/learn/x1") >= 0, "контрольная есть в «Дедлайнах»");
var weekHtml = st2.html(); st2.click("weekMove", "1"); weekHtml += st2.html();
ok(weekHtml.indexOf("Разбор пробника: первая часть") >= 0, "онлайн-занятие есть в расписании");
st2.go("#student/learn/w1");
ok(st2.html().indexOf("Онлайн-занятие") >= 0 && st2.html().indexOf("Кнопка подключения появится в день занятия") >= 0, "страница онлайн-занятия до дня занятия");
st2.go("#student/learn/x1");
var names = []; st2.html().replace(/name="(b\d+)"/g, function (m, n) { if (names.indexOf(n) < 0) names.push(n); return m; });
var ans = {}; var bl = names.map(function (n) { return { id: n }; });
ans[bl[0].id] = "1"; ans[bl[1].id] = "1"; ans[bl[2].id] = "64"; ans[bl[3].id] = "Основание логарифма не может быть равно единице.";
st2.submit({ dataset: { form: "lesson", id: "x1" }, data: ans });
ok(st2.html().indexOf("Зачтено: 100%") >= 0 && st2.html().indexOf("Открытые ответы проверит преподаватель") >= 0, "после сдачи контрольной: зачтено и ждёт проверки");
st2.go("#student/homework");
ok(st2.html().indexOf("ответы отправлены") >= 0, "в «Домашних работах» контрольная на проверке");
s2["tpos.session"] = JSON.stringify({ role: "teacher" });
var tc2 = boot(s2, "#teacher/review/x-x1");
ok(tc2.html().indexOf("Основание логарифма не может быть равно единице.") >= 0 && tc2.html().indexOf("Автопроверка: 3 из 3") >= 0, "преподаватель видит открытый ответ и автопроверку");
tc2.submit({ dataset: { form: "grade", id: "x-x1" }, data: { grade: "5", comment: "Верно и аккуратно" } });
ok(JSON.parse(s2["tpos.demo.v3"]).results.x1.teacherGrade === 5, "оценка преподавателя сохранена");
tc2.go(location.hash);
ok(tc2.html().indexOf("x-x1") < 0, "работа ушла из очереди проверки");
tc2.go("#teacher/dashboard");
ok(tc2.html().indexOf("openCreate") < 0 && tc2.html().indexOf("#teacher/content") >= 0, "кнопка «Создать задание» ведёт в материалы");
tc2.go("#teacher/tcourse/c-math");
tc2.click("newLesson", "webinar");
var made = JSON.parse(s2["tpos.demo.v3"]).courses[0].items.slice(-1)[0];
tc2.go(location.hash);
ok(made.kind === "webinar" && tc2.html().indexOf("Источник встречи") >= 0 && tc2.html().indexOf("Длительность, мин") >= 0, "создано онлайн-занятие, открыт его редактор");
tc2.go("#teacher/tcourse/c-math");
tc2.click("newLesson", "exam");
made = JSON.parse(s2["tpos.demo.v3"]).courses[0].items.slice(-1)[0];
tc2.go(location.hash);
ok(made.kind === "exam" && made.pass === "80" && tc2.html().indexOf("Проходной процент") >= 0 && tc2.html().indexOf("Срок сдачи") >= 0, "создана контрольная, в редакторе срок и проходной процент");
s2["tpos.session"] = JSON.stringify({ role: "student" });
var st3 = boot(s2, "#student/homework");
ok(st3.html().indexOf("Верно и аккуратно") >= 0, "ученица видит оценку и комментарий преподавателя");

// банк заданий
var bs = { "tpos.session": JSON.stringify({ role: "student" }) };
var sb = boot(bs, "#student/bank");
ok(sb.html().indexOf("Банк заданий") >= 0 && sb.html().indexOf("#student/bank/math-pro") >= 0 && sb.html().indexOf("#student/bank/it") >= 0, "у ученицы раздел «Банк заданий» с предметами");
ok(sb.html().indexOf("Где вы чаще ошибаетесь") >= 0, "статистика: где чаще ошибается");
sb.go("#student/bank/math-pro");
ok(sb.html().indexOf("Задание 5") >= 0 && sb.html().indexOf("#student/bank/math-pro_all_q2") >= 0, "список номеров заданий ведёт к решению подряд");
sb.go("#student/bank/math-pro_6");
ok(sb.html().indexOf("log₂(x + 3) = 4") >= 0 && sb.html().indexOf("Не выполнено") >= 0, "открылось первое задание номера 6");
ok(sb.html().indexOf("По определению логарифма") < 0 && sb.html().indexOf("Смотреть решение") < 0, "до ответа пояснения нет");
ok(sb.html().indexOf("Следующее задание") >= 0 && sb.html().indexOf("#student/bank/math-pro_all_q4") >= 0 && sb.html().indexOf("#student/bank/math-pro_all_q2") >= 0, "переходы к предыдущему и следующему заданию");
sb.submit({ dataset: { form: "bankAnswer", id: "q3" }, data: { answer: "12" } });
ok(sb.html().indexOf("Неверно") >= 0 && sb.html().indexOf("Ещё раз") >= 0 && sb.html().indexOf("По определению логарифма") >= 0, "неверный ответ: «Неверно», «Ещё раз» и пояснение");
sb.click("bankRetry", "q3");
sb.submit({ dataset: { form: "bankAnswer", id: "q3" }, data: { answer: " 13 " } });
var bp = JSON.parse(bs["tpos.demo.v3"]).bankProgress.q3;
ok(bp.status === "right" && bp.tries === 2, "со второй попытки «Верно», попытки посчитаны");
sb.go("#student/bank/math-pro_all_q4");
ok(sb.html().indexOf("3^(x − 5) = 81") >= 0 && sb.html().indexOf("4 из 7") >= 0, "переход к следующему заданию, счётчик позиции");
sb.click("bankFav", "q4");
ok(JSON.parse(bs["tpos.demo.v3"]).bankFav.indexOf("q4") >= 0, "задание добавлено в избранное");
sb.click("bankReport", "q4");
sb.submit({ dataset: { form: "bankReport", id: "q4" }, data: { text: "Опечатка в условии" } });
ok(sb.html().indexOf("Спасибо! Сообщение отправлено") >= 0, "сообщение об ошибке отправлено");
sb.go("#student/bank/math-pro_wrong");
ok(sb.html().indexOf("Стрелок в тире") >= 0 && sb.html().indexOf("log₂(x + 3)") < 0, "фильтр «Ошибки» показывает только неверные");
bs["tpos.session"] = JSON.stringify({ role: "teacher" });
var tb = boot(bs, "#teacher/bank");
ok(tb.html().indexOf("Сообщения об ошибках") >= 0 && tb.html().indexOf("Опечатка в условии") < 0 && tb.html().indexOf("выстрелы независимы") >= 0, "учитель видит сообщения только по своим заданиям");
ok(tb.html().indexOf("Самые сложные задания") >= 0 && tb.html().indexOf("Итальянский") < 0, "статистика и только предметы учителя");
tb.click("bankNew", "");
ok(tb.html().indexOf("Новое задание") >= 0 && tb.html().indexOf("Номер задания") >= 0, "форма нового задания");
tb.submit({ dataset: { form: "bankSave", id: "" }, data: { set: "math-pro", num: "8", part: "1", topic: "Планиметрия", text: "Найдите площадь круга радиуса 1, делённую на π.", answer: "1", solution: "S = πr² = π, делим на π." } });
var nb = JSON.parse(bs["tpos.demo.v3"]).bank.slice(-1)[0];
ok(nb.author === "teacher" && nb.num === 8 && nb.topic === "Планиметрия", "задание добавлено в банк от имени учителя");
tb.go("#teacher/bank/math-pro_8");
ok(tb.html().indexOf("Найдите площадь круга") >= 0 && tb.html().indexOf("bankEditTask") >= 0, "новое задание в списке, его можно изменить");
tb.click("bankResolve", "r1");
ok(JSON.parse(bs["tpos.demo.v3"]).bankReports[0].done === true, "сообщение отмечено исправленным");
bs["tpos.session"] = JSON.stringify({ role: "student" });
var sb2 = boot(bs, "#student/bank/math-pro_8");
ok(sb2.html().indexOf("Найдите площадь круга") >= 0, "ученица видит новое задание учителя");

print(fails ? fails + " FAILED" : "ALL PASSED");
