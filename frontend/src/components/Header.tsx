import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Home, 
  User, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Settings, 
  BookOpen,
  Check,
  Palette
} from 'lucide-react';
import { AppLanguage, getTranslation } from '../utils/i18n';
import { PALETTES } from '../utils/appearancePresets';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    logoutUser, 
    activeMadhhabContext, 
    openMasterModal, 
    requestCreateAdAsOwner, 
    language, 
    setLanguage,
    appearance,
    userPreferences,
    openAppearanceModal,
    appDisplayMode,
    setAppDisplayMode,
  } = useApp();

  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentPalette = PALETTES[userPreferences.colorPalette] || PALETTES.gold;

  // استیت اسکرول هوشمند برای کوچک و فشرده شدن هدر هنگام اسکرول صفحه
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSecretLogoTrigger = () => {
    const nextCount = logoClickCount + 1;
    if (nextCount >= 5) {
      setLogoClickCount(0);
      openMasterModal();
    } else {
      setLogoClickCount(nextCount);
      setTimeout(() => setLogoClickCount(0), 4000);
    }
  };

  const isSunni = activeMadhhabContext === 'sunni';

  const languagesList: { id: AppLanguage; label: string; flag: string }[] = [
    { id: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { id: 'ku', label: 'کوردی (سۆرانی)', flag: '☀️' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  const currentLangObj = languagesList.find((l) => l.id === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 font-['Vazirmatn'] transition-all duration-300">
      {/* نوار بالایی: در حالت اسکرول پنهان می‌شود تا فقط اجزای اصلی بمانند */}
      {!isScrolled && (
        <div className={`px-3 sm:px-4 py-1.5 text-xs border-b transition-all flex items-center justify-between ${
          isSunni ? 'bg-emerald-950/40 border-emerald-900/50' : 'bg-blue-950/40 border-blue-900/50'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${isSunni ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`}></span>
              <span className={`text-[11px] sm:text-xs ${isSunni ? 'text-emerald-300' : 'text-blue-300'}`}>
                {getTranslation(isSunni ? 'sunniTitle' : 'shiaTitle', language)}
              </span>
            </span>

            <span className="text-stone-700 hidden sm:inline">|</span>

            {/* سوییچر زبان‌های برنامه همراه با اعمال آنی */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-[11px] text-stone-200 hover:text-amber-400 transition-colors bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold">{currentLangObj.flag} {currentLangObj.label}</span>
              </button>

              {showLangMenu && (
                <div className="absolute top-full mt-1.5 bg-stone-900 border border-stone-750 rounded-2xl shadow-2xl py-1.5 z-50 w-44 text-xs backdrop-blur-xl">
                  {languagesList.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.id);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-stone-800 transition-colors cursor-pointer ${
                        language === lang.id ? 'text-amber-400 font-bold bg-stone-850' : 'text-stone-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* دکمه انتقال به وب‌سایت رسمی amvatgram.com */}
            <button
              type="button"
              onClick={() => setAppDisplayMode('landing')}
              className="hidden md:flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-800/60 font-mono font-bold transition-all cursor-pointer shadow-sm"
              title="مشاهده وب‌سایت رسمی و لینک‌های دانلود (amvatgram.com)"
            >
              <span>🌐</span>
              <span>amvatgram.com</span>
            </button>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 text-stone-300 text-[11px]">
              <button
                onClick={() => setCurrentView('user_profile')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'user_profile'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800'
                }`}
              >
                <User className="w-3 h-3 text-amber-400" />
                <span className="font-bold truncate max-w-[100px]">{currentUser.fullName}</span>
              </button>

              <button
                onClick={logoutUser}
                className="text-stone-400 hover:text-rose-400 p-1 cursor-pointer"
                title={getTranslation('logout', language)}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* نوار اصلی هدر - در هنگام اسکرول جمع‌وجور و فشرده می‌شود */}
      <div className={`max-w-6xl mx-auto px-3 sm:px-4 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'py-1.5' : 'py-2.5 sm:py-3'
      }`}>
        {/* لوگو و نام امواتگرام */}
        <div 
          onClick={() => {
            setCurrentView('home');
            handleSecretLogoTrigger();
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className={`rounded-xl overflow-hidden border border-amber-600/40 shadow-xl group-hover:border-amber-400 transition-all flex-shrink-0 bg-stone-950 p-0.5 ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'
          }`}>
            <img 
              src={appearance.appLogoUrl || '/assets/app-logo.jpg'} 
              alt={appearance.heroTitle || 'امواتگرام'} 
              className="w-full h-full object-cover rounded-lg shadow-inner group-hover:scale-105 transition-transform" 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/app-logo.jpg';
              }}
            />
          </div>

          <div>
            <h1 className={`font-black tracking-tight text-stone-100 flex items-center gap-1.5 transition-all ${
              isScrolled ? 'text-sm' : 'text-base sm:text-lg'
            }`}>
              {appearance.heroTitle ? appearance.heroTitle.split(' — ')[0] : getTranslation('appName', language)}
              {!isScrolled && (
                <span className="text-[9px] font-normal px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 hidden sm:inline">
                  Global
                </span>
              )}
            </h1>

            {/* در حالت اسکرول توضیحات زیر عنوان پنهان می‌شوند */}
            {!isScrolled && (
              <p className="text-[10px] sm:text-[11px] text-stone-400 hidden xs:block truncate max-w-[240px] sm:max-w-none">
                {appearance.heroTagline || getTranslation(isSunni ? 'appTaglineSunni' : 'appTaglineShia', language)}
              </p>
            )}
          </div>
        </div>

        {/* دکمه‌های ناوبری اصلی: خانه، ادعیه و قرآن، مساجد، تم و ثبت آگهی */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {/* دکمه خانه */}
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-stone-800 text-amber-300 border border-stone-700 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={getTranslation('home', language)}
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">{getTranslation('home', language)}</span>
          </button>

          {/* دکمه دعا، احادیث و قرآن */}
          <button
            onClick={() => setCurrentView('religious_hub')}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentView === 'religious_hub'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={getTranslation('religiousServices', language)}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation('religiousServices', language)}</span>
          </button>

          {/* مساجد و آرامستان‌ها */}
          <button
            onClick={() => setCurrentView('locations')}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentView === 'locations'
                ? 'bg-stone-800 text-stone-100 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={getTranslation('locations', language)}
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden lg:inline">{getTranslation('locations', language)}</span>
          </button>

          {/* شخصی‌سازی ظاهر و تم */}
          <button
            type="button"
            onClick={openAppearanceModal}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-800/50 shadow-sm transition-all cursor-pointer"
            title="شخصی‌سازی ظاهر و تغییر تم"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">ظاهر و تم</span>
          </button>

          {/* ثبت آگهی */}
          <button
            onClick={requestCreateAdAsOwner}
            className={`flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
              isScrolled ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 sm:px-3.5 py-2'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-stone-950 flex-shrink-0" />
            <span>{getTranslation('createAd', language)}</span>
          </button>

        </nav>
      </div>
    </header>
  );
};
