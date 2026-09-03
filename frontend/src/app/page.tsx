'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  MapPin,
  BrainCircuit,
  Camera,
  Bell,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Users,
  Activity,
  PhoneCall,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { DynamicMap } from '@/components/Map/DynamicMap';
import { apiClient } from '@/lib/api';
import { HotspotZone, SensorNode, IncidentReport, AnalyticsData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export default function HomePage() {
  const { language } = useAuth();
  const t = translations[language];

  const [hotspots, setHotspots] = useState<HotspotZone[]>([]);
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [hData, sData, iData, aData] = await Promise.all([
          apiClient.getHotspots(),
          apiClient.getSensors(),
          apiClient.getIncidents(),
          apiClient.getAnalytics()
        ]);
        setHotspots(hData);
        setSensors(sData);
        setIncidents(iData);
        setAnalytics(aData);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-white text-slate-900 space-y-12 pb-16">
      
      {/* Hero Section (Clean White Background, Black Text, Blue Highlight) */}
      <section className="relative bg-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            
            {/* Left Hero Text */}
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Smart India Hackathon • Problem Statement SIH26001</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.15]">
                AI-Based <span className="text-blue-600">Early Warning</span> & Landslide Risk Monitoring
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {language === 'en'
                  ? 'A simple and reliable disaster warning system for citizens, hill communities, field teams, and government authorities across Indian mountain regions.'
                  : 'भारतीय पर्वतीय क्षेत्रों के नागरिकों, राहत दलों और प्रशासनिक अधिकारियों के लिए सरल एवं विश्वसनीय आपदा पूर्व चेतावनी प्रणाली।'}
              </p>

              {/* Action Buttons for Common Users */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{language === 'en' ? 'Open Live Map & Safe Shelters' : 'लाइव मैप और राहत शिविर देखें'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/report"
                  className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border-2 border-slate-300 shadow-xs transition"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>{language === 'en' ? 'Report a Hazard / Crack' : 'दरार या भूस्खलन की रिपोर्ट करें'}</span>
                </Link>

                <Link
                  href="/predict"
                  className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm border border-blue-200 transition"
                >
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  <span>{language === 'en' ? 'AI Risk Simulator' : 'एआई जोखिम कैलकुलेटर'}</span>
                </Link>
              </div>

              {/* Simple Status Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-800">IoT Sensors: <strong className="text-blue-600">Online</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="text-slate-800">Active Alert: <strong className="text-red-600">Wayanad Sector</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-800">Helpline: <strong className="text-blue-600">1070 / 112</strong></span>
                </div>
              </div>

            </div>

            {/* Right Live Summary Box (Clean White Theme) */}
            <div className="lg:w-[420px] bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Live Hill Sensor Feed
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Live Stream</span>
              </div>

              {/* Sensor cards */}
              <div className="space-y-2.5">
                
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold">Wayanad Chooralmala Ridge</p>
                    <p className="text-sm font-black text-red-600">38.5 mm/h Rain • 91.2% Moisture</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black">
                    RED ALERT
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold">Joshimath Sunil Hillside</p>
                    <p className="text-sm font-black text-amber-600">5.6° Ground Tilt • High Pressure</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black">
                    MONITORED
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold">Nilgiris Coonoor Sector</p>
                    <p className="text-sm font-black text-emerald-600">4.2 mm/h Rain • Normal Slope</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                    SAFE
                  </span>
                </div>

              </div>

              <div className="pt-2">
                <Link
                  href="/predict"
                  className="w-full block text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Test AI Risk Prediction Sandbox &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top 4 Key Statistics Cards (Clean White Cards, Dark Text, Bold Numbers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Alerts */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.metrics.activeAlerts}
              </p>
              <h3 className="text-3xl font-black text-red-600 mt-1">
                {analytics?.active_alerts_count ?? 2}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">1 Red Alert • 1 Orange Advisory</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Bell className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: High Risk Hotspots */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.metrics.highRiskZones}
              </p>
              <h3 className="text-3xl font-black text-amber-600 mt-1">
                {analytics?.high_risk_zones_count ?? 2}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">Wayanad & Joshimath Sectors</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Reported Incidents */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.metrics.pendingIncidents}
              </p>
              <h3 className="text-3xl font-black text-blue-600 mt-1">
                {incidents.filter(i => i.status === 'Pending').length || 1}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                {incidents.filter(i => i.status === 'Verified').length} Verified & Dispatched
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Camera className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Connected Villages */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.metrics.connectedVillages}
              </p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">
                {analytics?.connected_villages_count ?? 24}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">17,350 vulnerable population</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>
      </section>

      {/* Interactive GIS Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                Interactive Map
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Live Landslide Risk Map & Village Shelters
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Shows safe zones, dangerous slopes, water levels, bridges, and relief centers.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition w-fit shadow-xs"
          >
            <span>Open Full Screen Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Map Component */}
        <div className="border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <DynamicMap
            hotspots={hotspots}
            sensors={sensors}
            incidents={incidents}
            height="500px"
          />
        </div>
      </section>

      {/* AI Risk Prediction Framework Overview (Clean White Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-900 border-2 border-slate-200 shadow-md space-y-8">
          
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
              <span>How AquaVision AI Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              5 Key Signs We Analyze to <span className="text-blue-600">Predict Landslides</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Our AI evaluates soil water absorption, rainfall volume, mountain steepness, and plant cover to alert communities hours before a slope fails.
            </p>
          </div>

          {/* 5 Core AI Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-blue-600 font-black text-xl">01</div>
              <h4 className="font-bold text-sm text-slate-900">24-Hour Rainfall</h4>
              <p className="text-xs text-slate-600">Measures the total amount of heavy rain in millimeters.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-blue-600 font-black text-xl">02</div>
              <h4 className="font-bold text-sm text-slate-900">Soil Moisture</h4>
              <p className="text-xs text-slate-600">Checks if the ground is completely soaked and turning into mud.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-blue-600 font-black text-xl">03</div>
              <h4 className="font-bold text-sm text-slate-900">Slope Steepness</h4>
              <p className="text-xs text-slate-600">Measures the angle of the hill. Steeper slopes fail faster.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-blue-600 font-black text-xl">04</div>
              <h4 className="font-bold text-sm text-slate-900">Tree & Plant Cover</h4>
              <p className="text-xs text-slate-600">Tree roots hold soil together. Barren hills have higher danger.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-blue-600 font-black text-xl">05</div>
              <h4 className="font-bold text-sm text-slate-900">Past History</h4>
              <p className="text-xs text-slate-600">Identifies zones with a past record of mudslides or cracks.</p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-4">
            <div className="text-xs text-slate-600">
              Clear Results: <strong className="text-emerald-700">Safe (Green)</strong> • <strong className="text-amber-700">Moderate (Yellow)</strong> • <strong className="text-red-700">High Risk (Red)</strong>
            </div>
            <Link
              href="/predict"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
            >
              Try AI Risk Calculator &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* Citizen Hazard Reporting & Safety Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Citizen Reporting Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Citizen Reporting</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Notice a Crack or Fallen Rocks? <span className="text-blue-600">Report in 30 Seconds</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Take a quick photo on your mobile phone, click "Auto-Detect GPS", and alert the emergency disaster team instantly.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your location is automatically detected by phone GPS.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Field officers inspect reports and dispatch rescue backhoes.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All neighbors in the area receive instant mobile alerts.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/report"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                <Camera className="w-4 h-4" />
                <span>Submit Hazard Report Now</span>
              </Link>
            </div>
          </div>

          {/* Quick Helpline & Safety Protocol Guide */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>What To Do If Landslide Danger Increases</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-amber-700">1. Watch for Warning Signs:</span>
                <p className="text-slate-600">New cracks on house walls, tilting power poles, muddy water suddenly pouring from hill slopes, or loud rumbling sounds.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-red-700">2. If Red Alert is Sounded:</span>
                <p className="text-slate-600">Leave immediately. Walk towards designated higher-ground relief schools and community shelters. Do not wait.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-blue-700">3. Emergency Call Numbers:</span>
                <p className="text-slate-600">National Disaster Control: <strong className="text-blue-700">1070</strong> | District Control: <strong className="text-blue-700">1077</strong> | Universal SOS: <strong className="text-red-700">112</strong></p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
