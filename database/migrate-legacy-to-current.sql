BEGIN;

-- =========================================================
-- Amvatgram - Legacy DB Compatibility Migration
-- =========================================================
-- هدف:
-- 1) حفظ کامل جداول و داده‌های قدیمی
-- 2) سازگار کردن users قدیمی با Backend جدید
-- 3) ایجاد جداول موردنیاز Backend جدید
-- 4) حفظ users.id به صورت TEXT
-- =========================================================


-- =========================================================
-- 1. Extend legacy users table
-- =========================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email VARCHAR(320),
  ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(128),
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN,
  ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(32),
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;


-- انتقال اطلاعات قدیمی به ستون‌های جدید
UPDATE users
SET
  full_name = COALESCE(NULLIF(full_name, ''), NULLIF(name, ''), 'کاربر امواتگرام'),
  is_verified = COALESCE(is_verified, verified, FALSE),
  subscription_plan = COALESCE(subscription_plan, 'none');


-- نرمال‌سازی مذهب
UPDATE users
SET madhhab = LOWER(madhhab)
WHERE madhhab IS NOT NULL;


-- مقادیر خالی/نامعتبر را به sunni تبدیل نمی‌کنیم؛
-- فقط NULL را برای کاربرانی که مقدار ندارند، به sunni می‌دهیم.
UPDATE users
SET madhhab = 'sunni'
WHERE madhhab IS NULL OR TRIM(madhhab) = '';


-- هماهنگ کردن full_name
UPDATE users
SET full_name = COALESCE(NULLIF(full_name, ''), 'کاربر امواتگرام')
WHERE full_name IS NULL OR TRIM(full_name) = '';


-- مقادیر پیش‌فرض منطقی برای کاربران قدیمی
UPDATE users
SET is_verified = FALSE
WHERE is_verified IS NULL;

UPDATE users
SET subscription_plan = 'none'
WHERE subscription_plan IS NULL OR subscription_plan = '';


-- Index/unique constraints فقط برای مقادیر غیر NULL
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email
  ON users(email)
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_telegram_id
  ON users(telegram_id)
  WHERE telegram_id IS NOT NULL;


-- =========================================================
-- 2. OTP challenges
-- =========================================================

CREATE TABLE IF NOT EXISTS otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination VARCHAR(320) NOT NULL,
  provider VARCHAR(20) NOT NULL
    CHECK (provider IN ('sms','email','telegram','whatsapp')),
  code_hash VARCHAR(128) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_destination_created
  ON otp_challenges(destination, created_at DESC);


-- =========================================================
-- 3. Sessions
-- =========================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_user
  ON sessions(user_id);


-- =========================================================
-- 4. Ads
-- =========================================================

CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code VARCHAR(32) UNIQUE NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(24) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('draft','pending','approved','rejected','archived','suspended')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  rejection_reason TEXT,
  view_count INTEGER NOT NULL DEFAULT 0
    CHECK (view_count >= 0),
  heart_count INTEGER NOT NULL DEFAULT 0
    CHECK (heart_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ads_status_created
  ON ads(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ads_owner
  ON ads(owner_id);


-- =========================================================
-- 5. Locations
-- =========================================================

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(300) NOT NULL,
  city VARCHAR(120) NOT NULL,
  neighborhood VARCHAR(160) NOT NULL DEFAULT '',
  address VARCHAR(500) NOT NULL,
  lat DOUBLE PRECISION NOT NULL
    CHECK (lat BETWEEN -90 AND 90),
  lng DOUBLE PRECISION NOT NULL
    CHECK (lng BETWEEN -180 AND 180),
  khadem_phone VARCHAR(32),
  type VARCHAR(32) NOT NULL
    CHECK (type IN ('mosque','cemetery','hall','hussainiya')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_city_type
  ON locations(city,type);


-- =========================================================
-- 6. Frame prices
-- =========================================================

CREATE TABLE IF NOT EXISTS frame_prices (
  frame_id VARCHAR(128) PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  price_toman BIGINT NOT NULL
    CHECK (price_toman >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO frame_prices(frame_id,title,price_toman)
VALUES
  ('frame-free-classic','کلاسیک وقار (ساده و سنگین)',0),
  ('frame-free-spiritual','معنوی اسلیمی (طرح محراب مساجد)',0),
  ('frame-eco-elder','بزرگ خاندان و پیشکسوتان (طرح وقار)',49000),
  ('frame-eco-youth','جوان ناکام و پروانه‌ای (طرح سپهر)',59000),
  ('frame-eco-mother','مادر دلسوز و بانوی فداکار (طرح نیلوفر)',59000),
  ('frame-lux-royal-gold','زرین سلطنتی (طرح خورشید ابدی VIP)',149000),
  ('frame-lux-angelic-child','فرشته آسمانی (ویژه کودکان و نونهالان)',119000),
  ('frame-lux-honorable-dignitary','شخصیت‌های برجسته و مفاخر ماندگار',189000)
ON CONFLICT (frame_id) DO NOTHING;


-- =========================================================
-- 7. Payment intents
-- =========================================================

CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  purpose VARCHAR(32) NOT NULL
    CHECK (purpose IN ('frame','subscription')),
  reference_id VARCHAR(128),
  gateway VARCHAR(32) NOT NULL
    CHECK (gateway IN ('saman','zarinpal','mellat')),
  amount_toman BIGINT NOT NULL
    CHECK (amount_toman > 0),
  status VARCHAR(24) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','successful','failed','expired','refunded')),
  tracking_code VARCHAR(64) UNIQUE NOT NULL,
  authority VARCHAR(200),
  reference_number VARCHAR(200),
  card_mask VARCHAR(32),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT
    (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_user_created
  ON payment_intents(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_status
  ON payment_intents(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_consumed
  ON payment_intents(consumed_at)
  WHERE consumed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_authority
  ON payment_intents(authority)
  WHERE authority IS NOT NULL;


-- =========================================================
-- 8. Ad comments
-- =========================================================

CREATE TABLE IF NOT EXISTS ad_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(200) NOT NULL,
  text TEXT NOT NULL
    CHECK (char_length(text) BETWEEN 1 AND 2000),
  status VARCHAR(24) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_comments_ad_created
  ON ad_comments(ad_id, created_at DESC);


-- =========================================================
-- 9. Webhook events
-- =========================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway VARCHAR(32) NOT NULL,
  event_id VARCHAR(200) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gateway, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_created
  ON webhook_events(created_at DESC);


-- =========================================================
-- 10. Ad reactions
-- =========================================================

CREATE TABLE IF NOT EXISTS ad_reactions (
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(ad_id, user_id)
);


-- =========================================================
-- 11. Owner verification
-- =========================================================

CREATE TABLE IF NOT EXISTS owner_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_national_code_hash VARCHAR(128) NOT NULL,
  deceased_national_code_hash VARCHAR(128) NOT NULL,
  relation VARCHAR(80) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','verified','rejected','manual_review')),
  provider VARCHAR(80),
  provider_reference VARCHAR(200),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_owner_verifications_user
  ON owner_verifications(user_id);


-- =========================================================
-- 12. Roles
-- =========================================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);


-- =========================================================
-- 13. Permissions
-- =========================================================

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL
);


-- =========================================================
-- 14. Role permissions
-- =========================================================

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(role_id, permission_id)
);


-- =========================================================
-- 15. Audit logs
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(32),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(200),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created
  ON audit_logs(created_at DESC);


-- =========================================================
-- 16. Roles seed
-- =========================================================

INSERT INTO roles(name)
VALUES
  ('user'),
  ('owner'),
  ('moderator'),
  ('super_admin')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 17. Permissions seed
-- =========================================================

INSERT INTO permissions(name)
VALUES
  ('AD_CREATE'),
  ('AD_READ'),
  ('AD_EDIT_OWN'),
  ('AD_APPROVE'),
  ('AD_REJECT'),
  ('AD_DELETE'),
  ('PAYMENT_READ'),
  ('PAYMENT_VERIFY'),
  ('PAYMENT_CREATE'),
  ('FRAME_PRICE_MANAGE'),
  ('LOCATION_MANAGE'),
  ('AUDIT_READ'),
  ('USER_MANAGE'),
  ('COMMENT_APPROVE'),
  ('COMMENT_REJECT'),
  ('COMMENT_HIDE'),
  ('APPEARANCE_MANAGE')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 18. User permissions
-- =========================================================

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'user'
  AND p.name IN (
    'AD_CREATE',
    'AD_READ',
    'AD_EDIT_OWN',
    'PAYMENT_CREATE'
  )
ON CONFLICT DO NOTHING;


-- =========================================================
-- 19. Owner permissions
-- =========================================================

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'owner'
  AND p.name IN (
    'AD_CREATE',
    'AD_READ',
    'AD_EDIT_OWN',
    'PAYMENT_CREATE'
  )
ON CONFLICT DO NOTHING;


-- =========================================================
-- 20. Moderator permissions
-- =========================================================

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'moderator'
  AND p.name IN (
    'AD_READ',
    'AD_APPROVE',
    'AD_REJECT',
    'AD_DELETE',
    'LOCATION_MANAGE',
    'AUDIT_READ',
    'COMMENT_APPROVE',
    'COMMENT_REJECT',
    'COMMENT_HIDE'
  )
ON CONFLICT DO NOTHING;


-- =========================================================
-- 21. Super admin permissions
-- =========================================================

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;


-- =========================================================
-- 22. Subscription plans
-- =========================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  duration_days INTEGER NOT NULL
    CHECK (duration_days > 0),
  price_toman BIGINT NOT NULL
    CHECK (price_toman > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO subscription_plans(
  id,
  title,
  duration_days,
  price_toman
)
VALUES
  ('1_month','اشتراک یک‌ماهه صاحب عزا',30,99000),
  ('3_months','اشتراک سه‌ماهه یادبود خاندان',90,199000),
  ('1_year','اشتراک سالانه یادبود جاودان',365,380000)
ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- 23. Finalize
-- =========================================================

COMMIT;