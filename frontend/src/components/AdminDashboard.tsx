import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { api } from '../services/api';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Radio, 
  Building2, 
  Users, 
  Eye, 
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Palette,
  Sparkles
} from 'lucide-react';
import { MosqueLocation, MemorialTemplate } from '../types';
import { getMosqueSlotsSummary } from '../utils/ceremonyHelpers';
import { MEMORIAL_TEMPLATES } from '../data/memorialTemplates';

export const AdminDashboard: React.FC = () => {
  const { 
    ads, 
    pendingAds, 
    approvedAds, 
    approveAd, 
    rejectAd, 
    emergencyKillAd, 
    auditLogs, 
    locations, 
    addLocation, 
    setActiveAd, 
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'comments' | 'all_ads' | 'radar' | 'locations' | 'templates'>('pending');
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [rejectReason, setRejectReason] = useState<{ [adId: string]: string }>({});

  const loadPendingComments = async () => {
    try {
      const result = await api.listPendingComments();
      setPendingComments(result.comments);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  // فرم ثبت مسجد جدید
  const [showAddMosque, setShowAddMosque] = useState(false);
  const [newMosque, setNewMosque] = useState<Partial<MosqueLocation>>({
    city: 'شهر انتخابی',
    type: 'mosque',
    lat: 35.526,
    lng: 46.175,
  });

  const handleAddMosqueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMosque.name || !newMosque.address) return;
    addLocation({
      id: `loc-${Date.now()}`,
      name: newMosque.name,
      city: 'شهر انتخابی',
      neighborhood: newMosque.neighborhood || 'شهر انتخابی',
      address: newMosque.address,
      lat: Number(newMosque.lat) || 35.526,
      lng: Number(newMosque.lng) || 46.175,
      khademPhone: newMosque.khademPhone || '',
      type: newMosque.type as any || 'mosque',
    });
    setNewMosque({ city: 'شهر انتخابی', type: 'mosque', lat: 35.526, lng: 46.175, name: '', address: '', neighborhood: '' });
    setShowAddMosque(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* هدر مانیتورینگ اختصاصی صاحب سامانه */}
      <div className="bg-stone-900 border-2 border-rose-900/60 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">مرکز عملیات و فرماندهی سازنده (Super Admin)</h2>
                <span className="bg-rose-900/50 text-rose-300 text-xs px-2.5 py-0.5 rounded-full border border-rose-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  زنده (Live Connected)
                </span>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                دسترسی انحصاری صاحب پروژه | پایش زنده رویدادهای شهر انتخابی، تایید آگهی‌ها و مداخله اضطراری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors"
            >
              مشاهده محیط کاربری
            </button>
          </div>
        </div>

        {/* کارت‌های شاخص‌های کلیدی (KPI Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs">در انتظار بررسی</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-400">{pendingAds.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">نیاز به تأیید شما</p>
          </div>

          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs">آگهی‌های فعال</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{approvedAds.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">در حال نمایش در شهر انتخابی</p>
          </div>

          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs">مساجد و آرامستان‌ها</span>
              <Building2 className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-sky-400">{locations.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">بانک موقعیت‌های ثبت شده</p>
          </div>

          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs">رخدادهای ثبت شده</span>
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">{auditLogs.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">لاگ‌های امنیتی سیستم</p>
          </div>
        </div>
      </div>

      {/* تب‌های کنترل پنل */}
      <div className="flex border-b border-stone-800 gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
            activeTab === 'pending'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>میز تایید آگهی‌ها (Pending)</span>
          {pendingAds.length > 0 && (
            <span className="bg-rose-600 text-white text-[11px] px-2 py-0.2 rounded-full font-black">
              {pendingAds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('comments'); void loadPendingComments(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'comments' ? 'bg-stone-800 text-white border border-stone-700' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>مدیریت پیام‌های تسلیت</span>
          {pendingComments.length > 0 && <span className="bg-amber-600 text-white text-[11px] px-2 py-0.2 rounded-full font-black">{pendingComments.length}</span>}
        </button>

        <button
          onClick={() => setActiveTab('all_ads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'all_ads'
              ? 'bg-stone-800 text-white border border-stone-700'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>تمام آگهی‌ها و کلید اضطرار ({ads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'radar'
              ? 'bg-stone-800 text-white border border-stone-700'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-400" />
          <span>رادار زنده و لاگ‌های امنیتی</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'locations'
              ? 'bg-stone-800 text-white border border-stone-700'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>مدیریت مساجد و لوکیشن‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'templates'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>مدیریت قالب‌ها (Template Engine)</span>
        </button>
      </div>

      {/* ۱. تب صف تأیید آگهی‌ها */}
      {activeTab === 'pending' && (
        <div>
          {pendingAds.length === 0 ? (
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-stone-200">صف بررسی خالی است</h3>
              <p className="text-sm text-stone-400 mt-1">
                تمامی آگهی‌های ثبت شده بررسی و منتشر شده‌اند. هر زمان آگهی جدیدی ثبت شود بلافاصله در اینجا قرار می‌گیرد.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingAds.map((ad) => (
                <div 
                  key={ad.id}
                  className="bg-stone-900 border-2 border-amber-600/40 rounded-2xl p-6 shadow-xl relative"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-800 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-950 text-amber-400 text-xs px-2.5 py-0.5 rounded font-mono border border-amber-800">
                          {ad.trackingCode}
                        </span>
                        <h3 className="text-lg font-black text-white">{ad.deceased.fullName}</h3>
                        <span className="text-xs text-stone-400">فرزند: {ad.deceased.fatherName}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          ad.deceased.madhhab === 'sunni' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
                        }`}>
                          {ad.deceased.madhhab === 'sunni' ? 'اهل سنت' : 'اهل تشیع'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        ثبت شده توسط: <span className="text-stone-300 font-medium">{ad.ownerRelation}</span> | شماره هماهنگی: <span className="text-amber-400 font-mono" dir="ltr">{ad.ownerPhone}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveAd(ad);
                          setCurrentView('detail');
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        پیش‌نمایش آگهی
                      </button>
                      <button
                        onClick={() => approveAd(ad.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        تأیید و انتشار عمومی
                      </button>
                    </div>
                  </div>

                  {/* اطلاعات مراسمات درخواستی */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-950/60 p-4 rounded-xl border border-stone-800 text-xs mb-4">
                    <div>
                      <span className="text-stone-500 block mb-1">محل و تاریخ تدفین:</span>
                      <p className="text-stone-200 font-medium">{ad.deceased.burialCemetery} ({ad.deceased.dateOfDeath})</p>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-1">برنامه مراسمات:</span>
                      <ul className="space-y-1">
                        {ad.ceremonies.map((c) => (
                          <li key={c.id} className="text-stone-300">
                            • <strong className="text-amber-300">{c.title}:</strong>{' '}
                            {c.type === 'burial'
                              ? `اعلان سراسری شهر ${c.targetCity || ''} جهت خاکسپاری در ${c.cemeteryName || c.locationName} (بدون قید ساعت)`
                              : c.type === 'condolence_women'
                              ? `منزل متوفی: ${c.deceasedHomeAddress || 'آدرس منزل'} (بدون تعیین ساعت)`
                              : `${c.locationName} — ${getMosqueSlotsSummary(c)}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* باکس دلیل رد آگهی */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-stone-800/80">
                    <input
                      type="text"
                      placeholder="در صورت عدم تأیید، علت رد را بنویسید (مثلاً: عکس نامناسب، اطلاعات ناقص)..."
                      value={rejectReason[ad.id] || ''}
                      onChange={(e) => setRejectReason({ ...rejectReason, [ad.id]: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-lg px-3 py-2 focus:border-rose-600 outline-none"
                    />
                    <button
                      onClick={() => {
                        const reason = rejectReason[ad.id] || 'اطلاعات وارد شده نیازمند بازبینی و ویرایش است.';
                        rejectAd(ad.id, reason);
                      }}
                      className="w-full sm:w-auto bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      رد آگهی
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ۲. تب همه آگهی‌ها و کلید مداخله اضطراری */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          {pendingComments.length === 0 ? (
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-10 text-center text-stone-400">صف پیام‌های تسلیت در انتظار بررسی خالی است.</div>
          ) : pendingComments.map((comment) => (
            <div key={comment.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-stone-100">{comment.author_name}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-1">{comment.tracking_code}</div>
                </div>
                <div className="text-[11px] text-stone-500">{new Date(comment.created_at).toLocaleString('fa-IR')}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300 whitespace-pre-wrap">{comment.text}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={async () => { await api.approveComment(comment.id); setPendingComments((p) => p.filter((x) => x.id !== comment.id)); }} className="px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-bold">تأیید</button>
                <button onClick={async () => { await api.rejectComment(comment.id); setPendingComments((p) => p.filter((x) => x.id !== comment.id)); }} className="px-4 py-2 rounded-xl bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold">رد</button>
                <button onClick={async () => { await api.hideComment(comment.id); setPendingComments((p) => p.filter((x) => x.id !== comment.id)); }} className="px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold">مخفی</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'all_ads' && (
        <div className="space-y-4">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4">
            <h3 className="text-sm font-bold text-stone-200 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              مدیریت و کلید مداخله اضطراری آگهی‌ها (Kill Switch)
            </h3>

            <div className="divide-y divide-stone-800">
              {ads.map((ad) => (
                <div key={ad.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-stone-400">{ad.trackingCode}</span>
                      <span className="font-bold text-stone-100">{ad.deceased.fullName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        ad.status === 'approved' 
                          ? 'bg-emerald-950 text-emerald-400' 
                          : ad.status === 'pending'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}>
                        {ad.status === 'approved' ? 'منتشر شده' : ad.status === 'pending' ? 'در انتظار' : 'رد شده'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      آرامستان: {ad.deceased.burialCemetery} | بازدید: {ad.viewCount} | قلب: {ad.heartCount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveAd(ad);
                        setCurrentView('detail');
                      }}
                      className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg"
                    >
                      مشاهده
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف اضطراری و فوری آگهی «${ad.deceased.fullName}» اطمینان دارید؟`)) {
                          emergencyKillAd(ad.id);
                        }
                      }}
                      className="text-xs bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-400 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف اضطراری
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ۳. رادار زنده رویدادها و لاگ‌های امنیتی */}
      {activeTab === 'radar' && (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              رادار زنده سیستم و ثبت تغییرات (Audit Logs)
            </h3>
            <span className="text-xs text-stone-500">اتصال ریدر مستقیم دیتابیس</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-3 rounded-xl border flex items-start gap-3 ${
                  log.level === 'critical'
                    ? 'bg-rose-950/50 border-rose-800 text-rose-300'
                    : log.level === 'warning'
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-300'
                }`}
              >
                <span className="text-stone-500 whitespace-nowrap">{log.timestamp}</span>
                <span className="font-bold text-amber-400">[{log.action}]</span>
                <span className="text-stone-400">({log.actor}):</span>
                <p className="font-sans flex-1">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ۴. مدیریت مساجد و لوکیشن‌های شهر انتخابی */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-200">بانک مساجد، حسینیه‌ها و آرامستان‌های شهر انتخابی</h3>
            <button
              onClick={() => setShowAddMosque(!showAddMosque)}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              افزودن مسجد یا آرامستان جدید
            </button>
          </div>

          {showAddMosque && (
            <form onSubmit={handleAddMosqueSubmit} className="bg-stone-900 border border-amber-600/40 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-amber-400">مشخصات مکان جدید در شهرستان شهر انتخابی</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1">نام مکان / مسجد</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مسجد شیخ رشید"
                    value={newMosque.name || ''}
                    onChange={(e) => setNewMosque({ ...newMosque, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">نوع مکان</label>
                  <select
                    value={newMosque.type}
                    onChange={(e) => setNewMosque({ ...newMosque, type: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 outline-none"
                  >
                    <option value="mosque">مسجد</option>
                    <option value="cemetery">آرامستان</option>
                    <option value="hussainiya">حسینیه</option>
                    <option value="hall">سالن پذیرایی</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">محله / منطقه</label>
                  <input
                    type="text"
                    placeholder="مثال: چهارراه بایوه"
                    value={newMosque.neighborhood || ''}
                    onChange={(e) => setNewMosque({ ...newMosque, neighborhood: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-stone-400 block mb-1">آدرس دقیق</label>
                  <input
                    type="text"
                    required
                    placeholder="خیابان اصلی، کوچه..."
                    value={newMosque.address || ''}
                    onChange={(e) => setNewMosque({ ...newMosque, address: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">شماره تماس خادم یا مسئول</label>
                  <input
                    type="text"
                    placeholder="0918..."
                    value={newMosque.khademPhone || ''}
                    onChange={(e) => setNewMosque({ ...newMosque, khademPhone: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 outline-none font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMosque(false)}
                  className="bg-stone-800 text-stone-300 text-xs px-4 py-2 rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-lg"
                >
                  ثبت در سامانه
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-stone-200">{loc.name}</h4>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{loc.address}</p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-2">
                    <span>محله: {loc.neighborhood}</span>
                    {loc.khademPhone && <span>خادم: {loc.khademPhone}</span>}
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  نقشه
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ۵. تب مدیریت سیستم قالب‌های ترحیم (Template Engine) */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                مدیریت سیستم قالب‌ها (Template Engine Manager)
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xl">
                معماری ماژولار قالب‌های امواتگرام. مدیر سامانه می‌تواند قالب‌ها را فعال/غیرفعال، دسته‌بندی و ترتیب‌بندی نماید بدون نیاز به تغییر کد منبع.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold">
                {MEMORIAL_TEMPLATES.length} قالب فعال
              </span>
            </div>
          </div>

          {/* شبکه نمایش و مدیریت ۸ قالب */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEMORIAL_TEMPLATES.map((tmpl, idx) => (
              <div
                key={tmpl.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-amber-600/50 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tmpl.emoji}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      فعال (Active)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-100">{tmpl.name}</h4>
                  <span className="text-[11px] text-amber-400 font-mono block">{tmpl.id}</span>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-400 text-[11px]">
                    <span>دسته: {tmpl.category}</span>
                    <span>ترتیب: #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-lg border border-stone-800">
                      شکل: {tmpl.defaultShape}
                    </span>
                    <span className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-lg border border-stone-800">
                      نشان‌ها: {tmpl.defaultDecorations.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 text-xs text-stone-400 space-y-2 leading-relaxed">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>قابلیت‌های معماری موتور قالب امواتگرام:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-400 pr-1">
              <li>پشتیبانی از رندر همزمان در ۴ فرمت استاندارد: مربع (۱۰۸۰×۱۰۸۰)، پست عمودی (۱۰۸۰×۱۳۵۰)، استوری (۱۰۸۰×۱۹۲۰) و چاپ فیزیکی مساجد (A4).</li>
              <li>ویرایشگر هوشمند عکس: برش چهره، زوم، Pan افقی و عمودی، تنظیم روشنایی، کنتراست و فیلترهای سیاه‌وسفید ترحیم و سپیا.</li>
              <li>المان‌های گرافیکی و معنوی: کبوتر سپید، شمع‌های روشن، گل رز سوگ، روبان مشکی عزا و کتیبه‌های قرآنی هوالباقی.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
