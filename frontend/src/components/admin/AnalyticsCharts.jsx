import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#2563eb', '#ea580c', '#d97706', '#10b981', '#8b5cf6', '#ef4444'];

const AnalyticsCharts = ({ charts = {} }) => {
  const { reportsByMonth = [], damageTypes = [], statusDistribution = [], severityDistribution = [] } = charts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Reports Submitted by Month
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.375rem', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="reports" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Damage Classification Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={damageTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.375rem', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Repair Workflow Status Breakdown
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.375rem', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Priority & Severity Breakdown
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.375rem', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
