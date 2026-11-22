/* Предметы, вопросы бесплатной диагностики и пакеты обучения.
   Общий справочник для страницы записи start.html и кабинета app.js.
   Вопросы диагностики — примеры для прототипа, их нужно заменить на вопросы школы. */
window.TPOS_CATALOG = {
  groups: [
    { id: "ege", title: "Подготовка к ЕГЭ", levels: ["Начальный", "Начальный", "Средний", "Средний", "Высокий"] },
    { id: "lang", title: "Язык для всех", levels: ["A1", "A1", "A2", "B1", "B2"] }
  ],

  /* Предмет с вариантами: на странице записи одна карточка, внутри выбирается ровно один вариант */
  families: {
    "ege-math": { name: "Математика", note: "Выберите уровень экзамена" }
  },

  subjects: [
    { id: "ege-math-pro", group: "ege", family: "ege-math", variant: "Профиль", name: "Математика · профиль", note: "Профильный уровень", questions: [
      { q: "Чему равно 2³ · 2²?", options: ["16", "32", "64", "10"], correct: 1 },
      { q: "Решите уравнение 3x − 7 = 11.", options: ["4", "5", "6", "18"], correct: 2 },
      { q: "Чему равен log₂ 16?", options: ["2", "4", "8", "16"], correct: 1 },
      { q: "Чему равна производная функции f(x) = x³?", options: ["3x²", "x²", "3x", "x⁴ / 4"], correct: 0 }
    ] },
    { id: "ege-math-base", group: "ege", family: "ege-math", variant: "База", name: "Математика · база", note: "Базовый уровень", questions: [
      { q: "Сколько будет 15% от 240?", options: ["24", "36", "48", "60"], correct: 1 },
      { q: "Решите уравнение 2x + 5 = 17.", options: ["6", "7", "8", "11"], correct: 0 },
      { q: "Сколько минут в 2,5 часа?", options: ["125", "150", "250", "90"], correct: 1 },
      { q: "Чему равен периметр квадрата со стороной 7 см?", options: ["14 см", "21 см", "28 см", "49 см"], correct: 2 }
    ] },
    { id: "ege-eng", group: "ege", name: "Английский язык", note: "Все разделы экзамена", questions: [
      { q: "If I ___ more time, I would travel more.", options: ["have", "had", "will have", "am having"], correct: 1 },
      { q: "The letter ___ yesterday.", options: ["was sent", "is sent", "sent", "has sent"], correct: 0 },
      { q: "He has been working here ___ five years.", options: ["since", "for", "during", "from"], correct: 1 },
      { q: "She is interested ___ art.", options: ["on", "at", "in", "about"], correct: 2 }
    ] },
    { id: "lang-it", group: "lang", name: "Итальянский", note: "С нуля или с вашего уровня", questions: [
      { q: "Come ti chiami? — ___ Marco.", options: ["Mi chiamo", "Ho", "Sono chiamo", "Chiamo"], correct: 0 },
      { q: "Io ___ italiano.", options: ["parli", "parlo", "parla", "parlano"], correct: 1 },
      { q: "Ieri ___ al mare.", options: ["vado", "sono andato", "andrò", "andiamo"], correct: 1 },
      { q: "Как будет множественное число от «il libro»?", options: ["i libri", "il libri", "gli libro", "le libre"], correct: 0 }
    ] }
  ],

  /* Цены — ориентир заказчика, не окончательные */
  packages: [
    { id: "base", name: "База", price: "3 500–4 500 ₽", who: "Тем, кто готовится сам, но нужна структура",
      items: ["Видеотеория", "Конспекты", "Проверка домашних работ"] },
    { id: "practice", name: "Практика", main: true, price: "6 500–8 500 ₽", who: "Тем, кому нужна живая отработка и поддержка",
      items: ["Всё из «Базы»", "Живые практики 2 раза в неделю", "Пробники в формате экзамена"] },
    { id: "mentor", name: "Наставничество", price: "10 000–12 000 ₽", who: "Тем, кому нужен индивидуальный подход и контроль",
      items: ["Всё из «Практики»", "Личный созвон 1 раз в месяц", "Приоритетная обратная связь"] }
  ],

  subject: function (id) { return this.subjects.filter(function (s) { return s.id === id; })[0]; },
  pack: function (id) { return this.packages.filter(function (p) { return p.id === id; })[0]; },
  level: function (subjectId, score) {
    const subject = this.subject(subjectId);
    const group = this.groups.filter(function (g) { return g.id === subject.group; })[0];
    return group.levels[Math.max(0, Math.min(score, group.levels.length - 1))];
  }
};
