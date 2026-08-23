import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, FileText, MapPin, Eye, CheckCircle2, Clock } from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchMyReports = async () => {
    try {
      const res = await api.get('/reports/my-reports');
      setReports(res.data.reports || []);
    } catch (error) {
      console.error('Failed to fetch citizen reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const filteredReports = filterStatus === 'All'
    ? reports
    : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Citizen Report Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}. Track your reported road damage incidents.</p>
        </div>

        <Link
          to="/submit-report"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Damage</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Filter Status:</span>
          {['All', 'Pending', 'In Progress', 'Completed', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Total Reports Submitted: <b>{reports.length}</b>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{report.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{report.location?.address}</span>
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">AI Detection</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {report.damageType} ({(report.confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Severity Rating</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {report.severityLevel || 'Medium'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submitted on: {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <PriorityBadge level={report.priorityLevel} />
                <Link
                  to={`/reports/${report._id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & Repairs</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Road Damage Reports Found</h3>
          <p className="text-xs text-slate-500 mb-4">You have not submitted any reports matching the selected status.</p>
          <Link
            to="/submit-report"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a Report Now</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
