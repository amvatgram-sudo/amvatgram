import React, { useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppProvider';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Plus, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Building, 
  HeartHandshake,
  Upload,
  Crown,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Check,
  CreditCard,
  Lock,
  Home,
  Megaphone,
  Sun,
  Sunset,
  Moon,
  Trash2,
  Building2,
  ExternalLink,
  Navigation as NavigationIcon,
  Compass
} from 'lucide-react';
import { Madhhab, CeremonyDetails, Gender, CeremonySessionSlot, MemorialTemplateConfig } from '../types';
import { PosterFrame, FrameTier, AgeGroup } from '../data/memorialFrames';
import { MEMORIAL_TEMPLATES } from '../data/memorialTemplates';
import { FramedPhoto } from './FramedPhoto';
import { MemorialTemplateStudioModal } from './TemplateEngine/MemorialTemplateStudioModal';
import { CeremonyMapPickerModal } from './CeremonyMapPickerModal';
import { 
  DEFAULT_MORNING_SLOT, 
  DEFAULT_AFTERNOON_SLOT, 
  DEFAULT_EVENING_SLOT, 
  getMosqueSlotsSummary, 
  generateCitywideBurialText 
} from '../utils/ceremonyHelpers';

export const CreateAdForm: React.FC = () => {
  const { 
    createAd, 
    setCurrentView, 
    locations, 
    currentUser, 
    activeMadhhabContext, 
    frames, 
  } = useApp();

  const isSunni = activeMadhhabContext === 'sunni';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedAd, setSubmittedAd] = useState<any>(null);

  // استودیوی هوشمند قالب و پوستر ترحیم (Mini Canva)
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [templateConfig, setTemplateConfig] = useState<MemorialTemplateConfig | undefined>(undefined);

  // مرحله ۱: مشخصات متوفی
  const [gender, setGender] = useState<Gender>('female');
  const [titlePrefix, setTitlePrefix] = useState('مرحومه خانم');
  const [firstNameLastName, setFirstNameLastName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [dateOfDeath, setDateOfDeath] = useState('امروز');
  const [burialCemetery, setBurialCemetery] = useState('آرامستان بهشت زهرا (س)');
  const [familyMembersNote, setFamilyMembersNote] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  // تصویر متوفی و قالب هوشمند انتخاب شده
  const [avatarUrl, setAvatarUrl] = useState<string>('/assets/app-logo.jpg');
  const [selectedFrameId, setSelectedFrameId] = useState<string>(frames[0]?.id || 'frame-free-classic');
  const [tierFilter, setTierFilter] = useState<'all' | FrameTier>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<'all' | AgeGroup>('all');

  // استیت پرداخت اینترنتی در صورت انتخاب قالب پولی
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // پیشوندهای احترامی بر اساس جنسیت
  const femalePrefixes = [
    'مرحومه خانم',
    'سرکار خانم',
    'بانو',
    'دوشیزه',
    'مرحومه بانو',
    'مرحومه حاجیه خانم',
    'مرحومه کربلایی خانم',
    'شادروان بانو',
    'زنده‌یاد بانو',
    'مرحومه دوشیزه',
  ];

  const malePrefixes = [
    'مرحوم کاک',
    'مرحوم مغفور',
    'مرحوم حاج',
    'مرحوم کربلایی',
    'شادروان',
    'زنده‌یاد',
    'مرحوم استاد',
  ];

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (newGender === 'female') {
      setTitlePrefix('مرحومه خانم');
      const motherFrame = frames.find((f) => f.id === 'frame-eco-mother');
      if (motherFrame) setSelectedFrameId(motherFrame.id); setPaymentId(null); setIsPaidSuccess(false);
    } else {
      setTitlePrefix('مرحوم کاک');
      setSelectedFrameId(frames[0]?.id || 'frame-free-classic'); setPaymentId(null); setIsPaidSuccess(false);
    }
  };

  const previewFullName = firstNameLastName.trim() 
    ? `${titlePrefix} ${firstNameLastName.trim()}`
    : `${titlePrefix} ...`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatarUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (val: number | '') => {
    setAge(val);
    if (typeof val === 'number') {
      if (val < 15) {
        const childFrame = frames.find((f) => f.ageGroup === 'child');
        if (childFrame) setSelectedFrameId(childFrame.id); setPaymentId(null); setIsPaidSuccess(false);
        setAgeGroupFilter('child');
      } else if (val < 35) {
        const youthFrame = frames.find((f) => f.ageGroup === 'youth');
        if (youthFrame) setSelectedFrameId(youthFrame.id); setPaymentId(null); setIsPaidSuccess(false);
        setAgeGroupFilter('youth');
      } else if (val >= 65) {
        const elderFrame = frames.find((f) => f.ageGroup === 'elderly');
        if (elderFrame) setSelectedFrameId(elderFrame.id); setPaymentId(null); setIsPaidSuccess(false);
        setAgeGroupFilter('elderly');
      }
    }
  };

  const filteredFrames = frames.filter((f) => {
    const matchTier = tierFilter === 'all' || f.tier === tierFilter;
    const matchAge = ageGroupFilter === 'all' || f.ageGroup === ageGroupFilter || f.ageGroup === 'all';
    return matchTier && matchAge;
  });

  const selectedFrame = frames.find((f) => f.id === selectedFrameId) || frames[0];

  // ایجاد تراکنش واقعی در سرور؛ موفقیت فقط پس از تأیید درگاه/وبهوک پذیرفته می‌شود.
  const handlePayment = async () => {
    if (selectedFrame.priceToman === 0 || !currentUser) return;
    setIsProcessingPayment(true);
    try {
      const result = await api.createPaymentIntent({ purpose: 'frame', gateway: 'saman', frameId: selectedFrame.id });
      const created = result.payment;
      setPaymentId(created.id);
      window.open(created.payment_url, '_blank', 'noopener,noreferrer');
      const started = Date.now();
      const poll = window.setInterval(async () => {
        try {
          const current = await api.getPayment(created.id);
          if (current.payment.status === 'successful') {
            window.clearInterval(poll);
            setIsProcessingPayment(false);
            setIsPaidSuccess(true);
          } else if (['failed', 'refunded', 'expired'].includes(current.payment.status) || Date.now() - started > 10 * 60 * 1000) {
            window.clearInterval(poll);
            setIsProcessingPayment(false);
            alert('وضعیت پرداخت تأیید نشد. لطفاً در صورت کسر وجه، رسید بانکی را نگه دارید و با پشتیبانی تماس بگیرید.');
          }
        } catch { /* شبکه موقتاً قطع است؛ polling ادامه پیدا می‌کند */ }
      }, 2500);
    } catch (error) {
      setIsProcessingPayment(false);
      alert(error instanceof Error ? error.message : 'اتصال به درگاه پرداخت انجام نشد.');
    }
  };

  // مرحله ۳: مراسمات
  const [ceremonies, setCeremonies] = useState<CeremonyDetails[]>([
    {
      id: 'c1',
      type: 'burial',
      title: 'مراسم تشییع و خاکسپاری',
      locationName: 'آرامستان بهشت زهرا (س)',
      targetCity: 'تهران',
      cemeteryName: 'آرامستان بهشت زهرا (س)',
      isCitywideBurialNotice: true,
      citywideAnnouncementText: 'به اطلاع عموم همشهریان و بستگان گرامی می‌رساند؛ پیکر مطهر به آرامستان بهشت زهرا (س) خاکسپاری خواهد شد.',
      date: 'امروز',
      startTime: 'طبق اعلان عمومی',
      endTime: '',
      notes: 'خاکسپاری در آرامستان مقصد بدون قید ساعت قطعی انجام خواهد شد.',
    },
    {
      id: 'c2',
      type: 'condolence_men',
      title: isSunni ? 'مجلس فاتحه‌خوانی برادران در مسجد' : 'مراسم ترحیم برادران در مسجد',
      locationName: isSunni ? 'مسجد جامع مرکزی دارالاحسان' : 'مسجد و حسینیه اهل بیت (ع)',
      date: 'فردا',
      morningSlot: { enabled: true, label: 'صبح', startTime: '۰۹:۰۰', endTime: '۱۱:۳۰' },
      afternoonSlot: { enabled: true, label: 'عصر', startTime: '۱۵:۰۰', endTime: '۱۷:۰۰' },
      eveningSlot: { enabled: true, label: 'شب', startTime: '۱۹:۳۰', endTime: '۲۱:۳۰' },
      startTime: 'صبح ۰۹:۰۰-۱۱:۳۰ | عصر ۱۵:۰۰-۱۷:۰۰ | شب ۱۹:۳۰-۲۱:۳۰',
      endTime: '۲۱:۳۰',
    },
    {
      id: 'c3',
      type: 'condolence_women',
      title: 'مجلس تعزیت و ترحیم بانوان',
      locationName: 'منزل متوفی',
      date: 'فردا',
      deceasedHomeAddress: 'خیابان انقلاب، کوچه گلستان ۳، پلاک ۱۲',
      startTime: '',
      endTime: '',
      notes: 'مراسم ترحیم بانوان در منزل متوفی دایر بوده و بر اساس عرف بدون تعیین ساعت است.',
    },
  ]);

  const availableLocations = locations.filter((loc) => {
    if (isSunni) {
      return loc.type !== 'hussainiya' && loc.type !== 'hall';
    }
    return true;
  });

  const [contactPhone2, setContactPhone2] = useState('');
  const [mapTargetCeremonyId, setMapTargetCeremonyId] = useState<string | null>(null);

  const handleLocationPinned = (locData: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: 'mosque' | 'cemetery' | 'hall' | 'hussainiya';
    khademPhone?: string;
  }) => {
    if (!mapTargetCeremonyId) return;
    setCeremonies((prev) =>
      prev.map((c) => {
        if (c.id === mapTargetCeremonyId) {
          return {
            ...c,
            locationName: locData.name,
            cemeteryName: locData.type === 'cemetery' ? locData.name : c.cemeteryName,
            customAddress: locData.address,
            deceasedHomeAddress: c.type === 'condolence_women' ? locData.address : c.deceasedHomeAddress,
            lat: locData.lat,
            lng: locData.lng,
          };
        }
        return c;
      })
    );
    if (mapTargetCeremonyId === 'c1') {
      setBurialCemetery(locData.name);
    }
    setMapTargetCeremonyId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameLastName || !fatherName) return;

    const phones = [
      { label: currentUser?.ownerRelation || 'صاحب عزا', phone: currentUser?.phone || '0918...' },
    ];
    if (contactPhone2) {
      phones.push({ label: 'بستگان معزا', phone: contactPhone2 });
    }

    const defaultNotice = isSunni
      ? `«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ» به اطلاع عموم همشهریان گرامی می‌رساند مجلس فاتحه و ترحیم ${gender === 'female' ? 'این بانوی پرهیزکار و باایمان' : 'این عزیز سفرکرده'} در مساجد شهر انتخابی برگزار می‌گردد.`
      : `«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ» به اطلاع دوستان و آشنایان می‌رساند مراسم ترحیم و یادبود ${gender === 'female' ? 'مرحومه مغفوره' : 'مرحوم مغفور'} برگزار می‌گردد.`;

    const processedCeremonies = ceremonies.map((c) => {
      if (c.type === 'burial') {
        const city = c.targetCity || 'شهر انتخابی';
        const cemetery = c.cemeteryName || c.locationName || burialCemetery || 'آرامستان بهشت مصطفی';
        return {
          ...c,
          isCitywideBurialNotice: true,
          targetCity: city,
          cemeteryName: cemetery,
          citywideAnnouncementText: generateCitywideBurialText(previewFullName, gender, city, cemetery),
          startTime: 'طبق اعلان سراسری شهر',
          endTime: '',
        };
      }
      if (c.type === 'condolence_women') {
        return {
          ...c,
          locationName: 'منزل متوفی',
          deceasedHomeAddress: c.deceasedHomeAddress || 'شهر انتخابی، منزل متوفی',
          startTime: '',
          endTime: '',
          notes: 'مراسم ترحیم بانوان در منزل متوفی دایر می‌باشد (بدون قید ساعت).',
        };
      }
      // For mosque:
      const daysCount = c.ceremonyDaysCount || c.selectedDaysOfWeek?.length || 2;
      const daysNames = c.selectedDaysOfWeek && c.selectedDaysOfWeek.length > 0
        ? c.selectedDaysOfWeek.join(' و ')
        : 'شنبه و یکشنبه';
      const durationSummary = `مدت ${daysCount} روز (${daysNames})`;
      return {
        ...c,
        ceremonyDaysCount: daysCount,
        selectedDaysOfWeek: c.selectedDaysOfWeek || ['شنبه', 'یکشنبه'],
        ceremonyDurationSummary: durationSummary,
        startTime: `${durationSummary} | ${getMosqueSlotsSummary(c)}`,
      };
    });

    const newAd = await createAd({
      announcementText: announcementText || defaultNotice,
      ownerPhone: currentUser?.phone || '',
      ownerRelation: currentUser?.ownerRelation || 'بستگان درجه اول',
      selectedFrameId: selectedFrame.id,
      paymentId: paymentId || undefined,
      templateConfig: templateConfig || (selectedFrame ? {
        templateId: selectedFrame.id,
        zoom: 1,
        panX: 0,
        panY: 0,
        rotate: 0,
        brightness: 100,
        contrast: 100,
        grayscale: true,
        sepia: false,
        blurBackground: true,
        photoShape: 'rounded-rect',
        activeDecorations: ['bismillah', 'ribbon'],
        customQuote: 'روحش شاد و یادش تا ابد گرامی باد',
        customPrefix: titlePrefix,
        fontFamily: 'serif',
        aspectRatio: 'square',
      } : undefined),
      deceased: {
        id: `dec-${Date.now()}`,
        titlePrefix,
        fullName: previewFullName,
        fatherName,
        gender,
        age: age ? Number(age) : undefined,
        avatarUrl,
        dateOfDeath,
        burialCemetery,
        madhhab: activeMadhhabContext,
        familyMembersNote,
        deceasedNationalCode: currentUser?.deceasedNationalCode,
      },
      ceremonies: processedCeremonies,
      contactPhones: phones,
    });

    setSubmittedAd(newAd);
  };

  if (submittedAd) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-stone-100 mb-2">اعلامیه با موفقیت ثبت و ارسال شد</h2>
          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            کد پیگیری: <strong className="text-amber-400 font-mono text-sm">{submittedAd.trackingCode}</strong>
            <br />
            اعلامیه برای <strong className="text-stone-200">{submittedAd.deceased.fullName}</strong> همراه با قالب انتخابی «{selectedFrame.title}» ثبت گردید.
            <br />
            طبق ضوابط، هر آگهی قبل از انتشار عمومی توسط مدیریت سامانه امواتگرام بررسی و پس از اخذ تاییدیه، فوراً منتشر خواهد شد.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-6 py-2.5 rounded-xl font-bold cursor-pointer"
            >
              مشاهده آگهی‌های فعال
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* سربرگ احراز هویت تایید شده صاحب عزا */}
      <div className="bg-stone-900 border border-amber-600/40 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">صاحب عزای احراز هویت شده:</span>
              <span className="text-xs font-bold text-stone-100">{currentUser?.fullName}</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                {currentUser?.ownerRelation}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              کدملی متوفی استعلام شده: <span className="font-mono text-stone-300">{currentUser?.deceasedNationalCode || 'معتبر'}</span>
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800">
          تطابق نسبت تأیید شد
        </span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-100">تکمیل و ثبت اعلامیه ترحیم</h2>
          <p className="text-xs text-stone-400 mt-1">
            {isSunni 
              ? 'مقررات فقه اهل سنت و امام شافعی (پوشش جهانی): مجالس فاتحه در مساجد (بدون چهلم، سالگرد و تالار)' 
              : 'مقررات اهل تشیع: شامل مساجد، حسینیه‌ها و مراسمات یادبود'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('home')}
          className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
        >
          انصراف
        </button>
      </div>

      {/* نوار مراحل */}
      <div className="grid grid-cols-3 gap-2 mb-8 text-center text-xs">
        <div className={`p-3 rounded-xl border ${step === 1 ? 'bg-stone-800 border-amber-500 text-amber-300 font-bold' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
          ۱. مشخصات متوفی
        </div>
        <div className={`p-3 rounded-xl border ${step === 2 ? 'bg-stone-800 border-amber-500 text-amber-300 font-bold' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
          ۲. انتخاب عکس و قالب هوشمند
        </div>
        <div className={`p-3 rounded-xl border ${step === 3 ? 'bg-stone-800 border-amber-500 text-amber-300 font-bold' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
          ۳. زمان و مساجد فاتحه
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs text-stone-200 block mb-2 font-bold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>جنسیت متوفی جهت تنظیم القاب ادب و احترام:</span>
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`p-3 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                    gender === 'female'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  متوفی بانو / خانم (زن)
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`p-3 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                    gender === 'male'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  متوفی آقا (مرد)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-300 block mb-1.5 font-medium">
                  پیشوند و عنوان احترامی شایسته *
                </label>
                <select
                  value={titlePrefix}
                  onChange={(e) => setTitlePrefix(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3 text-xs text-stone-100 outline-none"
                >
                  {(gender === 'female' ? femalePrefixes : malePrefixes).map((prefix, idx) => (
                    <option key={idx} value={prefix}>
                      {prefix}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-300 block mb-1.5 text-xs font-medium">
                  نام و نام خانوادگی متوفی *
                </label>
                <input
                  type="text"
                  required
                  placeholder={gender === 'female' ? 'مثال: فاطمه رستمی' : 'مثال: علی امینی'}
                  value={firstNameLastName}
                  onChange={(e) => setFirstNameLastName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs flex items-center justify-between">
              <span className="text-stone-400">نحوه درج عنوان متوفی در اعلامیه:</span>
              <span className="font-bold text-amber-400 font-serif text-sm">
                «{previewFullName}»
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1.5 font-medium">نام پدر متوفی *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مرحوم ملا ابراهیم"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1.5 font-medium">سن تقریبی (جهت پیشنهاد هوشمند قالب)</label>
                <input
                  type="number"
                  placeholder="مثال: ۷۵ یا ۲۸"
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1.5 font-medium">زمان فوت</label>
                <input
                  type="text"
                  value={dateOfDeath}
                  onChange={(e) => setDateOfDeath(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1.5 font-medium">آرامستان محل خاکسپاری</label>
                <input
                  type="text"
                  value={burialCemetery}
                  onChange={(e) => setBurialCemetery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-stone-300 block mb-1.5 font-medium">اسامی بازماندگان و بستگان جهت درج در اعلامیه</label>
                <input
                  type="text"
                  placeholder={gender === 'female' ? 'همسر: کاک... / فرزندان: ... / برادران: ...' : 'فرزندان، برادران و همسر...'}
                  value={familyMembersNote}
                  onChange={(e) => setFamilyMembersNote(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!firstNameLastName || !fatherName) {
                    alert('لطفاً نام متوفی و نام پدر را وارد فرمایید');
                    return;
                  }
                  setStep(2);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>مرحله بعد: بارگذاری عکس و انتخاب قالب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۲: گالری قالب‌ها همراه با پرداخت اینترنتی در صورت انتخاب قالب تجاری */}
        {step === 2 && (
          <div className="space-y-6">
            {/* بنر سیستم قالب و استودیوی هوشمند تصویر (Mini Canva) */}
            <div className="bg-gradient-to-r from-amber-950/50 via-stone-900 to-stone-950 border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-3xl flex-shrink-0 shadow-inner">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="text-base sm:text-lg font-black text-amber-300">
                      استودیوی هوشمند قالب و پوستر ترحیم (Mini Canva)
                    </h4>
                    <span className="text-[10px] bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full font-black tracking-wide">
                      نسخه ویژه
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed max-w-xl">
                    برش هوشمند چهره، زوم، اصلاح نور، فیلتر سیاه‌وسفید و سپیا، استیکرهای کبوتر و شمع، و انتخاب از ۸ قالب مذهبی، سنتی، کلاسیک و طبیعت
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStudioOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-950/60 whitespace-nowrap transition-all scale-100 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>ورود به استودیوی طراحی قالب و عکس</span>
              </button>
            </div>

            {/* ۸ قالب آماده معنوی و رسمی امواتگرام */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-200 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>انتخاب سریع از بین ۸ سبک قالب ترحیم:</span>
                </h4>
                <span className="text-[11px] text-amber-400 font-mono">
                  {templateConfig ? `قالب فعال: ${MEMORIAL_TEMPLATES.find(t => t.id === templateConfig.templateId)?.name || 'سفارشی'}` : 'قالب‌های استاندارد'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MEMORIAL_TEMPLATES.map((tmpl) => {
                  const isCurrent = (templateConfig?.templateId === tmpl.id) || (selectedFrameId === tmpl.id);
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedFrameId(tmpl.id); setPaymentId(null); setIsPaidSuccess(false);
                        setTemplateConfig({
                          templateId: tmpl.id,
                          zoom: 1,
                          panX: 0,
                          panY: 0,
                          rotate: 0,
                          brightness: 100,
                          contrast: 100,
                          grayscale: true,
                          sepia: false,
                          blurBackground: true,
                          photoShape: tmpl.defaultShape,
                          activeDecorations: tmpl.defaultDecorations,
                          customQuote: tmpl.defaultQuote,
                          customPrefix: titlePrefix,
                          fontFamily: 'serif',
                          aspectRatio: 'square',
                        });
                      }}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${
                        isCurrent
                          ? 'bg-amber-950/60 border-amber-500 shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/40'
                          : 'bg-stone-950 border-stone-850 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{tmpl.emoji}</span>
                        <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-full border border-stone-800">
                          {tmpl.badgeText}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-black block text-stone-100">{tmpl.name}</span>
                        <span className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">{tmpl.description}</span>
                      </div>

                      {isCurrent && (
                        <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4 pt-2">
              <div>
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  گالری سایر قالب‌های رسمی و کادرهای سنتی
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  عکس متوفی را بارگذاری کنید؛ عکس به صورت اتوماتیک در تمام قالب‌ها جایگذاری خواهد شد.
                </p>
              </div>

              <label className="bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>بارگذاری عکس متوفی</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* فیلترها */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-400">رده قیمتی:</span>
                <button
                  type="button"
                  onClick={() => setTierFilter('all')}
                  className={`px-2.5 py-1 rounded-lg ${tierFilter === 'all' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  همه
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('free')}
                  className={`px-2.5 py-1 rounded-lg ${tierFilter === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400'}`}
                >
                  رایگان
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('economy')}
                  className={`px-2.5 py-1 rounded-lg ${tierFilter === 'economy' ? 'bg-sky-600 text-white font-bold' : 'text-stone-400'}`}
                >
                  اقتصادی
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('luxury')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${tierFilter === 'luxury' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400'}`}
                >
                  <Crown className="w-3 h-3" />
                  سلطنتی VIP
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-400">گروه سنی:</span>
                <select
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value as any)}
                  className="bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-stone-200 outline-none"
                >
                  <option value="all">تمامی گروه‌های سنی</option>
                  <option value="elderly">بزرگان و سالمندان</option>
                  <option value="youth">جوانان</option>
                  <option value="female_special">بانوان و مادران</option>
                  <option value="child">کودکان و نونهالان</option>
                </select>
              </div>
            </div>

            {/* شبکه نمایش قالب‌ها */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredFrames.map((frame) => {
                const isSelected = selectedFrameId === frame.id;
                return (
                  <div
                    key={frame.id}
                    onClick={() => {
                      setSelectedFrameId(frame.id); setPaymentId(null); setIsPaidSuccess(false);
                      setIsPaidSuccess(false);
                    }}
                    className={`bg-stone-950 rounded-2xl p-3 border transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 shadow-xl shadow-amber-950/60 ring-2 ring-amber-500/50'
                        : 'border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-200 truncate">
                        {frame.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        frame.tier === 'free'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : frame.tier === 'economy'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-600 font-mono'
                      }`}>
                        {frame.priceToman === 0 ? 'رایگان' : `${frame.priceToman.toLocaleString('fa-IR')} ت`}
                      </span>
                    </div>

                    <div className="my-1">
                      <FramedPhoto
                        photoUrl={avatarUrl}
                        frameId={frame.id}
                        fullName={previewFullName}
                        titlePrefix={titlePrefix}
                        showFooterName={true}
                      />
                    </div>

                    <p className="text-[10px] text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {frame.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-850 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-stone-500">{frame.categoryTitle}</span>
                      {isSelected ? (
                        <span className="text-amber-400 flex items-center gap-1 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> انتخاب شده
                        </span>
                      ) : (
                        <span className="text-stone-400 group-hover:text-stone-200 text-[11px]">
                          انتخاب این قالب
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* کادر فاکتور و درگاه پرداخت در صورت انتخاب قالب پولی */}
            {selectedFrame.priceToman > 0 && (
              <div className="bg-stone-950 border border-amber-600/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100 flex items-center gap-2">
                      <span>پرداخت هزینه قالب انتخابی:</span>
                      <span className="text-amber-400">{selectedFrame.title}</span>
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      مبلغ قابل پرداخت: <strong className="font-mono text-emerald-400">{selectedFrame.priceToman.toLocaleString('fa-IR')} تومان</strong> (متصل به شاپرک بانکی)
                    </p>
                  </div>
                </div>

                {isPaidSuccess ? (
                  <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>پرداخت با موفقیت تأیید شد</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950 transition-all"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>اتصال به درگاه بانکی...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>پرداخت اینترنتی امن</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-stone-800 text-stone-300 text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                مرحله قبل
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedFrame.priceToman > 0 && !isPaidSuccess) {
                    alert('لطفاً جهت استفاده از قالب غیررایگان، دکمه «پرداخت اینترنتی امن» را بفشارید.');
                    return;
                  }
                  setStep(3);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>مرحله بعد: زمان و مساجد</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۳: زمان، مساجد و مراسمات */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-amber-400">
                  {isSunni ? 'برنامه مراسمات، مساجد و مجالس فاتحه‌خوانی' : 'برنامه مراسمات، ترحیم، مساجد و حسینیه'}
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  شامل تنظیم ساعات ۳ گانه مساجد توسط صاحب عزا، آدرس منزل متوفی برای بانوان و اعلان سراسری شهر
                </p>
              </div>

              <span className="text-xs text-stone-400">
                قالب تایید شده: <strong className="text-amber-300">{selectedFrame.title}</strong>
              </span>
            </div>

            <div className="space-y-4">
              {ceremonies.map((c, idx) => {
                const isBurial = c.type === 'burial';
                const isWomen = c.type === 'condolence_women';
                const isMosque = !isBurial && !isWomen;

                return (
                  <div
                    key={c.id}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-4 text-xs transition-all ${
                      isBurial
                        ? 'bg-stone-950/90 border-amber-600/40 shadow-lg'
                        : isWomen
                        ? 'bg-stone-950/90 border-rose-900/40 shadow-lg'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    {/* هدر هر مجلس با نشانگر نوع آن */}
                    <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        {isBurial ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <Megaphone className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>اعلان سراسری شهر — تشییع و خاکسپاری</span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full mr-2">
                              بدون قید ساعت قطعی
                            </span>
                          </div>
                        ) : isWomen ? (
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                            <Home className="w-4 h-4 text-rose-400" />
                            <span>مجلس ترحیم و تعزیت بانوان</span>
                            <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full mr-2">
                              صرفاً منزل متوفی (بدون تعیین ساعت)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                            <Building className="w-4 h-4 text-sky-400" />
                            <span>مراسم ترحیم و فاتحه در مسجد</span>
                            <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full mr-2">
                              برنامه‌ریزی ساعات توسط صاحب عزا (۳ بخش)
                            </span>
                          </div>
                        )}
                      </div>

                      {ceremonies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCeremonies(ceremonies.filter((_, i) => i !== idx));
                          }}
                          className="text-stone-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                          title="حذف این مجلس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* حالت ۱: مراسم تشییع - اعلان سراسری شهر بدون قید ساعت */}
                    {isBurial && (
                      <div className="space-y-3">
                        <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl text-stone-300 text-[11px] leading-relaxed flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <p>
                            مراسم تشییع اکثراً تعیین ساعت نمی‌شود؛ با تعیین <strong>شهر مورد نظر</strong> و <strong>آرامستان مقصد</strong>، یک <strong>اعلان سراسری در سطح شهر</strong> جهت آگاهی عموم همشهریان منتشر می‌گردد.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-stone-400 block mb-1">عنوان مراسم</label>
                            <input
                              type="text"
                              value={c.title}
                              onChange={(e) => {
                                const updated = [...ceremonies];
                                updated[idx].title = e.target.value;
                                setCeremonies(updated);
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-200"
                            />
                          </div>

                          <div>
                            <label className="text-stone-400 block mb-1">
                              شهر مورد نظر جهت اعلان سراسری
                            </label>
                            <input
                              type="text"
                              value={c.targetCity || 'شهر انتخابی'}
                              onChange={(e) => {
                                const updated = [...ceremonies];
                                updated[idx].targetCity = e.target.value;
                                updated[idx].citywideAnnouncementText = generateCitywideBurialText(
                                  previewFullName,
                                  gender,
                                  e.target.value,
                                  updated[idx].cemeteryName || updated[idx].locationName
                                );
                                setCeremonies(updated);
                              }}
                              placeholder="مثلاً: تهران، استانبول، دبی، لندن، اربیل..."
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-200"
                            />
                          </div>

                          <div>
                            <label className="text-stone-400 block mb-1">
                              آرامستان مقصد خاکسپاری
                            </label>
                            <input
                              type="text"
                              value={c.cemeteryName || c.locationName || burialCemetery}
                              onChange={(e) => {
                                const updated = [...ceremonies];
                                updated[idx].cemeteryName = e.target.value;
                                updated[idx].locationName = e.target.value;
                                updated[idx].citywideAnnouncementText = generateCitywideBurialText(
                                  previewFullName,
                                  gender,
                                  updated[idx].targetCity || 'شهر انتخابی',
                                  e.target.value
                                );
                                setCeremonies(updated);
                              }}
                              placeholder="مثلاً: آرامستان بهشت زهرا (س)"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-200"
                            />
                            <div className="mt-1.5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setMapTargetCeremonyId(c.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span>{c.lat ? `موقعیت GPS ثبت شد (${c.lat}, ${c.lng})` : '📍 پین و ثبت موقعیت دقیق آرامستان روی نقشه (GPS)'}</span>
                              </button>
                            </div>
                          </div>
                        </div>


                        {/* پیش‌نمایش متن اعلان سراسری شهر */}
                        <div className="bg-stone-900/90 border border-amber-600/30 rounded-xl p-3 space-y-1.5">
                          <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                            پیش‌نمایش اعلان سراسری در سطح شهر {c.targetCity || 'شهر انتخابی'}:
                          </span>
                          <p className="text-stone-200 text-xs font-serif leading-relaxed pr-2 border-r-2 border-amber-500">
                            «به اطلاع عموم همشهریان گرامی شهر {c.targetCity || 'شهر انتخابی'} می‌رساند؛ پیکر مطهر {gender === 'female' ? 'مرحومه مغفوره' : 'مرحوم مغفور'} {previewFullName || 'متوفی'} به {c.cemeteryName || c.locationName || 'آرامستان مقصد'} خاکسپاری خواهد شد.»
                          </p>
                        </div>
                      </div>
                    )}

                    {/* حالت ۲: مراسم ترحیم بانوان - فقط آدرس منزل متوفی بدون ساعت */}
                    {isWomen && (
                      <div className="space-y-3">
                        <div className="bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl text-stone-300 text-[11px] leading-relaxed flex items-start gap-2">
                          <Home className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <p>
                            برای مراسم ترحیم بانوان <strong>فقط آدرس منزل متوفی درج شود و هیچ ساعتی تعیین نمی‌گردد</strong>. مجلس بانوان در طول روز در منزل متوفی منعقد است.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-stone-400 block mb-1">عنوان مجلس بانوان</label>
                            <input
                              type="text"
                              value={c.title}
                              onChange={(e) => {
                                const updated = [...ceremonies];
                                updated[idx].title = e.target.value;
                                setCeremonies(updated);
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-200"
                            />
                          </div>

                          <div>
                            <label className="text-stone-400 block mb-1">محل انعقاد مجلس</label>
                            <input
                              type="text"
                              disabled
                              value="منزل متوفی (بدون تعیین ساعت)"
                              className="w-full bg-stone-900/60 border border-stone-800/60 rounded-lg p-2 text-rose-300 font-medium cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-rose-300 font-bold block mb-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            <span>آدرس دقیق منزل متوفی (صرفاً آدرس منزل، بدون قید ساعت):</span>
                          </label>
                          <textarea
                            rows={2}
                            value={c.deceasedHomeAddress || ''}
                            onChange={(e) => {
                              const updated = [...ceremonies];
                              updated[idx].deceasedHomeAddress = e.target.value;
                              updated[idx].locationName = 'منزل متوفی';
                              setCeremonies(updated);
                            }}
                            placeholder="مثال: شهر انتخابی، میدان معلم، بلوار رسالت، کوچه گلستان ۳، پلاک ۱۲، طبقه اول منزل مرحوم"
                            className="w-full bg-stone-900 border border-stone-800 focus:border-rose-500 rounded-xl p-2.5 text-stone-200 text-xs"
                          />
                          <div className="mt-1.5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setMapTargetCeremonyId(c.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <MapPin className="w-3 h-3 text-rose-400" />
                              <span>{c.lat ? `موقعیت منزل روی نقشه ثبت شد (${c.lat}, ${c.lng})` : '📍 پین و ثبت موقعیت دقیق منزل متوفی روی نقشه (GPS)'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* حالت ۳: مراسم مساجد - تعیین ساعات در ۳ بخش صبح، عصر و شب توسط صاحب عزا */}
                    {isMosque && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-stone-400 block mb-1">عنوان مراسم</label>
                            <input
                              type="text"
                              value={c.title}
                              onChange={(e) => {
                                const updated = [...ceremonies];
                                updated[idx].title = e.target.value;
                                setCeremonies(updated);
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-200"
                            />
                          </div>

                          <div className="space-y-3">
                            {/* فیلتر شهر جهت نمایش لیست مساجد همان شهر (بند ۳ خواسته کاربر) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-stone-300 block mb-1 text-xs font-bold">
                                  شهر محل برگزاری مراسم *
                                </label>
                                <select
                                  value={c.targetCity || 'تهران'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    const newCity = e.target.value;
                                    updated[idx].targetCity = newCity;
                                    // انتخاب اولین مسجد موجود در این شهر
                                    const firstCityMosque = locations.find((l) => l.city === newCity && (isSunni ? l.type === 'mosque' : true));
                                    if (firstCityMosque) {
                                      updated[idx].locationName = firstCityMosque.name;
                                      updated[idx].lat = firstCityMosque.lat;
                                      updated[idx].lng = firstCityMosque.lng;
                                      updated[idx].customAddress = firstCityMosque.address;
                                    }
                                    setCeremonies(updated);
                                  }}
                                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-stone-200 text-xs outline-none focus:border-amber-500"
                                >
                                  {Array.from(new Set(locations.map((l) => l.city).filter(Boolean))).map((city) => (
                                    <option key={city} value={city}>
                                      {city}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-stone-300 text-xs font-bold">
                                    لیست تمامی مساجد شهر {c.targetCity || 'تهران'} *
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setMapTargetCeremonyId(c.id)}
                                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer underline"
                                  >
                                    <MapPin className="w-3 h-3" />
                                    <span>افزودن مسجد با نقشه GPS</span>
                                  </button>
                                </div>
                                <select
                                  value={c.locationName}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].locationName = e.target.value;
                                    const selectedLoc = locations.find((l) => l.name === e.target.value);
                                    if (selectedLoc) {
                                      updated[idx].lat = selectedLoc.lat;
                                      updated[idx].lng = selectedLoc.lng;
                                      updated[idx].customAddress = selectedLoc.address;
                                      if (selectedLoc.city) updated[idx].targetCity = selectedLoc.city;
                                    }
                                    setCeremonies(updated);
                                  }}
                                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-stone-200 text-xs outline-none focus:border-amber-500"
                                >
                                  {locations
                                    .filter((l) => (!c.targetCity || l.city === c.targetCity) && (isSunni ? (l.type === 'mosque' || l.type === 'cemetery') : true))
                                    .map((loc) => (
                                      <option key={loc.id} value={loc.name}>
                                        {loc.name} ({loc.neighborhood || loc.city})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>

                            {/* کارت مشخصات مسجد انتخاب شده شامل آدرس متنی و لینک‌های مسیریابی آنلاین (بند ۳ خواسته کاربر) */}
                            {(() => {
                              const activeLoc = locations.find((l) => l.name === c.locationName) || {
                                name: c.locationName,
                                address: c.customAddress || 'محل برگزاری مراسم',
                                lat: c.lat,
                                lng: c.lng,
                                city: c.targetCity,
                                neighborhood: ''
                              };

                              return (
                                <div className="p-3 bg-stone-900/90 border border-amber-600/30 rounded-2xl space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-emerald-400" />
                                        <span className="font-bold text-stone-100 text-xs">{activeLoc.name}</span>
                                        {activeLoc.city && (
                                          <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                                            {activeLoc.city}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-stone-300 flex items-start gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0 mt-0.5" />
                                        <span><strong>آدرس متنی:</strong> {activeLoc.address || c.customAddress || 'آدرس ثبت شده روی نقشه'}</span>
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => setMapTargetCeremonyId(c.id)}
                                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                    >
                                      <MapPin className="w-3 h-3 text-amber-400" />
                                      <span>تغییر یا پین روی نقشه</span>
                                    </button>
                                  </div>

                                  {/* لینک‌های مسیریابی در نقشه آنلاین */}
                                  {c.lat && c.lng && (
                                    <div className="flex items-center gap-2 pt-1 border-t border-stone-800 text-[11px]">
                                      <span className="text-stone-400 font-bold">مسیریابی آنلاین:</span>
                                      <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3 text-amber-400" />
                                        <span>گوگل مپ</span>
                                      </a>
                                      <a
                                        href={`https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-stone-800 hover:bg-stone-700 text-cyan-300 border border-stone-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                                      >
                                        <NavigationIcon className="w-3 h-3 text-cyan-400" />
                                        <span>Waze</span>
                                      </a>
                                      <a
                                        href={`https://neshan.org/maps/@${c.lat},${c.lng},16z`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-stone-800 hover:bg-stone-700 text-blue-300 border border-stone-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                                      >
                                        <Compass className="w-3 h-3 text-blue-400" />
                                        <span>نشان</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>


                        {/* تعیین تعداد روزهای مراسم ترحیم و تقویم هفته قبل از تعیین ساعات */}
                        <div className="bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 space-y-3.5 shadow-md">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-800 pb-2">
                            <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-amber-400" />
                              <span>تعیین تعداد روزهای مراسم و تقویم هفته (قبل از تعیین ساعات):</span>
                            </span>
                            <span className="text-[11px] text-stone-400">
                              صاحب عزا ابتدا روزهای برگزاری مجلس را مشخص می‌نماید.
                            </span>
                          </div>

                          {/* ۱. انتخاب سریع تعداد روزها */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-stone-300 font-medium block">
                              تعداد روزهای مجلس ترحیم:
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {[
                                { days: 1, label: '۱ روز' },
                                { days: 2, label: '۲ روز (مرسوم)' },
                                { days: 3, label: '۳ روز' },
                              ].map((item) => (
                                <button
                                  key={item.days}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...ceremonies];
                                    updated[idx].ceremonyDaysCount = item.days;
                                    // روزهای پیش‌فرض متناسب
                                    if (item.days === 1) {
                                      updated[idx].selectedDaysOfWeek = ['یکشنبه'];
                                    } else if (item.days === 2) {
                                      updated[idx].selectedDaysOfWeek = ['شنبه', 'یکشنبه'];
                                    } else if (item.days === 3) {
                                      updated[idx].selectedDaysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه'];
                                    }
                                    setCeremonies(updated);
                                  }}
                                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                                    (c.ceremonyDaysCount || 2) === item.days
                                      ? 'bg-amber-600 text-stone-950 border-amber-500 shadow-md shadow-amber-950/60'
                                      : 'bg-stone-950 hover:bg-stone-850 text-stone-300 border-stone-800'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* ۲. تقویم تعاملی ایام هفته */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-stone-300 font-medium block">
                              انتخاب دقیق روزها از روی تقویم هفته:
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                              {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((dayName) => {
                                const selectedDays = c.selectedDaysOfWeek || ['شنبه', 'یکشنبه'];
                                const isSelected = selectedDays.includes(dayName);
                                return (
                                  <button
                                    key={dayName}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...ceremonies];
                                      let curr = updated[idx].selectedDaysOfWeek || ['شنبه', 'یکشنبه'];
                                      if (curr.includes(dayName)) {
                                        if (curr.length > 1) {
                                          curr = curr.filter((d) => d !== dayName);
                                        }
                                      } else {
                                        curr = [...curr, dayName];
                                      }
                                      updated[idx].selectedDaysOfWeek = curr;
                                      updated[idx].ceremonyDaysCount = curr.length;
                                      setCeremonies(updated);
                                    }}
                                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                                      isSelected
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                                    }`}
                                  >
                                    <span>{dayName}</span>
                                    {isSelected && <span className="block text-[9px] text-amber-400">✓ انتخاب</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* خلاصه روزهای انتخابی */}
                          <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between text-xs text-stone-300">
                            <span className="flex items-center gap-1.5">
                              <span className="text-amber-400">📅</span>
                              <span>
                                برنامه ایام: <strong>{(c.selectedDaysOfWeek || ['شنبه', 'یکشنبه']).length} روز</strong>
                                {' — '}
                                <strong className="text-amber-300">{(c.selectedDaysOfWeek || ['شنبه', 'یکشنبه']).join(' و ')}</strong>
                              </span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-900">
                              تأیید ایام هفته
                            </span>
                          </div>
                        </div>

                        {/* بخش تعیین ساعات برگزاری در مساجد (تقسیم به ۳ بخش صبح، عصر و شب توسط صاحب عزا) */}
                        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-800 pb-2">
                            <span className="font-bold text-stone-200 text-xs flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span>تعیین ساعات برگزاری در مسجد توسط صاحب عزا (۳ بخش):</span>
                            </span>
                            <span className="text-[11px] text-stone-400">
                              صاحب عزا می‌تواند هر یک از ۳ نوبت را فعال و ساعات دقیق آن را برنامه‌ریزی نماید.
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* بخش اول: نوبت صبح */}
                            <div
                              className={`p-3 rounded-xl border transition-all ${
                                c.morningSlot?.enabled
                                  ? 'bg-amber-950/20 border-amber-600/50 text-stone-200'
                                  : 'bg-stone-950/60 border-stone-850 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-300">
                                  <input
                                    type="checkbox"
                                    checked={c.morningSlot?.enabled ?? true}
                                    onChange={(e) => {
                                      const updated = [...ceremonies];
                                      updated[idx].morningSlot = {
                                        ...(updated[idx].morningSlot || DEFAULT_MORNING_SLOT),
                                        enabled: e.target.checked,
                                      };
                                      setCeremonies(updated);
                                    }}
                                    className="w-4 h-4 accent-amber-500 rounded"
                                  />
                                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                                  <span>بخش اول: نوبت صبح</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-stone-400">از</span>
                                <input
                                  type="text"
                                  disabled={!c.morningSlot?.enabled}
                                  value={c.morningSlot?.startTime || '۰۹:۰۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].morningSlot = {
                                      ...(updated[idx].morningSlot || DEFAULT_MORNING_SLOT),
                                      startTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                                <span className="text-stone-400">تا</span>
                                <input
                                  type="text"
                                  disabled={!c.morningSlot?.enabled}
                                  value={c.morningSlot?.endTime || '۱۱:۳۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].morningSlot = {
                                      ...(updated[idx].morningSlot || DEFAULT_MORNING_SLOT),
                                      endTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            {/* بخش دوم: نوبت عصر */}
                            <div
                              className={`p-3 rounded-xl border transition-all ${
                                c.afternoonSlot?.enabled
                                  ? 'bg-amber-950/20 border-amber-600/50 text-stone-200'
                                  : 'bg-stone-950/60 border-stone-850 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-300">
                                  <input
                                    type="checkbox"
                                    checked={c.afternoonSlot?.enabled ?? true}
                                    onChange={(e) => {
                                      const updated = [...ceremonies];
                                      updated[idx].afternoonSlot = {
                                        ...(updated[idx].afternoonSlot || DEFAULT_AFTERNOON_SLOT),
                                        enabled: e.target.checked,
                                      };
                                      setCeremonies(updated);
                                    }}
                                    className="w-4 h-4 accent-amber-500 rounded"
                                  />
                                  <Sunset className="w-3.5 h-3.5 text-orange-400" />
                                  <span>بخش دوم: نوبت عصر</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-stone-400">از</span>
                                <input
                                  type="text"
                                  disabled={!c.afternoonSlot?.enabled}
                                  value={c.afternoonSlot?.startTime || '۱۵:۰۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].afternoonSlot = {
                                      ...(updated[idx].afternoonSlot || DEFAULT_AFTERNOON_SLOT),
                                      startTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                                <span className="text-stone-400">تا</span>
                                <input
                                  type="text"
                                  disabled={!c.afternoonSlot?.enabled}
                                  value={c.afternoonSlot?.endTime || '۱۷:۰۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].afternoonSlot = {
                                      ...(updated[idx].afternoonSlot || DEFAULT_AFTERNOON_SLOT),
                                      endTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            {/* بخش سوم: نوبت شب */}
                            <div
                              className={`p-3 rounded-xl border transition-all ${
                                c.eveningSlot?.enabled
                                  ? 'bg-amber-950/20 border-amber-600/50 text-stone-200'
                                  : 'bg-stone-950/60 border-stone-850 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-300">
                                  <input
                                    type="checkbox"
                                    checked={c.eveningSlot?.enabled ?? true}
                                    onChange={(e) => {
                                      const updated = [...ceremonies];
                                      updated[idx].eveningSlot = {
                                        ...(updated[idx].eveningSlot || DEFAULT_EVENING_SLOT),
                                        enabled: e.target.checked,
                                      };
                                      setCeremonies(updated);
                                    }}
                                    className="w-4 h-4 accent-amber-500 rounded"
                                  />
                                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>بخش سوم: نوبت شب</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-stone-400">از</span>
                                <input
                                  type="text"
                                  disabled={!c.eveningSlot?.enabled}
                                  value={c.eveningSlot?.startTime || '۱۹:۳۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].eveningSlot = {
                                      ...(updated[idx].eveningSlot || DEFAULT_EVENING_SLOT),
                                      startTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                                <span className="text-stone-400">تا</span>
                                <input
                                  type="text"
                                  disabled={!c.eveningSlot?.enabled}
                                  value={c.eveningSlot?.endTime || '۲۱:۳۰'}
                                  onChange={(e) => {
                                    const updated = [...ceremonies];
                                    updated[idx].eveningSlot = {
                                      ...(updated[idx].eveningSlot || DEFAULT_EVENING_SLOT),
                                      endTime: e.target.value,
                                    };
                                    setCeremonies(updated);
                                  }}
                                  className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-center font-mono text-stone-200"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between text-[11px]">
                            <span className="text-stone-400">خلاصه برنامه انتخابی صاحب عزا:</span>
                            <span className="text-amber-300 font-medium">
                              {getMosqueSlotsSummary(c)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* دکمه‌های افزودن مجالس جدید */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCeremonies([
                    ...ceremonies,
                    {
                      id: `c-${Date.now()}`,
                      type: 'condolence_men',
                      title: 'مجلس فاتحه در مسجد',
                      locationName: isSunni ? 'مسجد جامع مرکزی' : 'مسجد و حسینیه اهل بیت (ع)',
                      date: 'فردا',
                      morningSlot: { enabled: true, label: 'صبح', startTime: '۰۹:۰۰', endTime: '۱۱:۳۰' },
                      afternoonSlot: { enabled: true, label: 'عصر', startTime: '۱۵:۰۰', endTime: '۱۷:۰۰' },
                      eveningSlot: { enabled: true, label: 'شب', startTime: '۱۹:۳۰', endTime: '۲۱:۳۰' },
                      startTime: 'صبح ۰۹:۰۰-۱۱:۳۰ | عصر ۱۵:۰۰-۱۷:۰۰ | شب ۱۹:۳۰-۲۱:۳۰',
                    },
                  ]);
                }}
                className="bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>+ افزودن مجلس مسجد (۳ نوبت)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCeremonies([
                    ...ceremonies,
                    {
                      id: `c-${Date.now()}`,
                      type: 'condolence_women',
                      title: 'مجلس تعزیت و ترحیم بانوان',
                      locationName: 'منزل متوفی',
                      deceasedHomeAddress: 'شهر انتخابی، منزل متوفی',
                      date: 'فردا',
                      startTime: '',
                      endTime: '',
                      notes: 'مجلس بانوان در منزل متوفی دایر بوده و تعیین ساعت ندارد.',
                    },
                  ]);
                }}
                className="bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-rose-400" />
                <span>+ افزودن مجلس بانوان (منزل متوفی)</span>
              </button>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <p className="leading-relaxed">
                اعلامیه شما با قالب انتخابی مستقیماً به میز بررسی مدیریت ارسال می‌گردد و انتشار سراسری تنها با تایید و مجوز مدیریت اپ صورت خواهد گرفت.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-stone-800 text-stone-300 text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                مرحله قبل
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                ثبت و ارسال به مدیریت جهت تایید
              </button>
            </div>
          </div>
        )}
      </form>

      {/* مدال استودیوی هوشمند قالب و پوستر ترحیم (Mini Canva) */}
      <MemorialTemplateStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialPhotoUrl={avatarUrl}
        initialFullName={firstNameLastName.trim() || 'محمد احمدی'}
        initialFatherName={fatherName}
        initialTitlePrefix={titlePrefix}
        initialConfig={templateConfig}
        onApplyConfig={(cfg, newPhotoUrl) => {
          setTemplateConfig(cfg);
          setSelectedFrameId(cfg.templateId); setPaymentId(null); setIsPaidSuccess(false);
          setAvatarUrl(newPhotoUrl);
        }}
      />

      {/* مدال پین و ثبت موقعیت دقیق روی نقشه با Geolocation و GPS */}
      {mapTargetCeremonyId && (
        <CeremonyMapPickerModal
          isOpen={true}
          onClose={() => setMapTargetCeremonyId(null)}
          initialTitle={ceremonies.find(c => c.id === mapTargetCeremonyId)?.locationName || ''}
          initialAddress={
            ceremonies.find(c => c.id === mapTargetCeremonyId)?.deceasedHomeAddress ||
            ceremonies.find(c => c.id === mapTargetCeremonyId)?.customAddress ||
            ''
          }
          initialLat={ceremonies.find(c => c.id === mapTargetCeremonyId)?.lat}
          initialLng={ceremonies.find(c => c.id === mapTargetCeremonyId)?.lng}
          initialType={
            ceremonies.find(c => c.id === mapTargetCeremonyId)?.type === 'burial'
              ? 'cemetery'
              : ceremonies.find(c => c.id === mapTargetCeremonyId)?.type === 'condolence_women'
              ? 'hall'
              : 'mosque'
          }
          onLocationPinned={handleLocationPinned}
        />
      )}
    </div>
  );
};

