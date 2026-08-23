import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [officerId, setOfficerId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register({
        name,
        email,
        password,
        role,
        officerId,
        phone,
      });

      if (['engineer', 'supervisor', 'admin'].includes(user.role)) {
        navigate('/admin-dashboard');
      } else {
        navigate('/citizen-dashboard');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else {
        setError('Registration could not be completed. If your email is already registered, please click Sign In below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isOfficerRole = ['engineer', 'supervisor', 'admin'].includes(role);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join RoadSense AI Municipal System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="+1-555-0100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="citizen">Citizen</option>
                <option value="engineer">Municipal Engineer</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {isOfficerRole && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
              <label className="block text-sm font-medium text-blue-900">Predefined Officer Security ID</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-mono uppercase bg-white"
                  placeholder="e.g. MUN-OFFICER-8842"
                  required
                />
              </div>
              <p className="text-xs text-blue-700">
                Sample Predefined Security IDs: <code>MUN-OFFICER-8842</code>, <code>CITY-ENG-5501</code>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
