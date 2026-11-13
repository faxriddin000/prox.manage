import { Layers, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const icons = [Layers, TrendingUp, Users, BarChart3];
const colors = [
  'from-accent-500/15 to-accent-400/5 text-accent-400',
  'from-violet-500/15 to-violet-400/5 text-violet-400',
  'from-emerald-500/15 to-emerald-400/5 text-emerald-400',
  'from-amber-500/15 to-amber-400/5 text-amber-400',
];

export function WhyChooseUs() {
  const { t } = useLang();

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.whyUs.title} subtitle={t.whyUs.subtitle} />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.whyUs.features.map((feature, idx) => {
            const Icon = icons[idx];
            return (
              <Reveal key={idx} delay={idx * 100}>
                <div className="group glass glass-hover p-7 h-full relative overflow-hidden">
                  <div
                    className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${colors[idx]} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}
                  />
                  <div
                    className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center mb-5`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
