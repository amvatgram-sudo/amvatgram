# Database

این پوشه مالک ساختار PostgreSQL پروژه است.

- `schema.sql`: schema کامل دیتابیس، جدول‌ها، indexها، constraintها و seedهای لازم.
- اجرای migration از ریشه پروژه با `npm run db:migrate` انجام می‌شود.
- اتصال runtime به PostgreSQL در `backend/server/db/` قرار دارد؛ این بخش فقط لایه اتصال backend است و schema متعلق به این پوشه است.
