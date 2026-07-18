# Запуск CareerHub локально

Проект состоит из двух серверов, поэтому нужны два терминала в папке проекта.

## 1. Backend: Django и база данных

Убедитесь, что PostgreSQL запущен на порту `2606` и существует локальный файл `.env`.

В первом терминале выполните:

```powershell
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver
```

Backend будет доступен по адресу `http://127.0.0.1:8000`.

Это API, поэтому адрес `http://127.0.0.1:8000/` может вернуть 404 — это ожидаемо. Документация API находится по адресу `http://127.0.0.1:8000/api/docs/`.

## 2. Frontend: React / Vite

Во втором терминале выполните:

```powershell
npm.cmd run dev
```

Откройте в браузере адрес, который выведет Vite. Обычно это `http://localhost:5173/`.

Именно `http://localhost:5173/` — сайт CareerHub, а не порт `8000`.

## Если запускаете впервые

```powershell
npm.cmd ci
```

После этого повторите команды из двух разделов выше.

## Быстрая проверка

```powershell
.\.venv\Scripts\python.exe manage.py check
npm.cmd run build
```
