import React, { useEffect, useState } from 'react';
import DashboardStats from '../components/admin/DashboardStats';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import ReportManagementTable from '../components/admin/ReportManagementTable';
import RepairAssignModal from '../components/admin/RepairAssignModal';
import RepairUploadModal from '../components/admin/RepairUploadModal';
import DamageMap from '../components/map/DamageMap';
import { fetchReports, updateReportStatus, deleteReport } from '../services/reportService';
import { assignRepairTeam, completeRepairTask } from '../services/repairService';
import api from '../services/api';
import { Building2, LayoutDashboard, MapPin, RefreshCw, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedReportForAssign, setSelectedReportForAssign] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [selectedReportForUpload, setSelectedReportForUpload] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, analyticsRes] = await Promise.all([
        fetchReports(),
        api.get('/analytics/dashboard'),
      ]);
      setReports(reportsRes.reports || []);
      setAnalytics(analyticsRes.data || null);
    } catch (error) {
      console.error('Failed to load admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (reportId, status, remarks) => {
    try {
      await updateReportStatus(reportId, { status, adminRemarks: remarks });
      loadData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAssignTeam = async (assignData) => {
    try {
      await assignRepairTeam(assignData);
      loadData();
    } catch (error) {
      console.error('Failed to assign team:', error);
    }
  };

  const handleCompleteRepair = async (formData) => {
    try {
      await completeRepairTask(formData);
      loadData();
    } catch (error) {
      console.error('Failed to complete repair task:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this road damage report?')) {
      try {
        await deleteReport(reportId);
        loadData();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-900 text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Public Works Municipal Authority</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Municipal Repair & Prioritization Operations Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time AI damage predictions, allocate repair crews, verify citizen reports, and track infrastructure status.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-md border border-slate-300 flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <DashboardStats summary={analytics?.summary || {}} />

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
          <BarChart2 className="w-4 h-4 text-blue-700" />
          <span>Municipal Analytics & Predictive Distributions</span>
        </h2>
        {analytics?.charts ? (
          <AnalyticsCharts charts={analytics.charts} />
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-500">
            Loading analytics visualization charts...
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
          <MapPin className="w-4 h-4 text-blue-700" />
          <span>Municipal GIS Damage & Priority Map</span>
        </h2>
        <DamageMap reports={reports} height="400px" />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Report Verification & Work Order Management</h2>
        <ReportManagementTable
          reports={reports}
          onUpdateStatus={handleUpdateStatus}
          onOpenAssignModal={(report) => {
            setSelectedReportForAssign(report);
            setIsAssignModalOpen(true);
          }}
          onOpenUploadModal={(report) => {
            setSelectedReportForUpload(report);
            setIsUploadModalOpen(true);
          }}
          onDeleteReport={handleDeleteReport}
        />
      </div>

      <RepairAssignModal
        report={selectedReportForAssign}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignTeam}
      />

      <RepairUploadModal
        report={selectedReportForUpload}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onComplete={handleCompleteRepair}
      />

    </div>
  );
};

export default AdminDashboard;
