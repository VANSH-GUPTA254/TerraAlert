'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, UserPlus, Mail, Lock, Phone, Building, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('Wayanad');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center px-4 py-12 text-slate-900">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto font-bold shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Register for TerraAlert
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Create an early warning and disaster response account
          </p>
        </div>

        {/* Role Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-900">Choose Your Role</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                role === 'citizen'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Citizen / Volunteer
            </button>
            <button
              type="button"
              onClick={() => setRole('officer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                role === 'officer'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Disaster Officer
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                role === 'admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Admin HQ
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="block font-black text-slate-800">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suresh Varma"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-black text-slate-800">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.gov.in"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-black text-slate-800">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-black text-slate-800">Department / NGO</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder={role === 'citizen' ? 'Aapda Mitra Volunteer' : 'District Emergency Center'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-black text-slate-800">Hill District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
              >
                <option value="Wayanad">Wayanad (Kerala)</option>
                <option value="Chamoli">Chamoli / Joshimath (UK)</option>
                <option value="Shimla">Shimla (Himachal)</option>
                <option value="Idukki">Idukki / Munnar (Kerala)</option>
                <option value="Nilgiris">Nilgiris (Tamil Nadu)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-black text-slate-800">Create Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
          Already registered?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
