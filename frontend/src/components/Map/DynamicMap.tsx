'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { HotspotZone, SensorNode, IncidentReport } from '@/types';
import { Loader2 } from 'lucide-react';

const LandslideMap = dynamic(
  () => import('./LandslideMap').then((mod) => mod.LandslideMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[560px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold text-slate-500">Loading Geospatial Hotspot Map & GIS Layers...</p>
      </div>
    )
  }
);

interface DynamicMapProps {
  hotspots?: HotspotZone[];
  sensors?: SensorNode[];
  incidents?: IncidentReport[];
  selectedHotspotId?: string;
  onSelectHotspot?: (hotspot: HotspotZone) => void;
  onSelectIncident?: (incident: IncidentReport) => void;
  height?: string;
}

export const DynamicMap: React.FC<DynamicMapProps> = (props) => {
  return <LandslideMap {...props} />;
};
