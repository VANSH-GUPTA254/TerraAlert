'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, Mail, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchPersona } = useAuth();

  const [email, setEmail] = useState('officer@terraalert.gov.in');
  const [password, setPassword] = useState('officer123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      login(email);
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    switchPersona(role);
    if (role === 'admin') {
      setEmail('admin@terraalert.gov.in');
      setPassword('admin123');
    } else if (role === 'officer') {
      setEmail('officer@terraalert.gov.in');
      setPassword('officer123');
    } else {
      setEmail('citizen@terraalert.gov.in');
      setPassword('citizen123');
    }
    router.push('/dashboard');
  };

  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center px-4 py-12 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto font-bold shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            TerraAlert Portal Sign In
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            National Landslide Early Warning & Risk Management Network
          </p>
        </div>

        {/* 1-Click Quick Demo Switcher */}
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
          <p className="text-[11px] font-black text-blue-900 uppercase tracking-wider text-center">
            ⚡ 1-Click Demo Login (Select Persona):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('officer')}
              className="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition shadow-2xs"
            >
              Disaster Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold text-center transition shadow-2xs"
            >
              Admin HQ
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen')}
              className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition shadow-2xs"
            >
              Citizen User
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="block font-black text-slate-800">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-9 pr-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold">
              <label className="text-slate-800">Password</label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-9 pr-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
          New user?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Register for Free
          </Link>
        </div>

      </div>
    </div>
  );
}
