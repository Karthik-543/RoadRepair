import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';

const RepairAssignModal = ({ report, isOpen, onClose, onAssign }) => {
  const [assignedTeam, setAssignedTeam] = useState('Rapid Repair Squad Alpha');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAssign({
        reportId: report._id,
        assignedTeam,
        remarks,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-blue-900 font-bold text-base mb-1">
          <UserCheck className="w-5 h-5 text-blue-700" />
          <h3>Assign Repair Team</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Assign a municipal public works crew to report: <strong>{report.title}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Repair Squad</label>
            <select
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Rapid Repair Squad Alpha">Rapid Repair Squad Alpha</option>
              <option value="Heavy Pavement Division Beta">Heavy Pavement Division Beta</option>
              <option value="Asphalt Maintenance Crew 04">Asphalt Maintenance Crew 04</option>
              <option value="Emergency Roadwork Response Unit">Emergency Roadwork Response Unit</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Order Instructions & Remarks</label>
            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Deploy cold mix patch kit and inspect drainage outlet."
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
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
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md shadow-sm"
            >
              {loading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairAssignModal;
