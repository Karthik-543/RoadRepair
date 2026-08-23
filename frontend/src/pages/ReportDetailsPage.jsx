import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CitizenReportDetail from '../components/citizen/CitizenReportDetail';
import { fetchReportById } from '../services/reportService';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchReportById(id)
        .then((data) => setReport(data.report))
        .catch((err) => setError('Road damage report not found or could not be loaded.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
        Loading report details...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Report Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'The requested report ID does not exist.'}</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-700 text-white font-semibold text-xs rounded"
          >
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="flex items-center space-x-2 text-xs">
        <Link to="/" className="text-slate-500 hover:text-blue-700 font-medium">Home</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold truncate">{report.title}</span>
      </div>

      <CitizenReportDetail report={report} />
    </div>
  );
};

export default ReportDetailsPage;
