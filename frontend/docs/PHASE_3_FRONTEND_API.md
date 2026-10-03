# Phase 3 — اتصال Frontend به API

این فاز جریان اصلی داده آگهی را از Mock/State محلی به Backend منتقل می‌کند.

## متصل شده
- دریافت آگهی‌های عمومی از `GET /api/ads`
- دریافت آگهی‌های صف مدیریت برای Moderator/Super Admin
- ثبت آگهی با `POST /api/ads`
- تأیید/رد آگهی با API
- حذف/آرشیو آگهی با API
- Heart با محدودیت یک واکنش برای هر کاربر
- ثبت پیام تسلیت در Backend با وضعیت pending
- Session احراز هویت از Cookie HttpOnly
- حذف PII از پاسخ عمومی آگهی

## عمداً در این فاز باقی مانده
- پرداخت واقعی و تراکنش‌ها: فاز ۴
- مدیریت دائمی قالب‌ها/Appearance: فاز بعدی
- Location Directory API: فاز بعدی
- Moderation کامل کامنت‌ها: تکمیل در فاز امنیت/Moderation

## راه‌اندازی
1. PostgreSQL را اجرا کنید.
2. `database/schema.sql` را اجرا کنید.
3. `.env` را از `.env.example` بسازید.
4. Backend را با `npm run server` اجرا کنید.
5. Frontend را با `npm run dev` اجرا کنید.
6. در صورت جدا بودن Origin، `VITE_API_URL` را روی آدرس API تنظیم کنید.
