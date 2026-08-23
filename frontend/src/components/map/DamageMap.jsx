import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;

const createCustomIcon = (priorityLevel) => {
  let color = '#3b82f6';
  if (priorityLevel === 'Critical') color = '#ef4444';
  else if (priorityLevel === 'High') color = '#f97316';
  else if (priorityLevel === 'Medium') color = '#f59e0b';
  else if (priorityLevel === 'Low') color = '#10b981';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const DamageMap = ({ reports = [], center = [17.385, 78.4744], zoom = 12 }) => {
  const navigate = useNavigate();

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="w-full h-full z-0 rounded-lg">
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => {
        if (!report.location || !report.location.coordinates || report.location.coordinates.length < 2) {
          return null;
        }
        const [lon, lat] = report.location.coordinates;
        const icon = createCustomIcon(report.priorityLevel);

        return (
          <Marker key={report._id} position={[lat, lon]} icon={icon}>
            <Popup>
              <div className="p-1 max-w-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{report.title}</h4>
                <p className="text-xs text-slate-500">{report.location?.address}</p>
                <div className="flex items-center space-x-2 my-1">
                  <StatusBadge status={report.status} />
                  <PriorityBadge level={report.priorityLevel} />
                </div>
                <div className="text-xs bg-slate-100 p-1.5 rounded text-slate-700">
                  <span>AI Detection: <b>{report.damageType}</b> ({(report.confidence * 100).toFixed(0)}%)</span>
                </div>
                <button
                  onClick={() => navigate(`/reports/${report._id}`)}
                  className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors text-center block mt-2"
                >
                  View Report Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default DamageMap;
