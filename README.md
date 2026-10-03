# امواتگرام — ساختار پروژه

پروژه به سه بخش اصلی تفکیک شده است:

- `frontend/` — رابط کاربری React/Vite
- `backend/` — API، احراز هویت، RBAC، پرداخت، moderation و سرویس‌های سمت سرور
- `database/` — schema و اجزای اختصاصی PostgreSQL

فایل‌های ریشه مانند `package.json`، `docker-compose.yml`، `.env.example` و `scripts/` برای orchestration و ابزارهای مشترک پروژه نگه داشته شده‌اند.

## ساختار

```text
amvatgram/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── frontend/Dockerfile.web
│   └── deploy/
├── backend/
│   ├── server/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── db/          # DB runtime/connection layer
│   │   └── scripts/
│   ├── backend/Dockerfile.api
│   └── docs/
├── database/
│   ├── schema.sql
│   └── docs/
├── scripts/
├── package.json
├── docker-compose.yml
├── tsconfig.json
└── .env.example
```

## اجرا

```bash
npm install
npm run db:migrate
npm run server
```

فرانت‌اند:

```bash
npm run dev
```

بررسی‌ها:

```bash
npm run security:audit
npm run production:check
npm run test:smoke
```

Docker:

```bash
docker compose up -d --build
```
