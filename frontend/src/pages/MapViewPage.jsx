import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DamageMap from '../components/map/DamageMap';
import { MapPin, Filter, Layers } from 'lucide-react';

const MapViewPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports', { params: { limit: 100 } });
      setReports(res.data.reports || []);
    } catch (error) {
      console.error('Failed to fetch map reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchPriority = priorityFilter === 'All' || r.priorityLevel === priorityFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchPriority && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Interactive Road Damage Spatial Map</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">Real-time GIS map powered by Leaflet & OpenStreetMap</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Priority:</span>
          </div>

          {['All', 'Critical', 'High', 'Medium', 'Low', 'Very Low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                priorityFilter === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-2 mb-6 h-[650px] relative">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <DamageMap reports={filteredReports} />
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-slate-800 uppercase">Marker Legend:</span>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-600"></div>
            <span className="text-slate-600">Critical Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-slate-600">High Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-slate-600">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-600">Low / Very Low Priority</span>
          </div>
        </div>

        <p className="text-slate-500">
          Showing <b>{filteredReports.length}</b> Incidents on Map
        </p>
      </div>
    </div>
  );
};

export default MapViewPage;
