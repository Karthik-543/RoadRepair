import React, { useState } from 'react';
import { X, Wrench, Upload, CheckCircle2 } from 'lucide-react';

const RepairUploadModal = ({ report, isOpen, onClose, onComplete }) => {
  const [repairedImage, setRepairedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [completionReportDoc, setCompletionReportDoc] = useState('Work order completed per municipal standards.');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !report) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRepairedImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repairedImage) {
      setError('Please upload the completed repair image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('reportId', report._id);
      formData.append('repairedImage', repairedImage);
      formData.append('completionReportDoc', completionReportDoc);
      formData.append('remarks', remarks);

      await onComplete(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit repair completion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-900 font-bold text-base mb-1">
          <Wrench className="w-5 h-5 text-emerald-700" />
          <h3>Complete Repair & Upload Completion Record</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Upload final photo and completion notes for report: <strong>{report.title}</strong>
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Upload Repaired Road Image *</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
              {preview ? (
                <div className="relative h-40 w-full rounded overflow-hidden">
                  <img src={preview} alt="Repaired preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setRepairedImage(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-slate-900/70 text-white p-1 rounded-full text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="block font-semibold text-slate-700">Click to select repaired road photo</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">JPG, JPEG, PNG formats supported</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Repair Completion Summary</label>
            <input
              type="text"
              value={completionReportDoc}
              onChange={(e) => setCompletionReportDoc(e.target.value)}
              placeholder="e.g. Surface leveled, resurfaced with hot asphalt mix."
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Final Site Remarks</label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Quality inspection passed by Field Engineer."
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-md border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Mark Completed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairUploadModal;
