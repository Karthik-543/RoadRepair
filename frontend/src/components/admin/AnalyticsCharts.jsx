import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp, MapPin } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsCharts = ({ analyticsData }) => {
  if (!analyticsData) return null;

  const {
    damageDistribution = [],
    severityDistribution = [],
    monthlyReports = [],
    wardWiseStats = [],
    roadWiseStats = [],
    stats = {},
  } = analyticsData;

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase">Completion Rate</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.completionRate || 0}%</p>
          <p className="text-xs text-slate-400 mt-1">Resolved Incident Ratio</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase">Avg. Repair Time</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.averageRepairTimeHours || 24} hrs</p>
          <p className="text-xs text-slate-400 mt-1">Report to Completion</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase">Duplicate Percentage</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{stats.duplicatePercentage || 0}%</p>
          <p className="text-xs text-slate-400 mt-1">Spatial Proximity Matches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
            <PieIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Damage Class Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={damageDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {damageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Monthly Reports Trend (Line Chart)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReports}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submitted" stroke="#3b82f6" name="Submitted" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Ward-Wise Statistics (Bar Chart)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardWiseStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#6366f1" name="Total Incidents" />
                <Bar dataKey="completed" fill="#10b981" name="Repaired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Road Category Statistics</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roadWiseStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total Reports" />
                <Bar dataKey="critical" fill="#ef4444" name="Critical Priority" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
