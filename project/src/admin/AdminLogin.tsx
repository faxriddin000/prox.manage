import { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Sparkles, Globe } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

type Props = {
  onSignIn: (identifier: string, password: string) => Promise<{ error: string | null }>;
  onBack: () => void;
};

export function AdminLogin({ onSignIn, onBack }: Props) {
  const { t, lang, setLang } = useLang();
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('prox2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError(t.admin.loginError);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await onSignIn(identifier, password);
    setLoading(false);
    if (res.error) {
      setError(t.admin.loginError);
    }
  };

  const fillCredentials = () => {
    setIdentifier('admin');
    setPassword('prox2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Language toggle top-right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
        <Globe className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
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

      <div className="relative w-full max-w-md z-10">
        <button
          onClick={onBack}
          type="button"
          className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.admin.backToSite}
        </button>

        <div className="glass p-8 sm:p-9 shadow-glow-lg border border-white/10 bg-ink-900/70 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 via-accent-500 to-violet-600 flex items-center justify-center shadow-glow">
                <Lock className="w-8 h-8 text-ink-950 stroke-[2.2]" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-400 to-violet-500 opacity-30 blur-sm -z-10" />
            </div>

            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              {t.admin.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
              {t.admin.loginSubtitle}
            </p>
          </div>

          {/* Quick Credential Badge */}
          <div className="mb-6 p-3 rounded-xl bg-accent-400/[0.05] border border-accent-400/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-accent-300 min-w-0">
              <Sparkles className="w-4 h-4 text-accent-400 shrink-0" />
              <span className="truncate">{t.admin.quickTip}</span>
            </div>
            <button
              type="button"
              onClick={fillCredentials}
              className="text-[11px] font-semibold text-accent-400 hover:text-white bg-accent-400/10 hover:bg-accent-400/20 px-2 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.admin.autoFill}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                {t.admin.usernameOrEmail}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="admin yoki admin@prox.uz"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {t.admin.password}
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="••••••••"
                  className="w-full bg-ink-950/80 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-gray-600 focus:border-accent-400/60 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-400 via-accent-500 to-violet-500 hover:from-accent-300 hover:to-violet-400 text-ink-950 font-semibold py-3.5 rounded-xl transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-ink-950" />
                  <span>{t.admin.loginBtn}...</span>
                </>
              ) : (
                <span>{t.admin.loginBtn}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
