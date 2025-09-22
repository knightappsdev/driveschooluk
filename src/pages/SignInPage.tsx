import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  // Demo users for testing
  const demoUsers = [
    { email: 'admin@driveconnect.uk', password: 'admin123', role: 'SuperAdmin' },
    { email: 'instructor@driveconnect.uk', password: 'instructor123', role: 'Instructor' },
    { email: 'student@driveconnect.uk', password: 'student123', role: 'Learner' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password
    });
    setError('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-purple-100 text-purple-800';
      case 'Instructor': return 'bg-blue-100 text-blue-800';
      case 'Learner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to DriveConnect UK
          </p>
        </div>

        {/* Demo Users Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDemoUsers(!showDemoUsers)}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            {showDemoUsers ? 'Hide' : 'Show'} Demo Accounts
          </button>
        </div>

        {/* Demo Users */}
        {showDemoUsers && (
          <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Quick Demo Login</h3>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">Password: {user.password}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <form className="space-y-6 p-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500">
          <p>Secure login powered by JWT authentication</p>
          <p className="mt-1">Real-time notifications via Socket.IO</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;