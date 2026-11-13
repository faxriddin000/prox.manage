import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Globe } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import type { Lang } from '@/lib/translations';

type Props = {
  onConsultation: () => void;
  onNavigate: (section: string) => void;
};

export function Header({ onConsultation, onNavigate }: Props) {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { key: 'home', id: 'hero' },
    { key: 'about', id: 'about' },
    { key: 'services', id: 'services' },
    { key: 'pricing', id: 'pricing' },
    { key: 'partners', id: 'partners' },
    { key: 'contact', id: 'contact' },
  ] as const;

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const toggleLang = () => {
    const next: Lang = lang === 'uz' ? 'ru' : 'uz';
    setLang(next);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav('hero')}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 to-violet-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
            <Sparkles className="w-5 h-5 text-ink-950" />
          </div>
          <div className="text-left leading-none">
            <span className="font-display font-bold text-white text-lg tracking-tight">
              PROX
            </span>
            <span className="block text-[10px] text-accent-400 tracking-[0.2em] uppercase">
              Marketing
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNav(link.id)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]"
            >
              {t.nav[link.key]}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-accent-400/30 text-sm transition-all group"
          >
            <Globe className="w-4 h-4 text-gray-400 group-hover:text-accent-400 transition-colors" />
            <span className={`font-medium ${lang === 'uz' ? 'text-accent-400' : 'text-gray-500'}`}>
              UZ
            </span>
            <span className="text-gray-700">/</span>
            <span className={`font-medium ${lang === 'ru' ? 'text-accent-400' : 'text-gray-500'}`}>
              RU
            </span>
          </button>

          {/* CTA */}
          <button
            onClick={onConsultation}
            className="hidden sm:inline-flex items-center bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-400 hover:to-accent-300 text-ink-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-glow hover:shadow-glow-lg"
          >
            {t.nav.consultation}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-ink-950/95 backdrop-blur-xl border-b border-white/[0.06] animate-fade-in">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNav(link.id)}
                className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors"
              >
                {t.nav[link.key]}
              </button>
            ))}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-sm"
              >
                <Globe className="w-4 h-4 text-gray-400" />
                <span className={lang === 'uz' ? 'text-accent-400' : 'text-gray-500'}>UZ</span>
                <span className="text-gray-700">/</span>
                <span className={lang === 'ru' ? 'text-accent-400' : 'text-gray-500'}>RU</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onConsultation();
                }}
                className="flex-1 bg-gradient-to-r from-accent-500 to-accent-400 text-ink-950 font-semibold text-sm px-5 py-2.5 rounded-xl"
              >
                {t.nav.consultation}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
