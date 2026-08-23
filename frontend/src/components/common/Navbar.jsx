import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, PlusCircle, LayoutDashboard, MapPin, User, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthority = user && ['engineer', 'supervisor', 'admin'].includes(user.role);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">RoadSense AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/map"
              className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Damage Map</span>
            </Link>

            {user && (
              <>
                {!isAuthority ? (
                  <Link
                    to="/citizen-dashboard"
                    className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Reports</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin-dashboard"
                    className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Municipal Dashboard</span>
                  </Link>
                )}

                {user.role === 'citizen' && (
                  <Link
                    to="/submit-report"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report Damage</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!user && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
