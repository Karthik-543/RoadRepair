import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

const pickerIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="36" height="36" stroke="#ffffff" stroke-width="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  className: 'custom-picker-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const LocationEvents = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const LocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const [position, setPosition] = useState([
    latitude || 28.6139,
    longitude || 77.2090,
  ]);
  const [geoLocating, setGeoLocating] = useState(false);

  const handleSelect = (lat, lng) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  const handleDetectGPS = () => {
    if ('geolocation' in navigator) {
      setGeoLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          onLocationChange(lat, lng);
          setGeoLocating(false);
        },
        (error) => {
          console.warn('Geolocation failed:', error.message);
          setGeoLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-700">Click map to set exact damage coordinates</span>
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={geoLocating}
          className="flex items-center space-x-1 px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{geoLocating ? 'Acquiring GPS...' : 'Auto-Detect Current GPS'}</span>
        </button>
      </div>

      <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-300 relative">
        <MapContainer center={position} zoom={14} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={position} />
          <LocationEvents onSelectLocation={handleSelect} />
          <Marker position={position} icon={pickerIcon} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100 p-2.5 rounded border border-slate-200">
        <div>
          <span className="text-slate-500 font-medium">Latitude:</span>{' '}
          <strong className="text-slate-900 font-mono">{position[0].toFixed(6)}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Longitude:</span>{' '}
          <strong className="text-slate-900 font-mono">{position[1].toFixed(6)}</strong>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
