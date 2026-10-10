import React from 'react';
import type { Warehouse, Destination, OptimizationResult } from '../types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, CheckCircle2 } from 'lucide-react';

const warehouseIcon = L.divIcon({
  className: 'custom-wh-marker',
  html: `<div style="background-color: #32D5F5; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #080B16; box-shadow: 0 0 12px #32D5F5;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const destinationIcon = L.divIcon({
  className: 'custom-dst-marker',
  html: `<div style="background-color: #8B5CF6; width: 16px; height: 16px; border-radius: 4px; border: 3px solid #080B16; box-shadow: 0 0 12px #8B5CF6;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapPageProps {
  warehouses: Warehouse[];
  destinations: Destination[];
  optResult: OptimizationResult | null;
}

export const MapPage: React.FC<MapPageProps> = ({ warehouses, destinations, optResult }) => {
  const whMap = new Map(warehouses.map((w) => [w.id, w]));
  const dstMap = new Map(destinations.map((d) => [d.id, d]));

  const routes = optResult
    ? optResult.shipment_plan.map((r) => {
        const wh = whMap.get(r.warehouse_id);
        const dst = dstMap.get(r.destination_id);
        return {
          route: r,
          positions: wh && dst ? [[wh.lat, wh.lng] as [number, number], [dst.lat, dst.lng] as [number, number]] : [],
        };
      }).filter((r) => r.positions.length === 2)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#32D5F5]" />
            <span>Interactive Route Map</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">Geospatial visualization of warehouse hubs, destination nodes, and active shipment corridors.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#32D5F5] border border-white/40 shadow-[0_0_8px_#32D5F5]" />
            <span className="text-white">Warehouse Hubs ({warehouses.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#8B5CF6] border border-white/40 shadow-[0_0_8px_#8B5CF6]" />
            <span className="text-white">Destinations ({destinations.length})</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="relative w-full h-[550px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl glass-panel">
        <MapContainer
          center={[19.0760, 77.8777]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Warehouse Markers */}
          {warehouses.map((wh) => (
            <Marker key={wh.id} position={[wh.lat, wh.lng]} icon={warehouseIcon}>
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <p className="font-bold text-[#32D5F5] text-sm">{wh.name}</p>
                  <p className="text-[#A8B3C7]">{wh.location}</p>
                  <hr className="border-white/10 my-1" />
                  <p>Available Inventory: <strong className="text-white">{wh.inventory} u</strong></p>
                  <p>Storage Capacity: <strong>{wh.capacity} u</strong></p>
                  <p>Outbound Cap: <strong>{wh.outbound_capacity} u</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Destination Markers */}
          {destinations.map((dst) => (
            <Marker key={dst.id} position={[dst.lat, dst.lng]} icon={destinationIcon}>
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <p className="font-bold text-[#8B5CF6] text-sm">{dst.name}</p>
                  <p className="text-[#A8B3C7]">{dst.location}</p>
                  <hr className="border-white/10 my-1" />
                  <p>Required Demand: <strong className="text-white">{dst.demand} u</strong></p>
                  <p>Delivery Priority: <strong className="text-rose-400">{dst.priority}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Active Route Polylines */}
          {routes.map((item, idx) => {
            const weight = Math.max(3, Math.min(10, item.route.quantity / 50));
            return (
              <Polyline
                key={idx}
                positions={item.positions}
                pathOptions={{
                  color: '#32D5F5',
                  weight: weight,
                  opacity: 0.85,
                  dashArray: '8, 8',
                }}
              >
                <Popup>
                  <div className="p-1 text-xs font-mono">
                    <p className="font-bold text-[#32D5F5]">
                      {item.route.warehouse_name.split(' ')[0]} → {item.route.destination_name.split(' ')[0]}
                    </p>
                    <p>Allocated Volume: <strong>{item.route.quantity} units</strong></p>
                    <p>Unit Rate: <strong>₹{item.route.unit_cost}/u</strong></p>
                    <p>Total Route Cost: <strong className="text-[#32D583]">₹{item.route.total_cost}</strong></p>
                  </div>
                </Popup>
              </Polyline>
            );
          })}
        </MapContainer>

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel-glow p-3 rounded-xl border border-[#32D5F5]/30 text-xs font-mono space-y-1">
          <p className="text-white font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#32D583]" />
            <span>Active Polyline Corridor Layer</span>
          </p>
          <p className="text-[10px] text-[#A8B3C7]">Line thickness reflects allocated shipment volume.</p>
        </div>
      </div>
    </div>
  );
};
