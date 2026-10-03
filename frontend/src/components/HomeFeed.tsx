import React from 'react';
import { useApp } from '../context/AppProvider';
import { AdCard } from './AdCard';
import { HomeHeroBanner } from './HomeHeroBanner';
import { DailyDeceasedStoriesSlider } from './DailyDeceasedStoriesSlider';
import { Search, MapPin, Sparkles, Building2, Palette, SlidersHorizontal } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const HomeFeed: React.FC = () => {
  const { 
    approvedAds, 
    searchQuery, 
    setSearchQuery, 
    activeMadhhabContext, 
    requestCreateAdAsOwner,
    language,
    userPreferences,
    openAppearanceModal 
  } = useApp();

  const isSunni = activeMadhhabContext === 'sunni';

  const filteredAds = approvedAds.filter((ad) => {
    return (
      ad.deceased.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.deceased.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.deceased.burialCemetery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.ceremonies.some((c) => c.locationName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getGridClasses = () => {
    if (userPreferences.cardDensity === 'poster') {
      return 'grid grid-cols-1 sm:grid-cols-2 gap-8';
    }
    if (userPreferences.cardDensity === 'compact') {
      return 'grid grid-cols-1 gap-3';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* ۱. بنر شاخص و هیروی صفحه اصلی با لوگو و نشان رسمی برند */}
      <HomeHeroBanner />

      {/* ۲. نوار جستجو و دکمه سریع تغییر تم */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-2.5 sm:p-3 mb-6 sm:mb-8 shadow-xl flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${
            language === 'en' || language === 'tr' ? 'left-3.5' : 'right-3.5'
          }`} />
          <input
            type="text"
            placeholder={getTranslation('searchPlaceholder', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors ${
              language === 'en' || language === 'tr' ? 'pl-10 pr-4' : 'pr-10 pl-4'
            }`}
          />
        </div>

        <button
          type="button"
          onClick={openAppearanceModal}
          className="px-3 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-850 text-stone-300 hover:text-amber-300 border border-stone-800 transition-colors text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm"
          title="شخصی‌سازی ظاهر و تم"
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">ظاهر و تم</span>
        </button>
      </div>

      {/* نمایش اسلایدی اتوماتیک افقی آگهی‌های ثبت شده در روز (بند ۱۳ خواسته کاربر) */}
      <DailyDeceasedStoriesSlider />

      {/* ۳. فید آگهی‌ها */}
      {filteredAds.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 sm:p-12 text-center max-w-md mx-auto">
          <p className="text-stone-400 text-sm mb-4">
            {getTranslation('noAdsFound', language)}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 px-4 py-2 rounded-xl cursor-pointer"
          >
            {getTranslation('clearSearch', language)}
          </button>
        </div>
      ) : (
        <div className={getGridClasses()}>
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}


      {/* بنر ثبت آگهی با هدایت به اعتبارسنجی صاحب عزا */}
      <div className={`mt-12 sm:mt-16 border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl ${
        isSunni 
          ? 'bg-gradient-to-r from-stone-900 to-emerald-950/40 border-emerald-900/40' 
          : 'bg-gradient-to-r from-stone-900 to-blue-950/40 border-blue-900/40'
      }`}>
        <div className="text-center sm:text-right">
          <h3 className="text-base sm:text-lg font-bold text-stone-100 mb-1">
            {getTranslation('createAd', language)}
          </h3>
          <p className="text-xs text-stone-400 max-w-xl">
            {getTranslation(isSunni ? 'appTaglineSunni' : 'appTaglineShia', language)}
          </p>
        </div>

        <button
          onClick={requestCreateAdAsOwner}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-xl active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          {getTranslation('createAd', language)}
        </button>
      </div>
    </div>
  );
};
