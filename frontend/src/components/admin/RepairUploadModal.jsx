import React, { useState } from 'react';
import api from '../../services/api';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

const RepairUploadModal = ({ report, onClose, onSuccess }) => {
  const [repairedImage, setRepairedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('Municipal Maintenance Division');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRepairedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repairedImage) {
      setError('Please select a repaired road completion photo.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('reportId', report._id);
      formData.append('repairedImage', repairedImage);
      formData.append('remarks', remarks);
      formData.append('assignedTeam', assignedTeam);

      await api.post('/repairs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit repair completion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Complete Repair Work Order</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Report</label>
            <input
              type="text"
              value={report.title}
              readOnly
              className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Maintenance Squad / Division</label>
            <input
              type="text"
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Upload Repaired Road Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {previewUrl && (
            <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-2">
              <p className="text-xs font-semibold text-slate-500 mb-1">Repaired Photo Preview:</p>
              <img src={previewUrl} alt="Repaired Road Preview" className="max-h-48 w-full object-cover rounded" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Repair Officer Remarks & Materials Used</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Applied 50kg hot-pour asphalt fill, compacted with 2-ton roller."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Mark Completed & Close Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairUploadModal;
