import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, XCircle, Users, FileText, Copy, ShieldAlert } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports || 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports || 0,
      icon: AlertTriangle,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Completed Repairs',
      value: stats.completedReports || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Critical Reports',
      value: stats.criticalReports || 0,
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Duplicate Reports',
      value: stats.duplicateReports || 0,
      icon: Copy,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: 'Rejected Reports',
      value: stats.rejectedReports || 0,
      icon: XCircle,
      color: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-lg border shadow-sm flex items-center justify-between ${card.color}`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-white/60 backdrop-blur-sm">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
