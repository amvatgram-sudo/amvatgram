import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Crown, 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { api } from '../services/api';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: '1_month',
    title: 'اشتراک یک‌ماهه صاحب عزا',
    durationDays: 30,
    priceToman: 99000,
    originalPriceToman: 150000,
    discountPercent: 34,
    badge: 'محبوب‌ترین',
    features: [
      'حفظ دسترسی کامل پنل صاحب عزا به مدت ۳۰ روز',
      'مدیریت لحظه‌ای ساعات مساجد، مراسمات و تالارها',
      'دسترسی به تمامی قالب‌های ویژه و پوستر ترحیم',
      'نمایش نشان رسمی «صاحب عزا» روی آگهی و پیام‌ها',
      'اولویت نمایش در صفحه اصلی و جستجوی کاربران',
    ],
  },
  {
    id: '3_months',
    title: 'اشتراک سه‌ماهه یادبود خاندان',
    durationDays: 90,
    priceToman: 199000,
    originalPriceToman: 350000,
    discountPercent: 43,
    badge: 'به‌صرفه و اقتصادی',
    features: [
      'تمام امکانات پلن یک‌ماهه برای ۹۰ روز کامل',
      'پوشش کامل مراسمات شب هفتم، چهلم و یادبودها',
      'پشتیبانی اختصاصی کارشناسان و امور اداری مساجد',
      'امکان انتشار تا ۵ آگهی و تشکرنامه اختصاصی',
      'صرفه‌جویی بیش از ۱۵۰ هزار تومان',
    ],
  },
  {
    id: '1_year',
    title: 'اشتراک سالانه یادبود جاودان',
    durationDays: 365,
    priceToman: 380000,
    originalPriceToman: 600000,
    discountPercent: 36,
    badge: 'ارزش حداکثری (کمتر از ۴۰۰ هزار تومان)',
    features: [
      'یک سال کامل آرامش خاطر و دسترسی دائمی',
      'پوشش مراسم سالگرد و ادعیه هفتگی شب جمعه',
      'ذخیره آرشیو ابدی پیام‌های تسلیت و فایل‌های صوتی',
      'استفاده نامحدود از استودیوی هوشمند عکس و پوستر',
      'قابلیت تمدید با ۵۰ درصد تخفیف ویژه سال بعد',
    ],
  },
];

export const SubscriptionModal: React.FC = () => {
  const { 
    isSubscriptionModalOpen, 
    closeSubscriptionModal, 
    currentUser, 
    renewMournerSubscription,
    loginUser
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<'1_month' | '3_months' | '1_year'>('1_month');
  const [gateway, setGateway] = useState<'saman' | 'zarinpal' | 'mellat'>('saman');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{ trackingCode: string; amount: number } | null>(null);

  if (!isSubscriptionModalOpen) return null;

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];

  const handlePayAndRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsProcessing(true);
    try {
      const result = await api.createPaymentIntent({ purpose: 'subscription', gateway, planId: selectedPlan.id });
      const created = result.payment;
      window.open(created.payment_url, '_blank', 'noopener,noreferrer');
      const started = Date.now();
      const poll = window.setInterval(async () => {
        try {
          const current = await api.getPayment(created.id);
          if (current.payment.status === 'successful') {
            window.clearInterval(poll);
            const me = await api.me();
            loginUser({
              id: me.user.id, fullName: me.user.fullName, phone: me.user.phone, email: me.user.email,
              role: me.user.role, madhhab: me.user.madhhab, isVerified: me.user.isVerified,
              subscriptionPlan: me.user.subscriptionPlan, subscriptionExpiresAt: me.user.subscriptionExpiresAt,
              createdAt: new Date().toISOString(),
            });
            setIsProcessing(false);
            setSuccessReceipt({ trackingCode: current.payment.tracking_code, amount: Number(current.payment.amount_toman) });
          } else if (['failed', 'refunded', 'expired'].includes(current.payment.status) || Date.now() - started > 10 * 60 * 1000) {
            window.clearInterval(poll);
            setIsProcessing(false);
            alert('وضعیت پرداخت تأیید نشد. در صورت کسر وجه، رسید بانکی را نگه دارید و با پشتیبانی تماس بگیرید.');
          }
        } catch { /* polling ادامه می‌یابد */ }
      }, 2500);
    } catch (error) {
      setIsProcessing(false);
      alert(error instanceof Error ? error.message : 'اتصال به درگاه پرداخت انجام نشد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-stone-100 text-xs">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* سربرگ */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-800 flex items-center justify-center text-amber-400 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-stone-100">
                  تمدید و ارتقای اشتراک صاحب عزا
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  تعرفه‌های ویژه زیر ۵۰۰ هزار تومان
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                طبق قوانین سامانه، دسترسی اولیه صاحب عزا ۷ روزه بوده و پس از آن با انتخاب پلن‌های اقتصادی قابل تمدید است.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSubscriptionModal}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوای مودال */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {successReceipt ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-100">
                اشتراک صاحب عزا با موفقیت تمدید شد
              </h4>
              <p className="text-stone-400 text-xs max-w-sm mx-auto leading-relaxed">
                مبلغ <strong className="text-emerald-400 font-mono">{successReceipt.amount.toLocaleString('fa-IR')} تومان</strong> با موفقیت پرداخت گردید و دسترسی مدیریت آگهی‌ها تا تاریخ موعد تمدید شد.
              </p>
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-[11px] font-mono text-amber-400 inline-block">
                کد رهگیری تراکنش: {successReceipt.trackingCode}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeSubscriptionModal}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow transition-all"
                >
                  بازگشت به برنامه
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayAndRenew} className="space-y-4">
              {/* پلن‌های اشتراک */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-stone-300 block">
                  پلن مورد نظر خود را انتخاب نمایید:
                </label>

                <div className="space-y-2.5">
                  {SUBSCRIPTION_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-amber-950/20 border-amber-500 ring-1 ring-amber-500 shadow-lg'
                            : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-stone-100">{plan.title}</span>
                                {plan.badge && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400 mt-0.5 block">
                                مدت اعتبار: {plan.durationDays} روز
                              </span>
                            </div>
                          </div>

                          <div className="text-left font-mono">
                            <span className="text-sm font-black text-amber-400 block">
                              {plan.priceToman.toLocaleString('fa-IR')} <span className="text-[10px] font-sans">تومان</span>
                            </span>
                            {plan.originalPriceToman && (
                              <span className="text-[10px] text-stone-500 line-through">
                                {plan.originalPriceToman.toLocaleString('fa-IR')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ویژگی‌ها */}
                        <div className="mt-2.5 pt-2 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-stone-300">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* انتخاب درگاه بانکی / شتاب */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-stone-300 block">
                  درگاه پرداخت الکترونیک شتاب (امن و فوری):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'saman', name: 'بانک سامان', icon: '💳' },
                    { id: 'zarinpal', name: 'زرین‌پال', icon: '🪙' },
                    { id: 'mellat', name: 'بانک ملت', icon: '🏦' },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setGateway(gw.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        gateway === gw.id
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold'
                          : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{gw.icon}</span>
                      <span className="text-[11px] block">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* امنیت پرداخت */}
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>رمزنگاری امن ۲۵۶ بیتی و ضمانت بازگشت وجه</span>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  مبلغ نهایی: {selectedPlan.priceToman.toLocaleString('fa-IR')} ت
                </span>
              </div>

              {/* دکمه پرداخت */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeSubscriptionModal}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessing ? 'در حال اتصال به درگاه بانکی...' : `پرداخت اینترنتی (${selectedPlan.priceToman.toLocaleString('fa-IR')} تومان)`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
