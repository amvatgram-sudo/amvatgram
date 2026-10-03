import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Palette, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Sliders, 
  Type, 
  Save, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Layers,
  Layout,
  Sun,
  Moon,
  Plus,
  ToggleLeft,
  ToggleRight,
  Database,
  Grid,
  Edit2
} from 'lucide-react';
import { 
  PALETTES, 
  THEME_MODES, 
  PRESET_BRAND_IMAGES,
  DEFAULT_APP_APPEARANCE,
  resolvePalette,
  resolveFont,
  resolveCardStyle
} from '../utils/appearancePresets';
import { 
  AppThemeMode, 
  AppBackgroundPattern,
  AppAppearanceConfig,
  PaletteDefinition,
  FontDefinition,
  CardStyleDefinition
} from '../types';
import { ThemeManager } from './ThemeManager';

export const AdminAppearanceStudio: React.FC = () => {
  const { 
    appearance, 
    updateAppearance, 
    resetAppearance,
    addCustomPalette,
    deleteCustomPalette,
    togglePaletteActive,
    addCustomFont,
    deleteCustomFont,
    toggleFontActive,
    addCustomCardStyle,
    deleteCustomCardStyle,
    toggleCardStyleActive,
    setCurrentView,
    setRole
  } = useApp();

  const [activeSection, setActiveSection] = useState<'theme_manager' | 'palettes' | 'fonts' | 'styles' | 'branding'>('theme_manager');
  const [draft, setDraft] = useState<AppAppearanceConfig>({ ...appearance });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // فرم ایجاد پالت رنگی جدید
  const [showNewPaletteModal, setShowNewPaletteModal] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteNameEn, setNewPaletteNameEn] = useState('');
  const [newPaletteColor, setNewPaletteColor] = useState('#06b6d4');

  // فرم افزودن فونت جدید
  const [showNewFontModal, setShowNewFontModal] = useState(false);
  const [newFontName, setNewFontName] = useState('');
  const [newFontNameEn, setNewFontNameEn] = useState('');
  const [newFontFamily, setNewFontFamily] = useState('');
  const [newFontCategory, setNewFontCategory] = useState<'sans' | 'serif' | 'calligraphy' | 'display'>('sans');

  // آپلود فایل محلی تصویر به صورت Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب نمایید.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setDraft((prev) => ({
          ...prev,
          appLogoUrl: base64Url,
          heroBannerUrl: base64Url,
        }));
        setUploadError('');
      }
    };
    reader.onerror = () => {
      setUploadError('خطا در بارگذاری تصویر. لطفاً مجدداً امتحان کنید.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPresetImage = (url: string) => {
    setDraft((prev) => ({
      ...prev,
      appLogoUrl: url,
      heroBannerUrl: url,
    }));
  };

  const handleSaveAll = () => {
    updateAppearance(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('آیا از بازنشانی کلیه تنظیمات ظاهری، رنگ‌ها و فونت‌ها به حالت پیش‌فرض مطمئن هستید؟')) {
      resetAppearance();
      setDraft({ ...DEFAULT_APP_APPEARANCE });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ذخیره پالت رنگی جدید در دیتابیس
  const handleCreatePalette = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaletteName.trim()) return;

    const id = `pal-${Date.now()}`;
    const hex = newPaletteColor;
    const newPal: PaletteDefinition = {
      id,
      name: newPaletteName.trim(),
      nameEn: newPaletteNameEn.trim() || 'Custom Palette',
      primaryColor: hex,
      badgeBg: 'bg-stone-900 border-stone-700',
      badgeText: 'text-stone-200',
      buttonGradient: 'from-stone-800 to-stone-900 text-white',
      ringColor: 'focus:ring-stone-500',
      borderHighlight: 'border-stone-700',
      accentText: 'text-amber-400',
      glowColor: `${hex}40`,
      isActive: true,
      isSystem: false,
    };

    addCustomPalette(newPal);
    setDraft((prev) => ({
      ...prev,
      customPalettes: [...prev.customPalettes, newPal],
      colorPalette: id,
    }));

    setShowNewPaletteModal(false);
    setNewPaletteName('');
    setNewPaletteNameEn('');
    setNewPaletteColor('#06b6d4');
  };

  // ذخیره فونت جدید در دیتابیس
  const handleCreateFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFontName.trim()) return;

    const id = `font-${Date.now()}`;
    const fontFam = newFontFamily.trim() || `'${newFontName.trim()}', 'Vazirmatn', sans-serif`;
    const newFont: FontDefinition = {
      id,
      name: newFontName.trim(),
      nameEn: newFontNameEn.trim() || 'Custom Font',
      fontFamily: fontFam,
      sampleText: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ»',
      category: newFontCategory,
      isActive: true,
      isSystem: false,
    };

    addCustomFont(newFont);
    setDraft((prev) => ({
      ...prev,
      availableFonts: [...prev.availableFonts, newFont],
      fontFamily: id,
    }));

    setShowNewFontModal(false);
    setNewFontName('');
    setNewFontNameEn('');
    setNewFontFamily('');
  };

  const activePalette = resolvePalette(draft.colorPalette, draft.customPalettes);
  const activeFont = resolveFont(draft.fontFamily, draft.availableFonts);
  const activeCardStyle = resolveCardStyle(draft.cardStyle, draft.availableCardStyles);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-stone-100 text-xs">
      {/* سربرگ کنسول و اکشن‌های ذخیره‌سازی در دیتابیس */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800/80 flex items-center justify-center text-amber-400 shadow-xl flex-shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-100">
                مرکز تنظیمات ظاهر، رنگ‌ها و فونت‌های سامانه
              </h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>دیتابیس آنلاین</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">
              تعریف و ذخیره رنگ‌های اصلی، فونت‌ها و استایل‌های کلی برنامه تا کاربران بتوانند از میان آن‌ها انتخاب کنند
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl text-stone-400 hover:text-stone-200 bg-stone-950 border border-stone-800 hover:border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی کارخانه</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>در دیتابیس ذخیره و اعمال شد!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ذخیره در دیتابیس و انتشار</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ناوبری زیربخش‌های تنظیمات استودیو */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSection('theme_manager')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'theme_manager'
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-stone-950 shadow-md font-black'
              : 'bg-stone-900 text-sky-400 hover:text-sky-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>مدیریت متغیرهای تم (ThemeManager)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('palettes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'palettes'
              ? 'bg-amber-500 text-stone-950 shadow-md font-black'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>پالت‌های رنگی اصلی ({draft.customPalettes.length})</span>
        </button>


        <button
          type="button"
          onClick={() => setActiveSection('fonts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'fonts'
              ? 'bg-amber-500 text-stone-950 shadow-md font-black'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>مدیریت فونت‌ها و خطوط ({draft.availableFonts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('styles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'styles'
              ? 'bg-amber-500 text-stone-950 shadow-md font-black'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>استایل‌های کلی و کارت‌ها ({draft.availableCardStyles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'branding'
              ? 'bg-amber-500 text-stone-950 shadow-md font-black'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>لوگو، بنر و اسلوگان</span>
        </button>
      </div>

      {/* نمایش کامپوننت اختصاصی ThemeManager */}
      {activeSection === 'theme_manager' && (
        <ThemeManager />
      )}

      {/* بخش اصلی تنظیمات و شبیه‌ساز سایر المان‌ها */}
      {activeSection !== 'theme_manager' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ستون راست (۷ ستون): فرم و کنترل‌های مربوط به بخش فعال */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ۱. بخش پالت‌های رنگی */}
          {activeSection === 'palettes' && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>پالت‌های رنگی تعریف‌شده در دیتابیس</span>
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    رنگ‌های فعال برای کاربران در پنجره تم قرار می‌گیرند.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewPaletteModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تعریف پالت جدید</span>
                </button>
              </div>

              {/* لیست پالت‌های تعریف‌شده */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draft.customPalettes.map((pal) => {
                  const isCurrentDefault = draft.colorPalette === pal.id;
                  return (
                    <div
                      key={pal.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrentDefault 
                          ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500' 
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-7 h-7 rounded-xl shadow flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-950"
                            style={{ backgroundColor: pal.primaryColor }}
                          >
                            {isCurrentDefault && <Check className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="font-bold text-xs text-stone-200 block">{pal.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{pal.primaryColor}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => togglePaletteActive(pal.id)}
                            className={`p-1 rounded-lg text-[10px] transition-colors ${
                              pal.isActive 
                                ? 'text-emerald-400 hover:text-emerald-300' 
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                            title={pal.isActive ? 'فعال برای کاربران' : 'غیرفعال برای کاربران'}
                          >
                            {pal.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-stone-500" />}
                          </button>

                          {!pal.isSystem && (
                            <button
                              type="button"
                              onClick={() => deleteCustomPalette(pal.id)}
                              className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                              title="حذف پالت"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[10px]">
                        <span className="text-stone-400">
                          وضعیت: {pal.isActive ? 'قابل انتخاب توسط کاربر' : 'مخفی'}
                        </span>

                        <button
                          type="button"
                          onClick={() => setDraft((prev) => ({ ...prev, colorPalette: pal.id }))}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                            isCurrentDefault 
                              ? 'bg-amber-500 text-stone-950' 
                              : 'bg-stone-850 hover:bg-stone-750 text-stone-300'
                          }`}
                        >
                          {isCurrentDefault ? 'رنگ پیش‌فرض فعلی' : 'تنظیم به عنوان پیش‌فرض'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۲. بخش فونت‌ها و خطوط */}
          {activeSection === 'fonts' && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Type className="w-4 h-4 text-sky-400" />
                    <span>فونت‌های تعریف‌شده در دیتابیس سامانه</span>
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    کاربران می‌توانند از میان فونت‌های فعال، خط دلخواه خود را برای خواندن آگهی‌ها و ادعیه انتخاب کنند.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewFontModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت فونت جدید</span>
                </button>
              </div>

              {/* لیست فونت‌ها */}
              <div className="space-y-3">
                {draft.availableFonts.map((font) => {
                  const isCurrentDefault = draft.fontFamily === font.id;
                  return (
                    <div
                      key={font.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                        isCurrentDefault 
                          ? 'border-sky-500 bg-sky-950/20 ring-1 ring-sky-500' 
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-100">{font.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({font.nameEn})</span>
                          {font.isSystem && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">سیستمی</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleFontActive(font.id)}
                            className="p-1 rounded-lg text-[10px]"
                            title={font.isActive ? 'فعال برای کاربران' : 'غیرفعال برای کاربران'}
                          >
                            {font.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-stone-500" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDraft((prev) => ({ ...prev, fontFamily: font.id }))}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isCurrentDefault 
                                ? 'bg-sky-500 text-stone-950' 
                                : 'bg-stone-850 hover:bg-stone-750 text-stone-300'
                            }`}
                          >
                            {isCurrentDefault ? 'فونت پیش‌فرض برنامه' : 'انتخاب پیش‌فرض'}
                          </button>

                          {!font.isSystem && (
                            <button
                              type="button"
                              onClick={() => deleteCustomFont(font.id)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* متن نمونه با استایل فونت */}
                      <div 
                        className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-sm leading-relaxed"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        {font.sampleText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۳. بخش استایل‌های کلی و کارت‌ها */}
          {activeSection === 'styles' && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>استایل‌های کلی و چیدمان کارت‌ها (Card Styles)</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  قالب‌های گرافیکی نمایش آگهی‌ها در صفحه اصلی و لیست‌ها
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draft.availableCardStyles.map((style) => {
                  const isCurrentDefault = draft.cardStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrentDefault 
                          ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500' 
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-stone-200">{style.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleCardStyleActive(style.id)}
                          >
                            {style.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-stone-500" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 leading-relaxed">{style.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, cardStyle: style.id }))}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          isCurrentDefault 
                            ? 'bg-emerald-500 text-stone-950' 
                            : 'bg-stone-850 hover:bg-stone-750 text-stone-300'
                        }`}
                      >
                        {isCurrentDefault ? 'استایل فعال پیش‌فرض' : 'تنظیم به عنوان استایل اصلی'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* تنظیمات نقوش پس‌زمینه */}
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <span className="font-bold text-xs text-stone-200 block">بافت پس‌زمینه پیش‌فرض اپلیکیشن:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'arabesque', label: 'نقوش اسلیمی فاخر' },
                    { id: 'geometric', label: 'گره‌چینی هندسی' },
                    { id: 'stars', label: 'ستاره‌های شب' },
                    { id: 'none', label: 'ساده و تخت' },
                  ].map((pattern) => {
                    const isSelected = draft.backgroundPattern === pattern.id;
                    return (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, backgroundPattern: pattern.id as AppBackgroundPattern }))}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold' 
                            : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {pattern.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ۴. بخش برندینگ، لوگو و متون هیرو */}
          {activeSection === 'branding' && (
            <div className="space-y-6">
              {/* آپلود لوگو */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <span className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>تصویر اصلی و نشان رسمی اپلیکیشن</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-xl bg-stone-900 flex-shrink-0">
                    <img
                      src={draft.appLogoUrl || '/assets/app-logo.jpg'}
                      alt="لوگوی امواتگرام"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-right">
                    <div>
                      <h4 className="font-bold text-stone-200 text-xs">آپلود تصویر اختصاصی جدید</h4>
                      <p className="text-[11px] text-stone-400">
                        تصویر به صورت بهینه در دیتابیس محلی و سراسری ذخیره می‌شود.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>آپلود تصویر جدید</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDraft((prev) => ({
                            ...prev,
                            appLogoUrl: '/assets/app-logo.jpg',
                            heroBannerUrl: '/assets/app-logo.jpg',
                          }));
                        }}
                        className="px-3 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-750 transition-colors cursor-pointer"
                      >
                        لوگوی پیش‌فرض
                      </button>
                    </div>

                    {uploadError && <p className="text-rose-400 text-[11px]">{uploadError}</p>}
                  </div>
                </div>

                {/* پیش‌فرض‌های سریع */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {PRESET_BRAND_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPresetImage(preset.url)}
                      className={`p-2 rounded-xl border text-right transition-all cursor-pointer ${
                        draft.appLogoUrl === preset.url 
                          ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500' 
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div className="w-full h-14 rounded-lg overflow-hidden mb-1 bg-stone-900 border border-stone-800">
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-[10px] text-stone-200 truncate block">{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* متون هویت سازمانی */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-xs text-stone-200 border-b border-stone-800 pb-2">
                  عناوین و اسلوگان صفحه اصلی
                </h4>

                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">عنوان اصلی سامانه</label>
                  <input
                    type="text"
                    value={draft.heroTitle}
                    onChange={(e) => setDraft((prev) => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">اسلوگان و زیرعنوان</label>
                  <input
                    type="text"
                    value={draft.heroTagline}
                    onChange={(e) => setDraft((prev) => ({ ...prev, heroTagline: e.target.value }))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">کتیبه و آیه شریفه سربرگ</label>
                  <input
                    type="text"
                    value={draft.verseBannerText}
                    onChange={(e) => setDraft((prev) => ({ ...prev, verseBannerText: e.target.value }))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs font-serif"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ستون چپ (۵ ستون): شبیه‌ساز زنده و ماکت کاربر */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xl sticky top-20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <span className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>شبیه‌ساز زنده انتخاب کاربر</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  updateAppearance(draft);
                  window.history.pushState({}, '', '/');
                  setRole('user');
                  setCurrentView('home');
                }}
                className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer underline underline-offset-4"
              >
                <span>مشاهده در سایت</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* ماکت پیش‌نمایش بر اساس فونت و پالت انتخاب شده */}
            <div 
              className="rounded-2xl border border-stone-800 overflow-hidden shadow-2xl bg-stone-950 transition-all duration-300"
              style={{ fontFamily: activeFont.fontFamily }}
            >
              {/* ماکت هدر */}
              <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/50 bg-stone-950">
                    <img 
                      src={draft.appLogoUrl || '/assets/app-logo.jpg'} 
                      alt="لوگو" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-black text-xs text-stone-100 block">
                      {draft.heroTitle.split(' — ')[0]}
                    </span>
                    <span className="text-[9px] text-stone-400 block font-sans">Global Portal</span>
                  </div>
                </div>

                <div 
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold"
                  style={{ backgroundColor: `${activePalette.primaryColor}20`, color: activePalette.primaryColor }}
                >
                  {activePalette.name.split(' (')[0]}
                </div>
              </div>

              {/* ماکت بنر شاخص */}
              <div className="p-4 border-b border-stone-800/80 bg-gradient-to-b from-stone-900/90 to-stone-950">
                <span 
                  className="text-[10px] block mb-1 font-serif"
                  style={{ color: activePalette.primaryColor }}
                >
                  {draft.verseBannerText}
                </span>
                <h4 className="font-bold text-xs text-stone-100">{draft.heroTitle}</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">{draft.heroTagline}</p>
              </div>

              {/* ماکت کارت با استایل انتخاب شده */}
              <div className="p-3 space-y-2 bg-stone-950/70">
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
                  <span>نمونه آگهی متوفی با فونت «{activeFont.name}»:</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800">{activeCardStyle.name.split(' (')[0]}</span>
                </div>

                <div className={`p-3 rounded-2xl flex items-center gap-3 transition-all ${activeCardStyle.cardBg} ${activeCardStyle.borderStyle} ${activeCardStyle.shadowStyle}`}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-700 bg-stone-950 flex-shrink-0">
                    <img 
                      src={draft.appLogoUrl || '/assets/app-logo.jpg'} 
                      alt="متوفی" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-100">مرحوم حاج محمد امینی</span>
                      <span 
                        className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${activePalette.primaryColor}20`, color: activePalette.primaryColor }}
                      >
                        امروز
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">آرامستان بهشت مصطفی • مجلس دارالاحسان</p>
                  </div>
                </div>
              </div>

              {/* دکمه با رنگ تم فعال */}
              <div className="p-3 bg-stone-900/60 border-t border-stone-800 flex justify-between items-center">
                <span className="text-[10px] text-stone-400">جلوه دکمه اقدام کاربر:</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-black shadow transition-all"
                  style={{
                    backgroundColor: activePalette.primaryColor,
                    color: '#0c0a09'
                  }}
                >
                  ثبت آگهی با تم منتخب
                </button>
              </div>
            </div>

            {/* برچسب دیتابیس آنلاین */}
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-start gap-2">
              <Database className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                هر رنگ، فونت یا استایلی که در این بخش تعریف کنید، مستقیماً در دیتابیس دائمی سامانه ثبت شده و در لحظه در پنجره تغییر تم تمامی کاربران قابل انتخاب خواهد بود.
              </span>
            </div>
          </div>
        </div>
      </div>
      )}


      {/* مدال تعریف پالت رنگی جدید */}
      {showNewPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>تعریف و ذخیره پالت رنگی جدید در دیتابیس</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewPaletteModal(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePalette} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نام پالت به فارسی (مثال: فیروزه‌ای بارگاه)
                </label>
                <input
                  type="text"
                  required
                  placeholder="عنوان فارسی پالت..."
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نام انگلیسی یا شناسه (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Persian Turquoise"
                  value={newPaletteNameEn}
                  onChange={(e) => setNewPaletteNameEn(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1.5">
                  انتخاب رنگ شاخص اصلی (Primary Color)
                </label>
                <div className="flex items-center gap-3 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                  <input
                    type="color"
                    value={newPaletteColor}
                    onChange={(e) => setNewPaletteColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <div className="flex-1">
                    <span className="text-[11px] text-stone-400 block">کد هگز انتخابی:</span>
                    <span className="font-mono text-xs font-bold text-stone-100">{newPaletteColor}</span>
                  </div>
                  <div 
                    className="w-12 h-8 rounded-lg shadow-inner border border-stone-700" 
                    style={{ backgroundColor: newPaletteColor }} 
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPaletteModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ذخیره در دیتابیس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مدال تعریف فونت جدید */}
      {showNewFontModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <Type className="w-4 h-4 text-sky-400" />
                <span>ثبت فونت جدید در دیتابیس سامانه</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewFontModal(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFont} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نام فونت به فارسی (مثال: شبنم، ساحل، یکان بخ)
                </label>
                <input
                  type="text"
                  required
                  placeholder="عنوان نمایشی فونت..."
                  value={newFontName}
                  onChange={(e) => setNewFontName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نام انگلیسی (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shabnam"
                  value={newFontNameEn}
                  onChange={(e) => setNewFontNameEn(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-sky-500 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  رشته CSS Font Family (مثال: 'Shabnam', 'Vazirmatn', sans-serif)
                </label>
                <input
                  type="text"
                  placeholder="'Shabnam', sans-serif"
                  value={newFontFamily}
                  onChange={(e) => setNewFontFamily(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-sky-500 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  دسته‌بندی فونت
                </label>
                <select
                  value={newFontCategory}
                  onChange={(e) => setNewFontCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-sky-500 text-xs cursor-pointer"
                >
                  <option value="sans">بدون سریف (Sans - ساده و مدرن)</option>
                  <option value="serif">سریف / نسخ (Serif - سنتی و رسمی)</option>
                  <option value="calligraphy">خوشنویسی و خط معنوی (Calligraphy)</option>
                  <option value="display">تزئینی و عنوان (Display)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFontModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ثبت در دیتابیس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
