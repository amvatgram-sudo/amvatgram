import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  CheckCircle2, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  FileCheck2,
  Globe,
  ArrowRight,
  Sparkles,
  Check,
  Copy,
  Clock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Madhhab, UserRole } from '../types';
import { SUPPORTED_COUNTRIES, AppLanguage, getTranslation } from '../utils/i18n';
import { api } from '../services/api';

interface AuthViewProps {
  forceOwnerFlow?: boolean;
}

type AuthProvider = 'google' | 'telegram' | 'whatsapp' | 'sms' | 'email';

export const AuthView: React.FC<AuthViewProps> = ({ forceOwnerFlow = false }) => {
  const { loginUser, setCurrentView, language, setLanguage, appearance } = useApp();

  const [authType, setAuthType] = useState<'user' | 'owner'>(forceOwnerFlow ? 'owner' : 'user');
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider>('sms');
  
  // انتخاب کشور و پیش‌شماره بین‌المللی
  const [selectedCountry, setSelectedCountry] = useState(SUPPORTED_COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // انتخاب عکس پروفایل کاربری در ثبت‌نام (بند ۹)
  const [selectedMadhhab, setSelectedMadhhab] = useState<Madhhab>('sunni');

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAvatarUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  // فاز تأیید پیامکی و شبکه‌های اجتماعی
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [error, setError] = useState('');

  // شبیه‌ساز نوتیفیکیشن زنده ورودی

  // احراز هویت اختصاصی صاحب عزا
  const [ownerNationalCode, setOwnerNationalCode] = useState('');
  const [deceasedNationalCode, setDeceasedNationalCode] = useState('');
  const [ownerRelation, setOwnerRelation] = useState('فرزند (پسر)');
  const [isVerifying, setIsVerifying] = useState(false);

  // تایمر شمارش معکوس برای ارسال مجدد کد
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const fullInternationalPhone = `${selectedCountry.code} ${phoneNumber.replace(/\s+/g, '')}`;

  // زبان‌های قابل انتخاب
  const languagesList: { id: AppLanguage; label: string; flag: string }[] = [
    { id: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { id: 'ku', label: 'کوردی (سۆرانی)', flag: '☀️' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  // امنیت: OTP و احراز هویت مالک باید سمت سرور انجام شوند.
  // این UI عمداً تا اتصال Backend واقعی اجازه ورود نمی‌دهد تا OTP جعلی یا قابل مشاهده در Bundle وجود نداشته باشد.
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (selectedProvider === 'google') {
      setError('ورود با Google OAuth هنوز به Provider رسمی متصل نشده است؛ فعلاً SMS، Email، Telegram یا WhatsApp را انتخاب کنید.');
      return;
    }
    const destination = selectedProvider === 'email' ? emailAddress : selectedProvider === 'telegram' ? (telegramId || fullInternationalPhone) : fullInternationalPhone;
    setIsSendingCode(true);
    try {
      await api.requestOtp({ provider: selectedProvider, destination, fullName, madhhab: selectedMadhhab });
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ارسال کد تأیید ناموفق بود.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    const destination = selectedProvider === 'email' ? emailAddress : selectedProvider === 'telegram' ? (telegramId || fullInternationalPhone) : fullInternationalPhone;
    setIsSendingCode(true);
    setError('');
    try {
      await api.requestOtp({ provider: selectedProvider, destination, fullName, madhhab: selectedMadhhab });
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ارسال مجدد کد ناموفق بود.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleCopyOtp = () => undefined;
  const handleAutoFillOtp = () => undefined;

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const destination = selectedProvider === 'email' ? emailAddress : selectedProvider === 'telegram' ? (telegramId || fullInternationalPhone) : fullInternationalPhone;
    setIsVerifying(true);
    try {
      const result = await api.verifyOtp({ provider: selectedProvider, destination, code: otpCode, fullName, madhhab: selectedMadhhab });
      const user = result.user;
      loginUser({
        id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, role: user.role,
        madhhab: user.madhhab, isVerified: user.isVerified, createdAt: user.createdAt || new Date().toISOString()
      });

      if (authType === 'owner') {
        const verification = await api.ownerVerification({
          ownerNationalCode: ownerNationalCode,
          deceasedNationalCode: deceasedNationalCode,
          ownerRelation,
        });
        if (verification.verification.status === 'pending') {
          setError('درخواست احراز صاحب عزا ثبت شد و تا بررسی Backend در وضعیت «در انتظار بررسی» قرار دارد. نقش صاحب عزا تا تأیید واقعی تغییر نمی‌کند.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تأیید کد ناموفق بود.');
    } finally {
      setIsVerifying(false);
    }
  };

  // دریافت اطلاعات نمایشی کانال ارسال
  const getProviderInfo = (prov: AuthProvider) => {
    switch (prov) {
      case 'google':
        return {
          title: getTranslation('providerGoogle', language),
          senderName: 'Google Security',
          bgBadge: 'bg-red-500/20 text-red-300 border-red-500/40',
          notificationDesc: (code: string) => `کد تأیید یکبار مصرف Google برای ورود به امواتگرام: ${code}`,
        };
      case 'telegram':
        return {
          title: getTranslation('providerTelegram', language),
          senderName: 'Telegram Service',
          bgBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          notificationDesc: (code: string) => `کد احراز هویت ورود شما به امواتگرام در تلگرام: ${code}`,
        };
      case 'whatsapp':
        return {
          title: getTranslation('providerWhatsApp', language),
          senderName: 'WhatsApp Business',
          bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          notificationDesc: (code: string) => `Amvatgram Verification Code sent via WhatsApp: ${code}`,
        };
      case 'email':
        return {
          title: getTranslation('providerEmail', language),
          senderName: 'Amvatgram Mailer',
          bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          notificationDesc: (code: string) => `کد امنیتی ورود ایمیل امواتگرام: ${code}`,
        };
      case 'sms':
      default:
        return {
          title: getTranslation('providerSms', language),
          senderName: 'سامانه پیامکی امواتگرام',
          bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          notificationDesc: (code: string) => `کد تأیید ورود شما: ${code}. از در اختیار گذاشتن آن به دیگران خودداری فرمایید.`,
        };
    }
  };

  const isLtr = language === 'en' || language === 'tr';

  return (
    <div 
      dir={isLtr ? 'ltr' : 'rtl'}
      className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-['Vazirmatn']"
    >
      {/* هاله‌های نوری پس‌زمینه */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* بنر / توست شبیه‌ساز پیامک و پیام دریافتی واقعی */}
      

      <div className="max-w-xl w-full bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative z-10 space-y-5">
        
        {/* نوار انتخاب زبان برنامه در بالای کارت ورود (بند ۱ کاربر) */}
        <div className="bg-stone-950/90 border border-stone-800 p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium">{getTranslation('loginLanguageNotice', language)}</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto justify-center scrollbar-none py-0.5">
            {languagesList.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                className={`text-[11px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap ${
                  language === lang.id
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/60 scale-105'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* هدر رسمی و آیکون باکیفیت امواتگرام */}
        <div className="text-center pt-1">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-amber-600/50 shadow-2xl mx-auto mb-3 bg-stone-950 p-1">
            <img
              src={appearance?.appLogoUrl || '/assets/app-logo.jpg'}
              alt={getTranslation('appName', language)}
              className="w-full h-full object-cover rounded-2xl shadow-inner"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/app-logo.jpg';
              }}
            />
          </div>

          <h1 className="text-xl font-black text-stone-100 flex items-center justify-center gap-2">
            <span>{getTranslation('appName', language)}</span>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 font-sans tracking-wide">
              Global Portal
            </span>
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            {getTranslation('loginSubtitle', language)}
          </p>
        </div>

        {/* سوییچ تب بین کاربر عادی و صاحب عزا */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-950 rounded-2xl border border-stone-800">
          <button
            type="button"
            onClick={() => {
              setAuthType('user');
              setStep('form');
              setError('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authType === 'user'
                ? 'bg-stone-850 text-amber-400 shadow-md border border-stone-700 font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {getTranslation('loginTabUser', language)}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthType('owner');
              setStep('form');
              setError('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authType === 'owner'
                ? 'bg-amber-600 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{getTranslation('loginTabOwner', language)}</span>
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {/* انتخاب مذهب جهت تفکیک آداب */}
            <div>
              <label className="text-xs text-stone-200 block mb-2 font-bold">
                {getTranslation('chooseMadhhab', language)}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMadhhab('sunni')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    selectedMadhhab === 'sunni'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xs font-black block text-emerald-300">
                    {getTranslation('sunniTitle', language)}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1 block leading-relaxed">
                    {getTranslation('sunniDesc', language)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMadhhab('shia')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    selectedMadhhab === 'shia'
                      ? 'bg-blue-950/70 border-blue-500 text-blue-200 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/50'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xs font-black block text-blue-300">
                    {getTranslation('shiaTitle', language)}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1 block leading-relaxed">
                    {getTranslation('shiaDesc', language)}
                  </span>
                </button>
              </div>
            </div>

            {/* بخش انتخاب آیکون‌های رسمی شبکه‌های اجتماعی برای لاگین (بند ۲ و ۳ کاربر) */}
            <div className="bg-stone-950 p-3.5 sm:p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-300 font-bold">
                  {getTranslation('selectLoginMethod', language)}
                </span>
                <span className="text-[10px] text-amber-500 font-mono">
                  {getProviderInfo(selectedProvider).title}
                </span>
              </div>

              {/* شبکه آیکون‌های معتبر و اصلی شبکه‌های اجتماعی */}
              <div className="grid grid-cols-5 gap-2">
                {/* ۱. گوگل Google با آیکون چهاررنگ رسمی */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider('google');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedProvider === 'google'
                      ? 'bg-red-950/50 border-red-500 shadow-md shadow-red-950 text-stone-100 ring-1 ring-red-500/50'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title="Google Account"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-[10px] font-bold truncate">Google</span>
                </button>

                {/* ۲. تلگرام Telegram با آیکون هواپیمای کاغذی رسمی */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider('telegram');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedProvider === 'telegram'
                      ? 'bg-sky-950/50 border-sky-400 shadow-md shadow-sky-950 text-stone-100 ring-1 ring-sky-400/50'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title="Telegram"
                >
                  <svg className="w-5 h-5 text-[#2AABEE] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
                  </svg>
                  <span className="text-[10px] font-bold truncate">Telegram</span>
                </button>

                {/* ۳. واتس‌اپ WhatsApp با آیکون سبز رسمی */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider('whatsapp');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedProvider === 'whatsapp'
                      ? 'bg-emerald-950/50 border-emerald-400 shadow-md shadow-emerald-950 text-stone-100 ring-1 ring-emerald-400/50'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 text-[#25D366] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.2 1.25-1.66 1.33-.44.07-.99.1-3.21-.81-2.47-1.02-4.04-3.56-4.16-3.72-.12-.17-1-1.33-1-2.54 0-1.21.63-1.81.85-2.05.23-.24.5-.3.67-.3.17 0 .34 0 .49.01.16.01.37-.06.58.44.22.52.74 1.8.8 1.93.07.13.11.29.02.46-.08.17-.13.27-.26.42-.13.15-.27.33-.39.45-.13.12-.26.26-.11.52.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.09 1.28.26.13.41.11.56-.06.15-.17.65-.76.82-1.02.17-.26.35-.22.59-.13.24.09 1.51.71 1.77.84.26.13.43.19.49.3.06.11.06.66-.18 1.34z" />
                  </svg>
                  <span className="text-[10px] font-bold truncate">WhatsApp</span>
                </button>

                {/* ۴. پیامک تلفن همراه SMS */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider('sms');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedProvider === 'sms'
                      ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-950 text-stone-100 ring-1 ring-amber-500/50'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title="SMS"
                >
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                    <path d="M8 6h8M8 10h5" />
                  </svg>
                  <span className="text-[10px] font-bold truncate">SMS</span>
                </button>

                {/* ۵. ایمیل مستقیم Email */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider('email');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedProvider === 'email'
                      ? 'bg-purple-950/50 border-purple-400 shadow-md shadow-purple-950 text-stone-100 ring-1 ring-purple-400/50'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                  title="Email"
                >
                  <svg className="w-5 h-5 text-purple-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span className="text-[10px] font-bold truncate">Email</span>
                </button>
              </div>
            </div>

            {/* انتخاب عکس پروفایل کاربری (بند ۹ خواسته کاربر) */}
            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-stone-200 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>انتخاب عکس پروفایل کاربری (اختیاری)</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">Profile Photo</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-stone-900 border-2 border-stone-750 overflow-hidden flex items-center justify-center text-stone-400 flex-shrink-0 shadow-inner">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-750 text-stone-200 text-[11px] font-bold cursor-pointer border border-stone-700 transition-colors">
                    <span>📷 بارگذاری عکس از گالری</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>

                  {/* آواتارهای پیش‌فرض سریع */}
                  <div className="flex items-center gap-1 pt-1">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
                    ].map((sampleUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(sampleUrl)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          avatarUrl === sampleUrl ? 'border-amber-400 scale-110 shadow' : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={sampleUrl} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="text-[10px] text-rose-400 hover:text-rose-300 mr-1"
                        title="حذف عکس"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* نام و نام خانوادگی */}

            <div>
              <label className="text-xs text-stone-300 block mb-1 font-medium">
                {getTranslation('fullNameLabel', language)}
              </label>
              <input
                type="text"
                required
                placeholder={getTranslation('fullNamePlaceholder', language)}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none transition-colors"
              />
            </div>

            {/* فیلد ورودی شماره تلفن برای SMS، واتس‌اپ و تلگرام */}
            {(selectedProvider === 'sms' || selectedProvider === 'whatsapp' || selectedProvider === 'telegram') && (
              <div>
                <label className="text-xs text-stone-300 block mb-1 font-medium">
                  {selectedProvider === 'whatsapp' 
                    ? 'شماره تماس واتس‌اپ جهت دریافت کد تأیید *' 
                    : selectedProvider === 'telegram'
                    ? 'شماره تماس متصل به حساب تلگرام *'
                    : getTranslation('phoneLabel', language)}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = SUPPORTED_COUNTRIES.find((c) => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="bg-stone-950 border border-stone-800 rounded-xl px-2 py-2.5 text-xs text-stone-100 outline-none"
                  >
                    {SUPPORTED_COUNTRIES.map((c, i) => (
                      <option key={i} value={c.code}>
                        {c.flag} {c.code} ({c.name[language] || c.name.fa})
                      </option>
                    ))}
                  </select>

                  <div className="col-span-2 sm:col-span-3">
                    <input
                      type="tel"
                      required
                      placeholder="918..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* فیلد آیدی تلگرام اختیاری */}
            {selectedProvider === 'telegram' && (
              <div>
                <label className="text-xs text-stone-400 block mb-1 font-normal">
                  {getTranslation('telegramInputLabel', language)} (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="@your_telegram_id"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none font-mono"
                  dir="ltr"
                />
              </div>
            )}

            {/* فیلد ایمیل برای Google و Email */}
            {(selectedProvider === 'google' || selectedProvider === 'email') && (
              <div>
                <label className="text-xs text-stone-300 block mb-1 font-medium">
                  {selectedProvider === 'google' ? 'آدرس جیمیل / حساب گوگل *' : getTranslation('emailInputLabel', language)}
                </label>
                <input
                  type="email"
                  required
                  placeholder={selectedProvider === 'google' ? 'example@gmail.com' : 'user@example.com'}
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none font-mono"
                  dir="ltr"
                />
              </div>
            )}

            {/* فیلدهای اختصاصی صاحب عزا جهت استعلام اصالت و جلوگیری از اعلامیه جعلی */}
            {authType === 'owner' && (
              <div className="bg-amber-950/20 border border-amber-800/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{getTranslation('ownerVerificationTitle', language)}</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  {getTranslation('ownerVerificationDesc', language)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-stone-300 block mb-1 font-medium">
                      {getTranslation('ownerNationalCodeLabel', language)}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="شناسه ملی ثبت‌کننده"
                      value={ownerNationalCode}
                      onChange={(e) => setOwnerNationalCode(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 font-mono outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1 font-medium">
                      {getTranslation('deceasedNationalCodeLabel', language)}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="شناسه ملی متوفی"
                      value={deceasedNationalCode}
                      onChange={(e) => setDeceasedNationalCode(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 font-mono outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 block mb-1 text-xs font-medium">
                    {getTranslation('ownerRelationLabel', language)}
                  </label>
                  <select
                    value={ownerRelation}
                    onChange={(e) => setOwnerRelation(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="فرزند (پسر)">فرزند (پسر)</option>
                    <option value="فرزند (دختر)">فرزند (دختر)</option>
                    <option value="پدر متوفی">پدر متوفی</option>
                    <option value="مادر متوفی">مادر متوفی</option>
                    <option value="برادر متوفی">برادر متوفی</option>
                    <option value="خواهر متوفی">خواهر متوفی</option>
                    <option value="همسر متوفی">همسر متوفی</option>
                    <option value="داماد متوفی">داماد متوفی</option>
                    <option value="عروس متوفی">عروس متوفی</option>
                    <option value="نوه متوفی">نوه متوفی</option>
                  </select>
                </div>
              </div>
            )}

            {error && <p className="text-xs text-rose-400 text-center font-medium bg-rose-950/40 p-2 rounded-xl border border-rose-900">{error}</p>}

            {/* دکمه ارسال کد تأیید ورود */}
            <button
              type="submit"
              disabled={isSendingCode || isVerifying}
              className={`w-full text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                authType === 'owner'
                  ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-amber-950/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
              }`}
            >
              {isSendingCode || isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  <span>{getTranslation('sendingOtpButton', language)}</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>
                    {getTranslation('sendOtpButton', language)} ({getProviderInfo(selectedProvider).title})
                  </span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* مرحله دوم: ورود کد تأیید OTP فرستاده شده */
          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center space-y-2">
              <span className="text-xs text-stone-400 block">
                {getTranslation('otpSentNotice', language)}
              </span>
              
              <div className="flex items-center justify-center gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${getProviderInfo(selectedProvider).bgBadge}`}>
                  {getProviderInfo(selectedProvider).title}
                </span>
                <span className="font-mono text-amber-300 text-sm font-bold" dir="ltr">
                  {(selectedProvider === 'sms' || selectedProvider === 'whatsapp' || (selectedProvider === 'telegram' && phoneNumber))
                    ? fullInternationalPhone
                    : emailAddress || telegramId}
                </span>
              </div>

              {/* کادر اعلان کد شبیه‌ساز دریافتی */}
              <div className="mt-2 text-xs bg-stone-900 py-2.5 px-3 rounded-xl border border-amber-600/40 flex items-center justify-between">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  کد تأیید فقط از سرویس احراز هویت امن دریافت می‌شود و در رابط کاربری نمایش داده نخواهد شد.
                </span>

                <span className="text-[10px] text-stone-500 whitespace-nowrap">ارسال‌شده توسط سرویس احراز هویت</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-300 block mb-1.5 font-medium text-center">
                {getTranslation('enterOtpCode', language)}
              </label>
              <input
                type="text"
                required
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="______"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl py-3 text-center text-2xl tracking-[0.5em] text-stone-100 font-mono outline-none shadow-inner"
                dir="ltr"
              />
            </div>

            {/* شمارش معکوس و ارسال مجدد */}
            <div className="flex items-center justify-between text-xs px-1 text-stone-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {canResend ? (
                    <span className="text-emerald-400">امکان ارسال مجدد فعال است</span>
                  ) : (
                    <span>
                      {getTranslation('resendWait', language)} {countdown} {getTranslation('seconds', language)}
                    </span>
                  )}
                </span>
              </div>

              <button
                type="button"
                disabled={!canResend}
                onClick={handleResendOtp}
                className={`flex items-center gap-1 transition-colors cursor-pointer ${
                  canResend 
                    ? 'text-amber-400 hover:text-amber-300 font-bold' 
                    : 'text-stone-600 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{getTranslation('resendCode', language)}</span>
              </button>
            </div>

            {error && <p className="text-xs text-rose-400 text-center font-medium bg-rose-950/40 p-2 rounded-xl border border-rose-900">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                }}
                className="w-1/3 bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs py-3 rounded-xl font-medium cursor-pointer transition-colors"
              >
                {getTranslation('editInfo', language)}
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-950 cursor-pointer"
              >
                {getTranslation('verifyAndLogin', language)}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* پاورقی با اشاره به نماد شهر شهر انتخابی و استان مناطق تحت پوشش با ترجمه پویا */}
      <div className="mt-8 text-center text-xs text-stone-400 max-w-md space-y-1">
        <p className="font-medium text-stone-300">
          {getTranslation('appName', language)} {getTranslation('copyrightText', language)}
        </p>
        <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <span>{getTranslation('originGlobalPlatform', language)}</span>
        </p>
      </div>
    </div>
  );
};

