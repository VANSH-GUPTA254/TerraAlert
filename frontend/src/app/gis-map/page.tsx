'use client';

import dynamic from 'next/dynamic';

const GISMap = dynamic(
  () => import('@/components/GISMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        Loading Map...
      </div>
    ),
  }
);

export default function GISMapPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* MAP SECTION */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black text-slate-900">
            Live Landslide Risk Map
          </h1>

          <span className="px-5 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            Monitoring
          </span>
        </div>

        {/* MAP */}
        <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200">
          <GISMap />
        </div>
      </div>

      {/* ALERTS + AI SUMMARY */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* RECENT ALERTS */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-black mb-6 text-slate-900">
            Recent Alerts
          </h2>

          <div className="space-y-4">

            <div className="flex items-center justify-between p-5 rounded-2xl border border-red-200 bg-red-50">
              <span className="text-xl font-medium">
                Wayanad
              </span>

              <span className="text-red-600 font-black text-2xl">
                HIGH
              </span>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl border border-orange-200 bg-orange-50">
              <span className="text-xl font-medium">
                Chamoli
              </span>

              <span className="text-orange-600 font-black text-2xl">
                MEDIUM
              </span>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl border border-yellow-200 bg-yellow-50">
              <span className="text-xl font-medium">
                Darjeeling
              </span>

              <span className="text-yellow-600 font-black text-2xl">
                LOW
              </span>
            </div>

          </div>
        </div>

        {/* AI PREDICTION */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-black mb-8 text-slate-900">
            AI Prediction Summary
          </h2>

          <div className="space-y-8">

            <div>
              <p className="text-slate-500 text-lg mb-2">
                Most Vulnerable Region
              </p>

              <p className="text-3xl font-black text-slate-900">
                Wayanad, Kerala
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-lg mb-2">
                Predicted Risk
              </p>

              <p className="text-red-600 text-3xl font-black">
                HIGH
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-lg mb-2">
                Confidence Score
              </p>

              <p className="text-3xl font-black text-slate-900">
                92%
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-lg mb-2">
                Active Sensors
              </p>

              <p className="text-3xl font-black text-blue-600">
                127
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}