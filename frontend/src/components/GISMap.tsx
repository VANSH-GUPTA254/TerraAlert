'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function GISMap() {
  return (
    <MapContainer
      center={[30.7333, 76.7794]}
      zoom={8}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[30.7333, 76.7794]}>
        <Popup>Landslide Monitoring Zone</Popup>
      </Marker>
    </MapContainer>
  );
}