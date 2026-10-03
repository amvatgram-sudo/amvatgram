# Amvatgram — Phase 1 Security Hardening

## اعمال‌شده
- حذف احراز هویت Admin با کلید ثابت از Frontend.
- غیرفعال‌سازی ارتقای نقش `super_admin` از Client State.
- حذف پذیرش OTP ثابت `123456` و تولید/نمایش OTP در مرورگر.
- حذف Session کاربر از `localStorage`; session فعلاً فقط در حافظه است.
- حذف persistence محلی آگهی‌ها، تراکنش‌ها، مکان‌ها، قالب‌ها و Audit Log تا قابل دستکاری به‌عنوان منبع حقیقت نباشند.
- ماسک کردن National IDهای داده‌های Mock.
- پنل مدیریت تا زمان وجود Backend/RBAC/MFA واقعی قفل است.

## عمداً باقی‌مانده برای فاز ۲
- OTP واقعی و SMS/WhatsApp/Telegram provider
- Owner identity verification
- Backend session با HttpOnly/Secure cookies
- PostgreSQL
- RBAC سمت سرور
- Payment gateway verification/webhooks
- Server-side audit logs
- Secure media upload
- Rate limiting و security headers
