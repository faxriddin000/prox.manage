import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { fetchServices, type Service } from '@/lib/supabase';

type Props = {
  onConsultation: () => void;
};

interface PillarVisual {
  image: string;
  badge: string;
  tagline: string;
  highlights: string[];
}

export function Services({ onConsultation }: Props) {
  const { t, lang } = useLang();
  const [services, setServices] = useState<Service[]>([]);
  const [activePillar, setActivePillar] = useState<'SMM' | 'Marketing' | 'IT'>('SMM');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchServices().then((data) => {
      if (data) setServices(data);
    });
  }, []);

  const pillars: Array<'SMM' | 'Marketing' | 'IT'> = ['SMM', 'Marketing', 'IT'];

  const pillarVisuals: Record<'SMM' | 'Marketing' | 'IT', PillarVisual> = {
    SMM: {
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
      badge: 'SMM & Kontent Ishlab Chiqish',
      tagline: "Ijtimoiy tarmoqlarda faol auditoriya to'plash, video/reels yaratish va brend obro'sini oshirish",
      highlights: ['Targeting & Lead Gen', 'Viral Reels & Kopirayting', 'Brend Identifikatsiyasi', 'Haftalik Analitika'],
    },
    Marketing: {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      badge: 'Raqamli Marketing & Strategiya',
      tagline: "To'liq marketing ekotizimi — Google & Telegram Ads, professional brending va sotuv zanjiri nazorati",
      highlights: ['Google & Telegram Ads', 'Branding & Brandbook', 'Marketing Konsalting', 'Sotuv Bo\'limi Auditi'],
    },
    IT: {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      badge: 'IT Xizmatlar & AI Botlar',
      tagline: "Yuqori tezlikdagi zamonaviy veb-saytlar, mobil ilovalar va mijozlar bilan muloqot qiluvchi AI botlar",
      highlights: ['Landing & E-Commerce', 'Telegram & Instagram AI Botlar', 'Payme & Click Integratsiya', '24/7 Server Nazorati'],
    },
  };

  const pillarColors: Record<string, string> = {
    SMM: 'from-accent-500/20 to-accent-400/5 border-accent-400/30',
    Marketing: 'from-violet-500/20 to-violet-400/5 border-violet-400/30',
    IT: 'from-emerald-500/20 to-emerald-400/5 border-emerald-400/30',
  };

  const pillarIconColors: Record<string, string> = {
    SMM: 'text-accent-400',
    Marketing: 'text-violet-400',
    IT: 'text-emerald-400',
  };

  const pillarIcons: Record<string, string> = {
    SMM: 'Share2',
    Marketing: 'Megaphone',
    IT: 'Code',
  };

  const filteredServices = services.filter((s) => s.pillar === activePillar);
  const currentVisual = pillarVisuals[activePillar];

  const renderIcon = (name: string, className?: string) => {
    const Icon =
      ((Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) ||
      Icons.Circle;
    return <Icon className={className || 'w-5 h-5'} />;
  };

  const getTitle = (s: Service) => (lang === 'uz' ? s.title_uz : s.title_ru);
  const getDesc = (s: Service) =>
    lang === 'uz' ? s.description_uz : s.description_ru;

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.services.title} subtitle={t.services.subtitle} />
        </Reveal>

        {/* Pillar tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-3xl mx-auto">
          {pillars.map((pillar) => {
            const isActive = activePillar === pillar;
            return (
              <button
                key={pillar}
                onClick={() => {
                  setActivePillar(pillar);
                  setExpanded(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${pillarColors[pillar]} shadow-glow border-accent-400/40`
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <span className={isActive ? pillarIconColors[pillar] : 'text-gray-500'}>
                  {renderIcon(pillarIcons[pillar], 'w-5 h-5')}
                </span>
                <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {t.services.pillars[pillar]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Visual Showcase Card */}
        <Reveal>
          <div className="max-w-4xl mx-auto mb-10 glass p-5 sm:p-6 border border-white/10 rounded-3xl overflow-hidden relative group">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-ink-900">
                <img
                  src={currentVisual.image}
                  alt={currentVisual.badge}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-[11px] font-semibold text-accent-300 border border-white/20 bg-ink-950/80 backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent-400" />
                  <span>{activePillar} Ekspertiza</span>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col justify-center">
                <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-1.5">
                  {currentVisual.badge}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                  {t.services.pillars[activePillar]} Xizmatlari
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                  {currentVisual.tagline}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {currentVisual.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {filteredServices.map((service, idx) => {
            const isOpen = expanded === service.id;
            return (
              <Reveal key={service.id} delay={idx * 50}>
                <div
                  className={`glass glass-hover p-5 cursor-pointer transition-all border border-white/[0.08] hover:border-accent-400/30 ${
                    isOpen ? 'ring-1 ring-accent-400/30 border-accent-400/40' : ''
                  }`}
                  onClick={() => setExpanded(isOpen ? null : service.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${pillarColors[activePillar]} flex items-center justify-center ${pillarIconColors[activePillar]} border border-white/10`}
                    >
                      {renderIcon(service.icon_name, 'w-5 h-5')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm leading-snug mb-1">
                        {getTitle(service)}
                      </h3>
                      {isOpen && getDesc(service) && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-2 animate-fade-in leading-relaxed">
                          {getDesc(service)}
                        </p>
                      )}
                      {isOpen && !getDesc(service) && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-accent-400">
                          <span>{t.services.learnMore}</span>
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <button
                      className={`shrink-0 w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all ${
                        isOpen ? 'bg-accent-400/10 rotate-180 text-accent-400' : ''
                      }`}
                    >
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="text-center mt-12">
            <button
              onClick={onConsultation}
              className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-accent-400 hover:text-accent-300 font-semibold px-6 py-3 rounded-xl border border-accent-400/20 hover:border-accent-400/40 transition-all shadow-glow"
            >
              <span>{t.nav.consultation}</span>
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
