import { 
  AppAppearanceConfig, 
  UserAppearancePreferences, 
  AppThemeMode, 
  AppBackgroundPattern,
  AppCardDensity,
  PaletteDefinition,
  FontDefinition,
  CardStyleDefinition,
  ThemeProfile
} from '../types';


export const INITIAL_PALETTES: PaletteDefinition[] = [
  {
    id: 'gold',
    name: 'زرین سلطنتی (Royal Gold)',
    nameEn: 'Royal Gold',
    primaryColor: '#eab308',
    badgeBg: 'bg-amber-950/70 border-amber-700/60',
    badgeText: 'text-amber-300',
    buttonGradient: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950',
    ringColor: 'focus:ring-amber-500',
    borderHighlight: 'border-amber-500/40',
    accentText: 'text-amber-400',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    isSystem: true,
    isActive: true,
  },
  {
    id: 'emerald',
    name: 'سبز زمردی و یشمی (Spiritual Emerald)',
    nameEn: 'Spiritual Emerald',
    primaryColor: '#10b981',
    badgeBg: 'bg-emerald-950/70 border-emerald-700/60',
    badgeText: 'text-emerald-300',
    buttonGradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-stone-950',
    ringColor: 'focus:ring-emerald-500',
    borderHighlight: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    isSystem: true,
    isActive: true,
  },
  {
    id: 'azure',
    name: 'آبی فیروزه‌ای و لاجوردی (Persian Azure)',
    nameEn: 'Persian Azure',
    primaryColor: '#0ea5e9',
    badgeBg: 'bg-sky-950/70 border-sky-700/60',
    badgeText: 'text-sky-300',
    buttonGradient: 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-stone-950',
    ringColor: 'focus:ring-sky-500',
    borderHighlight: 'border-sky-500/40',
    accentText: 'text-sky-400',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    isSystem: true,
    isActive: true,
  },
  {
    id: 'amber',
    name: 'کهربایی گرم (Warm Amber)',
    nameEn: 'Warm Amber',
    primaryColor: '#f59e0b',
    badgeBg: 'bg-orange-950/70 border-orange-700/60',
    badgeText: 'text-orange-300',
    buttonGradient: 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-stone-950',
    ringColor: 'focus:ring-orange-500',
    borderHighlight: 'border-orange-500/40',
    accentText: 'text-orange-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    isSystem: true,
    isActive: true,
  },
  {
    id: 'ruby',
    name: 'یاقوتی و عقیقی (Noble Ruby)',
    nameEn: 'Noble Ruby',
    primaryColor: '#f43f5e',
    badgeBg: 'bg-rose-950/70 border-rose-700/60',
    badgeText: 'text-rose-300',
    buttonGradient: 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white',
    ringColor: 'focus:ring-rose-500',
    borderHighlight: 'border-rose-500/40',
    accentText: 'text-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    isSystem: true,
    isActive: true,
  },
  {
    id: 'slate',
    name: 'سیمین و طوسی مینیمال (Silver Slate)',
    nameEn: 'Silver Slate',
    primaryColor: '#cbd5e1',
    badgeBg: 'bg-slate-900 border-slate-700',
    badgeText: 'text-slate-200',
    buttonGradient: 'from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-stone-950',
    ringColor: 'focus:ring-slate-400',
    borderHighlight: 'border-slate-500/40',
    accentText: 'text-slate-200',
    glowColor: 'rgba(203, 213, 225, 0.25)',
    isSystem: true,
    isActive: true,
  },
];

export const INITIAL_FONTS: FontDefinition[] = [
  {
    id: 'vazirmatn',
    name: 'وزیرمتن (Vazirmatn)',
    nameEn: 'Vazirmatn Standard',
    fontFamily: "'Vazirmatn', sans-serif",
    sampleText: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ»',
    category: 'sans',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'amiri',
    name: 'امیری قرآنی و سنتی (Amiri)',
    nameEn: 'Amiri Quranic Serif',
    fontFamily: "'Amiri', serif",
    sampleText: '«بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — طَلَبُ الرَّحْمَةِ وَالمَغْفِرَة»',
    category: 'serif',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'noto_naskh',
    name: 'نسخ عربی و کردی (Noto Naskh)',
    nameEn: 'Noto Naskh Arabic',
    fontFamily: "'Noto Naskh Arabic', 'Vazirmatn', serif",
    sampleText: '«یادبود ماندگار و باوقار درگذشتگان در سراسر جهان»',
    category: 'serif',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'lateef',
    name: 'خط لطیف کشیده (Lateef)',
    nameEn: 'Lateef Calligraphic',
    fontFamily: "'Lateef', 'Amiri', serif",
    sampleText: '«یا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَرْضِيَّةً»',
    category: 'calligraphy',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'scheherazade',
    name: 'شهرزاد نسخ کهن (Scheherazade)',
    nameEn: 'Scheherazade Traditional',
    fontFamily: "'Scheherazade New', 'Amiri', serif",
    sampleText: '«رحمت و غفران الهی بر روان پاک جمیع اموات و درگذشتگان»',
    category: 'calligraphy',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'rubik',
    name: 'روبیک مدرن و هندسی (Rubik)',
    nameEn: 'Rubik Modern Geometric',
    fontFamily: "'Rubik', 'Vazirmatn', sans-serif",
    sampleText: '«امواتگرام — سامانه هوشمند اطلاع‌رسانی و ترحیم»',
    category: 'display',
    isActive: true,
    isSystem: true,
  },
];

export const INITIAL_CARD_STYLES: CardStyleDefinition[] = [
  {
    id: 'standard',
    name: 'کلاسیک استاندارد (Classic Charcoal)',
    description: 'پس‌زمینه تیره زغالی، کادربندی ملایم و خوانایی بالا',
    cardBg: 'bg-stone-900/95',
    borderStyle: 'border border-stone-800',
    shadowStyle: 'shadow-xl',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'glass',
    name: 'شیشه‌ای بلورین (Glassmorphism)',
    description: 'شفافیت مات شیشه‌ای نئومورفیک با افکت بلور مدرن',
    cardBg: 'bg-stone-900/70 backdrop-blur-md',
    borderStyle: 'border border-stone-700/60 shadow-2xl',
    shadowStyle: 'shadow-2xl shadow-black/50',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'bordered_gold',
    name: 'کتیبه زرین فاخر (Imperial Gold)',
    description: 'خط‌کشی کتیبه‌ای طلایی با نشان اشرافی و ابهت بالا',
    cardBg: 'bg-stone-900/90',
    borderStyle: 'border-2 border-amber-500/50 shadow-amber-950/30',
    shadowStyle: 'shadow-2xl shadow-amber-950/40 ring-1 ring-amber-500/20',
    isActive: true,
    isSystem: true,
  },
  {
    id: 'flat_minimal',
    name: 'تخت و مینیمال (Flat Minimal)',
    description: 'بدون زوائد بصری، زمینه یکدست و تمرکز روی اطلاعات',
    cardBg: 'bg-stone-950',
    borderStyle: 'border border-stone-850',
    shadowStyle: 'shadow-sm',
    isActive: true,
    isSystem: true,
  },
];

export const INITIAL_THEME_PROFILES: ThemeProfile[] = [
  {
    id: 'profile-gold',
    name: 'زرین سلطنتی (Royal Gold)',
    nameEn: 'Royal Gold',
    primaryColor: '#eab308',
    fontFamily: "'Vazirmatn', sans-serif",
    baseFontSize: '14px',
    isSystem: true,
  },
  {
    id: 'profile-emerald',
    name: 'سبز معنوی دارالاحسان (Spiritual Emerald)',
    nameEn: 'Spiritual Emerald',
    primaryColor: '#10b981',
    fontFamily: "'Vazirmatn', sans-serif",
    baseFontSize: '14px',
    isSystem: true,
  },
  {
    id: 'profile-azure',
    name: 'فیروزه‌ای سنتی و قرآنی (Persian Azure)',
    nameEn: 'Persian Azure',
    primaryColor: '#0ea5e9',
    fontFamily: "'Amiri', serif",
    baseFontSize: '15px',
    isSystem: true,
  },
  {
    id: 'profile-amber',
    name: 'کهربایی زرین جهانی (Warm Amber)',
    nameEn: 'Warm Amber',
    primaryColor: '#f59e0b',
    fontFamily: "'Noto Naskh Arabic', serif",
    baseFontSize: '14px',
    isSystem: true,
  },
  {
    id: 'profile-slate',
    name: 'سیمین وقار و متانت (Slate Minimal)',
    nameEn: 'Slate Minimal',
    primaryColor: '#94a3b8',
    fontFamily: "'Rubik', sans-serif",
    baseFontSize: '14px',
    isSystem: true,
  },
];

export function applyCssVariables(profile: ThemeProfile) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', profile.primaryColor);
  root.style.setProperty('--font-family', profile.fontFamily);
  root.style.setProperty('--base-font-size', profile.baseFontSize);

  const hex = profile.primaryColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 234;
  const g = parseInt(hex.substring(2, 4), 16) || 179;
  const b = parseInt(hex.substring(4, 6), 16) || 8;
  root.style.setProperty('--primary-color-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--primary-color-glow', `rgba(${r}, ${g}, ${b}, 0.25)`);
}

export const DEFAULT_APP_APPEARANCE: AppAppearanceConfig = {
  appLogoUrl: '/assets/app-logo.jpg',
  heroBannerUrl: '/assets/app-logo.jpg',
  showHeroBanner: true,
  heroTitle: 'امواتگرام — سامانه هوشمند سوگواری و یادبود',
  heroTagline: 'اطلاع‌رسانی رسمی مراسمات، رزرو مساجد و گرامی‌داشت یاد درگذشتگان',
  verseBannerText: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ»',
  defaultThemeMode: 'dark',
  colorPalette: 'gold',
  headerStyle: 'glass',
  backgroundPattern: 'arabesque',
  fontFamily: 'vazirmatn',
  cardStyle: 'standard',
  customFooterNote: 'طراحی شده با احترام و ارادت به روح درگذشتگان — پوشش فراگیر و بین‌المللی',
  themeProfiles: INITIAL_THEME_PROFILES,
  activeThemeProfileId: 'profile-gold',
  customPalettes: INITIAL_PALETTES,
  availableFonts: INITIAL_FONTS,
  availableCardStyles: INITIAL_CARD_STYLES,
};

export const DEFAULT_USER_PREFERENCES: UserAppearancePreferences = {
  themeMode: 'dark',
  colorPalette: 'gold',
  backgroundPattern: 'arabesque',
  cardDensity: 'standard',
  cardStyle: 'standard',
  fontFamily: 'vazirmatn',
  fontScale: 'normal',
  activeThemeProfileId: 'profile-gold',
};


// نگاشت سریع برای سازگاری عقب‌رو
export const PALETTES: Record<string, PaletteDefinition> = INITIAL_PALETTES.reduce(
  (acc, p) => ({ ...acc, [p.id]: p }),
  {}
);

export function resolvePalette(
  paletteId: string, 
  customPalettes: PaletteDefinition[] = []
): PaletteDefinition {
  const fromCustom = customPalettes.find((p) => p.id === paletteId);
  if (fromCustom) return fromCustom;
  const fromSystem = INITIAL_PALETTES.find((p) => p.id === paletteId);
  if (fromSystem) return fromSystem;

  // در صورتی که پالت سفارشی با کد هگز ناشناخته باشد
  return {
    id: paletteId,
    name: 'پالت اختصاصی',
    nameEn: 'Custom Palette',
    primaryColor: paletteId.startsWith('#') ? paletteId : '#eab308',
    badgeBg: 'bg-stone-900 border-amber-600/50',
    badgeText: 'text-amber-400',
    buttonGradient: 'from-amber-500 to-amber-600 text-stone-950',
    ringColor: 'focus:ring-amber-500',
    borderHighlight: 'border-amber-500/40',
    accentText: 'text-amber-400',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    isActive: true,
  };
}

export function resolveFont(
  fontId: string, 
  availableFonts: FontDefinition[] = []
): FontDefinition {
  const found = availableFonts.find((f) => f.id === fontId);
  if (found) return found;
  const system = INITIAL_FONTS.find((f) => f.id === fontId);
  if (system) return system;
  return INITIAL_FONTS[0];
}

export function resolveCardStyle(
  styleId: string, 
  availableStyles: CardStyleDefinition[] = []
): CardStyleDefinition {
  const found = availableStyles.find((s) => s.id === styleId);
  if (found) return found;
  const system = INITIAL_CARD_STYLES.find((s) => s.id === styleId);
  if (system) return system;
  return INITIAL_CARD_STYLES[0];
}

export interface ThemeModeDefinition {
  id: AppThemeMode;
  title: string;
  subtitle: string;
  icon: string;
  bgClass: string;
  surfaceClass: string;
  borderClass: string;
  textPrimary: string;
  textMuted: string;
  cardBg: string;
}

export const THEME_MODES: Record<AppThemeMode, ThemeModeDefinition> = {
  dark: {
    id: 'dark',
    title: 'شب فاخر (Deep Dark)',
    subtitle: 'کنتراست عمیق، زمینه زغالی و خوانایی عالی در تاریکی',
    icon: '🌙',
    bgClass: 'bg-stone-950',
    surfaceClass: 'bg-stone-900',
    borderClass: 'border-stone-800',
    textPrimary: 'text-stone-100',
    textMuted: 'text-stone-400',
    cardBg: 'bg-stone-900/95',
  },
  light: {
    id: 'light',
    title: 'روز روشن و ملایم (Soft Light)',
    subtitle: 'روشن و دلنشین، کاغذ عاجی بدون خستگی چشم',
    icon: '☀️',
    bgClass: 'bg-[#f6f5ef]',
    surfaceClass: 'bg-white',
    borderClass: 'border-stone-300',
    textPrimary: 'text-stone-900',
    textMuted: 'text-stone-600',
    cardBg: 'bg-white',
  },
  dim: {
    id: 'dim',
    title: 'نیمه‌تاریک سنگی (Dim Slate)',
    subtitle: 'طوسی تیره متعادل و مدرن برای استفاده در طول روز و شب',
    icon: '🌘',
    bgClass: 'bg-[#151922]',
    surfaceClass: 'bg-[#1e2430]',
    borderClass: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textMuted: 'text-slate-400',
    cardBg: 'bg-[#1e2430]/95',
  },
  sepia: {
    id: 'sepia',
    title: 'کهن و معنوی (Warm Sepia)',
    subtitle: 'رنگ‌آمیزی پوستی و سنتی مذهبی با حس نوستالژی آرامش‌بخش',
    icon: '📜',
    bgClass: 'bg-[#231e19]',
    surfaceClass: 'bg-[#2f2821]',
    borderClass: 'border-[#453b31]',
    textPrimary: 'text-[#f4ede4]',
    textMuted: 'text-[#b8a99a]',
    cardBg: 'bg-[#2f2821]/95',
  },
};

export const PRESET_BRAND_IMAGES = [
  {
    id: 'official-logo',
    title: 'نشان و برند رسمی اپلیکیشن امواتگرام',
    category: 'رسمی',
    url: '/assets/app-logo.jpg',
    description: 'لوگوی اصیل و تأیید شده امواتگرام با نشان زرین',
  },
  {
    id: 'golden-calligraphy',
    title: 'کتیبه زرین خوشنویسی «انا لله و انا الیه راجعون»',
    category: 'خوشنویسی',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    description: 'آرامش معنوی با نور طلایی و شکوه یادبود',
  },
  {
    id: 'candles-peace',
    title: 'شمع‌های روشن یادبود و گل‌های نیلوفر',
    category: 'نمادین',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    description: 'گرمی شعله یاد و خاطره جاودان درگذشتگان',
  },
  {
    id: 'spiritual-arch',
    title: 'محراب اسلیمی لاجوردی و هاله نور',
    category: 'معماری معنوی',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    description: 'اصالت معماری اسلامی و پیوند با آسمان',
  },
];
