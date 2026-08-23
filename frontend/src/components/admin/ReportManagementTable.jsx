import React, { useState } from 'react';
import { Eye, UserCheck, CheckSquare, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';

const ReportManagementTable = ({
  reports,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onViewReport,
  onAssignWorker,
  onUploadRepair,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearchChange(val);
  };

  const handleStatusFilter = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    onFilterChange('status', val);
  };

  const handleSeverityFilter = (e) => {
    const val = e.target.value;
    setSeverityFilter(val);
    onFilterChange('severity', val);
  };

  const handlePriorityFilter = (e) => {
    const val = e.target.value;
    setPriorityFilter(val);
    onFilterChange('priority', val);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title, location address, or ward..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={severityFilter}
            onChange={handleSeverityFilter}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Severity</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>

          <select
            value={priorityFilter}
            onChange={handlePriorityFilter}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
            <option value="Very Low">Very Low Priority</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Road Damage Incident</th>
              <th className="px-4 py-3">Ward / Location</th>
              <th className="px-4 py-3">AI Detection</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{report.title}</div>
                    <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <span>By: {report.reporter?.name || 'Citizen'}</span>
                      {report.duplicateCount > 0 && (
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          +{report.duplicateCount} Duplicates
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-800 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{report.wardName || 'Central Zone'}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[180px]">{report.location?.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {report.damageType} ({(report.confidence * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        report.severityLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : report.severityLevel === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : report.severityLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.severityLevel || 'Medium'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge level={report.priorityLevel} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onViewReport(report)}
                        title="View Report Details & Comparison"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onAssignWorker(report)}
                        title="Assign Worker / Engineer"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUploadRepair(report)}
                        title="Upload Repaired Image & Close"
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No road damage reports match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing Page <b>{currentPage}</b> of <b>{totalPages || 1}</b> ({totalCount || 0} Total Incident Reports)
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportManagementTable;
