'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Droplet,
  CloudRain,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { apiClient } from '@/lib/api';
import { AnalyticsData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsPage() {
  const { language } = useAuth();
  const t = translations[language];

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.getAnalytics();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pieData = [
    { name: 'Safe Zones (Low Risk)', value: 45 },
    { name: 'Medium Risk / Monitored', value: 35 },
    { name: 'Critical High Risk Hotspots', value: 20 }
  ];

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Disaster Analytics & Forecasting
            </span>
            <span className="text-xs text-slate-500 font-medium">• 30-Day Trends & 72h Monsoon Forecast</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'Disaster Analytics & Risk Trends' : 'आपदा विश्लेषण एवं जोखिम सांख्यिकी'}
          </h1>
        </div>
      </div>

      {/* Top Snapshot Metric Tiles (Clean White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monsoon Peak Rainfall</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">820 mm</h3>
          <p className="text-xs text-slate-500 mt-1">August 2026 Peak</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Incidents</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">152 Cases</h3>
          <p className="text-xs text-emerald-700 font-bold mt-1">132 Resolved (86.8%)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">IoT Sensor Telemetry Uptime</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">99.8%</h3>
          <p className="text-xs text-slate-500 mt-1">Solar & LoRa active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Early Warning Lead Time</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">4.5 Hours</h3>
          <p className="text-xs text-slate-500 mt-1">Pre-slide evacuation window</p>
        </div>

      </div>

      {/* Chart Row 1: Monthly Incidents vs Rainfall & 72h Monsoon Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Monthly Incident & Rain Correlation */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Monthly Incident Frequency vs. Monsoon Rainfall
              </h3>
              <p className="text-xs text-slate-600">Higher rainfall correlates with landslide spikes.</p>
            </div>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data?.monthly_incidents || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#0f172a' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#0f172a' }} unit=" mm" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#0f172a' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="rainfall_mm" name="Rainfall (mm)" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Line yAxisId="right" type="monotone" dataKey="incidents" name="Landslide Incidents" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: 72-Hour Predictive Monsoon Risk Forecast */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                72-Hour AI Monsoon Risk Forecast
              </h3>
              <p className="text-xs text-slate-600">Expected soil saturation levels over the next 3 days.</p>
            </div>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.forecast_72h || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#0f172a' }} />
                <YAxis tick={{ fontSize: 10, fill: '#0f172a' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="soil_saturation" name="Soil Saturation (%)" radius={[4, 4, 0, 0]}>
                  {(data?.forecast_72h || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart Row 2: Infiltration Threshold Curve & Area Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Rainfall vs Infiltration Failure Curve */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Rainfall Infiltration vs. Landslide Probability Curve
              </h3>
              <p className="text-xs text-slate-600">Danger rises rapidly when ground saturation crosses 85%.</p>
            </div>
            <Droplet className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.rainfall_vs_moisture_curve || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="rainfall_tier" tick={{ fontSize: 11, fill: '#0f172a' }} />
                <YAxis tick={{ fontSize: 11, fill: '#0f172a' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="landslide_probability_pct" name="Landslide Probability (%)" stroke="#DC2626" fill="#DC2626" fillOpacity={0.25} />
                <Area type="monotone" dataKey="saturation_pct" name="Soil Saturation (%)" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Risk Zone Proportion Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Monitored Mountain Sectors Breakdown
              </h3>
              <p className="text-xs text-slate-600">Current risk status distribution.</p>
            </div>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-center pt-2 border-t border-slate-200 font-bold">
            <div className="text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1" />
              <span>45% Safe</span>
            </div>
            <div className="text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1" />
              <span>35% Amber</span>
            </div>
            <div className="text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block mr-1" />
              <span>20% Red</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
