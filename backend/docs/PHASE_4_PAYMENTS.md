# Phase 4 — Payments & Subscriptions

## هدف
پرداخت، اشتراک و فعال‌سازی خدمات پولی از حالت محلی/قابل جعل در مرورگر خارج شده و به API و PostgreSQL منتقل شده‌اند.

## تغییرات اصلی

### 1. Payment Intent
- جدول `payment_intents` برای ثبت تراکنش در وضعیت `pending/successful/failed/expired/refunded`.
- هر intent به `user_id` متصل است.
- مبلغ از سمت سرور تعیین می‌شود؛ کلاینت نمی‌تواند قیمت قالب یا اشتراک را تعیین کند.
- شناسه رهگیری و authority در سرور تولید می‌شوند.
- موفقیت پرداخت در مرورگر قابل ثبت دستی نیست.

### 2. قیمت مرجع قالب‌ها
جدول `frame_prices` منبع قیمت معتبر سمت سرور است. هنگام ساخت آگهی، اگر قالب پولی باشد:
- پرداخت باید متعلق به همان کاربر باشد.
- پرداخت باید `successful` باشد.
- مبلغ پرداخت باید دقیقاً با قیمت سروری قالب برابر باشد.
- `metadata.frameId` باید با قالب انتخابی یکی باشد.

### 3. اشتراک صاحب عزا
جدول `subscription_plans` شامل قیمت و مدت اعتبار سروری است.
پس از پرداخت موفق، سرور `subscription_plan` و `subscription_expires_at` کاربر را به‌روزرسانی می‌کند و در صورت نیاز نقش `owner` را فعال می‌کند.

فعال‌سازی اشتراک با وبهوک تکراری دوباره تمدید نمی‌شود.

### 4. Webhook
مسیر:
`POST /api/payments/webhook/:gateway`

هدر امنیتی:
`X-Amvatgram-Signature`

امضای وبهوک HMAC-SHA256 روی JSON درخواست و با `PAYMENT_WEBHOOK_SECRET` محاسبه می‌شود. برای جلوگیری از حمله timing، مقایسه با `timingSafeEqual` انجام می‌شود.

قرارداد payload:
```json
{
  "paymentId": "uuid",
  "status": "successful",
  "referenceNumber": "bank-reference",
  "cardMask": "6037-99**-****-1234"
}
```

### 5. پنل مدیریت
مدیریت تراکنش‌ها را از API می‌خواند و تراکنش‌ها دیگر از `localStorage` یا داده اولیه ساختگی تأمین نمی‌شوند.
برای شرایطی که اپراتور بعد از بررسی رسید بانکی نیاز به تأیید دستی دارد، endpoint دارای RBAC زیر وجود دارد:
`POST /api/payments/verify/:id`

این عملیات به `PAYMENT_VERIFY` نیاز دارد و شماره مرجع بانکی را ثبت می‌کند.

### 6. حذف پرداخت جعلی فرانت‌اند
منطق `setTimeout` که موفقیت پرداخت را شبیه‌سازی می‌کرد حذف شده است. فرانت‌اند فقط Payment Intent می‌سازد، کاربر را به URL درگاه می‌فرستد و وضعیت intent را از API polling می‌کند.

## پیکربندی درگاه واقعی
این پروژه عمداً درگاه بانکی را جعل نمی‌کند. برای محیط واقعی باید یک adapter/bridge واقعی برای درگاه انتخابی متصل شود.

متغیرهای جدید:
- `PAYMENT_WEBHOOK_SECRET`
- `PAYMENT_GATEWAY_BASE_URL`
- `PAYMENT_RETURN_URL`

اگر `PAYMENT_GATEWAY_BASE_URL` تنظیم نشده باشد، API عمداً `PAYMENT_GATEWAY_NOT_CONFIGURED` برمی‌گرداند و هیچ پرداخت موفق ساختگی ایجاد نمی‌کند.

برای اتصال نهایی به سامان/زرین‌پال/ملت، مشخصات پذیرنده، endpointهای رسمی و قرارداد callback/webhook همان درگاه باید در adapter سرور قرار گیرند؛ بدون این اطلاعات نباید endpoint بانکی جعلی ساخته شود.

## تست‌های انجام‌شده
- اسکن کد برای حذف شبیه‌سازی پرداخت در جریان قالب و اشتراک.
- بررسی وجود Payment Intent، Webhook و RBAC پرداخت.
- بررسی parser/typecheck با TypeScript انجام شد؛ به علت نبود `node_modules` در محیط، خطاهای dependency-resolution باقی است و build کامل قابل تأیید نیست.
