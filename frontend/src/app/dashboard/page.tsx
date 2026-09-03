'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  MapPin,
  Bell,
  AlertTriangle,
  Camera,
  Users,
  Radio,
  Activity,
  Layers,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Droplet,
  Compass
} from 'lucide-react';
import { DynamicMap } from '@/components/Map/DynamicMap';
import { apiClient } from '@/lib/api';
import { HotspotZone, SensorNode, IncidentReport, AnalyticsData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export default function DashboardPage() {
  const { language, role } = useAuth();
  const t = translations[language];

  const [hotspots, setHotspots] = useState<HotspotZone[]>([]);
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
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
      if (hData.length > 0) setSelectedHotspot(hData[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredHotspots = filterDistrict === 'all'
    ? hotspots
    : hotspots.filter(h => h.district.toLowerCase() === filterDistrict.toLowerCase());

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      
      {/* Top Header & Ticker */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Disaster Monitoring Command Center
            </span>
            <span className="text-xs text-slate-500 font-medium">• Live Telemetry Sensor Mesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'Live Landslide Risk Map & Sensor Dashboard' : 'जीआईएस मानचित्र एवं टेलीमेट्री डैशबोर्ड'}
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
            <span>Sync Live Telemetry</span>
          </button>

          <Link
            href="/predict"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
          >
            <span>Run AI Prediction &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Statistics Metrics (Clean White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Alerts */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Alerts</p>
            <h3 className="text-3xl font-black text-red-600 mt-0.5">
              {analytics?.active_alerts_count ?? 2}
            </h3>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              1 Red • 1 Orange Advisory
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        {/* High Risk Hotspots */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Risk Areas</p>
            <h3 className="text-3xl font-black text-amber-600 mt-0.5">
              {analytics?.high_risk_zones_count ?? 2}
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              Wayanad & Chamoli
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Reported Incidents */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Incidents</p>
            <h3 className="text-3xl font-black text-blue-600 mt-0.5">
              {incidents.length}
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              {incidents.filter(i => i.status === 'Verified').length} Verified / Dispatched
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        {/* Connected Villages */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connected Villages</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-0.5">
              {analytics?.connected_villages_count ?? 24}
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              17,350 Protected Pop.
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Map & Hotspot Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Interactive Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Filter Hill Sector:</span>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                <option value="all">All Hill Districts (5 Regions)</option>
                <option value="wayanad">Wayanad (Kerala)</option>
                <option value="chamoli">Chamoli / Joshimath (Uttarakhand)</option>
                <option value="shimla">Shimla (Himachal Pradesh)</option>
                <option value="idukki">Idukki / Munnar (Kerala)</option>
                <option value="nilgiris">Nilgiris / Ooty (Tamil Nadu)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="flex items-center space-x-1 text-red-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <span>High Risk (Red)</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Medium Risk (Amber)</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Safe (Green)</span>
              </span>
            </div>

          </div>

          <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <DynamicMap
              hotspots={filteredHotspots}
              sensors={sensors}
              incidents={incidents}
              onSelectHotspot={(h) => setSelectedHotspot(h)}
              height="580px"
            />
          </div>
        </div>

        {/* Right 1 Col: Selected Hotspot Details & Live Telemetry Panel */}
        <div className="space-y-4">
          
          {/* Selected Hotspot Card */}
          {selectedHotspot && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Selected Hotspot</span>
                  <h3 className="text-base font-black text-slate-900">{selectedHotspot.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                  selectedHotspot.risk_level === 'HIGH_RISK'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : (selectedHotspot.risk_level === 'MEDIUM_RISK'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                }`}>
                  {selectedHotspot.risk_level.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold">District & State</p>
                  <p className="font-bold text-slate-900">{selectedHotspot.district}, {selectedHotspot.state}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold">Elevation</p>
                  <p className="font-bold text-slate-900">{selectedHotspot.elevation_m} meters</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold">Protected Pop.</p>
                  <p className="font-bold text-slate-900">{selectedHotspot.vulnerable_population.toLocaleString()} citizens</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-bold">Calculated Risk</p>
                  <p className="font-black text-red-600">{selectedHotspot.risk_score}% Severity</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">Habitations at Risk:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                  {selectedHotspot.connected_villages.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">Evacuation Infrastructure:</p>
                <div className="space-y-1.5">
                  {selectedHotspot.critical_infrastructure.map((infra, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">[{infra.type}] {infra.name}</span>
                        {infra.capacity && <p className="text-[11px] text-blue-700 font-semibold">Capacity: {infra.capacity} evacuees</p>}
                        {infra.status && <p className="text-[11px] text-red-600 font-bold">{infra.status}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/predict`}
                className="w-full block text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
              >
                Run AI Geotechnical Analysis &rarr;
              </Link>
            </div>
          )}

          {/* Live Sensor Telemetry Nodes List */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  IoT Sensor Telemetry Nodes
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                6 Online
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {sensors.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition text-xs space-y-1.5 bg-slate-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">{s.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      s.status === 'CRITICAL' ? 'bg-red-600 text-white' : (s.status === 'WARNING' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white')
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs text-slate-600">
                    <div>Rain: <strong className="text-blue-600">{s.rainfall_rate_mm_hr} mm/h</strong></div>
                    <div>Moist: <strong className="text-blue-600">{s.soil_moisture_pct}%</strong></div>
                    <div>Tilt: <strong className="text-slate-900">{s.tilt_degrees}°</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* District Vulnerability Matrix Table (Clean White Table) */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Inter-District Vulnerability & Risk Matrix
            </h3>
            <p className="text-xs text-slate-600">
              Official status across monitored Indian mountain districts.
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Detailed Analytics &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-black">
                <th className="py-3 px-3">District & State</th>
                <th className="py-3 px-3">Risk Classification</th>
                <th className="py-3 px-3">Active Alerts</th>
                <th className="py-3 px-3">IoT Nodes</th>
                <th className="py-3 px-3">Vulnerable Population</th>
                <th className="py-3 px-3">Primary Hotspots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics?.districts.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50">
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {d.district} <span className="text-slate-500 font-normal">({d.state})</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                      d.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      (d.risk_level === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      (d.risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'))
                    }`}>
                      {d.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-black">
                    {d.active_alerts > 0 ? (
                      <span className="text-red-600">{d.active_alerts} Active</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-blue-600">{d.sensor_count} Sensors</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {d.vulnerable_population.toLocaleString()} citizens
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {d.primary_hotspots.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
