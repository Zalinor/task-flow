# Task Flow

A Kanban board app built with React — drag-n-drop tasks and columns, task details, comments, filtering, and more.

🔗 **[Live demo](https://zalinor.github.io/task-flow/)**

<!-- ![Screenshot](./screenshot.png) -->

## Features

- Drag-n-drop for tasks (between and within columns) and for columns themselves
- Task priorities (High / Medium / Low) with color-coded badges
- Task details view: description, due date, status, comments
- Comments on tasks (persisted locally)
- Quick task creation per column, plus a general "Add Task" button
- Filtering by status and priority, with sorting by due date
- A configurable "final" column — tasks there are shown as completed (strikethrough)
- Empty-state screen when the board has no columns yet

## Tech stack

- React + Vite
- Plain CSS (no preprocessors, no CSS-in-JS)
- Data persisted in `localStorage`

## Running locally

```bash
git clone https://github.com/Zalinor/task-flow.git
cd task-flow
npm install
npm run dev
```

## Roadmap

- Discussions/comments threads
- Backend with users and sessions (for real assignees and permissions)

---

# Task Flow

Канбан-приложение на React — drag-n-drop задач и колонок, детальный просмотр задач, комментарии, фильтрация и многое другое.

🔗 **[Живая демка](https://zalinor.github.io/task-flow/)**

<!-- ![Скриншот](./screenshot.png) -->

## Возможности

- Drag-n-drop задач (между колонками и внутри колонки) и самих колонок
- Приоритеты задач (High / Medium / Low) с цветными бейджами
- Детальный просмотр задачи: описание, дедлайн, статус, комментарии
- Комментарии к задачам (сохраняются локально)
- Быстрое создание задачи прямо в колонке, плюс общая кнопка "Add Task"
- Фильтрация по статусу и приоритету, сортировка по дедлайну
- Настраиваемая "финальная" колонка — задачи в ней отображаются как выполненные (зачёркнуто)
- Экран пустого состояния, когда на доске ещё нет колонок

## Технологии

- React + Vite
- Чистый CSS (без препроцессоров и CSS-in-JS)
- Данные хранятся в `localStorage`

## Планы на будущее

- Вложения
- Обсуждения/треды комментариев
- Бэкенд с пользователями и сессиями (для реальных Assigned и прав доступа)
