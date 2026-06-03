import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingPage from './pages/OnboardingPage';
import { StudentRegister, JobSeekerRegister } from './pages/RegisterPage';
import CompaniesPage from './pages/CompaniesPage';
import CandidatesPage from './pages/CandidatesPage';
import TestPage from './pages/TestPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student / Job Seeker only */}
          <Route
            path="/companies"
            element={
              <ProtectedRoute allowedRoles={['student', 'jobseeker']}>
                <CompaniesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <ProtectedRoute allowedRoles={['student', 'jobseeker']}>
                <TestPage />
              </ProtectedRoute>
            }
          />

          {/* Company only */}
          <Route
            path="/candidates"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />

          {/* Shared (any authenticated role) */}
          <Route
            path="/pricing"
            element={
              <ProtectedRoute allowedRoles={['student', 'jobseeker', 'company']}>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'jobseeker', 'company']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
