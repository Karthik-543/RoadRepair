import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserPlus, Lock, Mail, User, Phone, KeyRound, Info } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('citizen');
  const [officerId, setOfficerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCodesInfo, setShowCodesInfo] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin' && !officerId.trim()) {
      setError('Municipal Officers must enter a valid Predefined Officer Security ID.');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        name,
        email,
        password,
        phone,
        role,
        officerId: role === 'admin' ? officerId.trim() : null,
      });

      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/citizen-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-900 text-white mb-3 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create RoadSense AI Account</h2>
          <p className="text-xs text-slate-500 mt-1">Standard registration for Citizens & Verification-ID for Municipal Officers</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Account Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-md font-semibold">
              <button
                type="button"
                onClick={() => { setRole('citizen'); setError(''); }}
                className={`py-2 rounded text-center transition-colors ${role === 'citizen' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Citizen Registration
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setError(''); }}
                className={`py-2 rounded text-center transition-colors ${role === 'admin' ? 'bg-blue-900 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Municipal Officer
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {role === 'admin' && (
            <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-bold text-blue-950">Predefined Officer Security ID *</label>
                <button
                  type="button"
                  onClick={() => setShowCodesInfo(!showCodesInfo)}
                  className="text-[11px] text-blue-700 underline font-semibold flex items-center space-x-0.5"
                >
                  <Info className="w-3 h-3" />
                  <span>View Test IDs</span>
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. MUN-OFFICER-8842"
                  className="w-full pl-9 pr-3 py-2 border border-blue-300 rounded-md bg-white text-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                />
              </div>

              {showCodesInfo && (
                <div className="p-2.5 bg-white rounded border border-blue-200 text-[11px] text-slate-700 space-y-1">
                  <div className="font-bold text-blue-900">Predefined Test Officer Security IDs:</div>
                  <ul className="space-y-0.5 font-mono text-[10px] text-slate-800">
                    <li><strong className="text-blue-700">MUN-OFFICER-8842</strong> - Public Works Engineering</li>
                    <li><strong className="text-blue-700">MUN-OFFICER-9913</strong> - Highway & Pavement Maintenance</li>
                    <li><strong className="text-blue-700">MUN-OFFICER-1045</strong> - Infrastructure Risk Assessment</li>
                    <li><strong className="text-blue-700">CITY-ENG-5501</strong> - Rapid Response Unit</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-md shadow-sm flex items-center justify-center space-x-2 transition-colors mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Processing...' : role === 'admin' ? 'Register Officer Account' : 'Register Citizen Account'}</span>
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
