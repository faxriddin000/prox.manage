import { TrendingUp, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

interface CaseStudy {
  id: string;
  category: 'SMM' | 'Marketing' | 'IT' | 'Branding';
  title_uz: string;
  title_ru: string;
  desc_uz: string;
  desc_ru: string;
  metric: string;
  image: string;
  color: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    category: 'SMM',
    title_uz: 'Apex Retail — Kompleks SMM & Reels',
    title_ru: 'Apex Retail — Комплексный SMM и Reels',
    desc_uz: "Instagram auditoriyasini noldan 85K ga yetkazish va virusli kontent orqali to'g'ridan-to'g'ri sotuvlarni oshirish.",
    desc_ru: 'Развитие аудитории Instagram с нуля до 85K и рост продаж через вирусный контент.',
    metric: '+180K Qamrov • +42% Sotuv',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80',
    color: 'from-accent-500/20 to-cyan-400/5 text-accent-300 border-accent-400/30',
  },
  {
    id: 'case-2',
    category: 'Marketing',
    title_uz: 'SilkRoad Logistics — Target & Google Ads',
    title_ru: 'SilkRoad Logistics — Таргет и Google Ads',
    desc_uz: "B2B segmentida xalqaro yuk tashuvlar bo'yicha yuqori sifatli korporativ lidlar oqimini yaratish.",
    desc_ru: 'Привлечение качественных B2B лидов в сфере международных грузоперевозок.',
    metric: '3.4x ROI • 1,200+ Sifatli Lid',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    color: 'from-violet-500/20 to-purple-400/5 text-violet-300 border-violet-400/30',
  },
  {
    id: 'case-3',
    category: 'IT',
    title_uz: 'Nova Tech — Korporativ Portal & CRM',
    title_ru: 'Nova Tech — Корпоративный портал и CRM',
    desc_uz: "Kompaniya xizmatlarini avtomatlashtirish, tezkor vebsayt va ichki boshqaruv CRM tizimi integratsiyasi.",
    desc_ru: 'Автоматизация сервисов компании, быстрый сайт и интеграция с внутренней CRM.',
    metric: '0.4s Yuklanish • 99.9% Uptime',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    color: 'from-emerald-500/20 to-teal-400/5 text-emerald-300 border-emerald-400/30',
  },
  {
    id: 'case-4',
    category: 'Branding',
    title_uz: 'Grand Medical — Brandbook & Identika',
    title_ru: 'Grand Medical — Брендбук и айдентика',
    desc_uz: "Tibbiyot markazi uchun premium brend imidji, vizual qo'llanma va klinikalar tarmog'i uchun yagona uslub.",
    desc_ru: 'Премиальный стиль бренда, гайдлайн и единая визуальная система для сети клиник.',
    metric: "100% Eksklyuziv Dizayn",
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=900&q=80',
    color: 'from-amber-500/20 to-orange-400/5 text-amber-300 border-amber-400/30',
  },
  {
    id: 'case-5',
    category: 'IT',
    title_uz: 'Tashkent Food — AI Telegram Bot',
    title_ru: 'Tashkent Food — ИИ Telegram бот',
    desc_uz: "Restoranlar tarmog'i uchun buyurtmalarni avtomatik qabul qilish va to'lovlarni boshqaruvchi aqlli bot.",
    desc_ru: 'Умный бот для автоматического приема заказов и онлайн-оплаты сети ресторанов.',
    metric: '24/7 Avto-javob • +65% Tezkorlik',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    color: 'from-cyan-500/20 to-blue-400/5 text-cyan-300 border-cyan-400/30',
  },
  {
    id: 'case-6',
    category: 'Marketing',
    title_uz: 'Avesto Home — Onlayn Savdo & SMM',
    title_ru: 'Avesto Home — Онлайн продажи и SMM',
    desc_uz: "Mebel va interyer mahsulotlari uchun Instagram do'kon, vizual kontent va ko'p kanalli target reklama.",
    desc_ru: 'Интернет-магазин мебели, визуальный контент и омниканальный таргетинг.',
    metric: '$85,000+ Oylik Savdo',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    color: 'from-rose-500/20 to-pink-400/5 text-rose-300 border-rose-400/30',
  },
];

export function Portfolio() {
  const { t, lang } = useLang();

  return (
    <section id="portfolio" className="relative py-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASE_STUDIES.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 70}>
              <div className="glass group overflow-hidden border border-white/[0.08] hover:border-accent-400/40 rounded-3xl transition-all duration-500 flex flex-col h-full hover:shadow-glow">
                {/* Visual Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-900 border-b border-white/[0.06]">
                  <img
                    src={item.image}
                    alt={lang === 'uz' ? item.title_uz : item.title_ru}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border bg-ink-950/80 backdrop-blur-md ${item.color}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Result Chip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="glass px-2.5 py-1 rounded-lg border border-white/20 bg-ink-950/80 backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold text-emerald-400 shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.metric}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white text-base sm:text-lg mb-2 group-hover:text-accent-300 transition-colors leading-snug">
                      {lang === 'uz' ? item.title_uz : item.title_ru}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {lang === 'uz' ? item.desc_uz : item.desc_ru}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-accent-400 group-hover:text-accent-300 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Keys natijalari
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
