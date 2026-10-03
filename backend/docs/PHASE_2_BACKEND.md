# Phase 2 — Backend, PostgreSQL, Authentication & RBAC

این فاز زیرساخت واقعی Backend را به پروژه اضافه می‌کند.

## اجزای اضافه‌شده
- Express API
- PostgreSQL schema
- Session امن با Cookie از نوع HttpOnly
- OTP یک‌بارمصرف سمت سرور با Hash/HMAC
- محدودیت ارسال OTP و تعداد تلاش
- احراز هویت کاربر با `/api/auth/*`
- درخواست احراز هویت صاحب عزا با وضعیت `pending`
- Admin login سمت سرور با scrypt و Session امن
- RBAC و Permission tables
- Audit Log سمت سرور
- Security headers پایه
- API client برای Frontend

## راه‌اندازی
1. PostgreSQL بسازید و `DATABASE_URL` را تنظیم کنید.
2. `database/schema.sql` را اجرا کنید.
3. متغیرهای `.env` را از روی `.env.example` بسازید.
4. برای Admin یک Hash بسازید:
   `npm run hash:password -- "YOUR_STRONG_PASSWORD"`
5. Hash خروجی را در `ADMIN_PASSWORD_HASH` قرار دهید.
6. در Development، `OTP_DELIVERY=console` کد OTP را فقط در لاگ سرور چاپ می‌کند؛ هرگز در API response یا Browser نمایش داده نمی‌شود.
7. Production باید Provider واقعی SMS/Email/Telegram/WhatsApp را جایگزین حالت console کند.

## APIهای اصلی
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/owner-verification`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/logout`
- `GET /health`

## نکته امنیتی
احراز هویت صاحب عزا در این فاز **تأیید هویت واقعی دولتی/ثبت‌احوالی نیست**. اطلاعات کد ملی فقط به‌صورت HMAC ذخیره می‌شود و درخواست در وضعیت `pending` قرار می‌گیرد تا در فاز بعد Provider رسمی یا فرآیند Manual Review متصل شود.

## آگهی‌ها
- `GET /api/ads?status=approved`
- `GET /api/ads/:id`
- `POST /api/ads` با Permission `AD_CREATE`
- `PATCH /api/ads/:id` فقط مالک یا مدیر
- `POST /api/ads/:id/approve` با Permission `AD_APPROVE`
- `POST /api/ads/:id/reject` با Permission `AD_REJECT`
- `POST /api/ads/:id/heart` با Unique Constraint ضد تکرار

> payload آگهی فعلاً JSONB است تا در فاز اتصال دامنه، مدل‌های `deceased` و `ceremonies` به جداول نرمال‌شده تبدیل شوند.
