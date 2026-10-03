const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'REQUEST_FAILED');
  return data as T;
}

export interface ApiUser {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  role: 'user' | 'owner' | 'moderator' | 'super_admin';
  madhhab: 'sunni' | 'shia';
  isVerified: boolean;
  createdAt?: string;
  subscriptionPlan?: 'none' | '1_month' | '3_months' | '1_year';
  subscriptionExpiresAt?: string;
}

export interface ApiAd {
  id: string;
  tracking_code: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived' | 'suspended';
  payload: Record<string, any>;
  view_count: number;
  heart_count: number;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
}

export const api = {
  requestOtp: (body: { provider: string; destination: string; fullName?: string; madhhab: string }) =>
    request<{ ok: boolean; expiresInSeconds: number }>('/api/auth/request-otp', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body: { provider: string; destination: string; code: string; fullName?: string; madhhab: string }) =>
    request<{ user: ApiUser }>('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  ownerVerification: (body: { ownerNationalCode: string; deceasedNationalCode: string; ownerRelation: string }) =>
    request<{ verification: { id: string; status: string } }>('/api/auth/owner-verification', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<{ user: ApiUser }>('/api/auth/me'),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  adminLogin: (body: { username: string; password: string }) => request<{ user: ApiUser }>('/api/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  adminLogout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
  listAds: () => request<{ ads: ApiAd[] }>('/api/ads'),
  listPendingAds: () => request<{ ads: ApiAd[] }>('/api/ads/moderation/pending'),
  getAd: (id: string) => request<{ ad: ApiAd }>(`/api/ads/${encodeURIComponent(id)}`),
  createAd: (payload: Record<string, any>) => request<{ ad: ApiAd }>('/api/ads', { method: 'POST', body: JSON.stringify({ payload }) }),
  updateAd: (id: string, payload: Record<string, any>) => request<{ ad: ApiAd }>(`/api/ads/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ payload }) }),
  approveAd: (id: string) => request<{ ad: Partial<ApiAd> }>(`/api/ads/${encodeURIComponent(id)}/approve`, { method: 'POST' }),
  rejectAd: (id: string, reason: string) => request<{ ad: Partial<ApiAd> }>(`/api/ads/${encodeURIComponent(id)}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  deleteAd: (id: string) => request<{ ok: boolean }>(`/api/ads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  heartAd: (id: string) => request<{ heartCount: number }>(`/api/ads/${encodeURIComponent(id)}/heart`, { method: 'POST' }),
  listComments: (id: string) => request<{ comments: any[] }>(`/api/ads/${encodeURIComponent(id)}/comments`),
  addComment: (id: string, comment: Record<string, any>) => request<{ comment: any }>(`/api/ads/${encodeURIComponent(id)}/comments`, { method: 'POST', body: JSON.stringify({ comment }) }),
  listFramePrices: () => request<{ frames: any[] }>('/api/payments/frame-prices'),
  updateFramePrice: (frameId: string, priceToman: number) => request<{ frame: any }>(`/api/payments/frame-prices/${encodeURIComponent(frameId)}`, { method: 'PATCH', body: JSON.stringify({ priceToman }) }),
  createPaymentIntent: (body: { purpose: 'frame' | 'subscription'; gateway: 'saman' | 'zarinpal' | 'mellat'; frameId?: string; planId?: string; referenceId?: string }) => request<{ payment: any }>('/api/payments/intents', { method: 'POST', body: JSON.stringify(body) }),
  getPayment: (id: string) => request<{ payment: any }>(`/api/payments/${encodeURIComponent(id)}`),
  listPayments: () => request<{ payments: any[] }>('/api/payments'),
  verifyPayment: (id: string, referenceNumber: string) => request<{ payment: any }>(`/api/payments/verify/${encodeURIComponent(id)}`, { method: 'POST', body: JSON.stringify({ referenceNumber }) }),
  listAuditLogs: () => request<{ logs: any[] }>('/api/admin/audit'),
  listPendingComments: () => request<{ comments: any[] }>('/api/ads/moderation/comments'),
  approveComment: (id: string) => request<{ comment: any }>(`/api/ads/comments/${encodeURIComponent(id)}/approve`, { method: 'POST' }),
  rejectComment: (id: string) => request<{ comment: any }>(`/api/ads/comments/${encodeURIComponent(id)}/reject`, { method: 'POST' }),
  hideComment: (id: string) => request<{ comment: any }>(`/api/ads/comments/${encodeURIComponent(id)}/hide`, { method: 'POST' }),
  listLocations: () => request<{ locations: any[] }>('/api/locations'),
  createLocation: (location: Record<string, any>) => request<{ location: any }>('/api/locations', { method: 'POST', body: JSON.stringify({ location }) }),
};
