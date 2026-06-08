import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingPage from './pages/OnboardingPage';
import { StudentRegister, JobSeekerRegister, CompanyRegister } from './pages/RegisterPage';
import CompaniesPage from './pages/CompaniesPage';
import CandidatesPage from './pages/CandidatesPage';
import VacanciesPage from './pages/VacanciesPage';
import TestPage from './pages/TestPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CandidateProfilePage from './pages/CandidateProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
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
            path="/vacancies"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <VacanciesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CandidateProfilePage />
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
