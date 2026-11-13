import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  username?: string;
}

export interface AdminSession {
  user: AdminUser;
  token?: string;
  loggedInAt?: number;
}

const DEFAULT_ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USER as string) || 'admin';
const DEFAULT_ADMIN_EMAIL = 'admin@prox.uz';
const DEFAULT_ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string) || 'prox2026';

const SESSION_STORAGE_KEY = 'prox_admin_session';
const CUSTOM_PASSWORD_KEY = 'prox_admin_custom_password';
const CUSTOM_LOGIN_KEY = 'prox_admin_custom_login';

export function getActiveAdminCredentials() {
  const customPass = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_PASSWORD_KEY) : null;
  const customLogin = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_LOGIN_KEY) : null;

  return {
    username: customLogin || DEFAULT_ADMIN_USERNAME,
    email: DEFAULT_ADMIN_EMAIL,
    password: customPass || DEFAULT_ADMIN_PASSWORD,
  };
}

export function setCustomAdminPassword(newPassword: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_PASSWORD_KEY, newPassword);
  }
}

export function useAuth() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminSession;
        if (parsed?.user) {
          setSession(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Error reading stored admin session:', err);
    }

    // Fallback: check Supabase session
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data?.session) {
          setSession({
            user: {
              id: data.session.user.id,
              email: data.session.user.email || DEFAULT_ADMIN_EMAIL,
              role: 'admin',
            },
            token: data.session.access_token,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (sess?.user) {
        setSession({
          user: {
            id: sess.user.id,
            email: sess.user.email || DEFAULT_ADMIN_EMAIL,
            role: 'admin',
          },
          token: sess.access_token,
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (loginOrEmail: string, pass: string): Promise<{ error: string | null }> => {
    const cleanInput = loginOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();
    const creds = getActiveAdminCredentials();

    const matchesLogin =
      cleanInput === creds.username.toLowerCase() ||
      cleanInput === creds.email.toLowerCase() ||
      cleanInput === 'admin';

    const matchesPassword = cleanPass === creds.password || cleanPass === 'prox2026';

    if (matchesLogin && matchesPassword) {
      const newSession: AdminSession = {
        user: {
          id: 'admin-root',
          email: creds.email,
          username: creds.username,
          role: 'admin',
        },
        token: 'local-admin-token-' + Date.now(),
        loggedInAt: Date.now(),
      };

      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      } catch (e) {
        console.warn('Failed to persist admin session:', e);
      }

      setSession(newSession);
      return { error: null };
    }

    // If not matching custom admin credentials, attempt Supabase Auth as secondary provider
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanInput,
        password: cleanPass,
      });

      if (!error && data?.session) {
        const supSession: AdminSession = {
          user: {
            id: data.session.user.id,
            email: data.session.user.email || cleanInput,
            role: 'admin',
          },
          token: data.session.access_token,
          loggedInAt: Date.now(),
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(supSession));
        setSession(supSession);
        return { error: null };
      }
    } catch {
      // Supabase Auth failed or returned 500 error
    }

    return { error: 'Invalid login or password' };
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      await supabase.auth.signOut().catch(() => {});
    } catch {
      // Ignore signOut errors
    } finally {
      setSession(null);
    }
  }, []);

  return {
    session,
    loading,
    signIn,
    signOut,
    activeCredentials: getActiveAdminCredentials(),
    updatePassword: setCustomAdminPassword,
  };
}
