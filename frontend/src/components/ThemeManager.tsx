import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Palette, 
  Type, 
  Sliders, 
  Check, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Code, 
  CheckCircle2, 
  Eye, 
  Layers,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { ThemeProfile } from '../types';
import { INITIAL_THEME_PROFILES } from '../utils/appearancePresets';

export const ThemeManager: React.FC = () => {
  const { 
    appearance, 
    addThemeProfile, 
    deleteThemeProfile, 
    setActiveThemeProfile, 
    updateThemeProfile 
  } = useApp();

  const profiles = appearance.themeProfiles || INITIAL_THEME_PROFILES;
  const activeProfileId = appearance.activeThemeProfileId || profiles[0]?.id || 'profile-gold';
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // فرم ایجاد یا ویرایش پروفایل
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#eab308');
  const [fontFamily, setFontFamily] = useState("'Vazirmatn', sans-serif");
  const [baseFontSize, setBaseFontSize] = useState('14px');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startCreate = () => {
    setIsCreatingNew(true);
    setEditingProfileId(null);
    setName('');
    setNameEn('');
    setPrimaryColor('#06b6d4');
    setFontFamily("'Vazirmatn', sans-serif");
    setBaseFontSize('14px');
  };

  const startEdit = (p: ThemeProfile) => {
    setIsCreatingNew(false);
    setEditingProfileId(p.id);
    setName(p.name);
    setNameEn(p.nameEn || '');
    setPrimaryColor(p.primaryColor);
    setFontFamily(p.fontFamily);
    setBaseFontSize(p.baseFontSize);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreatingNew) {
      const newProfile: ThemeProfile = {
        id: `profile-${Date.now()}`,
        name: name.trim(),
        nameEn: nameEn.trim() || 'Custom Theme',
        primaryColor,
        fontFamily,
        baseFontSize,
        isSystem: false,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      addThemeProfile(newProfile);
    } else if (editingProfileId) {
      updateThemeProfile(editingProfileId, {
        name: name.trim(),
        nameEn: nameEn.trim(),
        primaryColor,
        fontFamily,
        baseFontSize,
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsCreatingNew(false);
    setEditingProfileId(null);
  };

  const FONT_OPTIONS = [
    { label: 'وزیرمتن استاندارد (Vazirmatn)', value: "'Vazirmatn', sans-serif" },
    { label: 'امیری سنتی و قرآنی (Amiri Serif)', value: "'Amiri', serif" },
    { label: 'نسخ عربی و کردی (Noto Naskh Arabic)', value: "'Noto Naskh Arabic', serif" },
    { label: 'خط لطیف کشیده (Lateef Calligraphy)', value: "'Lateef', serif" },
    { label: 'شهرزاد نسخ کهن (Scheherazade)', value: "'Scheherazade New', serif" },
    { label: 'روبیک مدرن و هندسی (Rubik Geometric)', value: "'Rubik', sans-serif" },
  ];

  const FONT_SIZE_OPTIONS = [
    { label: '۱۲ پیکسل (خیلی ریز / فشرده)', value: '12px' },
    { label: '۱۳ پیکسل (ریز)', value: '13px' },
    { label: '۱۴ پیکسل (استاندارد وب)', value: '14px' },
    { label: '۱۵ پیکسل (متوسط خوانا)', value: '15px' },
    { label: '۱۶ پیکسل (درشت مناسب سالمندان)', value: '16px' },
    { label: '۱۸ پیکسل (بسیار درشت)', value: '18px' },
  ];

  const COLOR_PRESETS = [
    { name: 'طلایی شاه‌عباسی', hex: '#eab308' },
    { name: 'سبز زمردی دارالاحسان', hex: '#10b981' },
    { name: 'فیروزه‌ای لاجوردی', hex: '#0ea5e9' },
    { name: 'کهربایی زرین جهانی', hex: '#f59e0b' },
    { name: 'یاقوتی عقیقی', hex: '#f43f5e' },
    { name: 'سیمین مینیمال', hex: '#94a3b8' },
    { name: 'بنفش سلطنتی', hex: '#a855f7' },
    { name: 'آبی تیره اقیانوسی', hex: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-stone-100 text-xs">
      {/* سربرگ معرفی ThemeManager */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800/80 flex items-center justify-center text-amber-400 shadow-xl flex-shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-100">
                مدیریت تم‌ها و متغیرهای سراسری CSS (ThemeManager)
              </h2>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-mono">
                <Code className="w-3 h-3" />
                <span>CSS Variables Engine</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">
              تنظیم و ذخیره متغیرهای اصلی برندینگ (<code className="text-amber-400 font-mono">--primary-color</code>, <code className="text-sky-400 font-mono">--font-family</code>, <code className="text-emerald-400 font-mono">--base-font-size</code>) با امکان جابجایی بلادرنگ بین پروفایل‌ها
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>تعریف پروفایل تم جدید</span>
        </button>
      </div>

      {/* بخش اصلی: نمایش پروفایل‌ها و متغیرهای فعال */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ستون راست (۷ ستون): لیست پروفایل‌های تم ذخیره‌شده */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>پروفایل‌های تم ثبت‌شده در استیت سراسری</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  کاربران و ادمین می‌توانند با یک کلیک بین این پروفایل‌های تم سوییچ کنند.
                </p>
              </div>

              <span className="text-[11px] text-stone-400 bg-stone-950 px-2.5 py-1 rounded-xl border border-stone-800 font-mono">
                {profiles.length} Profiles
              </span>
            </div>

            {/* کارت‌های پروفایل تم */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative ${
                      isActive 
                        ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500 shadow-lg' 
                        : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-8 h-8 rounded-xl shadow-md flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-950 border border-white/20"
                            style={{ backgroundColor: p.primaryColor }}
                          >
                            {isActive ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                          </span>
                          <div>
                            <span className="font-bold text-xs text-stone-100 block">{p.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{p.nameEn || p.id}</span>
                          </div>
                        </div>

                        {isActive && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            تم فعال UI
                          </span>
                        )}
                      </div>

                      {/* نمایش متغیرهای CSS این پروفایل */}
                      <div className="space-y-1 bg-stone-900/90 p-2.5 rounded-xl border border-stone-800/80 text-[10px] font-mono">
                        <div className="flex items-center justify-between text-stone-400">
                          <span>--primary-color:</span>
                          <span className="text-amber-300 font-bold">{p.primaryColor}</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400">
                          <span>--font-family:</span>
                          <span className="text-sky-300 truncate max-w-[130px]" title={p.fontFamily}>{p.fontFamily.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400">
                          <span>--base-font-size:</span>
                          <span className="text-emerald-300">{p.baseFontSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/70 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setActiveThemeProfile(p.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive 
                            ? 'bg-amber-500 text-stone-950 shadow' 
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>فعال و اعمال‌شده</span>
                          </>
                        ) : (
                          <span>انتخاب و اعمال سراسری</span>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-750 text-stone-300 text-[10px] transition-colors"
                        >
                          ویرایش
                        </button>

                        {!p.isSystem && (
                          <button
                            type="button"
                            onClick={() => deleteThemeProfile(p.id)}
                            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                            title="حذف پروفایل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* پنل نمایش کدهای CSS Variables اعمال‌شده بر ریشه سند (:root) */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-bold text-xs text-stone-200 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>متغیرهای تزریق‌شده به سند (Root CSS Variables Inspection)</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                Live Injected
              </span>
            </div>

            <pre className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 text-[11px] font-mono text-stone-300 leading-relaxed overflow-x-auto">
{`:root {
  --primary-color: ${activeProfile.primaryColor};
  --font-family: ${activeProfile.fontFamily};
  --base-font-size: ${activeProfile.baseFontSize};
  --primary-color-rgb: ${activeProfile.primaryColor.replace('#', '')};
  --primary-color-glow: rgba(..., 0.25);
}`}
            </pre>
          </div>
        </div>

        {/* ستون چپ (۵ ستون): فرم ایجاد / ویرایش و پیش‌نمایش زنده */}
        <div className="lg:col-span-5 space-y-4">
          {/* فرم ایجاد یا ویرایش */}
          {(isCreatingNew || editingProfileId) ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{isCreatingNew ? 'تعریف پروفایل تم جدید' : 'ویرایش متغیرهای پروفایل تم'}</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingProfileId(null);
                  }}
                  className="text-stone-400 hover:text-stone-200 text-xs"
                >
                  ✕ انصراف
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    نام فارسی پروفایل تم
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: زرین شاه‌عباسی، سبز سنندج..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    شناسه انگلیسی (CSS Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Gold, Emerald Spirit"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs font-mono"
                    dir="ltr"
                  />
                </div>

                {/* انتخاب رنگ اولیه CSS (--primary-color) */}
                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    متغیر رنگ اصلی (<code className="text-amber-400 font-mono">--primary-color</code>)
                  </label>
                  <div className="flex items-center gap-3 bg-stone-950 p-2.5 rounded-xl border border-stone-800 mb-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] text-stone-400 block font-mono">کد هگز:</span>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="bg-transparent font-mono text-xs font-bold text-stone-100 outline-none w-full"
                        dir="ltr"
                      />
                    </div>
                    <div 
                      className="w-10 h-7 rounded-lg shadow-inner border border-stone-700" 
                      style={{ backgroundColor: primaryColor }} 
                    />
                  </div>

                  {/* پالتهای رنگ آماده */}
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((cp) => (
                      <button
                        key={cp.hex}
                        type="button"
                        onClick={() => setPrimaryColor(cp.hex)}
                        className="w-6 h-6 rounded-lg border border-stone-700 hover:scale-110 transition-transform shadow"
                        style={{ backgroundColor: cp.hex }}
                        title={cp.name}
                      />
                    ))}
                  </div>
                </div>

                {/* انتخاب فونت CSS (--font-family) */}
                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    متغیر خط و قلم (<code className="text-sky-400 font-mono">--font-family</code>)
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-sky-500 text-xs cursor-pointer mb-1.5"
                  >
                    {FONT_OPTIONS.map((fo) => (
                      <option key={fo.value} value={fo.value}>
                        {fo.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="رشته دلخواه CSS font-family..."
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-stone-300 font-mono text-[11px] outline-none"
                    dir="ltr"
                  />
                </div>

                {/* انتخاب اندازه فونت پایه CSS (--base-font-size) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-stone-300">
                      اندازه فونت پایه (<code className="text-emerald-400 font-mono">--base-font-size</code>)
                    </label>
                    <span className="font-mono text-xs font-bold text-emerald-400">{baseFontSize}</span>
                  </div>

                  <select
                    value={baseFontSize}
                    onChange={(e) => setBaseFontSize(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-emerald-500 text-xs cursor-pointer"
                  >
                    {FONT_SIZE_OPTIONS.map((so) => (
                      <option key={so.value} value={so.value}>
                        {so.label} ({so.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingProfileId(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>ذخیره در استیت و انتشار</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>پیش‌نمایش زنده متغیرهای تم انتخابی</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {activeProfile.name}
                </span>
              </div>

              {/* ماکت پیش‌نمایش که متغیرهای فعال را زنده رندر می‌کند */}
              <div 
                className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-3.5 shadow-2xl transition-all"
                style={{
                  fontFamily: activeProfile.fontFamily,
                  fontSize: activeProfile.baseFontSize,
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-stone-100">
                    «إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»
                  </h4>
                  <span 
                    className="px-2.5 py-0.5 rounded-full font-bold text-[10px]"
                    style={{
                      backgroundColor: `${activeProfile.primaryColor}25`,
                      color: activeProfile.primaryColor,
                    }}
                  >
                    پیش‌نمایش زنده
                  </span>
                </div>

                <p className="text-stone-300 leading-relaxed">
                  مراسم ترحیم و یادبود در مسجد جامع مرکزی با حضور عموم برادران و خواهران گرامی برگزار می‌گردد.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                  <span className="text-stone-400 text-[11px]">جلوه دکمه اقدام با رنگ اصلی:</span>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl font-bold shadow text-stone-950 transition-transform active:scale-95"
                    style={{ backgroundColor: activeProfile.primaryColor }}
                  >
                    مشاهده مشخصات مراسم
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  با کلیک بر روی دکمه «تعریف پروفایل تم جدید» یا «ویرایش»، می‌توانید متغیرهای CSS اختصاصی برای برندینگ را در استیت ذخیره کرده و به طور سراسری به کل رابط کاربری برنامه اعمال نمایید.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
