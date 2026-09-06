'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export const Footer: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language];

  return (
    <footer className="bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Terra<span className="text-blue-600">Alert</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'AI-Powered Landslide Early Warning and Geotechnical Risk Monitoring System.'
                : 'विकसित एआई-संचालित भूस्खलन पूर्व चेतावनी एवं जोखिम निगरानी प्रणाली।'}
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IoT Telemetry Sensor Mesh: Operational</span>
            </div>
          </div>

          {/* Col 2: Emergency Helplines (Govt Directory) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {language === 'en' ? '24/7 Disaster Helplines' : '24/7 आपातकालीन हेल्पलाइन'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600 font-medium">NDMA National Control Room</span>
                <span className="font-black text-blue-700">1070</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600 font-medium">State / District Emergency (EOC)</span>
                <span className="font-black text-blue-700">1077</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600 font-medium">Universal Emergency Response (ERSS)</span>
                <span className="font-black text-red-600">112</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Disaster Medical / Ambulance</span>
                <span className="font-black text-emerald-700">108</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {language === 'en' ? 'Platform Modules' : 'प्लेटफ़ॉर्म मॉड्यूल'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition">GIS Map & Command</Link>
              <Link href="/predict" className="text-slate-600 hover:text-blue-600 transition">AI Risk Predictor</Link>
              <Link href="/report" className="text-slate-600 hover:text-blue-600 transition">Citizen Report</Link>
              <Link href="/alerts" className="text-slate-600 hover:text-blue-600 transition">Alert Center</Link>
              <Link href="/analytics" className="text-slate-600 hover:text-blue-600 transition">Analytics</Link>
              <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition">Operations HQ</Link>
            </div>
          </div>

          {/* Col 4: Hotspots Monitored */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {language === 'en' ? 'Monitored Hill Ranges' : 'निगरानी वाले पर्वतीय क्षेत्र'}
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['Wayanad (KL)', 'Joshimath (UK)', 'Shimla (HP)', 'Munnar (KL)', 'Nilgiris (TN)', 'Kedarnath (UK)', 'Darjeeling (WB)'].map((zone) => (
                <span key={zone} className="px-2 py-1 rounded-md bg-white text-slate-800 border border-slate-200 font-semibold shadow-2xs">
                  {zone}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-2 font-medium">
              Common Alerting Protocol (OASIS CAP v1.2) XML Compliant
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            TerraAlert<strong className="text-slate-800">1</strong>
          </div>
          <div>
            Designed for Citizens, Field Volunteers & Disaster Management Authorities
          </div>
        </div>
      </div>
    </footer>
  );
};
