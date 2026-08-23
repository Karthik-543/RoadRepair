import api from './api';

export const fetchReports = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.damageType) params.append('damageType', filters.damageType);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const response = await api.get(`/reports?${params.toString()}`);
  return response.data;
};

export const fetchMyReports = async () => {
  const response = await api.get('/reports/my-reports');
  return response.data;
};

export const fetchReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const submitReport = async (formData) => {
  const response = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateReportStatus = async (id, statusData) => {
  const response = await api.patch(`/reports/${id}/status`, statusData);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};
