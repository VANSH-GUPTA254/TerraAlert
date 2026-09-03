'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Radio,
  Send,
  ShieldAlert,
  MessageSquare,
  Smartphone,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Clock,
  Users
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AlertNotification } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

export default function AlertsPage() {
  const { language, sirenActive, toggleSiren, role } = useAuth();
  const t = translations[language];

  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'broadcast'>('active');
  const [selectedCapAlert, setSelectedCapAlert] = useState<AlertNotification | null>(null);

  // Broadcast form
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'Safe' | 'Moderate' | 'High' | 'Critical'>('Critical');
  const [hazardType, setHazardType] = useState('Imminent Landslide & Debris Torrent Warning');
  const [targetArea, setTargetArea] = useState('Wayanad Meppadi Hill Sector');
  const [villages, setVillages] = useState('Chooralmala, Mundakkai, Attamala, Meppadi Ward 12');
  const [description, setDescription] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAlerts();
      setAlerts(data);
      if (data.length > 0) setSelectedCapAlert(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setBroadcasting(true);
    try {
      const created = await apiClient.createAlert({
        title,
        severity,
        hazard_type: hazardType,
        target_area: targetArea,
        affected_villages: villages.split(',').map(v => v.trim()),
        description,
        instructions: [
          'Immediate evacuation to designated relief camps.',
          'Do not cross swollen bridges or streams.',
          'Dial 1077 / 112 for disaster emergency response.'
        ],
        channels: ['SMS (4,500 Delivered)', 'Push Siren (9,200 Devices)', 'Outdoor Sirens', 'WhatsApp Broadcast', 'CAP 1.2'],
        latitude: 11.5348,
        longitude: 76.1783,
        radius_km: 15.0
      });

      setBroadcastSuccess(true);
      setTitle('');
      setDescription('');
      loadAlerts();
      setActiveTab('active');
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcasting(false);
    }
  };

  const activeAlerts = alerts.filter(a => a.is_active);
  const pastAlerts = alerts.filter(a => !a.is_active);

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800">
              National Early Warning Broadcast System
            </span>
            <span className="text-xs text-slate-500 font-medium">• Multi-Channel Public Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'Emergency Alerts & Evacuation Bulletins' : 'आपातकालीन चेतावनी एवं प्रसारण केंद्र'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSiren}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
              sirenActive
                ? 'bg-amber-400 text-slate-950 animate-pulse'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {sirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{sirenActive ? 'Stop Emergency Siren' : 'Test Audio Siren Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Active Alerts ({activeAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Past Advisories ({pastAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'broadcast'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Officer Broadcast Wizard</span>
        </button>
      </div>

      {/* Tab 1: Active Alerts Feed & Multi-Channel Simulators */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 7 Cols: Active Alert Cards (Clean White Cards) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>Current High-Priority Bulletins</span>
            </h3>

            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedCapAlert(alert)}
                className={`rounded-3xl p-6 border-2 transition cursor-pointer shadow-xs ${
                  alert.severity === 'Critical'
                    ? 'bg-red-50/50 border-red-300'
                    : 'bg-amber-50/50 border-amber-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase text-white ${
                      alert.severity === 'Critical' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {alert.severity} WARNING
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{alert.id}</span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">Dispatched: {new Date(alert.dispatched_at).toLocaleTimeString()}</span>
                </div>

                <div className="space-y-3 pt-3">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {alert.description}
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      Affected Villages & Habitations ({alert.affected_villages.length} Areas):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.affected_villages.map(v => (
                        <span key={v} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      Safety Directives for Citizens:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-800 font-medium">
                      {alert.instructions.map((inst, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Multi-channel blast stats */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
                    {alert.channels.map((ch, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1.5">
                        <Radio className="w-3.5 h-3.5 text-blue-600" />
                        <span>{ch}</span>
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Right 5 Cols: Multi-Channel Simulation Drawer & CAP XML */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Simulated SMS Alert Preview in Clean Mobile Shell */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Emergency SMS Simulation (Cell Broadcast)
                  </h4>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  4,250 Delivered
                </span>
              </div>

              {/* Mobile Phone Mockup (Clean Light Theme) */}
              <div className="bg-slate-50 text-slate-900 p-5 rounded-2xl border-2 border-slate-200 font-sans space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pb-2 border-b border-slate-200">
                  <span className="text-blue-700">GOV-NDMA-EMERGENCY</span>
                  <span>SIM-1 • CELL BROADCAST</span>
                </div>
                <p className="font-black text-red-600 text-sm">
                  🚨 GOVERNMENT EMERGENCY WARNING:
                </p>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedCapAlert ? selectedCapAlert.title : 'High landslide danger in Wayanad Meppadi area. Evacuate to higher ground camps immediately. Call 1077 or 112.'}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 font-semibold">
                  Transmitted via National Common Alerting Protocol Gateway
                </div>
              </div>
            </div>

            {/* CAP 1.2 XML Feed Inspector */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    OASIS CAP v1.2 XML Payload
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">Standard Format</span>
              </div>

              <pre className="bg-slate-50 text-slate-800 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-200">
{`<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${selectedCapAlert?.cap_identifier || 'URN:IN-GOV:NDMA:CAP:20260904:WAYANAD-RED'}</identifier>
  <sender>ndma-eoc@aquavision.gov.in</sender>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Geo</category>
    <event>${selectedCapAlert?.hazard_type || 'Landslide Warning'}</event>
    <urgency>Immediate</urgency>
    <severity>${selectedCapAlert?.severity || 'Critical'}</severity>
    <headline>${selectedCapAlert?.title || 'RED ALERT'}</headline>
    <area>
      <areaDesc>${selectedCapAlert?.target_area || 'Wayanad'}</areaDesc>
      <circle>${selectedCapAlert?.latitude || 11.53},${selectedCapAlert?.longitude || 76.17},${selectedCapAlert?.radius_km || 12.0}</circle>
    </area>
  </info>
</alert>`}
              </pre>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Alert History & Archive */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900">
            Resolved Historical Advisories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastAlerts.map(a => (
              <div key={a.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                    {a.severity} (Archived)
                  </span>
                  <span className="text-slate-500 font-semibold">{new Date(a.dispatched_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{a.description}</p>
                <div className="text-xs text-slate-700 pt-1 font-semibold">
                  Target Sector: <strong className="text-blue-700">{a.target_area}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Officer Broadcast Launcher Wizard */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            <div>
              <h3 className="text-base font-black text-slate-900">Broadcast Early Warning Blast</h3>
              <p className="text-xs text-slate-500">Official dispatch for District Disaster Control Rooms</p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="block font-black text-slate-900">Warning Headline / Bulletin Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. RED ALERT: Immediate Evacuation – Meppadi Slopes"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-black text-slate-900">Alert Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                >
                  <option value="Critical">Critical / Red Alert</option>
                  <option value="High">High / Orange Advisory</option>
                  <option value="Moderate">Moderate / Yellow Precaution</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-black text-slate-900">Target Geographical Sector</label>
                <input
                  type="text"
                  required
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-black text-slate-900">Affected Villages / Habitations (Comma-separated)</label>
              <input
                type="text"
                required
                value={villages}
                onChange={(e) => setVillages(e.target.value)}
                placeholder="Village 1, Village 2, Ward 10"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-black text-slate-900">Detailed Warning Message & Evacuation Directives *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State risk findings, relief shelter locations, evacuation routes, and hotline numbers..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-red-800 text-xs font-bold">
              ⚠️ Submitting will trigger automated sirens, dispatch 4,000+ localized SMS broadcasts, and update the national CAP 1.2 emergency XML feed.
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{broadcasting ? 'Transmitting Multi-Channel Blast...' : 'Transmit Emergency Warning Blast'}</span>
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
