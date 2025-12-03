import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import IndividualDashboard from './pages/individual/IndividualDashboard';
import IssuerDashboard from './pages/issuer/IssuerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CertificatePage from './pages/CertificatePage';
import VerificationPage from './pages/VerificationPage';
import AdminPanel from './pages/admin/AdminPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route path="/cert/:certId" element={<CertificatePage />} />
                  <Route path="/verify" element={<VerificationPage />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="individual">
                        <IndividualDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/issuer/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="issuer">
                        <IssuerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employer/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <EmployerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;