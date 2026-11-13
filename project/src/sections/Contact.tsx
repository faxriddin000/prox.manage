import { useState } from 'react';
import {
  Phone,
  Instagram,
  Send,
  User,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { submitLead } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

export function Contact() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState(false);

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
        source: "Saytdagi 'Aloqa' (Contact) formasi",
        name,
        phone,
        service_type: serviceType,
        message: message || null,
      });
    } catch (tgErr) {
      console.warn('Telegram notification failed:', tgErr);
    }

    setStatus('success');
    setName('');
    setPhone('');
    setService('');
    setMessage('');
    setTimeout(() => setStatus('idle'), 5000);
  };

  const contactCards = [
    {
      icon: Phone,
      label: t.contact.phone,
      value: '+998 20 026 04 18',
      href: 'tel:+998200260418',
      color: 'text-accent-400',
      bg: 'from-accent-500/10 to-transparent',
    },
    {
      icon: Instagram,
      label: t.contact.instagram,
      value: '@prox_uz',
      href: 'https://instagram.com/prox_uz',
      color: 'text-violet-400',
      bg: 'from-violet-500/10 to-transparent',
    },
    {
      icon: Send,
      label: t.contact.telegram,
      value: '@manager_prox',
      href: 'https://t.me/manager_prox',
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-transparent',
    },
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={t.contact.title} subtitle={t.contact.subtitle} />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactCards.map((card, idx) => (
              <Reveal key={card.label} delay={idx * 80}>
                <a
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`group glass glass-hover p-6 flex items-center gap-4 bg-gradient-to-r ${card.bg}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${card.color}`}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{card.label}</p>
                    <p className="font-medium text-white group-hover:text-accent-400 transition-colors">
                      {card.value}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={100}>
              <form onSubmit={handleSubmit} className="glass p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      {t.contact.form.name}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.contact.form.namePlaceholder}
                        required
                        className="w-full bg-ink-800/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      {t.contact.form.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError(false);
                        }}
                        placeholder={t.contact.form.phonePlaceholder}
                        required
                        className={`w-full bg-ink-800/60 border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                          phoneError
                            ? 'border-red-500/50 focus:ring-red-500/30'
                            : 'border-white/10 focus:border-accent-400/50 focus:ring-accent-400/30'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-400 text-xs mt-1.5">{t.contact.form.phoneError}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
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

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1.5">
                    {t.contact.form.message}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.contact.form.messagePlaceholder}
                      rows={3}
                      className="w-full bg-ink-800/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/30 transition-all resize-none"
                    />
                  </div>
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

                {status === 'success' && (
                  <div className="mt-4 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/20 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-300">{t.contact.form.success}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mt-4 flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-400/20 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm text-red-300">{t.contact.form.error}</p>
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
