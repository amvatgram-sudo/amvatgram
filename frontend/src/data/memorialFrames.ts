/**
 * Memorial Poster Frames System (سیستم قالب‌های آماده آگهی ترحیم)
 * تنوع سنی: کهنسالان و بزرگان، میانسالان، جوانان، کودکان و بانوان
 * سطوح قیمتی تجاری: رایگان (Free)، پایه و اقتصادی (Economy)، سلطنتی و طلایی (VIP/Luxury)
 */

export type FrameTier = 'free' | 'economy' | 'luxury';
export type AgeGroup = 'elderly' | 'middle_aged' | 'youth' | 'child' | 'female_special' | 'all';

export interface PosterFrame {
  id: string;
  title: string;
  tier: FrameTier;
  priceToman: number; // قیمت به تومان (۰ برای رایگان)
  ageGroup: AgeGroup;
  categoryTitle: string;
  badgeText: string;
  borderStyle: string;
  overlayGradient: string;
  cornerOrnament: 'ribbon_black' | 'islamic_gold' | 'flower_lily' | 'candleglow' | 'dove_peace';
  bannerSubtitle: string;
  description: string;
}

export const MEMORIAL_FRAMES: PosterFrame[] = [
  // ۱. قالب‌های رایگان (Free)
  {
    id: 'frame-free-classic',
    title: 'کلاسیک وقار (ساده و سنگین)',
    tier: 'free',
    priceToman: 0,
    ageGroup: 'all',
    categoryTitle: 'رایگان عمومی',
    badgeText: 'رایگان',
    borderStyle: 'border-2 border-stone-700',
    overlayGradient: 'from-stone-950 via-stone-950/20 to-black/40',
    cornerOrnament: 'ribbon_black',
    bannerSubtitle: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»',
    description: 'قالب رسمی و ساده با روبان مشکی عزا در گوشه تصویر مناسب تمامی آگهی‌ها',
  },
  {
    id: 'frame-free-spiritual',
    title: 'معنوی اسلیمی (طرح محراب مساجد)',
    tier: 'free',
    priceToman: 0,
    ageGroup: 'elderly',
    categoryTitle: 'رایگان کهنسالان',
    badgeText: 'رایگان',
    borderStyle: 'border-2 border-emerald-900/80',
    overlayGradient: 'from-stone-950 via-emerald-950/20 to-stone-950/50',
    cornerOrnament: 'islamic_gold',
    bannerSubtitle: '«کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ»',
    description: 'کادر حاشیه اسلیمی متبرک، متناسب با فقه اسلامی و مساجد اهل سنت و تشیع',
  },

  // ۲. قالب‌های اقتصادی و به صرفه (Economy - ۵۰ الی ۹۰ هزار تومان)
  {
    id: 'frame-eco-elder',
    title: 'بزرگ خاندان و پیشکسوتان (طرح وقار)',
    tier: 'economy',
    priceToman: 49000,
    ageGroup: 'elderly',
    categoryTitle: 'ویژه سالمندان و پدران',
    badgeText: 'اقتصادی',
    borderStyle: 'border-4 border-amber-700/60 shadow-amber-950/40',
    overlayGradient: 'from-stone-950 via-amber-950/30 to-black/50',
    cornerOrnament: 'candleglow',
    bannerSubtitle: 'غروب پدری مهربان و بزرگ خاندان',
    description: 'حاشیه وقار برنزی همراه با نقش شمع فروزان و آرامش‌بخش',
  },
  {
    id: 'frame-eco-youth',
    title: 'جوان ناکام و پروانه‌ای (طرح سپهر)',
    tier: 'economy',
    priceToman: 59000,
    ageGroup: 'youth',
    categoryTitle: 'ویژه جوانان و نوجوانان',
    badgeText: 'پرفروش جوانان',
    borderStyle: 'border-3 border-sky-800/80 shadow-sky-950/50',
    overlayGradient: 'from-stone-950 via-slate-900/30 to-sky-950/40',
    cornerOrnament: 'dove_peace',
    bannerSubtitle: 'کوچ نابه‌هنگام جوانی پاک‌سرشت',
    description: 'تم حزن‌انگیز با نماد کبوتر سپید پرواز و قاب نقره‌ای عزا',
  },
  {
    id: 'frame-eco-mother',
    title: 'مادر دلسوز و بانوی فداکار (طرح نیلوفر)',
    tier: 'economy',
    priceToman: 59000,
    ageGroup: 'female_special',
    categoryTitle: 'ویژه بانوان و مادران',
    badgeText: 'محبوب بانوان',
    borderStyle: 'border-3 border-rose-900/70 shadow-rose-950/30',
    overlayGradient: 'from-stone-950 via-rose-950/20 to-black/50',
    cornerOrnament: 'flower_lily',
    bannerSubtitle: 'مادر مهربان و اسوه صبوری و پاکدامنی',
    description: 'مزین به گل زنبق سپید، کادر ارغوانی مات و فونت فاخر نستعلیق',
  },

  // ۳. قالب‌های ویژه، سلطنتی و لاکچری (Luxury / VIP - ۱۲۰ الی ۱۹۰ هزار تومان)
  {
    id: 'frame-lux-royal-gold',
    title: 'زرین سلطنتی (طرح خورشید ابدی VIP)',
    tier: 'luxury',
    priceToman: 149000,
    ageGroup: 'all',
    categoryTitle: 'لوکس و ممتاز VIP',
    badgeText: 'شاهکار طلایی VIP',
    borderStyle: 'border-4 border-gradient-to-r border-amber-400 shadow-2xl shadow-amber-600/40',
    overlayGradient: 'from-stone-950 via-amber-950/40 to-stone-900/60',
    cornerOrnament: 'islamic_gold',
    bannerSubtitle: 'یادبودی ماندگار و باشکوه در جوار حق',
    description: 'حاشیه طلاکاری برجسته با نقوش اسلیمی زرین، شمع سه‌بعدی و جلوه فوق‌لوکس',
  },
  {
    id: 'frame-lux-angelic-child',
    title: 'فرشته آسمانی (ویژه کودکان و نونهالان)',
    tier: 'luxury',
    priceToman: 119000,
    ageGroup: 'child',
    categoryTitle: 'ویژه نونهالان و کودکان',
    badgeText: 'ویژه کودک VIP',
    borderStyle: 'border-3 border-teal-600/80 shadow-teal-950/60',
    overlayGradient: 'from-stone-950 via-teal-950/30 to-black/40',
    cornerOrnament: 'dove_peace',
    bannerSubtitle: 'پرواز معصومانه فرشته‌ای کوچک به بهشت برین',
    description: 'حاشیه آرامش‌بخش بال‌های فرشته و ستاره‌های زرین برای داغ جانسوز کودک',
  },
  {
    id: 'frame-lux-honorable-dignitary',
    title: 'شخصیت‌های برجسته و مفاخر ماندگار',
    tier: 'luxury',
    priceToman: 189000,
    ageGroup: 'all',
    categoryTitle: 'مفاخر و اساتید VIP',
    badgeText: 'مخصوص مفاخر و علما',
    borderStyle: 'border-4 border-amber-500/90 shadow-2xl shadow-black',
    overlayGradient: 'from-stone-950 via-stone-900/50 to-amber-950/40',
    cornerOrnament: 'candleglow',
    bannerSubtitle: 'مفاخر، اساتید و چهره‌های ماندگار و جاویدان',
    description: 'قالب سنگین مشکی-زرین با نماد کتاب، قلم و نشان یادبود ملی',
  },
];
