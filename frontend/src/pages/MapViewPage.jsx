import React, { useEffect, useState } from 'react';
import DamageMap from '../components/map/DamageMap';
import { fetchReports } from '../services/reportService';
import { MapPin, Filter, Layers } from 'lucide-react';
import { DAMAGE_TYPES, REPORT_STATUSES, PRIORITY_LEVELS } from '../utils/constants';

const MapViewPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [damageFilter, setDamageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    fetchReports()
      .then((data) => setReports(data.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesDamage = damageFilter === 'All' || report.damageType === damageFilter;
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || report.priorityLevel === priorityFilter;
    return matchesDamage && matchesStatus && matchesPriority;
  });

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-700" />
            <span>Interactive Municipal GIS Infrastructure Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing reported road damage incidents, priority markers, and repair completion status across the municipality.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={damageFilter}
            onChange={(e) => setDamageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium text-slate-800 outline-none"
          >
            <option value="All">All Damage Types</option>
            {DAMAGE_TYPES.map((dt) => (
              <option key={dt} value={dt}>{dt}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium text-slate-800 outline-none"
          >
            <option value="All">All Statuses</option>
            {REPORT_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium text-slate-800 outline-none"
          >
            <option value="All">All Priorities</option>
            {PRIORITY_LEVELS.map((pr) => (
              <option key={pr} value={pr}>{pr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center text-xs text-slate-500">
            Loading Leaflet GIS map layers...
          </div>
        ) : (
          <DamageMap reports={filteredReports} height="620px" />
        )}
      </div>

    </div>
  );
};

export default MapViewPage;
