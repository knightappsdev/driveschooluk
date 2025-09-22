import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import InstructorSignupPage from './pages/InstructorSignupPage';
import SignInPage from './pages/SignInPage';
import LearnerSignupPage from './pages/LearnerSignupPage';
import DashboardPage from './pages/DashboardPage';
import { LearningMaterials } from './pages/LearningMaterials';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white font-primary">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/instructor-signup" element={<InstructorSignupPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/learner-signup" element={<LearnerSignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/learning-materials" element={<LearningMaterials />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
