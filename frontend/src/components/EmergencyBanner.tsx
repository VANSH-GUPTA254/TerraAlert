'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Volume2, VolumeX, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export const EmergencyBanner: React.FC = () => {
  const { language, sirenActive, toggleSiren } = useAuth();
  const t = translations[language];

  return (
    <div className="bg-red-600 text-white border-b border-red-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center space-x-2.5 flex-1 min-w-[280px]">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="font-bold uppercase tracking-wider bg-red-800 px-2 py-0.5 rounded text-[11px]">
            RED ALERT
          </span>
          <span className="truncate font-medium">
            {language === 'en' 
              ? 'Wayanad Meppadi-Chooralmala: Extreme rainfall & 91% soil saturation. Mandatory evacuation ordered.'
              : 'वायनाड मेप्पाडी-चूरलमाला: अत्यधिक वर्षा एवं 91% मृदा संतृप्ति। तत्काल अनिवार्य निकासी आदेश।'}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={toggleSiren}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition shadow-sm ${
              sirenActive 
                ? 'bg-amber-300 text-gray-900 animate-pulse' 
                : 'bg-red-800/80 hover:bg-red-700 text-white'
            }`}
            title="Toggle Emergency Audio Siren Simulator"
          >
            {sirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{sirenActive ? (language === 'en' ? 'Siren Active [Mute]' : 'सायरन बंद करें') : (language === 'en' ? 'Sound Siren' : 'सायरन बजाएं')}</span>
          </button>

          <Link
            href="/alerts"
            className="flex items-center space-x-1 text-white underline hover:text-red-100 font-semibold text-xs"
          >
            <span>{language === 'en' ? 'View Alert Center' : 'अलर्ट केंद्र देखें'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
