import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  HeartHandshake, 
  Sparkles, 
  Calendar, 
  Bookmark, 
  Check, 
  Share2, 
  Search,
  Languages,
  X,
  Tag,
  Clock,
  Compass,
  Filter,
  Mic,
  Headphones,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Radio,
  Star,
  Trash2
} from 'lucide-react';
import { 
  QURAN_SURAHS, 
  MEMORIAL_DUAS, 
  WEEKLY_HADITHS, 
  QURAN_RECITERS,
  QuranSurahAudio, 
  MemorialDuaa,
  DailyHadithAndDua,
  QuranReciter,
  getSurahAudioUrl,
  getReciterName
} from '../data/religiousServices';
import { AppLanguage, getTranslation } from '../utils/i18n';

export const ReligiousHub: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    favoriteDuaIds, 
    toggleFavoriteDua, 
    isDuaFavorite 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quran' | 'duas' | 'hadiths' | 'favorites'>('duas');
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);

  const handleToggleFavorite = (id: string, title?: string) => {
    const isCurrentlyFav = isDuaFavorite(id);
    toggleFavoriteDua(id);
    setFavoriteToast(
      isCurrentlyFav
        ? (language === 'ku' ? `«${title || ''}» لە دڵخوازەکان سڕایەوە` : `«${title || 'مورد'}» از علاقه‌مندی‌ها حذف شد`)
        : (language === 'ku' ? `«${title || ''}» بۆ دڵخوازەکان زیادکرا` : `«${title || 'مورد'}» به علاقه‌مندی‌ها اضافه شد 🔖`)
    );
    setTimeout(() => setFavoriteToast(null), 2500);
  };

  // استیت انتخاب قاری از میان قاریان مشهور جهان اسلام
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => {
    return localStorage.getItem('amvatgram_reciter') || 'basit';
  });
  const [showReciterSelector, setShowReciterSelector] = useState<boolean>(false);

  const activeReciter = QURAN_RECITERS.find((r) => r.id === selectedReciterId) || QURAN_RECITERS[0];

  const handleSelectReciter = (reciterId: string) => {
    setSelectedReciterId(reciterId);
    try {
      localStorage.setItem('amvatgram_reciter', reciterId);
    } catch (e) {
      console.log('localStorage error', e);
    }

    // در صورت پخش زنده، تغییر بلادرنگ صوت سوره جاری به قاری جدید
    if (playingSurahId && isPlaying && audioRef.current) {
      const currentSurah = QURAN_SURAHS.find((s) => s.id === playingSurahId);
      if (currentSurah) {
        const newAudioUrl = getSurahAudioUrl(currentSurah.surahNumber, reciterId);
        audioRef.current.src = newAudioUrl;
        audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
  };

  // استیت‌های پخش صوت قرآن کریم
  const [playingSurahId, setPlayingSurahId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSurahForReading, setActiveSurahForReading] = useState<QuranSurahAudio>(QURAN_SURAHS[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // استیت‌های جستجوی هوشمند (بر اساس نام، مناسبت و موضوع)
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // زبان ترجمه انتخابی برای ادعیه و قرآن (همگام با زبان فعال اپلیکیشن)
  const [selectedTranslationLang, setSelectedTranslationLang] = useState<AppLanguage>(language);

  useEffect(() => {
    setSelectedTranslationLang(language);
  }, [language]);

  const handleLanguageChange = (lang: AppLanguage) => {
    setSelectedTranslationLang(lang);
    setLanguage(lang);
  };

  // محاسبه حدیث و ذکر امروز بر اساس روز هفته
  const todayDayIndex = new Date().getDay(); // 0 = یکشنبه, 6 = شنبه
  const adjustedDayIndex = (todayDayIndex + 1) % 7;
  const todayHadith = WEEKLY_HADITHS.find((h) => h.dayOfWeek === adjustedDayIndex) || WEEKLY_HADITHS[0];

  const [zikrCountDone, setZikrCountDone] = useState(0);

  // تابع هوشمند نرمال‌سازی متن (حذف اعراب، یکسان‌سازی حروف فارسی و عربی)
  const normalizeText = (text: string) => {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, '') // حذف اعراب و تشدید و تنوین‌ها
      .replace(/[یي]/g, 'ی')
      .replace(/[کك]/g, 'ک')
      .replace(/[آاأإ]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .toLowerCase()
      .trim();
  };

  // موضوعات و مناسبت‌های سریع پیشنهادی برای جستجوی تک‌ضربه
  const quickTopicsList = [
    { id: 'all', label: getTranslation('allCategories', language) },
    { id: 'ترحیم', label: language === 'ku' ? 'پرسە و سەرەخۆشی' : language === 'en' ? 'Memorial / Funeral' : 'ترحیم و ختم' },
    { id: 'تشییع', label: language === 'ku' ? 'بەخاکسپاردن' : language === 'en' ? 'Burial & Janaza' : 'تشییع و خاکسپاری' },
    { id: 'آمرزش', label: language === 'ku' ? 'لێخۆشبوون' : language === 'en' ? 'Forgiveness & Mercy' : 'آمرزش و مغفرت' },
    { id: 'صبر', label: language === 'ku' ? 'ئارامی و سەبووری' : language === 'en' ? 'Patience & Solace' : 'صبر و تسلی' },
    { id: 'تلقین', label: language === 'ku' ? 'تەڵقین' : language === 'en' ? 'Talqeen' : 'تلقین میت' },
    { id: 'بانوان', label: language === 'ku' ? 'خانمان' : language === 'en' ? 'Women Gathering' : 'مجلس بانوان' },
    { id: 'شب جمعه', label: language === 'ku' ? 'شەوی هەینی' : language === 'en' ? 'Thursday Night' : 'شب جمعه و اموات' },
    { id: 'صدقه', label: language === 'ku' ? 'خێر و صەدەقە' : language === 'en' ? 'Charity' : 'صدقه جاریه' },
    { id: 'ذکر', label: language === 'ku' ? 'ویرد و زیکر' : language === 'en' ? 'Daily Zikr' : 'اذکار روز' },
  ];

  // فیلتر هوشمند ادعیه
  const filteredDuas = MEMORIAL_DUAS.filter((dua) => {
    // ۱. فیلتر مناسبت دکمه‌ای
    if (selectedOccasion !== 'all' && dua.occasion !== selectedOccasion) {
      return false;
    }

    // ۲. فیلتر موضوع سریع
    if (selectedTopicFilter !== 'all') {
      const normTopic = normalizeText(selectedTopicFilter);
      const matchesTopicOrTag = 
        normalizeText(dua.topic).includes(normTopic) ||
        normalizeText(dua.occasionTitle).includes(normTopic) ||
        dua.tags.some((t) => normalizeText(t).includes(normTopic));
      if (!matchesTopicOrTag) return false;
    }

    // ۳. کوئری تایپ‌شده در باکس جستجوی هوشمند
    if (!smartSearchQuery.trim()) return true;

    const q = normalizeText(smartSearchQuery);
    return (
      normalizeText(dua.title).includes(q) ||
      normalizeText(dua.topic).includes(q) ||
      normalizeText(dua.occasionTitle).includes(q) ||
      dua.tags.some((t) => normalizeText(t).includes(q)) ||
      normalizeText(dua.arabicText).includes(q) ||
      normalizeText(dua.persianMeaning).includes(q) ||
      (dua.kurdishMeaning && normalizeText(dua.kurdishMeaning).includes(q)) ||
      (dua.englishMeaning && dua.englishMeaning.toLowerCase().includes(smartSearchQuery.toLowerCase())) ||
      (dua.turkishMeaning && dua.turkishMeaning.toLowerCase().includes(smartSearchQuery.toLowerCase())) ||
      normalizeText(dua.instructions).includes(q)
    );
  });

  // فیلتر هوشمند احادیث و اذکار
  const filteredHadiths = WEEKLY_HADITHS.filter((h) => {
    if (selectedTopicFilter !== 'all') {
      const normTopic = normalizeText(selectedTopicFilter);
      const matchesTopicOrTag = 
        normalizeText(h.topic).includes(normTopic) ||
        normalizeText(h.occasionTitle).includes(normTopic) ||
        h.tags.some((t) => normalizeText(t).includes(normTopic));
      if (!matchesTopicOrTag) return false;
    }

    if (!smartSearchQuery.trim()) return true;

    const q = normalizeText(smartSearchQuery);
    return (
      normalizeText(h.dayName).includes(q) ||
      normalizeText(h.topic).includes(q) ||
      normalizeText(h.occasionTitle).includes(q) ||
      h.tags.some((t) => normalizeText(t).includes(q)) ||
      normalizeText(h.dailyZikr).includes(q) ||
      normalizeText(h.zikrPersianMeaning).includes(q) ||
      (h.zikrKurdishMeaning && normalizeText(h.zikrKurdishMeaning).includes(q)) ||
      (h.zikrEnglishMeaning && h.zikrEnglishMeaning.toLowerCase().includes(smartSearchQuery.toLowerCase())) ||
      normalizeText(h.hadithText).includes(q) ||
      (h.hadithPersianMeaning && normalizeText(h.hadithPersianMeaning).includes(q)) ||
      (h.hadithKurdishMeaning && normalizeText(h.hadithKurdishMeaning).includes(q)) ||
      (h.hadithEnglishMeaning && h.hadithEnglishMeaning.toLowerCase().includes(smartSearchQuery.toLowerCase())) ||
      normalizeText(h.narrator).includes(q) ||
      normalizeText(h.source).includes(q)
    );
  });

  // فیلتر هوشمند قرآن کریم
  const filteredSurahs = QURAN_SURAHS.filter((surah) => {
    if (selectedTopicFilter !== 'all') {
      const normTopic = normalizeText(selectedTopicFilter);
      const matchesTopicOrTag = 
        (surah.topic && normalizeText(surah.topic).includes(normTopic)) ||
        (surah.occasionTitle && normalizeText(surah.occasionTitle).includes(normTopic)) ||
        (surah.tags && surah.tags.some((t) => normalizeText(t).includes(normTopic)));
      if (!matchesTopicOrTag) return false;
    }

    if (!smartSearchQuery.trim()) return true;

    const q = normalizeText(smartSearchQuery);
    return (
      normalizeText(surah.name).includes(q) ||
      normalizeText(surah.arabicName).includes(q) ||
      surah.englishName.toLowerCase().includes(smartSearchQuery.toLowerCase()) ||
      (surah.topic && normalizeText(surah.topic).includes(q)) ||
      (surah.tags && surah.tags.some((t) => normalizeText(t).includes(q))) ||
      normalizeText(surah.arabicText).includes(q) ||
      normalizeText(surah.persianTranslation).includes(q) ||
      (surah.kurdishTranslation && normalizeText(surah.kurdishTranslation).includes(q))
    );
  });

  const totalResultsCount = filteredDuas.length + filteredHadiths.length + filteredSurahs.length;
  const isSearchActive = smartSearchQuery.trim() !== '' || selectedTopicFilter !== 'all';

  const clearAllSearch = () => {
    setSmartSearchQuery('');
    setSelectedTopicFilter('all');
    setSelectedOccasion('all');
  };

  const handleTopicTagClick = (tag: string) => {
    setSmartSearchQuery(tag);
    setSelectedTopicFilter('all');
  };

  const togglePlaySurah = (surah: QuranSurahAudio) => {
    const audioUrl = getSurahAudioUrl(surah.surahNumber, selectedReciterId);
    if (playingSurahId === surah.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
        setPlayingSurahId(surah.id);
        setIsPlaying(true);
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // دریافت ترجمه متناسب برای ادعیه بر اساس زبان فعال یا انتخابی
  const getDuaMeaning = (dua: MemorialDuaa) => {
    if (selectedTranslationLang === 'ku' && dua.kurdishMeaning) return dua.kurdishMeaning;
    if (selectedTranslationLang === 'en' && dua.englishMeaning) return dua.englishMeaning;
    if (selectedTranslationLang === 'ar' && dua.arabicMeaning) return dua.arabicMeaning;
    if (selectedTranslationLang === 'tr' && dua.turkishMeaning) return dua.turkishMeaning;
    return dua.persianMeaning;
  };

  // دریافت ترجمه ذکر روز
  const getZikrMeaning = (h: typeof todayHadith) => {
    if (selectedTranslationLang === 'ku' && h.zikrKurdishMeaning) return h.zikrKurdishMeaning;
    if (selectedTranslationLang === 'en' && h.zikrEnglishMeaning) return h.zikrEnglishMeaning;
    if (selectedTranslationLang === 'tr' && h.zikrTurkishMeaning) return h.zikrTurkishMeaning;
    return h.zikrPersianMeaning;
  };

  // دریافت ترجمه حدیث روز
  const getHadithMeaning = (h: typeof todayHadith) => {
    if (selectedTranslationLang === 'ku' && h.hadithKurdishMeaning) return h.hadithKurdishMeaning;
    if (selectedTranslationLang === 'en' && h.hadithEnglishMeaning) return h.hadithEnglishMeaning;
    if (selectedTranslationLang === 'tr' && h.hadithTurkishMeaning) return h.hadithTurkishMeaning;
    return h.hadithPersianMeaning || h.hadithText;
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* سربرگ بخش قرآن و ادعیه */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs bg-amber-950/80 text-amber-300 px-3 py-1 rounded-full border border-amber-800/80 font-bold inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{getTranslation('religiousServices', language)}</span>
        </span>
        <h2 className="text-xl sm:text-3xl font-black text-stone-100 tracking-tight">
          {getTranslation('quranAudioAndText', language)}، ادعیه و اذکار
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
          {getTranslation('prayerHubDesc', language)}
        </p>

        {/* سوییچر تغییر زبان ترجمه برای متون، اذکار و ادعیه */}
        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-stone-400 flex items-center gap-1 ml-1">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation('langSwitchLabel', language)}</span>
          </span>
          <button
            type="button"
            onClick={() => handleLanguageChange('fa')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTranslationLang === 'fa' ? 'bg-amber-600 text-stone-950 shadow' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🇮🇷 فارسی
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ku')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTranslationLang === 'ku' ? 'bg-amber-600 text-stone-950 shadow' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            ☀️ کوردی
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTranslationLang === 'en' ? 'bg-amber-600 text-stone-950 shadow' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTranslationLang === 'ar' ? 'bg-amber-600 text-stone-950 shadow' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🇸🇦 العربية
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('tr')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTranslationLang === 'tr' ? 'bg-amber-600 text-stone-950 shadow' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🇹🇷 Türkçe
          </button>
        </div>

        {/* نوار نمایش و انتخاب قاری فعال برای تلاوت‌ها و ادعیه */}
        <div className="mt-4 bg-stone-900/90 border border-stone-800 hover:border-amber-600/40 rounded-2xl p-3 sm:p-4 max-w-3xl mx-auto shadow-xl space-y-3 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-right w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                {activeReciter.flag}
              </div>
              <div className="space-y-0.5 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-stone-400">{getTranslation('activeReciter', language)}</span>
                  <span className="text-xs sm:text-sm font-black text-amber-300">
                    {activeReciter.name[language] || activeReciter.name.fa}
                  </span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    {activeReciter.badge}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 flex items-center gap-1.5 flex-wrap">
                  <span className="text-stone-500">{getTranslation('reciterStyle', language)}</span>
                  <span className="text-stone-300">{activeReciter.style[language] || activeReciter.style.fa}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReciterSelector(!showReciterSelector)}
              className="w-full sm:w-auto px-4 py-2 bg-stone-800 hover:bg-stone-750 active:scale-95 text-stone-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-stone-700/80 cursor-pointer transition-all shadow-sm flex-shrink-0"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>{showReciterSelector ? (language === 'ku' ? 'داخستنی لیست' : language === 'en' ? 'Close List' : 'بستن لیست قاریان') : getTranslation('changeReciter', language)}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${showReciterSelector ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* لیست بازشونده انتخاب سریع از میان قاریان مشهور جهان اسلام */}
          {showReciterSelector && (
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>{getTranslation('famousReciters', language)}:</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {QURAN_RECITERS.length} {language === 'ku' ? 'قورئانخوێن' : language === 'en' ? 'Reciters' : 'قاری'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {QURAN_RECITERS.map((reciter) => {
                  const isSelected = selectedReciterId === reciter.id;
                  return (
                    <button
                      key={reciter.id}
                      type="button"
                      onClick={() => {
                        handleSelectReciter(reciter.id);
                        setShowReciterSelector(false);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer relative ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                          : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{reciter.flag}</span>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate block ${isSelected ? 'text-amber-300 font-black' : 'text-stone-200'}`}>
                            {reciter.name[language] || reciter.name.fa}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-stone-400 truncate">
                          {reciter.style[language] || reciter.style.fa}
                        </p>
                        <span className="text-[9px] text-stone-500 block">
                          {reciter.country} • {reciter.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ماژول جستجوی هوشمند بر اساس نام دعا، مناسبت و موضوع (قابلیت درخواستی جدید) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2 text-stone-200 text-xs font-bold w-full sm:w-auto">
            <Search className="w-4 h-4 text-amber-500" />
            <span>{getTranslation('smartSearchTitle', language)}</span>
            <span className="text-[10px] text-stone-500 font-normal hidden sm:inline">
              (بر اساس نام دعا، مناسبت‌ها و موضوعات شرعی)
            </span>
          </div>

          {isSearchActive && (
            <button
              type="button"
              onClick={clearAllSearch}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{getTranslation('clearSearch', language)}</span>
            </button>
          )}
        </div>

        {/* فیلد ورودی جستجوی هوشمند */}
        <div className="relative w-full">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${
            language === 'en' || language === 'tr' ? 'left-3.5' : 'right-3.5'
          }`} />
          <input
            type="text"
            placeholder={getTranslation('smartSearchPlaceholder', language)}
            value={smartSearchQuery}
            onChange={(e) => setSmartSearchQuery(e.target.value)}
            className={`w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 outline-none transition-all shadow-inner ${
              language === 'en' || language === 'tr' ? 'pl-10 pr-10' : 'pr-10 pl-10'
            }`}
          />
          {smartSearchQuery && (
            <button
              type="button"
              onClick={() => setSmartSearchQuery('')}
              className={`absolute top-3 text-stone-500 hover:text-stone-300 cursor-pointer p-0.5 ${
                language === 'en' || language === 'tr' ? 'right-3.5' : 'left-3.5'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* برچسب‌های سریع موضوعات و مناسبت‌ها (Quick Topic & Occasion Chips) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>{getTranslation('quickTopics', language)}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {quickTopicsList.map((topic) => {
              const isSelected = selectedTopicFilter === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicFilter(topic.id);
                    if (topic.id !== 'all') {
                      setSmartSearchQuery('');
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold shadow-md'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* نوار وضعیت نتایج جستجو */}
        {isSearchActive && (
          <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">{getTranslation('searchResultsFor', language)}</span>
              {smartSearchQuery && (
                <span className="bg-amber-600/20 text-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-500/40 font-bold">
                  «{smartSearchQuery}»
                </span>
              )}
              {selectedTopicFilter !== 'all' && (
                <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-800 font-bold">
                  #{selectedTopicFilter}
                </span>
              )}
            </div>

            <span className="text-stone-300 font-mono">
              <strong className="text-amber-400">{totalResultsCount}</strong> {getTranslation('itemsFound', language)}
              {' '}({filteredDuas.length} دعا، {filteredHadiths.length} حدیث، {filteredSurahs.length} سوره)
            </span>
          </div>
        )}
      </div>

      {/* پخش‌کننده صوتی مخفی */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* نوار تب‌های چهارگانه با نمایش تعداد نتایج و نشان‌شده‌ها */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl w-full">
        <button
          onClick={() => setActiveTab('duas')}
          className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'duas'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="truncate">{getTranslation('memorialPrayers', language)}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'duas' ? 'bg-stone-950/80 text-amber-300' : 'bg-stone-800 text-stone-400'
          }`}>
            {filteredDuas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hadiths')}
          className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'hadiths'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="truncate">{getTranslation('hadithsAndZikr', language)}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'hadiths' ? 'bg-stone-950/80 text-amber-300' : 'bg-stone-800 text-stone-400'
          }`}>
            {filteredHadiths.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quran')}
          className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'quran'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="truncate">{getTranslation('quranAudioAndText', language)}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'quran' ? 'bg-stone-950/80 text-amber-300' : 'bg-stone-800 text-stone-400'
          }`}>
            {filteredSurahs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'favorites' ? 'fill-stone-950 text-stone-950' : 'text-amber-400'}`} />
          <span className="truncate">{getTranslation('myFavorites', language)}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTab === 'favorites' ? 'bg-stone-950/80 text-amber-300' : 'bg-amber-950/60 text-amber-400 border border-amber-800/80'
          }`}>
            {favoriteDuaIds.length}
          </span>
        </button>
      </div>

      {/* ۱. تب ادعیه ختم، خاکسپاری و فاتحه‌خوانی مساجد و بانوان با برچسب‌های هوشمند موضوع و مناسبت */}
      {activeTab === 'duas' && (
        <div className="space-y-4 sm:space-y-6 w-full">
          {/* فیلتر مناسبت‌های ادعیه */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 sm:p-4 rounded-2xl w-full">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full scrollbar-none text-xs pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedOccasion('all')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'all' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {getTranslation('filterAll', language)}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOccasion('mosque_fatiha')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'mosque_fatiha' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {getTranslation('filterMosque', language)}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOccasion('women_assembly')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'women_assembly' ? 'bg-rose-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {getTranslation('filterWomen', language)}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOccasion('cemetery_burial')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'cemetery_burial' ? 'bg-sky-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {getTranslation('filterCemetery', language)}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOccasion('talqeen')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'talqeen' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                تلقین میت
              </button>
              <button
                type="button"
                onClick={() => setSelectedOccasion('janaza_prayer')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedOccasion === 'janaza_prayer' ? 'bg-purple-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                نماز میت (جنازه)
              </button>
            </div>
          </div>

          {/* در صورت عدم یافت نتیجه در ادعیه */}
          {filteredDuas.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 text-center space-y-3">
              <p className="text-stone-400 text-sm">
                دعایی مطابق با جستجوی شما یافت نشد.
              </p>
              <button
                type="button"
                onClick={clearAllSearch}
                className="text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 px-4 py-2 rounded-xl cursor-pointer"
              >
                {getTranslation('clearSearch', language)}
              </button>
            </div>
          ) : (
            /* کارت‌های ادعیه همراه با برچسب‌های هوشمند موضوع و مناسبت و ترجمه دقیق */
            <div className="space-y-4 w-full">
              {filteredDuas.map((dua) => (
                <div
                  key={dua.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-600/40 rounded-3xl p-4 sm:p-7 shadow-xl space-y-4 relative overflow-hidden w-full transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-amber-300">{dua.title}</h3>
                        
                        {/* نشان مناسبت */}
                        <span 
                          onClick={() => handleTopicTagClick(dua.occasionTitle)}
                          className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded-full font-bold cursor-pointer hover:bg-sky-900 transition-colors"
                          title="کلیک برای فیلتر بر اساس این مناسبت"
                        >
                          مناسبت: {dua.occasionTitle}
                        </span>

                        {/* نشان موضوع */}
                        <span 
                          onClick={() => handleTopicTagClick(dua.topic)}
                          className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold cursor-pointer hover:bg-emerald-900 transition-colors"
                          title="کلیک برای فیلتر بر اساس این موضوع"
                        >
                          موضوع: {dua.topic}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">{dua.instructions}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(dua.id, dua.title)}
                        className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all flex-shrink-0 ${
                          isDuaFavorite(dua.id)
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold'
                            : 'bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 border border-stone-750'
                        }`}
                        title={isDuaFavorite(dua.id) ? getTranslation('removeFromFavorites', language) : getTranslation('addToFavorites', language)}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isDuaFavorite(dua.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{isDuaFavorite(dua.id) ? (language === 'ku' ? 'نیشانکراوە' : 'نشان‌شده') : (language === 'ku' ? 'نیشانکردن' : 'نشان کردن')}</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(dua.id, `${dua.title}\nمناسبت: ${dua.occasionTitle}\nموضوع: ${dua.topic}\n\n${dua.arabicText}\n\nترجمه:\n${getDuaMeaning(dua)}`)}
                        className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0"
                      >
                        {copiedId === dua.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedId === dua.id ? getTranslation('copied', language) : getTranslation('copyText', language)}</span>
                      </button>
                    </div>
                  </div>

                  {/* متن عربی دعا با اعراب دقیق */}
                  <div className="bg-stone-950 p-4 sm:p-6 rounded-2xl border border-stone-850 text-center shadow-inner">
                    <p className="font-serif text-base sm:text-xl text-stone-100 leading-relaxed" dir="rtl">
                      {dua.arabicText}
                    </p>
                  </div>

                  {/* بخش ترجمه دعا با نشان واضح زبان */}
                  <div className="bg-stone-950/70 p-3.5 sm:p-4 rounded-xl border border-stone-850 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500 font-bold block">
                        {selectedTranslationLang === 'ku' && 'مانای دوعا بە کوردی:'}
                        {selectedTranslationLang === 'en' && 'English Meaning & Translation:'}
                        {selectedTranslationLang === 'tr' && 'Duanın Türkçe Anlamı:'}
                        {selectedTranslationLang === 'ar' && 'المعنى والتفسير بالعربية:'}
                        {selectedTranslationLang === 'fa' && 'ترجمه و مفهوم فارسی دعا:'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        [{selectedTranslationLang.toUpperCase()}]
                      </span>
                    </div>
                    <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                      {getDuaMeaning(dua)}
                    </p>
                  </div>

                  {/* برچسب‌های کلیدی دعا */}
                  {dua.tags && dua.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-stone-500">کلیدواژه‌ها:</span>
                      {dua.tags.map((tag, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => handleTopicTagClick(tag)}
                          className="text-[10px] bg-stone-950 text-stone-400 hover:text-amber-300 hover:border-amber-600/50 px-2 py-0.5 rounded-lg border border-stone-850 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ۲. تب احادیث و اذکار روزانه و مناسبتی همراه با موضوعات و مناسبت‌ها */}
      {activeTab === 'hadiths' && (
        <div className="space-y-4 sm:space-y-6 w-full">
          {filteredHadiths.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 text-center space-y-3">
              <p className="text-stone-400 text-sm">
                حدیث یا ذکری مطابق با جستجوی شما یافت نشد.
              </p>
              <button
                type="button"
                onClick={clearAllSearch}
                className="text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 px-4 py-2 rounded-xl cursor-pointer"
              >
                {getTranslation('clearSearch', language)}
              </button>
            </div>
          ) : (
            <>
              {/* کارت حدیث امروز (در صورت همخوانی با فیلتر) */}
              {filteredHadiths.some((h) => h.dayOfWeek === todayHadith.dayOfWeek) && (
                <div className="bg-gradient-to-r from-stone-900 to-amber-950/40 border border-amber-600/50 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-amber-500 text-stone-950 px-3 py-1 rounded-full font-black">
                        {getTranslation('todayHadithTitle', language)} ({todayHadith.dayName})
                      </span>
                      <span 
                        onClick={() => handleTopicTagClick(todayHadith.occasionTitle)}
                        className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded-full font-bold cursor-pointer"
                      >
                        مناسبت: {todayHadith.occasionTitle}
                      </span>
                      <span 
                        onClick={() => handleTopicTagClick(todayHadith.topic)}
                        className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold cursor-pointer"
                      >
                        موضوع: {todayHadith.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                        {new Date().toLocaleDateString('fa-IR')}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(todayHadith.id, `حدیث ${todayHadith.dayName}`)}
                        className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                          isDuaFavorite(todayHadith.id)
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 border border-stone-750'
                        }`}
                        title={isDuaFavorite(todayHadith.id) ? getTranslation('removeFromFavorites', language) : getTranslation('addToFavorites', language)}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isDuaFavorite(todayHadith.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{isDuaFavorite(todayHadith.id) ? (language === 'ku' ? 'نیشانکراوە' : 'نشان‌شده') : (language === 'ku' ? 'نیشانکردن' : 'نشان کردن')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(todayHadith.id, `حدیث روز (${todayHadith.dayName})\n\n«${todayHadith.hadithText}»\n\nترجمه:\n${getHadithMeaning(todayHadith)}\n\nذکر روز: ${todayHadith.dailyZikr}`)}
                        className="text-xs bg-stone-800 hover:bg-stone-750 text-stone-300 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === todayHadith.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedId === todayHadith.id ? getTranslation('copied', language) : getTranslation('copyText', language)}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-stone-800 text-center">
                    <p className="font-serif text-sm sm:text-lg text-amber-200 leading-loose" dir="rtl">
                      «{todayHadith.hadithText}»
                    </p>
                  </div>

                  {/* ترجمه حدیث روز */}
                  <div className="bg-stone-950/60 p-3.5 sm:p-4 rounded-xl border border-stone-850 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold block">
                        {selectedTranslationLang === 'ku' && 'مانای فەرموودە و پەیامەکەی:'}
                        {selectedTranslationLang === 'en' && 'Hadith Meaning & Message:'}
                        {selectedTranslationLang === 'tr' && 'Hadisin Anlamı ve Mesajı:'}
                        {selectedTranslationLang === 'fa' && 'ترجمه و پیام حدیث شریف:'}
                        {selectedTranslationLang === 'ar' && 'شرح ومعنى الحديث:'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        [{selectedTranslationLang.toUpperCase()}]
                      </span>
                    </div>
                    <p className="text-stone-300 leading-relaxed">
                      {getHadithMeaning(todayHadith)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
                    <p>{getTranslation('narrator', language)} <strong className="text-stone-200">{todayHadith.narrator}</strong></p>
                    <p>{getTranslation('source', language)} <span className="text-amber-400 font-medium">{todayHadith.source}</span></p>
                  </div>

                  {/* بخش ذکر سفارش‌شده امروز همراه با ترجمه دقیق و شمارنده */}
                  <div className="pt-4 border-t border-stone-800 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <span className="text-xs text-amber-400 font-bold block">
                          {getTranslation('dailyZikrTitle', language)}
                        </span>
                        <span className="text-base sm:text-xl font-bold text-emerald-400 font-serif block">
                          «{todayHadith.dailyZikr}»
                        </span>

                        {/* ترجمه و معنی ذکر امروز */}
                        <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-850 mt-1 max-w-xl">
                          <span className="text-xs text-stone-300">
                            <strong className="text-amber-400">
                              {selectedTranslationLang === 'ku' && 'مانای ویرد: '}
                              {selectedTranslationLang === 'en' && 'Zikr Meaning: '}
                              {selectedTranslationLang === 'tr' && 'Zikrin Anlamı: '}
                              {selectedTranslationLang === 'fa' && 'ترجمه ذکر: '}
                              {selectedTranslationLang === 'ar' && 'المعنى والتفسير: '}
                            </strong>
                            <span className="text-emerald-300 font-medium">{getZikrMeaning(todayHadith)}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          type="button"
                          onClick={() => setZikrCountDone((c) => c + 1)}
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{getTranslation('countZikr', language)} ({zikrCountDone} / {todayHadith.zikrCount})</span>
                        </button>

                        {zikrCountDone > 0 && (
                          <button
                            type="button"
                            onClick={() => setZikrCountDone(0)}
                            className="text-stone-500 hover:text-stone-300 p-2 cursor-pointer"
                            title="شروع مجدد شمارنده"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* احادیث و حکمت‌های ایام هفته با برچسب موضوع و مناسبت */}
              <div className="space-y-3 w-full">
                <h4 className="text-xs font-bold text-stone-300">
                  {getTranslation('weeklyHadithsTitle', language)}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {filteredHadiths.map((h, i) => (
                    <div key={i} className="bg-stone-900 border border-stone-800 hover:border-amber-600/30 rounded-2xl p-4 text-xs space-y-2.5 transition-colors">
                      <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                        <span className="font-bold text-amber-400">{h.dayName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-500 hidden sm:inline">{h.source}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(h.id, `حدیث ${h.dayName}`)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDuaFavorite(h.id)
                                ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                                : 'text-stone-500 hover:text-stone-300 bg-stone-950'
                            }`}
                            title={isDuaFavorite(h.id) ? getTranslation('removeFromFavorites', language) : getTranslation('addToFavorites', language)}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isDuaFavorite(h.id) ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyText(h.id, `${h.dayName}\n«${h.hadithText}»\n\nترجمه: ${getHadithMeaning(h)}\nذکر: ${h.dailyZikr}`)}
                            className="p-1.5 text-stone-500 hover:text-stone-300 bg-stone-950 rounded-lg cursor-pointer"
                            title={getTranslation('copyText', language)}
                          >
                            {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* موضوع و مناسبت */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleTopicTagClick(h.occasionTitle)}
                          className="text-[9px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-md border border-sky-900 cursor-pointer"
                        >
                          مناسبت: {h.occasionTitle}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTopicTagClick(h.topic)}
                          className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-900 cursor-pointer"
                        >
                          موضوع: {h.topic}
                        </button>
                      </div>

                      <p className="text-stone-300 line-clamp-3 leading-relaxed font-serif">
                        {h.hadithText}
                      </p>

                      {/* ترجمه حدیث */}
                      <p className="text-stone-400 text-[11px] bg-stone-950 p-2 rounded-lg leading-relaxed">
                        <strong className="text-amber-300">
                          {selectedTranslationLang === 'ku' ? 'مانا: ' : selectedTranslationLang === 'en' ? 'Meaning: ' : selectedTranslationLang === 'tr' ? 'Anlam: ' : 'معنی: '}
                        </strong>
                        {getHadithMeaning(h)}
                      </p>

                      {/* ذکر روز و ترجمه آن */}
                      <div className="border-t border-stone-850 pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-bold font-serif">{h.dailyZikr}</span>
                          <span className="text-[10px] text-stone-500 font-mono">({h.zikrCount}x)</span>
                        </div>
                        <div className="bg-stone-950/70 p-1.5 rounded text-[10px] text-stone-400">
                          <span className="text-emerald-300">{getZikrMeaning(h)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ۳. تب قرآن صوتی و مطالعه آیات همراه با ترجمه و جستجوی هوشمند */}
      {activeTab === 'quran' && (
        <div className="space-y-6 w-full">
          {/* بخش ویژه و جامع انتخاب قاری تلاوت قرآن کریم */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span>{getTranslation('allRecitersTitle', language)}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {getTranslation('famousReciters', language)} — صدای ملکوتی مورد نظر خود را جهت پخش آنلاین تمام سوره‌ها و ادعیه انتخاب نمایید
                </p>
              </div>
              <span className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 flex-shrink-0">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{getTranslation('activeReciter', language)}: {activeReciter.name[language] || activeReciter.name.fa} {activeReciter.flag}</span>
              </span>
            </div>

            {/* گالری قاریان مشهور جهان اسلام با کارت‌های گویا */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {QURAN_RECITERS.map((reciter) => {
                const isSelected = selectedReciterId === reciter.id;
                return (
                  <div
                    key={reciter.id}
                    onClick={() => handleSelectReciter(reciter.id)}
                    className={`rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/70 to-stone-900 border-amber-500 shadow-xl shadow-amber-950/50 ring-1 ring-amber-500/40'
                        : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow ${
                        isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 border border-stone-800'
                      }`}>
                        {reciter.flag}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-amber-300 font-black' : 'text-stone-100'}`}>
                          {reciter.name[language] || reciter.name.fa}
                        </h4>
                        <span className="text-[10px] text-stone-500 block">
                          {reciter.country}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-stone-850">
                      <p className="text-[10px] text-stone-400 leading-snug line-clamp-2">
                        {reciter.style[language] || reciter.style.fa}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-md border border-stone-800">
                          {reciter.badge}
                        </span>
                        {isSelected ? (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{language === 'ku' ? 'چالاکە' : language === 'en' ? 'Active' : 'فعال'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-500 hover:text-stone-300 font-medium">
                            {language === 'ku' ? 'هەڵبژاردن' : language === 'en' ? 'Select' : 'انتخاب'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredSurahs.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 text-center space-y-3">
              <p className="text-stone-400 text-sm">
                سوره‌ای مطابق با جستجوی شما یافت نشد.
              </p>
              <button
                type="button"
                onClick={clearAllSearch}
                className="text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 px-4 py-2 rounded-xl cursor-pointer"
              >
                {getTranslation('clearSearch', language)}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                {filteredSurahs.map((surah) => {
                  const isCurrentPlaying = playingSurahId === surah.id && isPlaying;
                  const isSelectedForRead = activeSurahForReading.id === surah.id;

                  return (
                    <div
                      key={surah.id}
                      className={`bg-stone-900 border rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 ${
                        isSelectedForRead
                          ? 'border-amber-500 shadow-xl shadow-amber-950/40 bg-stone-900/90'
                          : 'border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-stone-100">{surah.name}</h4>
                            <span className="text-[11px] text-amber-400 font-serif block mt-0.5">
                              {surah.arabicName}
                            </span>
                          </div>

                          <span className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-full border border-stone-850">
                            {surah.ayahCount} {getTranslation('ayahs', language)}
                          </span>
                        </div>

                        {/* نشان موضوع و مناسبت سوره */}
                        {surah.topic && (
                          <div className="flex items-center gap-1 pt-1 flex-wrap">
                            <span 
                              onClick={() => handleTopicTagClick(surah.topic || '')}
                              className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-900/80 cursor-pointer"
                            >
                              موضوع: {surah.topic}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-400 flex items-center gap-1">
                        <span>{getTranslation('reciterLabel', language)}</span>
                        <strong className="text-amber-300 font-semibold">{getReciterName(selectedReciterId, language)}</strong>
                        <span className="text-xs">{activeReciter.flag}</span>
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => togglePlaySurah(surah)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrentPlaying
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-stone-950'
                            }`}
                          >
                            {isCurrentPlaying ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{getTranslation('stopAudio', language)}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>{getTranslation('playAudio', language)}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(surah.id, `سوره ${surah.name}`)}
                            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                              isDuaFavorite(surah.id)
                                ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                                : 'text-stone-500 hover:text-stone-300 bg-stone-800'
                            }`}
                            title={isDuaFavorite(surah.id) ? getTranslation('removeFromFavorites', language) : getTranslation('addToFavorites', language)}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isDuaFavorite(surah.id) ? 'fill-amber-400' : ''}`} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveSurahForReading(surah);
                            window.scrollTo({ top: 460, behavior: 'smooth' });
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{getTranslation('readText', language)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* صفحه مجزا و کامل مطالعه متن سوره انتخابی */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800 pb-4">
                  <div className="text-center sm:text-right">
                    <span className="text-[11px] text-amber-500 font-bold block mb-1">
                      {getTranslation('quranReadingView', language)}
                    </span>
                    <h3 className="text-lg font-black text-stone-100 flex items-center gap-2">
                      <span>{activeSurahForReading.name}</span>
                      <span className="font-serif text-amber-400">({activeSurahForReading.arabicName})</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => togglePlaySurah(activeSurahForReading)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {playingSurahId === activeSurahForReading.id && isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>{getTranslation('stopAudio', language)}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{getTranslation('playAudio', language)} ({getReciterName(selectedReciterId, language)})</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReciterSelector(true)}
                      className="bg-stone-800 hover:bg-stone-750 text-stone-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700 cursor-pointer"
                      title={getTranslation('changeReciter', language)}
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">{getTranslation('changeReciter', language)}</span>
                      <span>{activeReciter.flag}</span>
                    </button>
                  </div>
                </div>

                {/* متن عربی با رسم‌الخط قرآنی */}
                <div className="bg-stone-950 p-4 sm:p-6 rounded-2xl border border-stone-850 text-center space-y-4">
                  <p className="font-serif text-base sm:text-2xl text-amber-100 leading-loose tracking-wide select-all" dir="rtl">
                    {activeSurahForReading.arabicText}
                  </p>
                </div>

                {/* ترجمه بر اساس زبان انتخابی */}
                <div className="bg-stone-950/70 p-4 sm:p-5 rounded-2xl border border-stone-850 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 font-bold block">
                      {selectedTranslationLang === 'ku' && 'مانای کوردی (سۆرانی):'}
                      {selectedTranslationLang === 'en' && 'Noble Quran English Translation:'}
                      {selectedTranslationLang === 'tr' && 'Kuran-ı Kerim Türkçe Meali:'}
                      {selectedTranslationLang === 'ar' && 'التفسير والمعنى بالعربية:'}
                      {selectedTranslationLang === 'fa' && 'ترجمه روان فارسی آیات:'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      [{selectedTranslationLang.toUpperCase()}]
                    </span>
                  </div>
                  <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                    {selectedTranslationLang === 'ku' && (activeSurahForReading.kurdishTranslation || activeSurahForReading.persianTranslation)}
                    {selectedTranslationLang === 'en' && (activeSurahForReading.englishTranslation || activeSurahForReading.persianTranslation)}
                    {selectedTranslationLang === 'tr' && (activeSurahForReading.turkishTranslation || activeSurahForReading.persianTranslation)}
                    {(selectedTranslationLang === 'fa' || selectedTranslationLang === 'ar') && activeSurahForReading.persianTranslation}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ۴. تب نشان‌شده‌ها و علاقه‌مندی‌های من (دسترسی سریع) */}
      {activeTab === 'favorites' && (() => {
        const savedDuas = MEMORIAL_DUAS.filter((d) => isDuaFavorite(d.id));
        const savedHadiths = WEEKLY_HADITHS.filter((h) => isDuaFavorite(h.id));
        const savedSurahs = QURAN_SURAHS.filter((s) => isDuaFavorite(s.id));
        const totalSaved = savedDuas.length + savedHadiths.length + savedSurahs.length;

        if (totalSaved === 0) {
          return (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-stone-100">
                  {getTranslation('savedEmptyTitle', language)}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md mx-auto">
                  {getTranslation('savedEmptyDesc', language)}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('duas')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer shadow transition-all"
                >
                  مرور ادعیه ترحیم و خاکسپاری
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hadiths')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs cursor-pointer transition-all"
                >
                  مرور احادیث روزانه
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quran')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs cursor-pointer transition-all"
                >
                  سوره‌های قرآن کریم
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6 w-full">
            {/* سربرگ بخش علاقه‌مندی‌ها */}
            <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/40 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-right">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
                  <Bookmark className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-300">
                    {getTranslation('myFavorites', language)} ({totalSaved} مورد)
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    ادعیه، احادیث و سوره‌های منتخب شما جهت دسترسی سریع (همگام با پنل شخصی شما)
                  </p>
                </div>
              </div>

              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium">
                ذخیره شده در حافظه دستگاه
              </span>
            </div>

            {/* لیست ادعیه نشان‌شده */}
            {savedDuas.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-xs font-bold text-stone-300 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-amber-400" />
                    <span>ادعیه ترحیم و فاتحه‌خوانی نشان‌شده ({savedDuas.length})</span>
                  </h4>
                </div>

                <div className="space-y-4">
                  {savedDuas.map((dua) => (
                    <div
                      key={dua.id}
                      className="bg-stone-900 border border-amber-600/40 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 relative"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-black text-amber-300">{dua.title}</h3>
                            <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded-full font-bold">
                              {dua.occasionTitle}
                            </span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                              {dua.topic}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400">{dua.instructions}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(dua.id, dua.title)}
                            className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                            title="حذف از علاقه‌مندی‌ها"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
                            <span>حذف</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(dua.id, `${dua.title}\n\n${dua.arabicText}\n\nترجمه:\n${getDuaMeaning(dua)}`)}
                            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedId === dua.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                            <span>{copiedId === dua.id ? getTranslation('copied', language) : getTranslation('copyText', language)}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-stone-850 text-center">
                        <p className="font-serif text-base sm:text-xl text-stone-100 leading-relaxed" dir="rtl">
                          {dua.arabicText}
                        </p>
                      </div>

                      <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-850 text-xs space-y-1">
                        <span className="text-amber-500 font-bold block">ترجمه و مفهوم:</span>
                        <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                          {getDuaMeaning(dua)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* لیست احادیث نشان‌شده */}
            {savedHadiths.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-xs font-bold text-stone-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>احادیث و حکمت‌های نشان‌شده ({savedHadiths.length})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {savedHadiths.map((h) => (
                    <div key={h.id} className="bg-stone-900 border border-amber-600/30 rounded-2xl p-4 text-xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                        <span className="font-bold text-amber-400">{h.dayName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-500">{h.source}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(h.id, `حدیث ${h.dayName}`)}
                            className="p-1 rounded-lg text-amber-400 bg-amber-500/15 border border-amber-500/30 cursor-pointer"
                            title="حذف از علاقه‌مندی‌ها"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
                          </button>
                        </div>
                      </div>

                      <p className="text-stone-300 line-clamp-4 leading-relaxed font-serif">
                        {h.hadithText}
                      </p>

                      <p className="text-stone-400 text-[11px] bg-stone-950 p-2 rounded-lg leading-relaxed">
                        <strong className="text-amber-300">ترجمه: </strong>
                        {getHadithMeaning(h)}
                      </p>

                      <div className="border-t border-stone-850 pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold font-serif">{h.dailyZikr}</span>
                        <span className="text-[10px] text-stone-500 font-mono">({h.zikrCount}x)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* لیست سوره‌های قرآن نشان‌شده */}
            {savedSurahs.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-xs font-bold text-stone-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>سوره‌های قرآن نشان‌شده ({savedSurahs.length})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                  {savedSurahs.map((surah) => {
                    const isCurrentPlaying = playingSurahId === surah.id && isPlaying;
                    return (
                      <div
                        key={surah.id}
                        className="bg-stone-900 border border-amber-600/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-stone-100">{surah.name}</h4>
                            <span className="text-[11px] text-amber-400 font-serif block mt-0.5">{surah.arabicName}</span>
                          </div>
                          <span className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-full border border-stone-850">
                            {surah.ayahCount} آیه
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => togglePlaySurah(surah)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrentPlaying
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-stone-950'
                            }`}
                          >
                            {isCurrentPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                            <span>{isCurrentPlaying ? getTranslation('stopAudio', language) : getTranslation('playAudio', language)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(surah.id, `سوره ${surah.name}`)}
                            className="p-1.5 rounded-xl text-amber-400 bg-amber-500/15 border border-amber-500/30 cursor-pointer"
                            title="حذف از علاقه‌مندی‌ها"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* اعلان فلوتینگ وضعیت علاقه‌مندی‌ها */}
      {favoriteToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 border border-amber-500/60 px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md">
          <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{favoriteToast}</span>
        </div>
      )}
    </div>
  );
};
