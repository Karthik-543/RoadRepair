import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CitizenReportList from '../components/citizen/CitizenReportList';
import { fetchMyReports } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { FileText, PlusCircle, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const CitizenDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyReports()
      .then((data) => setReports(data.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalSubmitted = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const completedCount = reports.filter((r) => r.status === 'Completed').length;

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <span>Citizen Incident Management Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong>{user?.name}</strong>. Track your submitted road damage reports, view AI detection outputs, and inspect completed repair photos.
          </p>
        </div>

        <Link
          to="/submit-report"
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-md shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Road Damage</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-700">
          <span className="block text-xs font-semibold text-slate-500 uppercase">Total Submissions</span>
          <span className="block text-2xl font-bold text-slate-900 mt-1">{totalSubmitted}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <span className="block text-xs font-semibold text-slate-500 uppercase">Under Municipal Review</span>
          <span className="block text-2xl font-bold text-slate-900 mt-1">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <span className="block text-xs font-semibold text-slate-500 uppercase">Repairs Completed</span>
          <span className="block text-2xl font-bold text-slate-900 mt-1">{completedCount}</span>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">My Submitted Damage Incidents</h2>
        {loading ? (
          <div className="bg-white p-8 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
            Loading your submitted reports...
          </div>
        ) : (
          <CitizenReportList reports={reports} />
        )}
      </div>

    </div>
  );
};

export default CitizenDashboard;
