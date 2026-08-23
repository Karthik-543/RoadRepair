import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail, Building2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/citizen-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@roadsense.gov');
      setPassword('admin123');
    } else {
      setEmail('citizen@roadsense.org');
      setPassword('citizen123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-900 text-white mb-3 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to RoadSense AI</h2>
          <p className="text-xs text-slate-500 mt-1">Access your citizen dashboard or municipal authority portal</p>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-lg grid grid-cols-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleDemoLogin('citizen')}
            className="py-1.5 px-3 rounded text-slate-700 hover:bg-white hover:shadow-xs transition-colors flex items-center justify-center space-x-1"
          >
            <span>Demo Citizen Login</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="py-1.5 px-3 rounded text-blue-900 font-bold hover:bg-white hover:shadow-xs transition-colors flex items-center justify-center space-x-1"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Demo Admin Login</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-md shadow-sm flex items-center justify-center space-x-2 transition-colors mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-600">
          Don't have a citizen account?{' '}
          <Link to="/register" className="font-semibold text-blue-700 hover:underline">
            Register Citizen Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
