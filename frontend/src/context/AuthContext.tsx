'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { sirenEngine } from '@/lib/audio';
import { Language } from '@/lib/i18n';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sirenActive: boolean;
  toggleSiren: () => void;
  login: (email: string, role?: UserRole) => void;
  switchPersona: (role: UserRole) => void;
  logout: () => void;
}

const DEMO_PERSONAS: Record<UserRole, User> = {
  officer: {
    id: 'usr-002',
    name: 'Ananya Nair (SDMA Officer)',
    email: 'officer@terraalert.gov.in',
    role: 'officer',
    phone: '+91 94471 88203',
    department: 'Kerala State Disaster Management Authority (KSDMA)',
    jurisdiction_district: 'Wayanad & Idukki Districts'
  },
  admin: {
    id: 'usr-001',
    name: 'Dr. Rajeshwar Sharma (NDMA HQ)',
    email: 'admin@terraalert.gov.in',
    role: 'admin',
    phone: '+91 98110 24890',
    department: 'National Disaster Management Authority (NDMA)',
    jurisdiction_district: 'National Command / All State EOCs'
  },
  citizen: {
    id: 'usr-003',
    name: 'Vikram Singh Negi (Field Worker)',
    email: 'citizen@terraalert.gov.in',
    role: 'citizen',
    phone: '+91 87552 19044',
    department: 'Aapda Mitra Volunteer - Chamoli Sector',
    jurisdiction_district: 'Chamoli / Joshimath'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_PERSONAS.officer);
  const [language, setLanguageState] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  useEffect(() => {
    // Check saved preferences
    const savedRole = localStorage.getItem('aqv_role') as UserRole;
    if (savedRole && DEMO_PERSONAS[savedRole]) {
      setUser(DEMO_PERSONAS[savedRole]);
    }
    const savedLang = localStorage.getItem('aqv_lang') as Language;
    if (savedLang) setLanguageState(savedLang);

    const savedTheme = localStorage.getItem('aqv_dark') === 'true';
    if (savedTheme) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aqv_lang', lang);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('aqv_dark', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const toggleSiren = () => {
    if (sirenEngine) {
      const isRunning = sirenEngine.toggle();
      setSirenActive(isRunning);
    } else {
      setSirenActive(prev => !prev);
    }
  };

  const login = (email: string, role?: UserRole) => {
    const targetRole = role || (email.includes('admin') ? 'admin' : (email.includes('officer') ? 'officer' : 'citizen'));
    const persona = DEMO_PERSONAS[targetRole];
    setUser(persona);
    localStorage.setItem('aqv_role', targetRole);
  };

  const switchPersona = (targetRole: UserRole) => {
    const persona = DEMO_PERSONAS[targetRole];
    setUser(persona);
    localStorage.setItem('aqv_role', targetRole);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aqv_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'citizen',
        language,
        setLanguage,
        darkMode,
        toggleDarkMode,
        sirenActive,
        toggleSiren,
        login,
        switchPersona,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
