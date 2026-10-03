import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppProvider';
import { Header } from './Header';
import { HomeFeed } from './HomeFeed';
import { AdDetail } from './AdDetail';
import { CreateAdForm } from './CreateAdForm';
import { LocationsView } from './LocationsView';
import { UserProfileView } from './UserProfileView';
import { ReligiousHub } from './ReligiousHub';
import { DedicatedAdminPortal } from './DedicatedAdminPortal';
import { AuthView } from './AuthView';
import { MasterLoginModal } from './MasterLoginModal';
import { ThemeAppearanceModal } from './ThemeAppearanceModal';
import { GlobalLandingWebsite } from './GlobalLandingWebsite';
import { MobileBottomNav } from './MobileBottomNav';
import { SubscriptionModal } from './SubscriptionModal';
import { THEME_MODES, PALETTES } from '../utils/appearancePresets';
import { getTranslation } from '../utils/i18n';

export const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    isAuthenticated, 
    isMasterModalOpen, 
    closeMasterModal,
    activeMadhhabContext,
    requireOwnerAuth,
    setRequireOwnerAuth,
    currentUser,
    language,
    appearance,
    userPreferences,
    isAppearanceModalOpen,
    closeAppearanceModal,
    appDisplayMode
  } = useApp();

  // ۱. اعمال خودکار جهت متن (RTL / LTR) و زبان در سطح سند HTML
  useEffect(() => {
    const isLtr = language === 'en' || language === 'tr';
    document.documentElement.lang = language;
    document.documentElement.dir = isLtr ? 'ltr' : 'rtl';
  }, [language]);

  // ۲. پشتیبانی از روت اختصاصی مرورگر برای پرتال ادمین
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    return path.includes('/admin') || search.includes('admin=true');
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      setIsAdminRoute(path.includes('/admin') || search.includes('admin=true'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isAdminRoute || currentView === 'admin_dashboard') {
    return <DedicatedAdminPortal />;
  }

  // اگر کاربر حالت نمایش وب‌سایت معرفی رسمی (amvatgram.com) را انتخاب کرده باشد
  if (appDisplayMode === 'landing') {
    return <GlobalLandingWebsite />;
  }

  // ۳. صفحه ورود در صورت عدم لاگین
  if (!isAuthenticated) {
    return (
      <div 
        dir={language === 'en' || language === 'tr' ? 'ltr' : 'rtl'}
        className="w-full min-h-screen max-w-full overflow-x-hidden font-['Vazirmatn']"
      >
        <AuthView />
        <MasterLoginModal isOpen={isMasterModalOpen} onClose={closeMasterModal} />
      </div>
    );
  }

  // ۴. احراز هویت صاحب عزا
  if (requireOwnerAuth && currentUser?.role !== 'owner') {
    return (
      <div 
        dir={language === 'en' || language === 'tr' ? 'ltr' : 'rtl'}
        className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-3 sm:p-4 w-full max-w-full overflow-x-hidden font-['Vazirmatn']"
      >
        <div className="mb-4 text-center">
          <button
            onClick={() => setRequireOwnerAuth(false)}
            className="text-xs text-stone-400 hover:text-stone-200 underline underline-offset-4 cursor-pointer"
          >
            ← {language === 'en' ? 'Cancel & Return' : language === 'ku' ? 'پاشگەزبوونەوە و گەڕانەوە' : 'انصراف و بازگشت به صفحه اصلی'}
          </button>
        </div>
        <AuthView forceOwnerFlow={true} />
        <MasterLoginModal isOpen={isMasterModalOpen} onClose={closeMasterModal} />
      </div>
    );
  }

  const isSunni = activeMadhhabContext === 'sunni';
  const isLtr = language === 'en' || language === 'tr';
  const currentTheme = THEME_MODES[userPreferences.themeMode] || THEME_MODES.dark;
  const currentPalette = PALETTES[userPreferences.colorPalette] || PALETTES.gold;
  const isLargeText = userPreferences.fontScale === 'large';

  return (
    <div 
      dir={isLtr ? 'ltr' : 'rtl'}
      className={`min-h-screen flex flex-col font-['Vazirmatn'] w-full max-w-full overflow-x-hidden transition-colors duration-300 ${currentTheme.bgClass} ${currentTheme.textPrimary} ${
        isLargeText ? 'text-sm' : 'text-xs'
      }`}
    >
      <Header />

      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-24">
        {currentView === 'home' && <HomeFeed />}
        {currentView === 'detail' && <AdDetail />}
        {currentView === 'create_ad' && <CreateAdForm />}
        {currentView === 'locations' && <LocationsView />}
        {currentView === 'user_profile' && <UserProfileView />}
        {currentView === 'religious_hub' && <ReligiousHub />}
      </main>

      {/* مدال محرمانه ورود سازنده */}
      <MasterLoginModal isOpen={isMasterModalOpen} onClose={closeMasterModal} />

      {/* مدال تمدید و خرید اشتراک صاحب عزا (کمتر از ۵۰۰ هزار تومان) */}
      <SubscriptionModal />

      {/* مدال شخصی‌سازی ظاهر و تغییر تم کاربر */}
      <ThemeAppearanceModal isOpen={isAppearanceModalOpen} onClose={closeAppearanceModal} />

      {/* نوار ناوبری شبکه اجتماعی موبایل در پایین صفحه (آیتم ۸ خواسته کاربر) */}
      <MobileBottomNav />

      {/* فوتر رسمی با طراحی کاملاً فیت موبایل و ترجمه چندزبانه */}
      <footer className="bg-stone-900/90 border-t border-stone-800/80 py-6 sm:py-8 px-4 mt-8 sm:mt-12 text-xs text-stone-400 w-full max-w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-right">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-serif font-black text-amber-500 text-sm">
                {appearance.heroTitle ? appearance.heroTitle.split(' — ')[0] : getTranslation('appName', language)}
              </span>
              <span className="font-bold text-stone-200">
                {getTranslation('copyrightText', language)}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 flex items-center justify-center md:justify-start gap-1">
              <span>{appearance.customFooterNote || 'سامانه جامع و بین‌المللی اطلاع‌رسانی ترحیم و یادبود در سراسر جهان'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400 text-[11px]">
            <button
              onClick={() => setCurrentView('religious_hub')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              {getTranslation('religiousServices', language)}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('locations')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              {getTranslation('locations', language)}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('user_profile')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {getTranslation('myProfile', language)}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              {getTranslation('home', language)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
