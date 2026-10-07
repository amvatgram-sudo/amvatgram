import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType } from './AppContext';
import { GriefAd, MosqueLocation, SystemAuditLog, UserProfile, Madhhab, CondolenceComment, PaymentTransaction, AppAppearanceConfig, UserAppearancePreferences, PaletteDefinition, FontDefinition, CardStyleDefinition, ThemeProfile, AppDisplayMode } from '../types';
import { GLOBAL_LOCATIONS, INITIAL_LOGS } from '../data/mockData';

import { MEMORIAL_FRAMES, PosterFrame } from '../data/memorialFrames';
import { DEFAULT_APP_APPEARANCE, DEFAULT_USER_PREFERENCES, applyCssVariables } from '../utils/appearancePresets';
import { AppLanguage } from '../utils/i18n';
import { api, ApiAd } from '../services/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapApiAd = (row: ApiAd): GriefAd => ({
  ...(row.payload as GriefAd),
  id: row.id,
  trackingCode: row.tracking_code,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  viewCount: row.view_count,
  heartCount: row.heart_count,
  rejectionReason: row.rejection_reason || undefined,
  comments: (row.payload?.comments || []) as GriefAd['comments'],
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('amvatgram_lang');
    return (saved as AppLanguage) || 'fa';
  });

  // امنیت: Session و PII در localStorage نگهداری نمی‌شوند. تا زمان Backend، session فقط در حافظه است.
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [activeMadhhabContext, setActiveMadhhabContext] = useState<Madhhab>(() => {
    return currentUser ? currentUser.madhhab : 'sunni';
  });

  const [activeRole, setActiveRole] = useState<'user' | 'owner' | 'moderator' | 'super_admin'>('user');
  const [appDisplayMode, setAppDisplayMode] = useState<AppDisplayMode>(() => {
    return (localStorage.getItem('amvatgram_display_mode') as AppDisplayMode) || 'app';
  });
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [requireOwnerAuth, setRequireOwnerAuth] = useState(false);

  // آگهی‌ها
  const [ads, setAds] = useState<GriefAd[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);

  const [activeAd, setActiveAd] = useState<GriefAd | null>(null);

  // مدیریت قالب‌ها
  const [frames, setFrames] = useState<PosterFrame[]>(MEMORIAL_FRAMES);

  // تراکنش‌ها
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // مساجد
  const [locations, setLocations] = useState<MosqueLocation[]>(GLOBAL_LOCATIONS);

  useEffect(() => {
    api.listLocations().then(({ locations: remoteLocations }) => {
      if (remoteLocations.length > 0) setLocations(remoteLocations as MosqueLocation[]);
    }).catch(() => { /* local seed remains as a read-only fallback until API is available */ });
  }, []);


  // هویت بصری، تصاویر و تم سامانه
  const [appearance, setAppearance] = useState<AppAppearanceConfig>(() => {
    try {
      const saved = localStorage.getItem('amvatgram_appearance');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_APP_APPEARANCE,
          ...parsed,
          themeProfiles: parsed.themeProfiles && parsed.themeProfiles.length > 0
            ? parsed.themeProfiles
            : DEFAULT_APP_APPEARANCE.themeProfiles,
          activeThemeProfileId: parsed.activeThemeProfileId || DEFAULT_APP_APPEARANCE.activeThemeProfileId,
          customPalettes: parsed.customPalettes && parsed.customPalettes.length > 0
            ? parsed.customPalettes
            : DEFAULT_APP_APPEARANCE.customPalettes,
          availableFonts: parsed.availableFonts && parsed.availableFonts.length > 0
            ? parsed.availableFonts
            : DEFAULT_APP_APPEARANCE.availableFonts,
          availableCardStyles: parsed.availableCardStyles && parsed.availableCardStyles.length > 0
            ? parsed.availableCardStyles
            : DEFAULT_APP_APPEARANCE.availableCardStyles,
        };
      }
      return DEFAULT_APP_APPEARANCE;
    } catch {
      return DEFAULT_APP_APPEARANCE;
    }
  });



  // ترجیحات ظاهری کاربر
  const [userPreferences, setUserPreferences] = useState<UserAppearancePreferences>(() => {
    try {
      const saved = localStorage.getItem('amvatgram_user_preferences');
      return saved ? { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_USER_PREFERENCES;
    } catch {
      return DEFAULT_USER_PREFERENCES;
    }
  });

  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);

  // لاگ‌ها
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_LOGS);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'create_ad' | 'locations' | 'admin_dashboard' | 'user_profile' | 'religious_hub'>('home');

  // لیست ادعیه و احادیث نشان‌شده در علاقه‌مندی‌ها
  const [favoriteDuaIds, setFavoriteDuaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('amvatgram_favorite_duas');
      return saved ? JSON.parse(saved) : ['dua-talqeen-sunni', 'dua-quran-burial-shia', 'hadith-fri'];
    } catch {
      return ['dua-talqeen-sunni', 'dua-quran-burial-shia', 'hadith-fri'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amvatgram_favorite_duas', JSON.stringify(favoriteDuaIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteDuaIds]);

  const toggleFavoriteDua = (duaId: string) => {
    setFavoriteDuaIds((prev) => {
      if (prev.includes(duaId)) {
        return prev.filter((id) => id !== duaId);
      } else {
        return [...prev, duaId];
      }
    });
  };

  const isDuaFavorite = (duaId: string) => favoriteDuaIds.includes(duaId);

  useEffect(() => {
    localStorage.setItem('amvatgram_lang', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) setActiveMadhhabContext(currentUser.madhhab);
    else setActiveMadhhabContext('sunni');
  }, [currentUser]);

  // بازیابی Session از Cookie امن HttpOnly؛ هیچ Token/PII در localStorage ذخیره نمی‌شود.
  useEffect(() => {
    let cancelled = false;
    api.me().then(({ user }) => {
      if (cancelled) return;
      const profile: UserProfile = {
        id: user.id, fullName: user.fullName, phone: user.phone, email: user.email,
        role: user.role, avatarUrl: user.avatarUrl, madhhab: user.madhhab, isVerified: user.isVerified,
        subscriptionPlan: user.subscriptionPlan, subscriptionExpiresAt: user.subscriptionExpiresAt,
        createdAt: user.createdAt || new Date().toISOString(),
      };
      setCurrentUser(profile);
      setActiveRole(user.role);
    }).catch(() => { /* unauthenticated is expected before login */ });
    return () => { cancelled = true; };
  }, []);

  const refreshAds = async () => {
    setAdsLoading(true);
    try {
      const publicResult = await api.listAds();
      const result = currentUser && ['moderator', 'super_admin'].includes(currentUser.role)
        ? await api.listPendingAds()
        : null;
      const merged = [...publicResult.ads, ...(result?.ads || [])];
      const unique = Array.from(new Map(merged.map((a) => [a.id, a])).values());
      setAds(unique.map(mapApiAd));
    } catch (error) {
      console.error('Failed to load ads', error);
    } finally {
      setAdsLoading(false);
    }
  };

  useEffect(() => {
    void refreshAds();
  }, [currentUser?.id, currentUser?.role]);
  useEffect(() => {
    if (!currentUser || !['moderator', 'super_admin'].includes(currentUser.role)) return;
    void api.listAuditLogs().then(({ logs }) => {
      setAuditLogs(logs.map((row: any) => ({
        id: row.id,
        timestamp: row.created_at,
        actor: row.actor_name || row.actor_role || 'system',
        action: (['AD_CREATED','AD_APPROVED','AD_REJECTED','AD_DELETED','AD_EDITED','LOCATION_ADDED','KILL_SWITCH_TRIGGERED','CONDOLENCE_SUBMITTED','OWNER_VERIFIED','PAYMENT_SUCCESS','PAYMENT_VERIFIED','FRAME_UPDATED','APPEARANCE_UPDATED','ROLE_EXPIRED','SUBSCRIPTION_RENEWED','AD_HEARTED'].includes(row.action) ? row.action : 'AD_EDITED') as SystemAuditLog['action'],
        details: row.metadata ? JSON.stringify(row.metadata) : row.action,
        targetId: row.target_id || undefined,
        level: row.action.includes('REJECT') || row.action.includes('DELETE') || row.action.includes('HIDE') ? 'warning' : 'info',
      })));
    }).catch(() => { /* backend may be unavailable during offline boot */ });
  }, [currentUser?.id, currentUser?.role]);
  useEffect(() => {
    void api.listFramePrices().then(({ frames: serverFrames }) => {
      const prices = new Map(serverFrames.map((f: any) => [f.frame_id, Number(f.price_toman)]));
      setFrames((prev) => prev.map((f) => prices.has(f.id) ? { ...f, priceToman: prices.get(f.id) as number, tier: (prices.get(f.id) as number) === 0 ? 'free' : (prices.get(f.id) as number) >= 100000 ? 'luxury' : 'economy' } : f));
    }).catch(() => { /* API may be unavailable during initial offline boot */ });
  }, []);
  useEffect(() => {
    if (currentUser && ['moderator', 'super_admin'].includes(currentUser.role)) void refreshPayments();
    else setTransactions([]);
  }, [currentUser?.id, currentUser?.role]);

  // امنیت: آگهی‌ها، تراکنش‌ها، نقش‌ها و لاگ‌های مدیریتی نباید در localStorage قابل دستکاری باشند.
  // تا فاز ۲ فقط در حافظه نگهداری می‌شوند و سپس به API/Database منتقل خواهند شد.

  useEffect(() => {
    localStorage.setItem('amvatgram_appearance', JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('amvatgram_user_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem('amvatgram_display_mode', appDisplayMode);
  }, [appDisplayMode]);

  // بررسی خودکار انقضای مهلت ۱ هفته‌ای دسترسی صاحب عزا و بازگشت به کاربر عادی
  useEffect(() => {
    if (currentUser && currentUser.role === 'owner') {
      const now = Date.now();
      const hasSubscription = currentUser.subscriptionExpiresAt && new Date(currentUser.subscriptionExpiresAt).getTime() > now;
      if (!hasSubscription) {
        const createdMs = currentUser.mournerExpiresAt 
          ? new Date(currentUser.mournerExpiresAt).getTime() 
          : new Date(currentUser.createdAt || Date.now()).getTime() + (7 * 24 * 60 * 60 * 1000);
        if (now > createdMs) {
          setCurrentUser((prev) => prev ? { ...prev, role: 'user', ownerRelation: undefined } : null);
          setActiveRole('user');
          addAuditLog('ROLE_EXPIRED', `مهلت ۱ هفته‌ای دسترسی صاحب عزا برای «${currentUser.fullName}» منقضی شد و به کاربر عادی ناظر تبدیل گردید.`, 'info');
        }
      }
    }
  }, [currentUser]);

  // اعمال متغیرهای CSS سراسری برای برندینگ و استایل تم فعال

  useEffect(() => {
    const activeProfile = appearance.themeProfiles?.find(
      (p) => p.id === appearance.activeThemeProfileId
    ) || appearance.themeProfiles?.[0];
    if (activeProfile) {
      applyCssVariables(activeProfile);
    }
  }, [appearance.activeThemeProfileId, appearance.themeProfiles]);

  const updateAppearance = (updates: Partial<AppAppearanceConfig>) => {
    setAppearance((prev) => ({ ...prev, ...updates }));
    addAuditLog('APPEARANCE_UPDATED', 'هویت بصری و تصاویر شاخص سامانه توسط مدیریت بروزرسانی شد', 'info');
  };

  const resetAppearance = () => {
    setAppearance(DEFAULT_APP_APPEARANCE);
    if (DEFAULT_APP_APPEARANCE.themeProfiles[0]) {
      applyCssVariables(DEFAULT_APP_APPEARANCE.themeProfiles[0]);
    }
    addAuditLog('APPEARANCE_UPDATED', 'تنظیمات ظاهری سامانه به حالت پیش‌فرض کارخانه بازنشانی شد', 'warning');
  };

  // مدیریت پروفایل‌های تم با متغیرهای CSS سراسری (ThemeManager)
  const addThemeProfile = (profile: ThemeProfile) => {
    setAppearance((prev) => {
      const exists = prev.themeProfiles.some((p) => p.id === profile.id);
      const updated = exists
        ? prev.themeProfiles.map((p) => (p.id === profile.id ? profile : p))
        : [...prev.themeProfiles, { ...profile, createdAt: new Date().toLocaleDateString('fa-IR') }];
      return { ...prev, themeProfiles: updated, activeThemeProfileId: profile.id };
    });
    applyCssVariables(profile);
    addAuditLog('APPEARANCE_UPDATED', `پروفایل تم اختصاصی «${profile.name}» در سامانه ذخیره و اعمال شد.`, 'info');
  };

  const deleteThemeProfile = (profileId: string) => {
    setAppearance((prev) => {
      const remaining = prev.themeProfiles.filter((p) => p.id !== profileId);
      const newActive = prev.activeThemeProfileId === profileId
        ? (remaining[0]?.id || 'profile-gold')
        : prev.activeThemeProfileId;
      return { ...prev, themeProfiles: remaining, activeThemeProfileId: newActive };
    });
    addAuditLog('APPEARANCE_UPDATED', `پروفایل تم با شناسه ${profileId} حذف گردید.`, 'warning');
  };

  const setActiveThemeProfile = (profileId: string) => {
    setAppearance((prev) => {
      const target = prev.themeProfiles.find((p) => p.id === profileId);
      if (target) {
        applyCssVariables(target);
      }
      return { ...prev, activeThemeProfileId: profileId };
    });
    setUserPreferences((prev) => ({ ...prev, activeThemeProfileId: profileId }));
  };

  const updateThemeProfile = (profileId: string, updates: Partial<ThemeProfile>) => {
    setAppearance((prev) => {
      const updated = prev.themeProfiles.map((p) => {
        if (p.id === profileId) {
          const newP = { ...p, ...updates };
          if (p.id === prev.activeThemeProfileId) {
            applyCssVariables(newP);
          }
          return newP;
        }
        return p;
      });
      return { ...prev, themeProfiles: updated };
    });
  };


  const updateUserPreferences = (updates: Partial<UserAppearancePreferences>) => {
    setUserPreferences((prev) => ({ ...prev, ...updates }));
  };

  // تعریف و ذخیره پالت‌های رنگی اصلی در دیتابیس توسط مدیریت
  const addCustomPalette = (palette: PaletteDefinition) => {
    setAppearance((prev) => {
      const exists = prev.customPalettes.some((p) => p.id === palette.id);
      const updated = exists
        ? prev.customPalettes.map((p) => (p.id === palette.id ? palette : p))
        : [...prev.customPalettes, { ...palette, createdAt: new Date().toLocaleDateString('fa-IR') }];
      return { ...prev, customPalettes: updated };
    });
    addAuditLog('APPEARANCE_UPDATED', `پالت رنگی جدید «${palette.name}» در دیتابیس سامانه ذخیره شد.`, 'info');
  };

  const deleteCustomPalette = (paletteId: string) => {
    setAppearance((prev) => ({
      ...prev,
      customPalettes: prev.customPalettes.filter((p) => p.id !== paletteId),
      colorPalette: prev.colorPalette === paletteId ? 'gold' : prev.colorPalette,
    }));
    addAuditLog('APPEARANCE_UPDATED', `پالت رنگی ${paletteId} از دیتابیس حذف گردید.`, 'warning');
  };

  const togglePaletteActive = (paletteId: string) => {
    setAppearance((prev) => ({
      ...prev,
      customPalettes: prev.customPalettes.map((p) =>
        p.id === paletteId ? { ...p, isActive: !p.isActive } : p
      ),
    }));
  };

  // تعریف و ذخیره فونت‌های سامانه در دیتابیس توسط مدیریت
  const addCustomFont = (font: FontDefinition) => {
    setAppearance((prev) => {
      const exists = prev.availableFonts.some((f) => f.id === font.id);
      const updated = exists
        ? prev.availableFonts.map((f) => (f.id === font.id ? font : f))
        : [...prev.availableFonts, font];
      return { ...prev, availableFonts: updated };
    });
    addAuditLog('APPEARANCE_UPDATED', `فونت جدید «${font.name}» در دیتابیس سامانه ثبت شد.`, 'info');
  };

  const deleteCustomFont = (fontId: string) => {
    setAppearance((prev) => ({
      ...prev,
      availableFonts: prev.availableFonts.filter((f) => f.id !== fontId),
      fontFamily: prev.fontFamily === fontId ? 'vazirmatn' : prev.fontFamily,
    }));
  };

  const toggleFontActive = (fontId: string) => {
    setAppearance((prev) => ({
      ...prev,
      availableFonts: prev.availableFonts.map((f) =>
        f.id === fontId ? { ...f, isActive: !f.isActive } : f
      ),
    }));
  };

  // تعریف و ذخیره استایل‌های کارت در دیتابیس
  const addCustomCardStyle = (style: CardStyleDefinition) => {
    setAppearance((prev) => {
      const exists = prev.availableCardStyles.some((s) => s.id === style.id);
      const updated = exists
        ? prev.availableCardStyles.map((s) => (s.id === style.id ? style : s))
        : [...prev.availableCardStyles, style];
      return { ...prev, availableCardStyles: updated };
    });
  };

  const deleteCustomCardStyle = (styleId: string) => {
    setAppearance((prev) => ({
      ...prev,
      availableCardStyles: prev.availableCardStyles.filter((s) => s.id !== styleId),
      cardStyle: prev.cardStyle === styleId ? 'standard' : prev.cardStyle,
    }));
  };

  const toggleCardStyleActive = (styleId: string) => {
    setAppearance((prev) => ({
      ...prev,
      availableCardStyles: prev.availableCardStyles.map((s) =>
        s.id === styleId ? { ...s, isActive: !s.isActive } : s
      ),
    }));
  };

  const addAuditLog = (
    action: SystemAuditLog['action'],
    details: string,
    level: SystemAuditLog['level'] = 'info'
  ) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      actor: activeRole === 'super_admin' ? 'صاحب سامانه' : (currentUser?.fullName || 'کاربر'),
      action,
      details,
      level,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveMadhhabContext(user.madhhab);
    setRequireOwnerAuth(false);
    addAuditLog('AD_EDITED', `کاربر «${user.fullName}» لاگین شد.`);
  };

  const logoutUser = () => {
    void api.logout().catch(() => undefined);
    setCurrentUser(null);
    setActiveRole('user');
    setRequireOwnerAuth(false);
    setCurrentView('home');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    addAuditLog('AD_EDITED', `پروفایل کاربر «${updated.fullName}» به‌روزرسانی شد.`);
  };

  const requestCreateAdAsOwner = () => {
    if (!currentUser || currentUser.role !== 'owner') {
      setRequireOwnerAuth(true);
    } else {
      setCurrentView('create_ad');
    }
  };

  const createAd = async (adData: Partial<GriefAd>): Promise<GriefAd> => {
    if (!currentUser) throw new Error('UNAUTHENTICATED');
    const payload = {
      ...adData,
      ownerId: currentUser.id,
      ownerPhone: adData.ownerPhone || currentUser.phone || '',
      ownerRelation: adData.ownerRelation || currentUser.ownerRelation || 'بستگان درجه اول',
    };
    const result = await api.createAd(payload);
    const newAd = mapApiAd(result.ad);
    setAds((prev) => [newAd, ...prev.filter((ad) => ad.id !== newAd.id)]);
    return newAd;
  };

  const approveAd = (adId: string) => {
    void api.approveAd(adId).then(() => refreshAds()).catch((error) => console.error(error));
  };

  const rejectAd = (adId: string, reason: string) => {
    void api.rejectAd(adId, reason).then(() => refreshAds()).catch((error) => console.error(error));
  };

  const toggleHeart = (adId: string) => {
    void api.heartAd(adId).then(({ heartCount }) => {
      setAds((prev) => prev.map((ad) => ad.id === adId ? { ...ad, heartCount } : ad));
    }).catch((error) => console.error(error));
  };

  const addCommentToAd = (adId: string, commentData: Omit<CondolenceComment, 'id' | 'createdAt'>) => {
    void api.addComment(adId, { text: commentData.text }).then(({ comment }) => {
      const newComment: CondolenceComment = {
        id: comment.id,
        createdAt: comment.created_at,
        authorName: comment.author_name,
        text: comment.text,
        type: 'traditional',
        madhhab: activeMadhhabContext,
      };
      setAds((prev) => prev.map((ad) => ad.id === adId ? { ...ad, comments: [newComment, ...(ad.comments || [])] } : ad));
      if (activeAd?.id === adId) setActiveAd({ ...activeAd, comments: [newComment, ...(activeAd.comments || [])] });
    }).catch((error) => console.error(error));
  };

  const updateFramePrice = async (frameId: string, newPriceToman: number) => {
    try {
      await api.updateFramePrice(frameId, newPriceToman);
      setFrames((prev) => prev.map((f) => f.id === frameId ? { ...f, priceToman: newPriceToman, tier: newPriceToman === 0 ? 'free' : newPriceToman >= 100000 ? 'luxury' : 'economy' } : f));
      addAuditLog('FRAME_UPDATED', `قیمت قالب ${frameId} به ${newPriceToman.toLocaleString('fa-IR')} تومان تغییر یافت.`);
    } catch (error) {
      console.error('Failed to update frame price', error);
      throw error;
    }
  };

  const addFrame = (frame: PosterFrame) => {
    setFrames((prev) => [...prev, frame]);
    addAuditLog('FRAME_UPDATED', `قالب جدید «${frame.title}» افزوده شد.`);
  };

  const deleteFrame = (frameId: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== frameId));
    addAuditLog('FRAME_UPDATED', `قالب ${frameId} حذف گردید.`, 'warning');
  };

  const refreshPayments = async () => {
    try {
      const result = await api.listPayments();
      setTransactions(result.payments.map((p: any) => ({
        id: p.id, trackingCode: p.tracking_code, userId: p.user_id, userFullName: p.full_name || '', userPhone: p.phone || '',
        adId: p.purpose === 'frame' ? p.reference_id || undefined : undefined, deceasedName: p.purpose === 'subscription' ? 'اشتراک صاحب عزا' : undefined,
        frameId: p.metadata?.frameId || `sub-${p.metadata?.planId || 'unknown'}`, frameTitle: p.metadata?.frameTitle || p.metadata?.planTitle || p.purpose,
        amountToman: Number(p.amount_toman), status: p.status, gateway: p.gateway, cardMask: p.card_mask || undefined,
        referenceNumber: p.reference_number || undefined, createdAt: p.created_at, verifiedAt: p.paid_at || undefined,
      } as PaymentTransaction)));
    } catch (error) { console.error('Failed to load payments', error); }
  };

  const verifyTransaction = async (txId: string, referenceNumber: string) => {
    await api.verifyPayment(txId, referenceNumber);
    await refreshPayments();
  };

  const emergencyKillAd = (adId: string) => {
    void api.deleteAd(adId).then(() => {
      setAds((prev) => prev.filter((ad) => ad.id !== adId));
      if (activeAd?.id === adId) { setActiveAd(null); setCurrentView('home'); }
    }).catch((error) => console.error(error));
  };

  const deleteAd = (adId: string) => {
    void api.deleteAd(adId).then(() => {
      setAds((prev) => prev.filter((ad) => ad.id !== adId));
      if (activeAd?.id === adId) { setActiveAd(null); setCurrentView('home'); }
    }).catch((error) => console.error(error));
  };

  // تمدید اشتراک صاحب عزا با پلن‌های اقتصادی زیر ۵۰۰ هزار تومان (آیتم ۱۲ خواسته کاربر)
  const renewMournerSubscription = async (planId: '1_month' | '3_months' | '1_year') => {
    if (!currentUser) throw new Error('UNAUTHENTICATED');
    const result = await api.createPaymentIntent({ purpose: 'subscription', gateway: 'saman', planId });
    if (!result.payment?.payment_url) throw new Error('PAYMENT_GATEWAY_NOT_CONFIGURED');
    window.open(result.payment.payment_url, '_blank', 'noopener,noreferrer');
    setIsSubscriptionModalOpen(false);
  };

  const addLocation = async (loc: MosqueLocation) => {
    try {
      const result = await api.createLocation(loc);
      const persisted = result.location as MosqueLocation;
      setLocations((prev) => [...prev.filter((x) => x.id !== persisted.id), persisted]);
      addAuditLog('LOCATION_ADDED', `مکان «${persisted.name}» به پایگاه مساجد اضافه شد.`);
    } catch (error) {
      setLocations((prev) => prev.some((x) => x.id === loc.id) ? prev : [...prev, loc]);
      console.warn('Location was kept locally because persistent location management was not authorized.', error);
    }
  };

  const approvedAds = ads.filter(
    (ad) => ad.status === 'approved' && ad.deceased?.madhhab === activeMadhhabContext
  );

  const pendingAds = ads.filter((ad) => ad.status === 'pending');

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        activeRole,
        activeMadhhabContext,
        language,
        setLanguage,
        loginUser,
        logoutUser,
        updateUserProfile,
        setRole: (role) => {
          // super_admin فقط از Backend/RBAC قابل اعطا است.
          setActiveRole(role);
        },
        appDisplayMode,
        setAppDisplayMode,
        isSubscriptionModalOpen,
        openSubscriptionModal: () => setIsSubscriptionModalOpen(true),
        closeSubscriptionModal: () => setIsSubscriptionModalOpen(false),
        renewMournerSubscription,
        requireOwnerAuth,
        setRequireOwnerAuth,
        requestCreateAdAsOwner,
        isMasterModalOpen,
        openMasterModal: () => setIsMasterModalOpen(true),
        closeMasterModal: () => setIsMasterModalOpen(false),
        ads,
        approvedAds,
        pendingAds,
        activeAd,
        setActiveAd,
        createAd,
        approveAd,
        rejectAd,
        deleteAd,
        toggleHeart,
        addCommentToAd,
        frames,
        updateFramePrice,
        addFrame,
        deleteFrame,
        transactions,
        refreshPayments,
        verifyTransaction,
        emergencyKillAd,
        locations,
        addLocation,
        auditLogs,
        addAuditLog,
        searchQuery,
        setSearchQuery,
        currentView,
        setCurrentView,
        favoriteDuaIds,
        toggleFavoriteDua,
        isDuaFavorite,
        appearance,
        updateAppearance,
        resetAppearance,
        addThemeProfile,
        deleteThemeProfile,
        setActiveThemeProfile,
        updateThemeProfile,
        addCustomPalette,
        deleteCustomPalette,
        togglePaletteActive,
        addCustomFont,
        deleteCustomFont,
        toggleFontActive,
        addCustomCardStyle,
        deleteCustomCardStyle,
        toggleCardStyleActive,
        userPreferences,
        updateUserPreferences,
        isAppearanceModalOpen,
        openAppearanceModal: () => setIsAppearanceModalOpen(true),
        closeAppearanceModal: () => setIsAppearanceModalOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


