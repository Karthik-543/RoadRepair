import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardStats from '../components/admin/DashboardStats';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import ReportManagementTable from '../components/admin/ReportManagementTable';
import RepairAssignModal from '../components/admin/RepairAssignModal';
import RepairUploadModal from '../components/admin/RepairUploadModal';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, RefreshCw, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    severity: 'All',
    priority: 'All',
  });

  const [selectedReportForAssign, setSelectedReportForAssign] = useState(null);
  const [selectedReportForRepair, setSelectedReportForRepair] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const analyticsRes = await api.get('/analytics/dashboard');
      setAnalyticsData(analyticsRes.data);

      const params = {
        page: currentPage,
        limit: 15,
        search: searchTerm,
        status: filters.status,
        severity: filters.severity,
        priority: filters.priority,
      };

      const reportsRes = await api.get('/reports', { params });
      setReports(reportsRes.data.reports || []);
      setTotalPages(reportsRes.data.totalPages || 1);
      setTotalCount(reportsRes.data.totalCount || 0);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Municipal Management Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Logged in as <b className="text-slate-800">{user?.name}</b> ({user?.role?.toUpperCase()} — {user?.department})
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      <DashboardStats stats={analyticsData?.stats} />

      <AnalyticsCharts analyticsData={analyticsData} />

      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <span>Incident Reports & Repair Management Table</span>
        </h2>
      </div>

      <ReportManagementTable
        reports={reports}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onViewReport={(report) => navigate(`/reports/${report._id}`)}
        onAssignWorker={(report) => setSelectedReportForAssign(report)}
        onUploadRepair={(report) => setSelectedReportForRepair(report)}
      />

      {selectedReportForAssign && (
        <RepairAssignModal
          report={selectedReportForAssign}
          onClose={() => setSelectedReportForAssign(null)}
          onSuccess={() => {
            setSelectedReportForAssign(null);
            fetchDashboardData();
          }}
        />
      )}

      {selectedReportForRepair && (
        <RepairUploadModal
          report={selectedReportForRepair}
          onClose={() => setSelectedReportForRepair(null)}
          onSuccess={() => {
            setSelectedReportForRepair(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
