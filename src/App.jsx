import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import { StudentRegister, JobSeekerRegister } from './pages/RegisterPage';
import StudentsPage from './pages/StudentsPage';
import TestPage from './pages/TestPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
