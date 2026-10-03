import { GriefAd, MosqueLocation, SystemAuditLog, UserProfile, Madhhab, CondolenceComment, PaymentTransaction, AppAppearanceConfig, UserAppearancePreferences, PaletteDefinition, FontDefinition, CardStyleDefinition, ThemeProfile, AppDisplayMode } from '../types';
import { PosterFrame } from '../data/memorialFrames';
import { AppLanguage } from '../utils/i18n';

export interface AppContextType {
  // اطلاعات کاربر و ورود
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  activeRole: 'user' | 'owner' | 'moderator' | 'super_admin';
  activeMadhhabContext: Madhhab;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setRole: (role: 'user' | 'owner' | 'moderator' | 'super_admin') => void;

  // وضعیت نمایش پروژه: اپلیکیشن موبایل یا وب‌سایت معرفی رسمی amvatgram.com
  appDisplayMode: AppDisplayMode;
  setAppDisplayMode: (mode: AppDisplayMode) => void;

  // اشتراک صاحب عزا و تمدید
  isSubscriptionModalOpen: boolean;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  renewMournerSubscription: (planId: '1_month' | '3_months' | '1_year') => Promise<void>;

  // هدایت کاربر عادی به فرآیند احراز هویت صاحب عزا
  requireOwnerAuth: boolean;
  setRequireOwnerAuth: (require: boolean) => void;
  requestCreateAdAsOwner: () => void;

  // درگاه محرمانه سازنده (کنسول جداگانه)
  isMasterModalOpen: boolean;
  openMasterModal: () => void;
  closeMasterModal: () => void;

  // آگهی‌ها
  ads: GriefAd[];
  approvedAds: GriefAd[];
  pendingAds: GriefAd[];
  activeAd: GriefAd | null;
  setActiveAd: (ad: GriefAd | null) => void;

  // عملیات‌ها
  createAd: (adData: Partial<GriefAd>) => Promise<GriefAd>;
  approveAd: (adId: string) => void;
  rejectAd: (adId: string, reason: string) => void;
  deleteAd: (adId: string) => void; // اعمال حذف کامل آگهی در کنسول سازنده
  toggleHeart: (adId: string) => void;
  emergencyKillAd: (adId: string) => void;
  addCommentToAd: (adId: string, comment: Omit<CondolenceComment, 'id' | 'createdAt'>) => void;


  // مدیریت قالب‌ها در کنسول سازنده
  frames: PosterFrame[];
  updateFramePrice: (frameId: string, newPriceToman: number) => Promise<void>;
  addFrame: (frame: PosterFrame) => void;
  deleteFrame: (frameId: string) => void;

  // مدیریت تراکنش‌ها و پرداختی‌های اینترنتی
  transactions: PaymentTransaction[];
  refreshPayments: () => Promise<void>;
  verifyTransaction: (txId: string, referenceNumber: string) => Promise<void>;

  // مساجد و مکان‌ها
  locations: MosqueLocation[];
  addLocation: (location: MosqueLocation) => Promise<void>;

  // لاگ‌های سیستمی
  auditLogs: SystemAuditLog[];
  addAuditLog: (action: SystemAuditLog['action'], details: string, level?: SystemAuditLog['level']) => void;

  // فیلترها و ناوبری با افزوده شدن بخش جدید «دعا، احادیث و قرآن»
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentView: 'home' | 'detail' | 'create_ad' | 'locations' | 'admin_dashboard' | 'user_profile' | 'religious_hub';
  setCurrentView: (view: 'home' | 'detail' | 'create_ad' | 'locations' | 'admin_dashboard' | 'user_profile' | 'religious_hub') => void;

  // لیست علاقه‌مندی‌ها برای ادعیه و احادیث (دسترسی سریع در پنل شخصی)
  favoriteDuaIds: string[];
  toggleFavoriteDua: (duaId: string) => void;
  isDuaFavorite: (duaId: string) => boolean;

  // تنظیمات هویت بصری، ظاهر سامانه و کنسول سازنده
  appearance: AppAppearanceConfig;
  updateAppearance: (updates: Partial<AppAppearanceConfig>) => void;
  resetAppearance: () => void;

  // تعریف و ذخیره پالت‌ها، فونت‌ها و استایل‌ها توسط مدیریت در دیتابیس
  addCustomPalette: (palette: PaletteDefinition) => void;
  deleteCustomPalette: (paletteId: string) => void;
  togglePaletteActive: (paletteId: string) => void;

  addCustomFont: (font: FontDefinition) => void;
  deleteCustomFont: (fontId: string) => void;
  toggleFontActive: (fontId: string) => void;

  addCustomCardStyle: (style: CardStyleDefinition) => void;
  deleteCustomCardStyle: (styleId: string) => void;
  toggleCardStyleActive: (styleId: string) => void;

  // مدیریت پروفایل‌های تم با متغیرهای CSS سراسری (ThemeManager)
  addThemeProfile: (profile: ThemeProfile) => void;
  deleteThemeProfile: (profileId: string) => void;
  setActiveThemeProfile: (profileId: string) => void;
  updateThemeProfile: (profileId: string, updates: Partial<ThemeProfile>) => void;

  // ترجیحات ظاهری کاربر (تغییر تم، رنگ، فونت و تراکم برای جلوگیری از ظاهر کسل‌کننده)
  userPreferences: UserAppearancePreferences;
  updateUserPreferences: (updates: Partial<UserAppearancePreferences>) => void;
  isAppearanceModalOpen: boolean;
  openAppearanceModal: () => void;
  closeAppearanceModal: () => void;
}


