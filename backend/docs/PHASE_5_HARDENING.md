# فاز ۵ — Moderation, Hardening & Abuse Protection

## اجراشده

- کنترل `Origin` برای درخواست‌های state-changing با cookie session.
- هدرهای امنیتی API شامل `X-Request-Id`, `Cache-Control: no-store`, `Permissions-Policy` و `Cross-Origin-Opener-Policy`.
- کاهش سقف JSON API و اعتبارسنجی عمق/تعداد کلیدهای payload.
- پاک‌سازی ورودی‌های متنی از control character و الگوهای خطرناک HTML/JavaScript.
- Rate limit برای OTP، ورود مدیر، احراز مالکیت، ساخت آگهی، کامنت، واکنش، ایجاد Payment Intent، تأیید پرداخت و webhook.
- مدیریت کامنت‌ها با صف moderation و عملیات approve/reject/hide.
- جلوگیری از تغییر وضعیت دلخواه آگهی توسط کلاینت؛ وضعیت‌های مجاز و transitionهای moderation محدود شده‌اند.
- شمارنده‌های view/heart در DB غیرمنفی شده‌اند.
- UUIDهای حساس در routeهای اصلی اعتبارسنجی می‌شوند.
- انقضای اشتراک در backend enforce می‌شود؛ role منقضی‌شده در session به `user` تنزل مؤثر پیدا می‌کند.
- webhook پرداخت نیازمند `eventId` است و replay با `webhook_events` کنترل می‌شود؛ reuse همان event با payload متفاوت رد می‌شود.
- تأیید دستی پرداخت منقضی‌شده دیگر مجاز نیست.
- Audit Log از API خوانده می‌شود و در پنل مدیریت نمایش داده می‌شود.
- پنل مدیریت صف پیام‌های تسلیت را برای moderation در اختیار moderator/super_admin قرار می‌دهد.
- در production، secretهای حیاتی، OTP واقعی، CORS HTTPS و Payment Gateway HTTPS اجباری شده‌اند.
- مسیر local/fake برای تمدید اشتراک که role را در مرورگر تغییر می‌داد حذف شده است.

## تست

اجرای `npm run security:audit` باید همه کنترل‌های استاتیک را PASS کند.

Build/TypeScript در محیط تحویل به علت نبود `node_modules` قابل اجرای کامل نبود؛ خطاهای مشاهده‌شده از dependencyهای نصب‌نشده هستند. قبل از production باید `npm ci` و سپس `npm run lint` و `npm run build` اجرا شوند.
