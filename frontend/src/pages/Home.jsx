import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DamageMap from '../components/map/DamageMap';
import { fetchReports } from '../services/reportService';
import { ShieldAlert, MapPin, PlusCircle, CheckCircle2, Cpu, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    fetchReports()
      .then((data) => setReports(data.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const completedCount = reports.filter((r) => r.status === 'Completed').length;
  const criticalCount = reports.filter((r) => r.priorityLevel === 'Critical' || r.priorityLevel === 'High').length;

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-slate-900">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-blue-800">
            <ShieldAlert className="w-4 h-4 text-blue-700" />
            <span>Public Infrastructure Management System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Intelligent Road Damage Detection & Automated Repair Prioritization
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            RoadSense AI empowers citizens and municipal engineering departments to detect, catalog, and prioritize road damage using custom YOLOv8 deep learning computer vision, multi-factor priority scoring algorithms, and GIS Leaflet spatial mapping.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={isAuthenticated ? "/submit-report" : "/register"}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Road Damage</span>
            </Link>

            <Link
              to="/map"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-lg border border-slate-300 flex items-center space-x-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>Explore Interactive GIS Map</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-800">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-700">
          <span className="block text-xs font-bold text-slate-500 uppercase">Total Incidents</span>
          <span className="block text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <span className="block text-xs font-bold text-slate-500 uppercase">Pending Review</span>
          <span className="block text-3xl font-extrabold text-slate-900 mt-1">{pendingCount}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-red-600">
          <span className="block text-xs font-bold text-slate-500 uppercase">High Priority</span>
          <span className="block text-3xl font-extrabold text-slate-900 mt-1">{criticalCount}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <span className="block text-xs font-bold text-slate-500 uppercase">Repairs Completed</span>
          <span className="block text-3xl font-extrabold text-slate-900 mt-1">{completedCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              <span>Live Public Damage Map</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time map showing reported potholes and cracks with priority color indicators.
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Open Full Screen Map &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-xs text-slate-500">
            Loading GIS map data...
          </div>
        ) : (
          <DamageMap reports={reports} height="480px" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Custom YOLOv8 Detection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automated image recognition trained on real road damage datasets to identify Potholes, Longitudinal Cracks, Transverse Cracks, Alligator Cracks, and Road Patches.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Priority Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-factor scoring algorithm calculating damage severity, traffic density, nearby schools & hospitals, duplicate reports count, and report age.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Municipal Repair Tracking</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            End-to-end municipal workflow management from citizen report submission to squad assignment, repair execution, and completion photo verification.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
