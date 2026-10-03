import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { Shield, Lock, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';

export const MasterLoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { closeMasterModal } = useApp();
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleMasterAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // امنیت: احراز هویت مدیر هرگز نباید در Bundle فرانت‌اند انجام شود.
    // تا زمان اتصال Backend/RBAC واقعی، این مسیر عمداً غیرفعال است.
    setError('ورود مدیر از داخل مرورگر غیرفعال است. احراز هویت امن در Backend در فاز ۲ انجام می‌شود.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 mb-4 mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-stone-100 text-center mb-1">
          درگاه محرمانه ورود سازنده
        </h3>
        <p className="text-xs text-stone-400 text-center mb-6">
          ورود مدیر فقط پس از اتصال احراز هویت امن سمت سرور فعال خواهد شد.
        </p>

        <form onSubmit={handleMasterAuth} className="space-y-4">
          <div>
            <label className="text-xs text-stone-300 block mb-1.5 font-medium">
              کد دسترسی مستر (Master Access Key)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="کد محرمانه سازنده را وارد کنید..."
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setError('');
                }}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-stone-100 outline-none font-mono"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { closeMasterModal(); onClose(); }}
              className="w-1/2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs py-3 rounded-xl font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="w-1/2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs py-3 rounded-xl font-bold transition-colors shadow-lg shadow-amber-950"
            >
              ورود به کنسول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
