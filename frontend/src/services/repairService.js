import api from './api';

export const assignRepairTeam = async (assignData) => {
  const response = await api.post('/repairs/assign', assignData);
  return response.data;
};

export const completeRepairTask = async (formData) => {
  const response = await api.post('/repairs/complete', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchRepairByReportId = async (reportId) => {
  const response = await api.get(`/repairs/report/${reportId}`);
  return response.data;
};
