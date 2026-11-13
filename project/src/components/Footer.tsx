import { Sparkles, Instagram, Send, Phone, MapPin } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

type Props = {
  onNavigate: (section: string) => void;
};

export function Footer({ onNavigate }: Props) {
  const { t } = useLang();

  const links = [
    { key: 'home', id: 'hero' },
    { key: 'about', id: 'about' },
    { key: 'services', id: 'services' },
    { key: 'pricing', id: 'pricing' },
    { key: 'partners', id: 'partners' },
    { key: 'contact', id: 'contact' },
  ] as const;

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950 mt-20">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 to-violet-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-ink-950" />
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  PROX
                </span>
                <span className="block text-[10px] text-accent-400 tracking-[0.2em] uppercase">
                  Marketing
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {t.footer.about}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-sm text-gray-500 hover:text-accent-400 transition-colors"
                  >
                    {t.nav[link.key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+998200260418"
                  className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-accent-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +998 20 026 04 18
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/prox_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-accent-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @prox_uz
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/manager_prox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-accent-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  @manager_prox
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                Tashkent, Uzbekistan
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              {t.footer.follow}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/prox_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:border-accent-400/30 hover:shadow-glow transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/manager_prox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:border-accent-400/30 hover:shadow-glow transition-all"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="tel:+998200260418"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:border-accent-400/30 hover:shadow-glow transition-all"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Prox Marketing Agency. {t.footer.rights}.
          </p>
          <button
            onClick={() => onNavigate('hero')}
            className="text-sm text-gray-600 hover:text-accent-400 transition-colors"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
