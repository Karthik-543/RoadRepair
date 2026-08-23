export const DEFAULT_MAP_CENTER = [28.6139, 77.2090];
export const DEFAULT_MAP_ZOOM = 13;

export const getPriorityColor = (priorityLevel) => {
  switch (priorityLevel) {
    case 'Critical':
      return '#dc2626';
    case 'High':
      return '#ea580c';
    case 'Medium':
      return '#d97706';
    case 'Low':
      return '#2563eb';
    default:
      return '#64748b';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return '#f59e0b';
    case 'Verified':
      return '#3b82f6';
    case 'Assigned':
      return '#8b5cf6';
    case 'In Progress':
      return '#0284c7';
    case 'Completed':
      return '#10b981';
    case 'Rejected':
      return '#ef4444';
    default:
      return '#64748b';
  }
};
