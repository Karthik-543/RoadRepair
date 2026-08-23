import { UPLOADS_BASE_URL } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${UPLOADS_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export const formatConfidence = (confidence) => {
  if (confidence === undefined || confidence === null) return '0%';
  return `${Math.round(confidence * 100)}%`;
};
