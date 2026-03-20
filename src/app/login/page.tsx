"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '../../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.login({ email, password });
      router.push('/analyze');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full opacity-20 transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-300 rounded-lg opacity-15 transform -rotate-6"></div>
        <div className="absolute bottom-20 left-20 w-24 h-12 border-2 border-green-300 rounded-full opacity-10 transform rotate-45"></div>
        <div className="absolute top-60 left-40 w-12 h-12 border-2 border-yellow-300 rounded opacity-25"></div>
        <div className="absolute bottom-40 right-10 w-32 h-8 border-2 border-pink-300 rounded-full opacity-20 transform -rotate-12"></div>
        <div className="absolute top-80 right-40 w-8 h-8 bg-blue-200 rounded-full opacity-10"></div>
        <div className="absolute bottom-60 left-60 w-16 h-16 border-2 border-indigo-300 transform rotate-45 opacity-15"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative">
          {/* Paper Texture Background */}
          <div className="absolute inset-0 opacity-5 rounded-2xl">
            <div className="h-full w-full rounded-2xl" style={{ 
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              )`
            }}></div>
          </div>

          <div className="relative">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-800">ResumeAI</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-inner text-gray-800"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-inner text-gray-800"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100"
              >
                {/* Button sketchy effect */}
                <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                
                <span className="relative">
                  {loading ? (
                    <span className="flex items-center">
                      <span className="mr-2">⏳</span>
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">🔐</span>
                      Sign In
                    </span>
                  )}
                </span>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Sign up here
                </a>
              </p>
            </div>

            {/* Doodle Element */}
            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-yellow-400 rounded-full transform rotate-12 opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
