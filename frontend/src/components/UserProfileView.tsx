import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  User, 
  Phone, 
  ShieldCheck, 
  Settings, 
  Save, 
  CheckCircle, 
  FileText, 
  Heart, 
  Trash2, 
  ExternalLink,
  Lock,
  Globe,
  Bell,
  ArrowRight,
  Bookmark,
  BookOpen,
  Share2,
  Check,
  Sparkles,
  Palette,
  Menu,
  X,
  Crown,
  PhoneCall,
  Info,
  HelpCircle,
  Camera,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { AppLanguage, SUPPORTED_COUNTRIES, getTranslation } from '../utils/i18n';
import { MEMORIAL_DUAS, WEEKLY_HADITHS, QURAN_SURAHS } from '../data/religiousServices';

export const UserProfileView: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    setCurrentView, 
    ads, 
    language, 
    setLanguage,
    favoriteDuaIds,
    toggleFavoriteDua,
    openAppearanceModal,
    openSubscriptionModal,
    logoutUser,
    userPreferences
  } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // استیت منوی همبرگری پروفایل
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);


  // آگهی‌های ثبت شده توسط این کاربر
  const myAds = ads.filter((a) => a.ownerId === currentUser?.id || a.ownerPhone === currentUser?.phone);

  // ادعیه، احادیث و سوره‌های نشان‌شده در علاقه‌مندی‌ها
  const savedDuas = MEMORIAL_DUAS.filter((d) => favoriteDuaIds.includes(d.id));
  const savedHadiths = WEEKLY_HADITHS.filter((h) => favoriteDuaIds.includes(h.id));
  const savedSurahs = QURAN_SURAHS.filter((s) => favoriteDuaIds.includes(s.id));
  const totalSaved = savedDuas.length + savedHadiths.length + savedSurahs.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    updateUserProfile({
      fullName,
      email: email || undefined,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isLtr = language === 'en' || language === 'tr';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isLtr ? 'ltr' : 'rtl'}>
      {/* دکمه بازگشت */}
      <button
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-1.5 text-stone-400 hover:text-stone-100 text-xs mb-6 transition-colors cursor-pointer"
      >
        <ArrowRight className={`w-4 h-4 ${isLtr ? 'rotate-180' : ''}`} />
        <span>{getTranslation('backToFeed', language)}</span>
      </button>

      {/* سربرگ هویت کاربر */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        {/* دکمه منوی همبرگری پروفایل (آیتم ۸ خواسته کاربر) */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 rounded-2xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800 text-amber-400 hover:text-amber-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-md z-10"
          title="منوی همبرگری تنظیمات و خدمات"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[11px] font-bold hidden sm:inline">منوی امکانات</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* عکس پروفایل کاربری با پشتیبانی از آواتار انتخابی */}
          <div className="w-20 h-20 rounded-2xl bg-stone-950 border-2 border-amber-600/40 overflow-hidden flex items-center justify-center text-amber-500 text-3xl font-black shadow-inner flex-shrink-0 relative">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{currentUser?.fullName.charAt(0) || '👤'}</span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-right">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-xl font-black text-stone-100">{currentUser?.fullName}</h2>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                currentUser?.role === 'owner'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-stone-800 text-stone-300'
              }`}>
                {currentUser?.role === 'owner' 
                  ? `${getTranslation('bereavedFamily', language)} (${currentUser.ownerRelation || 'بستگان'})` 
                  : getTranslation('standardUser', language)}
              </span>

              {/* دکمه تمدید اشتراک صاحب عزا */}
              {currentUser?.role === 'owner' && (
                <button
                  type="button"
                  onClick={openSubscriptionModal}
                  className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-2.5 py-0.5 rounded-full shadow hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  <Crown className="w-3 h-3" />
                  <span>تمدید اشتراک</span>
                </button>
              )}
            </div>


            <p className="text-xs text-stone-400 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {currentUser?.phone && (
                <span className="flex items-center gap-1 font-mono" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  {currentUser.phone}
                </span>
              )}
              {currentUser?.email && (
                <span className="flex items-center gap-1 font-mono" dir="ltr">
                  <span>✉️</span>
                  {currentUser.email}
                </span>
              )}
              {currentUser?.socialProvider && (
                <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-750">
                  {getTranslation('activeChannelBadge', language)} {currentUser.socialProvider.toUpperCase()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* فرم ویرایش مشخصات و تنظیمات کاربری */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-stone-800 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {getTranslation('profileSettings', language)}
            </h3>

            <div>
              <label className="text-xs text-stone-300 block mb-1.5 font-medium">
                {getTranslation('fullNameLabel', language)}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3 text-xs text-stone-100 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-stone-300 block mb-1.5 font-medium">
                {getTranslation('emailAddress', language)}
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3 text-xs text-stone-100 outline-none font-mono"
                dir="ltr"
              />
            </div>

            {/* تغییر زبان شخصی پنل کاربری */}
            <div>
              <label className="text-xs text-stone-300 block mb-1.5 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{getTranslation('loginLanguageNotice', language)}</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none"
              >
                <option value="fa">🇮🇷 فارسی (Persian)</option>
                <option value="ku">☀️ کوردی سۆرانی (Kurdish)</option>
                <option value="en">🇬🇧 English (انگلیسی)</option>
                <option value="ar">🇸🇦 العربية (عربی)</option>
                <option value="tr">🇹🇷 Türkçe (ترکی استانبولی)</option>
              </select>
            </div>

            {/* سوییچ اعلان‌ها */}
            <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{getTranslation('notificationsLabel', language)}</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle className="w-4 h-4" /> {getTranslation('savedSuccessNotice', language)}
                </span>
              ) : <span></span>}

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                <Save className="w-4 h-4" />
                {getTranslation('saveProfile', language)}
              </button>
            </div>
          </form>

          {/* بخش شخصی‌سازی تم و ظاهر برای کاربر */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>پوسته و شخصی‌سازی ظاهری</span>
              </h3>
              <span className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                {userPreferences.themeMode === 'light' ? 'روز روشن' : 'شب فاخر'} • {userPreferences.colorPalette}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              برای جلوگیری از ظاهر یکنواخت و خسته‌کننده، رنگ‌بندی جلوه‌ها، طرح پس‌زمینه اسلیمی، حالت روز/شب و اندازه فونت‌ها را مطابق سلیقه خود تنظیم کنید.
            </p>
            <button
              type="button"
              onClick={openAppearanceModal}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-850 text-amber-400 border border-amber-800/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Palette className="w-4 h-4" />
              <span>تنظیم تم، رنگ و ظاهر امواتگرام</span>
            </button>
          </div>
        </div>


        {/* لیست آگهی‌های ثبت شده توسط این کاربر */}
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-stone-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              {getTranslation('myAdsTitle', language)} ({myAds.length})
            </h3>

            {myAds.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">
                {getTranslation('noAdsFound', language)}
              </p>
            ) : (
              <div className="space-y-3">
                {myAds.map((ad) => (
                  <div key={ad.id} className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-200">{ad.deceased.fullName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ad.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400'
                          : ad.status === 'pending'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}>
                        {ad.status === 'approved' ? 'تایید شده' : ad.status === 'pending' ? 'در انتظار بررسی' : 'رد شده'}
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px]">کد پیگیری: {ad.trackingCode}</p>
                    <p className="text-stone-400 text-[11px] mt-1">بازدید: {ad.viewCount} | تسلیت: {ad.heartCount} 🖤</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* بخش ادعیه، احادیث و سوره‌های نشان‌شده در پنل شخصی (دسترسی سریع) */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mt-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Bookmark className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <span>{getTranslation('myFavorites', language)}</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  {totalSaved}
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {getTranslation('savedEmptyDesc', language)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('religious_hub')}
            className="text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all flex-shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>{getTranslation('religiousServices', language)}</span>
          </button>
        </div>

        {totalSaved === 0 ? (
          <div className="text-center py-8 space-y-3 bg-stone-950/60 rounded-2xl border border-stone-850 p-6">
            <Bookmark className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="text-xs text-stone-400">
              {getTranslation('savedEmptyTitle', language)}
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('religious_hub')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{getTranslation('savedEmptyDesc', language)}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isLtr ? '' : 'rotate-180'}`} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ادعیه ذخیره شده */}
            {savedDuas.map((dua) => (
              <div key={dua.id} className="bg-stone-950 p-4 rounded-2xl border border-stone-850 hover:border-amber-600/40 space-y-3 transition-colors text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{dua.title}</span>
                    <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-900 px-2 py-0.5 rounded-full font-medium">
                      {dua.occasionTitle}
                    </span>
                  </div>

                  <p className="font-serif text-stone-200 line-clamp-2 leading-relaxed bg-stone-900/60 p-2 rounded-lg" dir="rtl">
                    {dua.arabicText}
                  </p>

                  <p className="text-stone-400 line-clamp-2 text-[11px] leading-relaxed">
                    {dua.persianMeaning || dua.kurdishMeaning}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-850/80">
                  <button
                    type="button"
                    onClick={() => setCurrentView('religious_hub')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{getTranslation('readText', language)}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${dua.title}\n\n${dua.arabicText}\n\n${dua.persianMeaning || ''}`);
                        setCopiedId(dua.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="p-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded-lg cursor-pointer transition-colors"
                      title={getTranslation('copyText', language)}
                    >
                      {copiedId === dua.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavoriteDua(dua.id)}
                      className="p-1.5 bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                      title={getTranslation('removeFromFavorites', language)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* احادیث ذخیره شده */}
            {savedHadiths.map((h) => (
              <div key={h.id} className="bg-stone-950 p-4 rounded-2xl border border-stone-850 hover:border-amber-600/40 space-y-3 transition-colors text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">حدیث {h.dayName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{h.source}</span>
                  </div>

                  <p className="font-serif text-stone-200 line-clamp-2 leading-relaxed bg-stone-900/60 p-2 rounded-lg" dir="rtl">
                    «{h.hadithText}»
                  </p>

                  <p className="text-emerald-400 text-[11px] font-serif font-bold">
                    ذکر: {h.dailyZikr}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-850/80">
                  <button
                    type="button"
                    onClick={() => setCurrentView('religious_hub')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{getTranslation('hadithsAndZikr', language)}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`حدیث ${h.dayName}\n«${h.hadithText}»\n\nذکر: ${h.dailyZikr}`);
                        setCopiedId(h.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="p-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded-lg cursor-pointer transition-colors"
                      title={getTranslation('copyText', language)}
                    >
                      {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavoriteDua(h.id)}
                      className="p-1.5 bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                      title={getTranslation('removeFromFavorites', language)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* سوره‌های قرآن ذخیره شده */}
            {savedSurahs.map((surah) => (
              <div key={surah.id} className="bg-stone-950 p-4 rounded-2xl border border-stone-850 hover:border-amber-600/40 space-y-3 transition-colors text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-100 text-sm">{surah.name}</span>
                      <span className="text-amber-400 font-serif mr-1.5 text-xs">({surah.arabicName})</span>
                    </div>
                    <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-full border border-stone-800">
                      {surah.ayahCount} {getTranslation('ayahs', language)}
                    </span>
                  </div>

                  <p className="font-serif text-stone-300 line-clamp-2 leading-relaxed bg-stone-900/60 p-2 rounded-lg" dir="rtl">
                    {surah.arabicText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-850/80">
                  <button
                    type="button"
                    onClick={() => setCurrentView('religious_hub')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{getTranslation('quranAudioAndText', language)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFavoriteDua(surah.id)}
                    className="p-1.5 bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                    title={getTranslation('removeFromFavorites', language)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* منوی همبرگری کشویی پروفایل (Slide-over Drawer) - بند ۸ خواسته کاربر */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-stone-900 border-r border-stone-800 h-full p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight text-xs text-stone-100"
          >
            <div className="space-y-6">
              {/* سربرگ دراور */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-950 border border-amber-500/40 overflow-hidden flex items-center justify-center text-amber-400 font-bold">
                    {currentUser?.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser?.fullName.charAt(0) || '👤'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-100 text-sm truncate max-w-[170px]">{currentUser?.fullName}</h3>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {currentUser?.role === 'owner' ? 'صاحب عزا' : 'کاربر ناظر'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* لیست گزینه‌های پایه و تنظیمات */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-500 font-bold block mb-1">امکانات و تنظیمات کاربری:</span>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openAppearanceModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-stone-950/70 hover:bg-stone-850 border border-stone-800 text-stone-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">تنظیمات ظاهر، تم و خط</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openSubscriptionModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/50 text-amber-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">تمدید اشتراک صاحب عزا (زیر ۵۰۰ ت)</span>
                  </div>
                  <span className="text-[9px] bg-amber-500/20 px-2 py-0.5 rounded font-bold">تمدید</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setShowSupportModal(true);
                  }}
                  className="w-full p-3 rounded-2xl bg-stone-950/70 hover:bg-stone-850 border border-stone-800 text-stone-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">تماس با کارشناسان و پشتیبانی ۲۴ساعته</span>
                  </div>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">آنلاین</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setShowAboutModal(true);
                  }}
                  className="w-full p-3 rounded-2xl bg-stone-950/70 hover:bg-stone-850 border border-stone-800 text-stone-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-sky-400" />
                    <span className="font-bold">درباره سامانه جهانی امواتگرام</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setCurrentView('religious_hub');
                  }}
                  className="w-full p-3 rounded-2xl bg-stone-950/70 hover:bg-stone-850 border border-stone-800 text-stone-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="font-bold">قرآن صوتی، ادعیه و زیارت‌نامه‌ها</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 rotate-180" />
                </button>
              </div>

              {/* تغییر سریع زبان در دراور */}
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <span className="text-[10px] text-stone-400 block font-bold">زبان فعال برنامه:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'fa', name: 'فارسی' },
                    { id: 'ku', name: 'کوردی' },
                    { id: 'en', name: 'English' },
                    { id: 'tr', name: 'Türkçe' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id as any)}
                      className={`p-1.5 rounded-lg text-center text-[11px] transition-colors cursor-pointer ${
                        language === l.id 
                          ? 'bg-amber-500 text-stone-950 font-bold' 
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* دکمه خروج */}
            <div className="pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  logoutUser();
                  setCurrentView('home');
                }}
                className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 border border-stone-800 flex items-center justify-center gap-2 transition-colors cursor-pointer font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال تماس با کارشناسان و پشتیبانی */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>تماس با کارشناسان و پشتیبانی ۲۴ ساعته</span>
              </h3>
              <button type="button" onClick={() => setShowSupportModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <p className="text-stone-300 leading-relaxed">
              کارشناسان امور هماهنگی مساجد، تالارها و امور ثبت شرعی آگهی‌های ترحیم به صورت شبانه‌روزی آماده پاسخگویی و راهنمایی شما هستند:
            </p>

            <div className="space-y-2 bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">مرکز تماس اضطراری:</span>
                <span className="font-mono text-amber-400 font-bold" dir="ltr">+98 21 8899 0011</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">پشتیبانی تلگرام و واتس‌اپ:</span>
                <span className="font-mono text-emerald-400 font-bold" dir="ltr">@Amvatgram_Support</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">پست الکترونیک رسمی:</span>
                <span className="font-mono text-sky-400" dir="ltr">support@amvatgram.com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* مدال درباره سامانه جهانی امواتگرام */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                <span>درباره سامانه جهانی امواتگرام (amvatgram.com)</span>
              </h3>
              <button type="button" onClick={() => setShowAboutModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <p className="text-stone-300 leading-relaxed">
              سامانه بین‌المللی امواتگرام به عنوان بستری جامع، مدرن و عمومی برای تمام هم‌کیشان و شهروندان در سراسر جهان طراحی گردیده است تا اطلاع‌رسانی مجالس، مسیریابی مساجد، قرائت قرآن و ابراز تسلیت با بیشترین احترام و سرعت انجام پذیرد.
            </p>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <p>• نسخه رسمی: 2.5.0 Global Release</p>
              <p>• دامنه اینترنتی: amvatgram.com</p>
              <p>• توسعه یافته با بالاترین استانداردهای امنیت و حریم خصوصی</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


