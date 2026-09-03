'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Clock,
  ShieldCheck,
  Video,
  Navigation,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiClient } from '@/lib/api';
import { IncidentReport, HazardType, IncidentSeverity } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

const HAZARD_TYPES: HazardType[] = [
  'Rockfall',
  'Mudslide',
  'Road Subsidence',
  'Hillside Crack',
  'River Flooding',
  'Debris Flow'
];

const SEVERITY_LEVELS: IncidentSeverity[] = ['Minor', 'Moderate', 'Severe', 'Critical'];

const SAMPLE_HAZARD_PHOTOS = [
  'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
];

export default function ReportPage() {
  const { user, role, language } = useAuth();
  const t = translations[language];

  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [hazardType, setHazardType] = useState<HazardType>('Mudslide');
  const [severity, setSeverity] = useState<IncidentSeverity>('Severe');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Wayanad Meppadi Hillroad km-8');
  const [lat, setLat] = useState<number>(11.5348);
  const [lng, setLng] = useState<number>(76.1783);
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_HAZARD_PHOTOS[0]);
  const [reporterName, setReporterName] = useState<string>(user?.name || 'Aapda Mitra Citizen');
  const [reporterPhone, setReporterPhone] = useState<string>(user?.phone || '+91 94470 12345');
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetectLocation = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setLocationName(`GPS Detected (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`);
          setDetectingLocation(false);
        },
        () => {
          setLat(11.5348);
          setLng(76.1783);
          setLocationName('Wayanad Chooralmala Sector (GPS Simulated)');
          setDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const created = await apiClient.createIncident({
        title,
        hazard_type: hazardType,
        severity,
        description,
        latitude: lat,
        longitude: lng,
        location_name: locationName,
        image_url: imageUrl,
        reporter_name: reporterName,
        reporter_phone: reporterPhone
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSuccessMsg(`Incident #${created.id} received! Emergency team and local officers notified.`);
      setTitle('');
      setDescription('');
      loadIncidents();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    const updated = await apiClient.upvoteIncident(id);
    if (updated) {
      setIncidents(prev => prev.map(i => i.id === id ? updated : i));
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Citizen Reporting
            </span>
            <span className="text-xs text-slate-500 font-medium">• Direct Dispatch to Local Disaster Control Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'Citizen Hazard Reporting Portal' : 'नागरिक भूस्खलन रिपोर्टिंग पोर्टल'}
          </h1>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          Emergency Dispatch Hotline: <strong className="text-blue-700">1077 / 112</strong>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs font-bold shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Form on Left, Public Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Submit Form (Clean White Card) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900">Report a Hazard or Crack</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900">
                What did you see? (Short Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rocks rolling down hill near school bridge"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Hazard Type & Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-black text-slate-900">Hazard Category</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value as HazardType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                >
                  {HAZARD_TYPES.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-black text-slate-900">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                >
                  {SEVERITY_LEVELS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & GPS Auto Detect */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-black text-slate-900">Location</label>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={detectingLocation}
                  className="flex items-center space-x-1 text-blue-600 font-bold hover:underline text-xs bg-blue-50 px-2 py-0.5 rounded-md"
                >
                  <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
                  <span>{detectingLocation ? 'Locating...' : 'Auto-Detect GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Village / Landmark / Road Kilometer"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                <div>Latitude: <strong>{lat}</strong></div>
                <div>Longitude: <strong>{lng}</strong></div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900">
                Detailed Observation & Road Condition *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe if the road is blocked, if trees are tilting, or if water is muddy..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Photo Attachment Selection */}
            <div className="space-y-2">
              <label className="block font-black text-slate-900">
                Attach Photo Proof (Choose or Select Preview)
              </label>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {SAMPLE_HAZARD_PHOTOS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    onClick={() => setImageUrl(url)}
                    alt="Sample Hazard"
                    className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition ${
                      imageUrl === url ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste photo link"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-[11px] font-mono text-slate-800"
              />
            </div>

            {/* Reporter info */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">Your Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{submitting ? 'Transmitting to Control Room...' : 'Submit Incident Report'}</span>
            </button>

          </form>
        </div>

        {/* Right 7 Cols: Crowd-Sourced Public Feed (Clean White Cards) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Recent Citizen Reports & Field Updates
              </h3>
              <p className="text-xs text-slate-600">
                Reports are reviewed by local officers and marked on the live map.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {incidents.length} Reports
            </span>
          </div>

          <div className="space-y-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs space-y-3 hover:border-blue-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                      inc.severity === 'Critical' ? 'bg-red-600 text-white' :
                      (inc.severity === 'Severe' ? 'bg-amber-500 text-slate-950' :
                      'bg-yellow-100 text-yellow-900 border border-yellow-300')
                    }`}>
                      {inc.hazard_type} • {inc.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{inc.id}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                    (inc.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800')
                  }`}>
                    {inc.status === 'Verified' ? '✓ Officer Verified' : (inc.status === 'Resolved' ? '✓ Resolved & Cleared' : '⏳ Under Review')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {inc.image_url && (
                    <div className="sm:col-span-1">
                      <img
                        src={inc.image_url}
                        alt="Hazard Attachment"
                        className="w-full h-24 sm:h-24 rounded-2xl object-cover border border-slate-200"
                      />
                    </div>
                  )}

                  <div className={inc.image_url ? 'sm:col-span-3 space-y-1.5' : 'sm:col-span-4 space-y-1.5'}>
                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {inc.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {inc.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center space-x-1 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{inc.location_name}</span>
                      </span>
                      <span>•</span>
                      <span>By: <strong>{inc.reporter_name}</strong></span>
                    </div>
                  </div>
                </div>

                {inc.verified_by && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between font-semibold">
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Verified by: <strong>{inc.verified_by}</strong></span>
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">Relief Dispatched</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleUpvote(inc.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Confirm Hazard ({inc.upvotes || 1})</span>
                  </button>

                  <Link
                    href={`/dashboard`}
                    className="text-blue-600 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
