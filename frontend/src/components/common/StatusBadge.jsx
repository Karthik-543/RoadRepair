import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Verified':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Assigned':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'In Progress':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {status || 'Pending'}
    </span>
  );
};

export default StatusBadge;
