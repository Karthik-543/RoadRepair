import React from 'react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { getImageUrl, formatDate, formatConfidence } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Eye, Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

const CitizenReportList = ({ reports = [] }) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">No Road Damage Reports Submitted</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You have not submitted any road damage reports yet. Click "Report Road Damage" above to report a pothole or road crack in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div key={report._id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-all">
          
          <div className="relative h-48 bg-slate-100 border-b border-slate-200">
            <img
              src={getImageUrl(report.aiDetectedImage || report.originalImage)}
              alt={report.damageType}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <PriorityBadge priority={report.priorityLevel} score={report.priorityScore} />
            </div>
            <div className="absolute top-2 right-2">
              <StatusBadge status={report.status} />
            </div>

            {report.status === 'Completed' && (
              <div className="absolute bottom-2 left-2 right-2 bg-emerald-900/90 text-emerald-100 text-[11px] px-2.5 py-1 rounded backdrop-blur-xs flex items-center justify-between">
                <span className="flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Repaired Photo Available</span>
                </span>
                <span className="text-[10px] underline">View</span>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{report.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{report.location?.address || 'Coordinates Recorded'}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-700 font-medium">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Detection:</span>
                </span>
                <strong className="text-slate-900">{report.damageType}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-[11px]">
                <span>Confidence Score:</span>
                <strong className="text-blue-700">{formatConfidence(report.confidence)}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{formatDate(report.createdAt)}</span>
              </span>
              
              <Link
                to={`/reports/${report._id}`}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Track Status</span>
              </Link>
            </div>

          </div>

        </div>
      ))}
    </div>
  );
};

export default CitizenReportList;
