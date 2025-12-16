import React, { useState } from 'react';
import InfoCard from '../auth/InfoCard.jsx';
import { FcGoogle } from "react-icons/fc";

// Assuming Tailwind CSS setup in your project (e.g., via PostCSS/Vite/Next.js)
// We remove the import '../../index.css'; as styling is now inline via Tailwind classes.

function Login() {
  // 1. STATE MANAGEMENT
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. FORM VALIDATION (Frontend check)
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and Password are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  // 3. FORM SUBMISSION HANDLER (Same mock logic as before)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loginData = { email, password };
      console.log('Frontend preparing to send:', loginData);

      // --- Mock Backend Interaction ---
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      if (email === 'test@user.com' && password === 'correctpassword') {
        console.log('SUCCESS! Redirecting user...');
        alert('Login Successful!');
      } else {
        throw new Error('Invalid login credentials provided.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Network error occurred. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. JSX (UI Rendering with Tailwind CSS Classes)
  return (
    <>
      {/* Page wrapper: centers content both vertically & horizontally */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

        {/* Layout wrapper: stacks on mobile, side-by-side on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* LOGIN CARD */}
          <div className="login-card p-10 bg-white rounded-xl ring shadow-2xl 
                          w-[580px] font-sans flex flex-col">
            
            {/* Logo & Header */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-2 text-indigo-600">💠</span>
              <h1 className="text-2xl text-center font-bold text-gray-800">
                Trakly
              </h1>
            </div>
            
            <h2 className="font-bold text-4xl text-gray-900 text-center mb-2">
              Welcome to Trakly
            </h2>
            <p className="text-sm text-gray-500 mb-8 text-center">
              Your ultimate competitive programming companion.
            </p>

            <h3 className="text-xl font-bold font-medium text-gray-700 mb-6 text-center">
              Login to Your Account
            </h3>

            {/* Login Form */}
            <form className="login-form space-y-4 flex-grow" onSubmit={handleSubmit}>
              
              {/* Email Input Group */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-gray-400 mr-3">✉️</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>

              {/* Password Input Group */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 relative">
                <span className="text-gray-400 mr-3">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent focus:outline-none text-gray-700 pr-10"
                  required
                />

                {/* Toggle Password Visibility Button */}
                <button
                  type="button"
                  className="absolute right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👀' : '👁️'}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-1 pb-2">
                <a
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-150"
                >
                  Forgot password?
                </a>
              </div>

              {/* Dynamic Error Message Display */}
              {error && (
                <p className="error-message bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </p>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-bold transition duration-300 
                  ${isLoading 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* OR Separator */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Sign In with Google Button */}
              <button 
                type="button" 
                className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg 
                           text-gray-700 font-semibold bg-white hover:bg-gray-50 transition duration-150 shadow-sm"
                disabled={isLoading}
                onClick={() => alert('Initiating Google sign-in flow...')}
              >
                <span className="text-lg mr-2 font-bold">
                  <FcGoogle />
                </span>
                Sign in with Google
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <a
                href="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* INFO CARD */}
          <InfoCard />

        </div>
      </div>
    </>
  );
}

export default Login;
