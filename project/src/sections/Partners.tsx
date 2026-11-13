import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { fetchPartners, type Partner } from '@/lib/supabase';

export function Partners() {
  const { t } = useLang();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetchPartners().then((data) => {
      if (data) setPartners(data);
    });
  }, []);

  const doubled = [...partners, ...partners];

  return (
    <section id="partners" className="relative py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.partners.title} subtitle={t.partners.subtitle} />
        </Reveal>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative overflow-hidden">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-ink-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-ink-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
          {doubled.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="glass px-10 py-8 flex items-center justify-center min-w-[200px] hover:border-accent-400/20 transition-colors"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Building2 className="w-6 h-6" />
                  <span className="font-display font-medium text-base whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
