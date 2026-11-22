/* Кабинет ученика и преподавателя. Прототип: данные лежат в браузере, настоящего сервера и авторизации нет. */
(function () {
  "use strict";

  const STATE_KEY = "tpos.demo.v3"; // v2: предметы математика, английский ЕГЭ, итальянский; v3: типы заданий (ДЗ, контрольная, пробник)
  const SESSION_KEY = "tpos.session";
  const ACCOUNTS_KEY = "tpos.accounts";
  const CATALOG = window.TPOS_CATALOG;
  const LOGO = "<svg class=\"crown\" viewBox=\"-3 -1 106 96\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path pathLength=\"1\" d=\"M26.5 30 1.5 20.5 50 2.5 98.5 20.5 73.5 30\"/><path pathLength=\"1\" d=\"M34.5 41.5Q26.5 41.5 26.5 35V24Q50 12 73.5 24V35Q73.5 41.5 65.5 41.5\"/><path pathLength=\"1\" d=\"M50 36a24 24 0 1 1 0 48a24 24 0 1 1 0-48\"/><path pathLength=\"1\" d=\"M23 60H77\"/><path pathLength=\"1\" d=\"M94 21V40.5\"/><circle cx=\"94\" cy=\"44\" r=\"3.2\"/></g><path class=\"pop\" fill=\"currentColor\" d=\"M50 27C52 49 56 56 75 60C56 64 52 71 50 91C48 71 44 64 25 60C44 56 48 49 50 27Z\"/><path class=\"pop\" fill=\"currentColor\" d=\"M91 48h6l1.8 15.5q.3 2.5-2.3 2.5h-5q-2.6 0-2.3-2.5z\"/><circle fill=\"currentColor\" cx=\"92\" cy=\"17\" r=\"3.6\"/></svg><span>The Point of Success</span>";
  const LANGS = ["ru", "en", "it"];
  const LOCALES = { ru: "ru-RU", en: "en-GB", it: "it-IT" };

  const I18N = {
    nav_home: ["Главная", "Home", "Home"],
    workspace: ["Учебное пространство", "Learning space", "Spazio di studio"],
    my_cabinet: ["Мой кабинет", "My account", "Il mio spazio"],
    role_student: ["Ученик", "Student", "Studente"],
    role_teacher: ["Преподаватель", "Teacher", "Insegnante"],
    demo_short: ["Демо-данные", "Demo data", "Dati demo"],
    good_day: ["Хорошего дня", "Have a good day", "Buona giornata"],
    home_sub_student: ["Занятия, задания и прогресс на одном экране", "Lessons, tasks and progress on one screen", "Lezioni, compiti e progressi in una schermata"],
    home_sub_teacher: ["Всё важное для работы на одном экране", "Everything important for your work on one screen", "Tutto ciò che conta, in una schermata"],
    join_lesson: ["Войти в урок", "Join the lesson", "Entra nella lezione"],
    next_lesson_lc: ["ближайшее занятие", "next lesson", "prossima lezione"],
    all_link: ["Все", "See all", "Tutti"],
    by_subject: ["По предметам", "By subject", "Per materia"],
    materials_short: ["Материалы", "Materials", "Materiali"],
    hw_short: ["ДЗ", "Homework", "Compiti"],
    courses_sub: ["Видео, конспекты и тесты по каждому предмету", "Videos, notes and tests for each subject", "Video, appunti e test per ogni materia"],
    st_new: ["Новое", "New", "Nuovo"],
    not_taken: ["Не пройден", "Not taken", "Da fare"],
    min: ["мин", "min", "min"],
    questions_n: ["вопр.", "questions", "domande"],
    all: ["Все", "All", "Tutti"],
    hw_sub: ["Сдавайте работы и смотрите оценки с комментариями", "Hand in work and see grades with comments", "Consegna i compiti e vedi voti e commenti"],
    grades_sub: ["Оценки, посещаемость и прогресс по предметам", "Grades, attendance and progress by subject", "Voti, presenze e progressi per materia"],
    attendance_30: ["посещаемость за 30 дней", "attendance, 30 days", "presenze, 30 giorni"],
    hw_handed: ["ДЗ сдано", "homework handed in", "compiti consegnati"],
    avg_lc: ["средний балл", "average grade", "media"],
    grades_n: ["оценок всего", "grades in total", "voti in totale"],
    create_task: ["Создать задание", "Create a task", "Crea un compito"],
    students_cap: ["учеников", "students", "studenti"],
    to_review: ["работ на проверку", "works to review", "lavori da correggere"],
    open_tasks: ["открытых заданий", "open tasks", "compiti aperti"],
    lessons_today_lc: ["занятий сегодня", "lessons today", "lezioni oggi"],
    my_month: ["Мой месяц", "My month", "Il mio mese"],
    conducted: ["проведено занятий", "lessons held", "lezioni svolte"],
    hours_n: ["часов занятий", "teaching hours", "ore di lezione"],
    planned: ["ещё запланировано", "still planned", "ancora previste"],
    review_speed: ["дня в среднем на проверку", "days on average to review", "giorni in media per correggere"],
    attention: ["Требуют внимания", "Needs attention", "Da seguire"],
    all_good: ["Всё в порядке", "All good", "Tutto a posto"],
    check_work: ["Проверить работу", "Review work", "Correggi"],
    is_lagging: ["отстаёт", "falling behind", "in ritardo"],
    progress_sub: ["Посещаемость, домашние работы и оценки учеников", "Students' attendance, homework and grades", "Presenze, compiti e voti degli studenti"],
    student_col: ["Ученик", "Student", "Studente"],
    hw_col: ["ДЗ сдано", "Homework", "Compiti"],
    avg_col: ["Средний", "Average", "Media"],
    last_col: ["Последняя", "Last", "Ultimo"],
    status_col: ["Статус", "Status", "Stato"],
    lagging: ["Отстаёт", "Behind", "In ritardo"],
    on_track: ["В норме", "On track", "In linea"],
    lagging_n: ["отстают", "falling behind", "in ritardo"],
    avg_att: ["средняя посещаемость", "average attendance", "presenza media"],
    recent_grades: ["Последние оценки", "Recent grades", "Voti recenti"],
    missed_n: ["Пропущено занятий", "Lessons missed", "Lezioni perse"],
    content_sub: ["Видео, конспекты, задания и тесты для учеников", "Videos, notes, tasks and tests for students", "Video, appunti, compiti e test"],
    new_material: ["Видео или конспект", "Video or notes", "Video o appunti"],
    new_task: ["Задание", "Task", "Compito"],
    new_test: ["Тест", "Test", "Test"],
    close: ["Закрыть", "Close", "Chiudi"],
    video_pl: ["Видео", "Videos", "Video"],
    note_pl: ["Конспекты", "Notes", "Appunti"],
    test_pl: ["Тесты", "Tests", "Test"],
    review_sub: ["Работы учеников, которые ждут оценки", "Student work waiting for a grade", "Lavori in attesa di voto"],
    schedule_sub: ["Занятия и ваши дела на неделю", "Lessons and your plans for the week", "Lezioni e impegni della settimana"],
    settings_sub: ["Профиль, язык и уведомления", "Profile, language and notifications", "Profilo, lingua e notifiche"],
    group_col: ["Группа", "Group", "Gruppo"],
    nav_schedule: ["Расписание", "Schedule", "Calendario"],
    nav_lesson: ["Живой урок", "Live lesson", "Lezione dal vivo"],
    nav_courses: ["Мои курсы", "My courses", "I miei corsi"],
    nav_hw: ["Домашние работы", "Homework", "Compiti"],
    nav_grades: ["Успеваемость", "Grades", "Voti"],
    nav_settings: ["Настройки", "Settings", "Impostazioni"],
    nav_content: ["Материалы", "Materials", "Materiali"],
    nav_review: ["Проверка работ", "Review work", "Correzione"],
    logout: ["Выйти", "Log out", "Esci"],
    choose_subject: ["Выберите предмет", "Choose a subject", "Scegli una materia"],
    hw_on_course: ["ДЗ на курсе", "Homework in the course", "Compiti del corso"],
    no_hw: ["По этому предмету пока нет заданий.", "No assignments for this subject yet.", "Nessun compito per questa materia."],
    tab_hw: ["Домашка", "Homework", "Compiti"],
    tab_review: ["Проверка", "Review", "Correzione"],
    more: ["Ещё", "More", "Altro"],
    theme: ["Сменить тему", "Switch theme", "Cambia tema"],
    demo: ["Прототип: все данные примерные и хранятся только в этом браузере.", "Prototype: all data is sample data stored only in this browser.", "Prototipo: tutti i dati sono di esempio e restano in questo browser."],
    hello: ["Привет", "Hello", "Ciao"],
    today_plan: ["Ближайшие занятия", "Upcoming lessons", "Prossime lezioni"],
    deadlines: ["Дедлайны", "Deadlines", "Scadenze"],
    no_deadlines: ["Все домашние работы сданы.", "All homework is handed in.", "Tutti i compiti sono consegnati."],
    progress: ["Прогресс", "Progress", "Progressi"],
    of: ["из", "of", "su"],
    materials_done: ["материалов пройдено", "materials completed", "materiali completati"],
    streak: ["Точки успеха", "Success points", "Punti di successo"],
    days_row: ["дней подряд", "days in a row", "giorni di fila"],
    join: ["Войти", "Join", "Entra"],
    start_lesson: ["Начать урок", "Start lesson", "Inizia lezione"],
    today: ["Сегодня", "Today", "Oggi"],
    tomorrow: ["Завтра", "Tomorrow", "Domani"],
    overdue: ["Просрочено", "Overdue", "In ritardo"],
    due: ["Сдать", "Due", "Scadenza"],
    st_done: ["Пройдено", "Completed", "Svolta"],
    st_today: ["Сегодня", "Today", "Oggi"],
    st_upcoming: ["Предстоит", "Upcoming", "In programma"],
    st_missed: ["Пропущено", "Missed", "Persa"],
    st_personal: ["Личное", "Personal", "Personale"],
    prev: ["Назад", "Previous", "Indietro"],
    next: ["Вперёд", "Next", "Avanti"],
    no_events: ["В этот день занятий нет.", "No lessons on this day.", "Nessuna lezione in questo giorno."],
    add_event: ["Добавить своё дело", "Add your own event", "Aggiungi un impegno"],
    event_title: ["Что запланировано", "What is planned", "Cosa è previsto"],
    event_time: ["Время", "Time", "Ora"],
    event_date: ["День", "Day", "Giorno"],
    no_lessons: ["Свободно", "Free", "Libero"],
    this_week: ["Эта неделя", "This week", "Questa settimana"],
    add: ["Добавить", "Add", "Aggiungi"],
    del: ["Удалить", "Delete", "Elimina"],
    mark_done: ["Отметить выполненным", "Mark as done", "Segna come fatto"],
    undo_done: ["Снять отметку", "Mark as not done", "Togli il segno"],
    edit_event: ["Изменить дело", "Edit event", "Modifica impegno"],
    save_changes: ["Сохранить", "Save", "Salva"],
    cancel_edit: ["Отмена", "Cancel", "Annulla"],
    event_hint: ["Перетащите на другой день или нажмите, чтобы изменить", "Drag to another day or click to edit", "Trascina su un altro giorno o clicca per modificare"],
    room_next: ["Занятие", "Lesson", "Lezione"],
    pen: ["Ручка", "Pen", "Penna"],
    eraser: ["Ластик", "Eraser", "Gomma"],
    text: ["Текст", "Text", "Testo"],
    text_hint: ["Текст, затем клик по доске", "Type, then click the board", "Scrivi e clicca sulla lavagna"],
    upload_board: ["Загрузить на доску", "Upload to board", "Carica sulla lavagna"],
    clear: ["Очистить", "Clear", "Cancella"],
    mic_on: ["Микрофон вкл.", "Mic on", "Microfono on"],
    mic_off: ["Микрофон выкл.", "Mic off", "Microfono off"],
    cam_on: ["Камера вкл.", "Camera on", "Videocamera on"],
    cam_off: ["Камера выкл.", "Camera off", "Videocamera off"],
    screen_share: ["Показать экран", "Share screen", "Condividi schermo"],
    screen_stop: ["Остановить показ", "Stop sharing", "Interrompi"],
    screen_note: ["Преподаватель показывает экран", "The teacher is sharing the screen", "L'insegnante condivide lo schermo"],
    rec_start: ["Начать запись", "Start recording", "Avvia registrazione"],
    rec_stop: ["Остановить запись", "Stop recording", "Ferma registrazione"],
    rec_on: ["Идёт запись", "Recording", "Registrazione"],
    leave: ["Выйти из урока", "Leave lesson", "Esci dalla lezione"],
    room_demo: ["Видеосвязь показана как пример. Доска и чат работают только у вас.", "Video is simulated. The board and chat work only on your device.", "Il video è simulato. Lavagna e chat funzionano solo sul tuo dispositivo."],
    chat: ["Чат", "Chat", "Chat"],
    message: ["Сообщение", "Message", "Messaggio"],
    send: ["Отправить", "Send", "Invia"],
    you: ["Вы", "You", "Tu"],
    file_attached: ["Прикреплён файл", "File attached", "File allegato"],
    my_courses: ["Мои курсы", "My courses", "I miei corsi"],
    open: ["Открыть", "Open", "Apri"],
    back: ["Назад", "Back", "Indietro"],
    video: ["Видео", "Video", "Video"],
    note: ["Конспект", "Notes", "Appunti"],
    test: ["Тест", "Test", "Test"],
    mark_done: ["Отметить пройденным", "Mark as completed", "Segna come completato"],
    unmark_done: ["Снять отметку", "Remove mark", "Togli il segno"],
    play: ["Смотреть", "Play", "Riproduci"],
    pause: ["Пауза", "Pause", "Pausa"],
    speed: ["Скорость", "Speed", "Velocità"],
    my_notes: ["Заметки к видео", "Video notes", "Note sul video"],
    add_note: ["Сохранить заметку", "Save note", "Salva nota"],
    video_demo: ["Пример плеера: настоящее видео появится после загрузки.", "Sample player: real video appears after upload.", "Lettore di esempio: il video reale apparirà dopo il caricamento."],
    check_test: ["Проверить ответы", "Check answers", "Controlla le risposte"],
    retake: ["Пройти заново", "Retake", "Ripeti"],
    result: ["Результат", "Result", "Risultato"],
    answer_all: ["Ответьте на все вопросы.", "Answer all the questions.", "Rispondi a tutte le domande."],
    your_answer: ["Ваш ответ", "Your answer", "La tua risposta"],
    correct_answer: ["Правильный ответ", "Correct answer", "Risposta corretta"],
    hw_todo: ["Нужно сдать", "To hand in", "Da consegnare"],
    hw_review: ["На проверке", "In review", "In correzione"],
    hw_graded: ["Проверено", "Graded", "Corretto"],
    attach: ["Фото или файл с решением", "Photo or file with your solution", "Foto o file della soluzione"],
    submit_hw: ["Сдать работу", "Hand in", "Consegna"],
    open_hw: ["Открыть задание", "Open task", "Apri il compito"],
    kind_hw: ["ДЗ", "Homework", "Compiti"],
    kind_exam: ["Контрольная", "Test paper", "Verifica"],
    kind_mock: ["Пробник", "Mock exam", "Simulazione"],
    task_kind: ["Тип задания", "Task type", "Tipo di compito"],
    sent_file: ["Файл", "File", "File"],
    grade: ["Оценка", "Grade", "Voto"],
    comment: ["Комментарий", "Comment", "Commento"],
    avg: ["Средний балл", "Average grade", "Media"],
    attendance: ["Посещаемость", "Attendance", "Presenze"],
    lessons_30: ["за последние 30 дней", "over the last 30 days", "negli ultimi 30 giorni"],
    graded_works: ["оценок всего", "grades in total", "voti totali"],
    grades_list: ["Оценки", "Grades", "Voti"],
    date: ["Дата", "Date", "Data"],
    subject: ["Предмет", "Subject", "Materia"],
    work: ["Работа", "Work", "Lavoro"],
    make_report: ["Сформировать отчёт", "Create report", "Crea report"],
    report_title: ["Отчёт об успеваемости", "Progress report", "Report sui progressi"],
    student_name: ["Ученик", "Student", "Studente"],
    period: ["Период", "Period", "Periodo"],
    days_30: ["30 дней", "30 days", "30 giorni"],
    days_90: ["90 дней", "90 days", "90 giorni"],
    last_grades: ["Последние оценки и комментарии преподавателей", "Latest grades and teacher comments", "Ultimi voti e commenti degli insegnanti"],
    save_pdf: ["Сохранить в PDF", "Save as PDF", "Salva in PDF"],
    report_hint: ["В окне печати выберите «Сохранить как PDF», затем перешлите файл родителям.", "In the print window choose “Save as PDF”, then send the file to your parents.", "Nella finestra di stampa scegli “Salva come PDF”, poi invia il file ai genitori."],
    language: ["Язык интерфейса", "Interface language", "Lingua dell'interfaccia"],
    profile: ["Профиль", "Profile", "Profilo"],
    tg_title: ["Уведомления в Telegram", "Telegram notifications", "Notifiche Telegram"],
    tg_1h: ["За 1 час до урока", "1 hour before a lesson", "1 ora prima della lezione"],
    tg_15m: ["За 15 минут до урока", "15 minutes before a lesson", "15 minuti prima della lezione"],
    tg_24h: ["За 24 часа до дедлайна", "24 hours before a deadline", "24 ore prima della scadenza"],
    tg_grade: ["Когда выставлена оценка", "When a grade is posted", "Quando viene assegnato un voto"],
    reset: ["Сбросить демо-данные", "Reset sample data", "Ripristina i dati di esempio"],
    unchecked: ["Непроверенных работ", "Works to review", "Lavori da correggere"],
    lessons_today: ["Занятий сегодня", "Lessons today", "Lezioni di oggi"],
    groups: ["Группы", "Groups", "Gruppi"],
    students_n: ["учеников", "students", "studenti"],
    next_lesson: ["Следующее занятие", "Next lesson", "Prossima lezione"],
    schedule_today: ["Расписание на сегодня", "Today's schedule", "Programma di oggi"],
    queue: ["Очередь на проверку", "Review queue", "Da correggere"],
    queue_empty: ["Все работы проверены.", "All work has been reviewed.", "Tutti i lavori sono corretti."],
    no_file: ["Пример: файл к этой работе не прикреплён.", "Sample: no file is attached to this work.", "Esempio: nessun file allegato."],
    save_grade: ["Выставить оценку", "Post grade", "Assegna il voto"],
    pick_work: ["Выберите работу из очереди.", "Choose a work from the queue.", "Scegli un lavoro dall'elenco."],
    upload_material: ["Загрузить видео или конспект", "Upload a video or notes", "Carica video o appunti"],
    course: ["Курс", "Course", "Corso"],
    type: ["Тип", "Type", "Tipo"],
    title: ["Название", "Title", "Titolo"],
    file: ["Файл", "File", "File"],
    upload: ["Загрузить", "Upload", "Carica"],
    all_materials: ["Все материалы", "All materials", "Tutti i materiali"],
    make_test: ["Создать тест с автопроверкой", "Create an auto-graded test", "Crea un test automatico"],
    question: ["Вопрос", "Question", "Domanda"],
    option: ["Вариант", "Option", "Opzione"],
    correct: ["верный", "correct", "corretta"],
    add_question: ["Добавить вопрос", "Add question", "Aggiungi domanda"],
    save_test: ["Сохранить тест", "Save test", "Salva test"],
    test_need: ["Укажите название и добавьте хотя бы один вопрос.", "Enter a title and add at least one question.", "Inserisci un titolo e almeno una domanda."],
    questions_added: ["Добавлено вопросов", "Questions added", "Domande aggiunte"],
    make_hw: ["Задание на ручную проверку", "Assignment for manual review", "Compito da correggere"],
    due_date: ["Срок сдачи", "Due date", "Scadenza"],
    give_hw: ["Выдать задание", "Assign", "Assegna"],
    diag_title: ["Бесплатная диагностика", "Free assessment", "Valutazione gratuita"],
    diag_intro: ["Пройдите короткий тест по каждому выбранному предмету. Это бесплатно, тест покажет ваш текущий уровень.", "Take a short test in each subject you chose. It is free and shows your current level.", "Fai un breve test per ogni materia scelta. È gratuito e mostra il tuo livello attuale."],
    diag_start: ["Пройти", "Start", "Inizia"],
    diag_level: ["Уровень", "Level", "Livello"],
    diag_passed: ["пройдено диагностик", "assessments completed", "valutazioni completate"],
    diag_hint: ["Ответьте на все вопросы. Если не знаете ответ, выберите вариант наугад: это нормально.", "Answer every question. If you are not sure, take a guess: that is fine.", "Rispondi a tutte le domande. Se non sei sicuro, tira a indovinare: va bene così."],
    diag_finish: ["Завершить диагностику", "Finish the assessment", "Termina la valutazione"],
    diag_score: ["Правильных ответов", "Correct answers", "Risposte corrette"],
    diag_note: ["Это предварительный уровень. Преподаватель уточнит его на первых занятиях.", "This is a preliminary level. Your teacher will refine it in the first lessons.", "È un livello indicativo. L'insegnante lo preciserà nelle prime lezioni."],
    to_home: ["На главную", "Back to home", "Alla home"],
    pkg_title: ["Пакет обучения", "Study plan", "Pacchetto"],
    pkg_locked: ["Выбор пакета откроется, когда вы пройдёте диагностику по всем предметам.", "You can choose a plan once you finish the assessment in every subject.", "Potrai scegliere il pacchetto dopo la valutazione in tutte le materie."],
    pkg_ready: ["Диагностика пройдена. Теперь выберите пакет обучения.", "Assessment complete. Now choose your study plan.", "Valutazione completata. Ora scegli il pacchetto."],
    pkg_choose: ["Выберите пакет", "Choose a plan", "Scegli il pacchetto"],
    pkg_levels: ["Ваши уровни", "Your levels", "I tuoi livelli"],
    pkg_main: ["Основной", "Most popular", "Il più scelto"],
    pkg_pick: ["Выбрать", "Choose", "Scegli"],
    per_month: ["в месяц", "per month", "al mese"],
    pay_title: ["Оплата", "Payment", "Pagamento"],
    pay_subjects: ["Предметы", "Subjects", "Materie"],
    pay_price: ["Стоимость", "Price", "Prezzo"],
    pay_button: ["Оплатить", "Pay", "Paga"],
    pay_demo: ["Это демо: оплата пока не подключена, деньги не списываются. Пакет включится сразу.", "Demo: payment is not connected yet and nothing is charged. The plan turns on right away.", "Demo: il pagamento non è ancora collegato e non viene addebitato nulla. Il pacchetto si attiva subito."],
    /* конструктор курсов (22 ноября 2026) */
    content_sub2: ["Курсы и уроки для ваших групп", "Courses and lessons for your groups", "Corsi e lezioni per i vostri gruppi"],
    create: ["Создать", "Create", "Crea"],
    create_lc: ["создать", "create", "crea"],
    c_course: ["Курс", "Course", "Corso"],
    c_folder: ["Папка", "Folder", "Cartella"],
    c_lesson: ["Урок", "Lesson", "Lezione"],
    c_exam: ["Контрольная / ДЗ", "Test / homework", "Verifica / compiti"],
    c_webinar: ["Онлайн-занятие", "Online class", "Lezione online"],
    c_module: ["Модуль", "Module", "Modulo"],
    h_course: ["Курс по предмету: уроки, модули, контрольные", "A subject course: lessons, modules, tests", "Un corso: lezioni, moduli, verifiche"],
    h_folder: ["Папка, чтобы разложить курсы", "A folder to sort your courses", "Una cartella per ordinare i corsi"],
    h_lesson: ["Урок из страниц: текст, видео, картинки и задания", "A lesson of pages: text, video, images and tasks", "Una lezione a pagine: testo, video, immagini e esercizi"],
    h_exam: ["Задания со сроком сдачи и проходным процентом", "Tasks with a due date and pass mark", "Esercizi con scadenza e soglia"],
    h_webinar: ["Живое занятие или ссылка на трансляцию", "A live class or a stream link", "Lezione dal vivo o link allo streaming"],
    h_module: ["Раздел курса, в нём собраны уроки", "A course section that groups lessons", "Una sezione del corso con le lezioni"],
    soon: ["скоро", "soon", "presto"],
    no_courses: ["Курсов пока нет. Нажмите плюс, чтобы создать первый курс.", "No courses yet. Press plus to create your first course.", "Nessun corso. Premete più per creare il primo."],
    folder_empty: ["В папке пока нет курсов. Создайте курс плюсом или перенесите готовый в настройках курса.", "This folder is empty. Create a course with plus or move one here in course settings.", "La cartella è vuota. Create un corso o spostatelo qui dalle impostazioni."],
    new_folder: ["Новая папка", "New folder", "Nuova cartella"],
    folder_name: ["Название папки", "Folder name", "Nome della cartella"],
    del_folder: ["Удалить папку", "Delete folder", "Elimina cartella"],
    del_folder_q: ["Удалить папку? Курсы из неё не удалятся, а вернутся в общий список.", "Delete the folder? Its courses will stay and return to the main list.", "Eliminare la cartella? I corsi restano nella lista."],
    courses_n: ["курсов", "courses", "corsi"],
    lessons_n: ["уроков", "lessons", "lezioni"],
    pages_n: ["стр.", "pages", "pag."],
    tasks_n: ["заданий", "tasks", "esercizi"],
    untitled: ["Без названия", "Untitled", "Senza titolo"],
    st_draft: ["Черновик", "Draft", "Bozza"],
    st_live: ["Опубликован", "Published", "Pubblicato"],
    course_title_ph: ["Введите название курса", "Enter the course title", "Titolo del corso"],
    course_desc_ph: ["Введите описание курса", "Enter the course description", "Descrizione del corso"],
    add_cover: ["Добавить обложку", "Add cover", "Aggiungi copertina"],
    change_cover: ["Сменить обложку", "Change cover", "Cambia copertina"],
    cover_big: ["Картинка больше 1,5 МБ. Выберите файл поменьше.", "The image is over 1.5 MB. Choose a smaller file.", "Immagine oltre 1,5 MB. Sceglietene una più piccola."],
    course_empty: ["В курсе ещё нет уроков. Создайте первый урок!", "No lessons yet. Create the first one!", "Ancora nessuna lezione. Create la prima!"],
    back_courses: ["Все курсы", "All courses", "Tutti i corsi"],
    back_course: ["Вернуться в курс", "Back to course", "Torna al corso"],
    p_students: ["Ученики", "Students", "Studenti"],
    p_progress: ["Прогресс", "Progress", "Progressi"],
    p_settings: ["Настройки", "Settings", "Impostazioni"],
    p_students_sub: ["Курс видят ученики отмеченных групп, когда он опубликован.", "Students of the checked groups see the course once it is published.", "Gli studenti dei gruppi selezionati vedono il corso quando è pubblicato."],
    p_progress_sub: ["Сколько уроков курса прошёл каждый ученик.", "How many lessons each student has completed.", "Quante lezioni ha completato ogni studente."],
    p_progress_demo: ["У Анны Смирновой настоящий прогресс из демо-кабинета ученика, у остальных цифры для примера.", "Anna Smirnova's progress is real from the demo student account, the others are examples.", "I progressi di Anna Smirnova sono reali, gli altri sono esempi."],
    p_no_groups: ["Отметьте группы во вкладке «Ученики».", "Choose groups in the Students tab.", "Scegliete i gruppi nella scheda Studenti."],
    students_n: ["учеников", "students", "studenti"],
    folder: ["Папка", "Folder", "Cartella"],
    no_folder: ["Без папки", "No folder", "Nessuna cartella"],
    del_course: ["Удалить курс", "Delete course", "Elimina corso"],
    del_course_q: ["Удалить курс со всеми уроками? Отменить будет нельзя.", "Delete the course with all lessons? This cannot be undone.", "Eliminare il corso con tutte le lezioni? Non si può annullare."],
    del_lesson_q: ["Удалить урок? Отменить будет нельзя.", "Delete the lesson? This cannot be undone.", "Eliminare la lezione? Non si può annullare."],
    new_module: ["Новый модуль", "New module", "Nuovo modulo"],
    module_ph: ["Название модуля", "Module title", "Titolo del modulo"],
    move_up: ["Выше", "Move up", "Su"],
    move_down: ["Ниже", "Move down", "Giù"],
    edit: ["Изменить", "Edit", "Modifica"],
    help: ["Подсказка", "Hint", "Suggerimento"],
    new_lesson: ["Новый урок", "New lesson", "Nuova lezione"],
    new_lesson_sub: ["Выберите шаблон и отредактируйте его или начните с пустого урока", "Pick a template and edit it, or start from a blank lesson", "Scegliete un modello o iniziate da una lezione vuota"],
    tpl_blank: ["Пустой урок", "Blank lesson", "Lezione vuota"],
    tpl_blank_d: ["Начать создавать урок с чистого листа", "Start the lesson from scratch", "Iniziare da zero"],
    tpl_diag: ["Диагностика", "Diagnostics", "Diagnostica"],
    tpl_diag_d: ["Опыт ученика — главный ресурс обучения. Шаблон оценивает опыт, знания и понимание основных понятий в начале курса.", "The learner's experience is the key resource. This template checks experience, knowledge and key concepts at the start.", "L'esperienza dello studente è la risorsa principale. Il modello valuta conoscenze e concetti all'inizio."],
    tpl_info: ["Информационный материал к онлайн-курсу", "Course reading material", "Materiale informativo del corso"],
    tpl_info_d: ["Основа любого онлайн-курса — информация. Используйте шаблон, чтобы понятно подать теорию: видео, текст, картинка и короткая проверка.", "Information is the core of any course. Present theory clearly: video, text, image and a short check.", "L'informazione è la base di ogni corso: video, testo, immagine e una breve verifica."],
    tpl_final: ["Итоговый тест по разделу / курсу", "Final test for a section / course", "Test finale di sezione / corso"],
    tpl_final_d: ["Аттестация — необходимый этап каждого курса. Шаблон позволяет объективно оценить прирост знаний: тест с автопроверкой и ввод ответа.", "Assessment is a necessary step. Measure progress objectively: auto-checked test and typed answers.", "La verifica è una tappa necessaria: test con correzione automatica e risposte da digitare."],
    tpl_flip: ["Перевёрнутый класс перед занятием", "Flipped class before a lesson", "Classe capovolta prima della lezione"],
    tpl_flip_d: ["Материал в формате «перевёрнутый класс» можно отправить ученикам до занятия, чтобы они уже знали основы и пришли с вопросами.", "Send flipped-class material before the lesson so students know the basics and come with questions.", "Inviate il materiale prima della lezione: gli studenti arrivano con le basi e con domande."],
    tpl_reflect: ["Шаблон рефлексии после урока", "Reflection after a lesson", "Riflessione dopo la lezione"],
    tpl_reflect_d: ["С помощью рефлексии ученик видит себя со стороны, анализирует свои мысли и действия, а вы понимаете, что стоит повторить.", "Reflection helps students look at their own thinking, and shows you what to revisit.", "La riflessione aiuta lo studente ad analizzarsi e mostra a voi cosa ripetere."],
    lesson_title_ph: ["Введите название урока", "Enter the lesson title", "Titolo della lezione"],
    lesson_desc_ph: ["Введите описание урока", "Enter the lesson description", "Descrizione della lezione"],
    page_ph: ["Новая страница", "New page", "Nuova pagina"],
    add_page: ["Добавить страницу", "Add page", "Aggiungi pagina"],
    del_page: ["Удалить страницу", "Delete page", "Elimina pagina"],
    page_empty: ["Добавьте блоки из списка слева: они появятся на этой странице.", "Add blocks from the list on the left: they appear on this page.", "Aggiungete blocchi dalla lista a sinistra."],
    blocks_info: ["Информационные блоки", "Content blocks", "Blocchi di contenuto"],
    blocks_tasks: ["Задания и тесты", "Tasks and tests", "Esercizi e test"],
    b_text: ["Текст", "Text", "Testo"],
    b_tip: ["Подсказка", "Hint box", "Nota"],
    b_video: ["Видео", "Video", "Video"],
    b_image: ["Изображение", "Image", "Immagine"],
    b_file: ["Файл", "File", "File"],
    b_test: ["Тест", "Quiz", "Quiz"],
    b_input: ["Ввод ответа", "Typed answer", "Risposta da digitare"],
    b_open: ["Открытый вопрос", "Open question", "Domanda aperta"],
    ph_text: ["Текст: объяснение, правило, условие задачи", "Text: explanation, rule, problem", "Testo: spiegazione, regola, problema"],
    ph_tip: ["Важная мысль, правило или предупреждение", "A key idea, rule or warning", "Un'idea chiave, una regola o un avviso"],
    ph_video: ["Ссылка на видео", "Video link", "Link al video"],
    video_sources: ["Подходят ссылки YouTube, VK Видео и RuTube.", "YouTube, VK Video and RuTube links work.", "Funzionano link YouTube, VK Video e RuTube."],
    video_demo_n: ["Демо-видео", "Demo video", "Video demo"],
    caption_ph: ["Подпись (необязательно)", "Caption (optional)", "Didascalia (facoltativa)"],
    pick_image: ["Выбрать картинку", "Choose image", "Scegli immagine"],
    pick_file: ["Выбрать файл", "Choose file", "Scegli file"],
    file_demo: ["В демо сохраняется только название файла.", "In the demo only the file name is saved.", "Nella demo si salva solo il nome del file."],
    ph_q: ["Вопрос", "Question", "Domanda"],
    add_option: ["Вариант", "Option", "Opzione"],
    test_hint: ["Отметьте галочкой верные ответы. Если верных несколько, ученик выбирает все. Без галочек получится опрос без оценки.", "Tick the correct answers. With several, the student picks all. With none it is an ungraded poll.", "Spuntate le risposte corrette. Senza spunte è un sondaggio senza voto."],
    ph_answer: ["Верный ответ. Если подходят несколько, через точку с запятой: 0,5; 1/2", "Correct answer. Several accepted: separate with ;", "Risposta corretta. Più varianti separate da ;"],
    input_hint: ["Ответ проверяется автоматически, регистр и пробелы не важны.", "Checked automatically, case and spaces do not matter.", "Correzione automatica, maiuscole e spazi non contano."],
    open_hint: ["Ученик пишет ответ своими словами, оценку ставите вы.", "The student answers in their own words, you grade it.", "Lo studente risponde con parole sue, il voto lo date voi."],
    done_back: ["Готово, вернуться в курс", "Done, back to course", "Fatto, torna al corso"],
    preview: ["Посмотреть как ученик", "Preview as student", "Anteprima studente"],
    preview_note: ["Так урок увидит ученик. Ответы в просмотре не сохраняются.", "This is what students see. Answers are not saved in preview.", "Così lo vede lo studente. Le risposte non vengono salvate."],
    back_editor: ["Вернуться к редактору", "Back to editor", "Torna all'editor"],
    page_of: ["Страница", "Page", "Pagina"],
    l_next: ["Далее", "Next", "Avanti"],
    l_prev: ["Назад", "Back", "Indietro"],
    finish_lesson: ["Завершить урок", "Finish lesson", "Termina lezione"],
    check_answers: ["Проверить ответы", "Check answers", "Verifica risposte"],
    answer_all_page: ["Ответьте на все задания. Есть пропуск на странице", "Answer all tasks. Something is missing on page", "Rispondete a tutto. Manca qualcosa a pagina"],
    lesson_done: ["Урок пройден", "Lesson completed", "Lezione completata"],
    your_text: ["Ваш ответ", "Your answer", "La vostra risposta"],
    open_saved: ["Ответ сохранён, его оценит преподаватель.", "Answer saved, the teacher will grade it.", "Risposta salvata, la valuterà l'insegnante."],
    next_lesson: ["Следующий урок", "Next lesson", "Lezione successiva"],
    poll: ["опрос", "poll", "sondaggio"],
    no_answer: ["нет ответа", "no answer", "nessuna risposta"],
    teacher_of: ["Преподаватель", "Teacher", "Insegnante"],
    st_new_lesson: ["Новый", "New", "Nuova"],
    no_student_courses: ["Курсов пока нет. Они появятся, когда преподаватель опубликует курс для вашей группы.", "No courses yet. They appear once your teacher publishes one for your group.", "Nessun corso. Appariranno quando l'insegnante ne pubblicherà uno."],
    open_lesson: ["Открыть", "Open", "Apri"],
    groups_n: ["групп", "groups", "gruppi"],
    status: ["Статус", "Status", "Stato"],
    pick_all: ["Выберите все верные ответы", "Choose all correct answers", "Scegliete tutte le risposte corrette"],
    page_empty_st: ["На этой странице пока ничего нет.", "This page is empty for now.", "Questa pagina è ancora vuota."],
    storage_full: ["Не хватило места в браузере. Выберите картинку поменьше.", "Not enough browser storage. Choose a smaller image.", "Spazio del browser esaurito. Scegliete un'immagine più piccola."],
    /* шаг 2: контрольная / ДЗ и онлайн-занятие */
    ex_type: ["Тип работы", "Work type", "Tipo di lavoro"],
    ex_due: ["Срок сдачи", "Due date", "Scadenza"],
    ex_pass: ["Проходной процент", "Pass mark", "Soglia"],
    ex_pass_hint: ["Минимальный процент правильно выполненных заданий для успешного прохождения", "Minimum share of correct answers to pass", "Percentuale minima di risposte corrette per superare"],
    ex_open_note: ["Открытые вопросы вы проверяете в разделе «Проверка работ».", "You grade open questions in Review.", "Le domande aperte si correggono in Verifica lavori."],
    ex_passed: ["Зачтено", "Passed", "Superato"],
    ex_failed: ["Не зачтено", "Not passed", "Non superato"],
    ex_need: ["нужно", "required", "richiesto"],
    ex_review: ["Открытые ответы проверит преподаватель, итоговая оценка появится в «Домашних работах».", "The teacher will grade the open answers; the final grade appears in Homework.", "L'insegnante correggerà le risposte aperte; il voto finale sarà nei Compiti."],
    ex_final: ["Оценка преподавателя", "Teacher's grade", "Voto dell'insegnante"],
    do_task: ["Выполнить", "Start", "Svolgi"],
    answers_sent: ["ответы отправлены", "answers sent", "risposte inviate"],
    auto_check: ["Автопроверка", "Auto-check", "Correzione automatica"],
    open_answers: ["Ответы на открытые вопросы", "Open answers", "Risposte aperte"],
    w_source: ["Источник встречи", "Meeting source", "Fonte"],
    w_room: ["Живой урок на сайте", "Live lesson on the site", "Lezione dal vivo sul sito"],
    w_link: ["Ссылка", "Link", "Link"],
    w_start: ["Начало", "Start", "Inizio"],
    w_dur: ["Длительность, мин", "Duration, min", "Durata, min"],
    w_link_title: ["Вставьте ссылку на трансляцию или на запись встречи", "Paste a link to the stream or the recording", "Incollate il link allo streaming o alla registrazione"],
    w_link_sub: ["Для записи встречи загрузите её на видеохостинг и вставьте ссылку", "Upload a recording to a video service and paste the link", "Caricate la registrazione su un servizio video e incollate il link"],
    w_room_title: ["Занятие пройдёт в «Живом уроке»", "The class runs in the Live lesson room", "La lezione si svolge nella Lezione dal vivo"],
    w_room_sub: ["Доска, чат и показ экрана прямо на сайте. После занятия сюда можно вставить ссылку на запись.", "Board, chat and screen sharing right on the site. Paste a recording link here afterwards.", "Lavagna, chat e condivisione schermo sul sito. Dopo potete incollare qui la registrazione."],
    w_rec_ph: ["Ссылка на запись (необязательно)", "Recording link (optional)", "Link alla registrazione (facoltativo)"],
    w_src_live: ["Источники для трансляций: YouTube, VK Видео, RuTube", "Streams: YouTube, VK Video, RuTube", "Streaming: YouTube, VK Video, RuTube"],
    w_src_rec: ["Источники для записей встреч: YouTube, VK Видео, RuTube", "Recordings: YouTube, VK Video, RuTube", "Registrazioni: YouTube, VK Video, RuTube"],
    w_in_schedule: ["Занятие появится в расписании учеников выбранных групп, когда курс опубликован.", "The class appears in the schedule of the chosen groups once the course is published.", "La lezione appare nell'orario dei gruppi scelti quando il corso è pubblicato."],
    w_join: ["Подключиться", "Join", "Partecipa"],
    w_soon: ["Кнопка подключения появится в день занятия.", "The join button appears on the day of the class.", "Il pulsante apparirà il giorno della lezione."],
    w_no_link: ["Ссылку на трансляцию преподаватель добавит перед занятием.", "The teacher will add the stream link before the class.", "L'insegnante aggiungerà il link prima della lezione."],
    w_live: ["Идёт сейчас", "Live now", "In corso"],
    w_today: ["Сегодня", "Today", "Oggi"],
    w_past: ["Занятие прошло", "The class is over", "La lezione è terminata"],
    w_record: ["Запись занятия", "Recording", "Registrazione"],
    w_untitled: ["Онлайн-занятие", "Online class", "Lezione online"],
    /* банк заданий */
    nav_bank: ["Банк заданий", "Task bank", "Banca esercizi"],
    bank_sub: ["Решайте задания в своём темпе: без сроков и оценок, после ответа сразу видно пояснение", "Practise at your own pace: no deadlines or grades, with an explanation after each answer", "Esercitatevi con calma: niente scadenze né voti, spiegazione dopo ogni risposta"],
    bank_sub_list: ["Впишите краткий ответ и нажмите «Проверить»", "Type a short answer and press Check", "Scrivete la risposta breve e premete Verifica"],
    bank_sub_t: ["Общий банк школы: задания видят все преподаватели предмета и ученики. Изменять можно только свои.", "The school's shared bank: all subject teachers and students see the tasks. You can edit only your own.", "Banca comune della scuola: tutti vedono gli esercizi, si modificano solo i propri."],
    "bank_set_math-pro": ["Математика · профиль", "Maths · advanced", "Matematica · avanzata"],
    "bank_set_math-base": ["Математика · база", "Maths · basic", "Matematica · base"],
    bank_set_eng: ["Английский · ЕГЭ", "English · exam", "Inglese · esame"],
    bank_set_it: ["Итальянский", "Italian", "Italiano"],
    bank_task: ["Задание", "Task", "Esercizio"],
    bank_task_num: ["Номер задания", "Task number", "Numero"],
    bank_level: ["Уровень", "Level", "Livello"],
    bank_part: ["Часть", "Part", "Parte"],
    bank_topic: ["Тема", "Topic", "Argomento"],
    bank_section: ["Раздел", "Section", "Sezione"],
    bank_condition: ["Условие", "Problem", "Testo"],
    bank_correct: ["Верный ответ", "Correct answer", "Risposta corretta"],
    bank_correct_hint: ["Если подходят несколько записей, через точку с запятой: 0,6; 3/5. Регистр и пробелы не важны, запятая и точка равны.", "Several accepted forms: separate with ;. Case and spaces do not matter.", "Più forme accettate separate da ;. Maiuscole e spazi non contano."],
    bank_explain: ["Пояснение", "Explanation", "Spiegazione"],
    bank_explain_hint: ["Ученик увидит его после ответа, верного или нет.", "Students see it after answering, right or wrong.", "Lo studente la vede dopo la risposta."],
    bank_new_task: ["Новое задание", "New task", "Nuovo esercizio"],
    bank_edit_task: ["Изменить задание", "Edit task", "Modifica esercizio"],
    bank_add: ["Добавить в банк", "Add to bank", "Aggiungi"],
    bank_author: ["автор", "author", "autore"],
    bank_you: ["вы", "you", "voi"],
    bank_tries_n: ["решений", "attempts", "tentativi"],
    bank_in_section: ["заданий в разделе", "tasks in section", "esercizi"],
    bank_mine: ["ваших заданий", "your tasks", "vostri esercizi"],
    bank_tries_total: ["решений учеников", "student attempts", "tentativi"],
    bank_avg_right: ["верных в среднем", "correct on average", "corrette in media"],
    bank_hard: ["Самые сложные задания", "Hardest tasks", "Esercizi più difficili"],
    bank_hard_sub: ["Где ученики чаще всего ошибаются. Цифры демо, ответы ученицы в этом браузере тоже учитываются.", "Where students fail most. Demo numbers plus answers given in this browser.", "Dove si sbaglia di più. Dati demo più le risposte in questo browser."],
    bank_reports: ["Сообщения об ошибках", "Error reports", "Segnalazioni"],
    bank_resolved: ["Исправлено", "Resolved", "Risolto"],
    bank_new: ["Не выполнено", "Not done", "Da fare"],
    bank_right: ["Верно", "Correct", "Giusto"],
    bank_wrong: ["Неверно", "Wrong", "Sbagliato"],
    bank_fav: ["В избранное", "Save", "Preferiti"],
    bank_faved: ["В избранном", "Saved", "Nei preferiti"],
    bank_report: ["Сообщить об ошибке", "Report a mistake", "Segnala un errore"],
    bank_report_what: ["Что не так с заданием?", "What is wrong with the task?", "Cosa non va?"],
    bank_report_thanks: ["Спасибо! Сообщение отправлено автору задания.", "Thanks! The author has been notified.", "Grazie! L'autore è stato avvisato."],
    bank_enter: ["Введите ответ", "Enter the answer", "Inserite la risposta"],
    bank_answer_ph: ["Ваш ответ", "Your answer", "La vostra risposta"],
    bank_check: ["Проверить", "Check", "Verifica"],
    bank_again: ["Ещё раз", "Try again", "Riprova"],
    bank_solved: ["Решено", "Solved", "Risolto"],
    bank_show: ["Смотреть решение", "Show solution", "Mostra soluzione"],
    bank_right_lc: ["верно", "correct", "giuste"],
    bank_accuracy: ["точность ответов", "accuracy", "precisione"],
    bank_to_fix: ["ошибок к разбору", "mistakes to review", "errori da rivedere"],
    bank_favs: ["Избранное", "Saved", "Preferiti"],
    bank_weak: ["Где вы чаще ошибаетесь", "Where you make mistakes", "Dove sbagliate di più"],
    bank_errors: ["Ошибки", "Mistakes", "Errori"],
    bank_errors_n: ["ошиб.", "mistakes", "errori"],
    bank_all: ["Все задания", "All tasks", "Tutti"],
    bank_empty: ["Заданий пока нет.", "No tasks yet.", "Ancora nessun esercizio."],
    bank_no_errors: ["Ошибок нет. Так держать!", "No mistakes. Keep it up!", "Nessun errore!"],
    bank_no_favs: ["В избранном пока пусто. Нажмите «В избранное» на задании.", "Nothing saved yet.", "Nessun preferito."]
  };

  const COURSES = {
    math: { name: "Математика · ЕГЭ", short: "Математика" },
    eng: { name: "Английский · ЕГЭ", short: "Английский" },
    it: { name: "Итальянский", short: "Итальянский" }
  };
  const TOPICS = {
    math: ["Логарифмы", "Тригонометрия", "Производная", "Стереометрия", "Параметры", "Вероятность"],
    eng: ["Present Perfect", "Conditionals", "Speaking practice", "Essay writing", "Listening"],
    it: ["Presentarsi", "Presente indicativo", "Passato prossimo", "Al ristorante", "Articoli e plurali"]
  };
  const PLAN = {
    student: [
      { dow: 1, time: "17:00", course: "math" }, { dow: 3, time: "17:00", course: "math" },
      { dow: 2, time: "18:30", course: "eng" }, { dow: 4, time: "18:30", course: "eng" },
      { dow: 6, time: "12:00", course: "it" }
    ],
    teacher: [
      { dow: 1, time: "15:30", course: "math", group: "g2" }, { dow: 1, time: "17:00", course: "math", group: "g1" },
      { dow: 3, time: "15:30", course: "math", group: "g2" }, { dow: 3, time: "17:00", course: "math", group: "g1" },
      { dow: 5, time: "16:00", course: "math", group: "g3" }
    ]
  };
  const GROUPS = {
    g1: { name: "ЕГЭ Математика · Группа 1", students: 8 },
    g2: { name: "ЕГЭ Математика · Группа 2", students: 7 },
    g3: { name: "ЕГЭ Математика · Интенсив", students: 5 }
  };
  /* Ученики преподавателя для страницы успеваемости: пример. ДЗ всего 8 за период. */
  const ROSTER = [
    ["Анна Смирнова", "g1", 92, 7, 4.5, 5], ["Дмитрий К.", "g1", 88, 6, 4.2, 4], ["София Л.", "g1", 95, 8, 4.8, 5], ["Артём В.", "g1", 71, 5, 3.6, 3],
    ["Елизавета П.", "g1", 90, 7, 4.4, 4], ["Максим Р.", "g1", 84, 6, 4.0, 4], ["Полина Г.", "g1", 97, 8, 4.9, 5], ["Иван Т.", "g1", 68, 4, 3.5, 3],
    ["Кирилл М.", "g2", 86, 7, 4.1, 4], ["Алиса Н.", "g2", 93, 8, 4.7, 5], ["Тимофей Б.", "g2", 79, 5, 3.9, 4], ["Варвара С.", "g2", 91, 7, 4.6, 5],
    ["Егор Д.", "g2", 83, 6, 4.0, 4], ["Ульяна Ж.", "g2", 96, 8, 4.8, 5], ["Марк Ф.", "g2", 74, 6, 3.7, 3],
    ["Ника О.", "g3", 89, 7, 4.3, 4], ["Лев К.", "g3", 92, 8, 4.6, 5], ["Ева Ш.", "g3", 87, 6, 4.2, 4], ["Глеб А.", "g3", 77, 6, 4.0, 4], ["Мия Ю.", "g3", 94, 8, 4.7, 5]
  ].map(function (r, i) {
    const lag = r[2] < 75 || r[3] / 8 < 0.65 || r[4] < 3.8;
    const g = function (x) { return Math.max(2, Math.min(5, Math.round(x))); };
    return { id: "s" + (i + 1), name: r[0], group: r[1], att: r[2], hwDone: r[3], hwTotal: 8, avg: r[4], last: r[5], lag: lag,
      recent: [[3, "Логарифмы: проверочный тест", r[5]], [10, "Тригонометрия: подборка задач", g(r[4])], [17, "Производная: исследование функции", g(r[4] + 0.3)], [24, "Пробник: первая часть", g(r[4] - 0.4)]] };
  });
  const PEOPLE = {
    student: { name: "Анна Смирнова", email: "student@demo.ru" },
    teacher: { name: "Мария Иванова", email: "teacher@demo.ru" }
  };
  const NAV = {
    student: [["dashboard", "nav_home"], ["schedule", "nav_schedule"], ["lesson", "nav_lesson"], ["courses", "nav_courses"], ["homework", "nav_hw"], ["bank", "nav_bank"], ["grades", "nav_grades"], ["settings", "nav_settings"]],
    teacher: [["dashboard", "nav_home"], ["schedule", "nav_schedule"], ["lesson", "nav_lesson"], ["content", "nav_content"], ["bank", "nav_bank"], ["review", "nav_review"], ["progress", "nav_grades"], ["settings", "nav_settings"]]
  };

  const TABS = { student: ["dashboard", "schedule", "courses", "homework"], teacher: ["dashboard", "schedule", "review", "content"] };
  const TAB_LABELS = { homework: "tab_hw", review: "tab_review" };
  const ICONS = {
    dashboard: "M3 11 12 4l9 7v9h-6v-6H9v6H3z",
    schedule: "M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 10h18M8 3v4M16 3v4",
    courses: "M6 3h14v16H6a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2z",
    cap: "M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v5",
    homework: "M6 3h9l4 4v14H6zM14 3v5h5M9 14l2 2 4-4",
    review: "M4 4h16v16H4zM8 12l3 3 5-6",
    content: "M12 16V4M7 9l5-5 5 5M4 20h16",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    lesson: "M3 7h12v10H3zM15 10.5l6-3.5v10l-6-3.5",
    grades: "M4 20V11M10 20V5M16 20v-6M3 20h18",
    progress: "M3 17l6-6 4 4 8-8M15 7h6v6",
    settings: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4",
    users: "M15 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 19v-1a4 4 0 0 0-3-3.8M15.5 3.6a3.5 3.5 0 0 1 0 6.8",
    star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z",
    fire: "M12 3c.8 3 5 5.2 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.6.1 1.8.9 3 2 3.2C11 8.6 10.6 6 12 3z",
    logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11",
    plus: "M12 5v14M5 12h14",
    video: "M8 5.5v13l11-6.5z",
    note: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5",
    test: "M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17",
    chevron: "M9 6l6 6-6 6",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    alert: "M12 3.5l9 16H3zM12 10v4M12 17h.01",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    bank: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.3 1.4 1.3 2.4h5c0-1 .6-1.8 1.3-2.4A6 6 0 0 0 12 3z",
    heart: "M12 20s-7-4.4-9-8.6C1.6 8.3 3.4 5 6.6 5c2 0 3.4 1.2 4.1 2.4h.6C12 6.2 13.4 5 15.4 5c3.2 0 5 3.3 3.6 6.4C19 15.6 12 20 12 20z",
    eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    pen: "M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
    folder: "M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z",
    module: "M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5",
    lesson_ico: "M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z",
    exam: "M6 3h9l4 4v14H6zM14 3v5h5M9 13.5l2 2 4-4",
    up: "M6 15l6-6 6 6",
    down: "M6 9l6 6 6-6",
    b_text: "M5 6V4h14v2M12 4v16M9 20h6",
    b_tip: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01",
    b_video: "M3 5h18v14H3zM10 9v6l5-3z",
    b_image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01",
    b_file: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5",
    b_test: "M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17",
    b_input: "M3 7h18v10H3zM7 10v4",
    b_open: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5"
  };
  function icon(name) { return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"" + ICONS[name] + "\"/></svg>"; }

  /* ---------- курсы: данные (22 ноября 2026) ----------
     Курс принадлежит преподавателю (owner), привязан к предмету и группам. Ученик видит опубликованные курсы своих групп.
     items — плоский список: модуль (type "module") — заголовок раздела, уроки после него входят в этот модуль. */
  const TEACHERS = {
    teacher: { name: "Мария Иванова", subjects: ["math"] },
    "t-eng": { name: "Ольга Петрова", subjects: ["eng"] },
    "t-it": { name: "Джулия Росси", subjects: ["it"] },
    "t-math2": { name: "Павел Орлов", subjects: ["math"] }
  };
  const STUDENT_GROUPS = { math: "g1", eng: "e1", it: "i1" }; // группы демо-ученицы по предметам
  const BLOCK_TYPES = { info: ["text", "tip", "video", "image", "file"], tasks: ["test", "input", "open"] };
  const TASK_TYPES = ["test", "input", "open"];
  const KIND_ICON = { lesson: "c_lesson", exam: "c_exam", webinar: "c_webinar" };

  function seedCourses() {
    let n = 0;
    const b = function (type, props) { n++; return Object.assign({ id: "b" + n, type: type }, props); };
    const lesson = function (id, title, blocks) { return { id: id, type: "lesson", kind: "lesson", title: title, desc: "", pages: [{ id: id + "p1", title: "", blocks: blocks }] }; };
    const quiz = function (list) { return list.map(function (q) { return b("test", { q: q[0], options: q[1], correct: [q[2]] }); }); };
    return [
      { id: "c-math", owner: "teacher", subject: "math", folder: "", status: "live", groups: ["g1", "g2", "g3"], cover: "",
        title: "ЕГЭ по математике: профиль", desc: "Логарифмы и тригонометрия: видео, конспекты и проверочные тесты.",
        items: [
          { id: "md-m1", type: "module", title: "Логарифмы" },
          lesson("v1", "Логарифмы: основные свойства", [b("video", { url: "", dur: 1450, title: "Логарифмы: основные свойства" })]),
          lesson("n1", "Конспект: логарифмы", [b("text", { text: "log_a(xy) = log_a x + log_a y. log_a(x/y) = log_a x − log_a y. log_a x^n = n · log_a x." }), b("tip", { text: "Основание положительно и не равно единице, аргумент положителен." })]),
          lesson("v2", "Логарифмические уравнения", [b("video", { url: "", dur: 1980, title: "Логарифмические уравнения" })]),
          lesson("t1", "Логарифмы: проверочный тест", quiz([["Чему равен log₂ 8?", ["2", "3", "4", "8"], 1], ["Чему равен log₃ 1?", ["0", "1", "3", "не определён"], 0], ["Чему равен log₅ 25?", ["5", "1", "2", "25"], 2]]).concat([b("input", { q: "Вычислите lg 1000.", answer: "3" })])),
          { id: "md-m2", type: "module", title: "Тригонометрия" },
          lesson("v3", "Тригонометрия: формулы приведения", [b("video", { url: "", dur: 1620, title: "Тригонометрия: формулы приведения" })]),
          lesson("n3", "Конспект: тригонометрия", [b("text", { text: "sin²x + cos²x = 1. Формулы приведения меняют функцию на кофункцию для углов π/2 и 3π/2. Знак определяется по четверти исходной функции." })]),
          { id: "md-m3", type: "module", title: "Практика" },
          { id: "w1", type: "lesson", kind: "webinar", source: "room", url: "", date: iso(day(1)), time: "18:00", dur: "60", title: "Разбор пробника: первая часть", desc: "Разберём ошибки пробника и задачи, которые вызвали больше всего вопросов.", pages: [] },
          { id: "x1", type: "lesson", kind: "exam", hwKind: "exam", due: iso(day(5)), pass: "75", title: "Логарифмы: контрольная работа", desc: "Три задания с автопроверкой и одно развёрнутое.", pages: [{ id: "x1p1", title: "", blocks: quiz([["Чему равен log₂ 32?", ["4", "5", "6", "16"], 1], ["Упростите log₃ 9 + log₃ 3.", ["2", "3", "4", "27"], 1]]).concat([b("input", { q: "Решите уравнение log₂ x = 6.", answer: "64" }), b("open", { q: "Объясните, почему выражение log₁ 5 не имеет смысла." })]) }] }
        ] },
      { id: "c-eng", owner: "t-eng", subject: "eng", folder: "", status: "live", groups: ["e1"], cover: "",
        title: "ЕГЭ по английскому", desc: "Грамматика для письменной части и устная практика.",
        items: [
          { id: "md-e1", type: "module", title: "Grammar" },
          lesson("v5", "Present Perfect vs Past Simple", [b("video", { url: "", dur: 1210, title: "Present Perfect vs Past Simple" })]),
          lesson("n5", "Notes: Present Perfect", [b("text", { text: "Use Present Perfect for experience and results connected to now. Use Past Simple with a finished time: yesterday, in 2020, last week." })]),
          lesson("v6", "Conditionals: types 0–3", [b("video", { url: "", dur: 1540, title: "Conditionals: types 0–3" })]),
          lesson("t2", "Grammar check: Present tenses", quiz([["She ___ to school every day.", ["go", "goes", "is go", "going"], 1], ["I have lived here ___ 2020.", ["for", "since", "from", "at"], 1], ["___ you ever been to Italy?", ["Did", "Are", "Have", "Do"], 2]]))
        ] },
      { id: "c-it", owner: "t-it", subject: "it", folder: "", status: "live", groups: ["i1"], cover: "",
        title: "Итальянский с нуля", desc: "Разговорные темы и грамматика уровня A1–A2.",
        items: [
          lesson("v8", "Passato prossimo: essere или avere", [b("video", { url: "", dur: 1730, title: "Passato prossimo: essere или avere" })]),
          lesson("n8", "Конспект: passato prossimo", [b("text", { text: "Passato prossimo = avere или essere в настоящем времени + причастие (participio passato).\n\nБольшинство глаголов спрягаются с avere: ho mangiato. Глаголы движения и состояния — с essere, причастие согласуется с подлежащим: sono andato, sono andata." })]),
          lesson("v9", "Al ristorante: полезные фразы", [b("video", { url: "", dur: 1390, title: "Al ristorante: полезные фразы" })])
        ] }
    ];
  }

  function lessonsOf(c) { return c.items.filter(function (i) { return i.type === "lesson"; }); }
  function findCourse(id) { return find(state.courses, id); }
  function findLesson(id) {
    for (let i = 0; i < state.courses.length; i++) {
      const l = find(state.courses[i].items, id);
      if (l && l.type === "lesson") return { course: state.courses[i], lesson: l };
    }
    return null;
  }
  function findBlock(path) {
    const p = String(path).split("|");
    const hit = findLesson(p[0]);
    if (!hit) return {};
    const pg = find(hit.lesson.pages, p[1]);
    return { course: hit.course, lesson: hit.lesson, page: pg, block: pg && p[2] ? find(pg.blocks, p[2]) : null, extra: p[3] };
  }
  function teacherCourses() { return state.courses.filter(function (c) { return c.owner === "teacher"; }); }
  function studentCourses() { return state.courses.filter(function (c) { return c.status === "live" && c.groups.indexOf(STUDENT_GROUPS[c.subject]) >= 0; }); }
  function blocksOf(l) { return l.pages.reduce(function (acc, p) { return acc.concat(p.blocks); }, []); }
  function gradedBlocks(l) { return blocksOf(l).filter(function (bl) { return (bl.type === "test" && bl.correct.length) || (bl.type === "input" && String(bl.answer || "").trim()); }); }
  function isDone(id) { return state.done.indexOf(id) >= 0; }
  function courseProgress(c) {
    const list = lessonsOf(c);
    const done = list.filter(function (l) { return isDone(l.id); }).length;
    return { done: done, total: list.length, pct: list.length ? Math.round(done / list.length * 100) : 0 };
  }
  function lessonsWord(n) { return n + " " + t("lessons_n"); }
  function newBlock(type) {
    const base = { id: uid("b"), type: type };
    if (type === "test") return Object.assign(base, { q: "", options: ["", ""], correct: [] });
    if (type === "input") return Object.assign(base, { q: "", answer: "" });
    if (type === "open") return Object.assign(base, { q: "" });
    if (type === "video") return Object.assign(base, { url: "" });
    if (type === "image") return Object.assign(base, { src: "", caption: "" });
    if (type === "file") return Object.assign(base, { name: "" });
    return Object.assign(base, { text: "" });
  }

  /* шаг 2: контрольная / ДЗ (kind "exam") и онлайн-занятие (kind "webinar") */
  const KIND_ICO = { lesson: "lesson_ico", exam: "exam", webinar: "lesson" };
  function kindIco(l) { return KIND_ICO[l.kind] || "lesson_ico"; }
  function autoGrade(pct) { return pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 50 ? 3 : 2; }
  /* контрольная превращается в запись «домашней работы»: дедлайны, «Домашние работы», «Проверка работ», оценки */
  function examEntry(c, l) {
    const r = state.results[l.id];
    const e = { id: "x-" + l.id, lesson: l.id, student: "me", name: PEOPLE.student.name, course: c.subject, kind: KINDS.indexOf(l.hwKind) >= 0 ? l.hwKind : "hw", title: l.title || t("untitled"), due: l.due || iso(day(0)), status: "todo" };
    if (!r) return e;
    const pct = r.total ? Math.round(r.score / r.total * 100) : 100;
    e.status = r.open && !r.teacherGrade ? "review" : "graded";
    e.grade = r.teacherGrade || autoGrade(pct);
    e.comment = r.comment || (r.total ? t(pct >= Number(l.pass || 0) ? "ex_passed" : "ex_failed") + ": " + r.score + " " + t("of") + " " + r.total + " (" + pct + "%)" : "");
    e.gradedAt = r.gradedAt || r.date;
    return e;
  }
  function examsOf(list) {
    const out = [];
    list.forEach(function (c) { lessonsOf(c).forEach(function (l) { if (l.kind === "exam") out.push(examEntry(c, l)); }); });
    return out;
  }
  function webinarStart(l) { const p = String(l.date || iso(day(0))).split("-").map(Number), h = String(l.time || "00:00").split(":").map(Number); return new Date(p[0], p[1] - 1, p[2], h[0] || 0, h[1] || 0); }
  function webinarState(l) {
    const now = new Date(), start = webinarStart(l), end = new Date(start.getTime() + (Number(l.dur) || 45) * 60000);
    if (now > end) return "past";
    if (now >= start) return "live";
    return iso(start) === iso(now) ? "today" : "upcoming";
  }
  function joinLink(l) {
    if (l.source === "link") return l.url ? { href: l.url, ext: true } : null;
    return { href: go("lesson"), ext: false };
  }
  function webinarsOn(d) {
    const key = iso(d), out = [];
    (role === "teacher" ? teacherCourses() : studentCourses()).forEach(function (c) {
      lessonsOf(c).forEach(function (l) {
        if (l.kind !== "webinar" || l.date !== key) return;
        const st = webinarState(l);
        out.push({ date: key, day: d, time: l.time || "00:00", course: c.subject, name: l.title || t("w_untitled"), short: l.title || t("w_untitled"), topic: t("c_webinar"), status: st === "past" ? "done" : key === iso(day(0)) ? "today" : "upcoming", webinar: l.id });
      });
    });
    return out;
  }
  function joinBtn(e) {
    const label = t(role === "teacher" ? "start_lesson" : "join");
    if (e.webinar) {
      const hit = findLesson(e.webinar), j = hit && joinLink(hit.lesson);
      return j ? "<a class=\"btn btn--red btn--sm\" href=\"" + esc(j.href) + "\"" + (j.ext ? " target=\"_blank\" rel=\"noopener\"" : "") + ">" + label + "</a>" : "";
    }
    return "<a class=\"btn btn--red btn--sm\" href=\"" + go("lesson") + "\">" + label + "</a>";
  }
  function newPage(title, blocks) { return { id: uid("p"), title: title || "", blocks: blocks || [] }; }
  /* Шаблоны уроков: как на образце заказчика, тексты под нашу школу */
  const TEMPLATES = [
    { id: "blank", emoji: "" },
    { id: "diag", emoji: "🔬" },
    { id: "info", emoji: "📖" },
    { id: "final", emoji: "📝" },
    { id: "flip", emoji: "🙃" },
    { id: "reflect", emoji: "💬" }
  ];
  function templatePages(id) {
    const B = function (type, props) { return Object.assign(newBlock(type), props || {}); };
    const q = function (text) { return B("test", { q: text, options: ["Вариант 1", "Вариант 2", "Вариант 3"], correct: [0] }); };
    if (id === "diag") return [
      newPage("Знакомство", [B("text", { text: "Этот урок поможет понять, с чего начать обучение. Отвечайте честно: оценка за диагностику не ставится." }), B("open", { q: "Что у вас уже получается в этом предмете, а что даётся труднее всего?" })]),
      newPage("Проверка знаний", [q("Вопрос 1"), q("Вопрос 2"), B("input", { q: "Задача с кратким ответом", answer: "" })])
    ];
    if (id === "info") return [
      newPage("Теория", [B("video"), B("text"), B("image"), B("tip", { text: "Главное, что нужно запомнить из этого урока." })]),
      newPage("Проверьте себя", [q("Вопрос на понимание темы")])
    ];
    if (id === "final") return [
      newPage("Инструкция", [B("tip", { text: "На тест отводится 40 минут. Между страницами можно переходить, ответы проверяются в конце." })]),
      newPage("Задания", [q("Вопрос 1"), q("Вопрос 2"), B("input", { q: "Задание с кратким ответом 1" }), B("input", { q: "Задание с кратким ответом 2" })])
    ];
    if (id === "flip") return [
      newPage("Посмотрите до занятия", [B("video"), B("text", { text: "Посмотрите видео и прочитайте короткий конспект. На занятии разберём вопросы и сразу перейдём к практике." })]),
      newPage("Подготовьте вопросы", [B("open", { q: "Что осталось непонятным? Запишите вопросы к занятию." })])
    ];
    if (id === "reflect") return [
      newPage("Как прошло занятие", [B("test", { q: "Насколько понятной была тема?", options: ["Всё понятно", "Почти всё", "Нужно повторить"], correct: [] }), B("open", { q: "Что получилось лучше всего?" }), B("open", { q: "Что хотите разобрать ещё раз?" })])
    ];
    return [newPage("", [])];
  }

  /* ---------- хранилище и даты ---------- */
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); return true; } catch (e) { return false; } }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function day(offset) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(s) { const p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function uid(prefix) { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000); }

  function seed() {
    return {
      lang: "ru",
      tg: { h1: true, m15: true, h24: true, grade: true },
      personal: [],
      done: ["v1", "n1", "v2", "v5", "n5", "v8", "n8"],
      notes: {},
      results: {},
      chat: [
        { who: "Мария Иванова", text: "Добрый вечер! Начнём через пару минут." },
        { who: "Дмитрий К.", text: "Здравствуйте!" }
      ],
      courses: seedCourses(),
      folders: [],
      bank: seedBank(),
      bankProgress: { q1: { status: "right", answer: "0,6", tries: 1, date: iso(day(-3)) }, q2: { status: "wrong", answer: "1", tries: 1, date: iso(day(-3)) }, q14: { status: "right", answer: "went", tries: 1, date: iso(day(-2)) }, q24: { status: "wrong", answer: "siamo andato", tries: 2, date: iso(day(-1)) } },
      bankFav: ["q6"],
      bankReports: [{ id: "r1", task: "q2", from: "Дмитрий К.", text: "В условии не сказано, что выстрелы независимы.", date: iso(day(-1)), done: false }],
      homework: [
        { id: "hw1", student: "me", name: PEOPLE.student.name, course: "math", title: "Логарифмические уравнения", due: iso(day(1)), status: "todo" },
        { id: "hw2", student: "me", name: PEOPLE.student.name, course: "it", title: "Lettera a un amico: расскажите о выходных", due: iso(day(3)), status: "todo" },
        { id: "hw3", student: "me", name: PEOPLE.student.name, course: "eng", title: "Essay: Technology in education", due: iso(day(-1)), status: "review", file: { name: "essay.docx" } },
        { id: "hw4", student: "me", name: PEOPLE.student.name, course: "math", title: "Тригонометрия: подборка задач", due: iso(day(-6)), status: "graded", grade: 5, comment: "Отличное оформление, все шаги на месте.", gradedAt: iso(day(-4)), file: { name: "trig.jpg" } },
        { id: "hw5", student: "me", name: PEOPLE.student.name, course: "math", title: "Производная: исследование функции", due: iso(day(-13)), status: "graded", grade: 4, comment: "Проверь знак производной на втором промежутке.", gradedAt: iso(day(-11)), file: { name: "derivative.pdf" } },
        { id: "hw6", student: "d", name: "Дмитрий К.", course: "math", title: "Логарифмические уравнения", due: iso(day(1)), status: "review", file: { name: "reshenie.jpg" } },
        { id: "hw7", student: "s", name: "София Л.", course: "math", title: "Логарифмические уравнения", due: iso(day(1)), status: "review", file: { name: "dz_logarifmy.pdf" } },
        { id: "hw8", student: "a", name: "Артём В.", course: "math", title: "Тригонометрия: подборка задач", due: iso(day(-6)), status: "review", file: { name: "trig_artem.jpg" } },
        { id: "hw9", student: "me", name: PEOPLE.student.name, course: "math", kind: "exam", title: "Показательные уравнения и неравенства", due: iso(day(4)), status: "todo" },
        { id: "hw10", student: "me", name: PEOPLE.student.name, course: "eng", kind: "mock", title: "Пробник ЕГЭ: письменная часть", due: iso(day(6)), status: "todo" }
      ],
      gradeLog: [
        { date: iso(day(-2)), course: "eng", title: "Работа на уроке: Conditionals", grade: 5, comment: "Great speaking today." },
        { date: iso(day(-9)), course: "it", title: "Письменный опрос: passato prossimo", grade: 4, comment: "Следи за выбором essere или avere." },
        { date: iso(day(-16)), course: "math", title: "Пробник: первая часть", grade: 4, comment: "Хороший темп, повторим стереометрию." },
        { date: iso(day(-40)), course: "it", title: "Диалог: знакомство", grade: 5, comment: "Molto bene!" }
      ]
    };
  }

  let state = load(STATE_KEY) || seed();
  /* данные, сохранённые до конструктора курсов: материалы и тесты заменены демо-курсами, пройденное сохраняется (те же id) */
  if (!state.courses) { state.courses = seedCourses(); delete state.materials; delete state.tests; }
  if (!state.folders) state.folders = [];
  if (!state.bank) { state.bank = seedBank(); state.bankProgress = {}; state.bankFav = []; state.bankReports = []; }
  let role = "student";
  let page = "dashboard";
  let param = "";
  let account = null; // ученик, зарегистрированный на start.html; у демо-доступа его нет

  function t(key) { const row = I18N[key]; return row ? row[LANGS.indexOf(state.lang)] : key; }
  function date(d, options) { return new Intl.DateTimeFormat(LOCALES[state.lang], options).format(d); }
  function shortDate(d) { return date(d, { day: "numeric", month: "short" }); }
  function go(target, id) { return "#" + role + "/" + target + (id ? "/" + id : ""); }
  function me() { return role === "student" && account ? account : PEOPLE[role]; }
  function find(list, id) { return list.filter(function (item) { return item.id === id; })[0]; }
  function courseOptions(selected) {
    return Object.keys(COURSES).map(function (k) { return "<option value=\"" + k + "\"" + (k === selected ? " selected" : "") + ">" + esc(COURSES[k].name) + "</option>"; }).join("");
  }

  /* ---------- расписание ---------- */
  function lessonsOn(d) {
    const key = iso(d);
    const isToday = key === iso(day(0));
    const past = d < day(0);
    let slots = PLAN[role].filter(function (p) { return p.dow === d.getDay(); });
    if (isToday && !slots.length) slots = [Object.assign({}, PLAN[role][0], { time: "19:00" })];
    const num = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    const list = slots.map(function (p) {
      const topics = TOPICS[p.course];
      const missed = past && role === "student" && num % 9 === 0;
      return {
        date: key, day: d, time: p.time, course: p.course,
        name: p.group ? GROUPS[p.group].name : COURSES[p.course].name,
        short: p.group ? GROUPS[p.group].name.split("· ")[1] : COURSES[p.course].short,
        group: p.group, topic: topics[num % topics.length],
        status: isToday ? "today" : past ? (missed ? "missed" : "done") : "upcoming"
      };
    });
    return list.concat(webinarsOn(d)).sort(function (x, y) { return x.time.localeCompare(y.time); });
  }
  function nextLessons(count) {
    const out = [];
    for (let i = 0; i < 28 && out.length < count; i++) out.push.apply(out, lessonsOn(day(i)));
    return out.slice(0, count);
  }
  function eventsOn(d) {
    const key = iso(d);
    const own = state.personal.filter(function (e) { return e.date === key && e.role === role; }).map(function (e) {
      return { id: e.id, date: key, day: d, time: e.time, name: e.title, short: e.title, topic: "", status: "personal", done: !!e.done };
    });
    return lessonsOn(d).concat(own).sort(function (a, b) { return a.time.localeCompare(b.time); });
  }
  function attendance(days) {
    let attended = 0, total = 0;
    for (let i = 1; i <= days; i++) {
      lessonsOn(day(-i)).forEach(function (l) { total++; if (l.status === "done") attended++; });
    }
    return total ? Math.round(attended / total * 100) : 0;
  }
  function statusTag(status) {
    const cls = { done: "tag--done", missed: "tag--missed", personal: "tag--personal", today: "tag--todo" }[status] || "";
    return "<span class=\"tag " + cls + "\">" + t("st_" + status) + "</span>";
  }
  function dueLabel(s) {
    const diff = Math.round((parse(s) - day(0)) / 864e5);
    if (diff < 0) return t("overdue");
    if (diff === 0) return t("today");
    if (diff === 1) return t("tomorrow");
    return shortDate(parse(s));
  }
  function lessonRow(l) {
    const isToday = l.status === "today";
    const action = isToday
      ? joinBtn(l)
      : "<span class=\"tag\">" + shortDate(l.day) + "</span>";
    return "<li><span class=\"grow\"><span class=\"time\">" + l.time + "</span>" + esc(l.name) + "<br><span class=\"muted small\">" + esc(l.topic) + "</span></span>" + action + "</li>";
  }

  /* ---------- общие детали страниц ---------- */
  function head(title, sub, action) {
    return "<div class=\"phead\"><div class=\"phead-text\"><h1 class=\"title\">" + title + "</h1>" + (sub ? "<p class=\"phead-sub\">" + sub + "</p>" : "") + "</div>" + (action || "") + "</div>";
  }
  function stat(name, tone, value, label, href) {
    const tag = href ? "a" : "div";
    return "<" + tag + " class=\"stat\"" + (href ? " href=\"" + href + "\"" : "") + "><span class=\"stat-icon stat-icon--" + tone + "\">" + icon(name) + "</span><span class=\"stat-body\"><b>" + value + "</b><span>" + label + "</span></span></" + tag + ">";
  }
  function stats(items) { return "<div class=\"stats\">" + items.join("") + "</div>"; }
  function chips(items, current) {
    return "<nav class=\"chips\">" + items.map(function (c) {
      return "<a class=\"chip" + (c[0] === current ? " on" : "") + "\" href=\"" + c[3] + "\"" + (c[0] === current ? " aria-current=\"page\"" : "") + ">" + esc(c[1]) + (c[2] !== null && c[2] !== undefined ? "<span>" + c[2] + "</span>" : "") + "</a>";
    }).join("") + "</nav>";
  }
  function cardHead(title, href) {
    return "<div class=\"card-head\"><h2>" + title + "</h2>" + (href ? "<a class=\"more\" href=\"" + href + "\">" + t("all_link") + icon("chevron") + "</a>" : "") + "</div>";
  }
  function bar(pct) {
    const level = pct < 40 ? " bar--low" : pct < 75 ? " bar--mid" : "";
    return "<span class=\"bar" + level + "\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + pct + "\"><i style=\"width:" + pct + "%\"></i></span>";
  }
  function mini(label, pct) { return "<span class=\"mini\"><span class=\"mini-top\"><span>" + label + "</span><b>" + pct + "%</b></span>" + bar(pct) + "</span>"; }
  function initials(name) { return name.split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase(); }
  function num(x) { return x.toLocaleString(LOCALES[state.lang], { maximumFractionDigits: 1 }); }
  function num1(x) { return x.toLocaleString(LOCALES[state.lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  /* ---------- оценки и прогресс ---------- */
  const KINDS = ["hw", "exam", "mock"];
  function kindOf(h) { return KINDS.indexOf(h.kind) >= 0 ? h.kind : "hw"; }
  function myHw() { return state.homework.filter(function (h) { return h.student === "me"; }).concat(role === "student" ? examsOf(studentCourses()) : []); }
  function queue() { return state.homework.filter(function (h) { return h.status === "review"; }).concat(role === "teacher" ? examsOf(teacherCourses()).filter(function (h) { return h.status === "review"; }) : []); }
  function progress() {
    let done = 0, total = 0;
    studentCourses().forEach(function (c) { const p = courseProgress(c); done += p.done; total += p.total; });
    return { done: done, total: total };
  }
  function strip(done, total) {
    let cells = "";
    for (let i = 0; i < total; i++) cells += "<i" + (i < done ? " class=\"on\"" : "") + "></i>";
    return "<div class=\"strip\" role=\"img\" aria-label=\"" + done + " / " + total + "\">" + cells + "</div>";
  }
  function gradeRows() {
    const rows = state.gradeLog.slice();
    myHw().forEach(function (h) {
      if (h.status === "graded") rows.push({ date: h.gradedAt, course: h.course, title: h.title, grade: h.grade, comment: h.comment });
    });
    Object.keys(state.results).forEach(function (id) {
      const hit = findLesson(id), r = state.results[id];
      if (hit && r.total && hit.lesson.kind !== "exam") rows.push({ date: r.date, course: hit.course.subject, title: hit.lesson.title || t("untitled"), grade: r.score + "/" + r.total, comment: "" });
    });
    return rows.sort(function (a, b) { return b.date.localeCompare(a.date); });
  }
  function average(rows) {
    const nums = rows.filter(function (r) { return typeof r.grade === "number"; });
    if (!nums.length) return "–";
    const sum = nums.reduce(function (acc, r) { return acc + r.grade; }, 0);
    return (sum / nums.length).toLocaleString(LOCALES[state.lang], { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  }

  /* ---------- экраны: ученик ---------- */
  function homeStudent() {
    const todo = myHw().filter(function (h) { return h.status === "todo"; }).sort(function (a, b) { return a.due.localeCompare(b.due); });
    const next = nextLessons(3);
    const first = next[0];
    const nextValue = first ? (first.status === "today" ? first.time : shortDate(first.day) + ", " + first.time) : "–";
    const action = first && first.status === "today" ? "<a class=\"btn btn--red\" href=\"" + go("lesson") + "\">" + t("join_lesson") + "</a>" : "";
    const subjects = Object.keys(COURSES).map(function (k) {
      let done = 0, total = 0;
      studentCourses().forEach(function (c) { if (c.subject === k) { const p = courseProgress(c); done += p.done; total += p.total; } });
      return "<li><a class=\"prow\" href=\"" + go("courses", k) + "\"><span class=\"prow-name\">" + esc(COURSES[k].name) + "</span>" + mini(t("materials_short"), total ? Math.round(done / total * 100) : 0) + mini(t("hw_short"), hwProgress(k).percent) + "</a></li>";
    }).join("");
    const deadlines = todo.length ? "<ul class=\"list\">" + todo.map(function (h) {
      return "<li><a class=\"grow\" href=\"" + go("homework", h.course) + "\">" + esc(h.title) + "<br><span class=\"muted small\">" + esc(COURSES[h.course].name) + "</span></a><span class=\"tag tag--todo\">" + t("due") + ": " + dueLabel(h.due) + "</span></li>";
    }).join("") + "</ul>" : "<p class=\"empty\">" + t("no_deadlines") + "</p>";
    return head(t("good_day") + ", " + esc(me().name.split(" ")[0]) + "!", t("home_sub_student"), action) +
      stats([stat("schedule", "accent", nextValue, t("next_lesson_lc"), go("schedule")), stat("homework", "gold", todo.length, t("hw_todo").toLowerCase(), go("homework")),
        stat("star", "wine", average(gradeRows()), t("avg_lc"), go("grades")), stat("fire", "good", 12, t("days_row"))]) +
      "<div class=\"grid cols-2\"><section class=\"card\">" + cardHead(t("today_plan"), go("schedule")) + "<ul class=\"list\">" + next.map(lessonRow).join("") + "</ul></section>" +
      "<section class=\"card\">" + cardHead(t("deadlines"), go("homework")) + deadlines + "</section></div>" +
      "<section class=\"card\">" + cardHead(t("by_subject"), go("courses")) + "<ul class=\"prows\">" + subjects + "</ul></section>";
  }

  /* ---------- курсы: ученик ---------- */
  function mrow(href, kind, title, meta, right) {
    return "<li><a class=\"mrow\" href=\"" + href + "\"><span class=\"mrow-ico\">" + icon(kind) + "</span><span class=\"mrow-main\"><b>" + esc(title) + "</b><span>" + meta + "</span></span>" + right + "<span class=\"mrow-go\">" + icon("chevron") + "</span></a></li>";
  }
  function coverHtml(c) {
    const mark = { math: "∑", eng: "Aa", it: "Ciao" }[c.subject] || "";
    return "<span class=\"ccard-cover\"" + (c.cover ? " style=\"background-image:url('" + c.cover + "')\"" : "") + ">" + (c.cover ? "" : "<i aria-hidden=\"true\">" + mark + "</i>") + "</span>";
  }
  function viewCourses() {
    const list = studentCourses();
    const subj = COURSES[param] ? param : "";
    const shown = list.filter(function (c) { return !subj || c.subject === subj; });
    const subjects = Object.keys(COURSES).filter(function (k) { return list.some(function (c) { return c.subject === k; }); });
    const tabs = subjects.length > 1 ? chips([["", t("all"), list.length, go("courses")]].concat(subjects.map(function (k) {
      return [k, COURSES[k].short, list.filter(function (c) { return c.subject === k; }).length, go("courses", k)];
    })), subj) : "";
    const cards = shown.map(function (c) {
      const p = courseProgress(c);
      return "<a class=\"ccard\" href=\"" + go("course", c.id) + "\">" + coverHtml(c) + "<span class=\"ccard-body\"><span class=\"tag\">" + esc(COURSES[c.subject].short) + "</span><b>" + esc(c.title || t("untitled")) + "</b><span class=\"muted small\">" + t("teacher_of") + ": " + esc(TEACHERS[c.owner] ? TEACHERS[c.owner].name : "") + "</span>" +
        "<span class=\"ccard-progress\"><span>" + p.done + " " + t("of") + " " + lessonsWord(p.total) + "</span><b>" + p.pct + "%</b></span>" + bar(p.pct) + "</span></a>";
    }).join("");
    return head(t("my_courses"), t("courses_sub")) + tabs + (cards ? "<div class=\"cgrid\">" + cards + "</div>" : "<section class=\"card\"><p class=\"empty\">" + t("no_student_courses") + "</p></section>");
  }
  function outlineRows(c, rowFn) {
    let html = "", open = false;
    c.items.forEach(function (it) {
      if (it.type === "module") {
        if (open) html += "</ul>";
        html += "<h3 class=\"omod\">" + icon("module") + esc(it.title || t("untitled")) + "</h3><ul class=\"mlist\">";
        open = true;
      } else {
        if (!open) { html += "<ul class=\"mlist\">"; open = true; }
        html += rowFn(it);
      }
    });
    return html + (open ? "</ul>" : "");
  }
  function lessonMeta(l) {
    if (l.kind === "webinar") return t("c_webinar") + " · " + shortDate(parse(l.date || iso(day(0)))) + ", " + esc(l.time || "") + " · " + esc(l.dur || 45) + " " + t("min");
    if (l.kind === "exam") return t("kind_" + (KINDS.indexOf(l.hwKind) >= 0 ? l.hwKind : "hw")) + " · " + t("due") + ": " + dueLabel(l.due || iso(day(0))) + " · " + blocksOf(l).filter(function (bl) { return TASK_TYPES.indexOf(bl.type) >= 0; }).length + " " + t("tasks_n");
    const tasks = blocksOf(l).filter(function (bl) { return TASK_TYPES.indexOf(bl.type) >= 0; }).length;
    const video = blocksOf(l).filter(function (bl) { return bl.type === "video" && bl.dur; })[0];
    return t(KIND_ICON[l.kind] || "c_lesson") + (video ? " · " + Math.round(video.dur / 60) + " " + t("min") : "") + (tasks ? " · " + tasks + " " + t("tasks_n") : "") + (l.pages.length > 1 ? " · " + l.pages.length + " " + t("pages_n") : "");
  }
  function viewCourse() {
    const c = findCourse(param);
    if (!c || studentCourses().indexOf(c) < 0) { param = COURSES[param] ? param : ""; return viewCourses(); }
    const p = courseProgress(c);
    const rows = outlineRows(c, function (l) {
      const r = state.results[l.id];
      const tag = r && r.total ? "<span class=\"tag tag--good\">" + r.score + "/" + r.total + "</span>" : "<span class=\"tag" + (isDone(l.id) ? " tag--done" : "") + "\">" + t(isDone(l.id) ? "st_done" : "st_new_lesson") + "</span>";
      let tg = tag;
      if (l.kind === "exam") { const e = examEntry(c, l); tg = e.status === "graded" ? "<span class=\"tag tag--good\">" + e.grade + "</span>" : e.status === "review" ? "<span class=\"tag\">" + t("hw_review") + "</span>" : "<span class=\"tag tag--todo\">" + t("due") + ": " + dueLabel(e.due) + "</span>"; }
      if (l.kind === "webinar") { const ws = webinarState(l); tg = ws === "past" ? "<span class=\"tag" + (isDone(l.id) ? " tag--done" : "") + "\">" + t(isDone(l.id) ? "st_done" : "w_past") + "</span>" : "<span class=\"tag tag--todo\">" + (ws === "upcoming" ? shortDate(parse(l.date)) + ", " + esc(l.time) : t(ws === "live" ? "w_live" : "w_today")) + "</span>"; }
      return mrow(go("learn", l.id), kindIco(l), l.title || t("untitled"), lessonMeta(l), tg).replace("class=\"mrow-ico\"", "class=\"mrow-ico mrow-ico--" + l.kind + "\"");
    });
    return "<a class=\"back\" href=\"" + go("courses") + "\">" + t("back") + "</a>" +
      "<section class=\"chero chero--student\">" + coverHtml(c) + "<div class=\"chero-text\"><span class=\"tag\">" + esc(COURSES[c.subject].name) + "</span><h1 class=\"title\">" + esc(c.title || t("untitled")) + "</h1>" + (c.desc ? "<p class=\"phead-sub\">" + esc(c.desc) + "</p>" : "") + "<p class=\"muted small\">" + t("teacher_of") + ": " + esc(TEACHERS[c.owner] ? TEACHERS[c.owner].name : "") + "</p></div></section>" +
      "<section class=\"card\"><div class=\"course-top\"><div><h2>" + t("c_course") + "</h2><p class=\"muted small\">" + p.done + " " + t("of") + " " + p.total + " " + t("materials_done") + "</p></div><div class=\"course-pct\"><b>" + p.pct + "%</b>" + bar(p.pct) + "</div></div>" + (rows || "<p class=\"empty\">" + t("course_empty") + "</p>") + "</section>";
  }

  /* показ урока: ученик проходит, преподаватель смотрит в режиме просмотра */
  let retakeId = null;
  let previewResult = null;
  function paragraphs(text) {
    return String(text || "").split(/\n{2,}/).filter(function (s) { return s.trim(); }).map(function (s) { return "<p>" + esc(s).replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function embedUrl(url) {
    const u = String(url || "").trim();
    let m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return "https://www.youtube.com/embed/" + m[1];
    m = u.match(/rutube\.ru\/(?:video|play\/embed)\/([\da-f]{20,})/);
    if (m) return "https://rutube.ru/play/embed/" + m[1];
    m = u.match(/vk(?:video)?\.(?:com|ru)\/(?:.*[?&]z=)?video(-?\d+)_(\d+)/);
    if (m) return "https://vk.com/video_ext.php?oid=" + m[1] + "&id=" + m[2];
    m = u.match(/vk\.com\/video_ext\.php\?[^"'\s]+/);
    if (m) return "https://" + m[0];
    return "";
  }
  function playerHtml(bl) {
    video.time = 0; video.duration = bl.dur || 900;
    return "<div class=\"player\" oncontextmenu=\"return false\"><span>" + esc(bl.title || t("video_demo_n")) + "</span></div>" +
      "<div class=\"controls\"><button class=\"btn btn--red btn--sm\" id=\"vid-play\" type=\"button\" data-act=\"play\">" + t("play") + "</button>" +
      "<input id=\"vid-range\" type=\"range\" min=\"0\" max=\"" + video.duration + "\" value=\"0\" data-change=\"seek\" aria-label=\"" + t("video") + "\">" +
      "<span class=\"time-mono\" id=\"vid-time\">0:00 / " + clock(video.duration) + "</span>" +
      "<label class=\"row small\">" + t("speed") + " <select id=\"vid-speed\" data-change=\"speed\">" + [0.75, 1, 1.25, 1.5, 2].map(function (s) { return "<option value=\"" + s + "\"" + (s === video.speed ? " selected" : "") + ">" + s + "×</option>"; }).join("") + "</select></label></div>" +
      "<p class=\"muted small\">" + t("video_demo") + "</p>";
  }
  function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, ""); }
  function blockView(bl, ctx) {
    const r = ctx.result, ans = r && r.answers ? r.answers[bl.id] : undefined;
    if (bl.type === "text") return bl.text ? "<div class=\"note-text lblock\">" + paragraphs(bl.text) + "</div>" : "";
    if (bl.type === "tip") return bl.text ? "<div class=\"ltip lblock\">" + icon("b_tip") + "<div>" + paragraphs(bl.text) + "</div></div>" : "";
    if (bl.type === "video") {
      const src = embedUrl(bl.url);
      if (src) return "<div class=\"lvideo lblock\"><iframe src=\"" + esc(src) + "\" title=\"" + esc(t("video")) + "\" allow=\"autoplay; encrypted-media; fullscreen; picture-in-picture\" allowfullscreen loading=\"lazy\"></iframe></div>";
      if (bl.url) return "<p class=\"lblock\"><a href=\"" + esc(bl.url) + "\" target=\"_blank\" rel=\"noopener\">" + t("video") + ": " + esc(bl.url) + "</a></p>";
      if (bl.dur && !ctx.player) { ctx.player = true; return "<div class=\"lblock\">" + playerHtml(bl) + "</div>"; }
      return "";
    }
    if (bl.type === "image") return bl.src ? "<figure class=\"limage lblock\"><img src=\"" + bl.src + "\" alt=\"" + esc(bl.caption || "") + "\">" + (bl.caption ? "<figcaption class=\"muted small\">" + esc(bl.caption) + "</figcaption>" : "") + "</figure>" : "";
    if (bl.type === "file") return bl.name ? "<div class=\"lfile lblock\"><span class=\"mrow-ico\">" + icon("note") + "</span><span class=\"mrow-main\"><b>" + esc(bl.name) + "</b><span>" + t("file") + "</span></span></div>" : "";
    const qh = "<h3>" + (ctx.n = (ctx.n || 0) + 1) + ". " + esc(bl.q || t("ph_q")) + "</h3>";
    if (bl.type === "test") {
      const multi = bl.correct.length > 1;
      if (r) {
        const chosen = Array.isArray(ans) ? ans : [];
        return "<div class=\"q lblock\">" + qh + "<ul class=\"opts-result\">" + bl.options.map(function (o, j) {
          const picked = chosen.indexOf(j) >= 0, right = bl.correct.indexOf(j) >= 0;
          const cls = bl.correct.length ? (right ? " is-right" : picked ? " is-wrong" : "") : "";
          return "<li class=\"" + cls + (picked ? " is-picked" : "") + "\">" + (picked ? "● " : "○ ") + esc(o) + "</li>";
        }).join("") + "</ul>" + (bl.correct.length ? "" : "<p class=\"muted small\">" + t("poll") + "</p>") + "</div>";
      }
      return "<fieldset class=\"q lblock\">" + qh + (multi ? "<p class=\"muted small\">" + t("pick_all") + "</p>" : "") + bl.options.map(function (o, j) {
        return "<label><input type=\"" + (multi ? "checkbox" : "radio") + "\" name=\"" + bl.id + (multi ? "_" + j : "") + "\" value=\"" + j + "\">" + esc(o) + "</label>";
      }).join("") + "</fieldset>";
    }
    if (bl.type === "input") {
      if (r) {
        const ok = (String(bl.answer || "").split(";").map(norm).filter(Boolean)).indexOf(norm(ans)) >= 0;
        return "<div class=\"q lblock\">" + qh + "<p class=\"" + (ok ? "right" : "wrong") + "\">" + t("your_answer") + ": " + esc(ans || t("no_answer")) + "</p>" + (ok ? "" : "<p>" + t("correct_answer") + ": " + esc(String(bl.answer).split(";")[0].trim()) + "</p>") + "</div>";
      }
      return "<div class=\"q lblock\">" + qh + "<input type=\"text\" name=\"" + bl.id + "\" aria-label=\"" + esc(bl.q || t("ph_q")) + "\" autocomplete=\"off\"></div>";
    }
    if (bl.type === "open") {
      if (r) return "<div class=\"q lblock\">" + qh + "<p class=\"open-answer\">" + esc(ans || t("no_answer")) + "</p><p class=\"muted small\">" + t("open_saved") + "</p></div>";
      return "<div class=\"q lblock\">" + qh + "<textarea name=\"" + bl.id + "\" aria-label=\"" + esc(bl.q || t("ph_q")) + "\"></textarea></div>";
    }
    return "";
  }
  function lessonPlayer(hit, preview) {
    const l = hit.lesson;
    if (l.kind === "webinar") return webinarView(hit, preview);
    const r = preview ? previewResult : (retakeId === l.id ? null : state.results[l.id]);
    const backHref = preview ? go("build", l.id) : go("course", hit.course.id);
    const top = "<a class=\"back\" href=\"" + backHref + "\">" + (preview ? t("back_editor") : t("back")) + "</a>" + (preview ? "<p class=\"preview-note\">" + t("preview_note") + "</p>" : "") +
      "<div class=\"phead-text\"><span class=\"kind-badge kind-badge--" + l.kind + "\">" + t(l.kind === "exam" ? "kind_" + (KINDS.indexOf(l.hwKind) >= 0 ? l.hwKind : "hw") : KIND_ICON[l.kind] || "c_lesson") + "</span><h1 class=\"title\">" + esc(l.title || t("untitled")) + "</h1>" + (l.desc ? "<p class=\"phead-sub\">" + esc(l.desc) + "</p>" : "") +
      (l.kind === "exam" ? "<p class=\"muted small\">" + t("ex_due") + ": " + dueLabel(l.due || iso(day(0))) + " · " + t("ex_pass") + ": " + esc(l.pass || 0) + "%</p>" : "") + "</div>";
    const graded = gradedBlocks(l).length;
    const hasTasks = blocksOf(l).some(function (bl) { return TASK_TYPES.indexOf(bl.type) >= 0; });
    const ctx = { result: r };
    if (r) {
      const list = lessonsOf(hit.course), next = list[list.indexOf(l) + 1];
      const pages = l.pages.map(function (p) { return "<section class=\"card lpage\">" + (p.title ? "<h2>" + esc(p.title) + "</h2>" : "") + p.blocks.map(function (bl) { return blockView(bl, ctx); }).join("") + "</section>"; }).join("");
      const exam = l.kind === "exam", pct = r.total ? Math.round(r.score / r.total * 100) : 0, passed = pct >= Number(l.pass || 0);
      const examInfo = exam ? (r.total ? "<p class=\"ex-verdict ex-verdict--" + (passed ? "ok" : "no") + "\">" + t(passed ? "ex_passed" : "ex_failed") + ": " + pct + "% (" + t("ex_need") + " " + esc(l.pass || 0) + "%)</p>" : "") +
        (r.teacherGrade ? "<p>" + t("ex_final") + ": <span class=\"cell\">" + r.teacherGrade + "</span> " + esc(r.comment || "") + "</p>" : r.open ? "<p class=\"muted small\">" + t("ex_review") + "</p>" : "") : "";
      return top + "<section class=\"card lresult\"><h2>" + t("lesson_done") + "</h2>" + (r.total ? "<span class=\"big\">" + r.score + " " + t("of") + " " + r.total + "</span>" : "") + examInfo + "<div class=\"row\">" + (exam && !preview ? "" : "<button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"retake\" data-id=\"" + l.id + "\">" + t("retake") + "</button>") + (next && !preview ? "<a class=\"btn btn--red btn--sm\" href=\"" + go("learn", next.id) + "\">" + t("next_lesson") + "</a>" : "") + "</div></section>" + pages;
    }
    const many = l.pages.length > 1;
    const pages = l.pages.map(function (p, i) {
      const nav = many ? "<div class=\"lnav\">" + (i ? "<button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"lessonStep\" data-id=\"" + (i - 1) + "\">" + t("l_prev") + "</button>" : "<span></span>") +
        (i < l.pages.length - 1 ? "<button class=\"btn btn--red btn--sm\" type=\"button\" data-act=\"lessonStep\" data-id=\"" + (i + 1) + "\">" + t("l_next") + "</button>" : "") + "</div>" : "";
      const body = p.blocks.map(function (bl) { return blockView(bl, ctx); }).join("");
      return "<section class=\"card lpage\" data-step=\"" + i + "\"" + (i ? " hidden" : "") + ">" + (many ? "<p class=\"lstep muted small\">" + t("page_of") + " " + (i + 1) + " " + t("of") + " " + l.pages.length + "</p>" : "") + (p.title ? "<h2>" + esc(p.title) + "</h2>" : "") + (body || "<p class=\"empty\">" + t("page_empty_st") + "</p>") + nav + "</section>";
    }).join("");
    const finish = hasTasks || preview
      ? "<p class=\"auth-error\" id=\"lesson-error\" role=\"alert\" hidden></p><button class=\"btn btn--red\" type=\"submit\">" + t(graded ? "check_answers" : "finish_lesson") + "</button>"
      : doneButton(l.id);
    return top + "<form class=\"lform\" data-form=\"lesson\" data-id=\"" + l.id + "\"" + (preview ? " data-preview=\"1\"" : "") + ">" + pages + "<div class=\"lfinish\"" + (many ? " hidden" : "") + ">" + finish + "</div></form>";
  }

  function webinarView(hit, preview) {
    const l = hit.lesson, st = webinarState(l), j = joinLink(l), start = webinarStart(l);
    const back = "<a class=\"back\" href=\"" + (preview ? go("build", l.id) : go("course", hit.course.id)) + "\">" + (preview ? t("back_editor") : t("back")) + "</a>" + (preview ? "<p class=\"preview-note\">" + t("preview_note") + "</p>" : "");
    const head2 = "<div class=\"phead-text\"><span class=\"kind-badge kind-badge--webinar\">" + t("c_webinar") + "</span><h1 class=\"title\">" + esc(l.title || t("w_untitled")) + "</h1>" + (l.desc ? "<p class=\"phead-sub\">" + esc(l.desc) + "</p>" : "") + "</div>";
    const src = embedUrl(l.url);
    const stateTag = { live: "<span class=\"tag tag--todo\">" + t("w_live") + "</span>", today: "<span class=\"tag tag--todo\">" + t("w_today") + "</span>", past: "<span class=\"tag\">" + t("w_past") + "</span>", upcoming: "" }[st];
    let action = "";
    if (st === "past") action = src ? "<h2>" + t("w_record") + "</h2><div class=\"lvideo\"><iframe src=\"" + esc(src) + "\" title=\"" + esc(t("w_record")) + "\" allow=\"autoplay; encrypted-media; fullscreen; picture-in-picture\" allowfullscreen loading=\"lazy\"></iframe></div>" : l.url ? "<a href=\"" + esc(l.url) + "\" target=\"_blank\" rel=\"noopener\">" + t("w_record") + "</a>" : "";
    else if (st === "upcoming") action = "<p class=\"muted\">" + t("w_soon") + "</p>";
    else action = j ? "<div><a class=\"btn btn--red\" href=\"" + esc(j.href) + "\"" + (j.ext ? " target=\"_blank\" rel=\"noopener\"" : "") + ">" + t("w_join") + "</a></div>" : "<p class=\"muted\">" + t("w_no_link") + "</p>";
    const facts = "<div class=\"wfacts\"><span>" + icon("schedule") + date(start, { weekday: "long", day: "numeric", month: "long" }) + ", " + esc(l.time) + "</span><span>" + icon("clock") + esc(l.dur || 45) + " " + t("min") + "</span><span>" + icon("users") + esc(TEACHERS[hit.course.owner] ? TEACHERS[hit.course.owner].name : "") + "</span>" + stateTag + "</div>";
    return back + head2 + "<section class=\"card wview\">" + facts + action + (preview || st === "upcoming" ? "" : "<div>" + doneButton(l.id) + "</div>") + "</section>";
  }
  function viewLearn() {
    const hit = findLesson(param);
    if (!hit || studentCourses().indexOf(hit.course) < 0) { param = ""; return viewCourses(); }
    return lessonPlayer(hit, false);
  }

  function doneButton(id) {
    return "<button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"toggleDone\" data-id=\"" + id + "\">" + t(state.done.indexOf(id) >= 0 ? "unmark_done" : "mark_done") + "</button>";
  }
  function clock(sec) { return Math.floor(sec / 60) + ":" + String(Math.floor(sec % 60)).padStart(2, "0"); }

  const video = { timer: null, time: 0, speed: 1, duration: 0 };
  function stopVideo() { clearInterval(video.timer); video.timer = null; }

  function hwStatus(h) {
    const cls = { todo: "tag--todo", review: "", graded: "tag--good" }[h.status];
    return "<span class=\"tag " + cls + "\">" + t("hw_" + h.status) + "</span>";
  }
  function hwProgress(course) {
    const items = myHw().filter(function (h) { return h.course === course; });
    const handed = items.filter(function (h) { return h.status !== "todo"; }).length;
    return { todo: items.length - handed, percent: items.length ? Math.round(handed / items.length * 100) : 0 };
  }
  function hwBar(p) {
    const level = p.percent < 40 ? " bar--low" : p.percent < 75 ? " bar--mid" : "";
    return "<div class=\"hw-meta\"><span>" + t("hw_on_course") + "</span><b>" + p.percent + "%</b></div><div class=\"bar" + level + "\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + p.percent + "\" aria-label=\"" + t("hw_on_course") + "\"><i style=\"width:" + p.percent + "%\"></i></div>";
  }
  function viewHomework() {
    const all = myHw();
    const focus = find(all, param);
    const filter = focus ? focus.course : COURSES[param] ? param : "";
    const order = { todo: 0, review: 1, graded: 2 };
    const count = function (st) { return all.filter(function (h) { return h.status === st; }).length; };
    const todoIn = function (k) { return all.filter(function (h) { return (!k || h.course === k) && h.status === "todo"; }).length; };
    const tabs = chips([["", t("all"), todoIn(""), go("homework")]].concat(Object.keys(COURSES).map(function (k) { return [k, COURSES[k].short, todoIn(k), go("homework", k)]; })), filter);
    const items = all.filter(function (h) { return !filter || h.course === filter; }).sort(function (a, b) { return order[a.status] - order[b.status] || a.due.localeCompare(b.due); });
    const rows = items.map(function (h) {
      const main = "<span class=\"hrow-main\"><b>" + esc(h.title) + "</b><span>" + esc(COURSES[h.course].short) + (kindOf(h) !== "hw" ? " · " + t("kind_" + kindOf(h)) : "") + " · " + t("due") + ": " + dueLabel(h.due) + "</span></span>";
      if (h.status === "todo" && h.lesson) {
        return "<li><a class=\"hrow hrow--todo hrow--link" + (focus === h ? " hrow--focus" : "") + "\" href=\"" + go("learn", h.lesson) + "\">" + main + "<span class=\"btn btn--red btn--sm\">" + t("do_task") + "</span></a></li>";
      }
      if (h.status === "todo") {
        return "<li><details class=\"hrow hrow--todo" + (focus === h ? " hrow--focus\" open" : "\"") + "><summary>" + main + "<span class=\"btn btn--red btn--sm\">" + t("submit_hw") + "</span></summary>" +
          "<form class=\"form hrow-form\" data-form=\"submitHw\" data-id=\"" + h.id + "\"><div class=\"field\"><label for=\"file-" + h.id + "\">" + t("attach") + "</label><input id=\"file-" + h.id + "\" name=\"file\" type=\"file\" accept=\"image/*,.pdf,.doc,.docx\" required></div><div><button class=\"btn btn--red btn--sm\" type=\"submit\">" + t("submit_hw") + "</button></div></form></details></li>";
      }
      if (h.status === "review") {
        return "<li><div class=\"hrow\">" + main + "<span class=\"tag\">" + t("hw_review") + "</span><span class=\"muted small hrow-file\">" + esc(h.lesson ? t("answers_sent") : h.file ? h.file.name : "–") + "</span></div></li>";
      }
      return "<li><div class=\"hrow hrow--graded\">" + main + "<span class=\"hrow-comment hand\">" + esc(h.comment) + "</span><span class=\"cell\">" + esc(h.grade) + "</span></div></li>";
    }).join("");
    return head(t("nav_hw"), t("hw_sub")) +
      stats([stat("homework", "gold", count("todo"), t("hw_todo").toLowerCase()), stat("clock", "accent", count("review"), t("hw_review").toLowerCase()), stat("review", "good", count("graded"), t("hw_graded").toLowerCase())]) +
      tabs + "<section class=\"card\">" + (rows ? "<ul class=\"hlist\">" + rows + "</ul>" : "<p class=\"empty\">" + t("no_hw") + "</p>") + "</section>";
  }

  function gradesTable(rows) {
    return "<div class=\"tbl-wrap\"><table><thead><tr><th>" + t("date") + "</th><th>" + t("subject") + "</th><th>" + t("work") + "</th><th>" + t("grade") + "</th><th>" + t("comment") + "</th></tr></thead><tbody>" + rows.map(function (r) {
      return "<tr><td class=\"nowrap\">" + shortDate(parse(r.date)) + "</td><td class=\"nowrap\">" + esc(COURSES[r.course].short) + "</td><td>" + esc(r.title) + "</td><td class=\"nowrap\"><b>" + esc(r.grade) + "</b></td><td>" + esc(r.comment) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  }
  function viewGrades() {
    const rows = gradeRows();
    const hw = myHw();
    const handed = hw.length ? Math.round(hw.filter(function (h) { return h.status !== "todo"; }).length / hw.length * 100) : 0;
    const subjects = Object.keys(COURSES).map(function (k) {
      const mine = rows.filter(function (r) { return r.course === k; });
      return "<li><span class=\"sub-name\"><b>" + esc(COURSES[k].name) + "</b><span>" + t("grades_list") + ": " + mine.length + "</span></span><span class=\"sub-avg\">" + average(mine) + "</span>" + mini(t("hw_short"), hwProgress(k).percent) + "</li>";
    }).join("");
    return head(t("nav_grades"), t("grades_sub"), "<a class=\"btn btn--red\" href=\"" + go("report") + "\">" + t("make_report") + "</a>") +
      stats([stat("star", "wine", average(rows), t("avg_lc")), stat("schedule", "accent", attendance(30) + "%", t("attendance_30")), stat("homework", "gold", handed + "%", t("hw_handed")), stat("grades", "good", rows.length, t("grades_n"))]) +
      "<div class=\"grid side-main\"><section class=\"card\"><h2>" + t("by_subject") + "</h2><ul class=\"subs\">" + subjects + "</ul></section>" +
      "<section class=\"card\"><h2>" + t("grades_list") + "</h2>" + gradesTable(rows) + "</section></div>";
  }

  let reportDays = 30;
  function viewReport() {
    const from = iso(day(-reportDays));
    const rows = gradeRows().filter(function (r) { return r.date >= from; });
    return "<div class=\"row between no-print\"><a class=\"back\" href=\"" + go("grades") + "\">" + t("back") + "</a><div class=\"row\"><label class=\"row small\">" + t("period") + " <select id=\"report-days\" style=\"width:auto\" data-change=\"reportDays\"><option value=\"30\"" + (reportDays === 30 ? " selected" : "") + ">" + t("days_30") + "</option><option value=\"90\"" + (reportDays === 90 ? " selected" : "") + ">" + t("days_90") + "</option></select></label><button class=\"btn btn--red\" type=\"button\" data-act=\"print\">" + t("save_pdf") + "</button></div></div>" +
      "<p class=\"muted small no-print\">" + t("report_hint") + "</p>" +
      "<article class=\"doc\"><span class=\"logo\">" + LOGO + "</span><h2>" + t("report_title") + "</h2><dl><dt>" + t("student_name") + "</dt><dd>" + esc(PEOPLE.student.name) + "</dd><dt>" + t("period") + "</dt><dd>" + shortDate(day(-reportDays)) + " – " + shortDate(day(0)) + "</dd><dt>" + t("attendance") + "</dt><dd>" + attendance(reportDays) + "%</dd><dt>" + t("avg") + "</dt><dd>" + average(rows) + "</dd></dl><h3>" + t("last_grades") + "</h3>" + gradesTable(rows.slice(0, 10)) + "</article>";
  }

  /* ---------- экраны: новый ученик до оплаты ---------- */
  function saveAccount() {
    const all = load(ACCOUNTS_KEY) || {};
    all[account.email] = account;
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function mySubjects() { return account.subjects.filter(function (id) { return CATALOG.subject(id); }); }
  function diagDone() { return mySubjects().filter(function (id) { return account.diag[id]; }).length; }
  function diagReady() { return diagDone() === mySubjects().length; }
  function groupTitle(id) { return CATALOG.groups.filter(function (g) { return g.id === id; })[0].title; }

  function homeNew() {
    const done = diagDone(), total = mySubjects().length;
    const rows = mySubjects().map(function (id) {
      const s = CATALOG.subject(id), r = account.diag[id];
      const action = r
        ? "<a class=\"tag tag--good\" href=\"" + go("diag", id) + "\">" + t("diag_level") + ": " + esc(r.level) + "</a>"
        : "<a class=\"btn btn--red btn--sm\" href=\"" + go("diag", id) + "\">" + t("diag_start") + "</a>";
      return "<li><span class=\"grow\">" + esc(s.name) + "<br><span class=\"muted small\">" + esc(groupTitle(s.group)) + "</span></span>" + action + "</li>";
    }).join("");
    return head(t("hello") + ", " + esc(me().name.split(" ")[0]) + "!", t("diag_title")) +
      "<div class=\"grid main-side\">" +
      "<section class=\"card\"><h2>" + t("diag_title") + "</h2><p class=\"muted\">" + t("diag_intro") + "</p><ul class=\"list\">" + rows + "</ul></section>" +
      "<section class=\"card\"><h2>" + t("pkg_title") + "</h2><span class=\"big\">" + done + " " + t("of") + " " + total + "</span><p class=\"muted small\">" + t("diag_passed") + "</p>" + strip(done, total) +
      "<p>" + t(diagReady() ? "pkg_ready" : "pkg_locked") + "</p>" + (diagReady() ? "<div><a class=\"btn btn--red\" href=\"" + go("plans") + "\">" + t("pkg_choose") + "</a></div>" : "") + "</section></div>";
  }

  function viewDiag() {
    const s = CATALOG.subject(param);
    if (!s || mySubjects().indexOf(s.id) < 0) return homeNew();
    const head = "<a class=\"back\" href=\"" + go("dashboard") + "\">" + t("back") + "</a><h1 class=\"title\">" + t("diag_title") + ": " + esc(s.name) + "</h1>";
    const r = account.diag[s.id];
    if (r) {
      return head + "<section class=\"card\"><h2>" + t("diag_level") + "</h2><span class=\"big\">" + esc(r.level) + "</span><p class=\"muted\">" + t("diag_score") + ": " + r.score + " " + t("of") + " " + r.total + "</p><p class=\"muted small\">" + t("diag_note") + "</p><div><a class=\"btn btn--red\" href=\"" + go("dashboard") + "\">" + t("to_home") + "</a></div></section>";
    }
    const questions = s.questions.map(function (q, i) {
      return "<fieldset class=\"q\" style=\"border:0;margin:0;padding-inline:0\"><h3>" + (i + 1) + ". " + esc(q.q) + "</h3>" + q.options.map(function (o, j) {
        return "<label><input type=\"radio\" name=\"q" + i + "\" value=\"" + j + "\">" + esc(o) + "</label>";
      }).join("") + "</fieldset>";
    }).join("");
    return head + "<section class=\"card\"><p class=\"muted\">" + t("diag_hint") + "</p><form class=\"form\" data-form=\"diag\" data-id=\"" + s.id + "\">" + questions + "<p class=\"auth-error\" id=\"test-error\" role=\"alert\" hidden>" + t("answer_all") + "</p><button class=\"btn btn--red\" type=\"submit\">" + t("diag_finish") + "</button></form></section>";
  }

  function viewPlans() {
    if (!diagReady()) return homeNew();
    const levels = mySubjects().map(function (id) { return esc(CATALOG.subject(id).name) + ": <b>" + esc(account.diag[id].level) + "</b>"; }).join(" · ");
    const cards = CATALOG.packages.map(function (p) {
      return "<section class=\"card\"><div class=\"row between\"><h2>" + esc(p.name) + "</h2>" + (p.main ? "<span class=\"tag tag--good\">" + t("pkg_main") + "</span>" : "") + "</div>" +
        "<p class=\"muted small\">" + esc(p.who) + "</p><p><b class=\"big\" style=\"font-size:1.625rem\">" + esc(p.price) + "</b> <span class=\"muted small\">" + t("per_month") + "</span></p>" +
        "<ul class=\"list\">" + p.items.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul>" +
        "<div><a class=\"btn " + (p.main ? "btn--red" : "btn--line") + "\" href=\"" + go("pay", p.id) + "\">" + t("pkg_pick") + "</a></div></section>";
    }).join("");
    return "<a class=\"back\" href=\"" + go("dashboard") + "\">" + t("back") + "</a><h1 class=\"title\">" + t("pkg_choose") + "</h1>" +
      "<p class=\"muted\">" + t("pkg_levels") + ": " + levels + "</p><div class=\"grid cols-3\">" + cards + "</div>";
  }

  function viewPay() {
    const p = CATALOG.pack(param);
    if (!p || !diagReady()) return homeNew();
    const subjects = mySubjects().map(function (id) { return esc(CATALOG.subject(id).name); }).join(", ");
    return "<a class=\"back\" href=\"" + go("plans") + "\">" + t("back") + "</a><h1 class=\"title\">" + t("pay_title") + "</h1>" +
      "<section class=\"card\" style=\"max-width:38rem\"><ul class=\"list\">" +
      "<li><span class=\"muted\">" + t("pkg_title") + "</span><b>" + esc(p.name) + "</b></li>" +
      "<li><span class=\"muted\">" + t("pay_subjects") + "</span><b>" + subjects + "</b></li>" +
      "<li><span class=\"muted\">" + t("pay_price") + "</span><b>" + esc(p.price) + " " + t("per_month") + "</b></li></ul>" +
      "<p class=\"demo-box\">" + t("pay_demo") + "</p><div><button class=\"btn btn--red\" type=\"button\" data-act=\"pay\" data-id=\"" + p.id + "\">" + t("pay_button") + "</button></div></section>";
  }

  /* ---------- экраны: преподаватель ---------- */
  function monthStats() {
    const now = day(0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    let held = 0, planned = 0;
    for (let d = new Date(now.getFullYear(), now.getMonth(), 1); d <= end; d.setDate(d.getDate() + 1)) {
      const n = lessonsOn(new Date(d)).length;
      if (d < now) held += n; else planned += n;
    }
    const graded = state.homework.filter(function (h) { return h.status === "graded" && h.gradedAt; });
    const speed = graded.length ? graded.reduce(function (acc, h) { return acc + Math.abs(parse(h.gradedAt) - parse(h.due)) / 864e5; }, 0) / graded.length : 0;
    return { held: held, planned: planned, hours: held * 1.5, speed: speed };
  }
  function openTasks() {
    const from = iso(day(0)), seen = {};
    state.homework.forEach(function (h) { if (h.due >= from) seen[h.course + "|" + h.title] = true; });
    return Object.keys(seen).length;
  }
  function groupShort(id) { return GROUPS[id].name.split("· ")[1]; }
  function homeTeacher() {
    const today = lessonsOn(day(0));
    const q = queue();
    const m = monthStats();
    const cell = function (value, label) { return "<div class=\"month-cell\"><b>" + value + "</b><span>" + label + "</span></div>"; };
    const attention = q.map(function (h) {
      return "<li><a class=\"attn\" href=\"" + go("review", h.id) + "\"><span class=\"avatar avatar--sm\">" + initials(h.name) + "</span><span class=\"attn-main\"><b>" + esc(h.name) + "</b><span>" + t("check_work") + ": " + esc(h.title) + "</span></span><span class=\"tag tag--todo\">" + t("hw_review") + "</span></a></li>";
    }).concat(ROSTER.filter(function (st) { return st.lag; }).map(function (st) {
      return "<li><a class=\"attn\" href=\"" + go("progress", st.group) + "\"><span class=\"avatar avatar--sm\">" + initials(st.name) + "</span><span class=\"attn-main\"><b>" + esc(st.name) + "</b><span>" + esc(groupShort(st.group)) + " · " + t("attendance").toLowerCase() + " " + st.att + "%, " + t("hw_short") + " " + st.hwDone + "/" + st.hwTotal + "</span></span><span class=\"tag tag--missed\">" + t("lagging") + "</span></a></li>";
    })).slice(0, 6).join("");
    const groups = Object.keys(GROUPS).map(function (id) {
      const list = ROSTER.filter(function (st) { return st.group === id; });
      const hwPct = Math.round(list.reduce(function (acc, st) { return acc + st.hwDone / st.hwTotal; }, 0) / list.length * 100);
      let nextDate = "–";
      for (let i = 0; i < 14 && nextDate === "–"; i++) {
        const hit = lessonsOn(day(i)).filter(function (l) { return l.group === id; })[0];
        if (hit) nextDate = shortDate(hit.day) + ", " + hit.time;
      }
      return "<tr><td><a href=\"" + go("progress", id) + "\"><b>" + esc(groupShort(id)) + "</b></a></td><td class=\"nowrap\">" + list.length + "</td><td class=\"td-bar\">" + mini("", hwPct) + "</td><td class=\"nowrap\">" + nextDate + "</td></tr>";
    }).join("");
    return head(t("good_day") + ", " + esc(me().name.split(" ")[0]) + "!", t("home_sub_teacher"), "<a class=\"btn btn--red\" href=\"" + go("content") + "\">" + icon("plus") + t("create_task") + "</a>") +
      stats([stat("users", "wine", ROSTER.length, t("students_cap"), go("progress")), stat("schedule", "accent", today.length, t("lessons_today_lc"), go("schedule")),
        stat("review", "gold", q.length, t("to_review"), go("review")), stat("homework", "good", openTasks(), t("open_tasks"), go("content"))]) +
      "<section class=\"card\"><h2>" + t("my_month") + "</h2><div class=\"month\">" + cell(m.held, t("conducted")) + cell(num(m.hours), t("hours_n")) + cell(m.planned, t("planned")) + cell(m.speed ? num(m.speed) : "–", t("review_speed")) + "</div></section>" +
      "<div class=\"grid cols-2\"><section class=\"card\">" + cardHead(t("schedule_today"), go("schedule")) + "<ul class=\"list\">" + today.map(lessonRow).join("") + "</ul></section>" +
      "<section class=\"card\">" + cardHead(t("attention"), go("progress")) + (attention ? "<ul class=\"attn-list\">" + attention + "</ul>" : "<p class=\"empty\">" + t("all_good") + "</p>") + "</section></div>" +
      "<section class=\"card\">" + cardHead(t("groups"), go("progress")) + "<div class=\"tbl-wrap\"><table class=\"tbl-groups\"><thead><tr><th>" + t("group_col") + "</th><th>" + t("students_cap") + "</th><th>" + t("hw_col") + "</th><th>" + t("next_lesson") + "</th></tr></thead><tbody>" + groups + "</tbody></table></div></section>";
  }

  function viewProgress() {
    const g = GROUPS[param] ? param : "";
    const list = ROSTER.filter(function (st) { return !g || st.group === g; }).slice().sort(function (a, b) { return (b.lag - a.lag) || (b.avg - a.avg); });
    const mean = function (f) { return list.reduce(function (acc, st) { return acc + f(st); }, 0) / list.length; };
    const tabs = chips([["", t("all"), ROSTER.length, go("progress")]].concat(Object.keys(GROUPS).map(function (id) {
      return [id, groupShort(id), ROSTER.filter(function (st) { return st.group === id; }).length, go("progress", id)];
    })), g);
    const rows = list.map(function (st) {
      const hwPct = Math.round(st.hwDone / st.hwTotal * 100);
      const recent = st.recent.map(function (r) { return "<li><span class=\"muted small\">" + shortDate(day(-r[0])) + "</span><span>" + esc(r[1]) + "</span><span class=\"cell\">" + r[2] + "</span></li>"; }).join("");
      return "<details class=\"srow\"><summary><span class=\"srow-who\"><span class=\"avatar avatar--sm\">" + initials(st.name) + "</span><span><b>" + esc(st.name) + "</b><span>" + esc(groupShort(st.group)) + "</span></span></span>" +
        "<span class=\"srow-att\">" + st.att + "%</span><span class=\"srow-hw\">" + mini(st.hwDone + "/" + st.hwTotal, hwPct) + "</span><span class=\"srow-avg\">" + num1(st.avg) + "</span><span class=\"srow-last\"><span class=\"cell\">" + st.last + "</span></span>" +
        "<span class=\"tag " + (st.lag ? "tag--missed" : "tag--good") + "\">" + t(st.lag ? "lagging" : "on_track") + "</span></summary>" +
        "<div class=\"srow-more\"><div><h3>" + t("recent_grades") + "</h3><ul class=\"recent\">" + recent + "</ul></div><div class=\"srow-facts\"><p><span class=\"muted\">" + t("missed_n") + "</span><b>" + Math.round((100 - st.att) / 100 * 16) + "</b></p><p><span class=\"muted\">" + t("hw_col") + "</span><b>" + st.hwDone + " " + t("of") + " " + st.hwTotal + "</b></p></div></div></details>";
    }).join("");
    return head(t("nav_grades"), t("progress_sub")) + tabs +
      stats([stat("star", "wine", num1(mean(function (st) { return st.avg; })), t("avg_lc")), stat("schedule", "accent", Math.round(mean(function (st) { return st.att; })) + "%", t("avg_att")),
        stat("homework", "gold", Math.round(mean(function (st) { return st.hwDone / st.hwTotal; }) * 100) + "%", t("hw_handed")), stat("alert", "red", list.filter(function (st) { return st.lag; }).length, t("lagging_n"))]) +
      "<section class=\"card\"><div class=\"srows\"><div class=\"srow-head\"><span>" + t("student_col") + "</span><span>" + t("attendance") + "</span><span>" + t("hw_col") + "</span><span>" + t("avg_col") + "</span><span>" + t("last_col") + "</span><span>" + t("status_col") + "</span></div>" + rows + "</div></section>";
  }

  function viewReview() {
    const items = queue();
    const current = find(items, param) || items[0];
    const rows = items.map(function (h) {
      return "<li><a class=\"qrow\" href=\"" + go("review", h.id) + "\"" + (current && current.id === h.id ? " aria-current=\"true\"" : "") + "><span class=\"avatar avatar--sm\">" + initials(h.name) + "</span><span class=\"qrow-main\"><b>" + esc(h.name) + "</b><span>" + esc(h.title) + "</span><span>" + esc(COURSES[h.course].short) + " · " + dueLabel(h.due) + "</span></span></a></li>";
    }).join("");
    let detail = "<p class=\"empty\">" + t("queue_empty") + "</p>";
    if (current) {
      const f = current.file;
      let box = "";
      if (current.lesson) {
        const hit = findLesson(current.lesson), r = state.results[current.lesson];
        const pct = r.total ? Math.round(r.score / r.total * 100) : 0;
        box = "<div class=\"ex-answers\">" + (r.total ? "<p class=\"muted small\">" + t("auto_check") + ": " + r.score + " " + t("of") + " " + r.total + " (" + pct + "%, " + t("ex_need") + " " + esc(hit.lesson.pass || 0) + "%)</p>" : "") + "<h3>" + t("open_answers") + "</h3>" +
          blocksOf(hit.lesson).filter(function (bl) { return bl.type === "open"; }).map(function (bl) { return "<div class=\"q\"><h3>" + esc(bl.q || t("ph_q")) + "</h3><p class=\"open-answer\">" + esc(r.answers[bl.id] || t("no_answer")) + "</p></div>"; }).join("") + "</div>";
      }
      const preview = f && f.data ? "<img src=\"" + f.data + "\" alt=\"" + esc(f.name) + "\">" : f && f.fresh ? esc(f.name) : "<span>" + esc(f ? f.name : "") + "<br>" + t("no_file") + "</span>";
      detail = "<div class=\"review-who\"><span class=\"avatar\">" + initials(current.name) + "</span><div><h2>" + esc(current.title) + "</h2><p class=\"muted small\">" + esc(current.name) + " · " + esc(COURSES[current.course].name) + " · " + t("due") + ": " + dueLabel(current.due) + "</p></div></div>" + (box || "<div class=\"preview\">" + preview + "</div>") +
        "<form class=\"form\" data-form=\"grade\" data-id=\"" + current.id + "\"><div class=\"field\"><span>" + t("grade") + "</span><div class=\"grades-pick\">" + [2, 3, 4, 5].map(function (g) {
          return "<label><input type=\"radio\" name=\"grade\" value=\"" + g + "\" required" + (g === 5 ? " checked" : "") + "><span class=\"cell\">" + g + "</span></label>";
        }).join("") + "</div></div><div class=\"field\"><label for=\"review-comment\">" + t("comment") + "</label><textarea id=\"review-comment\" name=\"comment\" required></textarea></div><div><button class=\"btn btn--red\" type=\"submit\">" + t("save_grade") + "</button></div></form>";
    }
    return head(t("nav_review"), t("review_sub")) + "<div class=\"grid review-grid\"><section class=\"card\"><h2>" + t("queue") + " · " + items.length + "</h2>" + (items.length ? "<ul class=\"qlist\">" + rows + "</ul>" : "<p class=\"empty\">" + t("queue_empty") + "</p>") + "</section><section class=\"card\">" + detail + "</section></div>";
  }

  /* ---------- курсы: преподаватель (22 ноября 2026, по образцу заказчика) ---------- */
  /* круглый плюсик и меню «Создать» */
  function pmItem(act, id, ico, tone, label, hint, soon) {
    return "<button class=\"pm-item\" type=\"button\" role=\"menuitem\"" + (soon ? " disabled" : " data-act=\"" + act + "\" data-id=\"" + id + "\"") + "><span class=\"pm-ico pm-ico--" + tone + "\">" + icon(ico) + "</span><span class=\"pm-label\">" + t(label) + (soon ? " <span class=\"pm-soon\">" + t("soon") + "</span>" : "") + "</span><span class=\"pm-help\" title=\"" + esc(t(hint)) + "\" aria-label=\"" + esc(t(hint)) + "\">?</span></button>";
  }
  function plusMenu(id, items, wide) {
    return "<div class=\"plus-wrap\"><button class=\"plus" + (wide ? " plus--wide" : "") + "\" type=\"button\" data-act=\"togglePlus\" data-id=\"" + id + "\" aria-expanded=\"false\" aria-controls=\"pm-" + id + "\" aria-label=\"" + t("create") + "\" title=\"" + t("create") + "\"><span class=\"plus-x\" aria-hidden=\"true\"></span>" + (wide ? "<span>" + t("create") + "</span>" : "") + "</button>" +
      "<div class=\"pmenu\" id=\"pm-" + id + "\" role=\"menu\" hidden><p class=\"pm-title\">" + t("create") + "</p>" + items + "</div></div>";
  }
  function teacherCourseCard(c) {
    const n = lessonsOf(c).length;
    return "<a class=\"ccard\" href=\"" + go("tcourse", c.id) + "\">" + coverHtml(c) + "<span class=\"ccard-body\"><span class=\"row\"><span class=\"tag" + (c.status === "live" ? " tag--good" : "") + "\">" + t(c.status === "live" ? "st_live" : "st_draft") + "</span><span class=\"tag\">" + esc(COURSES[c.subject].short) + "</span></span><b>" + esc(c.title || t("untitled")) + "</b><span class=\"muted small\">" + lessonsWord(n) + " · " + c.groups.length + " " + t("groups_n") + "</span></span></a>";
  }
  function viewContent() {
    const folder = find(state.folders, param);
    const mine = teacherCourses();
    const menu = plusMenu("content", pmItem("newCourse", folder ? folder.id : "", "courses", "wine", "c_course", "h_course") + "<hr class=\"pm-sep\">" + pmItem("newFolder", "", "folder", "muted", "c_folder", "h_folder"));
    if (folder) {
      const inside = mine.filter(function (c) { return c.folder === folder.id; });
      return "<a class=\"back\" href=\"" + go("content") + "\">" + t("back_courses") + "</a>" +
        "<div class=\"phead\"><div class=\"phead-text folder-head\"><span class=\"folder-ico\">" + icon("folder") + "</span><input class=\"ghost ghost--h1\" type=\"text\" value=\"" + esc(folder.name) + "\" placeholder=\"" + t("folder_name") + "\" aria-label=\"" + t("folder_name") + "\" data-change=\"folderName\" data-id=\"" + folder.id + "\"></div><div class=\"row\"><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"delFolder\" data-id=\"" + folder.id + "\">" + icon("trash") + t("del_folder") + "</button>" + menu + "</div></div>" +
        (inside.length ? "<div class=\"cgrid\">" + inside.map(teacherCourseCard).join("") + "</div>" : "<section class=\"card\"><p class=\"empty\">" + t("folder_empty") + "</p></section>");
    }
    const folders = state.folders.map(function (f) {
      const n = mine.filter(function (c) { return c.folder === f.id; }).length;
      return "<a class=\"ccard ccard--folder\" href=\"" + go("content", f.id) + "\"><span class=\"folder-ico\">" + icon("folder") + "</span><span class=\"ccard-body\"><b>" + esc(f.name || t("untitled")) + "</b><span class=\"muted small\">" + n + " " + t("courses_n") + "</span></span></a>";
    }).join("");
    const loose = mine.filter(function (c) { return !find(state.folders, c.folder); });
    const grid = folders + loose.map(teacherCourseCard).join("");
    return head(t("nav_content"), t("content_sub2"), menu) +
      (grid ? "<div class=\"cgrid\">" + grid + "</div>" : "<section class=\"card\"><p class=\"empty\">" + t("no_courses") + "</p></section>");
  }

  let coursePanel = "";
  function panelHtml(c) {
    if (coursePanel === "students") {
      return "<section class=\"card cpanel\"><div class=\"card-head\"><h2>" + t("p_students") + "</h2>" + closePanel() + "</div><p class=\"muted small\">" + t("p_students_sub") + "</p>" +
        Object.keys(GROUPS).map(function (g) {
          return "<label class=\"check\"><input type=\"checkbox\" data-change=\"courseGroup\" data-id=\"" + c.id + "|" + g + "\"" + (c.groups.indexOf(g) >= 0 ? " checked" : "") + ">" + esc(GROUPS[g].name) + " <span class=\"muted small\">· " + GROUPS[g].students + " " + t("students_n") + "</span></label>";
        }).join("") + "</section>";
    }
    if (coursePanel === "progress") {
      const total = lessonsOf(c).length;
      const rows = ROSTER.filter(function (s) { return c.groups.indexOf(s.group) >= 0; }).map(function (s, i) {
        const real = s.name === PEOPLE.student.name && c.groups.indexOf(STUDENT_GROUPS[c.subject]) >= 0;
        const pct = real ? courseProgress(c).pct : total ? Math.min(100, Math.round((s.att + s.hwDone * 4 + i * 7) % 101)) : 0;
        return "<li class=\"prog-row\"><span class=\"avatar avatar--sm\">" + initials(s.name) + "</span><span class=\"mrow-main\"><b>" + esc(s.name) + "</b><span>" + esc(GROUPS[s.group].name.split("· ")[1]) + "</span></span><span class=\"prog-bar\">" + bar(pct) + "</span><b class=\"prog-pct\">" + pct + "%</b></li>";
      }).join("");
      return "<section class=\"card cpanel\"><div class=\"card-head\"><h2>" + t("p_progress") + "</h2>" + closePanel() + "</div><p class=\"muted small\">" + t("p_progress_sub") + " " + t("p_progress_demo") + "</p>" + (rows ? "<ul class=\"mlist\">" + rows + "</ul>" : "<p class=\"empty\">" + t("p_no_groups") + "</p>") + "</section>";
    }
    if (coursePanel === "settings") {
      const subjects = TEACHERS.teacher.subjects.map(function (k) { return "<option value=\"" + k + "\"" + (k === c.subject ? " selected" : "") + ">" + esc(COURSES[k].name) + "</option>"; }).join("");
      const folders = "<option value=\"\">" + t("no_folder") + "</option>" + state.folders.map(function (f) { return "<option value=\"" + f.id + "\"" + (f.id === c.folder ? " selected" : "") + ">" + esc(f.name || t("untitled")) + "</option>"; }).join("");
      return "<section class=\"card cpanel\"><div class=\"card-head\"><h2>" + t("p_settings") + "</h2>" + closePanel() + "</div><div class=\"form form--cols\"><div class=\"field\"><label for=\"cs-subject\">" + t("subject") + "</label><select id=\"cs-subject\" data-change=\"courseField\" data-id=\"" + c.id + "\" data-field=\"subject\">" + subjects + "</select></div>" +
        "<div class=\"field\"><label for=\"cs-folder\">" + t("folder") + "</label><select id=\"cs-folder\" data-change=\"courseField\" data-id=\"" + c.id + "\" data-field=\"folder\">" + folders + "</select></div></div>" +
        "<div class=\"row\">" + (c.cover ? "<button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"delCover\" data-id=\"" + c.id + "\">" + t("del") + ": " + t("add_cover").split(" ").pop() + "</button>" : "") + "<button class=\"btn btn--line btn--sm btn--danger\" type=\"button\" data-act=\"delCourse\" data-id=\"" + c.id + "\">" + icon("trash") + t("del_course") + "</button></div></section>";
    }
    return "";
  }
  function closePanel() { return "<button class=\"icon-btn\" type=\"button\" data-act=\"coursePanel\" data-id=\"\" aria-label=\"" + t("close") + "\" title=\"" + t("close") + "\">×</button>"; }
  function itemTools(c, it) {
    const btn = function (act, dir, ico, label) { return "<button class=\"icon-btn\" type=\"button\" data-act=\"" + act + "\" data-id=\"" + c.id + "|" + it.id + (dir ? "|" + dir : "") + "\" aria-label=\"" + t(label) + "\" title=\"" + t(label) + "\">" + icon(ico) + "</button>"; };
    return "<span class=\"otools\">" + btn("moveItem", "-1", "up", "move_up") + btn("moveItem", "1", "down", "move_down") + btn("delItem", "", "trash", "del") + "</span>";
  }
  function viewTCourse() {
    const c = findCourse(param);
    if (!c || c.owner !== "teacher") { param = ""; return viewContent(); }
    const n = lessonsOf(c).length;
    const back = find(state.folders, c.folder) ? go("content", c.folder) : go("content");
    const menu = plusMenu("course", pmItem("openPicker", "lesson", "lesson_ico", "wine", "c_lesson", "h_lesson") + pmItem("newLesson", "exam", "exam", "accent", "c_exam", "h_exam") + pmItem("newLesson", "webinar", "lesson", "good", "c_webinar", "h_webinar") + "<hr class=\"pm-sep\">" + pmItem("addModule", c.id, "module", "muted", "c_module", "h_module"), true);
    const hero = "<section class=\"chero\"" + (c.cover ? " style=\"--cover:url('" + c.cover + "')\"" : "") + "><div class=\"chero-top\"><a class=\"icon-btn chero-back\" href=\"" + back + "\" aria-label=\"" + t("back_courses") + "\" title=\"" + t("back_courses") + "\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 12H5M11 6l-6 6 6 6\"/></svg></a>" +
      "<label class=\"status-pick status-pick--" + c.status + "\"><span class=\"sr-only\">" + t("status") + "</span><select data-change=\"courseField\" data-id=\"" + c.id + "\" data-field=\"status\"><option value=\"draft\"" + (c.status !== "live" ? " selected" : "") + ">" + t("st_draft") + "</option><option value=\"live\"" + (c.status === "live" ? " selected" : "") + ">" + t("st_live") + "</option></select></label>" +
      "<label class=\"cover-pick\" for=\"cover-file\">" + t(c.cover ? "change_cover" : "add_cover") + icon("b_image") + "</label><input id=\"cover-file\" type=\"file\" accept=\"image/*\" data-change=\"courseCover\" data-id=\"" + c.id + "\" hidden></div>" +
      "<p class=\"auth-error\" id=\"cover-error\" role=\"alert\" hidden>" + t("cover_big") + "</p>" +
      "<textarea class=\"ghost ghost--h1\" rows=\"1\" data-oneline placeholder=\"" + t("course_title_ph") + "\" aria-label=\"" + t("course_title_ph") + "\" data-change=\"courseField\" data-id=\"" + c.id + "\" data-field=\"title\">" + esc(c.title) + "</textarea>" +
      "<textarea class=\"ghost ghost--sub\" rows=\"1\" placeholder=\"" + t("course_desc_ph") + "\" aria-label=\"" + t("course_desc_ph") + "\" data-change=\"courseField\" data-id=\"" + c.id + "\" data-field=\"desc\">" + esc(c.desc) + "</textarea>" +
      "<div class=\"chero-foot\"><span><b>" + n + "</b> " + t("lessons_n") + "</span><span>" + esc(COURSES[c.subject].name) + "</span></div>" + menu + "</section>";
    const rows = c.items.map(function (it) {
      if (it.type === "module") return "<li class=\"orow orow--module\"><span class=\"mrow-ico\">" + icon("module") + "</span><input class=\"ghost ghost--row\" type=\"text\" value=\"" + esc(it.title) + "\" placeholder=\"" + t("module_ph") + "\" aria-label=\"" + t("module_ph") + "\" data-change=\"itemTitle\" data-id=\"" + c.id + "|" + it.id + "\">" + itemTools(c, it) + "</li>";
      return "<li class=\"orow\"><a class=\"mrow\" href=\"" + go("build", it.id) + "\"><span class=\"mrow-ico mrow-ico--" + it.kind + "\">" + icon(kindIco(it)) + "</span><span class=\"mrow-main\"><b>" + esc(it.title || t("untitled")) + "</b><span>" + lessonMeta(it) + "</span></span><span class=\"mrow-go\">" + icon("chevron") + "</span></a>" + itemTools(c, it) + "</li>";
    }).join("");
    const outline = rows ? "<section class=\"card\"><ul class=\"olist\">" + rows + "</ul></section>" :
      "<section class=\"card cempty\"><svg viewBox=\"0 0 120 90\" aria-hidden=\"true\"><path d=\"M20 80h80M34 80V22h44l8 10v48M44 36h28M44 46h28M44 56h18\"/><circle cx=\"88\" cy=\"62\" r=\"12\"/><path d=\"M88 56v12M82 62h12\"/></svg><p>" + t("course_empty") + "</p></section>";
    const side = [["students", "users", "p_students"], ["progress", "progress", "p_progress"], ["settings", "settings", "p_settings"]].map(function (s) {
      return "<button class=\"cside-item" + (coursePanel === s[0] ? " on" : "") + "\" type=\"button\" data-act=\"coursePanel\" data-id=\"" + s[0] + "\">" + icon(s[1]) + "<span>" + t(s[2]) + "</span></button>";
    }).join("");
    return "<div class=\"clayout\"><div class=\"cmain\">" + hero + panelHtml(c) + outline + "</div><nav class=\"cside\" aria-label=\"" + t("p_settings") + "\">" + side + "</nav></div>" + (picker === c.id ? pickerHtml(c) : "");
  }

  /* окно «Новый урок» с шаблонами */
  let picker = "";
  function pickerHtml(c) {
    const skeleton = "<span class=\"tpl-skel\" aria-hidden=\"true\">" + icon("b_image") + icon("b_text") + icon("b_video") + icon("test") + "</span>";
    const cards = TEMPLATES.map(function (tp) {
      if (tp.id === "blank") return "<button class=\"tpl tpl--blank\" type=\"button\" data-act=\"useTemplate\" data-id=\"blank\"><span class=\"tpl-plus\" aria-hidden=\"true\"></span><span class=\"tpl-body\"><b>" + t("tpl_blank") + "</b><span>" + t("tpl_blank_d") + "</span></span></button>";
      return "<button class=\"tpl\" type=\"button\" data-act=\"useTemplate\" data-id=\"" + tp.id + "\"><span class=\"tpl-top\"><span class=\"tpl-emoji\" aria-hidden=\"true\">" + tp.emoji + "</span>" + skeleton + "</span><span class=\"tpl-body\"><b>" + t("tpl_" + tp.id) + "</b><span>" + t("tpl_" + tp.id + "_d") + "</span></span></button>";
    }).join("");
    return "<div class=\"picker\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"picker-title\"><div class=\"picker-in\"><div class=\"picker-head\"><div><h1 class=\"title\" id=\"picker-title\">" + t("new_lesson") + "</h1><p class=\"phead-sub\">" + t("new_lesson_sub") + "</p></div><button class=\"picker-close\" type=\"button\" data-act=\"closePicker\"><span>" + t("close") + "</span><span class=\"plus-x plus-x--open\" aria-hidden=\"true\"></span></button></div><div class=\"tpl-grid\">" + cards + "</div></div></div>";
  }

  /* редактор урока */
  let buildPage = "";
  function blockEditor(l, p, bl) {
    const path = l.id + "|" + p.id + "|" + bl.id;
    const fld = function (field, ph, value, tag) {
      return tag === "textarea"
        ? "<textarea rows=\"4\" placeholder=\"" + esc(ph) + "\" aria-label=\"" + esc(ph) + "\" data-change=\"blk\" data-id=\"" + path + "\" data-field=\"" + field + "\">" + esc(value) + "</textarea>"
        : "<input type=\"text\" value=\"" + esc(value) + "\" placeholder=\"" + esc(ph) + "\" aria-label=\"" + esc(ph) + "\" data-change=\"blk\" data-id=\"" + path + "\" data-field=\"" + field + "\">";
    };
    let body = "";
    if (bl.type === "text") body = fld("text", t("ph_text"), bl.text, "textarea");
    else if (bl.type === "tip") body = fld("text", t("ph_tip"), bl.text, "textarea");
    else if (bl.type === "video") {
      const src = embedUrl(bl.url);
      body = fld("url", t("ph_video"), bl.url) + "<p class=\"muted small\">" + (bl.dur && !bl.url ? t("video_demo_n") + " · " + Math.round(bl.dur / 60) + " " + t("min") + ". " : "") + t("video_sources") + "</p>" + (src ? "<div class=\"lvideo\"><iframe src=\"" + esc(src) + "\" title=\"" + esc(t("video")) + "\" allowfullscreen loading=\"lazy\"></iframe></div>" : "");
    } else if (bl.type === "image") {
      body = (bl.src ? "<img class=\"bimg\" src=\"" + bl.src + "\" alt=\"\">" : "") + "<label class=\"btn btn--line btn--sm bpick\">" + t("pick_image") + "<input type=\"file\" accept=\"image/*\" data-change=\"blkImage\" data-id=\"" + path + "\" hidden></label><p class=\"auth-error\" role=\"alert\" hidden>" + t("cover_big") + "</p>" + fld("caption", t("caption_ph"), bl.caption);
    } else if (bl.type === "file") {
      body = (bl.name ? "<div class=\"lfile\"><span class=\"mrow-ico\">" + icon("note") + "</span><b>" + esc(bl.name) + "</b></div>" : "") + "<label class=\"btn btn--line btn--sm bpick\">" + t("pick_file") + "<input type=\"file\" data-change=\"blkFile\" data-id=\"" + path + "\" hidden></label><p class=\"muted small\">" + t("file_demo") + "</p>";
    } else if (bl.type === "test") {
      body = fld("q", t("ph_q"), bl.q) + "<ul class=\"bopts\">" + bl.options.map(function (o, j) {
        return "<li><label class=\"bopt-check\" title=\"" + t("correct") + "\"><input type=\"checkbox\" data-change=\"blkCorrect\" data-id=\"" + path + "|" + j + "\"" + (bl.correct.indexOf(j) >= 0 ? " checked" : "") + " aria-label=\"" + t("correct") + "\"></label><input type=\"text\" value=\"" + esc(o) + "\" placeholder=\"" + t("option") + " " + (j + 1) + "\" aria-label=\"" + t("option") + " " + (j + 1) + "\" data-change=\"blkOption\" data-id=\"" + path + "|" + j + "\">" +
          (bl.options.length > 2 ? "<button class=\"icon-btn\" type=\"button\" data-act=\"delOption\" data-id=\"" + path + "|" + j + "\" aria-label=\"" + t("del") + "\" title=\"" + t("del") + "\">×</button>" : "") + "</li>";
      }).join("") + "</ul><div class=\"row\"><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"addOption\" data-id=\"" + path + "\">" + icon("plus") + t("add_option") + "</button></div><p class=\"muted small\">" + t("test_hint") + "</p>";
    } else if (bl.type === "input") body = fld("q", t("ph_q"), bl.q) + fld("answer", t("ph_answer"), bl.answer) + "<p class=\"muted small\">" + t("input_hint") + "</p>";
    else if (bl.type === "open") body = fld("q", t("ph_q"), bl.q, "textarea") + "<p class=\"muted small\">" + t("open_hint") + "</p>";
    const tool = function (act, extra, ico, label) { return "<button class=\"icon-btn\" type=\"button\" data-act=\"" + act + "\" data-id=\"" + path + extra + "\" aria-label=\"" + t(label) + "\" title=\"" + t(label) + "\">" + icon(ico) + "</button>"; };
    return "<div class=\"bblock\" id=\"blk-" + bl.id + "\"><div class=\"bblock-head\"><span class=\"bblock-name\">" + icon("b_" + bl.type) + t("b_" + bl.type) + "</span><span class=\"otools\">" + tool("moveBlock", "|-1", "up", "move_up") + tool("moveBlock", "|1", "down", "move_down") + tool("delBlock", "", "trash", "del") + "</span></div>" + body + "</div>";
  }
  function viewBuild() {
    const hit = findLesson(param);
    if (!hit || hit.course.owner !== "teacher") { param = ""; return viewContent(); }
    const l = hit.lesson;
    if (l.kind === "webinar") return webinarEditor(hit);
    if (!l.pages.length) l.pages.push(newPage());
    if (!find(l.pages, buildPage)) buildPage = l.pages[l.pages.length - 1].id;
    const tile = function (type) { return "<button class=\"ptile\" type=\"button\" data-act=\"addBlock\" data-id=\"" + type + "\">" + icon("b_" + type) + "<span>" + t("b_" + type) + "</span></button>"; };
    const palette = "<aside class=\"palette\"><a class=\"back\" href=\"" + go("tcourse", hit.course.id) + "\">" + t("back_course") + "</a><p class=\"palette-label\">" + t("blocks_info") + "</p><div class=\"ptiles\">" + BLOCK_TYPES.info.map(tile).join("") + "</div><p class=\"palette-label\">" + t("blocks_tasks") + "</p><div class=\"ptiles\">" + BLOCK_TYPES.tasks.map(tile).join("") + "</div></aside>";
    const pages = l.pages.map(function (p, i) {
      const ptool = function (act, extra, ico, label) { return "<button class=\"icon-btn\" type=\"button\" data-act=\"" + act + "\" data-id=\"" + l.id + "|" + p.id + extra + "\" aria-label=\"" + t(label) + "\" title=\"" + t(label) + "\">" + icon(ico) + "</button>"; };
      const tools = l.pages.length > 1 ? "<span class=\"otools\">" + ptool("movePage", "|-1", "up", "move_up") + ptool("movePage", "|1", "down", "move_down") + ptool("delPage", "", "trash", "del_page") + "</span>" : "";
      const body = p.blocks.length ? p.blocks.map(function (bl) { return blockEditor(l, p, bl); }).join("") :
        "<div class=\"bempty\"><span class=\"tpl-skel\" aria-hidden=\"true\">" + icon("b_image") + icon("b_text") + icon("b_video") + icon("test") + "</span><p class=\"muted small\">" + t("page_empty") + "</p></div>";
      return "<section class=\"bpage" + (p.id === buildPage ? " bpage--active" : "") + "\" data-page=\"" + p.id + "\"><div class=\"bpage-head\"><span class=\"bpage-n\">" + (i + 1) + "</span><input class=\"ghost ghost--page\" type=\"text\" value=\"" + esc(p.title) + "\" placeholder=\"" + t("page_ph") + "\" aria-label=\"" + t("page_ph") + "\" data-change=\"pageField\" data-id=\"" + l.id + "|" + p.id + "\">" + tools + "</div>" + body + "</section>";
    }).join("");
    const fa = function (field) { return " data-change=\"lessonField\" data-id=\"" + l.id + "\" data-field=\"" + field + "\""; };
    const examBar = l.kind !== "exam" ? "" : "<div class=\"exam-bar\"><div class=\"field\"><label for=\"ex-kind\">" + t("ex_type") + "</label><select id=\"ex-kind\"" + fa("hwKind") + ">" + KINDS.map(function (k) { return "<option value=\"" + k + "\"" + (k === l.hwKind ? " selected" : "") + ">" + t("kind_" + k) + "</option>"; }).join("") + "</select></div>" +
      "<div class=\"field\"><label for=\"ex-due\">" + t("ex_due") + "</label><input id=\"ex-due\" type=\"date\" value=\"" + esc(l.due) + "\"" + fa("due") + "></div>" +
      "<div class=\"field\"><label for=\"ex-pass\">" + t("ex_pass") + "</label><span class=\"pass-in\"><input id=\"ex-pass\" type=\"number\" min=\"0\" max=\"100\" step=\"5\" value=\"" + esc(l.pass) + "\"" + fa("pass") + "><b>%</b></span></div>" +
      "<p class=\"muted small exam-hint\">" + t("ex_pass_hint") + ". " + t("ex_open_note") + "</p></div>";
    return "<div class=\"builder\">" + palette + "<div class=\"bmain\"><span class=\"kind-badge kind-badge--" + l.kind + "\">" + t(KIND_ICON[l.kind]) + "</span>" + examBar +
      "<textarea class=\"ghost ghost--h1\" rows=\"1\" data-oneline placeholder=\"" + t("lesson_title_ph") + "\" aria-label=\"" + t("lesson_title_ph") + "\" data-change=\"lessonField\" data-id=\"" + l.id + "\" data-field=\"title\">" + esc(l.title) + "</textarea>" +
      "<input class=\"ghost ghost--sub\" type=\"text\" value=\"" + esc(l.desc) + "\" placeholder=\"" + t("lesson_desc_ph") + "\" aria-label=\"" + t("lesson_desc_ph") + "\" data-change=\"lessonField\" data-id=\"" + l.id + "\" data-field=\"desc\">" +
      pages + "<button class=\"add-page\" type=\"button\" data-act=\"addPage\" data-id=\"" + l.id + "\">" + icon("plus") + t("add_page") + "</button>" +
      "<div class=\"row bfoot\"><a class=\"btn btn--red\" href=\"" + go("tcourse", hit.course.id) + "\">" + t("done_back") + "</a><a class=\"btn btn--line\" href=\"" + go("preview", l.id) + "\">" + t("preview") + "</a></div></div></div>";
  }

  function webinarEditor(hit) {
    const l = hit.lesson, link = l.source === "link", src = embedUrl(l.url);
    const fa = function (field) { return " data-change=\"lessonField\" data-id=\"" + l.id + "\" data-field=\"" + field + "\""; };
    return "<div class=\"wbuild\"><a class=\"back\" href=\"" + go("tcourse", hit.course.id) + "\">" + t("back_course") + "</a><span class=\"kind-badge kind-badge--webinar\">" + t("c_webinar") + "</span>" +
      "<textarea class=\"ghost ghost--h1\" rows=\"1\" data-oneline placeholder=\"" + t("lesson_title_ph") + "\" aria-label=\"" + t("lesson_title_ph") + "\"" + fa("title") + ">" + esc(l.title) + "</textarea>" +
      "<input class=\"ghost ghost--sub\" type=\"text\" value=\"" + esc(l.desc) + "\" placeholder=\"" + t("lesson_desc_ph") + "\" aria-label=\"" + t("lesson_desc_ph") + "\"" + fa("desc") + ">" +
      "<section class=\"card wcard\"><div class=\"wfields\"><div class=\"field\"><label for=\"w-src\">" + t("w_source") + "</label><select id=\"w-src\"" + fa("source") + "><option value=\"room\"" + (link ? "" : " selected") + ">" + t("w_room") + "</option><option value=\"link\"" + (link ? " selected" : "") + ">" + t("w_link") + "</option></select></div>" +
      "<div class=\"field\"><label for=\"w-date\">" + t("w_start") + "</label><span class=\"wdate\"><input id=\"w-date\" type=\"date\" value=\"" + esc(l.date) + "\"" + fa("date") + "><input type=\"time\" value=\"" + esc(l.time) + "\" aria-label=\"" + t("event_time") + "\"" + fa("time") + "></span></div>" +
      "<div class=\"field\"><label for=\"w-dur\">" + t("w_dur") + "</label><input id=\"w-dur\" type=\"number\" min=\"10\" max=\"300\" step=\"5\" value=\"" + esc(l.dur) + "\"" + fa("dur") + "></div></div>" +
      "<div class=\"wbody\"><span class=\"wcam\" aria-hidden=\"true\">" + icon("lesson") + "</span><h2>" + t(link ? "w_link_title" : "w_room_title") + "</h2><p>" + t(link ? "w_link_sub" : "w_room_sub") + "</p></div>" +
      "<input class=\"winput\" type=\"text\" value=\"" + esc(l.url) + "\" placeholder=\"" + t(link ? "ph_video" : "w_rec_ph") + "\" aria-label=\"" + t(link ? "ph_video" : "w_rec_ph") + "\"" + fa("url") + ">" +
      (src ? "<div class=\"lvideo\"><iframe src=\"" + esc(src) + "\" title=\"" + esc(t("video")) + "\" allowfullscreen loading=\"lazy\"></iframe></div>" : "") +
      "<p class=\"muted small\">" + t("w_src_live") + "<br>" + t("w_src_rec") + "</p><p class=\"muted small\">" + t("w_in_schedule") + "</p></section>" +
      "<div class=\"row bfoot\"><a class=\"btn btn--red\" href=\"" + go("tcourse", hit.course.id) + "\">" + t("done_back") + "</a><a class=\"btn btn--line\" href=\"" + go("preview", l.id) + "\">" + t("preview") + "</a></div></div>";
  }
  function viewPreview() {
    const hit = findLesson(param);
    if (!hit || hit.course.owner !== "teacher") { param = ""; return viewContent(); }
    return lessonPlayer(hit, true);
  }
  function moveIn(list, id, dir) {
    const i = list.findIndex(function (x) { return x.id === id; }), j = i + Number(dir);
    if (i < 0 || j < 0 || j >= list.length) return;
    const x = list[i]; list[i] = list[j]; list[j] = x;
  }
  function ask(message) { return typeof window.confirm !== "function" || window.confirm(message); }
  function closeMenus() {
    document.querySelectorAll(".pmenu").forEach(function (m) { m.hidden = true; });
    document.querySelectorAll(".plus").forEach(function (b) { b.setAttribute("aria-expanded", "false"); b.classList.remove("plus--open"); });
  }
  function focusOn(selector) {
    const node = document.querySelector(selector);
    if (!node || !node.focus) return;
    node.focus({ preventScroll: true });
    if (node.scrollIntoView) node.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  /* ---------- банк заданий (22 ноября 2026) ----------
     Общий банк школы: задания предмета видят все его преподаватели и ученики, изменять и удалять можно только свои.
     Только краткий ответ: верные ответы через «;», проверка без регистра и пробелов, запятая = точка. После ответа показывается пояснение. */
  const BANK_SETS = [
    { id: "math-pro", subject: "math", num: 19, parts: true },
    { id: "math-base", subject: "math", num: 21 },
    { id: "eng", subject: "eng", num: 38 },
    { id: "it", subject: "it", levels: ["A1", "A2", "B1", "B2"] }
  ];
  function bankSet(id) { return BANK_SETS.filter(function (s) { return s.id === id; })[0]; }
  function bankGroup(task) { return bankSet(task.set).levels ? task.num : String(task.num); }
  function bankGroupName(set, g) { return set.levels ? t("bank_level") + " " + g : t("bank_task") + " " + g; }
  function seedBank() {
    let n = 0;
    const T = function (set, num, part, topic, text, answer, solution, author, tries, right) {
      n++;
      return { id: "q" + n, set: set, num: num, part: part, topic: topic, text: text, img: "", answer: answer, solution: solution, author: author, stats: { tries: tries, right: right } };
    };
    return [
      T("math-pro", 4, 1, "Вероятность", "В классе 25 учащихся, из них 10 мальчиков. Учитель случайным образом вызывает одного ученика к доске. Найдите вероятность того, что это будет девочка.", "0,6; 3/5", "Девочек 25 − 10 = 15. Вероятность равна 15 : 25 = 0,6.", "teacher", 41, 33),
      T("math-pro", 5, 1, "Вероятность", "Стрелок в тире стреляет по мишени до тех пор, пока не поразит её. Он попадает в цель с вероятностью 0,5 при каждом отдельном выстреле. Какое наименьшее количество патронов нужно дать стрелку, чтобы он поразил цель с вероятностью не меньше 0,7?", "2", "Вероятность промахнуться n раз подряд равна 0,5ⁿ, значит, попасть хотя бы раз — 1 − 0,5ⁿ. При n = 1 это 0,5 < 0,7, при n = 2 это 0,75 ≥ 0,7. Нужно 2 патрона.", "teacher", 36, 14),
      T("math-pro", 6, 1, "Уравнения", "Найдите корень уравнения log₂(x + 3) = 4.", "13", "По определению логарифма x + 3 = 2⁴ = 16, откуда x = 13. Проверка: аргумент 16 > 0.", "t-math2", 52, 40),
      T("math-pro", 6, 1, "Уравнения", "Найдите корень уравнения 3^(x − 5) = 81.", "9", "81 = 3⁴, значит, x − 5 = 4 и x = 9.", "t-math2", 48, 42),
      T("math-pro", 7, 1, "Вычисления", "Найдите значение выражения log₃ 54 − log₃ 2.", "3", "Разность логарифмов с одинаковым основанием: log₃ (54 : 2) = log₃ 27 = 3.", "teacher", 39, 28),
      T("math-pro", 12, 1, "Производная", "Найдите точку минимума функции y = x³ − 12x + 7.", "2", "y′ = 3x² − 12 = 0 при x = ±2. Производная меняет знак с минуса на плюс в точке x = 2 — это точка минимума.", "t-math2", 33, 17),
      T("math-pro", 13, 2, "Тригонометрия", "Решите уравнение 2sin²x − sin x = 0. В ответе укажите наименьший положительный корень в градусах.", "30", "sin x (2sin x − 1) = 0, значит, sin x = 0 или sin x = 1/2. Наименьший положительный корень: x = 30°.", "teacher", 21, 9),
      T("math-base", 1, 1, "Практические задачи", "Билет на автобус стоит 45 рублей. Какое наибольшее число билетов можно купить на 500 рублей?", "11", "500 : 45 = 11,1… Целых билетов можно купить 11.", "t-math2", 44, 39),
      T("math-base", 5, 1, "Проценты", "Товар стоит 1200 рублей. Во время распродажи на него сделали скидку 15%. Сколько рублей стоит товар со скидкой?", "1020", "15% от 1200 — это 180 рублей. 1200 − 180 = 1020.", "teacher", 38, 31),
      T("math-base", 6, 1, "Вычисления", "Найдите значение выражения 3,5 · 1,2 + 0,8.", "5", "3,5 · 1,2 = 4,2; 4,2 + 0,8 = 5.", "teacher", 50, 46),
      T("math-base", 9, 1, "Дроби", "Найдите значение выражения (2/5 + 3/10) · 20.", "14", "2/5 = 4/10, сумма 7/10. 7/10 · 20 = 14.", "t-math2", 35, 27),
      T("math-base", 12, 1, "Геометрия", "Сторона квадрата равна 7. Найдите его площадь.", "49", "Площадь квадрата равна квадрату стороны: 7² = 49.", "teacher", 47, 45),
      T("math-base", 15, 1, "Уравнения", "Найдите корень уравнения 5x − 7 = 18.", "5", "5x = 25, x = 5.", "t-math2", 42, 38),
      T("eng", 19, 1, "Грамматика", "Преобразуйте слово GO так, чтобы оно грамматически соответствовало предложению: Last summer we ___ to the seaside.", "went", "Last summer — законченный период в прошлом, нужен Past Simple: go → went.", "t-eng", 40, 31),
      T("eng", 20, 1, "Грамматика", "Преобразуйте слово OLD: My sister is two years ___ than me.", "older", "Сравнение двух людей (than) — сравнительная степень: old → older.", "t-eng", 37, 33),
      T("eng", 21, 1, "Грамматика", "Преобразуйте слово WRITE: The letter ___ yesterday by our teacher.", "was written", "Письмо написали (страдательный залог), yesterday — прошедшее время: was written.", "t-eng", 33, 18),
      T("eng", 22, 1, "Грамматика", "Преобразуйте слово BE: If I ___ you, I would apologise.", "were", "Условное предложение второго типа: If I were you — устойчивая форма.", "t-eng", 31, 20),
      T("eng", 26, 1, "Словообразование", "Образуйте слово от INTEREST: The film was really ___.", "interesting", "Нужно прилагательное, описывающее фильм: interesting («интересный»).", "t-eng", 29, 22),
      T("eng", 27, 1, "Словообразование", "Образуйте слово от CORRECT: He answered all the questions ___.", "correctly", "Как ответил? Нужно наречие: correct → correctly.", "t-eng", 28, 21),
      T("eng", 28, 1, "Словообразование", "Образуйте слово от POSSIBLE: It was ___ to get tickets — they were sold out.", "impossible", "По смыслу билеты достать нельзя: приставка im- даёт impossible.", "t-eng", 27, 19),
      T("it", "A1", 0, "Presentarsi", "Вставьте форму глагола essere: Io ___ di Mosca.", "sono", "Essere в настоящем времени: io sono, tu sei, lui/lei è.", "t-it", 30, 27),
      T("it", "A1", 0, "Articoli", "Вставьте определённый артикль: ___ libro.", "il", "Libro — мужской род, начинается с согласной: il libro.", "t-it", 28, 24),
      T("it", "A1", 0, "Lessico", "Переведите на итальянский: «спасибо».", "grazie", "Grazie — «спасибо», grazie mille — «большое спасибо».", "t-it", 33, 32),
      T("it", "A2", 0, "Passato prossimo", "Поставьте глагол в passato prossimo: Ieri noi ___ (andare) al cinema.", "siamo andati; siamo andate", "Andare спрягается с essere, причастие согласуется с подлежащим: noi siamo andati (andate).", "t-it", 26, 12),
      T("it", "A2", 0, "Passato prossimo", "Вставьте причастие: Ho ___ (mangiare) una pizza.", "mangiato", "Mangiare спрягается с avere, причастие на -ato: ho mangiato.", "t-it", 25, 20),
      T("it", "B1", 0, "Futuro semplice", "Поставьте глагол в futuro semplice: Domani io ___ (partire) per Roma.", "partirò; partiro", "Futuro от partire: partirò, partirai, partirà.", "t-it", 19, 11),
      T("it", "B1", 0, "Congiuntivo", "Вставьте congiuntivo: Penso che lui ___ (avere) ragione.", "abbia", "После penso che нужен congiuntivo presente: che lui abbia.", "t-it", 17, 7)
    ];
  }
  function bankAccepts(task, value) { return String(task.answer || "").split(";").map(norm).filter(Boolean).indexOf(norm(value)) >= 0; }
  function bankTasks(setId) { return state.bank.filter(function (q) { return q.set === setId; }); }
  function bankGroups(set) {
    const out = [];
    bankTasks(set.id).forEach(function (q) { const g = bankGroup(q); if (out.indexOf(g) < 0) out.push(g); });
    return out.sort(function (a, b) { return set.levels ? set.levels.indexOf(a) - set.levels.indexOf(b) : Number(a) - Number(b); });
  }
  function bankCount(list) {
    const c = { total: list.length, tried: 0, right: 0, wrong: 0 };
    list.forEach(function (q) { const p = state.bankProgress[q.id]; if (p) { c.tried++; if (p.status === "right") c.right++; else c.wrong++; } });
    return c;
  }
  function pctOf(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function teacherSets() { return BANK_SETS.filter(function (s) { return TEACHERS.teacher.subjects.indexOf(s.subject) >= 0; }); }
  function openReports() { return state.bankReports.filter(function (r) { const q = find(state.bank, r.task); return !r.done && q && q.author === "teacher"; }); }
  function authorName(id) { return TEACHERS[id] ? TEACHERS[id].name : ""; }

  /* ученик */
  const bankRetry = {}, bankShow = {}, bankThanks = {};
  let bankReportOpen = "";
  function bankCard(q) {
    const p = state.bankProgress[q.id], set = bankSet(q.set);
    const retry = bankRetry[q.id];
    const status = p && !retry ? p.status : p && retry ? "again" : "new";
    const tag = function (text, cls) { return "<span class=\"bt-tag" + (cls ? " " + cls : "") + "\">" + text + "</span>"; };
    const statusTag = { right: tag(t("bank_right"), "bt-tag--right"), wrong: tag(t("bank_wrong"), "bt-tag--wrong"), again: tag(t("bank_wrong"), "bt-tag--wrong"), "new": tag(t("bank_new")) }[status];
    const fav = state.bankFav.indexOf(q.id) >= 0;
    const tags = "<div class=\"bt-tags\">" + tag(t("bank_task")) + statusTag + tag(esc(q.num)) + (set.parts ? tag(t("bank_part") + " " + q.part) : "") +
      "<span class=\"bt-actions\"><button class=\"bt-link" + (fav ? " on" : "") + "\" type=\"button\" data-act=\"bankFav\" data-id=\"" + q.id + "\" aria-pressed=\"" + fav + "\">" + icon("heart") + t(fav ? "bank_faved" : "bank_fav") + "</button>" +
      "<button class=\"bt-link\" type=\"button\" data-act=\"bankReport\" data-id=\"" + q.id + "\">" + t("bank_report") + "</button></span></div>";
    const value = p && !retry ? p.answer : "";
    const locked = status === "right" || status === "wrong";
    const button = status === "wrong" ? "<button class=\"btn btn--red\" type=\"button\" data-act=\"bankRetry\" data-id=\"" + q.id + "\">" + t("bank_again") + "</button>" :
      status === "right" ? "<span class=\"bt-done\">" + icon("star") + t("bank_solved") + "</span>" : "<button class=\"btn btn--red\" type=\"submit\">" + t("bank_check") + "</button>";
    const showSol = bankShow[q.id] || locked;
    const solution = showSol ? "<div class=\"bt-solution\"><b>" + t("bank_explain") + "</b>" + paragraphs(q.solution) + "<p class=\"bt-answer\">" + t("correct_answer") + ": <b>" + esc(String(q.answer).split(";")[0].trim()) + "</b></p></div>" : "";
    const report = bankReportOpen === q.id ? "<form class=\"form bt-report\" data-form=\"bankReport\" data-id=\"" + q.id + "\"><label class=\"small\" for=\"rep-" + q.id + "\">" + t("bank_report_what") + "</label><textarea id=\"rep-" + q.id + "\" name=\"text\" required></textarea><div class=\"row\"><button class=\"btn btn--red btn--sm\" type=\"submit\">" + t("send") + "</button><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"bankReport\" data-id=\"" + q.id + "\">" + t("cancel_edit") + "</button></div></form>" :
      bankThanks[q.id] ? "<p class=\"bt-thanks small\">" + t("bank_report_thanks") + "</p>" : "";
    return "<article class=\"card bt bt--" + status + "\" id=\"bt-" + q.id + "\">" + tags + report + "<p class=\"bt-topic\">" + esc(q.topic) + "</p><p class=\"bt-label\">" + t("bank_enter") + "</p><div class=\"bt-text\">" + paragraphs(q.text) + "</div>" +
      (q.img ? "<img class=\"bt-img\" src=\"" + q.img + "\" alt=\"\">" : "") +
      "<form class=\"bt-form\" data-form=\"bankAnswer\" data-id=\"" + q.id + "\"><input class=\"bt-input\" type=\"text\" name=\"answer\" value=\"" + esc(value) + "\" placeholder=\"" + t("bank_answer_ph") + "\" aria-label=\"" + t("bank_answer_ph") + "\" autocomplete=\"off\"" + (locked ? " readonly" : "") + "><div class=\"bt-row\">" + button +
      (showSol ? "" : "<button class=\"bt-link bt-link--sol\" type=\"button\" data-act=\"bankSolution\" data-id=\"" + q.id + "\">" + icon("eye") + t("bank_show") + "</button>") + "</div></form>" + solution + "</article>";
  }
  function viewSBank() {
    const parts = String(param).split("_"), set = bankSet(parts[0]), g = parts.slice(1).join("_");
    if (!set) {
      const all = bankCount(state.bank);
      const cards = BANK_SETS.map(function (s) {
        const c = bankCount(bankTasks(s.id));
        return "<a class=\"ccard bank-set\" href=\"" + go("bank", s.id) + "\"><span class=\"ccard-body\"><span class=\"tag\">" + esc(COURSES[s.subject].short) + "</span><b>" + t("bank_set_" + s.id) + "</b><span class=\"muted small\">" + c.total + " " + t("tasks_n") + "</span>" +
          "<span class=\"ccard-progress\"><span>" + t("bank_right_lc") + ": " + c.right + " " + t("of") + " " + c.total + "</span><b>" + pctOf(c.right, c.total) + "%</b></span>" + bar(pctOf(c.right, c.total)) + "</span></a>";
      }).join("");
      const topics = {};
      state.bank.forEach(function (q) { const p = state.bankProgress[q.id]; if (p && p.status === "wrong") { const k = q.set + "|" + q.topic; topics[k] = (topics[k] || 0) + 1; } });
      const weak = Object.keys(topics).sort(function (a, b) { return topics[b] - topics[a]; }).slice(0, 5).map(function (k) {
        const s = k.split("|");
        return "<li><a class=\"mrow\" href=\"" + go("bank", s[0] + "_wrong") + "\"><span class=\"mrow-ico\">" + icon("alert") + "</span><span class=\"mrow-main\"><b>" + esc(s[1]) + "</b><span>" + t("bank_set_" + s[0]) + "</span></span><span class=\"tag tag--todo\">" + topics[k] + " " + t("bank_errors_n") + "</span><span class=\"mrow-go\">" + icon("chevron") + "</span></a></li>";
      }).join("");
      return head(t("nav_bank"), t("bank_sub")) +
        stats([stat("star", "good", all.right, t("bank_right_lc")), stat("progress", "wine", pctOf(all.right, all.tried) + "%", t("bank_accuracy")), stat("alert", "accent", all.wrong, t("bank_to_fix")), stat("heart", "gold", state.bankFav.length, t("bank_favs"))]) +
        "<div class=\"cgrid\">" + cards + "</div>" + (weak ? "<section class=\"card\">" + cardHead(t("bank_weak")) + "<ul class=\"mlist\">" + weak + "</ul></section>" : "");
    }
    const special = { all: t("bank_all"), wrong: t("bank_errors"), fav: t("bank_favs") };
    const tasks = bankTasks(set.id);
    if (!g) {
      const rows = bankGroups(set).map(function (gr) {
        const list = tasks.filter(function (q) { return bankGroup(q) === gr; }), c = bankCount(list);
        const topicsOf = list.map(function (q) { return q.topic; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(", ");
        return "<li><a class=\"prow bank-row\" href=\"" + go("bank", set.id + "_" + gr) + "\"><span class=\"bank-num\">" + esc(gr) + "</span><span class=\"prow-name\">" + esc(bankGroupName(set, gr)) + "<span class=\"muted small\">" + esc(topicsOf) + "</span></span>" + mini(t("bank_right_lc") + " " + c.right + "/" + c.total, pctOf(c.right, c.total)) + "</a></li>";
      }).join("");
      const c = bankCount(tasks);
      return "<a class=\"back\" href=\"" + go("bank") + "\">" + t("nav_bank") + "</a>" + head(t("bank_set_" + set.id), c.total + " " + t("tasks_n") + " · " + t("bank_right_lc") + " " + c.right + " · " + t("bank_errors").toLowerCase() + " " + c.wrong) +
        chips(Object.keys(special).map(function (k) { return [k, special[k], k === "all" ? c.total : k === "wrong" ? c.wrong : tasks.filter(function (q) { return state.bankFav.indexOf(q.id) >= 0; }).length, go("bank", set.id + "_" + k)]; }), "") +
        "<section class=\"card\">" + (rows ? "<ul class=\"prows\">" + rows + "</ul>" : "<p class=\"empty\">" + t("bank_empty") + "</p>") + "</section>";
    }
    const shown = tasks.filter(function (q) {
      if (g === "all") return true;
      if (g === "wrong") { const p = state.bankProgress[q.id]; return p && p.status === "wrong"; }
      if (g === "fav") return state.bankFav.indexOf(q.id) >= 0;
      return bankGroup(q) === g;
    });
    const title = special[g] || bankGroupName(set, g);
    return "<a class=\"back\" href=\"" + go("bank", set.id) + "\">" + t("bank_set_" + set.id) + "</a>" + head(esc(title), t("bank_sub_list")) +
      (shown.length ? "<div class=\"bt-list\">" + shown.map(bankCard).join("") + "</div>" : "<section class=\"card\"><p class=\"empty\">" + t(g === "wrong" ? "bank_no_errors" : g === "fav" ? "bank_no_favs" : "bank_empty") + "</p></section>");
  }

  /* преподаватель */
  let bankEdit = "", bankImg = "";
  function bankForm(set) {
    const q = bankEdit === "new" ? null : find(state.bank, bankEdit);
    const v = q || { set: set.id, num: set.levels ? set.levels[0] : "", part: 1, topic: "", text: "", answer: "", solution: "" };
    const cur = bankSet(v.set) || set;
    const sets = teacherSets().map(function (s) { return "<option value=\"" + s.id + "\"" + (s.id === v.set ? " selected" : "") + ">" + t("bank_set_" + s.id) + "</option>"; }).join("");
    const topics = state.bank.filter(function (x) { return x.set === cur.id; }).map(function (x) { return x.topic; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).map(function (x) { return "<option value=\"" + esc(x) + "\">"; }).join("");
    const num = cur.levels ? "<select id=\"bf-num\" name=\"num\">" + cur.levels.map(function (l) { return "<option" + (l === v.num ? " selected" : "") + ">" + l + "</option>"; }).join("") + "</select>" :
      "<input id=\"bf-num\" name=\"num\" type=\"number\" min=\"1\" max=\"" + cur.num + "\" value=\"" + esc(v.num) + "\" required>";
    return "<section class=\"card create bank-form\"><div class=\"card-head\"><h2>" + t(q ? "bank_edit_task" : "bank_new_task") + "</h2><button class=\"icon-btn\" type=\"button\" data-act=\"bankCancel\" aria-label=\"" + t("close") + "\" title=\"" + t("close") + "\">×</button></div>" +
      "<form class=\"form\" data-form=\"bankSave\" data-id=\"" + (q ? q.id : "") + "\"><div class=\"bank-form-top\"><div class=\"field\"><label for=\"bf-set\">" + t("bank_section") + "</label><select id=\"bf-set\" name=\"set\" data-change=\"bankFormSet\">" + sets + "</select></div>" +
      "<div class=\"field\"><label for=\"bf-num\">" + t(cur.levels ? "bank_level" : "bank_task_num") + "</label>" + num + "</div>" +
      (cur.parts ? "<div class=\"field\"><label for=\"bf-part\">" + t("bank_part") + "</label><select id=\"bf-part\" name=\"part\"><option value=\"1\"" + (Number(v.part) === 1 ? " selected" : "") + ">1</option><option value=\"2\"" + (Number(v.part) === 2 ? " selected" : "") + ">2</option></select></div>" : "") +
      "<div class=\"field\"><label for=\"bf-topic\">" + t("bank_topic") + "</label><input id=\"bf-topic\" name=\"topic\" type=\"text\" list=\"bf-topics\" value=\"" + esc(v.topic) + "\" required><datalist id=\"bf-topics\">" + topics + "</datalist></div></div>" +
      "<div class=\"field\"><label for=\"bf-text\">" + t("bank_condition") + "</label><textarea id=\"bf-text\" name=\"text\" rows=\"4\" required>" + esc(v.text) + "</textarea></div>" +
      "<div class=\"field\"><span>" + t("b_image") + "</span><div class=\"row\"><img class=\"bimg bf-img\" src=\"" + (bankImg || "data:,") + "\" alt=\"\"" + (bankImg ? "" : " hidden") + "><label class=\"btn btn--line btn--sm bpick\">" + t("pick_image") + "<input type=\"file\" accept=\"image/*\" data-change=\"bankImage\" hidden></label><button class=\"btn btn--line btn--sm bf-noimg\" type=\"button\" data-act=\"bankNoImage\"" + (bankImg ? "" : " hidden") + ">" + t("del") + "</button></div><p class=\"auth-error\" id=\"bf-img-error\" role=\"alert\" hidden>" + t("cover_big") + "</p></div>" +
      "<div class=\"field\"><label for=\"bf-answer\">" + t("bank_correct") + "</label><input id=\"bf-answer\" name=\"answer\" type=\"text\" value=\"" + esc(v.answer) + "\" required><p class=\"muted small\">" + t("bank_correct_hint") + "</p></div>" +
      "<div class=\"field\"><label for=\"bf-sol\">" + t("bank_explain") + "</label><textarea id=\"bf-sol\" name=\"solution\" rows=\"3\" required>" + esc(v.solution) + "</textarea><p class=\"muted small\">" + t("bank_explain_hint") + "</p></div>" +
      "<div class=\"row\"><button class=\"btn btn--red\" type=\"submit\">" + t(q ? "save_changes" : "bank_add") + "</button><button class=\"btn btn--line\" type=\"button\" data-act=\"bankCancel\">" + t("cancel_edit") + "</button></div></form></section>";
  }
  function bankRowT(q) {
    const set = bankSet(q.set), s = q.stats || { tries: 0, right: 0 }, mine = q.author === "teacher";
    const tools = mine ? "<span class=\"otools\"><button class=\"icon-btn\" type=\"button\" data-act=\"bankEditTask\" data-id=\"" + q.id + "\" aria-label=\"" + t("edit") + "\" title=\"" + t("edit") + "\">" + icon("pen") + "</button><button class=\"icon-btn\" type=\"button\" data-act=\"bankDel\" data-id=\"" + q.id + "\" aria-label=\"" + t("del") + "\" title=\"" + t("del") + "\">" + icon("trash") + "</button></span>" : "<span class=\"otools otools--ghost\" aria-hidden=\"true\"></span>";
    return "<li class=\"bank-trow\"><span class=\"bank-num\">" + esc(q.num) + "</span><span class=\"bank-tmain\"><span class=\"bank-tmeta\">" + esc(q.topic) + (set.parts ? " · " + t("bank_part") + " " + q.part : "") + " · " + t("bank_author") + ": " + esc(mine ? t("bank_you") : authorName(q.author)) + "</span><span class=\"bank-ttext\">" + esc(q.text) + "</span><span class=\"bank-tmeta\">" + t("correct_answer") + ": <b>" + esc(q.answer) + "</b></span></span>" +
      "<span class=\"bank-tstat\"><b>" + pctOf(s.right, s.tries) + "%</b><span>" + t("bank_right_lc") + " · " + s.tries + " " + t("bank_tries_n") + "</span></span>" + tools + "</li>";
  }
  function viewTBank() {
    const sets = teacherSets();
    const parts = String(param).split("_");
    const set = sets.filter(function (s) { return s.id === parts[0]; })[0] || sets[0];
    const g = parts[1] || "";
    const tasks = bankTasks(set.id);
    const shown = tasks.filter(function (q) { return !g || bankGroup(q) === g; });
    const tries = tasks.reduce(function (a, q) { return a + (q.stats ? q.stats.tries : 0); }, 0), right = tasks.reduce(function (a, q) { return a + (q.stats ? q.stats.right : 0); }, 0);
    const reports = openReports();
    const hard = tasks.filter(function (q) { return q.stats && q.stats.tries >= 5; }).sort(function (a, b) { return a.stats.right / a.stats.tries - b.stats.right / b.stats.tries; }).slice(0, 5).map(function (q) {
      return "<li class=\"hard-row\"><span class=\"bank-num\">" + esc(q.num) + "</span><span class=\"mrow-main\"><b>" + esc(q.topic) + "</b><span>" + esc(q.text.slice(0, 90)) + (q.text.length > 90 ? "…" : "") + "</span></span>" + mini(t("bank_right_lc"), pctOf(q.stats.right, q.stats.tries)) + "</li>";
    }).join("");
    const reportRows = reports.map(function (r) {
      const q = find(state.bank, r.task);
      return "<li class=\"rep-row\"><span class=\"avatar avatar--sm\">" + initials(r.from) + "</span><span class=\"mrow-main\"><b>" + esc(r.from) + " · " + t("bank_task") + " " + esc(q.num) + ", " + esc(q.topic) + "</b><span class=\"rep-text\">«" + esc(r.text) + "»</span></span><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"bankEditTask\" data-id=\"" + q.id + "\">" + t("edit") + "</button><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"bankResolve\" data-id=\"" + r.id + "\">" + t("bank_resolved") + "</button></li>";
    }).join("");
    const plus = "<button class=\"plus\" type=\"button\" data-act=\"bankNew\" aria-label=\"" + t("bank_new_task") + "\" title=\"" + t("bank_new_task") + "\"><span class=\"plus-x\" aria-hidden=\"true\"></span></button>";
    return head(t("nav_bank"), t("bank_sub_t"), plus) + (bankEdit ? bankForm(set) : "") +
      stats([stat("note", "wine", tasks.length, t("bank_in_section")), stat("users", "accent", tasks.filter(function (q) { return q.author === "teacher"; }).length, t("bank_mine")), stat("progress", "good", tries, t("bank_tries_total")), stat("star", "gold", pctOf(right, tries) + "%", t("bank_avg_right"))]) +
      (reportRows ? "<section class=\"card reports\">" + cardHead(t("bank_reports") + " <span class=\"dl-count\">" + reports.length + "</span>") + "<ul class=\"mlist\">" + reportRows + "</ul></section>" : "") +
      (sets.length > 1 ? chips(sets.map(function (s) { return [s.id, t("bank_set_" + s.id), bankTasks(s.id).length, go("bank", s.id)]; }), set.id) : "") +
      "<div class=\"grid main-side bank-grid\"><section class=\"card\"><div class=\"card-head\"><h2>" + t("bank_set_" + set.id) + "</h2></div>" +
      chips([["", t("all"), tasks.length, go("bank", set.id)]].concat(bankGroups(set).map(function (gr) { return [gr, gr, tasks.filter(function (q) { return bankGroup(q) === gr; }).length, go("bank", set.id + "_" + gr)]; })), g) +
      (shown.length ? "<ul class=\"mlist bank-tlist\">" + shown.map(bankRowT).join("") + "</ul>" : "<p class=\"empty\">" + t("bank_empty") + "</p>") + "</section>" +
      "<section class=\"card\">" + cardHead(t("bank_hard")) + "<p class=\"muted small\">" + t("bank_hard_sub") + "</p>" + (hard ? "<ul class=\"mlist\">" + hard + "</ul>" : "<p class=\"empty\">" + t("bank_empty") + "</p>") + "</section></div>";
  }

  /* ---------- общие экраны ---------- */
  const today0 = day(0);
  let weekShift = 0;
  function weekStart(shift) { const d = day(0); d.setDate(d.getDate() - (d.getDay() + 6) % 7 + shift * 7); return d; }
  function weekTitle(mon, sun) {
    const f = new Intl.DateTimeFormat(LOCALES[state.lang], { day: "numeric", month: "long" });
    if (f.formatRange) return f.formatRange(mon, sun);
    return f.format(mon) + " – " + f.format(sun);
  }
  let editingEvent = "";
  const CHECK = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg>";
  function weekItem(e) {
    if (e.status === "personal") {
      return "<div class=\"wl wl--personal" + (e.done ? " wl--checked" : "") + (editingEvent === e.id ? " wl--editing" : "") + "\" draggable=\"true\" data-drag=\"" + e.id + "\" data-act=\"editEvent\" data-id=\"" + e.id + "\" role=\"button\" tabindex=\"0\" title=\"" + t("event_hint") + "\">" +
        "<span class=\"wl-time\">" + e.time + "</span><span class=\"wl-name\">" + esc(e.name) + "</span>" +
        "<button class=\"wl-check\" type=\"button\" data-act=\"checkEvent\" data-id=\"" + e.id + "\" aria-pressed=\"" + e.done + "\" aria-label=\"" + t(e.done ? "undo_done" : "mark_done") + "\" title=\"" + t(e.done ? "undo_done" : "mark_done") + "\">" + CHECK + "</button></div>";
    }
    const label = e.status === "done" || e.status === "missed" ? "<span class=\"wl-state\">" + t("st_" + e.status) + "</span>" : "";
    const join = e.status === "today" ? joinBtn(e) : "";
    return "<div class=\"wl wl--" + e.status + "\"><span class=\"wl-time\">" + e.time + "</span><span class=\"wl-name\">" + esc(e.name) + "</span>" +
      (e.topic ? "<span class=\"wl-topic\">" + esc(e.topic) + "</span>" : "") + label + join + "</div>";
  }
  function scheduleDeadlines() {
    if (role !== "student") return "";
    const todayKey = iso(day(0));
    const todo = myHw().filter(function (h) { return h.status === "todo"; }).sort(function (a, b) { return a.due.localeCompare(b.due); });
    const cards = todo.map(function (h) {
      const kind = kindOf(h);
      const tone = h.due < todayKey ? " dl-due--late" : h.due === todayKey ? " dl-due--today" : "";
      return "<a class=\"dl dl--" + kind + "\" href=\"" + (h.lesson ? go("learn", h.lesson) : go("homework", h.id)) + "\"><span class=\"dl-top\"><span class=\"dl-kind\">" + t("kind_" + kind) + "</span><span class=\"dl-due" + tone + "\">" + dueLabel(h.due) + "</span></span>" +
        "<b class=\"dl-title\">" + esc(h.title) + "</b><span class=\"dl-foot\"><span class=\"dl-course\">" + esc(COURSES[h.course].short) + "</span><span class=\"dl-go\">" + t("open_hw") + icon("chevron") + "</span></span></a>";
    }).join("");
    const legend = "<div class=\"dl-legend\">" + KINDS.map(function (k) { return "<span class=\"dl-key dl--" + k + "\">" + t("kind_" + k) + "</span>"; }).join("") + "</div>";
    return "<section class=\"card deadlines\">" + cardHead(t("deadlines") + (todo.length ? " <span class=\"dl-count\">" + todo.length + "</span>" : ""), go("homework")) +
      (cards ? legend + "<div class=\"dl-grid\">" + cards + "</div>" : "<p class=\"empty\">" + t("no_deadlines") + "</p>") + "</section>";
  }
  function viewSchedule() {
    const mon = weekStart(weekShift);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const todayKey = iso(day(0));
    let cols = "";
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const key = iso(d);
      const items = eventsOn(d).map(weekItem).join("");
      cols += "<div data-date=\"" + key + "\" class=\"wday" + (key === todayKey ? " wday--today" : "") + (key < todayKey ? " wday--past" : "") + "\">" +
        "<div class=\"wday-head\"><span>" + date(d, { weekday: "short" }) + "</span><b>" + d.getDate() + "</b></div>" +
        "<div class=\"wday-list\">" + (items || "<span class=\"wday-empty\">" + t("no_lessons") + "</span>") + "</div></div>";
    }
    const arrow = function (dir, path) {
      return "<button class=\"week-arrow\" type=\"button\" data-act=\"weekMove\" data-id=\"" + dir + "\" aria-label=\"" + t(dir < 0 ? "prev" : "next") + "\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"" + path + "\"/></svg></button>";
    };
    return head(t("nav_schedule"), t("schedule_sub")) +
      "<section class=\"card week-card\"><div class=\"week-head\">" + arrow(-1, "M15 5l-7 7 7 7") + "<h2>" + weekTitle(mon, sun) + "</h2>" + arrow(1, "M9 5l7 7-7 7") +
      (weekShift ? "<button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"weekMove\" data-id=\"0\">" + t("this_week") + "</button>" : "") + "</div>" +
      "<div class=\"week\">" + cols + "</div></section>" + scheduleDeadlines() +
      eventCard(todayKey);
  }
  function eventCard(todayKey) {
    const ev = editingEvent && find(state.personal, editingEvent);
    const v = ev || { title: "", date: todayKey, time: "20:00" };
    const buttons = ev
      ? "<div class=\"row\"><button class=\"btn btn--red btn--sm\" type=\"submit\">" + t("save_changes") + "</button><button class=\"btn btn--line btn--sm\" type=\"button\" data-act=\"cancelEdit\">" + t("cancel_edit") + "</button><button class=\"btn btn--line btn--sm ev-del\" type=\"button\" data-act=\"delEvent\" data-id=\"" + ev.id + "\">" + t("del") + "</button></div>"
      : "<div><button class=\"btn btn--red btn--sm\" type=\"submit\">" + t("add") + "</button></div>";
    return "<details class=\"card add-event" + (ev ? " add-event--edit" : "") + "\"" + (ev ? " open" : "") + "><summary>" + t(ev ? "edit_event" : "add_event") + "</summary><form class=\"form\" data-form=\"" + (ev ? "saveEvent" : "addEvent") + "\"" + (ev ? " data-id=\"" + ev.id + "\"" : "") + ">" +
      "<div class=\"field\"><label for=\"ev-title\">" + t("event_title") + "</label><input id=\"ev-title\" name=\"title\" type=\"text\" value=\"" + esc(v.title) + "\" required></div>" +
      "<div class=\"add-event-row\"><div class=\"field\"><label for=\"ev-date\">" + t("event_date") + "</label><input id=\"ev-date\" name=\"date\" type=\"date\" value=\"" + v.date + "\" required></div>" +
      "<div class=\"field\"><label for=\"ev-time\">" + t("event_time") + "</label><input id=\"ev-time\" name=\"time\" type=\"time\" value=\"" + v.time + "\" required></div></div>" +
      buttons + "</form></details>";
  }

  const room = { tool: "pen", color: "#182230", mic: true, cam: true, screen: false, rec: false, snapshot: null };
  function tilesHtml() {
    const self = "<div class=\"tile\">" + (room.cam ? esc(me().name.charAt(0)) : "–") + (room.mic ? "" : "<em>" + t("mic_off") + "</em>") + "<small>" + t("you") + "</small></div>";
    const others = role === "teacher" ? ["Анна Смирнова", "Дмитрий К.", "София Л."] : ["Мария Иванова", "Дмитрий К.", "София Л."];
    return self + others.map(function (name) { return "<div class=\"tile\">" + esc(name.charAt(0)) + "<small>" + esc(name) + "</small></div>"; }).join("");
  }
  function controlsHtml() {
    let html = "<button class=\"btn btn--sm btn--line " + (room.mic ? "on" : "off") + "\" type=\"button\" data-act=\"roomToggle\" data-id=\"mic\">" + t(room.mic ? "mic_on" : "mic_off") + "</button>" +
      "<button class=\"btn btn--sm btn--line " + (room.cam ? "on" : "off") + "\" type=\"button\" data-act=\"roomToggle\" data-id=\"cam\">" + t(room.cam ? "cam_on" : "cam_off") + "</button>";
    if (role === "teacher") {
      html += "<button class=\"btn btn--sm btn--line" + (room.screen ? " on" : "") + "\" type=\"button\" data-act=\"roomToggle\" data-id=\"screen\">" + t(room.screen ? "screen_stop" : "screen_share") + "</button>" +
        "<button class=\"btn btn--sm btn--line" + (room.rec ? " off" : "") + "\" type=\"button\" data-act=\"roomToggle\" data-id=\"rec\">" + t(room.rec ? "rec_stop" : "rec_start") + "</button>";
      if (room.rec) html += "<span class=\"rec\">" + t("rec_on") + "</span>";
    }
    return html + "<a class=\"btn btn--sm btn--red\" href=\"" + go("dashboard") + "\">" + t("leave") + "</a>";
  }
  function refreshRoom() {
    document.getElementById("room-controls").innerHTML = controlsHtml();
    document.getElementById("room-tiles").innerHTML = tilesHtml();
    document.getElementById("share-note").hidden = !room.screen;
  }
  function chatLine(m) { return "<p><b>" + esc(m.who) + ":</b> " + esc(m.text) + "</p>"; }
  function viewLesson() {
    const l = nextLessons(1)[0];
    const swatches = ["#182230", "#0b1f44", "#a6522c", "#697044"].map(function (c) {
      return "<button class=\"swatch" + (c === room.color ? " on" : "") + "\" type=\"button\" style=\"background:" + c + "\" data-act=\"boardColor\" data-id=\"" + c + "\" aria-label=\"" + c + "\"></button>";
    }).join("");
    const toolBtn = function (id, key) { return "<button class=\"btn btn--sm btn--line tool" + (room.tool === id ? " on" : "") + "\" type=\"button\" data-act=\"boardTool\" data-id=\"" + id + "\">" + t(key) + "</button>"; };
    return "<div class=\"row between\"><h1 class=\"title\">" + esc(l.name) + "</h1><span class=\"muted\">" + esc(l.topic) + " · " + shortDate(l.day) + ", " + l.time + "</span></div>" +
      "<div class=\"room\"><div class=\"room-main\"><div class=\"tools\">" + toolBtn("pen", "pen") + toolBtn("eraser", "eraser") + toolBtn("text", "text") + "<input id=\"board-text\" type=\"text\" placeholder=\"" + t("text_hint") + "\" aria-label=\"" + t("text") + "\">" + swatches + "<label class=\"btn btn--sm btn--line\" for=\"board-file\">" + t("upload_board") + "</label><input id=\"board-file\" type=\"file\" accept=\"image/*,.pdf\" data-change=\"boardFile\" hidden><button class=\"btn btn--sm btn--line\" type=\"button\" data-act=\"boardClear\">" + t("clear") + "</button></div>" +
      "<div class=\"board-wrap\"><canvas id=\"board\" width=\"1280\" height=\"720\"></canvas><span class=\"share-note\" id=\"share-note\"" + (room.screen ? "" : " hidden") + ">" + t("screen_note") + "</span></div>" +
      "<div class=\"row\" id=\"room-controls\">" + controlsHtml() + "</div><p class=\"muted small\">" + t("room_demo") + "</p></div>" +
      "<div class=\"room-side\"><div class=\"tiles\" id=\"room-tiles\">" + tilesHtml() + "</div><section class=\"card chat\"><h2>" + t("chat") + "</h2><div class=\"chat-log\" id=\"chat-log\">" + state.chat.map(chatLine).join("") + "</div><form class=\"chat-form\" data-form=\"chat\"><input id=\"chat-input\" name=\"text\" type=\"text\" placeholder=\"" + t("message") + "\" aria-label=\"" + t("message") + "\" autocomplete=\"off\" required><button class=\"btn btn--line btn--sm\" type=\"submit\">" + t("send") + "</button></form></section></div></div>";
  }
  function pushChat(text) {
    const message = { who: me().name, text: text };
    state.chat.push(message);
    save();
    const log = document.getElementById("chat-log");
    log.insertAdjacentHTML("beforeend", chatLine(message));
    log.scrollTop = log.scrollHeight;
  }
  function initBoard() {
    const canvas = document.getElementById("board");
    if (!canvas) return;
    const g = canvas.getContext("2d");
    g.lineCap = "round"; g.lineJoin = "round";
    if (room.snapshot) {
      const img = new Image();
      img.onload = function () { g.drawImage(img, 0, 0); };
      img.src = room.snapshot;
    }
    const point = function (e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height };
    };
    const snap = function () { room.snapshot = canvas.toDataURL(); };
    let drawing = false, last = null;
    canvas.addEventListener("pointerdown", function (e) {
      const p = point(e);
      if (room.tool === "text") {
        const input = document.getElementById("board-text");
        if (!input.value.trim()) { input.focus(); return; }
        g.globalCompositeOperation = "source-over";
        g.fillStyle = room.color;
        g.font = "36px 'Golos Text', Arial, sans-serif";
        g.fillText(input.value, p.x, p.y);
        input.value = "";
        snap();
        return;
      }
      drawing = true; last = p;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      const p = point(e);
      g.globalCompositeOperation = room.tool === "eraser" ? "destination-out" : "source-over";
      g.strokeStyle = room.color;
      g.lineWidth = room.tool === "eraser" ? 34 : 4;
      g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(p.x, p.y); g.stroke();
      last = p;
    });
    ["pointerup", "pointercancel"].forEach(function (name) {
      canvas.addEventListener(name, function () { if (drawing) { drawing = false; snap(); } });
    });
  }

  function viewSettings() {
    const toggles = [["h1", "tg_1h"], ["m15", "tg_15m"], ["h24", "tg_24h"], ["grade", "tg_grade"]].map(function (x) {
      return "<label class=\"check\"><input id=\"tg-" + x[0] + "\" type=\"checkbox\" data-change=\"tg\" data-id=\"" + x[0] + "\"" + (state.tg[x[0]] ? " checked" : "") + ">" + t(x[1]) + "</label>";
    }).join("");
    const plan = role === "student" && account && account.package ? CATALOG.pack(account.package.id) : null;
    return head(t("nav_settings"), t("settings_sub")) + "<div class=\"grid cols-2\"><section class=\"card\"><h2>" + t("profile") + "</h2><p>" + esc(me().name) + "<br><span class=\"muted small\">" + esc(me().email) + "</span>" + (plan ? "<br><span class=\"muted small\">" + t("pkg_title") + ": " + esc(plan.name) + "</span>" : "") + "</p><div class=\"field\"><label for=\"set-lang\">" + t("language") + "</label><select id=\"set-lang\" data-change=\"lang\"><option value=\"ru\"" + (state.lang === "ru" ? " selected" : "") + ">Русский</option><option value=\"en\"" + (state.lang === "en" ? " selected" : "") + ">English</option><option value=\"it\"" + (state.lang === "it" ? " selected" : "") + ">Italiano</option></select></div></section>" +
      "<section class=\"card\"><h2>" + t("tg_title") + "</h2>" + toggles + "</section></div><div><button class=\"link small\" type=\"button\" data-act=\"reset\">" + t("reset") + "</button></div>";
  }

  /* ---------- оболочка и маршруты ---------- */
  const VIEWS = {
    dashboard: function () { return role === "teacher" ? homeTeacher() : account && !account.package ? homeNew() : homeStudent(); },
    schedule: viewSchedule, lesson: viewLesson, settings: viewSettings,
    courses: viewCourses, course: viewCourse, learn: viewLearn,
    homework: viewHomework, grades: viewGrades, report: viewReport,
    diag: viewDiag, plans: viewPlans, pay: viewPay,
    content: viewContent, bank: function () { return role === "teacher" ? viewTBank() : viewSBank(); }, review: viewReview, progress: viewProgress, tcourse: viewTCourse, build: viewBuild, preview: viewPreview
  };
  const ROLE_PAGES = { student: ["courses", "course", "learn", "homework", "grades", "report", "diag", "plans", "pay"], teacher: ["content", "review", "progress", "tcourse", "build", "preview"] };
  const ACTIVE = { course: "courses", learn: "courses", tcourse: "content", build: "content", preview: "content", report: "grades", diag: "dashboard", plans: "dashboard", pay: "dashboard" };
  /* Новый ученик до оплаты видит только диагностику, выбор пакета и настройки */
  const NEW_NAV = [["dashboard", "nav_home"], ["settings", "nav_settings"]];
  const NEW_PAGES = ["dashboard", "diag", "plans", "pay", "settings"];
  const SETUP_PAGES = ["diag", "plans", "pay"];

  function render(animate) {
    stopVideo();
    document.documentElement.lang = state.lang;
    const parts = location.hash.slice(1).split("/");
    const session = load(SESSION_KEY);
    role = parts[0] === "student" || parts[0] === "teacher" ? parts[0] : session && session.role;
    if (!role) { location.replace("login.html"); return; }
    page = VIEWS[parts[1]] ? parts[1] : "dashboard";
    const foreign = role === "student" ? ROLE_PAGES.teacher : ROLE_PAGES.student;
    if (foreign.indexOf(page) >= 0) page = "dashboard";
    account = role === "student" && session && session.email ? (load(ACCOUNTS_KEY) || {})[session.email] || null : null;
    if (role === "student" && session && session.email && !account) {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      location.replace("login.html");
      return;
    }
    const fresh = !!(account && !account.package);
    if (fresh ? NEW_PAGES.indexOf(page) < 0 : SETUP_PAGES.indexOf(page) >= 0) page = "dashboard";
    param = parts[2] || "";
    const current = ACTIVE[page] || page;
    const nav = fresh ? NEW_NAV : NAV[role];
    const tabList = fresh ? ["dashboard"] : TABS[role];
    const menu = nav.map(function (item) {
      const badgeN = item[0] === "review" ? queue().length : item[0] === "bank" && role === "teacher" ? openReports().length : 0;
      const badge = badgeN ? "<span class=\"count\">" + badgeN + "</span>" : "";
      return "<a href=\"" + go(item[0]) + "\"" + (item[0] === current ? " class=\"active\" aria-current=\"page\"" : "") + "><span class=\"menu-ico\">" + icon(item[0]) + "</span><span class=\"menu-label\">" + t(item[1]) + "</span>" + badge + "</a>";
    }).join("");
    const badge = queue().length ? "<span class=\"count\">" + queue().length + "</span>" : "";
    const tabItems = tabList.map(function (id) {
      const item = nav.filter(function (n) { return n[0] === id; })[0];
      return "<a class=\"tab" + (id === current ? " active" : "") + "\" href=\"" + go(id) + "\">" + icon(id) + "<span>" + t(TAB_LABELS[id] || item[1]) + "</span>" + (id === "review" ? badge : "") + "</a>";
    }).join("");
    const moreItems = nav.filter(function (n) { return tabList.indexOf(n[0]) < 0; });
    const moreActive = moreItems.some(function (n) { return n[0] === current; });
    const tabs = "<div class=\"sheet-back\" id=\"sheet-back\" data-act=\"toggleMore\" hidden></div><nav class=\"sheet\" id=\"sheet\" aria-label=\"" + t("more") + "\" hidden>" + moreItems.map(function (n) {
      return "<a href=\"" + go(n[0]) + "\" data-act=\"closeMore\"" + (n[0] === current ? " class=\"active\"" : "") + ">" + t(n[1]) + "</a>";
    }).join("") + "</nav><nav class=\"tabbar\" aria-label=\"" + t("nav_home") + "\">" + tabItems + "<button class=\"tab" + (moreActive ? " active" : "") + "\" id=\"more-btn\" type=\"button\" data-act=\"toggleMore\" aria-expanded=\"false\" aria-controls=\"sheet\">" + icon("more") + "<span>" + t("more") + "</span></button></nav>";
    const here = nav.filter(function (n) { return n[0] === current; })[0];
    const ini = initials(me().name);
    const themeBtn = "<button class=\"theme-btn\" type=\"button\" data-theme-toggle aria-label=\"" + t("theme") + "\"><svg class=\"i-moon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z\"/></svg><svg class=\"i-sun\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg></button>";
    const crumbs = "<nav class=\"crumbs\" aria-label=\"" + t("my_cabinet") + "\"><a href=\"" + go("dashboard") + "\">" + t("my_cabinet") + "</a><span aria-hidden=\"true\">/</span><span>" + t(here ? here[1] : "nav_home") + "</span></nav>";
    document.getElementById("app").innerHTML =
      "<div class=\"shell\"><aside class=\"side\"><a class=\"logo\" href=\"" + go("dashboard") + "\">" + LOGO + "</a><p class=\"side-label\">" + t("workspace") + "</p><nav class=\"menu\" aria-label=\"" + t("nav_home") + "\">" + menu + "</nav>" +
      "<div class=\"side-foot\"><span class=\"avatar\">" + ini + "</span><span class=\"me-text\"><b class=\"who\">" + esc(me().name) + "</b><span>" + t(role === "teacher" ? "role_teacher" : "role_student") + "</span></span><button class=\"icon-btn\" type=\"button\" data-act=\"logout\" aria-label=\"" + t("logout") + "\" title=\"" + t("logout") + "\">" + icon("logout") + "</button></div></aside>" +
      "<main class=\"main\"><div class=\"page\"><div class=\"topbar no-print\">" + crumbs + "<div class=\"topbar-right\"><span class=\"demo-pill\" title=\"" + t("demo") + "\">" + t("demo_short") + "</span>" + themeBtn + "<span class=\"avatar\" aria-hidden=\"true\">" + ini + "</span></div></div>" + VIEWS[page]() + "</div></main></div>" + tabs;
    if (animate) document.querySelector(".page").classList.add("page-enter");
    if (page === "lesson") initBoard();
    document.querySelectorAll("textarea.ghost").forEach(fitArea);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll("textarea.ghost").forEach(fitArea); });
    const focused = page === "homework" && document.querySelector(".hrow--focus");
    if (focused) focused.scrollIntoView({ block: "center" });
  }

  function readFile(file, done) {
    if (!file || !file.type.startsWith("image/") || file.size > 1500000) { done(null); return; }
    const reader = new FileReader();
    reader.onload = function () { done(reader.result); };
    reader.onerror = function () { done(null); };
    reader.readAsDataURL(file);
  }

  const ACT = {
    toggleMore: function () {
      const sheet = document.getElementById("sheet");
      const open = sheet.hidden;
      sheet.hidden = !open;
      document.getElementById("sheet-back").hidden = !open;
      document.getElementById("more-btn").setAttribute("aria-expanded", String(open));
    },
    closeMore: function () {
      document.getElementById("sheet").hidden = true;
      document.getElementById("sheet-back").hidden = true;
      document.getElementById("more-btn").setAttribute("aria-expanded", "false");
    },
    logout: function () { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} location.href = "index.html"; },
    reset: function () { const lang = state.lang; state = seed(); state.lang = lang; save(); render(); },
    print: function () { window.print(); },
    weekMove: function (id) {
      weekShift = Number(id) ? weekShift + Number(id) : 0;
      render();
    },
    delEvent: function (id) { state.personal = state.personal.filter(function (e) { return e.id !== id; }); editingEvent = ""; save(); render(); },
    checkEvent: function (id) {
      const ev = find(state.personal, id);
      if (ev) { ev.done = !ev.done; save(); render(); }
    },
    editEvent: function (id) {
      editingEvent = id;
      render();
      const card = document.querySelector(".add-event--edit");
      if (card) { card.scrollIntoView({ block: "center", behavior: "smooth" }); document.getElementById("ev-title").focus({ preventScroll: true }); }
    },
    cancelEdit: function () { editingEvent = ""; render(); },
    toggleDone: function (id) {
      const i = state.done.indexOf(id);
      if (i >= 0) state.done.splice(i, 1); else state.done.push(id);
      save(); render();
    },
    retake: function (id) { retakeId = id; previewResult = null; render(); window.scrollTo(0, 0); },
    pay: function (id) {
      account.package = { id: id, date: iso(day(0)) };
      saveAccount();
      location.hash = go("dashboard");
    },
    /* банк заданий */
    bankFav: function (id) {
      const i = state.bankFav.indexOf(id);
      if (i >= 0) state.bankFav.splice(i, 1); else state.bankFav.push(id);
      save(); render();
    },
    bankRetry: function (id) { bankRetry[id] = true; bankShow[id] = false; render(); focusOn("#bt-" + id + " .bt-input"); },
    bankSolution: function (id) { bankShow[id] = true; render(); },
    bankReport: function (id) { bankReportOpen = bankReportOpen === id ? "" : id; render(); if (bankReportOpen) focusOn("#rep-" + id); },
    bankNew: function () { bankEdit = "new"; bankImg = ""; render(); window.scrollTo(0, 0); focusOn("#bf-topic"); },
    bankEditTask: function (id) { const q = find(state.bank, id); bankEdit = id; bankImg = q.img || ""; render(); window.scrollTo(0, 0); },
    bankCancel: function () { bankEdit = ""; bankImg = ""; render(); },
    bankDel: function (id) {
      if (!ask(t("del") + "?")) return;
      state.bank = state.bank.filter(function (q) { return q.id !== id; });
      save(); render();
    },
    bankResolve: function (id) { find(state.bankReports, id).done = true; save(); render(); },
    bankNoImage: function () {
      bankImg = "";
      const img = document.querySelector(".bf-img"), del = document.querySelector(".bf-noimg");
      if (img) img.hidden = true;
      if (del) del.hidden = true;
    },
    /* конструктор курсов */
    togglePlus: function (id, node) {
      const menu = document.getElementById("pm-" + id);
      const open = menu.hidden;
      closeMenus();
      menu.hidden = !open;
      node.setAttribute("aria-expanded", String(open));
      if (node.classList) node.classList.toggle("plus--open", open);
      const first = open && menu.querySelector && menu.querySelector(".pm-item:not([disabled])");
      if (first && first.focus) first.focus();
    },
    newCourse: function (folderId) {
      const c = { id: uid("c"), owner: "teacher", subject: TEACHERS.teacher.subjects[0], folder: folderId || "", status: "draft", groups: Object.keys(GROUPS), cover: "", title: "", desc: "", items: [] };
      state.courses.push(c);
      save();
      location.hash = go("tcourse", c.id);
    },
    newFolder: function () {
      const f = { id: uid("f"), name: t("new_folder") };
      state.folders.push(f);
      save();
      location.hash = go("content", f.id);
    },
    delFolder: function (id) {
      if (!ask(t("del_folder_q"))) return;
      state.courses.forEach(function (c) { if (c.folder === id) c.folder = ""; });
      state.folders = state.folders.filter(function (f) { return f.id !== id; });
      save();
      location.hash = go("content");
    },
    coursePanel: function (id) { coursePanel = coursePanel === id ? "" : id; render(); },
    delCourse: function (id) {
      if (!ask(t("del_course_q"))) return;
      state.courses = state.courses.filter(function (c) { return c.id !== id; });
      save();
      location.hash = go("content");
    },
    delCover: function (id) { findCourse(id).cover = ""; save(); render(); },
    addModule: function (id) {
      const c = findCourse(id), m = { id: uid("md"), type: "module", title: "" };
      c.items.push(m);
      save(); render();
      focusOn("[data-id=\"" + c.id + "|" + m.id + "\"]");
    },
    moveItem: function (id) { const p = id.split("|"); moveIn(findCourse(p[0]).items, p[1], p[2]); save(); render(); },
    delItem: function (id) {
      const p = id.split("|"), c = findCourse(p[0]), it = find(c.items, p[1]);
      if (it.type === "lesson" && !ask(t("del_lesson_q"))) return;
      c.items = c.items.filter(function (x) { return x.id !== p[1]; });
      save(); render();
    },
    newLesson: function (kind) {
      const c = findCourse(param);
      const l = kind === "webinar"
        ? { id: uid("l"), type: "lesson", kind: "webinar", title: "", desc: "", source: "room", url: "", date: iso(day(1)), time: "18:00", dur: "45", pages: [] }
        : { id: uid("l"), type: "lesson", kind: "exam", title: "", desc: "", hwKind: "hw", due: iso(day(7)), pass: "80", pages: [newPage()] };
      c.items.push(l);
      closeMenus(); buildPage = "";
      save();
      location.hash = go("build", l.id);
    },
    openPicker: function () { closeMenus(); picker = param; render(); focusOn(".tpl"); },
    closePicker: function () { picker = ""; render(); },
    useTemplate: function (id) {
      const c = findCourse(picker);
      const l = { id: uid("l"), type: "lesson", kind: "lesson", title: "", desc: "", pages: templatePages(id) };
      c.items.push(l);
      picker = ""; buildPage = "";
      save();
      location.hash = go("build", l.id);
    },
    addBlock: function (type) {
      const l = findLesson(param).lesson;
      const pg = find(l.pages, buildPage) || l.pages[l.pages.length - 1];
      const bl = newBlock(type);
      pg.blocks.push(bl);
      buildPage = pg.id;
      save(); render();
      focusOn("#blk-" + bl.id + " input[type=text], #blk-" + bl.id + " textarea, #blk-" + bl.id + " .bpick");
    },
    moveBlock: function (id) { const f = findBlock(id); moveIn(f.page.blocks, f.block.id, f.extra); save(); render(); },
    delBlock: function (id) { const f = findBlock(id); f.page.blocks = f.page.blocks.filter(function (x) { return x !== f.block; }); save(); render(); },
    addOption: function (id) {
      const f = findBlock(id);
      f.block.options.push("");
      save(); render();
      focusOn("[data-change=\"blkOption\"][data-id=\"" + id + "|" + (f.block.options.length - 1) + "\"]");
    },
    delOption: function (id) {
      const f = findBlock(id), j = Number(f.extra);
      f.block.options.splice(j, 1);
      f.block.correct = f.block.correct.filter(function (k) { return k !== j; }).map(function (k) { return k > j ? k - 1 : k; });
      save(); render();
    },
    addPage: function (id) {
      const l = findLesson(id).lesson, pg = newPage();
      l.pages.push(pg);
      buildPage = pg.id;
      save(); render();
      focusOn("[data-page=\"" + pg.id + "\"] .ghost--page");
    },
    delPage: function (id) {
      const f = findBlock(id);
      if (f.page.blocks.length && !ask(t("del_page") + "?")) return;
      f.lesson.pages = f.lesson.pages.filter(function (x) { return x !== f.page; });
      save(); render();
    },
    movePage: function (id) { const p = id.split("|"); moveIn(findLesson(p[0]).lesson.pages, p[1], p[2]); save(); render(); },
    lessonStep: function (id) {
      const nodes = document.querySelectorAll(".lpage[data-step]");
      nodes.forEach(function (n) { n.hidden = n.dataset.step !== String(id); });
      const finish = document.querySelector(".lfinish");
      if (finish) finish.hidden = Number(id) !== nodes.length - 1;
      const form = document.querySelector(".lform");
      if (form && form.scrollIntoView) form.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    play: function () {
      const button = document.getElementById("vid-play");
      if (video.timer) { stopVideo(); button.textContent = t("play"); return; }
      button.textContent = t("pause");
      video.timer = setInterval(function () {
        video.time = Math.min(video.duration, video.time + 0.25 * video.speed);
        document.getElementById("vid-range").value = video.time;
        document.getElementById("vid-time").textContent = clock(video.time) + " / " + clock(video.duration);
        if (video.time >= video.duration) { stopVideo(); button.textContent = t("play"); }
      }, 250);
    },
    boardTool: function (id, node) {
      room.tool = id;
      document.querySelectorAll(".tool").forEach(function (b) { b.classList.toggle("on", b === node); });
      if (id === "text") document.getElementById("board-text").focus();
    },
    boardColor: function (id, node) {
      room.color = id;
      if (room.tool === "eraser") ACT.boardTool("pen", document.querySelector(".tool[data-id='pen']"));
      document.querySelectorAll(".swatch").forEach(function (b) { b.classList.toggle("on", b === node); });
    },
    boardClear: function () {
      const canvas = document.getElementById("board");
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      room.snapshot = null;
    },
    roomToggle: function (id) { room[id] = !room[id]; refreshRoom(); }
  };

  const CHANGE = {
    lang: function (node) { state.lang = node.value; save(); render(); },
    tg: function (node) { state.tg[node.dataset.id] = node.checked; save(); },
    reportDays: function (node) { reportDays = Number(node.value); render(); },
    bankImage: function (node) {
      readFile(node.files[0], function (result) {
        const err = document.getElementById("bf-img-error");
        if (!result) { err.hidden = false; return; }
        err.hidden = true;
        bankImg = result;
        const img = document.querySelector(".bf-img"), del = document.querySelector(".bf-noimg");
        img.src = result; img.hidden = false; del.hidden = false;
      });
    },
    bankFormSet: function (node) {
      /* при смене раздела меняются поля «номер / уровень» и «часть»: сохраняем введённое и перерисовываем форму */
      const form = node.closest("form");
      const keep = { text: form.querySelector("#bf-text").value, topic: form.querySelector("#bf-topic").value, answer: form.querySelector("#bf-answer").value, solution: form.querySelector("#bf-sol").value };
      param = node.value;
      render();
      ["text", "topic", "answer"].forEach(function (k) { document.getElementById("bf-" + k).value = keep[k]; });
      document.getElementById("bf-sol").value = keep.solution;
    },
    /* конструктор курсов: поля сохраняются сразу, без перерисовки (чтобы не сбивать курсор) */
    folderName: function (node) { find(state.folders, node.dataset.id).name = node.value.trim(); save(); },
    courseField: function (node) {
      const c = findCourse(node.dataset.id), field = node.dataset.field;
      c[field] = field === "title" || field === "desc" ? node.value.trim() : node.value;
      save();
      if (field === "status" || field === "subject" || field === "folder") render();
    },
    courseGroup: function (node) {
      const p = node.dataset.id.split("|"), c = findCourse(p[0]);
      c.groups = c.groups.filter(function (g) { return g !== p[1]; });
      if (node.checked) c.groups.push(p[1]);
      save();
    },
    courseCover: function (node) {
      const c = findCourse(node.dataset.id);
      readFile(node.files[0], function (result) {
        if (!result) { document.getElementById("cover-error").hidden = false; return; }
        const old = c.cover;
        c.cover = result;
        if (!save()) { c.cover = old; document.getElementById("cover-error").textContent = t("storage_full"); document.getElementById("cover-error").hidden = false; return; }
        render();
      });
    },
    itemTitle: function (node) {
      const p = node.dataset.id.split("|");
      find(findCourse(p[0]).items, p[1]).title = node.value.trim();
      save();
    },
    lessonField: function (node) {
      const field = node.dataset.field;
      findLesson(node.dataset.id).lesson[field] = node.value.trim();
      save();
      if (field === "source" || field === "url") render();
    },
    pageField: function (node) { findBlock(node.dataset.id).page.title = node.value.trim(); save(); },
    blk: function (node) { findBlock(node.dataset.id).block[node.dataset.field] = node.value; save(); },
    blkOption: function (node) { const f = findBlock(node.dataset.id); f.block.options[Number(f.extra)] = node.value; save(); },
    blkCorrect: function (node) {
      const f = findBlock(node.dataset.id), j = Number(f.extra);
      f.block.correct = f.block.correct.filter(function (k) { return k !== j; });
      if (node.checked) f.block.correct.push(j);
      f.block.correct.sort();
      save();
    },
    blkImage: function (node) {
      const f = findBlock(node.dataset.id);
      const err = node.closest(".bblock").querySelector(".auth-error");
      readFile(node.files[0], function (result) {
        if (!result) { err.hidden = false; return; }
        const old = f.block.src;
        f.block.src = result;
        if (!save()) { f.block.src = old; err.textContent = t("storage_full"); err.hidden = false; return; }
        render();
      });
    },
    blkFile: function (node) {
      const file = node.files[0];
      if (!file) return;
      findBlock(node.dataset.id).block.name = file.name;
      save(); render();
    },
    seek: function (node) {
      video.time = Number(node.value);
      document.getElementById("vid-time").textContent = clock(video.time) + " / " + clock(video.duration);
    },
    speed: function (node) { video.speed = Number(node.value); },
    boardFile: function (node) {
      const file = node.files[0];
      if (!file) return;
      if (file.type === "application/pdf") { pushChat(t("file_attached") + ": " + file.name); node.value = ""; return; }
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.onload = function () {
          const canvas = document.getElementById("board");
          const ratio = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
          const g = canvas.getContext("2d");
          g.globalCompositeOperation = "source-over";
          g.drawImage(img, (canvas.width - img.width * ratio) / 2, (canvas.height - img.height * ratio) / 2, img.width * ratio, img.height * ratio);
          room.snapshot = canvas.toDataURL();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
      node.value = "";
    }
  };

  const FORMS = {
    saveEvent: function (form, data) {
      const ev = find(state.personal, form.dataset.id);
      if (ev) {
        ev.title = data.get("title").trim(); ev.date = data.get("date") || ev.date; ev.time = data.get("time");
        weekShift = Math.floor(Math.round((parse(ev.date) - weekStart(0)) / 864e5) / 7);
      }
      editingEvent = "";
      save(); render();
    },
    addEvent: function (form, data) {
      const when = data.get("date") || iso(day(0));
      state.personal.push({ id: uid("e"), role: role, date: when, time: data.get("time"), title: data.get("title").trim() });
      weekShift = Math.floor(Math.round((parse(when) - weekStart(0)) / 864e5) / 7);
      save(); render();
    },
    chat: function (form, data) {
      const text = data.get("text").trim();
      if (text) pushChat(text);
      form.reset();
    },
    bankAnswer: function (form, data) {
      const q = find(state.bank, form.dataset.id), value = String(data.get("answer") || "").trim();
      if (!value) { focusOn("#bt-" + q.id + " .bt-input"); return; }
      const prev = state.bankProgress[q.id], ok = bankAccepts(q, value);
      state.bankProgress[q.id] = { status: ok ? "right" : "wrong", answer: value, tries: (prev ? prev.tries : 0) + 1, date: iso(day(0)) };
      q.stats = q.stats || { tries: 0, right: 0 };
      q.stats.tries++; if (ok) q.stats.right++;
      bankRetry[q.id] = false;
      save(); render();
    },
    bankReport: function (form, data) {
      const text = String(data.get("text") || "").trim();
      if (!text) return;
      state.bankReports.push({ id: uid("r"), task: form.dataset.id, from: me().name, text: text, date: iso(day(0)), done: false });
      bankReportOpen = ""; bankThanks[form.dataset.id] = true;
      save(); render();
    },
    bankSave: function (form, data) {
      const set = bankSet(data.get("set"));
      const fields = { set: set.id, num: set.levels ? data.get("num") : Number(data.get("num")), part: set.parts ? Number(data.get("part")) : set.levels ? 0 : 1, topic: data.get("topic").trim(), text: data.get("text").trim(), answer: data.get("answer").trim(), solution: data.get("solution").trim(), img: bankImg };
      const q = form.dataset.id && find(state.bank, form.dataset.id);
      if (q) Object.assign(q, fields);
      else state.bank.push(Object.assign({ id: uid("q"), author: "teacher", stats: { tries: 0, right: 0 } }, fields));
      bankEdit = ""; bankImg = "";
      if (!save() && typeof alert === "function") { alert(t("storage_full")); return; }
      param = set.id;
      if (location.hash === go("bank", set.id)) render(); else location.hash = go("bank", set.id);
    },
    /* урок: проверка ответов. Пустые ответы не принимаются; у преподавателя в просмотре ничего не сохраняется */
    lesson: function (form, data) {
      const l = findLesson(form.dataset.id).lesson;
      const answers = {};
      let score = 0, total = 0, missing = -1;
      l.pages.forEach(function (p, pi) {
        p.blocks.forEach(function (bl) {
          if (TASK_TYPES.indexOf(bl.type) < 0) return;
          let a;
          if (bl.type === "test") {
            if (bl.correct.length > 1) a = bl.options.map(function (o, j) { return data.get(bl.id + "_" + j) !== null ? j : -1; }).filter(function (j) { return j >= 0; });
            else { const v = data.get(bl.id); a = v === null ? [] : [Number(v)]; }
            if (!a.length && missing < 0) missing = pi;
            if (bl.correct.length) {
              total++;
              if (a.length === bl.correct.length && a.every(function (j) { return bl.correct.indexOf(j) >= 0; })) score++;
            }
          } else {
            a = String(data.get(bl.id) || "").trim();
            if (!a && missing < 0) missing = pi;
            if (bl.type === "input" && String(bl.answer || "").trim()) {
              total++;
              if (String(bl.answer).split(";").map(norm).filter(Boolean).indexOf(norm(a)) >= 0) score++;
            }
          }
          answers[bl.id] = a;
        });
      });
      if (missing >= 0) {
        const err = document.getElementById("lesson-error");
        err.textContent = t("answer_all_page") + " " + (missing + 1) + ".";
        err.hidden = false;
        return;
      }
      const r = { score: score, total: total, answers: answers, date: iso(day(0)), open: blocksOf(l).filter(function (bl) { return bl.type === "open"; }).length };
      if (form.dataset.preview) { previewResult = r; render(); window.scrollTo(0, 0); return; }
      state.results[l.id] = r;
      if (!isDone(l.id)) state.done.push(l.id);
      retakeId = null;
      save(); render(); window.scrollTo(0, 0);
    },
    diag: function (form, data) {
      const s = CATALOG.subject(form.dataset.id);
      const answers = s.questions.map(function (q, i) { return data.get("q" + i) === null ? null : Number(data.get("q" + i)); });
      if (answers.indexOf(null) >= 0) { document.getElementById("test-error").hidden = false; return; }
      const score = answers.filter(function (a, i) { return a === s.questions[i].correct; }).length;
      account.diag[s.id] = { score: score, total: s.questions.length, level: CATALOG.level(s.id, score), date: iso(day(0)) };
      saveAccount(); render(); window.scrollTo(0, 0);
    },
    submitHw: function (form, data) {
      const h = find(state.homework, form.dataset.id), file = data.get("file");
      readFile(file, function (result) {
        h.file = { name: file.name, fresh: true };
        if (result) h.file.data = result;
        h.status = "review";
        save(); render();
      });
    },
    grade: function (form, data) {
      if (form.dataset.id.indexOf("x-") === 0) {
        const r = state.results[form.dataset.id.slice(2)];
        r.teacherGrade = Number(data.get("grade"));
        r.comment = data.get("comment").trim();
        r.gradedAt = iso(day(0));
        save();
        if (location.hash === go("review")) render(); else location.hash = go("review");
        return;
      }
      const h = find(state.homework, form.dataset.id);
      h.status = "graded";
      h.grade = Number(data.get("grade"));
      h.comment = data.get("comment").trim();
      h.gradedAt = iso(day(0));
      save();
      if (location.hash === go("review")) render(); else location.hash = go("review");
    }
  };

  document.addEventListener("click", function (event) {
    if (!event.target.closest || !event.target.closest(".plus-wrap")) closeMenus();
    const node = event.target.closest("[data-act]");
    if (node) ACT[node.dataset.act](node.dataset.id, node);
  });
  document.addEventListener("change", function (event) {
    const node = event.target.closest("[data-change]");
    if (node) CHANGE[node.dataset.change](node);
  });
  document.addEventListener("submit", function (event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    FORMS[form.dataset.form](form, new FormData(form));
  });
  document.addEventListener("keydown", function (event) {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[role=button][data-act]")) { event.preventDefault(); event.target.click(); }
    if (event.key === "Escape") { closeMenus(); if (picker) { picker = ""; render(); } }
  });
  /* свои дела в расписании: перетаскивание на другой день */
  document.addEventListener("dragstart", function (event) {
    const item = event.target.closest && event.target.closest("[data-drag]");
    if (!item) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.dataset.drag);
    item.classList.add("wl--dragging");
    document.querySelector(".week").classList.add("week--dragging");
  });
  document.addEventListener("dragend", function () {
    document.querySelectorAll(".wl--dragging, .week--dragging, .wday--drop").forEach(function (n) { n.classList.remove("wl--dragging", "week--dragging", "wday--drop"); });
  });
  document.addEventListener("dragover", function (event) {
    const dayNode = event.target.closest && event.target.closest(".wday[data-date]");
    if (!dayNode || !document.querySelector(".wl--dragging")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".wday--drop").forEach(function (n) { if (n !== dayNode) n.classList.remove("wday--drop"); });
    dayNode.classList.add("wday--drop");
  });
  document.addEventListener("drop", function (event) {
    const dayNode = event.target.closest && event.target.closest(".wday[data-date]");
    if (!dayNode) return;
    event.preventDefault();
    const ev = find(state.personal, event.dataTransfer.getData("text/plain"));
    if (ev && ev.date !== dayNode.dataset.date) { ev.date = dayNode.dataset.date; save(); }
    render();
  });
  /* редактор урока: блоки из списка слева добавляются на страницу, где последний раз был курсор */
  function pickPage(event) {
    const pg = event.target.closest && event.target.closest("[data-page]");
    if (!pg || pg.dataset.page === buildPage) return;
    buildPage = pg.dataset.page;
    document.querySelectorAll(".bpage--active").forEach(function (n) { n.classList.remove("bpage--active"); });
    pg.classList.add("bpage--active");
  }
  document.addEventListener("focusin", pickPage);
  /* поля-заголовки растут по высоте текста; в однострочных Enter не переносит строку */
  function fitArea(node) { node.style.height = "auto"; node.style.height = node.scrollHeight + "px"; }
  document.addEventListener("input", function (event) { if (event.target.matches && event.target.matches("textarea.ghost")) fitArea(event.target); });
  document.addEventListener("keydown", function (event) { if (event.key === "Enter" && event.target.matches && event.target.matches("[data-oneline]")) { event.preventDefault(); event.target.blur(); } });
  document.addEventListener("pointerdown", pickPage);
  window.addEventListener("hashchange", function () { bankReportOpen = ""; if (!/\/bank/.test(location.hash)) bankEdit = ""; editingEvent = ""; picker = ""; previewResult = null; retakeId = null; coursePanel = ""; render(true); window.scrollTo(0, 0); });
  render(true);
})();
