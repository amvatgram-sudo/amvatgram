import React from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Sparkles, 
  Palette, 
  PlusCircle, 
  Search, 
  Building2, 
  Heart, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Shield,
  Layers
} from 'lucide-react';
import { PALETTES, THEME_MODES } from '../utils/appearancePresets';
import { getTranslation } from '../utils/i18n';

export const HomeHeroBanner: React.FC = () => {
  const { 
    appearance, 
    userPreferences, 
    openAppearanceModal, 
    requestCreateAdAsOwner, 
    approvedAds, 
    locations, 
    activeMadhhabContext, 
    language,
    setCurrentView,
    activeRole
  } = useApp();

  if (!appearance.showHeroBanner) {
    return null;
  }

  const isSunni = activeMadhhabContext === 'sunni';
  const currentPalette = PALETTES[userPreferences.colorPalette] || PALETTES.gold;
  const currentTheme = THEME_MODES[userPreferences.themeMode] || THEME_MODES.dark;

  const brandImage = appearance.heroBannerUrl || appearance.appLogoUrl || '/assets/app-logo.jpg';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-800/80 shadow-2xl mb-8 transition-all">
      {/* جلوه پس‌زمینه نوری بر اساس پالت رنگی کاربر */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 75% 20%, ${currentPalette.primaryColor} 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(20,20,20,0.8) 0%, transparent 70%)`
        }}
      />

      {/* بافت نقوش اسلیمی یا هندسی بر اساس انتخاب کاربر */}
      {userPreferences.backgroundPattern === 'arabesque' && (
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      )}
      {userPreferences.backgroundPattern === 'geometric' && (
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      )}

      <div className={`relative p-5 sm:p-8 backdrop-blur-xl ${
        userPreferences.themeMode === 'light' 
          ? 'bg-white/90 text-stone-900' 
          : 'bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-stone-950/95 text-stone-100'
      }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* سمت راست (متن‌ها و دکمه‌ها در راست‌به‌چپ) */}
          <div className="space-y-4 max-w-2xl text-center lg:text-right flex-1">
            
            {/* چیپ کتیبه معنوی با آیکون شعله و پالت رنگی */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: `${currentPalette.primaryColor}15`,
                borderColor: `${currentPalette.primaryColor}40`,
                color: currentPalette.primaryColor
              }}
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-serif text-xs font-bold tracking-wide">
                {appearance.verseBannerText || (isSunni 
                  ? '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ»' 
                  : '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — عَظَّمَ اللَّهُ أُجُورَكُمْ»')}
              </span>
            </div>

            {/* عنوان اصلی و اسلوگان سامانه */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2">
                {appearance.heroTitle || getTranslation('appName', language)}
              </h1>
              <p className={`text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 ${
                userPreferences.themeMode === 'light' ? 'text-stone-600' : 'text-stone-300'
              }`}>
                {appearance.heroTagline || getTranslation(isSunni ? 'appTaglineSunni' : 'appTaglineShia', language)}
              </p>
            </div>

            {/* آمار زنده و اطمینان‌بخش */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[11px]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-950/40 border border-stone-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold text-stone-200">{approvedAds.length}</span>
                <span className="text-stone-400">آگهی فعال در حال برگزاری</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-950/40 border border-stone-800/80">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold text-stone-200">{locations.length}</span>
                <span className="text-stone-400">مسجد و مرکز مذهبی ثبت‌شده</span>
              </span>
            </div>

            {/* دکمه‌های اقدام: تغییر تم و ظاهر، ثبت آگهی */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {/* دکمه ثبت آگهی */}
              <button
                type="button"
                onClick={requestCreateAdAsOwner}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 bg-gradient-to-r ${currentPalette.buttonGradient}`}
              >
                <PlusCircle className="w-4 h-4 flex-shrink-0" />
                <span>{getTranslation('createAd', language)}</span>
              </button>

              {/* دکمه اختصاصی تغییر تم و ظاهر برای جلوگیری از ظاهر کسل‌کننده */}
              <button
                type="button"
                onClick={openAppearanceModal}
                className="px-4 py-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-750 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 group"
              >
                <Palette className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>تغییر تم و ظاهر آپ</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-800 text-stone-400 group-hover:text-amber-300">
                  {currentPalette.name.split(' (')[0]}
                </span>
              </button>

              {/* میانبر پرتال مدیریت در صورت لاگین ادمین */}
              {activeRole === 'super_admin' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('admin_dashboard')}
                  className="px-3.5 py-2.5 rounded-2xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>تنظیمات ظاهر در کنسول</span>
                </button>
              )}
            </div>

          </div>

          {/* سمت چپ (تصویر شاخص و نماد رسمی برند با قاب فاخر و لایو) */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={openAppearanceModal}>
              {/* هاله نور درخشان پشت تصویر بر اساس رنگ تم */}
              <div 
                className="absolute -inset-2 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: currentPalette.primaryColor }}
              />

              {/* قاب عکس رسمی برند */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden border-2 shadow-2xl p-1 bg-stone-950 transition-all duration-300 group-hover:scale-[1.02]"
                style={{ borderColor: currentPalette.primaryColor }}
              >
                <img
                  src={brandImage}
                  alt={appearance.heroTitle || 'نشان رسمی امواتگرام'}
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                  onError={(e) => {
                    // در صورت خطای لود به لوگوی فایل بازگردد
                    (e.currentTarget as HTMLImageElement).src = '/assets/app-logo.jpg';
                  }}
                />

                {/* برچسب شناور نشان رسمی */}
                <div className="absolute bottom-2 inset-x-2 bg-stone-950/85 backdrop-blur-md py-1 px-2 rounded-xl border border-stone-800 text-center">
                  <span className="text-[10px] font-bold tracking-wide flex items-center justify-center gap-1 text-stone-200">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>نماد رسمی امواتگرام</span>
                  </span>
                </div>
              </div>
            </div>

            {/* راهنمای کلیک برای سفارشی‌سازی */}
            <button
              type="button"
              onClick={openAppearanceModal}
              className="mt-2.5 text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>کلیک برای شخصی‌سازی تم و تصویر</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
