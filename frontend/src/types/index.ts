/**
 * Core Domain Models for Amvatgram
 * مرجع تایپ‌ها و ساختار داده‌های سامانه امواتگرام
 */

export type Madhhab = 'sunni' | 'shia';

export type UserRole = 'guest' | 'user' | 'owner' | 'moderator' | 'super_admin';

export type Gender = 'male' | 'female';

export interface SubscriptionPlan {
  id: '1_month' | '3_months' | '1_year';
  title: string;
  durationDays: number;
  priceToman: number; // کمتر از ۵۰۰ هزار تومان طبق خواسته کاربر
  originalPriceToman?: number;
  discountPercent?: number;
  badge?: string;
  features: string[];
}

export interface UserProfile {
  id: string;
  phone?: string;
  fullName: string;
  email?: string;
  avatarUrl?: string; // عکس پروفایل کاربری انتخابی در ثبت‌نام
  role: UserRole;
  madhhab: Madhhab;
  isVerified: boolean;
  nationalCode?: string;
  deceasedNationalCode?: string;
  ownerRelation?: string;
  mournerExpiresAt?: string; // تاریخ انقضای مهلت ۱ هفته‌ای دسترسی صاحب عزا
  subscriptionPlan?: 'none' | '1_month' | '3_months' | '1_year';
  subscriptionExpiresAt?: string;
  socialProvider?: 'google' | 'telegram' | 'whatsapp' | 'sms' | 'email' | 'twitter' | 'facebook';
  createdAt: string;
}

export type AppDisplayMode = 'app' | 'landing' | 'website';


export type AdStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived' | 'suspended';

export interface MosqueLocation {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  khademPhone?: string;
  type: 'mosque' | 'cemetery' | 'hall' | 'hussainiya';
}

export interface CeremonySessionSlot {
  enabled: boolean;
  label: string; // 'صبح' | 'عصر' | 'شب'
  startTime: string;
  endTime: string;
}

export interface CeremonyDetails {
  id: string;
  type: 'burial' | 'condolence_men' | 'condolence_women' | 'memorial_3rd' | 'memorial_40th' | 'hall';
  title: string;
  locationName: string;
  locationDetails?: MosqueLocation;
  customAddress?: string;
  lat?: number;
  lng?: number;
  date: string;
  
  // تعیین تعداد روزهای مراسم و تقویم هفته توسط صاحب عزا
  ceremonyDaysCount?: number; // تعداد روزهای مراسم (مثلاً ۱، ۲، ۳ روز)
  selectedDaysOfWeek?: string[]; // روزهای انتخابی از تقویم هفته (مثلاً ['شنبه', 'یکشنبه'])
  ceremonyDurationSummary?: string; // متن خلاصه مدت و ایام مراسم

  // برنامه سه‌گانه ساعات مساجد (صبح، عصر، شب برنامه‌ریزی توسط صاحب عزا)
  morningSlot?: CeremonySessionSlot;
  afternoonSlot?: CeremonySessionSlot;
  eveningSlot?: CeremonySessionSlot;

  // مراسم ترحیم بانوان: فقط آدرس منزل متوفی درج شود و هیچ ساعتی تعیین نشود
  deceasedHomeAddress?: string;

  // مراسم تشییع: اعلان سراسری شهر مبنی بر خاکسپاری در آرامستان مقصد بدون قید ساعت
  isCitywideBurialNotice?: boolean;
  targetCity?: string;
  cemeteryName?: string;
  citywideAnnouncementText?: string;

  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface DeceasedProfile {
  id: string;
  titlePrefix?: string;
  fullName: string;
  fatherName: string;
  familyName?: string;
  gender: Gender;
  dateOfDeath: string;
  burialCemetery: string;
  age?: number;
  avatarUrl?: string;
  madhhab: Madhhab;
  familyMembersNote?: string;
  deceasedNationalCode?: string;
}

export interface CondolenceComment {
  id: string;
  authorName: string;
  authorRelation?: string;
  text: string;
  type: 'quranic' | 'duaa' | 'kurdish' | 'traditional';
  madhhab: Madhhab;
  createdAt: string;
}

export interface GriefAd {
  id: string;
  trackingCode: string;
  status: AdStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  heartCount: number;
  deceased: DeceasedProfile;
  ceremonies: CeremonyDetails[];
  contactPhones: { label: string; phone: string }[];
  announcementText?: string;
  ownerId: string;
  ownerPhone: string;
  ownerNationalCode: string;
  deceasedNationalCode: string;
  ownerRelation: string;
  rejectionReason?: string;
  isUrgent?: boolean;
  comments?: CondolenceComment[];
  selectedFrameId?: string;
  paymentId?: string;
  templateConfig?: MemorialTemplateConfig;
}

export type TemplatePhotoShape = 'circle' | 'rounded-rect' | 'arch' | 'oval';
export type TemplateDecorationType = 'dove' | 'candle' | 'rose' | 'ribbon' | 'bismillah' | 'islamic_star';
export type MemorialAspectRatio = 'square' | 'portrait' | 'story' | 'a4';

export interface MemorialTemplateConfig {
  templateId: string;
  zoom: number; // 0.5 to 2.5
  panX: number; // -100 to 100
  panY: number; // -100 to 100
  rotate: number; // -45 to 45
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  grayscale: boolean;
  sepia: boolean;
  blurBackground: boolean;
  photoShape: TemplatePhotoShape;
  activeDecorations: TemplateDecorationType[];
  customQuote?: string;
  customPrefix?: string;
  fontFamily: 'vazir' | 'nastaliq' | 'serif' | 'thuluth';
  colorTheme?: string;
  aspectRatio: MemorialAspectRatio;
}

export interface MemorialTemplate {
  id: string;
  name: string;
  nameKu: string;
  nameEn: string;
  category: 'classic' | 'minimal' | 'nature' | 'religious' | 'luxury' | 'spiritual' | 'traditional' | 'floral';
  emoji: string;
  badgeText: string;
  bgGradient: string;
  bgTextureClass: string;
  borderStyle: string;
  accentColor: string;
  textColor: string;
  quoteColor: string;
  defaultShape: TemplatePhotoShape;
  defaultDecorations: TemplateDecorationType[];
  defaultQuote: string;
  quranicHeader: string;
  description: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: 'AD_CREATED' | 'AD_APPROVED' | 'AD_REJECTED' | 'AD_DELETED' | 'AD_EDITED' | 'LOCATION_ADDED' | 'KILL_SWITCH_TRIGGERED' | 'CONDOLENCE_SUBMITTED' | 'OWNER_VERIFIED' | 'PAYMENT_SUCCESS' | 'PAYMENT_VERIFIED' | 'FRAME_UPDATED' | 'APPEARANCE_UPDATED' | 'ROLE_EXPIRED' | 'SUBSCRIPTION_RENEWED' | 'AD_HEARTED';
  details: string;
  targetId?: string;
  level: 'info' | 'warning' | 'critical' | 'error';
}

export type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded' | 'expired';

export interface PaymentTransaction {
  id: string;
  trackingCode: string; // شناسه رهگیری شتابی/بانکی
  userId: string;
  userFullName: string;
  userPhone: string;
  adId?: string;
  deceasedName?: string;
  frameId: string;
  frameTitle: string;
  amountToman: number;
  status: PaymentStatus;
  gateway: 'zarinpal' | 'saman' | 'mellat' | 'crypto_direct';
  cardMask?: string;
  referenceNumber?: string;
  createdAt: string;
  verifiedAt?: string;
}

// ==========================================
// تنظیمات تم، پوسته و هویت بصری سامانه و کاربران
// ==========================================
export type AppThemeMode = 'dark' | 'light' | 'dim' | 'sepia';
export type AppBackgroundPattern = 'none' | 'arabesque' | 'floral' | 'geometric' | 'stars';
export type AppCardDensity = 'standard' | 'poster' | 'compact';

export interface PaletteDefinition {
  id: string;
  name: string;
  nameEn: string;
  primaryColor: string;
  badgeBg: string;
  badgeText: string;
  buttonGradient: string;
  ringColor: string;
  borderHighlight: string;
  accentText: string;
  glowColor: string;
  isSystem?: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface FontDefinition {
  id: string;
  name: string;
  nameEn: string;
  fontFamily: string;
  sampleText: string;
  category: 'sans' | 'serif' | 'calligraphy' | 'display';
  isActive: boolean;
  isSystem?: boolean;
  googleFontQuery?: string;
}

export interface CardStyleDefinition {
  id: string;
  name: string;
  description: string;
  cardBg: string;
  borderStyle: string;
  shadowStyle: string;
  isActive: boolean;
  isSystem?: boolean;
}

export interface ThemeProfile {
  id: string;
  name: string;
  nameEn: string;
  primaryColor: string; // CSS var --primary-color (e.g. #eab308)
  fontFamily: string; // CSS var --font-family (e.g. 'Vazirmatn', sans-serif)
  baseFontSize: string; // CSS var --base-font-size (e.g. 14px, 15px, 16px)
  isSystem?: boolean;
  createdAt?: string;
}

export interface AppAppearanceConfig {
  appLogoUrl: string;
  heroBannerUrl: string;
  showHeroBanner: boolean;
  heroTitle: string;
  heroTagline: string;
  verseBannerText: string;
  defaultThemeMode: AppThemeMode;
  colorPalette: string;
  headerStyle: 'glass' | 'solid' | 'bordered';
  backgroundPattern: AppBackgroundPattern;
  fontFamily: string;
  cardStyle: string;
  customFooterNote: string;

  // پروفایل‌های تم با متغیرهای CSS سراسری (CSS Variables Configuration)
  themeProfiles: ThemeProfile[];
  activeThemeProfileId: string;

  // کالکشن‌های تعریف‌شده توسط مدیریت در دیتابیس
  customPalettes: PaletteDefinition[];
  availableFonts: FontDefinition[];
  availableCardStyles: CardStyleDefinition[];
}

export interface UserAppearancePreferences {
  themeMode: AppThemeMode;
  colorPalette: string;
  backgroundPattern: AppBackgroundPattern;
  cardDensity: AppCardDensity;
  cardStyle: string;
  fontFamily: string;
  fontScale: 'normal' | 'large';
  activeThemeProfileId?: string;
}



