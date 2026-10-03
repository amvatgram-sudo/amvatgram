import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Eye, 
  EyeOff, 
  Activity, 
  Building2, 
  ExternalLink, 
  LogOut,
  ArrowRight,
  Search,
  UserCheck,
  CreditCard,
  Palette,
  DollarSign,
  Plus,
  Edit2,
  Save,
  Check,
  Crown, 
  SlidersHorizontal,
  Menu,
  X,
  Map as MapIcon
} from 'lucide-react';
import { GriefAd, PaymentTransaction } from '../types';
import { PosterFrame, FrameTier, AgeGroup } from '../data/memorialFrames';
import { getMosqueSlotsSummary } from '../utils/ceremonyHelpers';
import { FramedPhoto } from './FramedPhoto';
import { AdminAppearanceStudio } from './AdminAppearanceStudio';
import { ThemeManager } from './ThemeManager';
import { CeremonyMapPickerModal } from './CeremonyMapPickerModal';
import { api } from '../services/api';

export const DedicatedAdminPortal: React.FC = () => {
  const { 
    ads, 
    approvedAds, 
    pendingAds, 
    approveAd, 
    rejectAd, 
    deleteAd,
    emergencyKillAd, 
    locations, 
    addLocation, 
    auditLogs,
    setCurrentView,
    setRole,
    frames,
    updateFramePrice,
    addFrame,
    deleteFrame,
    transactions,
    verifyTransaction,
    appearance 
  } = useApp();

  // لایه احراز هویت انحصاری کنسول مدیریت
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [masterKey, setMasterKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState('');

  // استیت‌های تب‌های کنسول سازنده
  const [activeTab, setActiveTab] = useState<'pending' | 'appearance' | 'theme_manager' | 'payments' | 'frames' | 'approved' | 'locations' | 'logs'>('pending');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isMapPickerModalOpen, setIsMapPickerModalOpen] = useState(false);
  const [rejectingAdId, setRejectingAdId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // فیلتر پرداختی‌ها
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'successful' | 'failed'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // ویرایش قیمت قالب‌ها
  const [editingFrameId, setEditingFrameId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);

  // افزودن قالب جدید توسط سازنده
  const [showAddFrameModal, setShowAddFrameModal] = useState(false);
  const [newFrameTitle, setNewFrameTitle] = useState('');
  const [newFramePrice, setNewFramePrice] = useState<number>(0);
  const [newFrameCategory, setNewFrameCategory] = useState('');
  const [newFrameTier, setNewFrameTier] = useState<FrameTier>('economy');
  const [newFrameAgeGroup, setNewFrameAgeGroup] = useState<AgeGroup>('all');
  const [newFrameOrnament, setNewFrameOrnament] = useState<'ribbon_black' | 'islamic_gold' | 'flower_lily' | 'candleglow' | 'dove_peace'>('candleglow');
  const [newFrameSubtitle, setNewFrameSubtitle] = useState('یادبود ماندگار');
  const [newFrameDesc, setNewFrameDesc] = useState('');

  // فرم افزودن مسجد جدید
  const [newMosqueName, setNewMosqueName] = useState('');
  const [newMosqueNeighborhood, setNewMosqueNeighborhood] = useState('');
  const [newMosqueAddress, setNewMosqueAddress] = useState('');
  const [newMosqueKhadem, setNewMosqueKhadem] = useState('');
  const [newMosqueType, setNewMosqueType] = useState<'mosque' | 'cemetery' | 'hussainiya'>('mosque');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const username = window.prompt('نام کاربری مدیر را وارد کنید:') || '';
      if (!username) return;
      const result = await api.adminLogin({ username, password: masterKey });
      if (result.user.role !== 'super_admin' && result.user.role !== 'moderator') throw new Error('FORBIDDEN');
      setIsAuthenticated(true);
      setRole(result.user.role === 'super_admin' ? 'super_admin' : 'moderator');
    } catch (err) {
      setAuthError(err instanceof Error && err.message !== 'FORBIDDEN' ? err.message : 'ورود مدیر ناموفق بود.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setRole('user');
    window.history.pushState({}, '', '/');
    setCurrentView('home');
  };

  const handleConfirmReject = (adId: string) => {
    if (!rejectionReason.trim()) return;
    rejectAd(adId, rejectionReason);
    setRejectingAdId(null);
    setRejectionReason('');
  };

  const handleSavePrice = async (frameId: string) => {
    try {
      await updateFramePrice(frameId, newPriceInput);
      setEditingFrameId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'ذخیره قیمت انجام نشد.');
    }
  };

  const handleCreateNewFrame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrameTitle) return;

    const newFrameObj: PosterFrame = {
      id: `frame-${Date.now()}`,
      title: newFrameTitle,
      tier: newFrameTier,
      priceToman: Number(newFramePrice),
      ageGroup: newFrameAgeGroup,
      categoryTitle: newFrameCategory || 'طرح اختصاصی مدیریت',
      badgeText: newFramePrice === 0 ? 'رایگان' : 'ویژه',
      borderStyle: newFrameTier === 'luxury' ? 'border-4 border-amber-400 shadow-2xl shadow-amber-900/60' : 'border-3 border-stone-700 shadow-lg',
      overlayGradient: 'from-stone-950 via-stone-900/40 to-black/50',
      cornerOrnament: newFrameOrnament,
      bannerSubtitle: newFrameSubtitle,
      description: newFrameDesc || 'قالب اختصاصی ایجاد شده توسط مدیریت سامانه',
    };

    addFrame(newFrameObj);
    setShowAddFrameModal(false);
    setNewFrameTitle('');
    setNewFramePrice(0);
    setNewFrameDesc('');
  };

  const handleAddMosque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMosqueName) return;

    addLocation({
      id: `loc-${Date.now()}`,
      name: newMosqueName,
      city: 'مرکزی',
      neighborhood: newMosqueNeighborhood || 'مرکزی',
      address: newMosqueAddress || newMosqueName,
      lat: 35.6892 + (Math.random() - 0.5) * 0.05,
      lng: 51.3890 + (Math.random() - 0.5) * 0.05,
      khademPhone: newMosqueKhadem,
      type: newMosqueType,
    });

    setNewMosqueName('');
    setNewMosqueNeighborhood('');
    setNewMosqueAddress('');
    setNewMosqueKhadem('');
  };

  // فیلتر پرداختی‌ها
  const filteredTransactions = transactions.filter((tx) => {
    const matchStatus = paymentFilter === 'all' || tx.status === paymentFilter;
    const matchQuery = 
      tx.userFullName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      tx.userPhone.includes(paymentSearch) ||
      tx.trackingCode.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      (tx.deceasedName && tx.deceasedName.toLowerCase().includes(paymentSearch.toLowerCase()));
    return matchStatus && matchQuery;
  });

  const totalSuccessfulRevenue = transactions
    .filter((tx) => tx.status === 'successful')
    .reduce((sum, tx) => sum + tx.amountToman, 0);

  // ۱. صفحه لاگین ایمن و اختصاصی کنسول - کاملاً فیت موبایل
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-3 sm:px-4 py-6 sm:py-8 font-['Vazirmatn'] selection:bg-rose-500/30 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-950 border border-rose-900/50 flex items-center justify-center text-rose-500 mx-auto mb-4 shadow-xl">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-900 inline-block mb-2 font-bold">
              AMVATGRAM MASTER SECURITY GATE
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-100">
              درگاه امنیتی مدیریت کل و بازبینی آگهی‌ها
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1">
              دسترسی به این بخش منحصراً با کلید رمزنگاری‌شده سازنده مقدور است
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs text-stone-300 block mb-1.5 font-medium">
                کلید امنیتی سازنده (Master Key)
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="کد محرمانه مدیریت..."
                  value={masterKey}
                  onChange={(e) => {
                    setMasterKey(e.target.value);
                    setAuthError('');
                  }}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-stone-100 outline-none font-mono tracking-wider"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute left-3 top-3 text-stone-500 hover:text-stone-300 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-xs text-rose-400 mt-2 font-medium">{authError}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  setRole('user');
                  setCurrentView('home');
                }}
                className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs py-3 rounded-xl font-bold transition-colors cursor-pointer"
              >
                بازگشت به اپ
              </button>
              <button
                type="submit"
                className="w-2/3 bg-rose-600 hover:bg-rose-500 text-white text-xs py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-950 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>احراز هویت و ورود</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800/80 text-center text-[10px] text-stone-500">
            احراز هویت پنل مدیریت فقط از طریق Backend امن انجام می‌شود.
          </div>
        </div>
      </div>
    );
  }

  // ۲. کنسول اصلی مدیریت - کاملاً ریسپانسیو و فیت در انواع گوشی‌ها
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-['Vazirmatn'] selection:bg-rose-500/30 w-full max-w-full overflow-x-hidden">
      {/* سربرگ کنسول سازنده - فیت موبایل */}
      <header className="bg-stone-900 border-b border-stone-800 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-40 w-full max-w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-base font-black text-stone-100">کنسول مدیریت امواتگرام</h1>
                  <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800 font-mono font-bold">
                    MASTER
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 hidden xs:block">
                  پایش سراسری، بررسی آگهی‌ها، فروش قالب و پرداختی‌ها
                </p>
              </div>
            </div>

            {/* دکمه منوی همبرگری برای مدیریت آسان و سریع در کنسول سازنده (بند ۴ خواسته کاربر) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHamburgerOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="منوی همبرگری مدیریت سریع"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">منوی مدیریت سریع</span>
              </button>

              <button
                onClick={handleAdminLogout}
                className="sm:hidden text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setRole('user');
                setCurrentView('home');
              }}
              className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مشاهده ظاهر اپلیکیشن</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
              title="خروج کامل و بی‌اثر شدن ردی در اپلیکیشن"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج امن (بدون ردپا)</span>
            </button>
          </div>
        </div>

        {/* منوی همبرگری دراور کشویی کنسول سازنده (بند ۴ خواسته کاربر) */}
        {isHamburgerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* لایه پشت پرده تیره */}
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsHamburgerOpen(false)}
            />

            {/* محتوای دراور همبرگری */}
            <div className="relative w-80 max-w-[85vw] bg-stone-900 border-l border-stone-800 h-full p-5 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto animate-fadeIn">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                      <Menu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-100">منوی مدیریت سازنده</h3>
                      <span className="text-[10px] text-amber-400 font-mono">Master Navigation</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsHamburgerOpen(false)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* بخش تب‌های اصلی */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-stone-400 font-bold block mb-1">بخش‌های مدیریتی:</span>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('pending');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'pending'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>صف بررسی آگهی‌ها</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-amber-400 font-mono">
                      {pendingAds.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('approved');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'approved'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>آگهی‌های فعال و منتشرشده</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-emerald-400 font-mono">
                      {approvedAds.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('appearance');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'appearance'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-amber-300'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>ویرایش ظاهر و استودیو</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('theme_manager');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'theme_manager'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-sky-300'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                    <span>مدیریت تم‌ها (ThemeManager)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('locations');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'locations'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-400" />
                      <span>مدیریت مساجد و آرامستان‌ها</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-300 font-mono">
                      {locations.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('payments');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'payments'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>تراکنش‌ها و پرداختی‌ها</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-emerald-400 font-mono">
                      {transactions.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('frames');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'frames'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>مدیریت قالب‌های پوستر</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-amber-400 font-mono">
                      {frames.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('logs');
                      setIsHamburgerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === 'logs'
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950/70 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-400" />
                      <span>لاگ‌های امنیتی سامانه</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-rose-400 font-mono">
                      {auditLogs.length}
                    </span>
                  </button>
                </div>

                {/* دکمه عملیات سریع: افزودن مسجد با نقشه */}
                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <span className="text-[10px] text-stone-400 font-bold block">عملیات سریع:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHamburgerOpen(false);
                      setIsMapPickerModalOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>📍 افزودن مسجد با نقشه GPS</span>
                  </button>
                </div>
              </div>

              {/* دکمه‌های پایینی دراور */}
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsHamburgerOpen(false);
                    window.history.pushState({}, '', '/');
                    setRole('user');
                    setCurrentView('home');
                  }}
                  className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>مشاهده وب‌اپلیکیشن</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsHamburgerOpen(false);
                    handleAdminLogout();
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج امن از پنل سازنده</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 w-full max-w-full overflow-x-hidden">
        {/* کارت‌های شاخص آماری در موبایل به صورت ۲ ستونه و در تبلت ۴ ستونه کاملاً ریسپانسیو */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-stone-400 block mb-0.5">در صف بررسی</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{pendingAds.length}</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-stone-400 block mb-0.5">درآمد فروش قالب</span>
              <span className="text-base sm:text-xl font-black text-emerald-400 font-mono">
                {totalSuccessfulRevenue.toLocaleString('fa-IR')} <span className="text-[9px] font-normal">ت</span>
              </span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-stone-400 block mb-0.5">تعداد کل قالب‌ها</span>
              <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">{frames.length}</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-950/60 border border-sky-800 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-stone-400 block mb-0.5">رویدادهای امنیتی</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">{auditLogs.length}</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* منوی تب‌های مدیریتی کنسول با اسکرول افقی نرم و چیپ‌های فیت در موبایل */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-stone-800 pb-2.5 overflow-x-auto scrollbar-none w-full max-w-full">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>صف بررسی ({pendingAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'appearance'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg font-black'
                : 'bg-stone-900 text-amber-400/90 hover:text-amber-300 border border-amber-900/30'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>ویرایش ظاهر و هویت بصری</span>
          </button>

          <button
            onClick={() => setActiveTab('theme_manager')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'theme_manager'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-stone-950 shadow-lg font-black'
                : 'bg-stone-900 text-sky-400 hover:text-sky-300 border border-sky-900/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>مدیریت تم‌ها (ThemeManager)</span>
          </button>


          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'payments'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>پرداختی‌ها ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('frames')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'frames'
                ? 'bg-amber-600 text-stone-950 shadow-md font-black'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>مدیریت قالب‌ها ({frames.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'approved'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700 shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>آگهی‌های فعال ({approvedAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'locations'
                ? 'bg-stone-800 text-sky-400 border border-stone-700 shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>مساجد</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'logs'
                ? 'bg-stone-800 text-rose-400 border border-stone-700 shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>رادار امنیتی</span>
          </button>
        </div>

        {/* تب اختصاصی ویرایش ظاهر و هویت بصری توسط سازنده و مدیریت */}
        {activeTab === 'appearance' && (
          <AdminAppearanceStudio />
        )}

        {/* تب اختصاصی مدیریت تم‌ها و متغیرهای سراسری CSS (ThemeManager) */}
        {activeTab === 'theme_manager' && (
          <ThemeManager />
        )}


        {/* ۱. تب صف آگهی‌های در انتظار بررسی */}
        {activeTab === 'pending' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            {pendingAds.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-200">تمام آگهی‌ها بررسی شده‌اند</h3>
                <p className="text-xs text-stone-400 mt-1">
                  در حال حاضر هیچ آگهی جدیدی در صف تایید قرار ندارد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                {pendingAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-stone-900 border border-amber-600/40 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 w-full overflow-hidden"
                  >
                    <div className="flex items-start justify-between border-b border-stone-800 pb-3 sm:pb-4 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-bold block mb-1">
                          {ad.trackingCode}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-stone-100 truncate">
                          {ad.deceased.titlePrefix} {ad.deceased.fullName}
                        </h3>
                        <p className="text-xs text-stone-400">فرزند: {ad.deceased.fatherName}</p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        ad.deceased.madhhab === 'sunni'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {ad.deceased.madhhab === 'sunni' ? 'اهل سنت' : 'اهل تشیع'}
                      </span>
                    </div>

                    <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">نسبت ثبت‌کننده:</span>
                        <span className="text-stone-200 font-bold">{ad.ownerRelation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">تلفن هماهنگی:</span>
                        <span className="font-mono text-stone-200" dir="ltr">{ad.ownerPhone}</span>
                      </div>
                      {ad.ownerNationalCode && (
                        <div className="flex items-center justify-between text-stone-300">
                          <span className="text-stone-400">کدملی صاحب عزا:</span>
                          <span className="font-mono text-amber-400">{ad.ownerNationalCode}</span>
                        </div>
                      )}
                      {ad.deceasedNationalCode && (
                        <div className="flex items-center justify-between text-stone-300">
                          <span className="text-stone-400">کدملی متوفی:</span>
                          <span className="font-mono text-emerald-400">{ad.deceasedNationalCode}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs space-y-1 text-stone-300">
                      <p><span className="text-stone-500">آرامستان:</span> {ad.deceased.burialCemetery}</p>
                      {ad.ceremonies.map((c) => (
                        <p key={c.id} className="truncate">
                          <span className="text-stone-500">{c.title}:</span>{' '}
                          {c.type === 'burial'
                            ? `اعلان سراسری شهر ${c.targetCity || ''} جهت خاکسپاری در ${c.cemeteryName || c.locationName} (بدون قید ساعت)`
                            : c.type === 'condolence_women'
                            ? `منزل متوفی: ${c.deceasedHomeAddress || 'آدرس منزل'} (بدون تعیین ساعت)`
                            : `${c.locationName} (${getMosqueSlotsSummary(c)})`}
                        </p>
                      ))}
                    </div>

                    {ad.announcementText && (
                      <p className="text-xs text-stone-400 bg-stone-950/60 p-2.5 rounded-xl border border-stone-850 leading-relaxed">
                        «{ad.announcementText}»
                      </p>
                    )}

                    {rejectingAdId === ad.id && (
                      <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800 space-y-2">
                        <label className="text-[11px] text-rose-300 block font-medium">علت عدم تایید یا نقص مدرک:</label>
                        <input
                          type="text"
                          placeholder="دلیل رد آگهی..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full bg-stone-950 border border-rose-900 rounded-lg p-2 text-xs text-stone-100 outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setRejectingAdId(null)}
                            className="text-[11px] bg-stone-800 text-stone-300 px-3 py-1 rounded cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            onClick={() => handleConfirmReject(ad.id)}
                            className="text-[11px] bg-rose-600 text-white font-bold px-3 py-1 rounded cursor-pointer"
                          >
                            ثبت رد قطعی
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-800">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setRejectingAdId(ad.id)}
                          className="flex-1 sm:flex-initial bg-stone-800 hover:bg-rose-950 hover:text-rose-400 text-stone-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>رد آگهی</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف کامل آگهی «${ad.deceased.fullName}» از سامانه اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) {
                              deleteAd(ad.id);
                            }
                          }}
                          className="flex-1 sm:flex-initial bg-stone-800 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-stone-700"
                          title="حذف کامل آگهی از سامانه"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          <span>حذف کامل</span>
                        </button>
                      </div>

                      <button
                        onClick={() => approveAd(ad.id)}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-950 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>تأیید و انتشار عمومی</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ۲. تب مدیریت پرداختی‌های اینترنتی - در موبایل کارت‌های تفکیک‌شده و در دسکتاپ جدول */}
        {activeTab === 'payments' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 sm:p-4 rounded-2xl w-full">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجو با نام، شماره یا کد رهگیری..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setPaymentFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${paymentFilter === 'all' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400'}`}
                >
                  همه ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('successful')}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${paymentFilter === 'successful' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400'}`}
                >
                  موفق ({transactions.filter((t) => t.status === 'successful').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('failed')}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${paymentFilter === 'failed' ? 'bg-rose-600 text-white font-bold' : 'text-stone-400'}`}
                >
                  ناموفق ({transactions.filter((t) => t.status === 'failed').length})
                </button>
              </div>
            </div>

            {/* در موبایل نمایش به شکل کارت‌های ریسپانسیو اختصاصی */}
            <div className="block lg:hidden space-y-3 w-full">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-mono text-amber-400 font-bold">{tx.trackingCode}</span>
                    {tx.status === 'successful' ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        موفق
                      </span>
                    ) : (
                      <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        ناموفق
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">کاربر پرداخت‌کننده:</span>
                    <span className="font-bold text-stone-200">{tx.userFullName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">تلفن:</span>
                    <span className="font-mono text-stone-300" dir="ltr">{tx.userPhone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">قالب:</span>
                    <span className="text-stone-200 truncate max-w-[180px]">{tx.frameTitle}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-850">
                    <span className="text-stone-400">مبلغ و زمان:</span>
                    <div className="text-left font-mono">
                      <span className="text-emerald-400 font-bold ml-1">{tx.amountToman.toLocaleString('fa-IR')} ت</span>
                      <span className="text-[10px] text-stone-500 block">{tx.createdAt}</span>
                    </div>
                  </div>
                  {tx.status === 'pending' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const reference = window.prompt('شماره مرجع بانکی را وارد کنید:')?.trim();
                        if (reference) await verifyTransaction(tx.id, reference);
                      }}
                      className="w-full mt-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl py-2 font-bold"
                    >
                      تأیید دستی تراکنش
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* در صفحه‌های تبلت و دسکتاپ جدول کامل */}
            <div className="hidden lg:block bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800">
                    <tr>
                      <th className="p-4">کد رهگیری</th>
                      <th className="p-4">کاربر پرداخت‌کننده</th>
                      <th className="p-4">شماره تماس</th>
                      <th className="p-4">قالب خریداری‌شده</th>
                      <th className="p-4">مبلغ (تومان)</th>
                      <th className="p-4">درگاه بانکی</th>
                      <th className="p-4">زمان پرداخت</th>
                      <th className="p-4">وضعیت</th>
                      <th className="p-4">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="p-4 font-mono text-amber-400 font-bold">{tx.trackingCode}</td>
                        <td className="p-4 font-bold text-stone-200">{tx.userFullName}</td>
                        <td className="p-4 font-mono text-stone-400" dir="ltr">{tx.userPhone}</td>
                        <td className="p-4 font-medium text-stone-200 truncate max-w-[200px]">{tx.frameTitle}</td>
                        <td className="p-4 font-mono text-emerald-400 font-bold">{tx.amountToman.toLocaleString('fa-IR')}</td>
                        <td className="p-4 text-stone-400">{tx.gateway}</td>
                        <td className="p-4 text-stone-400 text-[11px] font-mono">{tx.createdAt}</td>
                        <td className="p-4">
                          {tx.status === 'successful' ? (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              موفق
                            </span>
                          ) : tx.status === 'pending' ? (
                            <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">در انتظار</span>
                          ) : (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ناموفق
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {tx.status === 'pending' && (
                            <button type="button" onClick={async () => { const reference = window.prompt('شماره مرجع بانکی را وارد کنید:')?.trim(); if (reference) await verifyTransaction(tx.id, reference); }} className="text-amber-400 hover:text-amber-300 font-bold">تأیید دستی</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ۳. تب مدیریت و قیمت‌گذاری قالب‌ها - کاملاً فیت موبایل */}
        {activeTab === 'frames' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 sm:p-4 rounded-2xl w-full">
              <div>
                <h3 className="text-sm font-bold text-amber-400">مدیریت قیمت و تنوع قالب‌های آگهی</h3>
                <p className="text-[11px] text-stone-400">
                  تغییر آنلاین قیمت‌ها، حذف قالب یا افزودن طرح‌های جدید
                </p>
              </div>

              <button
                onClick={() => setShowAddFrameModal(true)}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن قالب جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {frames.map((frame) => (
                <div key={frame.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between space-y-3 w-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-black text-stone-100 truncate">{frame.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        frame.tier === 'free'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : frame.tier === 'economy'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-600 font-mono'
                      }`}>
                        {frame.tier === 'free' ? 'رایگان' : frame.tier === 'economy' ? 'اقتصادی' : 'VIP'}
                      </span>
                    </div>

                    <div className="my-2 max-w-[180px] mx-auto">
                      <FramedPhoto
                        photoUrl="/assets/app-logo.jpg"
                        frameId={frame.id}
                        fullName="پیش‌نمایش"
                        titlePrefix="مرحوم"
                        showFooterName={false}
                      />
                    </div>

                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">{frame.description}</p>
                  </div>

                  <div className="bg-stone-950 p-2.5 rounded-2xl border border-stone-850 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">قیمت فروش:</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {frame.priceToman === 0 ? 'رایگان (۰ ت)' : `${frame.priceToman.toLocaleString('fa-IR')} ت`}
                      </span>
                    </div>

                    {editingFrameId === frame.id ? (
                      <div className="space-y-1.5 pt-1 border-t border-stone-800">
                        <label className="text-[10px] text-stone-300 block">قیمت جدید (تومان):</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={newPriceInput}
                            onChange={(e) => setNewPriceInput(Number(e.target.value))}
                            className="w-full bg-stone-900 border border-amber-500 rounded-lg p-1.5 text-xs text-stone-100 font-mono outline-none"
                          />
                          <button
                            onClick={() => handleSavePrice(frame.id)}
                            className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-stone-850 text-xs">
                        <button
                          onClick={() => {
                            setEditingFrameId(frame.id);
                            setNewPriceInput(frame.priceToman);
                          }}
                          className="text-stone-400 hover:text-amber-400 text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>تغییر قیمت</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`آیا از حذف قالب «${frame.title}» اطمینان دارید؟`)) {
                              deleteFrame(frame.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* مدال افزودن قالب جدید - فیت موبایل */}
            {showAddFrameModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <form onSubmit={handleCreateNewFrame} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-3.5 shadow-2xl my-auto">
                  <h3 className="text-sm sm:text-base font-bold text-amber-400 border-b border-stone-800 pb-2.5 flex items-center gap-2">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    تعریف و افزودن قالب جدید به سامانه
                  </h3>

                  <div>
                    <label className="text-xs text-stone-300 block mb-1">عنوان قالب *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: طرح اسلیمی زرین بین‌الملل"
                      value={newFrameTitle}
                      onChange={(e) => setNewFrameTitle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="text-stone-300 block mb-1">قیمت فروش (تومان) *</label>
                      <input
                        type="number"
                        required
                        placeholder="۰ برای رایگان"
                        value={newFramePrice}
                        onChange={(e) => setNewFramePrice(Number(e.target.value))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">رده قیمتی</label>
                      <select
                        value={newFrameTier}
                        onChange={(e) => setNewFrameTier(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 outline-none"
                      >
                        <option value="free">رایگان</option>
                        <option value="economy">اقتصادی</option>
                        <option value="luxury">سلطنتی VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">گروه سنی هدف</label>
                      <select
                        value={newFrameAgeGroup}
                        onChange={(e) => setNewFrameAgeGroup(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 outline-none"
                      >
                        <option value="all">عمومی و تمام سنین</option>
                        <option value="elderly">بزرگان و سالمندان</option>
                        <option value="youth">جوانان و نوجوانان</option>
                        <option value="female_special">بانوان و مادران</option>
                        <option value="child">کودکان و نونهالان</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">نشان گوشه تصویر</label>
                      <select
                        value={newFrameOrnament}
                        onChange={(e) => setNewFrameOrnament(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 outline-none"
                      >
                        <option value="ribbon_black">روبان مشکی عزا</option>
                        <option value="candleglow">شمع روشن</option>
                        <option value="flower_lily">گل زنبق سپید</option>
                        <option value="dove_peace">کبوتر سپید پرواز</option>
                        <option value="islamic_gold">نقش اسلیمی زرین هو الباقی</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 block mb-1">توضیحات قالب</label>
                    <textarea
                      rows={2}
                      placeholder="توضیحاتی برای خریداران قالب..."
                      value={newFrameDesc}
                      onChange={(e) => setNewFrameDesc(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setShowAddFrameModal(false)}
                      className="bg-stone-800 text-stone-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                    >
                      افزودن و انتشار
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ۴. تب آگهی‌های فعال */}
        {activeTab === 'approved' && (
          <div className="space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              {approvedAds.map((ad) => (
                <div key={ad.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 w-full">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded">
                        {ad.trackingCode}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">منتشر شده</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-100">{ad.deceased.fullName}</h4>
                    <p className="text-xs text-stone-400">فرزند: {ad.deceased.fatherName}</p>
                    <p className="text-[11px] text-stone-500 mt-1">تلفن: {ad.ownerPhone}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-400">تسلیت: {ad.heartCount} 🖤</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (window.confirm(`آیا از حذف کامل آگهی «${ad.deceased.fullName}» از سامانه اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) {
                            deleteAd(ad.id);
                          }
                        }}
                        className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-bold transition-colors"
                        title="حذف کامل آگهی از سامانه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف کامل آگهی</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ۵. تب مساجد و آرامستان‌ها */}
        {activeTab === 'locations' && (
          <div className="space-y-4 w-full">
            {/* بنر افزودن مسجد از روی نقشه آنلاین با ثبت خودکار آدرس (بند ۲ خواسته کاربر) */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-stone-900 to-sky-950/50 border border-emerald-800/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center sm:text-right">
                <h4 className="text-sm font-black text-emerald-300 flex items-center justify-center sm:justify-start gap-2">
                  <MapIcon className="w-4 h-4 text-emerald-400" />
                  <span>امکان اضافه کردن مساجد از روی نقشه گوگل مپ و ثبت آدرس متنی آن</span>
                </h4>
                <p className="text-xs text-stone-400">
                  موقعیت دقیق مسجد را روی نقشه مشخص کنید تا آدرس متنی، شهر، محله و لینک‌های مسیریابی هوشمند به صورت خودکار ثبت شود.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapPickerModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-stone-950 font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 stroke-[2.5]" />
                <span>📍 افزودن مسجد از روی نقشه آنلاین</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              <form onSubmit={handleAddMosque} className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 space-y-3 w-full">
                <h3 className="text-sm font-bold text-amber-400 border-b border-stone-800 pb-2">
                  افزودن دستی مسجد یا آرامستان جدید
                </h3>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">نام مکان *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مسجد هجرت"
                    value={newMosqueName}
                    onChange={(e) => setNewMosqueName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">نوع مکان</label>
                  <select
                    value={newMosqueType}
                    onChange={(e) => setNewMosqueType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                  >
                    <option value="mosque">مسجد</option>
                    <option value="cemetery">آرامستان</option>
                    <option value="hussainiya">حسینیه</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">محله / منطقه</label>
                  <input
                    type="text"
                    placeholder="مثال: مرکز شهر، انقلاب..."
                    value={newMosqueNeighborhood}
                    onChange={(e) => setNewMosqueNeighborhood(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">شماره تماس خادم</label>
                  <input
                    type="text"
                    placeholder="087..."
                    value={newMosqueKhadem}
                    onChange={(e) => setNewMosqueKhadem(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none font-mono"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
                >
                  ثبت مکان در پایگاه داده
                </button>
              </form>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto w-full">
                {locations.map((loc) => (
                  <div key={loc.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-100">{loc.name}</span>
                      <span className="text-[10px] text-stone-500">{loc.city} - {loc.neighborhood}</span>
                    </div>
                    <p className="text-stone-400 truncate">{loc.address}</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-sky-400">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>مسیریابی در نقشه</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ۶. تب رادار زنده رویدادهای امنیتی */}
        {activeTab === 'logs' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-3 w-full">
            <h3 className="text-sm font-bold text-rose-400 border-b border-stone-800 pb-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              لاگ‌های زنده رادار امنیتی سامانه
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      log.level === 'critical' ? 'bg-rose-500' : log.level === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <span className="text-stone-300 leading-relaxed">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[10px] sm:text-[11px] self-end sm:self-auto">
                    <span>{log.actor}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* مدال افزودن مسجد از روی نقشه با Geolocation و Reverse Geocoding (بند ۲ خواسته کاربر) */}
      {isMapPickerModalOpen && (
        <CeremonyMapPickerModal
          isOpen={true}
          onClose={() => setIsMapPickerModalOpen(false)}
          onLocationPinned={(locData) => {
            addLocation({
              id: `loc-${Date.now()}`,
              name: locData.name,
              city: locData.city || 'تهران',
              neighborhood: locData.neighborhood || 'مرکز شهر',
              address: locData.address,
              lat: locData.lat,
              lng: locData.lng,
              khademPhone: locData.khademPhone,
              type: locData.type,
            });
            setIsMapPickerModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
