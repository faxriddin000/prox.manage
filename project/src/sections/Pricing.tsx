import { useState, useEffect } from 'react';
import { Check, ArrowRight, FileText } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { fetchPricing, type Pricing as PricingType } from '@/lib/supabase';

type Props = {
  onConsultation: () => void;
  onNavigate: (section: string) => void;
};

export function Pricing({ onConsultation, onNavigate }: Props) {
  const { t, lang } = useLang();
  const [pricing, setPricing] = useState<PricingType[]>([]);

  useEffect(() => {
    fetchPricing().then((data) => {
      if (data) setPricing(data);
    });
  }, []);

  const smmPricing = pricing.filter((p) => p.key.startsWith('smm_'));
  const marketingPricing = pricing.find((p) => p.key === 'marketing');

  const getLabel = (p: PricingType) => (lang === 'uz' ? p.label_uz : p.label_ru);
  const getPeriod = (p: PricingType) =>
    lang === 'uz' ? p.period_uz : p.period_ru;

  const popularIdx = 1; // 3-month package

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.pricing.title} subtitle={t.pricing.subtitle} />
        </Reveal>

        {/* SMM Pricing Table */}
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-white mb-6 text-center">
            {t.pricing.smm}
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {smmPricing.map((p, idx) => {
            const isPopular = idx === popularIdx;
            return (
              <Reveal key={p.id} delay={idx * 80}>
                <div
                  className={`relative glass p-6 transition-all duration-300 ${
                    isPopular
                      ? 'border-accent-400/40 shadow-glow ring-1 ring-accent-400/20'
                      : 'glass-hover'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-accent-500 to-accent-400 text-ink-950 text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <h4 className="text-sm text-gray-400 mb-3 font-medium">{getLabel(p)}</h4>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl font-bold text-white">
                      ${Math.round(p.price).toLocaleString()}
                    </span>
                    {getPeriod(p) && (
                      <span className="text-sm text-gray-500">{getPeriod(p)}</span>
                    )}
                  </div>
                  <div className="my-5 h-px bg-white/[0.06]" />
                  <ul className="space-y-2.5 mb-6">
                    {[
                      lang === 'uz' ? 'Strategiya ishlab chiqish' : 'Разработка стратегии',
                      lang === 'uz' ? 'Kontent yaratish' : 'Создание контента',
                      lang === 'uz' ? 'Reklama kampaniyalari' : 'Рекламные кампании',
                      lang === 'uz' ? 'Analitika va hisobot' : 'Аналитика и отчётность',
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-accent-400 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onConsultation}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                      isPopular
                        ? 'bg-gradient-to-r from-accent-500 to-accent-400 text-ink-950 shadow-glow hover:shadow-glow-lg'
                        : 'border border-white/10 text-white hover:bg-white/[0.03] hover:border-accent-400/30'
                    }`}
                  >
                    {t.nav.consultation}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Marketing & IT pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Marketing */}
          <Reveal>
            <div className="glass p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  {t.pricing.marketing}
                </h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">{t.pricing.marketingDesc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                {marketingPricing && (
                  <>
                    <span className="text-lg text-gray-500">{t.pricing.from}</span>
                    <span className="font-display text-4xl font-bold text-white">
                      ${Math.round(marketingPricing.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onConsultation}
                className="mt-auto flex items-center justify-center gap-2 border border-white/10 hover:border-violet-400/30 hover:bg-violet-500/5 text-white py-3 rounded-xl font-medium text-sm transition-all"
              >
                {t.nav.consultation}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>

          {/* IT */}
          <Reveal delay={100}>
            <div className="glass p-8 h-full flex flex-col bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  {t.pricing.it}
                </h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">{t.pricing.itDesc}</p>
              <button
                onClick={() => onNavigate('contact')}
                className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-ink-950 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                {t.pricing.requestQuote}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
