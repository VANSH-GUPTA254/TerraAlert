'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 400);
  };

  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center px-4 py-12 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto font-bold shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Reset Password
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Enter your official email to receive a password recovery authorization code.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password Reset Link Dispatched</span>
              </div>
              <p className="font-medium">
                An encrypted recovery link and OTP code have been sent to <strong>{email}</strong>.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full block text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-black text-slate-800">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@aquavision.gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-9 pr-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Sending Instructions...' : 'Send Recovery OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-slate-600 pt-2 font-medium">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
