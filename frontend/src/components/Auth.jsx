import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import AnimatedAscii from './AnimatedAscii';

const Auth = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password: 'dummy_password_123', // Magic links don't require password, but we're just doing email sign in. Actually, let's use OTP / magic link.
        });
        if (error) throw error;
        setMessage('Check your email for the login link!');
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });
        if (error) throw error;
        setMessage('Check your email for the login link!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/login/callback',
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans text-gray-900 overflow-hidden">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium mb-3 tracking-tight">
              {mode === 'signin' ? 'Welcome back!' : 'Create an account'}
            </h1>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 w-full mb-8">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Sign in with Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4" />
              Sign in with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
            />

            {message && <div className="text-sm text-green-600 text-center">{message}</div>}
            {error && <div className="text-sm text-red-600 text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <l-chaotic-orbit size="20" speed="1.5" color="white"></l-chaotic-orbit>
                  <span>Sending...</span>
                </div>
              ) : (mode === 'signin' ? 'Sign in with email' : 'Sign up with email')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-sm text-gray-500">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-black font-medium hover:underline">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="text-black font-medium hover:underline">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - ASCII Art Cover */}
      <div className="hidden lg:block lg:w-1/2 relative bg-white overflow-hidden">
        <AnimatedAscii />
      </div>
    </div>
  );
};

export default Auth;
