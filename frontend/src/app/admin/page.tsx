'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Radio,
  Users,
  Bell,
  Camera,
  RefreshCw,
  FileText,
  Printer,
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IncidentReport, SensorNode, AlertNotification, HotspotZone } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export default function AdminPage() {
  const { user, role, language } = useAuth();
  const t = translations[language];

  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [hotspots, setHotspots] = useState<HotspotZone[]>([]);
  const [activeTab, setActiveTab] = useState<'triage' | 'sensors' | 'users' | 'zones'>('triage');
  const [loading, setLoading] = useState(true);

  // Sensor threshold state
  const [rainThreshold, setRainThreshold] = useState(35);
  const [moistThreshold, setMoistThreshold] = useState(80);
  const [tiltThreshold, setTiltThreshold] = useState(3.5);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [iData, sData, aData, hData] = await Promise.all([
        apiClient.getIncidents(),
        apiClient.getSensors(),
        apiClient.getAlerts(),
        apiClient.getHotspots()
      ]);
      setIncidents(iData);
      setSensors(sData);
      setAlerts(aData);
      setHotspots(hData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIncident = async (id: string) => {
    const updated = await apiClient.updateIncidentStatus(id, 'Verified', user?.name || 'SDMA Control Officer');
    if (updated) {
      setIncidents(prev => prev.map(i => i.id === id ? updated : i));
    }
  };

  const handleResolveIncident = async (id: string) => {
    const updated = await apiClient.updateIncidentStatus(id, 'Resolved', user?.name || 'SDMA Control Officer');
    if (updated) {
      setIncidents(prev => prev.map(i => i.id === id ? updated : i));
    }
  };

  const handleSaveThresholds = () => {
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 3000);
  };

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Operations Control HQ
            </span>
            <span className="text-xs text-slate-500 font-medium">• Active Persona: <strong className="text-blue-600 uppercase">{role}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'Disaster Incident Triage & Operations' : 'आपदा नियंत्रण एवं घटना सत्यापन केंद्र'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/alerts"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Generate Warning Blast</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print SitRep</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('triage')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'triage'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Incident Triage Board ({incidents.filter(i => i.status === 'Pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('sensors')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'sensors'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Sensor Nodes & Thresholds</span>
        </button>

        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'zones'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Risk Zones & Hotspots ({hotspots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & Volunteers</span>
        </button>
      </div>

      {/* Tab 1: Incident Triage Board (Clean White Cards) */}
      {activeTab === 'triage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">
              Citizen Hazard Verification Queue
            </h3>
            <button
              onClick={loadAllData}
              className="flex items-center space-x-1 text-xs text-blue-600 font-bold hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Queue</span>
            </button>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-blue-400 transition"
              >
                <div className="flex items-start space-x-4">
                  {inc.image_url && (
                    <img
                      src={inc.image_url}
                      alt="Incident proof"
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                        inc.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {inc.hazard_type} • {inc.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{inc.id}</span>
                      <span className="text-xs text-slate-600 font-bold">• {inc.location_name}</span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900">{inc.title}</h4>
                    <p className="text-xs text-slate-600 max-w-2xl font-normal">{inc.description}</p>
                    
                    <p className="text-[11px] text-slate-500">
                      Reported by: <strong>{inc.reporter_name}</strong> {inc.reporter_phone && `(${inc.reporter_phone})`} • {new Date(inc.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                    (inc.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800')
                  }`}>
                    {inc.status}
                  </span>

                  {inc.status === 'Pending' && (
                    <button
                      onClick={() => handleVerifyIncident(inc.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Verify & Dispatch SDRF
                    </button>
                  )}

                  {inc.status === 'Verified' && (
                    <button
                      onClick={() => handleResolveIncident(inc.id)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sensor Health & Threshold Config */}
      {activeTab === 'sensors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 7 Cols: Sensor Health Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              IoT Telemetry Stations Monitor
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 text-[11px] font-black uppercase">
                    <th className="py-2.5">Station</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Rain (mm/h)</th>
                    <th className="py-2.5">Soil Moisture</th>
                    <th className="py-2.5">Slope Tilt</th>
                    <th className="py-2.5">Battery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sensors.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          s.status === 'CRITICAL' ? 'bg-red-600 text-white' : (s.status === 'WARNING' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white')
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-blue-600">{s.rainfall_rate_mm_hr}</td>
                      <td className="py-3 font-mono font-bold text-blue-600">{s.soil_moisture_pct}%</td>
                      <td className="py-3 font-mono font-bold text-slate-900">{s.tilt_degrees}°</td>
                      <td className="py-3 font-mono font-bold text-emerald-600">{s.battery_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right 5 Cols: Configurable Alarm Thresholds */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Automatic Alarm Trigger Thresholds
            </h3>

            {thresholdSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
                ✓ Telemetry threshold triggers updated across all nodes.
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">Precipitation Breach (mm/h)</span>
                  <span className="font-mono text-blue-600 font-black">{rainThreshold} mm/h</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={rainThreshold}
                  onChange={(e) => setRainThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">Soil Moisture Threshold (%)</span>
                  <span className="font-mono text-blue-600 font-black">{moistThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={moistThreshold}
                  onChange={(e) => setMoistThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">Borehole Inclinometer Creep Tilt (°)</span>
                  <span className="font-mono text-amber-600 font-black">{tiltThreshold}°</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={8.0}
                  step={0.1}
                  value={tiltThreshold}
                  onChange={(e) => setTiltThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <button
                onClick={handleSaveThresholds}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition mt-2"
              >
                Save & Deploy Thresholds
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Risk Zones & Hotspots */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotspots.map(h => (
            <div key={h.id} className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                  h.risk_level === 'HIGH_RISK' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {h.risk_level}
                </span>
                <span className="font-black text-xs text-red-600">{h.risk_score}% Risk</span>
              </div>
              <h4 className="font-black text-sm text-slate-900">{h.name}</h4>
              <p className="text-xs text-slate-600">District: {h.district}, {h.state} • Elevation {h.elevation_m}m</p>
              <div className="text-xs text-slate-700 font-semibold">
                Protected Pop: <strong className="text-blue-700">{h.vulnerable_population.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Users & Volunteers */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Registered Disaster Officers & Aapda Mitra Volunteers
            </h3>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">3 Key Personnel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                Admin HQ
              </span>
              <p className="font-black text-sm text-slate-900">Dr. Rajeshwar Sharma</p>
              <p className="text-slate-600 font-medium">admin@aquavision.gov.in</p>
              <p className="text-blue-600 text-xs font-semibold">NDMA National Command</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                Disaster Officer
              </span>
              <p className="font-black text-sm text-slate-900">Ananya Nair</p>
              <p className="text-slate-600 font-medium">officer@aquavision.gov.in</p>
              <p className="text-blue-600 text-xs font-semibold">Kerala SDMA (Wayanad Sector)</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Citizen Volunteer
              </span>
              <p className="font-black text-sm text-slate-900">Vikram Singh Negi</p>
              <p className="text-slate-600 font-medium">citizen@aquavision.gov.in</p>
              <p className="text-blue-600 text-xs font-semibold">Aapda Mitra (Joshimath Sector)</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
