import { useState } from 'react';
import { X, Send, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { submitLead } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ConsultationModal({ open, onClose }: Props) {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState(false);

  if (!open) return null;

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    return digits.length >= 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setStatus('sending');

    const serviceType = (service || 'SMM') as 'SMM' | 'Marketing' | 'IT';

    // 1. Save lead to Supabase / local storage
    await submitLead({
      name,
      phone,
      service_type: serviceType,
      message: message || null,
    });

    // 2. Trigger Telegram Bot Notification
    try {
      await sendTelegramNotification({
        source: 'Bepul Konsultatsiya Modali (Pop-up)',
        name,
        phone,
        service_type: serviceType,
        message: message || null,
      });
    } catch (tgErr) {
      console.warn('Telegram notification failed:', tgErr);
    }

    setStatus('success');
    setTimeout(() => {
      onClose();
      setStatus('idle');
      setName('');
      setPhone('');
      setService('');
      setMessage('');
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass p-8 shadow-glow-lg animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-accent-400" />
            <span className="text-accent-400 text-sm font-medium tracking-wider uppercase">
              {t.contact.title}
            </span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-white">
            {t.hero.cta1}
          </h3>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-400/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent-400" />
            </div>
            <p className="text-white font-medium text-lg">{t.contact.form.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.form.namePlaceholder}
                required
                className="w-full bg-ink-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {t.contact.form.phone} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(false);
                }}
                placeholder={t.contact.form.phonePlaceholder}
                required
                className={`w-full bg-ink-800/60 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                  phoneError
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-accent-400/50 focus:ring-accent-400/30'
                }`}
              />
              {phoneError && (
                <p className="text-red-400 text-xs mt-1.5">{t.contact.form.phoneError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {t.contact.form.service}
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-ink-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
              >
                <option value="">{t.contact.form.selectService}</option>
                <option value="SMM">SMM</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {t.contact.form.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.form.messagePlaceholder}
                rows={2}
                className="w-full bg-ink-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-400 hover:to-accent-300 text-ink-950 font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.contact.form.sending}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t.contact.form.submit}
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">{t.contact.form.error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
