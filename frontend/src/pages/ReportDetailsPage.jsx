import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';
import RepairUploadModal from '../components/admin/RepairUploadModal';
import RepairAssignModal from '../components/admin/RepairAssignModal';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Calendar, Shield, ArrowLeft, CheckCircle2, UserCheck, Edit3 } from 'lucide-react';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [updatingRemarks, setUpdatingRemarks] = useState(false);

  const isAuthority = user && ['engineer', 'supervisor', 'admin'].includes(user.role);

  const fetchReportDetails = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data.report);
      setAdminRemarks(res.data.report.adminRemarks || '');

      try {
        const repairRes = await api.get(`/repairs/report/${id}`);
        setRepair(repairRes.data.repair);
      } catch (e) {
        setRepair(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Report not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/reports/${id}/status`, {
        status: newStatus,
        adminRemarks,
      });
      fetchReportDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleSaveRemarks = async () => {
    setUpdatingRemarks(true);
    try {
      await api.put(`/reports/${id}/status`, {
        adminRemarks,
      });
      fetchReportDetails();
    } catch (err) {
      alert('Failed to save remarks.');
    } finally {
      setUpdatingRemarks(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-rose-600 font-semibold mb-4">{error || 'Report not found'}</p>
        <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {isAuthority && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign Worker</span>
            </button>
            <button
              onClick={() => setShowRepairModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Repair</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{report.title}</h1>
              <StatusBadge status={report.status} />
              <PriorityBadge level={report.priorityLevel} />
            </div>
            <p className="text-slate-500 text-sm flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{report.location?.address} ({report.wardName})</span>
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <p>Reported: {new Date(report.createdAt).toLocaleDateString()}</p>
            <p>Severity Rating: <b className="text-slate-800">{report.severityLevel}</b></p>
            <p>Est. Damaged Area: <b className="text-slate-800">{report.estimatedDamagedArea} m²</b></p>
          </div>
        </div>

        {isAuthority && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Change Status & Authority Remarks</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    report.status === st
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Mark {st}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Add municipal inspection remarks..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveRemarks}
                disabled={updatingRemarks}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md"
              >
                Save Remarks
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Before & After Road Repair Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">1. Original Citizen Upload</h3>
            <div className="h-56 bg-slate-200 rounded overflow-hidden">
              <img src={report.originalImage} alt="Original Road Damage" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">
              2. AI Detection ({report.damageType} - {(report.confidence * 100).toFixed(0)}%)
            </h3>
            <div className="h-56 bg-slate-200 rounded overflow-hidden">
              <img
                src={report.aiDetectedImage || report.originalImage}
                alt="AI Detected Damage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">
              3. Repaired Road Image {repair?.repairedImage ? '✓' : '(Pending)'}
            </h3>
            <div className="h-56 bg-slate-200 rounded overflow-hidden flex items-center justify-center text-slate-400">
              {repair?.repairedImage ? (
                <img src={repair.repairedImage} alt="Repaired Road Completed" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-center px-4">Repair completion photo pending municipal team upload.</p>
              )}
            </div>
          </div>
        </div>

        {repair && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
            <p className="font-bold text-emerald-950">Repair Log Details:</p>
            <p>• <b>Completion Date</b>: {repair.completionDate ? new Date(repair.completionDate).toLocaleDateString() : 'In Progress'}</p>
            <p>• <b>Assigned Team</b>: {repair.assignedTeam}</p>
            <p>• <b>Officer Remarks</b>: {repair.remarks}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Citizen & Location Information</h3>
          <div className="space-y-2 text-xs text-slate-700">
            <p className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>Reporter: <b>{report.reporter?.name || 'Citizen'}</b> ({report.reporter?.email})</span>
            </p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Ward: <b>{report.wardName}</b></span>
            </p>
            <p className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Road Category: <b>{report.roadCategory}</b> (Traffic: {report.trafficDensity})</span>
            </p>
            {report.assignedOfficer && (
              <p className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-blue-500" />
                <span>Assigned Officer: <b>{report.assignedOfficer.name}</b> ({report.assignedOfficer.department})</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">AI & Environmental Parameters</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">Nearby Hospital:</span>
              <p className="font-semibold text-slate-800">{report.nearbyHospital ? 'Yes (+15 pts)' : 'No'}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">Nearby School:</span>
              <p className="font-semibold text-slate-800">{report.nearbySchool ? 'Yes (+15 pts)' : 'No'}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">Duplicate Submissions:</span>
              <p className="font-semibold text-slate-800">{report.duplicateCount || 0} Reports</p>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">AI Confidence:</span>
              <p className="font-semibold text-slate-800">{(report.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <RepairAssignModal
          report={report}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            fetchReportDetails();
          }}
        />
      )}

      {showRepairModal && (
        <RepairUploadModal
          report={report}
          onClose={() => setShowRepairModal(false)}
          onSuccess={() => {
            setShowRepairModal(false);
            fetchReportDetails();
          }}
        />
      )}
    </div>
  );
};

export default ReportDetailsPage;
