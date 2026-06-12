import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientManagement from './pages/PatientManagement';
import DoctorManagement from './pages/DoctorManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import EHRManagement from './pages/EHRManagement';
import AIDiseasePrediction from './pages/AIDiseasePrediction';
import AIPatientOutcome from './pages/AIPatientOutcome';
import BedManagement from './pages/BedManagement';
import ResourceManagement from './pages/ResourceManagement';
import ReportAnalysis from './pages/ReportAnalysis';
import ReportingSystem from './pages/ReportingSystem';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Authentication Portal */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboards */}
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Core Operational Modules */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <PatientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ehr"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <EHRManagement />
                </ProtectedRoute>
              }
            />

            {/* AI & ML Telemetry Modules */}
            <Route
              path="/ai/disease-prediction"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <AIDiseasePrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai/outcome-prediction"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <AIPatientOutcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai/report-analysis"
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <ReportAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Resource Management & Reporting */}
            <Route
              path="/beds"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BedManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ResourceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportingSystem />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
};

export default App;
