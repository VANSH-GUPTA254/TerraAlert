'use client';

import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Download,
  Send,
  RefreshCw,
  Info,
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { apiClient } from '@/lib/api';
import { PredictionInput, PredictionOutput } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translations } from '@/lib/i18n';

const PRESET_SCENARIOS = [
  {
    id: 'wayanad-monsoon',
    name: '🔴 Wayanad Chooralmala Extreme Monsoon',
    desc: '214mm cloudburst, 92.5% soil moisture, 38° slope steepness.',
    params: {
      rainfall_24h_mm: 214,
      soil_moisture_pct: 92.5,
      slope_angle_deg: 38,
      vegetation_index_ndvi: 0.22,
      historical_risk_score: 0.90,
      soil_type: 'Sandy Loam / Debris',
      location_name: 'Wayanad Chooralmala-Mundakkai'
    }
  },
  {
    id: 'joshimath-subsidence',
    name: '🟠 Joshimath Moraine Creep & Rain',
    desc: '95mm rain, 81% moisture, 44° steep colluvium slope.',
    params: {
      rainfall_24h_mm: 95,
      soil_moisture_pct: 81.0,
      slope_angle_deg: 44,
      vegetation_index_ndvi: 0.15,
      historical_risk_score: 0.85,
      soil_type: 'Deep Clay / Colluvium',
      location_name: 'Joshimath Sunil-Manohar Bagh'
    }
  },
  {
    id: 'shimla-surge',
    name: '🟡 Shimla Summer Hill Surge',
    desc: '65mm rain, 68% moisture, 32° slope, moderate trees.',
    params: {
      rainfall_24h_mm: 65,
      soil_moisture_pct: 68.0,
      slope_angle_deg: 32,
      vegetation_index_ndvi: 0.52,
      historical_risk_score: 0.55,
      soil_type: 'Silt / Clayey Loam',
      location_name: 'Shimla Summer Hill Slopes'
    }
  },
  {
    id: 'nilgiris-safe',
    name: '🟢 Nilgiris Coonoor Stable Baseline',
    desc: '12mm light rain, 34% moisture, 24° gentle slope, thick tea estate.',
    params: {
      rainfall_24h_mm: 12,
      soil_moisture_pct: 34.0,
      slope_angle_deg: 24,
      vegetation_index_ndvi: 0.82,
      historical_risk_score: 0.20,
      soil_type: 'Bedrock / Granite',
      location_name: 'Nilgiris Coonoor Sector'
    }
  }
];

export default function PredictionPage() {
  const { language, role } = useAuth();
  const t = translations[language];

  const [inputData, setInputData] = useState<PredictionInput>({
    rainfall_24h_mm: 145,
    soil_moisture_pct: 78,
    slope_angle_deg: 35,
    vegetation_index_ndvi: 0.35,
    historical_risk_score: 0.65,
    soil_type: 'Sandy Loam / Debris',
    location_name: 'Wayanad Meppadi Hill Corridor'
  });

  const [result, setResult] = useState<PredictionOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const runPrediction = async (params: PredictionInput) => {
    setLoading(true);
    setBroadcastSent(false);
    try {
      const res = await apiClient.predictRisk(params);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction(inputData);
  }, []);

  const handleSliderChange = (field: keyof PredictionInput, value: any) => {
    const updated = { ...inputData, [field]: value };
    setInputData(updated);
    runPrediction(updated);
  };

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setInputData(preset.params);
    runPrediction(preset.params);
  };

  const handleBroadcastAlert = async () => {
    if (!result) return;
    const severity = result.risk_level === 'HIGH_RISK' ? 'Critical' : (result.risk_level === 'MEDIUM_RISK' ? 'Moderate' : 'Safe');
    await apiClient.createAlert({
      title: `${result.risk_level.replace('_', ' ')}: Landslide Risk in ${inputData.location_name}`,
      severity: severity,
      hazard_type: 'AI-Generated Landslide Risk Broadcast',
      target_area: inputData.location_name || 'Hill Corridor',
      affected_villages: ['Sector A', 'Sector B', 'Downstream Riverside Settlement'],
      description: result.summary,
      instructions: result.recommended_actions,
      latitude: 11.5348,
      longitude: 76.1783,
      radius_km: 12.0
    });
    setBroadcastSent(true);
  };

  const printSitRep = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              AI Risk Predictor
            </span>
            <span className="text-xs text-slate-500 font-medium">• Geotechnical Physics & AI Estimator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {language === 'en' ? 'AI Landslide Risk Prediction & Simulation' : 'एआई भूस्खलन जोखिम पूर्वानुमान एवं सिमुलेटर'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={printSitRep}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Quick Selectors */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          Try Pre-Set Hill Scenarios:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:shadow-sm transition space-y-1"
            >
              <p className="text-xs font-black text-slate-900">{p.name}</p>
              <p className="text-xs text-slate-600">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Sliders on Left, AI Inference Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Input Sliders (Clean White Card) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">Adjust Environmental Factors</h3>
            </div>
            <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Live AI Recalculating</span>
          </div>

          <div className="space-y-5 text-xs">
            
            {/* Input 1: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">24-Hour Rainfall Amount</span>
                <span className="text-blue-600 font-black font-mono text-sm">{inputData.rainfall_24h_mm} mm</span>
              </div>
              <input
                type="range"
                min={0}
                max={400}
                step={1}
                value={inputData.rainfall_24h_mm}
                onChange={(e) => handleSliderChange('rainfall_24h_mm', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0 mm (Dry)</span>
                <span>150 mm (Heavy Rain)</span>
                <span>250+ mm (Cloudburst)</span>
              </div>
            </div>

            {/* Input 2: Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Ground Water Saturation (%)</span>
                <span className="text-blue-600 font-black font-mono text-sm">{inputData.soil_moisture_pct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={inputData.soil_moisture_pct}
                onChange={(e) => handleSliderChange('soil_moisture_pct', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0% (Dry Soil)</span>
                <span>65% (Moist)</span>
                <span>100% (Completely Muddy)</span>
              </div>
            </div>

            {/* Input 3: Slope Angle */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Hill Slope Angle (Degrees)</span>
                <span className="text-blue-600 font-black font-mono text-sm">{inputData.slope_angle_deg}°</span>
              </div>
              <input
                type="range"
                min={5}
                max={75}
                step={1}
                value={inputData.slope_angle_deg}
                onChange={(e) => handleSliderChange('slope_angle_deg', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>5° (Flat ground)</span>
                <span>35° (Steep hill)</span>
                <span>75° (Cliff)</span>
              </div>
            </div>

            {/* Input 4: Vegetation Index (NDVI) */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Trees & Plant Cover (NDVI)</span>
                <span className="text-emerald-600 font-black font-mono text-sm">{inputData.vegetation_index_ndvi}</span>
              </div>
              <input
                type="range"
                min={-0.2}
                max={1.0}
                step={0.01}
                value={inputData.vegetation_index_ndvi}
                onChange={(e) => handleSliderChange('vegetation_index_ndvi', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0.0 (No Trees / Bare Earth)</span>
                <span>0.5 (Moderate Bushes)</span>
                <span>1.0 (Thick Forest Roots)</span>
              </div>
            </div>

            {/* Input 5: Historical Score */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Past Landslide History</span>
                <span className="text-blue-600 font-black font-mono text-sm">{inputData.historical_risk_score}</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={inputData.historical_risk_score}
                onChange={(e) => handleSliderChange('historical_risk_score', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0.0 (Never slipped)</span>
                <span>0.5 (Occasional rockfall)</span>
                <span>1.0 (Frequent mudslides)</span>
              </div>
            </div>

            {/* Soil Type Select */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-800">
                Soil Type on the Hill
              </label>
              <select
                value={inputData.soil_type}
                onChange={(e) => handleSliderChange('soil_type', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              >
                <option value="Sandy Loam / Debris">Sandy Loam / Colluvial Debris (Western Ghats typical)</option>
                <option value="Deep Clay / Colluvium">Deep Clay / Weathered Colluvium (Himalayan Fault zone)</option>
                <option value="Silt / Clayey Loam">Silt / Clayey Loam (Urban Ridge)</option>
                <option value="Gravelly / Coarse Debris">Gravelly / Coarse Scree</option>
                <option value="Bedrock / Granite">Solid Bedrock / Granite Formation</option>
              </select>
            </div>

            {/* Target Location Name */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-800">
                Location Name
              </label>
              <input
                type="text"
                value={inputData.location_name}
                onChange={(e) => handleSliderChange('location_name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                placeholder="e.g. Wayanad Chooralmala Ridge"
              />
            </div>

          </div>
        </div>

        {/* Right 7 Cols: AI Prediction Output (Clean White Card) */}
        <div className="lg:col-span-7 space-y-6">
          
          {result && (
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-6">
              
              {/* Top Risk Level Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                    result.risk_level === 'HIGH_RISK' ? 'bg-red-600' : (result.risk_level === 'MEDIUM_RISK' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600')
                  }`}>
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Calculated Safety Status
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      {result.risk_level === 'HIGH_RISK' ? (
                        <span className="text-red-600">HIGH RISK (EVACUATE)</span>
                      ) : (result.risk_level === 'MEDIUM_RISK' ? (
                        <span className="text-amber-600">MEDIUM RISK (MONITOR)</span>
                      ) : (
                        <span className="text-emerald-600">SAFE (NORMAL)</span>
                      ))}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Risk Score</p>
                    <p className="text-2xl font-black text-slate-900 font-mono">{result.risk_score_pct}%</p>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Confidence</p>
                    <p className="text-2xl font-black text-blue-600 font-mono">{result.confidence_pct}%</p>
                  </div>
                </div>
              </div>

              {/* Geotechnical Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    Slope Stability Factor: <span className="font-mono text-blue-700">{result.factor_of_safety} Fs</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {result.factor_of_safety < 1.0 ? '🚨 Ground Slippage Imminent' : (result.factor_of_safety < 1.3 ? '⚠️ Soil Weakening' : '✅ Stable & Safe')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              {/* Explainable AI: Feature Contribution Chart */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <BrainCircuit className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Why Is This Area At Risk? (Factor Importance)
                    </h4>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold">% Risk Share</span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.factors_breakdown} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: '#0f172a' }} />
                      <YAxis type="category" dataKey="factor" width={140} tick={{ fontSize: 10, fill: '#0f172a' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        formatter={(val: any) => [`${val}% Contribution`, 'Risk Factor']}
                      />
                      <Bar dataKey="contribution_pct" radius={[0, 6, 6, 0]}>
                        {result.factors_breakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0 ? '#2563EB' :
                              index === 1 ? '#0284C7' :
                              index === 2 ? '#D97706' :
                              index === 3 ? '#059669' : '#7C3AED'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Action Protocols */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Recommended Actions for Citizens & Field Teams:</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {result.recommended_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Broadcast Alert Trigger CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3 border-t border-slate-200">
                <div className="text-xs text-slate-700">
                  Protocol Urgency: <strong className="text-blue-700">{result.evacuation_urgency}</strong>
                </div>

                <button
                  onClick={handleBroadcastAlert}
                  disabled={broadcastSent}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs shadow-md transition ${
                    broadcastSent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{broadcastSent ? 'Emergency Blast Dispatched ✓' : 'Broadcast Early Warning to Villages'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
