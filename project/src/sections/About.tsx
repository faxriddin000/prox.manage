import { Target, Heart, Users, Sparkles, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function About() {
  const { t } = useLang();

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.about.title} subtitle={t.about.subtitle} />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Description & Mission */}
          <Reveal>
            <div className="glass p-7 sm:p-8 h-full border border-white/[0.08] hover:border-accent-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-accent-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Biz Haqimizda</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {t.about.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-accent-400/[0.04] border border-accent-400/20">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Target className="w-4 h-4 text-accent-400 shrink-0" />
                  <p className="text-sm font-bold text-white">{t.about.mission}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t.about.missionText}</p>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Values */}
          <Reveal delay={100}>
            <div className="glass p-7 sm:p-8 h-full border border-white/[0.08] hover:border-violet-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <Heart className="w-5 h-5 text-violet-400" />
                  <h3 className="font-display font-bold text-white text-base sm:text-lg">
                    {t.about.values}
                  </h3>
                </div>
                <ul className="space-y-3.5">
                  {t.about.valuesList.map((value, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-accent-400/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-xs text-accent-300 font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Har bir loyihaga kafolatlangan tizimli yondashuv</span>
              </div>
            </div>
          </Reveal>

          {/* Card 3: Agency Team & Visual Culture */}
          <Reveal delay={200}>
            <div className="glass p-7 sm:p-8 h-full border border-white/[0.08] hover:border-emerald-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-bold text-white text-base sm:text-lg">
                    {t.about.team}
                  </h3>
                </div>

                {/* Team Visual Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 mb-4 bg-ink-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Prox Marketing Agency Team"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-lg bg-ink-950/80 backdrop-blur-md border border-white/20">
                      Toshkent • Prox Team
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <Award className="w-3 h-3" />
                      Ekspert Jamoa
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  Har bir loyiha uchun alohida SMM menejeri, targetolog, kontent-meyker va IT muhandislaridan iborat ixtisoslashgan guruh biriktiriladi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <span className="font-display text-lg font-bold text-accent-400 block">15+</span>
                  <span className="text-[10px] text-gray-400">Mutaxassislar</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <span className="font-display text-lg font-bold text-emerald-400 block">100%</span>
                  <span className="text-[10px] text-gray-400">Tizimli Nazorat</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
