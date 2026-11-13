import { ArrowRight, ArrowDown, Sparkles, Zap, TrendingUp, CheckCircle, BarChart2, ShieldCheck, Flame } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

type Props = {
  onConsultation: () => void;
  onNavigate: (section: string) => void;
};

export function Hero({ onConsultation, onNavigate }: Props) {
  const { t } = useLang();

  const stats = [
    { value: '50+', label: t.hero.stat1 },
    { value: '120+', label: t.hero.stat2 },
    { value: '5+', label: t.hero.stat3 },
    { value: '40%', label: t.hero.stat4 },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-slow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-400/20 bg-accent-400/[0.04] mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-300 font-medium">Prox Marketing Agency</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm text-accent-300 font-semibold">Tashkent</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] text-balance mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {t.hero.headline.split('raqamli dunyoda').map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && (
                    <span className="accent-text">raqamli dunyoda</span>
                  )}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={onConsultation}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-accent-500 via-accent-400 to-cyan-300 hover:from-accent-400 hover:to-cyan-200 text-ink-950 font-semibold px-7 py-4 rounded-xl transition-all shadow-glow hover:shadow-glow-lg"
              >
                <span>{t.hero.cta1}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="flex items-center justify-center gap-2 border border-white/10 hover:border-accent-400/40 text-white font-medium px-7 py-4 rounded-xl transition-all hover:bg-white/[0.04] backdrop-blur-sm"
              >
                <Zap className="w-5 h-5 text-accent-400" />
                <span>{t.hero.cta2}</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="glass p-4 border border-white/[0.08] hover:border-accent-400/30 transition-all">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-accent-400" />
                    <span className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Agency Mockup Card */}
          <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: '0.35s' }}>
            {/* Ambient Backlight */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent-400/20 via-violet-600/20 to-accent-400/10 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-700" />

            <div className="relative glass p-4 sm:p-5 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl group transition-all duration-500 hover:border-accent-400/40">
              {/* Header Window Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1 bg-ink-950/60 px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>prox-marketing-growth.live</span>
                </div>
              </div>

              {/* Main Visual Image */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 mb-4 bg-ink-900">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  alt="Prox Agency Marketing Dashboard"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/10 via-transparent to-violet-600/20 mix-blend-screen" />

                {/* Floating Badge 1: Real-time Growth */}
                <div className="absolute bottom-3 left-3 glass p-2.5 sm:p-3 border border-white/20 bg-ink-950/80 backdrop-blur-xl rounded-xl flex items-center gap-2.5 shadow-glow">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium leading-none">Konversiya O'sishi</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono">+142.8%</span>
                  </div>
                </div>

                {/* Floating Badge 2: Verified */}
                <div className="absolute top-3 right-3 glass px-3 py-1.5 border border-white/20 bg-ink-950/80 backdrop-blur-xl rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-[11px] font-semibold text-gray-200">Tizimli Natija</span>
                </div>
              </div>

              {/* 3 Pillar Micro-Pills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-accent-400/[0.06] border border-accent-400/20 flex flex-col items-center text-center">
                  <Flame className="w-4 h-4 text-accent-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">SMM & Media</span>
                  <span className="text-[10px] text-gray-400">Targeting & Video</span>
                </div>

                <div className="p-2.5 rounded-xl bg-violet-500/[0.06] border border-violet-500/20 flex flex-col items-center text-center">
                  <TrendingUp className="w-4 h-4 text-violet-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">Marketing</span>
                  <span className="text-[10px] text-gray-400">Strategiya & Sotuv</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 flex flex-col items-center text-center">
                  <Zap className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">IT & Botlar</span>
                  <span className="text-[10px] text-gray-400">Vebsayt & AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => onNavigate('services')}
          className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-600 hover:text-accent-400 transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
