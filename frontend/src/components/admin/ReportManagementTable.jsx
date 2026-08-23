import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { getImageUrl, formatDate, formatConfidence } from '../../utils/formatters';
import { DAMAGE_TYPES, REPORT_STATUSES, PRIORITY_LEVELS } from '../../utils/constants';
import { Search, Filter, Eye, Check, X, UserCheck, Wrench, Trash2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportManagementTable = ({
  reports = [],
  onUpdateStatus,
  onOpenAssignModal,
  onOpenUploadModal,
  onDeleteReport,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDamageType, setSelectedDamageType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !search ||
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.damageType.toLowerCase().includes(search.toLowerCase()) ||
      (report.location?.address && report.location.address.toLowerCase().includes(search.toLowerCase())) ||
      (report.reporter?.name && report.reporter.name.toLowerCase().includes(search.toLowerCase()));

    const matchesDamage = selectedDamageType === 'All' || report.damageType === selectedDamageType;
    const matchesStatus = selectedStatus === 'All' || report.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || report.priorityLevel === selectedPriority;

    return matchesSearch && matchesDamage && matchesStatus && matchesPriority;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by title, location, or reporter name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              value={selectedDamageType}
              onChange={(e) => setSelectedDamageType(e.target.value)}
              className="bg-white border border-slate-300 text-xs rounded-md px-2.5 py-2 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Damage Types</option>
              {DAMAGE_TYPES.map((dt) => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 text-xs rounded-md px-2.5 py-2 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              {REPORT_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-white border border-slate-300 text-xs rounded-md px-2.5 py-2 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LEVELS.map((pr) => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Report & Location</th>
              <th className="py-3 px-4">AI Detection</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Reporter</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  No road damage reports match the selected filters.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-14 h-14 rounded overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                      <img
                        src={getImageUrl(report.aiDetectedImage || report.originalImage)}
                        alt={report.damageType}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 leading-tight">{report.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5 truncate">{report.location?.address || 'GPS Coordinates Recorded'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(report.createdAt)}</div>
                    {report.isDuplicate && (
                      <span className="inline-flex items-center text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold mt-1">
                        <Copy className="w-3 h-3 mr-1" /> Duplicate Report
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-medium">
                    <div className="text-slate-900 font-semibold">{report.damageType}</div>
                    <div className="text-[11px] text-blue-700 font-bold">Conf: {formatConfidence(report.confidence)}</div>
                  </td>

                  <td className="py-3 px-4">
                    <PriorityBadge priority={report.priorityLevel} score={report.priorityScore} />
                    {report.duplicateCount > 0 && (
                      <div className="text-[10px] text-slate-500 font-semibold mt-1">
                        +{report.duplicateCount} duplicates
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={report.status} />
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-semibold text-slate-900">{report.reporter?.name || 'Citizen'}</div>
                    <div className="text-[10px] text-slate-500">{report.reporter?.email}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        to={`/reports/${report._id}`}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {report.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(report._id, 'Verified', 'Verified by Municipal Authority')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Verify Report"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(report._id, 'Rejected', 'Rejected by Municipal Authority')}
                            className="p-1.5 text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Reject Report"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {(report.status === 'Verified' || report.status === 'Pending') && (
                        <button
                          onClick={() => onOpenAssignModal(report)}
                          className="px-2 py-1 text-[11px] bg-blue-50 text-blue-700 font-semibold rounded hover:bg-blue-100 transition-colors flex items-center space-x-1"
                          title="Assign Repair Team"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign</span>
                        </button>
                      )}

                      {(report.status === 'Assigned' || report.status === 'In Progress') && (
                        <button
                          onClick={() => onOpenUploadModal(report)}
                          className="px-2 py-1 text-[11px] bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 transition-colors flex items-center space-x-1 shadow-sm"
                          title="Complete Repair & Upload Photo"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteReport(report._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportManagementTable;
