import { useState, useEffect, useCallback } from 'react';
import { LangProvider } from '@/lib/LangContext';
import { useAuth } from '@/lib/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConsultationModal } from '@/components/ConsultationModal';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Services } from '@/sections/Services';
import { Pricing } from '@/sections/Pricing';
import { WhyChooseUs } from '@/sections/WhyChooseUs';
import { Partners } from '@/sections/Partners';
import { Portfolio } from '@/sections/Portfolio';
import { Contact } from '@/sections/Contact';
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminDashboard } from '@/admin/AdminDashboard';

function AppContent() {
  const { session, loading, signIn, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const navigate = useCallback((section: string) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const goAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminRoute(true);
  };

  const goSite = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    if (loading) {
      return (
        <div className="min-h-screen bg-ink-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!session) {
      return <AdminLogin onSignIn={signIn} onBack={goSite} />;
    }
    return <AdminDashboard onSignOut={signOut} onBack={goSite} />;
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Header onConsultation={() => setShowModal(true)} onNavigate={navigate} />
      <main>
        <Hero onConsultation={() => setShowModal(true)} onNavigate={navigate} />
        <About />
        <Services onConsultation={() => setShowModal(true)} />
        <Pricing onConsultation={() => setShowModal(true)} onNavigate={navigate} />
        <WhyChooseUs />
        <Partners />
        <Portfolio />
        <Contact />
      </main>
      <Footer onNavigate={navigate} />
      <ConsultationModal open={showModal} onClose={() => setShowModal(false)} />
      <AdminFab onClick={goAdmin} />
    </div>
  );
}

function AdminFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Admin Panel"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full border border-white/10 bg-ink-800/80 backdrop-blur-xl text-gray-600 hover:text-accent-400 hover:border-accent-400/30 transition-all flex items-center justify-center group"
      title="Admin Panel"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </button>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
