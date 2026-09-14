import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentAcademics from './pages/student/StudentAcademics';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentResults from './pages/student/StudentResults';
import StudentSettings from './pages/student/StudentSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';

// Route Protection Guard
import ProtectedRoute from './components/common/ProtectedRoute';

// Portal Layout with Reusable Sidebar and Navbar
const PortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="main-content">
        <Navbar 
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
        />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Hub Routes (Protected) */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRole="STUDENT">
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="academics" element={<StudentAcademics />} />
              <Route path="subjects" element={<StudentSubjects />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Admin Hub Routes (Protected) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
