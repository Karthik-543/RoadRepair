import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitReport from './pages/SubmitReport';
import AdminDashboard from './pages/AdminDashboard';
import MapViewPage from './pages/MapViewPage';
import ReportDetailsPage from './pages/ReportDetailsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<MapViewPage />} />
                <Route path="/reports/:id" element={<ReportDetailsPage />} />
                
                <Route
                  path="/submit-report"
                  element={
                    <ProtectedRoute requiredRole="citizen">
                      <SubmitReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen-dashboard"
                  element={
                    <ProtectedRoute requiredRole="citizen">
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
