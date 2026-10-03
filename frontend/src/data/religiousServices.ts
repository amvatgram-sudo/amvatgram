/**
 * Prayers, Hadiths & Quran Recitation Data
 * ادعیه مراسم تشییع، خاکسپاری، فاتحه‌خوانی مساجد و مجالس بانوان، احادیث روزانه و قرآن صوتی
 * مجهز به سیستم دسته‌بندی موضوعی، مناسبت‌ها و برچسب‌های هوشمند جستجو
 */

export interface QuranReciter {
  id: string;
  name: {
    fa: string;
    ku: string;
    en: string;
    ar: string;
    tr: string;
  };
  style: {
    fa: string;
    ku: string;
    en: string;
    ar: string;
    tr: string;
  };
  serverUrlPrefix: string;
  country: string;
  flag: string;
  badge: string;
}

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: 'basit',
    name: {
      fa: 'استاد عبدالباسط عبدالصمد',
      ku: 'مامۆستا عەبدولباست عەبدولسەمەد',
      en: 'Abdulbasit Abdulsamad',
      ar: 'الشيخ عبد الباسط عبد الصمد',
      tr: 'Abdussamed (Tercil & Tecvid)',
    },
    style: {
      fa: 'تجوید ماندگار و ترتیل حزین مجلسی',
      ku: 'تەجویدی مێژوویی و دەنگی بەسۆز',
      en: 'Classic Melodic Recitation & Tajweed',
      ar: 'تجويد وترتيل خاشع ومؤثر',
      tr: 'Duygulu ve Eşsiz Tecvid',
    },
    serverUrlPrefix: 'https://server7.mp3quran.net/basit/',
    country: 'مصر',
    flag: '🇪🇬',
    badge: 'صوت جاودان جهان اسلام',
  },
  {
    id: 'afs',
    name: {
      fa: 'استاد مشاری راشد العفاسی',
      ku: 'شێخ میشاری ڕاشید ئەلعەفاسی',
      en: 'Mishary Rashid Alafasy',
      ar: 'الشيخ مشاري راشد العفاسي',
      tr: 'Mişari Raşid el-Afasi',
    },
    style: {
      fa: 'تلاوت آرامش‌بخش، خاشع و پرطرفدار',
      ku: 'تلاوەتی هێمنکەرەوە و پڕ لە خشوع',
      en: 'Soul-Soothing, Emotional & Reverent',
      ar: 'تلاوة ندية خاشعة ومريحة للقلوب',
      tr: 'Huzur Veren ve Duygusal Kıraat',
    },
    serverUrlPrefix: 'https://server8.mp3quran.net/afs/',
    country: 'کویت',
    flag: '🇰🇼',
    badge: 'محبوب‌ترین تلاوت جهان اسلام',
  },
  {
    id: 'minsh',
    name: {
      fa: 'استاد محمد صدیق منشاوی',
      ku: 'مامۆستا محەممەد سدیق مەنشاوی',
      en: 'Mohamed Siddiq Al-Minshawi',
      ar: 'الشيخ محمد صديق المنشاوي',
      tr: 'Muhammed Sıddık Minşavi',
    },
    style: {
      fa: 'صوت محزون، ملکوتی و اشک‌بار',
      ku: 'دەنگێکی پڕ لە حوزن و گریان لە ترسی خوا',
      en: 'Reverent, Deeply Moving & Weeping Tone',
      ar: 'الصوت الباكي وتلاوة تلامس القلوب',
      tr: 'Hüzünlü ve Kalbe Dokunan Ses',
    },
    serverUrlPrefix: 'https://server10.mp3quran.net/minsh/',
    country: 'مصر',
    flag: '🇪🇬',
    badge: 'حنجره طلایی و صوت محزون',
  },
  {
    id: 'maher',
    name: {
      fa: 'استاد ماهر المعیقلی',
      ku: 'شێخ ماهیر ئەلموعەیقلی',
      en: 'Maher Al-Muaiqly',
      ar: 'الشيخ ماهر المعيقلي',
      tr: 'Mahir el-Muaykili',
    },
    style: {
      fa: 'صوت پرطنین و ملکوتی امام مسجدالحرام مکه',
      ku: 'دەنگی شکۆداری ئیمامی حەرەمی مەککە',
      en: 'Grand & Reverent Recitation of Masjid al-Haram',
      ar: 'صوت الحرم المكي الشريف المهيب',
      tr: 'Mescid-i Haram İmamının Kıraatı',
    },
    serverUrlPrefix: 'https://server12.mp3quran.net/maher/',
    country: 'عربستان سعودی',
    flag: '🇸🇦',
    badge: 'امام مسجدالحرام مکه مکرمه',
  },
  {
    id: 'ghamdi',
    name: {
      fa: 'استاد سعد الغامدی',
      ku: 'شێخ سەعد ئەلغامدی',
      en: 'Saad Al-Ghamdi',
      ar: 'الشيخ سعد الغامدي',
      tr: 'Saad el-Gamidi',
    },
    style: {
      fa: 'ترتیل سریع، روان، دل‌نشین و پرنفوذ',
      ku: 'خوێندنەوەیەکی ڕەوان و پڕ لە سۆز',
      en: 'Smooth, Fluent & Heart-Touching Recitation',
      ar: 'ترتيل عذب متقن وسلس',
      tr: 'Akıcı, Net ve Etkileyici',
    },
    serverUrlPrefix: 'https://server7.mp3quran.net/ghamdi/',
    country: 'عربستان سعودی',
    flag: '🇸🇦',
    badge: 'ترتیل روان و احساسی',
  },
  {
    id: 'ajm',
    name: {
      fa: 'استاد احمد بن علی العجمی',
      ku: 'شێخ ئەحمەد ئەلعەجەمی',
      en: 'Ahmed Al-Ajmi',
      ar: 'الشيخ أحمد بن علي العجمي',
      tr: 'Ahmed el-Acemi',
    },
    style: {
      fa: 'صوت رسا، پرطنین، پرانرژی و منقلب‌کننده',
      ku: 'دەنگێکی بەهێز و زوڵاڵ',
      en: 'Resonant, Powerful & Stirring Tone',
      ar: 'صوت جهوري شجي ومهيب',
      tr: 'Güçlü ve Yankılı Seda',
    },
    serverUrlPrefix: 'https://server10.mp3quran.net/ajm/',
    country: 'عربستان سعودی',
    flag: '🇸🇦',
    badge: 'صوت پرطنین و پرانرژی',
  },
  {
    id: 'husr',
    name: {
      fa: 'استاد محمود خلیل الحصری',
      ku: 'شێخ مەحموود خەلیل ئەلحوسەری',
      en: 'Mahmoud Khalil Al-Hussary',
      ar: 'الشيخ محمود خليل الحصري',
      tr: 'Halil el-Husari',
    },
    style: {
      fa: 'تجوید فوق‌العاده دقیق و میزان قرائت اصیل',
      ku: 'شێخی قورئانخوێنان و تەجویدی تەواو',
      en: 'Master of Tajweed, Precise & Authoritative',
      ar: 'شيخ المقارئ المصرية ودقة الترتيل',
      tr: 'Şeyhü\'l-Kura ve Kusursuz Tecvid',
    },
    serverUrlPrefix: 'https://server13.mp3quran.net/husr/',
    country: 'مصر',
    flag: '🇪🇬',
    badge: 'شیخ القراء جهان اسلام',
  },
  {
    id: 'sds',
    name: {
      fa: 'استاد عبدالرحمن السدیس',
      ku: 'شێخ عەبدولڕەحمان ئەلسودەیس',
      en: 'Abdul Rahman Al-Sudais',
      ar: 'الشيخ عبد الرحمن السديس',
      tr: 'Abdurrahman es-Sudeys',
    },
    style: {
      fa: 'صوت حماسی، باصلابت و معنوی کعبه معظمه',
      ku: 'دەنگی بەشکۆی کعبەی پیرۆز',
      en: 'Majestic & Solemn Voice of Kaaba',
      ar: 'صوت الكعبة المشرفة العذب',
      tr: 'Kabe-i Muazzama İmamı',
    },
    serverUrlPrefix: 'https://server11.mp3quran.net/sds/',
    country: 'عربستان سعودی',
    flag: '🇸🇦',
    badge: 'امام ارشد کعبه معظمه',
  },
];

export interface QuranSurahAudio {
  id: string;
  surahNumber: string; // سه رقمی جهت استریم استاندارد mp3quran مانند 001، 036، 067
  name: string;
  arabicName: string;
  englishName: string;
  ayahCount: number;
  reciter: string;
  audioUrl: string;
  arabicText: string;
  persianTranslation: string;
  kurdishTranslation?: string;
  englishTranslation?: string;
  turkishTranslation?: string;
  topic?: string;
  occasionTitle?: string;
  tags?: string[];
}

export const getSurahAudioUrl = (surahNumber: string, reciterId: string): string => {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) || QURAN_RECITERS[0];
  return `${reciter.serverUrlPrefix}${surahNumber}.mp3`;
};

export const getReciterName = (reciterId: string, lang: 'fa' | 'ku' | 'en' | 'ar' | 'tr' = 'fa'): string => {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) || QURAN_RECITERS[0];
  return reciter.name[lang] || reciter.name.fa;
};

export interface MemorialDuaa {
  id: string;
  title: string;
  occasion: 'cemetery_burial' | 'mosque_fatiha' | 'women_assembly' | 'daily_prayer' | 'talqeen' | 'janaza_prayer';
  occasionTitle: string;
  topic: string;
  tags: string[];
  madhhab: 'sunni' | 'shia' | 'common';
  arabicText: string;
  persianMeaning: string;
  kurdishMeaning?: string;
  englishMeaning?: string;
  arabicMeaning?: string;
  turkishMeaning?: string;
  phoneticPronunciation?: string;
  instructions: string;
}

export interface DailyHadithAndDua {
  id: string; // شناسه یکتا جهت نشان‌گذاری و ذخیره در علاقه‌مندی‌ها
  dayOfWeek: number; // 0 = شنبه, 1 = یکشنبه, ...
  dayName: string;
  hijriOccasion?: string;
  occasionTitle: string;
  topic: string;
  tags: string[];
  hadithText: string;
  narrator: string;
  source: string;
  dailyZikr: string;
  zikrPersianMeaning: string;
  zikrKurdishMeaning?: string;
  zikrEnglishMeaning?: string;
  zikrTurkishMeaning?: string;
  hadithPersianMeaning?: string;
  hadithKurdishMeaning?: string;
  hadithEnglishMeaning?: string;
  hadithTurkishMeaning?: string;
  zikrCount: number;
}

/// ۱. سوره‌های متداول در مجالس ترحیم با صوت آنلاین قاریان برجسته جهان اسلام
export const QURAN_SURAHS: QuranSurahAudio[] = [
  {
    id: 'surah-fatiha',
    surahNumber: '001',
    name: 'سوره مبارکه فاتحه (حمد)',
    arabicName: 'سُورَةُ الْفَاتِحَةِ',
    englishName: 'Al-Fatihah',
    ayahCount: 7,
    reciter: 'استاد عبدالباسط عبدالصمد',
    audioUrl: 'https://server7.mp3quran.net/basit/001.mp3',
    topic: 'ام الکتاب و ثواب فاتحه برای اموات',
    occasionTitle: 'مجالس ترحیم و خاکسپاری',
    tags: ['فاتحه', 'حمد', 'قرآن', 'ترحیم', 'ختم', 'اموات', 'نماز', 'سەرەخۆشی'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾`,
    persianTranslation: `به نام خداوند بخشنده مهربان. ستایش مخصوص خداوندی است که پروردگار جهانیان است. بخشنده و مهربان است. مالک روز جزا است. تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم. ما را به راه راست هدایت فرما، راه کسانی که به آنان نعمت دادی، نه غضب‌شدگان و نه گمراهان.`,
    kurdishTranslation: `به ناوی خوای به‌خشنده‌ی میهره‌بان. سوپاس و ستایش بۆ په‌روه‌ردگاری جیهانیان. به‌خشنده‌ی میهره‌بان. خاوه‌نی ڕۆژی دوایی. تەنها تۆ دەپەرستین و تەنها لە تۆش داوای یارمەتی دەکەین. ڕێنموونیمان بکە بۆ ڕێگای ڕاست...`,
    englishTranslation: `In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds - The Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path...`,
    turkishTranslation: `Rahman ve Rahim olan Allah'ın adıyla. Hamd, Alemlerin Rabbi, Rahman, Rahim ve Din gününün sahibi olan Allah'a mahsustur. Yalnız Sana ibadet eder ve yalnız Senden yardım dileriz. Bizi doğru yola ilet...`,
  },
  {
    id: 'surah-yasin',
    surahNumber: '036',
    name: 'سوره مبارکه یس (قلب قرآن)',
    arabicName: 'سُورَةُ يٰسٓ',
    englishName: 'Ya-Sin',
    ayahCount: 83,
    reciter: 'استاد مشاری راشد العفاسی',
    audioUrl: 'https://server8.mp3quran.net/afs/036.mp3',
    topic: 'تلاوت بر بالین متوفی و آمرزش روح',
    occasionTitle: 'هنگام وفات و شب‌های اول قبر',
    tags: ['یس', 'یاسین', 'تشییع', 'قبر', 'اموات', 'آرامش', 'قرآن', 'مغفرت', 'مردگان'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
يس ﴿١﴾ وَالْقُرْآنِ الْحَكِيمِ ﴿٢﴾ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ﴿٣﴾ عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ ﴿٤﴾ تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ ﴿٥﴾ لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ ﴿٦﴾ ... إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ ﴿٨٢﴾ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ ﴿٨٣﴾`,
    persianTranslation: `یس. سوگند به قرآن حکیم. که تو قطعاً از فرستادگانی، بر راهی راست. این قرآنی است نازل شده از سوی خداوند مقتدر و مهربان... فرمان او چنین است که هرگاه چیزی را اراده کند، تنها می‌گوید: «موجود باش!»، پس بی‌درنگ موجود می‌شود! پس منزه است خداوندی که مالکیت همه چیز در دست اوست و به سوی او بازگردانده می‌شوید.`,
    kurdishTranslation: `یاسین، سوێند بە قورئانی پڕ لە حیکمەت، کە بێگومان تۆ لە پێغەمبەرانی نێردراویت، لەسەر ڕێگایەکی ڕاست و دروست... فەرمانی خوا کاتێک شتێکی بوێت تەنها ئەوەیە پێی دەفەرموێت: ببە، دەستبەجێ دەبێت! پاک و بێگەردە ئەو زاتەی دەسەڵاتی هەموو شتێک بە دەستیەتی و بۆ لای ئەو دەگەڕێنرێنەوە.`,
    englishTranslation: `Ya, Seen. By the wise Qur'an. Indeed you, [O Muhammad], are from among the messengers, On a straight path. [This is] a revelation of the Exalted in Might, the Merciful... His command is only when He intends a thing that He says to it, "Be," and it is. So exalted is He in whose hand is the realm of all things, and to Him you will be returned.`,
    turkishTranslation: `Yâ Sîn. Hikmet dolu Kur'an'a andolsun ki, sen şüphesiz doğru yol üzere olan peygamberlerdensin. Üstün ve çok merhametli olan Allah'ın indirdiği bir kitaptır... Bir şeyi dilediği zaman, O'nun buyruğu sadece o şeye "Ol" demektir, o da hemen oluverir. Her şeyin mülkü ve egemenliği elinde olan Allah yücedir; O'na döndürüleceksiniz.`,
  },
  {
    id: 'surah-mulk',
    surahNumber: '067',
    name: 'سوره مبارکه ملک (تبارک - نجات‌بخش قبر)',
    arabicName: 'سُورَةُ الْمُلْكِ',
    englishName: 'Al-Mulk',
    ayahCount: 30,
    reciter: 'استاد محمد صدیق منشاوی',
    audioUrl: 'https://server10.mp3quran.net/minsh/067.mp3',
    topic: 'امان از عذاب قبر و تبارک',
    occasionTitle: 'شب‌های پس از خاکسپاری و پنج‌شنبه‌ها',
    tags: ['ملک', 'تبارک', 'نجات قبر', 'آرامستان', 'خاکسپاری', 'عذاب قبر', 'اموات', 'مرگ'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿١﴾ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ﴿٢﴾`,
    persianTranslation: `پربرکت و بلندمرتبه است ذاتی که حکومت جهان هستی به دست اوست و او بر هر چیز تواناست؛ آن‌کس که مرگ و حیات را آفرید تا شما را بیازماید که کدامتان بهتر عمل می‌کنید، و او شکست‌ناپذیر و بخشنده است.`,
    kurdishTranslation: `پیرۆز و مەزنە ئەو زاتەی دەسەڵاتداری لە دەستی ئەودایە و بەسەر هەموو شتێکدا توانایە؛ ئەو زاتەی مەرگ و ژیانی خولقاندووە تا تاقیتان بکاتەوە کە کامتان کردەوەتان چاکترە...`,
    englishTranslation: `Blessed is He in whose hand is dominion, and He is over all things competent - [He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving.`,
    turkishTranslation: `Mülk elinde bulunan Allah ne yücedir! O, her şeye hakkıyla gücü yetendir. Hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratan O'dur. O, mutlak güç sahibidir, çok bağışlayandır.`,
  },
  {
    id: 'surah-rahman',
    surahNumber: '055',
    name: 'سوره مبارکه الرحمن (عروس قرآن)',
    arabicName: 'سُورَةُ الرَّحْمَٰنِ',
    englishName: 'Ar-Rahman',
    ayahCount: 78,
    reciter: 'استاد عبدالباسط عبدالصمد',
    audioUrl: 'https://server7.mp3quran.net/basit/055.mp3',
    topic: 'یاد فانی بودن دنیا و بقای وجه الهی',
    occasionTitle: 'مجالس ترحیم و یادبود',
    tags: ['الرحمن', 'فنای جهان', 'ترحیم', 'بهشت', 'مجلس', 'اموات', 'رحمت'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنْسَانَ ﴿٣﴾ عَلَّمَهُ الْبَيَانَ ﴿٤﴾ ... كُلُّ مَنْ عَلَيْهَا فَانٍ ﴿٢٦﴾ وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ ﴿٢٧﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿٢٨﴾`,
    persianTranslation: `خداوند بخشنده، قرآن را آموخت، انسان را آفرید، و به او بیان را تعلیم داد... همه کسانی که روی زمین هستند فانی می‌شوند، و تنها ذات باشکوه و ارجمند پروردگارت باقی می‌ماند! پس کدامین نعمت‌های پروردگارتان را انکار می‌کنید؟`,
    kurdishTranslation: `خوای میهره‌بان، قورئانی فێر كرد، مرۆڤی خولقاند، بیانی فێری كرد... هه‌موو كه‌سێك له‌سه‌ر زه‌وییه‌ فه‌وتێنه‌ره‌، و ته‌نها زاتی پڕ له‌ شكۆ و ڕێزداری په‌روه‌ردگارت ده‌مێنێته‌وه‌...`,
    englishTranslation: `The Most Merciful. Taught the Qur'an, Created man, [And] taught him eloquence... Everyone upon the earth will perish, And there will remain the Face of your Lord, Owner of Majesty and Honor. So which of the favors of your Lord would you deny?`,
    turkishTranslation: `Rahman olan Allah, Kur'an'ı öğretti. İnsanı yarattı. Ona açıklamayı öğretti... Yer yüzünde bulunan her canlı yok olacaktır. Ancak celal ve ikram sahibi Rabbinin zâtı bâki kalacaktır. O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?`,
  },
  {
    id: 'surah-fajr',
    surahNumber: '089',
    name: 'سوره مبارکه فجر (نفس مطمئنه و آرامش روح)',
    arabicName: 'سُورَةُ الْفَجْرِ',
    englishName: 'Al-Fajr',
    ayahCount: 30,
    reciter: 'استاد مشاری راشد العفاسی',
    audioUrl: 'https://server8.mp3quran.net/afs/089.mp3',
    topic: 'خطاب خداوند به روح پاک متوفی: ای نفس مطمئنه بازگرد',
    occasionTitle: 'هنگام وداع، تشییع و مجالس ترحیم',
    tags: ['فجر', 'نفس مطمئنه', 'بهشت', 'اموات', 'آرامش', 'ترحیم', 'وداع', 'مغفرت'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
وَالْفَجْرِ ﴿١﴾ وَلَيَالٍ عَشْرٍ ﴿٢﴾ ... يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ﴿٢٧﴾ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَرْضِيَّةً ﴿٢٨﴾ فَادْخُلِي فِي عِبَادِي ﴿٢٩﴾ وَادْخُلِي جَنَّتِي ﴿٣٠﴾`,
    persianTranslation: `سوگند به سپیده‌دم، و سوگند به شب‌های ده‌گانه... ای روح آرام‌گرفته و نفس مطمئنه! به سوی پروردگارت بازگرد در حالی که هم تو از او خشنودی و هم او از تو خشنود است! پس در میان بندگانم درآی، و در بهشت من داخل شو!`,
    kurdishTranslation: `سوێند بە سپێدە و بە دە شەوی پیرۆز... ئەی ئەو کەسەی کە بە دڵنیایی و ئاسوودەیی گەیشتوویت! بگەڕێوە بۆ لای پەروەردگارت کە هەم تۆ لەو ڕازیت و هەم ئەویش لە تۆ ڕازییە! دە پێ بنێیە ناو ڕیزی بەندە چاکەکانمەوە، و بچۆ ناو بەهەشتی بەفەڕمەوە!`,
    englishTranslation: `By the dawn, And [by] ten nights... [To the righteous it will be said], "O reassured soul, Return to your Lord, well-pleased and pleasing [to Him], And enter among My [righteous] servants, And enter My Paradise."`,
    turkishTranslation: `Fecre andolsun, On geceye andolsun... Ey huzura ermiş nefis! Razı olmuş ve rızaya erdirilmiş olarak Rabbine dön! Kullarımın arasına katıl ve cennetime gir!`,
  },
  {
    id: 'surah-waqiah',
    surahNumber: '056',
    name: 'سوره مبارکه واقعه (قیامت و پاداش مقربین)',
    arabicName: 'سُورَةُ الْوَاقِعَةِ',
    englishName: 'Al-Waqi’ah',
    ayahCount: 96,
    reciter: 'استاد ماهر المعیقلی',
    audioUrl: 'https://server12.mp3quran.net/maher/056.mp3',
    topic: 'مراتب بهشت و آرامش ابدی مؤمنان در جوار الهی',
    occasionTitle: 'مجالس ترحیم و شب‌های اول قبر',
    tags: ['واقعه', 'قیامت', 'بهشت', 'مقربین', 'اموات', 'آمرزش', 'نعمت', 'ترحیم'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
إِذَا وَقَعَتِ الْوَاقِعَةُ ﴿١﴾ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ﴿٢﴾ خَافِضَةٌ رَافِعَةٌ ﴿٣﴾ ... فَأَمَّا إِنْ كَانَ مِنَ الْمُقَرَّبِينَ ﴿٨٨﴾ فَرَوْحٌ وَرَيْحَانٌ وَجَنَّتُ نَعِيمٍ ﴿٨٩﴾`,
    persianTranslation: `چون آن واقعه عظیم (قیامت) رخ دهد، که در وقوع آن هیچ شکی نیست... پس اگر او از مقربان درگاه الهی باشد، در نهایت راحتی و آسایش و گل‌های خوشبو و بهشت پرنعمت خواهد بود.`,
    kurdishTranslation: `کاتێک ئەو ڕووداوە مەزنە (قیامەت) ڕوو دەدات، کە هیچ درۆیەک لە ڕوودانیدا نییە... ئەگەر لە نزیکخراوەکانی بارەگای خودا بێت، ئەوا ڕەوح و ڕەیحان و بەهەشتی پڕ لە نیعمەت بۆ ئەوە.`,
    englishTranslation: `When the Occurrence occurs, There is, at its occurrence, no denial... Then if the deceased was of those brought near [to Allah], Then [for him is] rest and satisfaction and a garden of pleasure.`,
    turkishTranslation: `O vuku bulacak olan (kıyamet) koptuğu zaman, onun kopuşunu yalanlayacak hiçbir kimse yoktur... Eğer o, Allah'a yakın kılınmışlardan ise, ona rahatlık, güzel rızık ve nimet cenneti vardır.`,
  },
  {
    id: 'surah-ikhlas',
    surahNumber: '112',
    name: 'سوره مبارکه اخلاص و توحید (قل هو الله)',
    arabicName: 'سُورَةُ الْإِخْلَاصِ',
    englishName: 'Al-Ikhlas',
    ayahCount: 4,
    reciter: 'استاد مشاری راشد العفاسی',
    audioUrl: 'https://server8.mp3quran.net/afs/112.mp3',
    topic: 'توحید و ثواب یک‌سوم قرآن برای اموات',
    occasionTitle: 'ختم قرآن و زیارت اهل قبور',
    tags: ['توحید', 'اخلاص', 'قل هو الله', 'فاتحه', 'زیارت قبور', 'اموات', 'آمرزش'],
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾`,
    persianTranslation: `بگو: اوست خدای یکتا، خدای بی‌نیاز، نه زاده و نه زاییده شده است، و برای او هیچ همتایی نبوده و نیست.`,
    kurdishTranslation: `بڵێ: ئەو، خوای تاقانەیە، خوای بێ نیاز، نە کەسی لێ بووە و نە لە کەسیش بووە، و هیچ هاوتایەکی نییە.`,
    englishTranslation: `Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."`,
    turkishTranslation: `De ki: O, Allah'tır, bir tektir. Allah Samed'dir. O, doğurmamış ve doğmamıştır. O'nun hiçbir dengi yoktur.`,
  }
];

// ۲. ادعیه مراسم ختم، تشییع جنازه، تدفین و دعای فاتحه‌خوانی مساجد و مجالس بانوان
export const MEMORIAL_DUAS: MemorialDuaa[] = [
  {
    id: 'dua-cemetery-entering',
    title: 'دعای ورود به آرامستان و قبرستان',
    occasion: 'cemetery_burial',
    occasionTitle: 'ورود به آرامستان',
    topic: 'زیارت اهل قبور و سلام بر اموات',
    tags: ['آرامستان', 'قبرستان', 'زیارت قبور', 'سلام بر اموات', 'تشییع', 'خاکسپاری', 'مغفرت', 'گۆڕستان'],
    madhhab: 'common',
    arabicText: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، نَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ، يَرْحَمُ اللَّهُ الْمُسْتَقْدِمِينَ مِنَّا وَالْمُسْتَأْخِرِينَ.',
    persianMeaning: 'سلام بر شما ای اهالی این دیار از مؤمنان و مسلمانان! ما نیز ان‌شاءالله به شما ملحق خواهیم شد. از خداوند برای خود و شما عافیت و مغفرت می‌طلبیم. خدا رحمت کند پیشینیان و آیندگان از ما را.',
    kurdishMeaning: 'سڵاوی خواتان لێبێت ئه‌ی دانیشتوانی ئه‌م گۆڕستانه‌ له‌ باوه‌ڕداران و موسڵمانان، ئێمه‌ش به‌ ویستی خوا ده‌گه‌ینه‌وه‌ لاتان، داوای لێخۆشبوون و عافیه‌ت بۆ خۆمان و ئێوه‌ ده‌كه‌ین.',
    englishMeaning: 'Peace be upon you, O people of the dwellings, of the believers and the Muslims. Indeed we, if Allah wills, will join you. We ask Allah for us and for you safety and forgiveness.',
    arabicMeaning: 'تحية وسلام على أهل القبور من المؤمنين والمسلمين، وإنا إن شاء الله بكم للاحقون، نسأل الله لنا ولكم العافية والمغفرة.',
    turkishMeaning: 'Ey bu diyarın mümin ve Müslüman sakinleri! Size selam olsun. İnşallah biz de size katılacağız. Allah\'tan bizim ve sizin için af ve afiyet dileriz.',
    instructions: 'مستحب است هنگام ورود به آرامستان رو به اهل قبور ایستاده و این دعا با صدای آرام خوانده شود.',
  },
  {
    id: 'dua-burial-talqeen',
    title: 'دعای لحظه نهادن میت در لحد (خاکسپاری)',
    occasion: 'cemetery_burial',
    occasionTitle: 'تدفین و خاکسپاری',
    topic: 'فراخ شدن قبر و امان از عذاب قبر',
    tags: ['خاکسپاری', 'لحد', 'دفن', 'تدفین', 'عذاب قبر', 'تشییع', 'میت', 'بەخاکسپاردن', 'قبر'],
    madhhab: 'common',
    arabicText: 'بِسْمِ اللَّهِ وَعَلَى مِلَّةِ رَسُولِ اللَّهِ، اللَّهُمَّ أَجِرْهُ مِنْ عَذَابِ الْقَبْرِ، وَافْتَحْ لَهُ أَبْوَابَ الْجَنَّةِ، وَجَافِ الْأَرْضَ عَنْ جَنْبَيْهِ.',
    persianMeaning: 'به نام خدا و بر آیین و سنت رسول خدا (ص). خداوندا او را از عذاب قبر پناه ده و درهای بهشت را به رویش بگشای و زمین را از پهلوهایش فراخ گردان.',
    kurdishMeaning: 'به ناوی خودا و له‌سه‌ر ڕێباز و سوننه‌تی پێغه‌مبه‌ری خودا (د.خ). خوایه‌ له‌ سزای گۆڕ په‌نای بده‌ و ده‌رگاكانی به‌هه‌شتی بۆ بكه‌ره‌وه‌ و گۆڕه‌كه‌ی لێ فراوان بكه‌.',
    englishMeaning: 'In the name of Allah and upon the creed of the Messenger of Allah. O Allah, protect him/her from the punishment of the grave, open the gates of Paradise, and widen the earth around his sides.',
    arabicMeaning: 'باسم الله وعلى ملة رسول الله. اللهم أجر الميت من عذاب القبر وافتح له أبواب الجنة ووسع عليه مرقده.',
    turkishMeaning: 'Allah\'ın adıyla ve Resulullah\'ın dini üzere. Allah\'ım, onu kabir azabından koru, cennet kapılarını aç ve toprağı ona ferah kıl.',
    instructions: 'توسط حاضرین و کسی که متوفی را در قبر قرار می‌دهد قرائت شود.',
  },
  {
    id: 'dua-cemetery-talqeen-after',
    title: 'متن تلقین میت بر سر مزار پس از دفن کامل',
    occasion: 'talqeen',
    occasionTitle: 'تلقین بر سر مزار',
    topic: 'تثبیت ایمان و پاسخ به نکیر و منکر',
    tags: ['تلقین', 'نکیر و منکر', 'قبر', 'ایمان', 'خاکسپاری', 'تشییع', 'شهادتین', 'مزار'],
    madhhab: 'sunni',
    arabicText: '«يَا عَبْدَ اللَّهِ، اذْكُرِ الْعَهْدَ الَّذِي خَرَجْتَ عَلَيْهِ مِنَ الدُّنْيَا: شَهَادَةَ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَأَنَّكَ رَضِيتَ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ (ﷺ) نَبِيًّا، وَبِالْقُرْآنِ إِمَامًا. اللَّهُمَّ ثَبِّتْهُ عِنْدَ السُّؤَالِ.»',
    persianMeaning: 'ای بنده خدا! به یاد آور پیمانی را که با آن از دنیا رفتی: گواهی بر اینکه معبودی جز الله نیست و محمد (ص) فرستاده اوست، و تو راضی شدی که الله پروردگارت باشد و اسلام آیینت و محمد (ص) پیامبرت و قرآن راهنمایت. بارالها، او را هنگام پرسش نکیر و منکر استوار و ثابت‌قدم بدار.',
    kurdishMeaning: 'ئه‌ی به‌نده‌ی خودا! یادی ئه‌و په‌یمانه‌ بكه‌ره‌وه‌ كه‌ له‌سه‌ری كۆچت كرد: شایه‌تیدان به‌وه‌ی كه‌ هیچ خودایه‌ك نییه‌ جگه‌ له‌ الله و موحه‌ممه‌د نێردراوی ئه‌وه‌، و ڕازی بووی به‌وه‌ی خودا په‌روه‌ردگارت بێت، و ئیسلام ئاینت بێت، و قورئان ڕێبه‌رت بێت. خوایه‌گیان له‌كاتی پرسیاری ناو گۆڕدا پێیه‌كانی جێگیر و دامه‌زراو بكه‌.',
    englishMeaning: 'O servant of Allah, remember the covenant upon which you departed this life: testifying that there is no deity worthy of worship except Allah and that Muhammad is His Messenger, and that you accepted Allah as your Lord, Islam as your religion, Muhammad as your Prophet, and the Quran as your guide. O Allah, make him steadfast upon questioning.',
    arabicMeaning: 'يا عبد الله، اذكر العهد الذي خرجت عليه من الدنيا: شهادة أن لا إله إلا الله وأن محمداً رسول الله، ورضيت بالله رباً وبالإسلام ديناً وبمحمد نبياً وبالقرآن إماماً. اللهم ثبته عند السؤال.',
    turkishMeaning: 'Ey Allah\'ın kulu! Dünyadan kendisiyle ayrıldığın ahdi hatırla: Allah\'tan başka ilah olmadığına ve Muhammed\'in O\'nun kulu ve elçisi olduğuna, Rab olarak Allah\'a, din olarak İslam\'a, peygamber olarak Muhammed\'e ve rehber olarak Kur\'an\'a razı olduğuna... Allah\'ım! Sual anında onu sabit kıl.',
    instructions: 'پس از پایان خاکسپاری، روحانی یا بزرگ مجلس بر سر مزار ایستاده و این تلقین را به نام متوفی بیان می‌کند.',
  },
  {
    id: 'dua-janaza-prayer',
    title: 'دعای نماز میت (نماز جنازه تکبیر سوم و چهارم)',
    occasion: 'janaza_prayer',
    occasionTitle: 'نماز میت و تشییع جنازه',
    topic: 'طلب آمرزش جامع و بهشت جاودان',
    tags: ['نماز میت', 'نماز جنازه', 'تکبیر', 'تشییع', 'مغفرت', 'بهشت', 'مصلای مسجد', 'نوێژی جەنازە'],
    madhhab: 'common',
    arabicText: '«اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الذُّنُوبِ وَالْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَعَذَابِ النَّارِ.»',
    persianMeaning: 'خداوندا! او را بیامرز و بر او رحم کن، به او عافیت بخش و از او درگذر، جایگاهش را گرامی بدار و آرامگاهش را فراخ گردان، او را با آب و برف و تگرگ شستشو ده و از گناهان پاکیزه‌اش گردان آن‌گونه که لباس سفید از پلیدی پاک می‌شود. او را وارد بهشت فرما و از عذاب قبر و آتش دوزخ در پناه دار.',
    kurdishMeaning: 'خوایه‌گیان لێی خۆش ببه‌ و ڕه‌حمی پێ بكه‌، لێی ببوره‌ و ڕێزی لێ بگره‌ و جێگای مانه‌وه‌ی بۆ فراوان بكه‌. به‌ ئاو و به‌فر و ته‌رزه‌ له‌ تاوانه‌كانی پاكی بكه‌ره‌وه‌ وه‌كو چۆن پۆشاكی سپی له‌ پیسی پاك ده‌بێته‌وه‌. جێگای به‌هه‌شتی به‌رین بێت و له‌ سزای گۆڕ و ئاگری دۆزه‌خ بیپارێزه‌.',
    englishMeaning: 'O Allah, forgive him and have mercy on him, grant him well-being and pardon him, honor his reception and expand his entrance, wash him with water, snow, and hail, and cleanse him of sins as a white garment is cleansed of filth. Admit him to Paradise and protect him from the torment of the grave and the torment of Fire.',
    arabicMeaning: 'اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله ووسع مدخله واغسله بالماء والثلج والبرد ونقه من الخطايا كما ينقى الثوب الأبيض من الدنس وأدخله الجنة وأعذه من عذاب القبر وعذاب النار.',
    turkishMeaning: 'Allah\'ım! Onu bağışla, ona merhamet eyle, ona afiyet ver ve onu affet. Ağırlanacağı yeri yüce kıl, gireceği yeri genişlet. Onu su, kar ve dolu ile yıka; beyaz elbisenin kirden arındığı gibi onu günahlardan arındır. Onu cennete koy ve kabir azabından koru.',
    instructions: 'در تکبیر سوم و چهارم نماز میت در مسجد یا مصلی قرائت می‌شود.',
  },
  {
    id: 'dua-fatiha-leader-men',
    title: 'متن قرائت فاتحه و دعای بعد از فاتحه (مسئول مجلس برادران در مسجد)',
    occasion: 'mosque_fatiha',
    occasionTitle: 'مجلس فاتحه مسجد',
    topic: 'دعای جمعی و ختم فاتحه در حضور مهمانان',
    tags: ['فاتحه', 'مسجد', 'ترحیم', 'مسئول مجلس', 'ختم', 'برادران', 'آمرزش', 'دعای فاتحه', 'فاتیحە'],
    madhhab: 'sunni',
    arabicText: `«الْفَاتِحَةُ مَعَ الصَّلَوَاتِ عَلَى رَسُولِ اللَّهِ»
(سپس سوره حمد قرائت می‌شود)

«اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا. اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ. اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ، وَلَا تَفْتِنَّا بَعْدَهُ، وَاغْفِرْ لَنَا وَلَهُ، وَأَسْكِنْهُ فَسِيحَ جَنَّاتِكَ يَا أَرْحَمَ الرَّاحِمِينَ. سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.»`,
    persianMeaning: 'خداوندا! زندگان و مردگان ما، حاضران و غایبان ما، کوچک و بزرگ ما، و مردان و زنان ما را بیامرز. خداوندا، هر که را زنده می‌داری بر اسلام زنده بدار و هر که را می‌میرانی بر ایمان بمیران. ما را از پاداش او محروم مگردان و پس از او دچار فتنه مکن و او را در بهشت‌های فراخ جای ده...',
    kurdishMeaning: 'خوایه‌گیان له‌ زیندوو و مردوومان خۆش ببه‌، له‌ ئاماده‌ و غائیبمان، له‌ گه‌وره‌ و بچوكمان، له‌ نێر و مێمان. خوایه‌ كێ له‌ ئێمه‌ زیندوو ڕاده‌گری له‌سه‌ر ئیسلام بێت و كێ ده‌مرێنی با به‌ ئیمانه‌وه‌ كۆچ بكات. پاداشتمان لێ حه‌رام مه‌كه‌ و له‌م عه‌زیزه‌مان خۆش ببه‌...',
    englishMeaning: 'O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomsoever You keep alive among us, keep him alive upon Islam, and whomsoever You cause to die, cause him to die upon faith...',
    arabicMeaning: 'اللهم اغفر لحينا وميتنا وشاهدنا وغائبنا وصغيرنا وكبيرنا وذكرنا وأنثانا. اللهم من أحييته منا فأحيه على الإسلام ومن توفيته منا فتوفه على الإيمان...',
    turkishMeaning: 'Allah\'ım! Dirimizi, ölümüzü, burada bulunanımızı, bulunmayanımızı, küçüğümüzü, büyüğümüzü, erkeğimizi ve kadınımızı bağışla. Allah\'ım, bizden kimi yaşatırsan İslam üzere yaşat, kimi öldürürsen iman üzere öldür...',
    instructions: 'در مجالس ترحیم و مساجد، مسئول فاتحه‌خوانی پس از ورود مهمانان این دعا را با وقار می‌خواند و حضار با گفتن «آمین» دست بر صورت می‌کشند.',
  },
  {
    id: 'dua-women-assembly',
    title: 'متن فاتحه و دعای تسلی‌بخش مجلس بانوان (ویژه خانم مسئول مجلس فاتحه)',
    occasion: 'women_assembly',
    occasionTitle: 'مجلس ترحیم بانوان',
    topic: 'صبر بازماندگان، آرامش قلب داغدیدگان و مغفرت بانو',
    tags: ['مجلس بانوان', 'فاتحه بانوان', 'ترحیم', 'صبر بازماندگان', 'داغدیده', 'مادر', 'خواهر', 'آرامش', 'خانمان'],
    madhhab: 'sunni',
    arabicText: `«بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — الْفَاتِحَةُ تَسْلِیَةً لِقُلُوبِ أَهْلِ الْعَزَاءِ وَمَغْفِرَةً لِلْمَرْحُومَةِ»

«اللَّهُمَّ اغْفِرْ لَهَا وَارْحَمْهَا، وَعَافِهَا وَاعْفُ عَنْهَا، وَأَكْرِمْ نُزُلَهَا، وَوَسِّعْ مُدْخَلَهَا، وَاغْسِلْهَا بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهَا مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ. اللَّهُمَّ أَنْزِلِ الصَّبْرَ وَالسَّلْوَانَ عَلَى قُلُوبِ بَنَاتِهَا وَأَخَوَاتِهَا وَأَهْلِهَا أَجْمَعِينَ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.»`,
    persianMeaning: 'به نام خداوند بخشنده مهربان. فاتحه‌ای برای آرامش دل بازماندگان و آمرزش روح این مرحومه. خداوندا او را ببخش و بر او رحمت آور، او را گرامی بدار و جایگاهش را وسعت بخش. بر دل دختران، خواهران و خانواده‌اش صبر و آرامش نازل فرما...',
    kurdishMeaning: 'خوایه‌گیان ڕه‌حمی پێ بكه‌ و لێی خۆش ببه‌ و جێگای به‌هه‌شتی به‌رین بێت. خوایه‌ سه‌بووری و ئارامی بڕێژه‌ به‌سه‌ر دڵی دایكان، خوشكان، كچان و ته‌واوی كه‌سوكاری داغداری ئه‌م بنه‌ماڵه‌یه‌...',
    englishMeaning: 'In the name of Allah, the Entirely Merciful. Al-Fatihah as comfort for the hearts of the bereaved family and forgiveness for the deceased sister. O Allah, forgive her and have mercy on her, and grant patience to her daughters, sisters and entire family...',
    arabicMeaning: 'بسم الله الرحمن الرحيم. الفاتحة تسلية لقلوب أهل العزاء ومغفرة للمرحومة. اللهم اغفر لها وارحمها وأنزل الصبر والسلوان على قلوب أهلها وبناتها وأخواتها أجمعين...',
    turkishMeaning: 'Rahman ve Rahim olan Allah\'ın adıyla. Yaslı ailenin kalplerine teselli ve merhumenin bağışlanması için el-Fatiha. Allah\'ım, onu bağışla, ona merhamet et ve kızlarının, kız kardeşlerinin ve bütün ailesinin kalbine sabır ihsan eyle...',
    instructions: 'توسط بانوی مجری یا بزرگ‌تر مجلس در سالن بانوان با آرامش و معنویت قرائت شود تا همگان فاتحه بفرستند.',
  },
  {
    id: 'dua-condolence-reply',
    title: 'پاسخ شرعی صاحب عزا به تسلیت‌گویندگان (أعظم الله أجركم)',
    occasion: 'mosque_fatiha',
    occasionTitle: 'مجلس فاتحه و هنگام بدرقه',
    topic: 'پاسخ تسلیت و قدردانی از حضور مهمانان',
    tags: ['تسلیت', 'صاحب عزا', 'اعظم الله اجرکم', 'ترحیم', 'پاسخ تسلیت', 'فاتحه', 'سەرەخۆشی', 'تشکر'],
    madhhab: 'common',
    arabicText: '«أَعْظَمَ اللَّهُ أَجْرَكُمْ، وَأَحْسَنَ عَزَاءَكُمْ، وَغَفَرَ لِمَيِّتِكُمْ، وَشَكَرَ سَعْيَكُمْ، جَزَاكُمُ اللَّهُ خَيْرًا.»',
    persianMeaning: 'خداوند پاداش شما را بزرگ دارد، سوگواری شما را نیکو گرداند، میت شما را بیامرزد و از تلاش و حضور شما قدردانی فرماید. خداوند به شما جزای خیر دهد.',
    kurdishMeaning: 'خوای گه‌وره‌ پاداشتی خێرتان بداته‌وه‌ و عه‌زاتان قه‌بووڵ بكات و له‌ مردووتان خۆش بێت و ڕه‌نجتان به‌با نه‌ڕوات. خوای گه‌وره‌ جه‌زای خێرتان بداته‌وه‌.',
    englishMeaning: 'May Allah magnify your reward, grant you good solace, forgive your deceased, and reward your endeavor. May Allah reward you with goodness.',
    arabicMeaning: 'أعظم الله أجركم، وأحسن عزاءكم، وغفر لميتكم، وشكر سعيكم وحضوركم، جزاكم الله خيراً.',
    turkishMeaning: 'Allah ecrinizi artırsın, taziyenizi güzelleştirsin, geçmişinizi bağışlasın ve gayretinizi makbul eylesin. Allah sizden razı olsun.',
    instructions: 'جمله‌ای که صاحب عزا هنگام دست دادن یا خداحافظی با مهمانان فاتحه بیان می‌کند.',
  },
  {
    id: 'dua-thursday-grave-visit',
    title: 'دعای زیارت قبور در شب و روز جمعه و طلب مغفرت اموات',
    occasion: 'daily_prayer',
    occasionTitle: 'شب جمعه و پنج‌شنبه',
    topic: 'خیرات، استغفار و هدیه به روح مؤمنان',
    tags: ['شب جمعه', 'جمعه', 'زیارت قبور', 'پنج‌شنبه', 'اموات', 'خیرات', 'استغفار', 'مغفرت'],
    madhhab: 'common',
    arabicText: '«اللَّهُمَّ اغْفِرْ لِأَهْلِ الْقُبُورِ مِنَ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، اللَّهُمَّ نَوِّرْ عَلَيْهِمْ قُبُورَهُمْ، وَافْسَحْ لَهُمْ فِي مَضَاجِعِهِمْ، وَاجْعَلْ قُبُورَهُمْ رَوْضَةً مِنْ رِيَاضِ الْجَنَّةِ، وَلَا تَجْعَلْهَا حُفْرَةً مِنْ حُفَرِ النَّارِ.»',
    persianMeaning: 'بارالها! اهل قبور از مردان و زنان مؤمن را بیامرز، مزار آنان را پرنور گردان، جایگاهشان را وسعت بخش و قبرهایشان را باغی از باغ‌های بهشت قرار ده و آن را گودالی از آتش دوزخ مگردان.',
    kurdishMeaning: 'خوایه‌گیان له‌ باوه‌ڕدارانی ناو گۆڕه‌كان له‌ پیاوان و ئافره‌تان خۆش ببه‌، گۆڕه‌كانیان ڕووناك بكه‌ره‌وه‌ و بیكه‌ به‌ باخچه‌یه‌ك له‌ باخچه‌كانی به‌هه‌شت...',
    englishMeaning: 'O Allah, forgive the believing men and women in the graves, illuminate their resting places, widen their quarters, and make their graves a garden of the gardens of Paradise.',
    arabicMeaning: 'اللهم اغفر لأهل القبور من المؤمنين والمؤمنات، ونور عليهم قبورهم، واجعل قبورهم روضة من رياض الجنة.',
    turkishMeaning: 'Allah\'ım! Kabirlerdeki mümin erkek ve kadınları bağışla, kabirlerini nurlandır ve kabirlerini cennet bahçelerinden bir bahçe eyle.',
    instructions: 'مستحب است در عصر پنج‌شنبه یا روز جمعه هنگام زیارت قبور یا از راه دور با فرستادن صلوات خوانده شود.',
  }
];

// ۳. ادعیه و احادیث روزانه بر اساس تقویم هفته با موضوعات و مناسبت‌ها
export const WEEKLY_HADITHS: DailyHadithAndDua[] = [
  {
    id: 'hadith-sat',
    dayOfWeek: 0, // شنبه
    dayName: 'شنبه',
    occasionTitle: 'آغاز هفته و تفکر در حقیقت زندگی',
    topic: 'یاد مرگ و سبکباری از دلبستگی‌های دنیا',
    tags: ['مرگ', 'یاد مرگ', 'دنیا', 'آخرت', 'شنبه', 'ذکر', 'پند', 'موعظه'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ: الْمَوْتِ، فَإِنَّهُ لَمْ يَذْكُرْهُ أَحَدٌ فِي ضِيقٍ مِنَ الْعَيْشِ إِلَّا وَسَّعَهُ عَلَيْهِ، وَلَا ذَكَرَهُ فِي سَعَةٍ إِلَّا ضَيَّقَهُ عَلَيْهِ.»',
    narrator: 'پیامبر اکرم حضرت محمد مصطفی (ص)',
    source: 'سنن ترمذی و بیهقی',
    hadithPersianMeaning: 'پیامبر اکرم (ص) فرمودند: یاد برهم‌زننده لذت‌ها، یعنی مرگ را بسیار به یاد آورید؛ زیرا هیچ‌کس آن را در تنگی معیشت یاد نمی‌کند مگر اینکه بر او گشایش می‌آورد، و در آسایش یاد نمی‌کند مگر اینکه او را متوجه ناپایداری دنیا می‌سازد.',
    hadithKurdishMeaning: 'پێغه‌مبه‌ری خودا (د.خ) فه‌رمووی: زۆر یادی له‌ناوبه‌ری له‌زه‌ته‌كان (مه‌رگ) بكه‌ن، چونكه‌ كه‌سێك له‌ ته‌نگانه‌دا یادی ناكات مه‌گه‌ر بۆی فراوان ده‌بێت و له‌ خۆشیدا یادی ناكات مه‌گه‌ر بۆی سه‌نگین و پڕ واتا ده‌بێت.',
    hadithEnglishMeaning: 'The Prophet (peace be upon him) said: "Remember often the destroyer of pleasures: death. For no one remembers it in constriction of livelihood except that it expands it, and in abundance except that it constricts it."',
    hadithTurkishMeaning: 'Resûlullah (s.a.v.) şöyle buyurdu: "Lezzetleri yıkan ölümü çokça hatırlayın! Çünkü o, darlıkta hatırlanırsa genişlik sağlar, bollukta hatırlanırsa kişiyi dünyaya dalmaktan alıkoyar."',
    dailyZikr: 'يَا رَبَّ الْعَالَمِينَ',
    zikrPersianMeaning: 'ای پروردگار جهانیان (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'ئه‌ی په‌روه‌ردگاری جیهانیان (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Lord of the Worlds (100 times)',
    zikrTurkishMeaning: 'Ey Alemlerin Rabbi (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-sun',
    dayOfWeek: 1, // یکشنبه
    dayName: 'یکشنبه',
    occasionTitle: 'ارسال خیرات برای اموات و باقیات صالحات',
    topic: 'صدقه جاریه، علم نافع و دعای فرزند صالح برای والدین',
    tags: ['صدقه جاریه', 'فرزند صالح', 'اموات', 'خیرات', 'والدین', 'پدر', 'مادر', 'یکشنبه'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلاَّ مِنْ ثَلاَثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ.»',
    narrator: 'پیامبر اکرم حضرت محمد مصطفی (ص)',
    source: 'صحیح مسلم',
    hadithPersianMeaning: 'هرگاه انسان از دنیا برود، پرونده عمل او بسته می‌شود مگر از سه چیز: صدقه جاریه (خیرات ماندگار)، دانشی که مردم از آن بهره‌مند شوند، یا فرزند شایسته‌ای که برای او دعا کند.',
    hadithKurdishMeaning: 'كاتێك مرۆڤ كۆچی دوایی ده‌كات، كرده‌وه‌كانی ده‌پچڕێت مه‌گه‌ر له‌ سێ ڕێگاوه‌: خێرێكی به‌رده‌وام (صه‌ده‌قه‌ی جاریه‌)، زانستێك كه‌ خه‌ڵك سوودی لێ وه‌ربگرێت، یان منداڵێكی چاكوكار كه‌ دوعای خێری بۆ بكات.',
    hadithEnglishMeaning: 'The Prophet said: "When a person dies, all their deeds come to an end except three: continuous charity, knowledge which is beneficial, or a righteous child who prays for them."',
    hadithTurkishMeaning: 'İnsan ölünce, şu üç amel hariç amelleri kesilir: Sadaka-i cariye (devam eden hayır), kendisinden faydalanılan ilim veya kendisine dua eden salih evlat.',
    dailyZikr: 'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    zikrPersianMeaning: 'ای صاحب شکوه و بزرگواری (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'ئه‌ی خاوه‌نی شكۆ و ڕێزداری (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Possessor of Majesty and Honor (100 times)',
    zikrTurkishMeaning: 'Ey Celal ve İkram Sahibi (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-mon',
    dayOfWeek: 2, // دوشنبه
    dayName: 'دوشنبه',
    occasionTitle: 'مجالس ترحیم و تسلیت‌گویی به بازماندگان',
    topic: 'پاداش بهشتی دلداری دادن به مصیبت‌دیدگان و تسلیت',
    tags: ['تسلیت', 'مصیبت', 'ترحیم', 'صبر', 'دلداری', 'بهشت', 'دوشنبه', 'سەرەخۆشی'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «مَنْ عَزَّى ثَكْلَى كُسِيَ بُرْدًا فِي الْجَنَّةِ، وَمَنْ عَزَّى مُصَابًا كَانَ لَهُ مِثْلُ أَجْرِهِ.»',
    narrator: 'پیامبر اکرم (ص) در فضیلت تسلیت گفتن به مصیبت‌دیدگان',
    source: 'سنن ترمذی',
    hadithPersianMeaning: 'هر کس مادری داغدار یا مصیبت‌دیده‌ای را تسلیت گوید و دلداری دهد، جامه‌ای فاخر در بهشت بر او پوشانده می‌شود و پاداشی همتای اجر صابر به او تعلق می‌گیرد.',
    hadithKurdishMeaning: 'هه‌ركه‌س دڵی دایكێكی جگه‌رسووتاو یان ماته‌مزه‌ده‌یه‌ك بده‌ینێته‌وه‌ و سه‌ره‌خۆشی لێ بكات، پۆشاكێكی به‌هه‌شتی به‌به‌ردا ده‌كرێت و هاوشێوه‌ی پاداشتی ئه‌و خێری ده‌ستده‌كه‌وێت.',
    hadithEnglishMeaning: 'Whoever consoles a bereaved mother will be clothed with a garment in Paradise, and whoever consoles a stricken person will have a reward like his.',
    hadithTurkishMeaning: 'Kim evladını kaybetmiş bir anneye taziye sunarsa cennette ona özel bir elbise giydirilir; kim bir musibetzedeyi teselli ederse onun sevabı kadar ecir alır.',
    dailyZikr: 'يَا قَاضِيَ الْحَاجَاتِ',
    zikrPersianMeaning: 'ای برآورنده حاجت‌ها (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'ئه‌ی جێبه‌جێكه‌ری پێویستییه‌كان (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Fulfiller of Needs (100 times)',
    zikrTurkishMeaning: 'Ey Hacetleri Gideren Allah (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-tue',
    dayOfWeek: 3, // سه‌شنبه
    dayName: 'سه‌شنبه',
    occasionTitle: 'هنگام مواجهه با رنج، بیماری و مصیبت فقدان',
    topic: 'ریزش گناهان و کفاره خطاها در اثر سختی و صبر',
    tags: ['صبر', 'بیماری', 'کفاره گناهان', 'مصیبت', 'رحمت', 'سه‌شنبه', 'بخشش'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «مَا مِنْ مُسْلِمٍ يُصِيبُهُ أَذًى، شَوْكَةٌ فَمَا فَوْقَهَا، إِلَّا كَفَّرَ اللَّهُ بِهَا سَيِّئَاتِهِ كَمَا تَحُطُّ الشَّجَرَةُ وَرَقَهَا.»',
    narrator: 'پیامبر گرامی اسلام (ص)',
    source: 'صحیح بخاری و مسلم',
    hadithPersianMeaning: 'هیچ رنج و بیماری یا خاری به مسلمانی نمی‌رسد مگر اینکه خداوند به واسطه آن گناهانش را می‌ریزد همان‌گونه که درخت برگ‌های خود را فرو می‌ریزد.',
    hadithKurdishMeaning: 'هیچ ناخۆشی یان دڕكێك به‌ موسڵمان ناگات ئیللا خودا به‌هۆیه‌وه‌ تاوانه‌كانی هه‌ڵده‌وه‌رێنێت هه‌روه‌كو چۆن دار گه‌ڵاكانی هه‌ڵده‌وه‌رێنێت.',
    hadithEnglishMeaning: 'No calamity befalls a Muslim, even the prick of a thorn, but that Allah expiates some of his sins by it, as a tree sheds its leaves.',
    hadithTurkishMeaning: 'Bir Müslümanın başına gelen bir sıkıntı, hatta batan bir diken sebebiyle bile Allah onun günahlarını, ağacın yapraklarını döktüğü gibi döker.',
    dailyZikr: 'يَا أَرْحَمَ الرَّاحِمِينَ',
    zikrPersianMeaning: 'ای مهربان‌ترین مهربانان (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'ئه‌ی میهره‌بانترینی میهره‌بانان (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Most Merciful of the merciful (100 times)',
    zikrTurkishMeaning: 'Ey Merhametlilerin En Merhametlisi (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-wed',
    dayOfWeek: 4, // چهارشنبه
    dayName: 'چهارشنبه',
    occasionTitle: 'شکر در آسایش و شکیبایی در سختی‌ها',
    topic: 'خیر بودن تمام احوال مؤمن در خوشی و ناخوشی',
    tags: ['صبر', 'شکر', 'مؤمن', 'آرامش', 'ایمان', 'چهارشنبه', 'خیر'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ؛ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.»',
    narrator: 'پیامبر اعظم (ص)',
    source: 'صحیح مسلم',
    hadithPersianMeaning: 'شگفت است کار مؤمن! تمام احوال او خیر است؛ اگر آسایشی به او رسد شکر می‌ورزد و خیر اوست، و اگر سختی به او رسد صبر می‌کند و آن نیز خیر اوست.',
    hadithKurdishMeaning: 'سه‌رسوڕهێنه‌ره‌ كاری باوه‌ڕدار! هه‌موو باره‌كانی خێره‌؛ ئه‌گه‌ر شادی و خۆشی ڕووی تێ بكات سوپاسگوزاره‌ و بۆی خێره‌، و ئه‌گه‌ر سه‌ختی ڕووی تێ بكات ئارام ده‌گرێت و بۆی خێره‌.',
    hadithEnglishMeaning: 'How wonderful is the affair of the believer, for his affairs are all good. If something good happens to him, he is thankful and that is good for him; and if something bad happens to him, he bears it with patience and that is good for him.',
    hadithTurkishMeaning: 'Müminin durumu ne hoştur! Her hali kendisi için hayırdır. Bir nimete ererse şükreder, bu onun için hayır olur. Bir sıkıntıya uğrarsa sabreder, bu da onun için hayır olur.',
    dailyZikr: 'يَا حَيُّ يَا قَيُّومُ',
    zikrPersianMeaning: 'ای زنده پاینده (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'ئه‌ی زیندووی هه‌میشه‌یی (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Ever-Living, O Sustainer of all existence (100 times)',
    zikrTurkishMeaning: 'Ey Hayy ve Kayyum Olan Allah (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-thu',
    dayOfWeek: 5, // پنج‌شنبه
    dayName: 'پنج‌شنبه (شب جمعه و زیارت اهل قبور)',
    hijriOccasion: 'فضیلت شب جمعه برای استغفار و طلب آمرزش اموات',
    occasionTitle: 'عصر پنج‌شنبه و شب جمعه برای درگذشتگان',
    topic: 'شادمانی اموات از هدیه دعا و صدقه بازماندگان',
    tags: ['شب جمعه', 'اموات', 'پنج‌شنبه', 'زیارت قبور', 'هدیه اموات', 'صدقه', 'استغفار', 'مغفرت'],
    hadithText: 'قَالَ النَّبِيُّ (ﷺ): «إِنَّ الْمَيِّتَ لَيَفْرَحُ بِالدُّعَاءِ لَهُ وَالصَّدَقَةِ عَنْهُ كَمَا يَفْرَحُ أَحَدُكُمْ بِالْهَدِيَّةِ تُهْدَى إِلَيْهِ.»',
    narrator: 'روایت نبوی در شادمانی اموات از دعای بازماندگان',
    source: 'شعب الایمان بیهقی',
    hadithPersianMeaning: 'همانا میت با دعای خیر و صدقه‌ای که برای او فرستاده می‌شود خوشحال می‌گردد، آن‌گونه که شما از هدیه‌ای که به شما تقدیم می‌شود شادمان می‌شوید.',
    hadithKurdishMeaning: 'به‌ڕاستی مردوو به‌ دوعای خێر و خێرپێكردنی له‌لایه‌ن كه‌سوكاریه‌وه‌ شاد و دڵخۆش ده‌بێت، هه‌روه‌كو چۆن ئێوه‌ به‌ دیارییه‌ك كه‌ پێتان ده‌به‌خشرێت شاد ده‌بن.',
    hadithEnglishMeaning: 'Indeed, the deceased rejoices with the prayers and charity offered on their behalf, just as one of you rejoices when a gift is presented to them.',
    hadithTurkishMeaning: 'Şüphesiz ölü, kendisine yapılan dua ve verilen sadaka ile, sizden birinin kendisine hediye verildiğinde sevindiği gibi sevinir.',
    dailyZikr: 'لَا إِلَهَ إِلَّا اللَّهُ الْمَلِكُ الْحَقُّ الْمُبِينُ',
    zikrPersianMeaning: 'معبودی جز خدای یگانه، فرمانروای حق و آشکار نیست (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'هیچ خودایه‌ك نییه‌ شایسته‌ی په‌رستن بێت جگه له‌ خوای تاقانه‌، پادشای هه‌ق و ئاشكرا (۱۰۰ جار)',
    zikrEnglishMeaning: 'There is no deity except Allah, the King, the Obvious Truth (100 times)',
    zikrTurkishMeaning: 'Mülk sahibi, hak ve apaçık olan Allah\'tan başka ilah yoktur (100 defa)',
    zikrCount: 100,
  },
  {
    id: 'hadith-fri',
    dayOfWeek: 6, // جمعه
    dayName: 'جمعه (سید الایام و صلوات بر پیامبر)',
    hijriOccasion: 'روز جمعه، نماز جمعه و خیرات برای درگذشتگان',
    occasionTitle: 'روز جمعه و عرض درود بر پیامبر رحمت',
    topic: 'صلوات بر پیامبر و طلب شفاعت برای خود و اموات',
    tags: ['جمعه', 'صلوات', 'شفاعت', 'نماز جمعه', 'پیامبر', 'استغفار', 'خیرات'],
    hadithText: 'قَالَ رَسُولُ اللَّهِ (ﷺ): «أَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ يَوْمَ الْجُمُعَةِ وَلَيْلَةَ الْجُمُعَةِ، فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ.»',
    narrator: 'پیامبر رحمت حضرت محمد (ﷺ)',
    source: 'سنن ابوداود و نسائی',
    hadithPersianMeaning: 'در روز و شب جمعه بر من فراوان صلوات و درود فرستید، زیرا صلوات و درود شما مستقیماً بر من عرضه می‌شود.',
    hadithKurdishMeaning: 'له‌ ڕۆژ و شه‌وی هه‌ینیدا زۆر صه‌ڵاواتم له‌سه‌ر لێبده‌ن، چونكه‌ صه‌ڵاواته‌كانتان ڕاسته‌وخۆ ده‌خرێته‌ به‌رده‌ستم.',
    hadithEnglishMeaning: 'Send abundant blessings upon me on Friday and the night of Friday, for your blessings are presented to me.',
    hadithTurkishMeaning: 'Cuma günü ve gecesinde bana çokça salavat getirin, zira salavatlarınız bana doğrudan arz olunur.',
    dailyZikr: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    zikrPersianMeaning: 'خداوندا بر سرورمان حضرت محمد و آل و اصحابش درود و سلام فرست (۱۰۰ مرتبه)',
    zikrKurdishMeaning: 'خوایه‌ صه‌ڵاوات و سڵاو بنێره‌ بۆ سه‌روه‌رمان موحه‌ممه‌د و ئال و یاوه‌رانی (۱۰۰ جار)',
    zikrEnglishMeaning: 'O Allah, send blessings and peace upon our Master Muhammad and upon his family and companions (100 times)',
    zikrTurkishMeaning: 'Allah\'ım! Efendimiz Muhammed\'e, âline ve ashabına salat ve selam eyle (100 defa)',
    zikrCount: 100,
  }
];
