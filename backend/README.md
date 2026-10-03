# Backend

API و منطق سمت سرور پروژه در این پوشه قرار دارد.

- `server/routes/`: endpointها
- `server/middleware/`: auth/security middleware
- `server/services/`: سرویس‌های audit, crypto, validation
- `server/db/`: runtime database connection layer
- `server/scripts/`: migration runner و password hashing
- `Dockerfile.api`: image سرویس API
- `docs/`: مستندات backend و deployment

Schema اصلی PostgreSQL در `../database/schema.sql` نگهداری می‌شود.
