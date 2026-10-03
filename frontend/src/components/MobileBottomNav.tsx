import React from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Home, 
  Search, 
  PlusCircle, 
  BookOpen, 
  User, 
  Building2 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, openAppearanceModal, setSearchQuery } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'خانه',
      icon: Home,
      view: 'home' as const,
    },
    {
      id: 'search',
      label: 'جستجو',
      icon: Search,
      action: () => {
        setCurrentView('home');
        // فوکوس روی فیلد جستجو در صفحه اصلی
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      },
    },
    {
      id: 'create_ad',
      label: 'ثبت آگهی',
      icon: PlusCircle,
      view: 'create_ad' as const,
      isSpecial: true,
    },
    {
      id: 'religious_hub',
      label: 'قرآن و دعا',
      icon: BookOpen,
      view: 'religious_hub' as const,
    },
    {
      id: 'user_profile',
      label: 'پروفایل',
      icon: User,
      view: 'user_profile' as const,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 shadow-2xl safe-area-bottom select-none">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 h-16">
        {navItems.map((item) => {
          const isActive = item.view ? currentView === item.view : false;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView('create_ad')}
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-950/60 border-2 border-stone-900 group-hover:scale-105 transition-transform active:scale-95">
                  <Icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-amber-400 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.view) {
                  setCurrentView(item.view);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive 
                  ? 'text-amber-400 font-bold' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
