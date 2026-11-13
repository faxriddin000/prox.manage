import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard,
  Inbox,
  DollarSign,
  Briefcase,
  Building2,
  LogOut,
  ArrowLeft,
  Trash2,
  Plus,
  Save,
  Check,
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  Shield,
  Settings,
  Sparkles,
  Edit2,
  ExternalLink,
  AlertTriangle,
  Globe,
  KeyRound,
  RefreshCw,
  Lightbulb,
  FileText,
  LayoutGrid,
  Megaphone,
  BarChart3,
  Target,
  Palette,
  Compass,
  Users,
  Smartphone,
  CreditCard,
  PenTool,
  Headphones,
  Bot,
  Circle,
  Copy,
  Send,
  Eye,
  EyeOff,
  MessageCircle,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import {
  fetchLeads,
  updateLeadStatus,
  deleteLead,
  fetchPricing,
  updatePricing,
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchPartners,
  createPartner,
  updatePartner,
  deletePartner,
  type Lead,
  type Pricing,
  type Service,
  type Partner,
} from '@/lib/supabase';
import { getActiveAdminCredentials, setCustomAdminPassword } from '@/lib/useAuth';
import { getTelegramConfig, setTelegramConfig, sendTelegramTestMessage } from '@/lib/telegram';

type Props = {
  onSignOut: () => void;
  onBack: () => void;
};

type Tab = 'dashboard' | 'leads' | 'pricing' | 'services' | 'partners' | 'telegram' | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function AdminDashboard({ onSignOut, onBack }: Props) {
  const { t, lang, setLang } = useLang();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast notification dispatcher
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const loadAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [leadsData, pricingData, servicesData, partnersData] = await Promise.all([
        fetchLeads(),
        fetchPricing(),
        fetchServices(),
        fetchPartners(),
      ]);

      setLeads(leadsData);
      setPricing(pricingData);
      setServices(servicesData);
      setPartners(partnersData);

      if (isRefresh) {
        showToast(lang === 'uz' ? "Ma'lumotlar yangilandi" : 'Данные обновлены', 'info');
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast(lang === 'uz' ? "Yuklashda xatolik yuz berdi" : 'Ошибка при загрузке данных', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lang, showToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const newLeadsCount = useMemo(() => leads.filter((l) => l.status === 'new').length, [leads]);
  const contactedLeadsCount = useMemo(() => leads.filter((l) => l.status === 'contacted').length, [leads]);
  const closedLeadsCount = useMemo(() => leads.filter((l) => l.status === 'closed').length, [leads]);

  const tabs: Array<{ key: Tab; icon: typeof LayoutDashboard; label: string }> = [
    { key: 'dashboard', icon: LayoutDashboard, label: t.admin.dashboard },
    { key: 'leads', icon: Inbox, label: t.admin.leads },
    { key: 'pricing', icon: DollarSign, label: t.admin.pricing },
    { key: 'services', icon: Briefcase, label: t.admin.services },
    { key: 'partners', icon: Building2, label: t.admin.partners },
    { key: 'telegram', icon: Send, label: t.admin.telegramBot },
    { key: 'settings', icon: Settings, label: t.admin.settings },
  ];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white relative flex flex-col font-sans selection:bg-accent-400/30 selection:text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Toast Notifications */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all animate-fade-up ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-300'
                : 'bg-accent-950/80 border-accent-500/30 text-accent-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Sparkles className="w-4 h-4 text-accent-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-ink-950/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 via-accent-500 to-violet-600 flex items-center justify-center shadow-glow shrink-0">
              <Shield className="w-5 h-5 text-ink-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-base tracking-tight">PROX</span>
                <span className="text-[10px] font-semibold bg-accent-400/15 text-accent-400 border border-accent-400/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium">{t.admin.activeStatus}</span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh Button */}
            <button
              onClick={() => loadAllData(true)}
              disabled={refreshing}
              title="Yangilash"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-accent-400' : ''}`} />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'uz'
                    ? 'bg-accent-400/20 text-accent-400 border border-accent-400/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'ru'
                    ? 'bg-accent-400/20 text-accent-400 border border-accent-400/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>

            {/* Back to Website */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.admin.backToSite}</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 text-xs sm:text-sm text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.admin.logout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="sticky top-24 space-y-4">
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 p-1.5 rounded-2xl bg-ink-900/60 border border-white/[0.08] backdrop-blur-xl">
                {tabs.map((tabItem) => {
                  const isActive = tab === tabItem.key;
                  const badge = tabItem.key === 'leads' && newLeadsCount > 0 ? newLeadsCount : null;
                  return (
                    <button
                      key={tabItem.key}
                      onClick={() => setTab(tabItem.key)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-accent-400/20 to-violet-500/10 text-accent-300 border border-accent-400/30 shadow-glow'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <tabItem.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-400' : 'text-gray-400'}`} />
                      <span className="flex-1 truncate">{tabItem.label}</span>
                      {badge !== null && (
                        <span className="bg-gradient-to-r from-accent-400 to-cyan-300 text-ink-950 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={onSignOut}
                  className="hidden lg:flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all mt-1"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{t.admin.logout}</span>
                </button>
              </nav>

              {/* Quick Info Box in Sidebar */}
              <div className="hidden lg:block p-4 rounded-2xl bg-ink-900/40 border border-white/[0.06] backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-accent-400" />
                  <span className="font-semibold text-gray-300">Admin Rejimida</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Barcha o'zgarishlar darhol saytda va ma'lumotlar bazasida yangilanadi.
                </p>
              </div>
            </div>
          </aside>

          {/* Active Tab Main View */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 text-center glass">
                <Loader2 className="w-10 h-10 animate-spin text-accent-400 mb-4" />
                <p className="text-sm text-gray-400">Ma'lumotlar yuklanmoqda...</p>
              </div>
            ) : (
              <>
                {tab === 'dashboard' && (
                  <DashboardView
                    leads={leads}
                    servicesCount={services.length}
                    pricingCount={pricing.length}
                    partnersCount={partners.length}
                    newLeads={newLeadsCount}
                    contactedLeads={contactedLeadsCount}
                    closedLeads={closedLeadsCount}
                    formatDate={formatDate}
                    onGoTab={setTab}
                    onStatusChange={async (lead, nextStatus) => {
                      await updateLeadStatus(lead.id, nextStatus);
                      setLeads((prev) =>
                        prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l))
                      );
                      showToast(lang === 'uz' ? "Holat yangilandi" : 'Статус обновлен');
                    }}
                  />
                )}

                {tab === 'leads' && (
                  <LeadsView
                    leads={leads}
                    setLeads={setLeads}
                    formatDate={formatDate}
                    showToast={showToast}
                    lang={lang}
                    t={t}
                  />
                )}

                {tab === 'pricing' && (
                  <PricingView
                    pricing={pricing}
                    setPricing={setPricing}
                    showToast={showToast}
                    lang={lang}
                    t={t}
                  />
                )}

                {tab === 'services' && (
                  <ServicesView
                    services={services}
                    setServices={setServices}
                    showToast={showToast}
                    lang={lang}
                    t={t}
                  />
                )}

                {tab === 'partners' && (
                  <PartnersView
                    partners={partners}
                    setPartners={setPartners}
                    showToast={showToast}
                    lang={lang}
                    t={t}
                  />
                )}

                {tab === 'telegram' && (
                  <TelegramBotView
                    showToast={showToast}
                    lang={lang}
                    t={t}
                  />
                )}

                {tab === 'settings' && (
                  <SettingsView
                    showToast={showToast}
                    lang={lang}
                    t={t}
                    leadsCount={leads.length}
                    onReload={() => loadAllData(true)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================

function DashboardView({
  leads,
  servicesCount,
  pricingCount,
  partnersCount,
  newLeads,
  contactedLeads,
  closedLeads,
  formatDate,
  onGoTab,
  onStatusChange,
}: {
  leads: Lead[];
  servicesCount: number;
  pricingCount: number;
  partnersCount: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
  formatDate: (d: string) => string;
  onGoTab: (tab: Tab) => void;
  onStatusChange: (lead: Lead, nextStatus: Lead['status']) => void;
}) {
  const { t } = useLang();
  const recentLeads = leads.slice(0, 5);

  const stats = [
    {
      label: t.admin.totalLeads,
      value: leads.length,
      icon: Inbox,
      color: 'text-accent-400',
      bg: 'bg-accent-400/10 border-accent-400/20',
      glow: 'shadow-glow',
    },
    {
      label: t.admin.newLeads,
      value: newLeads,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
      glow: '',
      pulse: newLeads > 0,
    },
    {
      label: t.admin.contacted,
      value: contactedLeads,
      icon: TrendingUp,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10 border-violet-400/20',
      glow: '',
    },
    {
      label: t.admin.closed,
      value: closedLeads,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
      glow: '',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass p-6 sm:p-8 relative overflow-hidden border border-white/10 bg-gradient-to-r from-ink-900/90 via-ink-850/80 to-ink-900/90">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boshqaruv Paneli</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              PROX Marketing Agency
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Murojaatlar, xizmatlar, narxlar va mijozlar ma'lumotlarini markazlashtirilgan tarzda boshqaring.
            </p>
          </div>
          <button
            onClick={() => onGoTab('leads')}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-glow transition-all whitespace-nowrap"
          >
            <Inbox className="w-4 h-4" />
            <span>Murojaatlarni ko'rish</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass p-5 border border-white/[0.08] transition-all hover:border-white/20 ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.pulse && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
              )}
            </div>
            <p className="font-display text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grid: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads (2 cols) */}
        <div className="lg:col-span-2 glass p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-accent-400" />
              <h3 className="font-display font-semibold text-white text-base">So'nggi murojaatlar</h3>
            </div>
            <button
              onClick={() => onGoTab('leads')}
              className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Barchasini ko'rish ({leads.length})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-700" />
              <p>{t.admin.noLeads}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400/10 to-violet-500/10 border border-white/10 flex items-center justify-center text-accent-400 font-bold text-xs shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 border border-white/10">
                          {lead.service_type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{lead.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      {formatDate(lead.created_at)}
                    </span>
                    <button
                      onClick={() => {
                        const next: Lead['status'] =
                          lead.status === 'new'
                            ? 'contacted'
                            : lead.status === 'contacted'
                            ? 'closed'
                            : 'new';
                        onStatusChange(lead, next);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all hover:scale-105 ${
                        lead.status === 'new'
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          : lead.status === 'contacted'
                          ? 'bg-violet-400/10 text-violet-400 border-violet-400/30'
                          : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                      }`}
                    >
                      {lead.status === 'new'
                        ? t.admin.newLeads
                        : lead.status === 'contacted'
                        ? t.admin.contacted
                        : t.admin.closed}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Summary (1 col) */}
        <div className="space-y-4">
          <div className="glass p-6 border border-white/[0.08]">
            <h3 className="font-display font-semibold text-white text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Kontent Ko'rsatkichlari
            </h3>
            <div className="space-y-3">
              <div
                onClick={() => onGoTab('services')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-accent-400" />
                  <span className="text-xs font-medium text-gray-300">Faol Xizmatlar</span>
                </div>
                <span className="text-sm font-bold text-white">{servicesCount} ta</span>
              </div>

              <div
                onClick={() => onGoTab('pricing')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-gray-300">Tarif Rejalari</span>
                </div>
                <span className="text-sm font-bold text-white">{pricingCount} ta</span>
              </div>

              <div
                onClick={() => onGoTab('partners')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-medium text-gray-300">Hamkorlar</span>
                </div>
                <span className="text-sm font-bold text-white">{partnersCount} ta</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 border border-white/[0.08] bg-gradient-to-br from-ink-900/60 to-accent-950/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-400 mb-2">
              Tezkor Harakatlar
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onGoTab('services')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
              >
                <span>+ Yangi xizmat qo'shish</span>
                <Plus className="w-3.5 h-3.5 text-accent-400" />
              </button>
              <button
                onClick={() => onGoTab('pricing')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
              >
                <span>Tarif narxlarini o'zgartirish</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => onGoTab('partners')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
              >
                <span>+ Yangi hamkor qo'shish</span>
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. LEADS MANAGER
// ==========================================

function LeadsView({
  leads,
  setLeads,
  formatDate,
  showToast,
  lang,
  t,
}: {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  formatDate: (d: string) => string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.toLowerCase().includes(search.toLowerCase()) ||
        (lead.message && lead.message.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchService = serviceFilter === 'all' || lead.service_type === serviceFilter;

      return matchSearch && matchStatus && matchService;
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const cycleStatus = async (lead: Lead) => {
    const next: Lead['status'] =
      lead.status === 'new' ? 'contacted' : lead.status === 'contacted' ? 'closed' : 'new';
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    await updateLeadStatus(lead.id, next);
    showToast(lang === 'uz' ? `Holat o'zgartirildi: ${next}` : `Статус изменен: ${next}`, 'success');
  };

  const handleDelete = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setDeleteConfirmId(null);
    if (selectedLead?.id === id) setSelectedLead(null);
    await deleteLead(id);
    showToast(lang === 'uz' ? "Murojaat o'chirildi" : 'Заявка удалена', 'info');
  };

  const exportLeads = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `prox_leads_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(lang === 'uz' ? 'Fayl yuklab olindi' : 'Файл скачан', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.admin.leads}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-400/10 text-accent-400 border border-accent-400/20">
              {filteredLeads.length} / {leads.length}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Mijozlar tomonidan saytdan yuborilgan barcha konsultatsiya so'rovlari
          </p>
        </div>

        <button
          onClick={exportLeads}
          className="self-start sm:self-auto flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-white/10 transition-all"
        >
          <Download className="w-4 h-4 text-accent-400" />
          <span>{t.admin.export} (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 border border-white/[0.08] flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.search}
            className="w-full bg-ink-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-accent-400/20 text-accent-300 border border-accent-400/30'
                  : 'bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06]'
              }`}
            >
              {status === 'all'
                ? t.admin.all
                : status === 'new'
                ? t.admin.newLeads
                : status === 'contacted'
                ? t.admin.contacted
                : t.admin.closed}
            </button>
          ))}
        </div>

        {/* Service Type Dropdown */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="bg-ink-900/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-300 focus:border-accent-400/60 focus:outline-none"
        >
          <option value="all">Barcha xizmatlar</option>
          <option value="SMM">SMM</option>
          <option value="Marketing">Marketing</option>
          <option value="IT">IT</option>
        </select>
      </div>

      {/* Leads Table / Cards */}
      {filteredLeads.length === 0 ? (
        <div className="glass p-12 text-center border border-white/[0.08]">
          <Inbox className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">{t.admin.noResults}</p>
          <p className="text-xs text-gray-500 mt-1">Qidiruv yoki filtr mezonlarini o'zgartirib ko'ring</p>
        </div>
      ) : (
        <div className="glass overflow-hidden border border-white/[0.08]">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.admin.name}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.admin.phone}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.admin.service}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.admin.date}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.admin.status}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400/10 to-violet-500/10 border border-white/10 flex items-center justify-center text-accent-400 font-bold text-xs">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors">
                            {lead.name}
                          </p>
                          {lead.message && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{lead.message}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-300 hover:text-accent-400 font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-accent-400" />
                        <span>{lead.phone}</span>
                      </a>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                        lead.service_type === 'SMM'
                          ? 'bg-accent-400/10 text-accent-400 border-accent-400/20'
                          : lead.service_type === 'Marketing'
                          ? 'bg-violet-400/10 text-violet-400 border-violet-400/20'
                          : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                      }`}>
                        {lead.service_type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-400">
                      {formatDate(lead.created_at)}
                    </td>

                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => cycleStatus(lead)}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all hover:scale-105 ${
                          lead.status === 'new'
                            ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                            : lead.status === 'contacted'
                            ? 'bg-violet-400/10 text-violet-400 border-violet-400/30'
                            : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                        }`}
                      >
                        {lead.status === 'new'
                          ? t.admin.newLeads
                          : lead.status === 'contacted'
                          ? t.admin.contacted
                          : t.admin.closed}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          title="Batafsil ko'rish"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          title={t.admin.delete}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-white/[0.06]">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-accent-400/10 border border-accent-400/20 flex items-center justify-center text-accent-400 font-bold text-xs shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{lead.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleStatus(lead);
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${
                      lead.status === 'new'
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                        : lead.status === 'contacted'
                        ? 'bg-violet-400/10 text-violet-400 border-violet-400/30'
                        : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                    }`}
                  >
                    {lead.status === 'new'
                      ? t.admin.newLeads
                      : lead.status === 'contacted'
                      ? t.admin.contacted
                      : t.admin.closed}
                  </button>
                </div>

                {lead.message && (
                  <p className="text-xs text-gray-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04] line-clamp-2">
                    {lead.message}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span className="font-semibold text-accent-400">{lead.service_type}</span>
                  <span>{formatDate(lead.created_at)}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-1.5 text-accent-400 hover:text-white"
                      title="Qo'ng'iroq qilish"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="glass max-w-lg w-full p-6 sm:p-7 border border-white/15 bg-ink-900/90 shadow-glow-lg animate-fade-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-violet-500 flex items-center justify-center text-ink-950 font-bold text-lg shadow-glow">
                {selectedLead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">{selectedLead.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(selectedLead.created_at)}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {t.admin.phone}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-base font-mono font-semibold text-accent-400 hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{selectedLead.phone}</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedLead.phone);
                      showToast('Telefon raqam nusxalandi', 'info');
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Nusxalash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {t.admin.service}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-accent-400/10 text-accent-400 border border-accent-400/20 inline-block">
                  {selectedLead.service_type}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {t.admin.message}
                </span>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message || 'Izoh qoldirilmagan.'}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  {t.admin.status}
                </span>
                <div className="flex items-center gap-2">
                  {(['new', 'contacted', 'closed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateLeadStatus(selectedLead.id, s);
                        setSelectedLead({ ...selectedLead, status: s });
                        setLeads((prev) =>
                          prev.map((l) => (l.id === selectedLead.id ? { ...l, status: s } : l))
                        );
                        showToast(`Holat: ${s}`, 'success');
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selectedLead.status === s
                          ? s === 'new'
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : s === 'contacted'
                            ? 'bg-violet-400/20 text-violet-300 border-violet-400/40'
                            : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {s === 'new'
                        ? t.admin.newLeads
                        : s === 'contacted'
                        ? t.admin.contacted
                        : t.admin.closed}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setDeleteConfirmId(selectedLead.id)}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.admin.delete}</span>
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="bg-accent-400 text-ink-950 hover:bg-accent-300 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-glow"
              >
                {t.admin.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="glass max-w-sm w-full p-6 border border-rose-500/30 bg-ink-900/95 shadow-glow-lg text-center animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-1">
              {t.admin.confirmDelete}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Bu amal qaytarilmaydi. Murojaat ma'lumotlar bazasidan butunlay o'chiriladi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-colors"
              >
                {t.admin.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-colors"
              >
                {t.admin.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. PRICING MANAGER
// ==========================================

function PricingView({
  pricing,
  setPricing,
  showToast,
  lang,
  t,
}: {
  pricing: Pricing[];
  setPricing: React.Dispatch<React.SetStateAction<Pricing[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
}) {
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handlePriceChange = (id: string, val: string) => {
    setEditing((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async (item: Pricing) => {
    const val = editing[item.id] !== undefined ? editing[item.id] : String(item.price);
    const newPrice = parseFloat(val);
    if (isNaN(newPrice) || newPrice < 0) {
      showToast('Iltimos to\'g\'ri narx kiriting', 'error');
      return;
    }

    setSavingId(item.id);
    await updatePricing(item.id, newPrice);
    setPricing((prev) => prev.map((p) => (p.id === item.id ? { ...p, price: newPrice } : p)));
    setSavingId(null);
    showToast(lang === 'uz' ? 'Tarif narxi yangilandi!' : 'Цена тарифа обновлена!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>{t.admin.pricing}</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            {pricing.length} ta paket
          </span>
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Saytdagi SMM va Marketing tarif paketlari narxlarini tahrirlash
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricing.map((item) => {
          const currentInput = editing[item.id] !== undefined ? editing[item.id] : String(item.price);
          const hasChanged = String(item.price) !== currentInput;
          const isSaving = savingId === item.id;

          return (
            <div
              key={item.id}
              className="glass p-5 border border-white/[0.08] hover:border-accent-400/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">
                      {lang === 'uz' ? item.label_uz : item.label_ru}
                    </h3>
                    <span className="text-[11px] font-mono text-gray-400 block mt-0.5">
                      {item.key}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-accent-300 border border-white/10 uppercase">
                    {lang === 'uz' ? item.period_uz : item.period_ru}
                  </span>
                </div>

                <div className="my-4 p-3 rounded-xl bg-ink-950/60 border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1 font-medium">Hozirgi narx:</span>
                  <div className="text-2xl font-display font-bold text-emerald-400">
                    ${item.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={currentInput}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    className="w-full bg-ink-900/90 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-accent-400/60 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
                  />
                </div>

                <button
                  onClick={() => handleSave(item)}
                  disabled={isSaving || !hasChanged}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    hasChanged
                      ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-ink-950 shadow-glow hover:opacity-90'
                      : 'bg-white/[0.04] text-gray-400 cursor-not-allowed border border-white/[0.06]'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.admin.save}...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{hasChanged ? t.admin.save : t.admin.saved}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. SERVICES MANAGER
// ==========================================

const AVAILABLE_ICONS = [
  'Lightbulb', 'FileText', 'LayoutGrid', 'Megaphone', 'Shield', 'BarChart3',
  'Target', 'Palette', 'Compass', 'Users', 'TrendingUp', 'Globe',
  'Smartphone', 'CreditCard', 'PenTool', 'Headphones', 'Bot', 'CheckCircle',
];

function ServicesView({
  services,
  setServices,
  showToast,
  lang,
  t,
}: {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
}) {
  const [activePillar, setActivePillar] = useState<Service['pillar']>('SMM');
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formPillar, setFormPillar] = useState<Service['pillar']>('SMM');
  const [formTitleUz, setFormTitleUz] = useState('');
  const [formTitleRu, setFormTitleRu] = useState('');
  const [formDescUz, setFormDescUz] = useState('');
  const [formDescRu, setFormDescRu] = useState('');
  const [formIcon, setFormIcon] = useState('CheckCircle');

  const filteredServices = services.filter((s) => s.pillar === activePillar);

  const openAdd = () => {
    setFormPillar(activePillar);
    setFormTitleUz('');
    setFormTitleRu('');
    setFormDescUz('');
    setFormDescRu('');
    setFormIcon('CheckCircle');
    setEditingService(null);
    setIsAdding(true);
  };

  const openEdit = (service: Service) => {
    setFormPillar(service.pillar);
    setFormTitleUz(service.title_uz);
    setFormTitleRu(service.title_ru);
    setFormDescUz(service.description_uz || '');
    setFormDescRu(service.description_ru || '');
    setFormIcon(service.icon_name || 'CheckCircle');
    setEditingService(service);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleUz.trim() || !formTitleRu.trim()) {
      showToast('Iltimos, nomini ikkala tilda kiriting', 'error');
      return;
    }

    if (editingService) {
      // Update
      const updates: Partial<Service> = {
        pillar: formPillar,
        title_uz: formTitleUz.trim(),
        title_ru: formTitleRu.trim(),
        description_uz: formDescUz.trim() || null,
        description_ru: formDescRu.trim() || null,
        icon_name: formIcon,
      };

      await updateService(editingService.id, updates);
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...updates } : s))
      );
      showToast(lang === 'uz' ? 'Xizmat yangilandi!' : 'Услуга обновлена!', 'success');
    } else {
      // Create
      const newServiceData = {
        pillar: formPillar,
        title_uz: formTitleUz.trim(),
        title_ru: formTitleRu.trim(),
        description_uz: formDescUz.trim() || null,
        description_ru: formDescRu.trim() || null,
        icon_name: formIcon,
        sort_order: services.filter((s) => s.pillar === formPillar).length + 1,
      };

      const res = await createService(newServiceData);
      setServices((prev) => [...prev, res.data]);
      showToast(lang === 'uz' ? 'Yangi xizmat qo\'shildi!' : 'Новая услуга добавлена!', 'success');
    }

    setIsAdding(false);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
    showToast(lang === 'uz' ? 'Xizmat o\'chirildi' : 'Услуга удалена', 'info');
  };

  const renderIcon = (name: string, className = 'w-5 h-5') => {
    const Icon = ((Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) || Circle;
    return <Icon className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.admin.services}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-400/10 text-accent-400 border border-accent-400/20">
              {services.length} ta
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            SMM, Marketing va IT yo'nalishlaridagi xizmatlar ro'yxatini tahrirlash
          </p>
        </div>

        <button
          onClick={openAdd}
          className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNew}</span>
        </button>
      </div>

      {/* Pillar Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-ink-900/60 border border-white/[0.08] backdrop-blur-xl w-fit">
        {(['SMM', 'Marketing', 'IT'] as const).map((pillar) => (
          <button
            key={pillar}
            onClick={() => setActivePillar(pillar)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePillar === pillar
                ? 'bg-accent-400/20 text-accent-300 border border-accent-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {pillar} ({services.filter((s) => s.pillar === pillar).length})
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="glass p-4 border border-white/[0.08] hover:border-accent-400/30 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent-400/10 border border-accent-400/20 flex items-center justify-center text-accent-400 shrink-0 mt-0.5">
                {renderIcon(service.icon_name, 'w-5 h-5')}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors">
                  {lang === 'uz' ? service.title_uz : service.title_ru}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {lang === 'uz' ? service.description_uz : service.description_ru}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-gray-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                    {service.icon_name}
                  </span>
                  <span className="text-[10px] font-semibold text-accent-400">
                    {service.pillar}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => openEdit(service)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-accent-400 hover:bg-white/[0.05] transition-colors"
                title={t.admin.edit}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(service.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={t.admin.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isAdding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="glass max-w-lg w-full p-6 sm:p-7 border border-white/15 bg-ink-900/95 shadow-glow-lg animate-fade-up relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-white mb-4">
              {editingService ? t.admin.edit : t.admin.addNew}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  {t.admin.pillar}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SMM', 'Marketing', 'IT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPillar(p)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        formPillar === p
                          ? 'bg-accent-400/20 text-accent-300 border-accent-400/40'
                          : 'bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  {t.admin.labelUz} *
                </label>
                <input
                  type="text"
                  value={formTitleUz}
                  onChange={(e) => setFormTitleUz(e.target.value)}
                  required
                  placeholder="Masalan: Kontent yaratish"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  {t.admin.labelRu} *
                </label>
                <input
                  type="text"
                  value={formTitleRu}
                  onChange={(e) => setFormTitleRu(e.target.value)}
                  required
                  placeholder="Например: Создание контента"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Izoh (UZ)
                </label>
                <textarea
                  value={formDescUz}
                  onChange={(e) => setFormDescUz(e.target.value)}
                  rows={2}
                  placeholder="Qisqacha ta'rif (ixtiyoriy)"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Izoh (RU)
                </label>
                <textarea
                  value={formDescRu}
                  onChange={(e) => setFormDescRu(e.target.value)}
                  rows={2}
                  placeholder="Краткое описание (необязательно)"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>{t.admin.icon}</span>
                  <span className="text-[11px] font-mono text-accent-400">{formIcon}</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 rounded-xl bg-ink-950/80 border border-white/10">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormIcon(iconName)}
                      className={`p-2 rounded-lg border transition-all ${
                        formIcon === iconName
                          ? 'bg-accent-400/20 text-accent-300 border-accent-400/40 shadow-glow'
                          : 'bg-white/[0.02] text-gray-400 border-white/[0.04] hover:text-white hover:bg-white/[0.06]'
                      }`}
                      title={iconName}
                    >
                      {renderIcon(iconName, 'w-4 h-4')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 transition-colors"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 shadow-glow transition-all"
                >
                  {t.admin.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="glass max-w-sm w-full p-6 border border-rose-500/30 bg-ink-900/95 shadow-glow-lg text-center animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-1">
              {t.admin.confirmDelete}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Ushbu xizmat saytdan butunlay o'chiriladi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-colors"
              >
                {t.admin.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-colors"
              >
                {t.admin.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. PARTNERS MANAGER
// ==========================================

function PartnersView({
  partners,
  setPartners,
  showToast,
  lang,
  t,
}: {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');

  const openAdd = () => {
    setFormName('');
    setFormLogoUrl('');
    setEditingPartner(null);
    setIsAdding(true);
  };

  const openEdit = (partner: Partner) => {
    setFormName(partner.name);
    setFormLogoUrl(partner.logo_url || '');
    setEditingPartner(partner);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Iltimos, hamkor nomini kiriting', 'error');
      return;
    }

    if (editingPartner) {
      const updates = {
        name: formName.trim(),
        logo_url: formLogoUrl.trim() || null,
      };
      await updatePartner(editingPartner.id, updates);
      setPartners((prev) =>
        prev.map((p) => (p.id === editingPartner.id ? { ...p, ...updates } : p))
      );
      showToast(lang === 'uz' ? 'Hamkor ma\'lumotlari yangilandi!' : 'Данные партнёра обновлены!', 'success');
    } else {
      const newPartnerData = {
        name: formName.trim(),
        logo_url: formLogoUrl.trim() || null,
        sort_order: partners.length + 1,
      };
      const res = await createPartner(newPartnerData);
      setPartners((prev) => [...prev, res.data]);
      showToast(lang === 'uz' ? 'Yangi hamkor qo\'shildi!' : 'Новый партнёр добавлен!', 'success');
    }

    setIsAdding(false);
    setEditingPartner(null);
  };

  const handleDelete = async (id: string) => {
    await deletePartner(id);
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    showToast(lang === 'uz' ? 'Hamkor o\'chirildi' : 'Партнёр удален', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.admin.partners}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20">
              {partners.length} ta
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Saytdagi marquee karuselida ko'rinadigan brend va hamkorlar
          </p>
        </div>

        <button
          onClick={openAdd}
          className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNew}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="glass p-5 border border-white/[0.08] hover:border-violet-400/30 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors truncate">
                  {partner.name}
                </h4>
                {partner.logo_url ? (
                  <p className="text-[11px] text-gray-500 truncate max-w-[160px] font-mono">
                    {partner.logo_url}
                  </p>
                ) : (
                  <span className="text-[10px] text-gray-500 italic">Logo yo'q (nomi ko'rinadi)</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => openEdit(partner)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-accent-400 hover:bg-white/[0.05] transition-colors"
                title={t.admin.edit}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(partner.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={t.admin.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Partner Modal */}
      {isAdding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="glass max-w-md w-full p-6 sm:p-7 border border-white/15 bg-ink-900/95 shadow-glow-lg animate-fade-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-white mb-4">
              {editingPartner ? t.admin.edit : t.admin.addNew}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  {t.admin.partnerName} *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="Masalan: Apex Group"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  {t.admin.logoUrl}
                </label>
                <input
                  type="text"
                  value={formLogoUrl}
                  onChange={(e) => setFormLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.svg (ixtiyoriy)"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 transition-colors"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 shadow-glow transition-all"
                >
                  {t.admin.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="glass max-w-sm w-full p-6 border border-rose-500/30 bg-ink-900/95 shadow-glow-lg text-center animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-1">
              {t.admin.confirmDelete}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Hamkor ro'yxatdan o'chiriladi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-colors"
              >
                {t.admin.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-colors"
              >
                {t.admin.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. TELEGRAM BOT MANAGEMENT VIEW
// ==========================================

function TelegramBotView({
  showToast,
  lang,
  t,
}: {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
}) {
  const currentConfig = getTelegramConfig();
  const [token, setToken] = useState(currentConfig.token);
  const [chatId, setChatId] = useState(currentConfig.chatId);
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const isConfigured = Boolean(token.trim() && chatId.trim());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !chatId.trim()) {
      showToast('Token va Chat ID kiritilishi shart', 'error');
      return;
    }
    setTelegramConfig(token.trim(), chatId.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
    showToast(t.admin.botSaved, 'success');
  };

  const handleTestBot = async () => {
    setTesting(true);
    setTestResult(null);

    const res = await sendTelegramTestMessage(token, chatId);
    setTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: '✅ Prox Marketing Admin: Telegram bot muvaffaqiyatli ulandi! Test xabari Telegram profilingizga yetkazildi.',
      });
      showToast(t.admin.botTestSuccess, 'success');
    } else {
      let detailedErr = res.error || 'Telegram xatosi';
      if (detailedErr.includes('chat not found')) {
        detailedErr =
          "Xatolik: 'Chat not found'. Iltimos, Telegram ilovasida @boltprox_bot ga kiring, /start tugmasini bosing va qaytadan 'Sinab ko\'rish' tugmasini bosing!";
      } else if (detailedErr.includes('Unauthorized')) {
        detailedErr = "Xatolik: 'Unauthorized'. Kiritilgan Bot Tokeni yaroqsiz.";
      }
      setTestResult({
        success: false,
        message: detailedErr,
      });
      showToast(detailedErr, 'error');
    }
  };

  const restoreDefault = () => {
    const defaultToken = '9266574853:AAGnXIDLaXzu9SREvFfu9ZCjJNnmlGtMpLs';
    const defaultChat = '8990136215';
    setToken(defaultToken);
    setChatId(defaultChat);
    setTelegramConfig(defaultToken, defaultChat);
    showToast('Standart Telegram sozlamalari tiklandi', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Send className="w-6 h-6 text-accent-400" />
            <span>{t.admin.telegramBot}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Saytdagi har bir yangi murojaatni real-vaqtda Telegram guruhingiz yoki profilingizga yo'naltirish
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 p-2 px-3.5 rounded-2xl glass border border-white/10 bg-ink-900/60 backdrop-blur-xl">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-xs font-semibold text-white">
            {isConfigured ? t.admin.botConnected : t.admin.botNotConfigured}
          </span>
          <span className="text-[10px] text-accent-400 bg-accent-400/10 px-2 py-0.5 rounded-full border border-accent-400/20 font-mono">
            @boltprox_bot
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Test Button (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass p-6 sm:p-7 border border-white/[0.08] shadow-glow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5 text-accent-400" />
                <h3 className="font-display font-semibold text-base">Bot Konfiguratsiyasi</h3>
              </div>
              <button
                type="button"
                onClick={restoreDefault}
                className="text-[11px] text-gray-400 hover:text-accent-300 transition-colors"
              >
                Standart holatga qaytarish
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>{t.admin.botToken} *</span>
                  <span className="text-[10px] text-gray-500 font-mono">BotFather token</span>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="9266574853:AAGnX..."
                    className="w-full bg-ink-950/80 border border-white/10 rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm text-white font-mono placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>{t.admin.chatId} *</span>
                  <span className="text-[10px] text-gray-500 font-mono">User ID / Kanal ID</span>
                </label>
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  required
                  placeholder="Masalan: 8990136215 yoki -100..."
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.admin.botSaved}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm border border-white/10 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.admin.save}</span>
                </button>

                {/* Test Bot Button */}
                <button
                  type="button"
                  onClick={handleTestBot}
                  disabled={testing || !isConfigured}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-400 via-accent-500 to-cyan-300 hover:from-accent-300 hover:to-cyan-200 text-ink-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-ink-950" />
                      <span>{t.admin.testingBot}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.admin.testBot}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Test Result Message Container */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border backdrop-blur-xl animate-fade-up ${
                testResult.success
                  ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm leading-relaxed">
                  <p className="font-semibold mb-1">
                    {testResult.success ? 'Muvaffaqiyatli Sinov' : 'Sinovda Xatolik'}
                  </p>
                  <p>{testResult.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Guide & Bot Link (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass p-6 border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center gap-2 text-accent-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-display font-semibold text-white text-sm">
                {t.admin.botQuickGuide}
              </h3>
            </div>

            <ol className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent-400/20 text-accent-400 font-bold flex items-center justify-center text-[10px] mt-0.5">
                  1
                </span>
                <span>
                  Telegram ilovangizda{' '}
                  <a
                    href="https://t.me/boltprox_bot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-400 underline font-semibold hover:text-white"
                  >
                    @boltprox_bot
                  </a>{' '}
                  manziliga o'ting.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent-400/20 text-accent-400 font-bold flex items-center justify-center text-[10px] mt-0.5">
                  2
                </span>
                <span>
                  Bot ichidagi <b>/start</b> tugmasini bosing (bu botga xabar yuborish ruxsatini beradi).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent-400/20 text-accent-400 font-bold flex items-center justify-center text-[10px] mt-0.5">
                  3
                </span>
                <span>
                  O'zingizning Chat ID raqamingizni kiriting (Standart: <code className="text-white font-mono bg-white/[0.06] px-1 rounded">8990136215</code>).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent-400/20 text-accent-400 font-bold flex items-center justify-center text-[10px] mt-0.5">
                  4
                </span>
                <span>
                  <b>"Sinab ko'rish"</b> tugmasini bosib, botning ishlashini darhol tekshiring!
                </span>
              </li>
            </ol>

            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <a
                href="https://t.me/boltprox_bot"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-400/10 hover:bg-accent-400/20 text-accent-300 font-semibold text-xs border border-accent-400/30 transition-all"
              >
                <span>Telegram'da Botni Ochish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. SETTINGS VIEW (Password & Config)
// ==========================================

function SettingsView({
  showToast,
  lang,
  t,
  leadsCount,
  onReload,
}: {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: string;
  t: any;
  leadsCount: number;
  onReload: () => void;
}) {
  const creds = getActiveAdminCredentials();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Iltimos parolni kiriting', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t.admin.passwordMismatch, 'error');
      return;
    }

    setCustomAdminPassword(newPassword.trim());
    setPasswordSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    showToast(t.admin.passwordChanged, 'success');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const resetAllToDefault = () => {
    if (confirm("Haqiqatdan ham barcha lokal keshni tozalab, ma'lumotlarni qayta yuklamoqchimisiz?")) {
      localStorage.removeItem('prox_leads');
      localStorage.removeItem('prox_pricing');
      localStorage.removeItem('prox_services');
      localStorage.removeItem('prox_partners');
      onReload();
      showToast('Kesh tozalandi', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
          {t.admin.settings}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Admin xavfsizligi, tizim sozlamalari va ma'lumotlar boshqaruvi
        </p>
      </div>

      {/* Admin Password Change Form */}
      <div className="glass p-6 sm:p-7 border border-white/[0.08]">
        <div className="flex items-center gap-2.5 text-accent-400 mb-4">
          <KeyRound className="w-5 h-5" />
          <h3 className="font-display font-semibold text-white text-base">
            {t.admin.changePassword}
          </h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400 space-y-1">
            <p>
              <strong className="text-gray-300">Faol Login:</strong>{' '}
              <span className="font-mono text-accent-400">{creds.username}</span>
            </p>
            <p>
              <strong className="text-gray-300">Faol Parol:</strong>{' '}
              <span className="font-mono text-violet-300">{creds.password}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {t.admin.newPassword}
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Yangi parol (masalan: prox2026)"
              className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {t.admin.confirmPassword}
            </label>
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Parolni qayta kiriting"
              className="w-full bg-ink-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none"
            />
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.admin.passwordChanged}</span>
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 text-ink-950 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-glow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t.admin.save}</span>
          </button>
        </form>
      </div>

      {/* System Status Box */}
      <div className="glass p-6 border border-white/[0.08] space-y-4">
        <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Tizim Ma'lumotlari
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-gray-500 block mb-0.5">Xavfsizlik & Autentifikatsiya:</span>
            <span className="font-semibold text-white font-mono">Custom Admin + Supabase Auth</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-gray-500 block mb-0.5">Ma'lumotlar Bazasi:</span>
            <span className="font-semibold text-white font-mono">Supabase Cloud + Local Cache</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-gray-500 block mb-0.5">Murojaatlar soni:</span>
            <span className="font-semibold text-accent-400 font-mono">{leadsCount} ta</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-gray-500 block mb-0.5">Status:</span>
            <span className="font-semibold text-emerald-400 font-mono">ONLINE (Faol)</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={resetAllToDefault}
            className="text-xs text-gray-400 hover:text-rose-400 py-1 transition-colors"
          >
            Keshni tozalash va standart holatga qaytarish
          </button>
        </div>
      </div>
    </div>
  );
}
