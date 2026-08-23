import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getImageUrl, formatDate, formatConfidence } from '../../utils/formatters';
import { getPriorityColor } from '../../utils/geoHelpers';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

const createCustomMarker = (priorityLevel, status) => {
  const color = getPriorityColor(priorityLevel);
  const isCompleted = status === 'Completed';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      ${isCompleted ? '<circle cx="12" cy="9" r="3" fill="#10b981" />' : ''}
    </svg>
  `;

  return L.divAnchor ? L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  }) : L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const DamageMap = ({ reports = [], height = '550px', center = [28.6139, 77.2090], zoom = 12 }) => {
  const validReports = reports.filter(
    (r) => r.location && r.location.coordinates && r.location.coordinates.length === 2
  );

  const defaultCenter = validReports.length > 0
    ? [validReports[0].location.coordinates[1], validReports[0].location.coordinates[0]]
    : center;

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validReports.map((report) => {
          const lat = report.location.coordinates[1];
          const lon = report.location.coordinates[0];

          return (
            <Marker
              key={report._id}
              position={[lat, lon]}
              icon={createCustomMarker(report.priorityLevel, report.status)}
            >
              <Popup className="roadsense-popup shadow-md">
                <div className="w-64 p-1 text-slate-800">
                  <div className="relative rounded overflow-hidden mb-2 border border-slate-200 bg-slate-100 h-32">
                    <img
                      src={getImageUrl(report.aiDetectedImage || report.originalImage)}
                      alt={report.damageType}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <PriorityBadge priority={report.priorityLevel} score={report.priorityScore} />
                    </div>
                    <div className="absolute top-1 right-1">
                      <StatusBadge status={report.status} />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{report.title}</h3>
                  
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Type: <strong className="text-slate-900">{report.damageType}</strong></span>
                    <span>AI Conf: <strong className="text-blue-700">{formatConfidence(report.confidence)}</strong></span>
                  </div>

                  {report.status === 'Completed' && (
                    <div className="mt-1.5 p-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium">Repair Completed Verified</span>
                    </div>
                  )}

                  <div className="mt-2 text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-1.5">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Reporter: {report.reporter?.name || 'Anonymous Citizen'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Date: {formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex justify-end">
                    <Link
                      to={`/reports/${report._id}`}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Details</span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DamageMap;
