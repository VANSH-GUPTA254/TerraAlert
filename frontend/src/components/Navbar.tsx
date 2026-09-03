'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  MapPin,
  BrainCircuit,
  Camera,
  Bell,
  BarChart3,
  SlidersHorizontal,
  Globe,
  Menu,
  X,
  UserCheck,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';
import { UserRole } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, language, setLanguage, switchPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const t = translations[language];

  const navLinks = [
    { name: t.nav.overview, href: '/', icon: Globe },
    { name: t.nav.dashboard, href: '/dashboard', icon: MapPin },
    { name: t.nav.predict, href: '/predict', icon: BrainCircuit },
    { name: t.nav.report, href: '/report', icon: Camera },
    { name: t.nav.alerts, href: '/alerts', icon: Bell, badge: 2 },
    { name: t.nav.analytics, href: '/analytics', icon: BarChart3 },
    { name: t.nav.admin, href: '/admin', icon: SlidersHorizontal, roleRequired: ['officer', 'admin'] }
  ];

  const rolesList: { role: UserRole; title: string; subtitle: string }[] = [
    { role: 'citizen', title: 'Citizen / Volunteer', subtitle: 'Aapda Mitra / Public User' },
    { role: 'officer', title: 'Disaster Officer', subtitle: 'SDMA / District Control' },
    { role: 'admin', title: 'System Admin', subtitle: 'NDMA HQ Command' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Indian Government Identity Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Aqua<span className="text-blue-600">Vision</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  SIH26001
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500">
                Landslide Early Warning & Risk Monitoring System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-extrabold bg-red-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Lang, Persona Quick Switcher, SOS */}
          <div className="hidden sm:flex items-center space-x-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition shadow-2xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Demo Persona Quick Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(prev => !prev)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition shadow-2xs"
              >
                <div className={`w-2 h-2 rounded-full ${
                  role === 'admin' ? 'bg-purple-600' : (role === 'officer' ? 'bg-blue-600' : 'bg-emerald-600')
                }`} />
                <span className="capitalize">
                  {role === 'admin' ? 'Admin HQ' : (role === 'officer' ? 'Disaster Officer' : 'Citizen / Public')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Role Persona
                    </p>
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchPersona(r.role);
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start space-x-2 hover:bg-blue-50 transition ${
                        role === r.role ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      <UserCheck className={`w-4 h-4 mt-0.5 ${
                        role === r.role ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                      <div>
                        <p className="text-xs font-bold">{r.title}</p>
                        <p className="text-[11px] text-slate-500">{r.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Hotline Button */}
            <a
              href="tel:1070"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-black hover:bg-red-100 transition shadow-2xs"
              title="National Disaster Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>SOS 1070</span>
            </a>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-md text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-extrabold bg-red-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2">Switch Active Persona:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {rolesList.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchPersona(r.role);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg font-bold text-center border ${
                    role === r.role
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {r.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
