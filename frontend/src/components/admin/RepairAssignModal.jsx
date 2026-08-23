import React, { useState } from 'react';
import api from '../../services/api';
import { UserCheck, X, AlertCircle } from 'lucide-react';

const RepairAssignModal = ({ report, onClose, onSuccess }) => {
  const [assignedToId, setAssignedToId] = useState('');
  const [roleAssigned, setRoleAssigned] = useState('Field Engineer');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleOfficers = [
    { id: '65cb91122334455667788990', name: 'Eng. Rajesh Sharma', role: 'Field Engineer', dept: 'Public Works' },
    { id: '65cb91122334455667788991', name: 'Supervisor Vikram Patel', role: 'Supervisor', dept: 'Rapid Response' },
    { id: '65cb91122334455667788992', name: 'Crew Lead Anil Kumar', role: 'Repair Squad Lead', dept: 'Pavement Division' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedToId) {
      setError('Please select an officer or worker to assign.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/repairs/assign', {
        reportId: report._id,
        assignedToId,
        roleAssigned,
        instructions,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign worker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Assign Worker / Engineer</h3>
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
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Officer / Worker</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              required
            >
              <option value="">-- Choose Assigned Officer --</option>
              {sampleOfficers.map((off) => (
                <option key={off.id} value={off.id}>
                  {off.name} ({off.role} - {off.dept})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assignment Role</label>
            <select
              value={roleAssigned}
              onChange={(e) => setRoleAssigned(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="Field Engineer">Field Engineer</option>
              <option value="Repair Squad Lead">Repair Squad Lead</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Maintenance Crew">Maintenance Crew</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Work Instructions</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter specific repair directives or materials required..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairAssignModal;
