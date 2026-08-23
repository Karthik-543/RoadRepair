import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/citizen/ReportForm';
import { submitReport } from '../services/reportService';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmitReport = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitReport = async (formData) => {
    setLoading(true);
    try {
      const res = await submitReport(formData);
      if (res.success && res.report) {
        navigate(`/reports/${res.report._id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      
      <div className="flex justify-between items-center">
        <Link
          to="/citizen-dashboard"
          className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Submissions</span>
        </Link>
      </div>

      <ReportForm onSubmit={handleSubmitReport} loading={loading} />

    </div>
  );
};

export default SubmitReport;
