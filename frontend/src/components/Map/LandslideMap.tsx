'use client';

import React, { useEffect, useState, useRef } from 'react';
import { HotspotZone, SensorNode, IncidentReport, RiskLevel } from '@/types';
import { Layers, Activity, AlertCircle, Home, Radio, Search, Filter, Navigation, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LandslideMapProps {
  hotspots?: HotspotZone[];
  sensors?: SensorNode[];
  incidents?: IncidentReport[];
  selectedHotspotId?: string;
  onSelectHotspot?: (hotspot: HotspotZone) => void;
  onSelectIncident?: (incident: IncidentReport) => void;
  height?: string;
}

export const LandslideMap: React.FC<LandslideMapProps> = ({
  hotspots = [],
  sensors = [],
  incidents = [],
  selectedHotspotId,
  onSelectHotspot,
  onSelectIncident,
  height = "560px"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>({
    hotspots: null,
    sensors: null,
    incidents: null,
    infrastructure: null
  });

  const [layersFilter, setLayersFilter] = useState({
    hotspots: true,
    sensors: true,
    incidents: true,
    infrastructure: true
  });

  const [tileMode, setTileMode] = useState<'streets' | 'topo' | 'satellite'>('topo');
  const [activeDistrict, setActiveDistrict] = useState<string>('all');

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet in browser
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: India center / Wayanad area
      const initialCenter: [number, number] = [11.5348, 76.1783]; // Wayanad Hotspot
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layers
      const tileLayers: Record<string, any> = {
        streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }),
        topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 })
      };

      tileLayers[tileMode].addTo(map);
      mapInstanceRef.current = map;

      // Layer groups
      const hotspotsLayer = L.layerGroup().addTo(map);
      const sensorsLayer = L.layerGroup().addTo(map);
      const incidentsLayer = L.layerGroup().addTo(map);
      const infraLayer = L.layerGroup().addTo(map);

      layersGroupRef.current = {
        hotspots: hotspotsLayer,
        sensors: sensorsLayer,
        incidents: incidentsLayer,
        infrastructure: infraLayer
      };

      renderLayers(L, map);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tileMode]);

  // Re-render markers and polygons when data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    import('leaflet').then((L) => {
      renderLayers(L, mapInstanceRef.current);
    });
  }, [hotspots, sensors, incidents, layersFilter, activeDistrict]);

  const renderLayers = (L: any, map: any) => {
    const { hotspots: hGroup, sensors: sGroup, incidents: iGroup, infrastructure: infGroup } = layersGroupRef.current;
    if (!hGroup || !sGroup || !iGroup || !infGroup) return;

    hGroup.clearLayers();
    sGroup.clearLayers();
    iGroup.clearLayers();
    infGroup.clearLayers();

    // 1. Render Hotspots & Hazard Polygons
    if (layersFilter.hotspots) {
      hotspots.forEach((h) => {
        if (activeDistrict !== 'all' && h.district.toLowerCase() !== activeDistrict.toLowerCase()) return;

        const color = h.risk_level === 'HIGH_RISK' ? '#DC2626' : (h.risk_level === 'MEDIUM_RISK' ? '#F59E0B' : '#10B981');
        const fillOpacity = h.risk_level === 'HIGH_RISK' ? 0.35 : (h.risk_level === 'MEDIUM_RISK' ? 0.25 : 0.15);

        // Polygon
        if (h.polygon_coordinates && h.polygon_coordinates.length > 0) {
          const poly = L.polygon(h.polygon_coordinates, {
            color: color,
            weight: 2.5,
            fillColor: color,
            fillOpacity: fillOpacity,
            dashArray: h.risk_level === 'HIGH_RISK' ? '6, 6' : undefined
          }).addTo(hGroup);

          poly.bindPopup(`
            <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 220px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-weight:bold; font-size:13px; color:#0f172a;">${h.name}</span>
                <span style="background:${color}; color:#fff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;">
                  ${h.risk_level.replace('_', ' ')}
                </span>
              </div>
              <p style="font-size:11px; color:#475569; margin:2px 0;">District: <strong>${h.district}, ${h.state}</strong></p>
              <p style="font-size:11px; color:#475569; margin:2px 0;">Vulnerable Population: <strong>${h.vulnerable_population.toLocaleString()} citizens</strong></p>
              <p style="font-size:11px; color:#475569; margin:2px 0;">Connected Villages: ${h.connected_villages.join(', ')}</p>
              <p style="font-size:11px; color:#475569; margin:2px 0;">Risk Score: <strong>${h.risk_score}%</strong></p>
            </div>
          `);
        }

        // Center Pin
        const hotspotIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background:${color}; 
              color:#fff; 
              width:28px; 
              height:28px; 
              border-radius:50%; 
              display:flex; 
              align-items:center; 
              justify-content:center; 
              font-weight:bold; 
              font-size:11px; 
              box-shadow: 0 0 10px ${color};
              border: 2px solid #ffffff;
            ">
              !
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([h.latitude, h.longitude], { icon: hotspotIcon }).addTo(hGroup);
        marker.on('click', () => {
          if (onSelectHotspot) onSelectHotspot(h);
        });

        // 2. Render Critical Infrastructure inside Hotspots
        if (layersFilter.infrastructure && h.critical_infrastructure) {
          h.critical_infrastructure.forEach(item => {
            const infraBg = item.type === 'Shelter' ? '#2563EB' : (item.type === 'Hospital' ? '#059669' : '#D97706');
            const infraSymbol = item.type === 'Shelter' ? '⌂' : (item.type === 'Hospital' ? '+' : '⚑');

            const infraIcon = L.divIcon({
              className: 'custom-infra-icon',
              html: `
                <div style="background:${infraBg}; color:#fff; width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; border:1.5px solid #fff; box-shadow:0 2px 4px rgba(0,0,0,0.3);">
                  ${infraSymbol}
                </div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });

            L.marker([item.lat, item.lng], { icon: infraIcon })
              .addTo(infGroup)
              .bindPopup(`
                <div style="font-family:system-ui; min-width:180px;">
                  <span style="background:${infraBg}; color:#fff; font-size:10px; font-weight:bold; padding:2px 5px; border-radius:3px;">${item.type}</span>
                  <p style="font-weight:bold; font-size:12px; margin:4px 0 2px;">${item.name}</p>
                  ${item.capacity ? `<p style="font-size:11px; color:#475569;">Capacity: <strong>${item.capacity} people</strong></p>` : ''}
                  ${item.status ? `<p style="font-size:11px; color:#475569;">Status: <strong>${item.status}</strong></p>` : ''}
                </div>
              `);
          });
        }
      });
    }

    // 3. Render IoT Sensor Nodes
    if (layersFilter.sensors) {
      sensors.forEach((s) => {
        const sColor = s.status === 'CRITICAL' ? '#DC2626' : (s.status === 'WARNING' ? '#F59E0B' : '#10B981');
        const sensorIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div style="
              background:#0f172a; 
              color:${sColor}; 
              border: 2px solid ${sColor}; 
              width:26px; 
              height:26px; 
              border-radius:6px; 
              display:flex; 
              align-items:center; 
              justify-content:center; 
              font-weight:bold; 
              font-size:12px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            ">
              📡
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        L.marker([s.latitude, s.longitude], { icon: sensorIcon })
          .addTo(sGroup)
          .bindPopup(`
            <div style="font-family:system-ui; min-width:230px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-weight:bold; font-size:12px; color:#0f172a;">${s.name}</span>
                <span style="background:${sColor}; color:#fff; font-size:10px; font-weight:bold; padding:2px 5px; border-radius:3px;">${s.status}</span>
              </div>
              <p style="font-size:11px; color:#64748b; margin:0 0 6px;">${s.location_name}</p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:11px; background:#f8fafc; padding:6px; border-radius:6px;">
                <div>Rainfall: <strong>${s.rainfall_rate_mm_hr} mm/h</strong></div>
                <div>Soil Moisture: <strong>${s.soil_moisture_pct}%</strong></div>
                <div>Slope Tilt: <strong>${s.tilt_degrees}°</strong></div>
                <div>Pore Press: <strong>${s.pore_water_pressure_kpa} kPa</strong></div>
              </div>
              <p style="font-size:10px; color:#94a3b8; margin-top:4px;">Last telemetry ping: ${s.last_ping} | Battery: ${s.battery_pct}%</p>
            </div>
          `);
      });
    }

    // 4. Render Citizen Reported Incidents
    if (layersFilter.incidents) {
      incidents.forEach((inc) => {
        const incBg = inc.status === 'Verified' ? '#DC2626' : (inc.status === 'Pending' ? '#F59E0B' : '#10B981');
        const incIcon = L.divIcon({
          className: 'custom-inc-icon',
          html: `
            <div style="
              background:${incBg}; 
              color:#fff; 
              width:24px; 
              height:24px; 
              border-radius:50%; 
              display:flex; 
              align-items:center; 
              justify-content:center; 
              border: 2px solid #ffffff;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
              📷
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const incMarker = L.marker([inc.latitude, inc.longitude], { icon: incIcon })
          .addTo(iGroup)
          .bindPopup(`
            <div style="font-family:system-ui; max-width:240px;">
              <span style="background:${incBg}; color:#fff; font-size:10px; font-weight:bold; padding:2px 5px; border-radius:3px;">
                ${inc.hazard_type} (${inc.status})
              </span>
              <p style="font-weight:bold; font-size:12px; margin:4px 0 2px; color:#0f172a;">${inc.title}</p>
              <p style="font-size:11px; color:#475569; margin-bottom:4px;">${inc.description.slice(0, 90)}...</p>
              ${inc.image_url ? `<img src="${inc.image_url}" style="width:100%; height:80px; object-fit:cover; border-radius:4px; margin-bottom:4px;" alt="Hazard Photo" />` : ''}
              <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
                <span>Reported by: ${inc.reporter_name}</span>
                <span>👍 ${inc.upvotes || 1} upvotes</span>
              </div>
            </div>
          `);

        incMarker.on('click', () => {
          if (onSelectIncident) onSelectIncident(inc);
        });
      });
    }
  };

  const flyToHotspot = (lat: number, lng: number, zoom = 13) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-950">
      
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Quick Location Nav Jump */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs">
          <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Jump to Sector:</span>
          <button
            onClick={() => flyToHotspot(11.5348, 76.1783, 13)}
            className="px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
          >
            Wayanad
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => flyToHotspot(30.5564, 79.5661, 14)}
            className="px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
          >
            Joshimath
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => flyToHotspot(31.1095, 77.1350, 13)}
            className="px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
          >
            Shimla
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => flyToHotspot(10.1580, 77.0180, 13)}
            className="px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
          >
            Munnar
          </button>
        </div>

        {/* Map Basemap Layer Switcher */}
        <div className="pointer-events-auto flex items-center space-x-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-semibold">
          <button
            onClick={() => setTileMode('topo')}
            className={`px-2.5 py-1 rounded-lg transition ${
              tileMode === 'topo'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Topography
          </button>
          <button
            onClick={() => setTileMode('satellite')}
            className={`px-2.5 py-1 rounded-lg transition ${
              tileMode === 'satellite'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setTileMode('streets')}
            className={`px-2.5 py-1 rounded-lg transition ${
              tileMode === 'streets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Streets
          </button>
        </div>

      </div>

      {/* Layer Visibility Filters (Floating Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-2">
        <p className="font-bold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
          <Filter className="w-3 h-3" />
          <span>GIS Layer Controls</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLayersFilter(p => ({ ...p, hotspots: !p.hotspots }))}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold border transition ${
              layersFilter.hotspots
                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900'
                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Hazard Hotspots</span>
          </button>

          <button
            onClick={() => setLayersFilter(p => ({ ...p, sensors: !p.sensors }))}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold border transition ${
              layersFilter.sensors
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900'
                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 line-through'
            }`}
          >
            <Radio className="w-3 h-3 text-blue-600" />
            <span>IoT Sensors</span>
          </button>

          <button
            onClick={() => setLayersFilter(p => ({ ...p, incidents: !p.incidents }))}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold border transition ${
              layersFilter.incidents
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900'
                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 line-through'
            }`}
          >
            <span>📷 Citizen Pins</span>
          </button>

          <button
            onClick={() => setLayersFilter(p => ({ ...p, infrastructure: !p.infrastructure }))}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold border transition ${
              layersFilter.infrastructure
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900'
                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 line-through'
            }`}
          >
            <Home className="w-3 h-3 text-emerald-600" />
            <span>Shelters & Bridges</span>
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />
    </div>
  );
};
