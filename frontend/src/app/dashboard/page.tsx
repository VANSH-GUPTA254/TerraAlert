'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Bell,
  Brain,
  Camera,
  BarChart3,
  Radio,
} from 'lucide-react';

import { DynamicMap } from '@/components/Map/DynamicMap';

export default function DashboardPage() {
  return (
    <div className="px-6 py-6">

      {/* HERO */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-black text-slate-900">
              TerraAlert Command Center
            </h1>

            <p className="text-slate-600 mt-2">
              AI-Powered Landslide Early Warning System
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">

            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              Live Monitoring
            </span>

            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
              2 Active Alerts
            </span>

          </div>

        </div>

      </div>

      {/* TOP KPI */}
      <div className="grid md:grid-cols-4 gap-4 mb-5">

        <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
          <Bell className="w-8 h-8 text-red-600 mb-2" />
          <h2 className="text-3xl font-black">2</h2>
          <p className="text-slate-500">Alerts</p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
          <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
          <h2 className="text-3xl font-black">5</h2>
          <p className="text-slate-500">Risk Zones</p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
          <Radio className="w-8 h-8 text-blue-600 mb-2" />
          <h2 className="text-3xl font-black">18</h2>
          <p className="text-slate-500">IoT Sensors</p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
          <Brain className="w-8 h-8 text-purple-600 mb-2" />
          <h2 className="text-3xl font-black">92%</h2>
          <p className="text-slate-500">Prediction Accuracy</p>
        </div>

      </div>

      {/* MAP */}

      <div className="bg-white border rounded-2xl p-5 mb-5">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Live Landslide Risk Map
          </h2>

          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Monitoring
          </span>

        </div>

        <div className="overflow-hidden rounded-xl border">

          <DynamicMap height="450px" />

        </div>

      </div>

      {/* ALERTS + AI */}

      <div className="grid lg:grid-cols-2 gap-5 mb-5">

        <div className="bg-white border rounded-2xl p-5">

          <h2 className="font-bold text-xl mb-4">
            Recent Alerts
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl p-3">
              <span>Wayanad</span>
              <span className="font-bold text-red-600">
                HIGH
              </span>
            </div>

            <div className="flex justify-between bg-orange-50 border border-orange-200 rounded-xl p-3">
              <span>Chamoli</span>
              <span className="font-bold text-orange-600">
                MEDIUM
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-5">

          <h2 className="font-bold text-xl mb-4">
            AI Prediction Summary
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-slate-500">
                Most Vulnerable Region
              </p>

              <p className="font-bold text-lg">
                Wayanad, Kerala
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Predicted Risk
              </p>

              <p className="font-bold text-red-600 text-lg">
                HIGH
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Confidence Score
              </p>

              <p className="font-bold text-lg">
                92%
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="grid md:grid-cols-3 gap-4">

        <Link
          href="/predict"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center gap-3"
        >
          <Brain />
          Run Prediction
        </Link>

        <Link
          href="/report"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 flex items-center gap-3"
        >
          <Camera />
          Report Incident
        </Link>

        <Link
          href="/analytics"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-5 flex items-center gap-3"
        >
          <BarChart3 />
          View Analytics
        </Link>

      </div>

    </div>
  );
}