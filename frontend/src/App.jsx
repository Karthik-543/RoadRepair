import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitReport from './pages/SubmitReport';
import ReportDetailsPage from './pages/ReportDetailsPage';
import MapViewPage from './pages/MapViewPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<MapViewPage />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/citizen-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['engineer', 'supervisor', 'admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/submit-report"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <SubmitReport />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports/:id"
                  element={
                    <ProtectedRoute>
                      <ReportDetailsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
