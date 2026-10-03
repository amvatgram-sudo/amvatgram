import React from 'react';
import { useApp } from '../context/AppProvider';
import { 
  X, 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Sliders, 
  Eye, 
  Check, 
  RotateCcw, 
  Grid3X3, 
  LayoutGrid, 
  List, 
  Type, 
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  THEME_MODES, 
  DEFAULT_USER_PREFERENCES,
  resolvePalette,
  resolveFont,
  resolveCardStyle
} from '../utils/appearancePresets';
import { AppThemeMode, AppBackgroundPattern, AppCardDensity } from '../types';

interface ThemeAppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeAppearanceModal: React.FC<ThemeAppearanceModalProps> = ({ isOpen, onClose }) => {
  const { 
    userPreferences, 
    updateUserPreferences, 
    appearance,
    setActiveThemeProfile 
  } = useApp();

  if (!isOpen) return null;

  const currentTheme = THEME_MODES[userPreferences.themeMode] || THEME_MODES.dark;
  const currentPalette = resolvePalette(userPreferences.colorPalette, appearance.customPalettes);
  const currentFont = resolveFont(userPreferences.fontFamily, appearance.availableFonts);
  const currentCardStyle = resolveCardStyle(userPreferences.cardStyle, appearance.availableCardStyles);

  const activePalettes = (appearance.customPalettes || []).filter((p) => p.isActive);
  const activeFonts = (appearance.availableFonts || []).filter((f) => f.isActive);
  const activeCardStyles = (appearance.availableCardStyles || []).filter((s) => s.isActive);
  const themeProfiles = appearance.themeProfiles || [];
  const activeProfileId = appearance.activeThemeProfileId || themeProfiles[0]?.id;

  const patterns: { id: AppBackgroundPattern; label: string; icon: string; desc: string }[] = [
    { id: 'arabesque', label: 'نقوش اسلیمی فاخر', icon: '⚜️', desc: 'طرح گل و بته معنوی ملایم' },
    { id: 'geometric', label: 'گره‌چینی هندسی', icon: '💠', desc: 'هندسه معماری اسلامی کهن' },
    { id: 'stars', label: 'آسمان آرام و پرستاره', icon: '✨', desc: 'هاله نور ابدی و نجومی' },
    { id: 'none', label: 'ساده و بی‌پیرایه', icon: '▫️', desc: 'تخت و مینیمال بدون نقش' },
  ];

  const densities: { id: AppCardDensity; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'standard', label: 'کارت استاندارد', icon: <LayoutGrid className="w-4 h-4" />, desc: 'تعادل کامل عکس و مشخصات' },
    { id: 'poster', label: 'پوستر بزرگ پرتره', icon: <Grid3X3 className="w-4 h-4" />, desc: 'تمرکز بر تصویر و قاب متوفی' },
    { id: 'compact', label: 'فهرست فشرده متنی', icon: <List className="w-4 h-4" />, desc: 'مرور سریع برای مصرف کم اینترنت' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          userPreferences.themeMode === 'light' 
            ? 'bg-stone-50 border-stone-300 text-stone-900' 
            : 'bg-stone-900 border-stone-800 text-stone-100'
        }`}
      >
        {/* هدر مدال با جلوه درخشان تم */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          userPreferences.themeMode === 'light' ? 'border-stone-200 bg-stone-100/80' : 'border-stone-800 bg-stone-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors"
              style={{ backgroundColor: `${currentPalette.primaryColor}25`, borderColor: currentPalette.primaryColor, borderWidth: 1 }}
            >
              <Palette className="w-5 h-5" style={{ color: currentPalette.primaryColor }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>شخصی‌سازی ظاهر، رنگ‌ها و خطوط امواتگرام</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-sans font-bold text-amber-300 bg-amber-950/80 border border-amber-800">
                  User Style
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                پوسته، پالت رنگ، فونت و استایل کلی برنامه را بر اساس سلیقه و راحتی چشمان خود تنظیم نمایید
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوای تنظیمات با اسکرول نرم */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* پروفایل‌های تم یکپارچه با متغیرهای CSS (Theme Profiles) */}
          {themeProfiles.length > 0 && (
            <div className="space-y-2.5 bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <span>پروفایل‌های تم کامل (پالت + قلم + اندازه)</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {themeProfiles.length} Profiles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {themeProfiles.map((tp) => {
                  const isCurrent = tp.id === activeProfileId;
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setActiveThemeProfile(tp.id)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent 
                          ? 'border-sky-500 bg-sky-950/30 ring-1 ring-sky-500' 
                          : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-5 h-5 rounded-lg shadow-sm flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-stone-950"
                          style={{ backgroundColor: tp.primaryColor }}
                        >
                          {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-stone-200 block">{tp.name}</span>
                          <span className="text-[9px] text-stone-400 font-mono">{tp.fontFamily.split(',')[0]} • {tp.baseFontSize}</span>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300 font-bold">
                          فعال
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۱. پالت رنگی فعال تعریف‌شده توسط مدیریت */}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>رنگ‌های اصلی سامانه (تعریف‌شده توسط مدیریت)</span>
              </span>
              <span className="text-[11px] font-medium" style={{ color: currentPalette.primaryColor }}>
                {currentPalette.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activePalettes.map((pal) => {
                const isSelected = userPreferences.colorPalette === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => updateUserPreferences({ colorPalette: pal.id })}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer relative ${
                      isSelected 
                        ? 'border-white/70 bg-stone-850 shadow-md ring-1 ring-white/40' 
                        : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-6 h-6 rounded-xl shadow-inner flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-950"
                        style={{ backgroundColor: pal.primaryColor }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <div>
                        <span className="font-bold text-stone-200 block text-xs">{pal.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{pal.primaryColor}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۲. انتخاب فونت و خط دلخواه کاربر از میان فونت‌های دیتابیس */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                <Type className="w-4 h-4 text-sky-400" />
                <span>فونت و خط نگارش (تعریف‌شده در دیتابیس)</span>
              </span>
              <span className="text-[11px] text-sky-400 font-medium">
                {currentFont.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeFonts.map((font) => {
                const isSelected = userPreferences.fontFamily === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => updateUserPreferences({ fontFamily: font.id })}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'border-sky-500 bg-sky-950/30 ring-1 ring-sky-500' 
                        : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-stone-200">{font.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                    <span 
                      className="text-xs text-stone-300 block truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      «کل نفس ذائقة الموت — امواتگرام»
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۳. انتخاب حالت روشنایی (Theme Mode) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>حالت پس‌زمینه و روشنایی (Day / Night Modes)</span>
              </span>
              <span className="text-[11px] text-stone-400">
                فعال: {currentTheme.title}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(THEME_MODES) as AppThemeMode[]).map((modeKey) => {
                const mode = THEME_MODES[modeKey];
                const isSelected = userPreferences.themeMode === modeKey;
                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => updateUserPreferences({ themeMode: modeKey })}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer relative group ${
                      isSelected 
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20' 
                        : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <span className="text-xl block mb-1">{mode.icon}</span>
                      <span className="font-bold text-stone-200 block text-xs">{mode.title}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {mode.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۴. استایل کارت‌ها (Card Styles) */}
          {activeCardStyles.length > 0 && (
            <div className="space-y-2.5">
              <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>استایل گرافیکی کارت‌های آگهی (Card Style)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCardStyles.map((style) => {
                  const isSelected = userPreferences.cardStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updateUserPreferences({ cardStyle: style.id })}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500' 
                          : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-stone-200 block">{style.name}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">{style.description}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۵. بافت پس‌زمینه و نقوش */}
          <div className="space-y-2.5">
            <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>نقوش و بافت پس‌زمینه (Background Texture)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {patterns.map((pat) => {
                const isSelected = userPreferences.backgroundPattern === pat.id;
                return (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => updateUserPreferences({ backgroundPattern: pat.id })}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 font-bold'
                        : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>{pat.icon}</span>
                      <span className="text-xs">{pat.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block">{pat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۶. چیدمان و تراکم کارت‌های آگهی */}
          <div className="space-y-2.5">
            <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>نحوه نمایش آگهی‌ها در صفحه اصلی (Card Density)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {densities.map((den) => {
                const isSelected = userPreferences.cardDensity === den.id;
                return (
                  <button
                    key={den.id}
                    type="button"
                    onClick={() => updateUserPreferences({ cardDensity: den.id })}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                        : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                      {den.icon}
                    </div>
                    <div>
                      <span className="font-bold block text-xs">{den.label}</span>
                      <span className="text-[10px] text-stone-500">{den.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۷. مقیاس متن و دسترسی‌پذیری برای سالمندان */}
          <div className="space-y-2.5 bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 flex items-center gap-1.5 text-xs">
                <Type className="w-4 h-4 text-amber-400" />
                <span>اندازه فونت و خوانایی (ویژه سالمندان و سهولت مطالعه)</span>
              </span>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => updateUserPreferences({ fontScale: 'normal' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userPreferences.fontScale === 'normal' 
                      ? 'bg-amber-500 text-stone-950' 
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  استاندارد
                </button>
                <button
                  type="button"
                  onClick={() => updateUserPreferences({ fontScale: 'large' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userPreferences.fontScale === 'large' 
                      ? 'bg-amber-500 text-stone-950' 
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  درشت و خوانا (A+)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* فوتر مدال: پیش‌نمایش و اعمال */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          userPreferences.themeMode === 'light' ? 'border-stone-200 bg-stone-100' : 'border-stone-800 bg-stone-950'
        }`}>
          <button
            type="button"
            onClick={() => updateUserPreferences(DEFAULT_USER_PREFERENCES)}
            className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به حالت پیش‌فرض</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 bg-gradient-to-r ${currentPalette.buttonGradient}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>اعمال و ذخیره تغییرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
