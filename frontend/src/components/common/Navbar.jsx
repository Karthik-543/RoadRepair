import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  ShieldAlert, 
  MapPin, 
  FileText, 
  PlusCircle, 
  LayoutDashboard, 
  Bell, 
  LogOut, 
  User as UserIcon,
  CheckCircle,
  Building2
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="bg-blue-900 text-white p-2 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight">RoadSense <span className="text-blue-700">AI</span></span>
                <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Municipal Repair System</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors"
            >
              Overview
            </Link>
            
            <Link 
              to="/map" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center space-x-1"
            >
              <MapPin className="w-4 h-4" />
              <span>Interactive Map</span>
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link 
                  to="/submit-report" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Road Damage</span>
                </Link>

                <Link 
                  to="/citizen-dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>My Submissions</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link 
                to="/admin-dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5 border border-slate-300"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-700" />
                <span>Municipal Portal</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:text-blue-700 rounded-lg hover:bg-slate-100 relative transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-blue-700 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => markRead(notif._id)}
                              className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                                !notif.read ? 'bg-blue-50/50 font-medium' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-slate-900">{notif.title}</span>
                                <span className="text-[10px] text-slate-400">{formatDate(notif.createdAt)}</span>
                              </div>
                              <p className="text-slate-600 mt-1">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-semibold text-slate-900">{user?.name}</span>
                    <span className="block text-[10px] font-medium text-slate-500 capitalize">
                      {isAdmin ? 'Municipal Admin' : 'Citizen'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors ml-1"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Register Citizen
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
