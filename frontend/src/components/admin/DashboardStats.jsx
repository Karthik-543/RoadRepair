import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const DashboardStats = ({ summary = {} }) => {
  const cards = [
    {
      title: 'Total Reports',
      value: summary.totalReports || 0,
      icon: FileText,
      color: 'border-l-blue-600 text-blue-900',
      iconBg: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Pending Verification',
      value: summary.pendingReports || 0,
      icon: Clock,
      color: 'border-l-amber-500 text-amber-900',
      iconBg: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Verified & Assigned',
      value: (summary.verifiedReports || 0) + (summary.assignedReports || 0),
      icon: ShieldCheck,
      color: 'border-l-indigo-600 text-indigo-900',
      iconBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Completed Repairs',
      value: summary.completedReports || 0,
      icon: CheckCircle,
      color: 'border-l-emerald-600 text-emerald-900',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'High / Critical Priority',
      value: summary.highPriorityCount || 0,
      icon: AlertTriangle,
      color: 'border-l-red-600 text-red-900',
      iconBg: 'bg-red-50 text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-lg p-4 border border-slate-200 border-l-4 ${card.color} shadow-sm flex items-center justify-between`}
          >
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <span className="block text-2xl font-bold text-slate-900 mt-1">
                {card.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
