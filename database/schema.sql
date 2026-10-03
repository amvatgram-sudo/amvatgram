CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32),
  email VARCHAR(320),
  telegram_id VARCHAR(128),
  full_name VARCHAR(200) NOT NULL,
  avatar_url TEXT,
  madhhab VARCHAR(16) NOT NULL CHECK (madhhab IN ('sunni','shia')),
  role VARCHAR(32) NOT NULL DEFAULT 'user' CHECK (role IN ('user','owner','moderator','super_admin')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subscription_plan VARCHAR(32) NOT NULL DEFAULT 'none' CHECK (subscription_plan IN ('none','1_month','3_months','1_year')),
  subscription_expires_at TIMESTAMPTZ,
  UNIQUE(phone),
  UNIQUE(email),
  UNIQUE(telegram_id)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(32) NOT NULL DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination VARCHAR(320) NOT NULL,
  provider VARCHAR(20) NOT NULL CHECK (provider IN ('sms','email','telegram','whatsapp')),
  code_hash VARCHAR(128) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_destination_created ON otp_challenges(destination, created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);


CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code VARCHAR(32) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('draft','pending','approved','rejected','archived','suspended')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  rejection_reason TEXT,
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  heart_count INTEGER NOT NULL DEFAULT 0 CHECK (heart_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ads_status_created ON ads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_owner ON ads(owner_id);


CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(300) NOT NULL,
  city VARCHAR(120) NOT NULL,
  neighborhood VARCHAR(160) NOT NULL DEFAULT '',
  address VARCHAR(500) NOT NULL,
  lat DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng DOUBLE PRECISION NOT NULL CHECK (lng BETWEEN -180 AND 180),
  khadem_phone VARCHAR(32),
  type VARCHAR(32) NOT NULL CHECK (type IN ('mosque','cemetery','hall','hussainiya')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_city_type ON locations(city,type);

CREATE TABLE IF NOT EXISTS frame_prices (
  frame_id VARCHAR(128) PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  price_toman BIGINT NOT NULL CHECK (price_toman >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO frame_prices(frame_id,title,price_toman) VALUES
 ('frame-free-classic','کلاسیک وقار (ساده و سنگین)',0),
 ('frame-free-spiritual','معنوی اسلیمی (طرح محراب مساجد)',0),
 ('frame-eco-elder','بزرگ خاندان و پیشکسوتان (طرح وقار)',49000),
 ('frame-eco-youth','جوان ناکام و پروانه‌ای (طرح سپهر)',59000),
 ('frame-eco-mother','مادر دلسوز و بانوی فداکار (طرح نیلوفر)',59000),
 ('frame-lux-royal-gold','زرین سلطنتی (طرح خورشید ابدی VIP)',149000),
 ('frame-lux-angelic-child','فرشته آسمانی (ویژه کودکان و نونهالان)',119000),
 ('frame-lux-honorable-dignitary','شخصیت‌های برجسته و مفاخر ماندگار',189000)
ON CONFLICT (frame_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  purpose VARCHAR(32) NOT NULL CHECK (purpose IN ('frame','subscription')),
  reference_id VARCHAR(128),
  gateway VARCHAR(32) NOT NULL CHECK (gateway IN ('saman','zarinpal','mellat')),
  amount_toman BIGINT NOT NULL CHECK (amount_toman > 0),
  status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','successful','failed','expired','refunded')),
  tracking_code VARCHAR(64) UNIQUE NOT NULL,
  authority VARCHAR(200),
  reference_number VARCHAR(200),
  card_mask VARCHAR(32),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payment_user_created ON payment_intents(user_id, created_at DESC);
ALTER TABLE payment_intents ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_intents(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_consumed ON payment_intents(consumed_at) WHERE consumed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_authority ON payment_intents(authority) WHERE authority IS NOT NULL;

CREATE TABLE IF NOT EXISTS ad_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(200) NOT NULL,
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 2000),
  status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ad_comments_ad_created ON ad_comments(ad_id, created_at DESC);

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway VARCHAR(32) NOT NULL,
  event_id VARCHAR(200) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gateway, event_id)
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON webhook_events(created_at DESC);

CREATE TABLE IF NOT EXISTS ad_reactions (
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(ad_id, user_id)
);

CREATE TABLE IF NOT EXISTS owner_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_national_code_hash VARCHAR(128) NOT NULL,
  deceased_national_code_hash VARCHAR(128) NOT NULL,
  relation VARCHAR(80) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected','manual_review')),
  provider VARCHAR(80),
  provider_reference VARCHAR(200),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_owner_verifications_user ON owner_verifications(user_id);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(32),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(200),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

INSERT INTO roles(name) VALUES ('user'),('owner'),('moderator'),('super_admin') ON CONFLICT DO NOTHING;
INSERT INTO permissions(name) VALUES
 ('AD_CREATE'),('AD_READ'),('AD_EDIT_OWN'),('AD_APPROVE'),('AD_REJECT'),('AD_DELETE'),
 ('PAYMENT_READ'),('PAYMENT_VERIFY'),('PAYMENT_CREATE'),('FRAME_PRICE_MANAGE'),('LOCATION_MANAGE'),('AUDIT_READ'),('USER_MANAGE'),('COMMENT_APPROVE'),('COMMENT_REJECT'),('COMMENT_HIDE'),
 ('APPEARANCE_MANAGE') ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'user' AND p.name IN ('AD_CREATE','AD_READ','AD_EDIT_OWN','PAYMENT_CREATE')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'owner' AND p.name IN ('AD_CREATE','AD_READ','AD_EDIT_OWN','PAYMENT_CREATE')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'moderator' AND p.name IN ('AD_READ','AD_APPROVE','AD_REJECT','AD_DELETE','LOCATION_MANAGE','AUDIT_READ','COMMENT_APPROVE','COMMENT_REJECT','COMMENT_HIDE')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  price_toman BIGINT NOT NULL CHECK (price_toman > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO subscription_plans(id,title,duration_days,price_toman) VALUES
 ('1_month','اشتراک یک‌ماهه صاحب عزا',30,99000),
 ('3_months','اشتراک سه‌ماهه یادبود خاندان',90,199000),
 ('1_year','اشتراک سالانه یادبود جاودان',365,380000)
ON CONFLICT (id) DO NOTHING;
