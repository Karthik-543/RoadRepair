import React, { useEffect, useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import DamageMap from '../map/DamageMap';
import { getImageUrl, formatDate, formatConfidence } from '../../utils/formatters';
import { fetchRepairByReportId } from '../../services/repairService';
import { MapPin, Calendar, User, Sparkles, CheckCircle2, Shield, Wrench, FileCheck, ArrowRight } from 'lucide-react';

const CitizenReportDetail = ({ report }) => {
  const [repair, setRepair] = useState(null);

  useEffect(() => {
    if (report && report._id) {
      fetchRepairByReportId(report._id)
        .then((data) => setRepair(data.repair))
        .catch(() => setRepair(null));
    }
  }, [report]);

  if (!report) return null;

  const steps = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed'];
  const currentStepIndex = steps.indexOf(report.status);

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <PriorityBadge priority={report.priorityLevel} score={report.priorityScore} />
              <StatusBadge status={report.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{report.title}</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.location?.address}</span>
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <div>Reporter: <strong className="text-slate-900">{report.reporter?.name || 'Citizen'}</strong></div>
            <div>Submitted: <strong className="text-slate-900">{formatDate(report.createdAt)}</strong></div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Repair Workflow Progress</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {steps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                      isPassed ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`font-semibold text-[11px] ${isCurrent ? 'text-blue-700 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Original Road Photo & AI Bounding Box Analysis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1">Original Upload</span>
              <div className="h-44 rounded overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={getImageUrl(report.originalImage)}
                  alt="Original road damage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1">YOLOv8 Detection & Bounding Boxes</span>
              <div className="h-44 rounded overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={getImageUrl(report.aiDetectedImage || report.originalImage)}
                  alt="AI detection result"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-500">Damage Classification:</span> <strong className="text-slate-900 block">{report.damageType}</strong></div>
              <div><span className="text-slate-500">Model Confidence:</span> <strong className="text-blue-700 block">{formatConfidence(report.confidence)}</strong></div>
              <div><span className="text-slate-500">Traffic Density:</span> <strong className="text-slate-900 block">{report.trafficDensity}</strong></div>
              <div><span className="text-slate-500">Road Category:</span> <strong className="text-slate-900 block">{report.roadCategory}</strong></div>
            </div>
          </div>
        </div>

        {report.status === 'Completed' || repair?.repairedImage ? (
          <div className="bg-emerald-50/50 rounded-lg border border-emerald-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center space-x-2 border-b border-emerald-200 pb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Municipal Repair Completion Photo & Verification Report</span>
            </h3>

            <div className="h-48 rounded overflow-hidden border border-emerald-300 bg-white">
              <img
                src={getImageUrl(repair?.repairedImage || report.aiDetectedImage)}
                alt="Repaired road completion"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-3 rounded-md border border-emerald-200 text-xs space-y-2">
              <div>
                <span className="text-slate-500 font-semibold">Assigned Repair Squad:</span>
                <span className="text-slate-900 font-bold ml-1.5">{repair?.assignedTeam || 'Public Works Maintenance Team'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Completion Summary:</span>
                <p className="text-slate-800 font-medium mt-0.5">{repair?.completionReportDoc || 'Road repair work completed and inspected.'}</p>
              </div>
              {repair?.remarks && (
                <div>
                  <span className="text-slate-500 font-semibold">Engineer Remarks:</span>
                  <p className="text-slate-800 italic mt-0.5">{repair.remarks}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Wrench className="w-4 h-4 text-slate-600" />
                <span>Municipal Repair Status</span>
              </h3>
              <div className="mt-4 text-xs text-slate-600 space-y-2">
                <p>
                  Status: <strong className="text-slate-900">{report.status}</strong>
                </p>
                {report.adminRemarks && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                    <strong className="block text-slate-900 mb-0.5">Municipal Remarks:</strong>
                    {report.adminRemarks}
                  </div>
                )}
                <p className="text-slate-500">
                  Once municipal authorities finish repairing this road segment, the completion photograph and engineering verification report will be displayed right here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-700" />
          <span>GIS Location & Interactive Map</span>
        </h3>
        <DamageMap reports={[report]} height="320px" zoom={15} />
      </div>

    </div>
  );
};

export default CitizenReportDetail;
