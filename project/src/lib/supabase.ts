import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://oxulbefflosgtlhhhylm.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Lead = {
  id: string;
  name: string;
  phone: string;
  service_type: 'SMM' | 'Marketing' | 'IT';
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export type Pricing = {
  id: string;
  key: string;
  label_uz: string;
  label_ru: string;
  price: number;
  period_uz: string | null;
  period_ru: string | null;
  sort_order: number;
};

export type Service = {
  id: string;
  pillar: 'SMM' | 'Marketing' | 'IT';
  title_uz: string;
  title_ru: string;
  description_uz: string | null;
  description_ru: string | null;
  icon_name: string;
  sort_order: number;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
};

// ==========================================
// DEFAULT SEED DATA (Fallbacks & Offline)
// ==========================================

export const DEFAULT_PRICING: Pricing[] = [
  { id: 'price-1', key: 'smm_1', label_uz: '1 oylik', label_ru: '1 месяц', price: 1500, period_uz: '/oy', period_ru: '/мес', sort_order: 1 },
  { id: 'price-2', key: 'smm_3', label_uz: '3 oylik paket', label_ru: 'Пакет на 3 месяца', price: 1350, period_uz: '/oy', period_ru: '/мес', sort_order: 2 },
  { id: 'price-3', key: 'smm_6', label_uz: '6 oylik paket', label_ru: 'Пакет на 6 месяцев', price: 1200, period_uz: '/oy', period_ru: '/мес', sort_order: 3 },
  { id: 'price-4', key: 'smm_12', label_uz: '12 oylik (1 yillik) paket', label_ru: 'Годовой пакет (12 месяцев)', price: 1000, period_uz: '/oy', period_ru: '/мес', sort_order: 4 },
  { id: 'price-5', key: 'marketing', label_uz: "Marketing (boshlang'ich)", label_ru: 'Маркетинг (от)', price: 2000, period_uz: 'dan', period_ru: 'от', sort_order: 5 },
];

export const DEFAULT_SERVICES: Service[] = [
  // SMM
  { id: 'srv-smm-1', pillar: 'SMM', title_uz: 'Strategiya ishlab chiqish', title_ru: 'Разработка стратегии', description_uz: 'Biznes maqsadlariga moslashtirilgan oylik va yillik SMM strategiyasi', description_ru: 'Стратегия с учетом целей бизнеса', icon_name: 'Lightbulb', sort_order: 1 },
  { id: 'srv-smm-2', pillar: 'SMM', title_uz: 'Kontent yaratish', title_ru: 'Создание контента', description_uz: 'Foto, video, reels va kopirayting xizmatlari', description_ru: 'Фото, видео, рилс и копирайтинг', icon_name: 'FileText', sort_order: 2 },
  { id: 'srv-smm-3', pillar: 'SMM', title_uz: 'Post va storilarni boshqarish', title_ru: 'Управление постами и сторис', description_uz: 'Har kuni doimiy faollik va postlar jadvali', description_ru: 'Регулярная активность и постинг', icon_name: 'LayoutGrid', sort_order: 3 },
  { id: 'srv-smm-4', pillar: 'SMM', title_uz: 'Reklama kampaniyalari (Instagram/Facebook)', title_ru: 'Рекламные кампании (Instagram/Facebook)', description_uz: 'Targeting va lead generation orqali mijoz oqimi', description_ru: 'Таргетинг и поток лидов', icon_name: 'Megaphone', sort_order: 4 },
  { id: 'srv-smm-5', pillar: 'SMM', title_uz: 'Brend imijini mustahkamlash', title_ru: 'Укрепление имиджа бренда', description_uz: 'Mijozlar ishonchini oshiruvchi vizual identifikatsiya', description_ru: 'Визуальная идентификация и доверие', icon_name: 'Shield', sort_order: 5 },
  { id: 'srv-smm-6', pillar: 'SMM', title_uz: 'Analitika va hisobot', title_ru: 'Аналитика и отчётность', description_uz: 'Haftalik va oylik shaffof ko\'rsatkichlar tahlili', description_ru: 'Еженедельный и ежемесячный отчет', icon_name: 'BarChart3', sort_order: 6 },
  // Marketing
  { id: 'srv-mkt-1', pillar: 'Marketing', title_uz: 'SMM xizmatlaridagi barcha takliflar', title_ru: 'Все услуги из SMM', description_uz: 'To\'liq SMM paketi kiritilgan', description_ru: 'Включает полный комплекс SMM', icon_name: 'CheckCircle', sort_order: 1 },
  { id: 'srv-mkt-2', pillar: 'Marketing', title_uz: 'Target (Google Ads, Telegram Ads)', title_ru: 'Таргет (Google Ads, Telegram Ads)', description_uz: 'Ko\'p kanalli reklama orqali yuqori konversiya', description_ru: 'Многоканальная реклама с высокой конверсией', icon_name: 'Target', sort_order: 2 },
  { id: 'srv-mkt-3', pillar: 'Marketing', title_uz: 'Branding (logo, brandbook)', title_ru: 'Брендинг (логотип, брендбук)', description_uz: 'Esdan chiqmas brend uslubi va ko\'rsatmalar', description_ru: 'Запоминающийся стиль бренда и гайдлайн', icon_name: 'Palette', sort_order: 3 },
  { id: 'srv-mkt-4', pillar: 'Marketing', title_uz: 'Marketing strategiya & konsalting', title_ru: 'Маркетинговая стратегия и консалтинг', description_uz: 'Bozor tahlili, raqobatchilar va auditoriyani o\'rganish', description_ru: 'Анализ рынка, конкурентов и аудитории', icon_name: 'Compass', sort_order: 4 },
  { id: 'srv-mkt-5', pillar: 'Marketing', title_uz: 'Influencer marketing', title_ru: 'Инфлюенсер-маркетинг', description_uz: 'Blogerlar va yetakchi shaxslar bilan integratsiyalar', description_ru: 'Интеграция с блогерами и инфлюенсерами', icon_name: 'Users', sort_order: 5 },
  { id: 'srv-mkt-6', pillar: 'Marketing', title_uz: "Sotuv bo'limi nazorati", title_ru: 'Контроль отдела продаж', description_uz: 'Lidlarni sotuvga aylantirish zanjirini audit qilish', description_ru: 'Аудит цепочки конверсии лидов в продажи', icon_name: 'TrendingUp', sort_order: 6 },
  // IT
  { id: 'srv-it-1', pillar: 'IT', title_uz: "Veb-sayt ishlab chiqish (landing, korporativ, internet-do'kon)", title_ru: 'Разработка веб-сайтов (лендинг, корпоративный, интернет-магазин)', description_uz: 'Zamonaviy, tez va SEO-optimizatsiya qilingan saytlar', description_ru: 'Современные, быстрые сайты с SEO-оптимизацией', icon_name: 'Globe', sort_order: 1 },
  { id: 'srv-it-2', pillar: 'IT', title_uz: 'Mobil ilovalar (iOS/Android)', title_ru: 'Мобильные приложения (iOS/Android)', description_uz: 'Foydalanuvchilar uchun qulay va ishonchli mobil ilovalar', description_ru: 'Удобные мобильные приложения для бизнеса', icon_name: 'Smartphone', sort_order: 2 },
  { id: 'srv-it-3', pillar: 'IT', title_uz: "Onlayn buyurtma va to'lov tizimlari", title_ru: 'Системы онлайн-заказов и платежей', description_uz: 'Payme, Click, Uzum to\'lov tizimlari integratsiyasi', description_ru: 'Интеграция систем оплаты Payme, Click, Uzum', icon_name: 'CreditCard', sort_order: 3 },
  { id: 'srv-it-4', pillar: 'IT', title_uz: 'UI/UX dizayn', title_ru: 'UI/UX дизайн', description_uz: 'Ergonomik va zamonaviy foydalanuvchi interfeyslari', description_ru: 'Современный и интуитивный дизайн', icon_name: 'PenTool', sort_order: 4 },
  { id: 'srv-it-5', pillar: 'IT', title_uz: "Texnik qo'llab-quvvatlash", title_ru: 'Техническая поддержка', description_uz: '24/7 server monitoringi va xavfsizlik nazorati', description_ru: 'Круглосуточный мониторинг серверов', icon_name: 'Headphones', sort_order: 5 },
  { id: 'srv-it-6', pillar: 'IT', title_uz: "Sun'iy intellekt va botlar (Telegram/Instagram AI chat-botlar)", title_ru: 'ИИ и боты (Telegram/Instagram AI чат-боты)', description_uz: 'Mijozlarga avtomatik javob beruvchi aqlli botlar', description_ru: 'Умные чат-боты с автоматизацией ответов', icon_name: 'Bot', sort_order: 6 },
];

export const DEFAULT_PARTNERS: Partner[] = [
  { id: 'prt-1', name: 'Apex Group', logo_url: null, sort_order: 1 },
  { id: 'prt-2', name: 'SilkRoad Logistics', logo_url: null, sort_order: 2 },
  { id: 'prt-3', name: 'Nova Tech', logo_url: null, sort_order: 3 },
  { id: 'prt-4', name: 'Grand Medical', logo_url: null, sort_order: 4 },
  { id: 'prt-5', name: 'Tashkent Retail', logo_url: null, sort_order: 5 },
  { id: 'prt-6', name: 'Avesto Real Estate', logo_url: null, sort_order: 6 },
];

export const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Alisher Qodirov',
    phone: '+998 90 123 45 67',
    service_type: 'SMM',
    message: "Biznesimiz uchun 3 oylik SMM paketi kerak. Instagram sahifamizni qayta loyihalashni xohlaymiz.",
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Madina Karimova',
    phone: '+998 99 876 54 32',
    service_type: 'Marketing',
    message: "Yangi brend ochmoqdamiz, to'liq brending va target reklama xizmatlari narxini bilmoqchiman.",
    status: 'contacted',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'lead-3',
    name: 'Javohir Toirov',
    phone: '+998 93 555 12 34',
    service_type: 'IT',
    message: "Restoran tarmog'imiz uchun Telegram bot va landing page yaratish lozim.",
    status: 'closed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Helper to safely access localStorage
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// ==========================================
// LEADS API
// ==========================================

export async function fetchLeads(): Promise<Lead[]> {
  const localLeads = getLocalItem<Lead[]>('prox_leads', INITIAL_DEMO_LEADS);

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const map = new Map<string, Lead>();
      localLeads.forEach((l) => map.set(l.id, l));
      (data as Lead[]).forEach((l) => map.set(l.id, l));
      const combined = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLocalItem('prox_leads', combined);
      return combined;
    }
  } catch (err) {
    console.warn('Supabase fetchLeads fallback to local cache:', err);
  }

  return localLeads;
}

export async function submitLead(input: {
  name: string;
  phone: string;
  service_type: 'SMM' | 'Marketing' | 'IT';
  message?: string | null;
}): Promise<{ data: Lead; error: null }> {
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: input.name,
    phone: input.phone,
    service_type: input.service_type,
    message: input.message || null,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const existing = getLocalItem<Lead[]>('prox_leads', INITIAL_DEMO_LEADS);
  const updated = [newLead, ...existing.filter((l) => l.id !== newLead.id)];
  setLocalItem('prox_leads', updated);

  try {
    const res = await supabase
      .from('leads')
      .insert({
        name: newLead.name,
        phone: newLead.phone,
        service_type: newLead.service_type,
        message: newLead.message,
        status: newLead.status,
      })
      .select();

    if (!res.error && Array.isArray(res.data) && res.data[0]?.id) {
      const serverId = (res.data[0] as { id: string }).id;
      const current = getLocalItem<Lead[]>('prox_leads', updated);
      setLocalItem(
        'prox_leads',
        current.map((l) => (l.id === newLead.id ? { ...l, id: serverId } : l))
      );
    }
  } catch (err) {
    console.warn('Background Supabase lead insert notice:', err);
  }

  return { data: newLead, error: null };
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<{ error: null }> {
  const existing = getLocalItem<Lead[]>('prox_leads', INITIAL_DEMO_LEADS);
  const updated = existing.map((l) => (l.id === id ? { ...l, status } : l));
  setLocalItem('prox_leads', updated);

  try {
    await supabase.from('leads').update({ status }).eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

export async function deleteLead(id: string): Promise<{ error: null }> {
  const existing = getLocalItem<Lead[]>('prox_leads', INITIAL_DEMO_LEADS);
  const updated = existing.filter((l) => l.id !== id);
  setLocalItem('prox_leads', updated);

  try {
    await supabase.from('leads').delete().eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

// ==========================================
// PRICING API
// ==========================================

export async function fetchPricing(): Promise<Pricing[]> {
  const localPricing = getLocalItem<Pricing[]>('prox_pricing', DEFAULT_PRICING);

  try {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const map = new Map<string, Pricing>();
      (data as Pricing[]).forEach((p) => map.set(p.id, p));
      localPricing.forEach((p) => {
        if (map.has(p.id)) {
          map.set(p.id, { ...map.get(p.id)!, price: p.price });
        } else {
          map.set(p.id, p);
        }
      });
      const res = Array.from(map.values()).sort((a, b) => a.sort_order - b.sort_order);
      setLocalItem('prox_pricing', res);
      return res;
    }
  } catch (err) {
    console.warn('Supabase fetchPricing fallback to local cache:', err);
  }

  return localPricing;
}

export async function updatePricing(id: string, price: number): Promise<{ error: null }> {
  const existing = getLocalItem<Pricing[]>('prox_pricing', DEFAULT_PRICING);
  const updated = existing.map((p) => (p.id === id ? { ...p, price } : p));
  setLocalItem('prox_pricing', updated);

  try {
    await supabase.from('pricing').update({ price }).eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

// ==========================================
// SERVICES API
// ==========================================

export async function fetchServices(): Promise<Service[]> {
  const localServices = getLocalItem<Service[]>('prox_services', DEFAULT_SERVICES);

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      setLocalItem('prox_services', data as Service[]);
      return data as Service[];
    }
  } catch (err) {
    console.warn('Supabase fetchServices fallback to local cache:', err);
  }

  return localServices;
}

export async function createService(service: Omit<Service, 'id'>): Promise<{ data: Service; error: null }> {
  const newService: Service = {
    ...service,
    id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
  };
  const existing = getLocalItem<Service[]>('prox_services', DEFAULT_SERVICES);
  const updated = [...existing, newService];
  setLocalItem('prox_services', updated);

  try {
    await supabase.from('services').insert(service);
  } catch {
    // Graceful offline fallback
  }

  return { data: newService, error: null };
}

export async function updateService(id: string, updates: Partial<Service>): Promise<{ error: null }> {
  const existing = getLocalItem<Service[]>('prox_services', DEFAULT_SERVICES);
  const updated = existing.map((s) => (s.id === id ? { ...s, ...updates } : s));
  setLocalItem('prox_services', updated);

  try {
    await supabase.from('services').update(updates).eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

export async function deleteService(id: string): Promise<{ error: null }> {
  const existing = getLocalItem<Service[]>('prox_services', DEFAULT_SERVICES);
  const updated = existing.filter((s) => s.id !== id);
  setLocalItem('prox_services', updated);

  try {
    await supabase.from('services').delete().eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

// ==========================================
// PARTNERS API
// ==========================================

export async function fetchPartners(): Promise<Partner[]> {
  const localPartners = getLocalItem<Partner[]>('prox_partners', DEFAULT_PARTNERS);

  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      setLocalItem('prox_partners', data as Partner[]);
      return data as Partner[];
    }
  } catch (err) {
    console.warn('Supabase fetchPartners fallback to local cache:', err);
  }

  return localPartners;
}

export async function createPartner(partner: Omit<Partner, 'id'>): Promise<{ data: Partner; error: null }> {
  const newPartner: Partner = {
    ...partner,
    id: 'prt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
  };
  const existing = getLocalItem<Partner[]>('prox_partners', DEFAULT_PARTNERS);
  const updated = [...existing, newPartner];
  setLocalItem('prox_partners', updated);

  try {
    await supabase.from('partners').insert(partner);
  } catch {
    // Graceful offline fallback
  }

  return { data: newPartner, error: null };
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<{ error: null }> {
  const existing = getLocalItem<Partner[]>('prox_partners', DEFAULT_PARTNERS);
  const updated = existing.map((p) => (p.id === id ? { ...p, ...updates } : p));
  setLocalItem('prox_partners', updated);

  try {
    await supabase.from('partners').update(updates).eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}

export async function deletePartner(id: string): Promise<{ error: null }> {
  const existing = getLocalItem<Partner[]>('prox_partners', DEFAULT_PARTNERS);
  const updated = existing.filter((p) => p.id !== id);
  setLocalItem('prox_partners', updated);

  try {
    await supabase.from('partners').delete().eq('id', id);
  } catch {
    // Graceful offline fallback
  }

  return { error: null };
}
