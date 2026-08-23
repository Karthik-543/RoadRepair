import React from 'react';

const PriorityBadge = ({ priority, score }) => {
  const getBadgeStyle = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'High':
        return 'bg-orange-100 text-orange-900 border-orange-300 font-semibold';
      case 'Medium':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-medium';
      case 'Low':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs border ${getBadgeStyle(priority)}`}>
      {priority || 'Low'}
      {score !== undefined && <span className="ml-1 text-[10px] opacity-80">({score} pts)</span>}
    </span>
  );
};

export default PriorityBadge;
