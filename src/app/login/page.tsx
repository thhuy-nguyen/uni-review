'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import LoginButton from '@/components/auth/login-button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  
  const supabase = createClient();

  const clearError = (field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setErrors({ ...errors, general: '' });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle different types of auth errors
        if (error.message.toLowerCase().includes('email')) {
          setErrors({ ...errors, email: error.message });
        } else if (error.message.toLowerCase().includes('password')) {
          setErrors({ ...errors, password: error.message });
        } else {
          setErrors({ ...errors, general: error.message });
        }
      } else {
        // Redirect handled by Supabase auth callback
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setErrors({ ...errors, general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">UniReview</span>
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your UniReview account
            </p>
          </div>
          
          <div className="mt-8">
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="space-y-6">
                {/* Email/Password login form (at the top) */}
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                  <div className="form-control">
                    <label className="label" htmlFor="email">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError('email');
                      }}
                      className={`input input-bordered w-full validator ${errors.email ? 'input-error' : ''}`}
                      pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                      required
                    />
                    {errors.email ? (
                      <span className="text-error text-xs mt-1">{errors.email}</span>
                    ) : (
                      <span className="validator-hint">Enter a valid email address</span>
                    )}
                  </div>
                  
                  <div className="form-control">
                    <label className="label" htmlFor="password">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError('password');
                      }}
                      className={`input input-bordered w-full validator ${errors.password ? 'input-error' : ''}`}
                      title="Enter your password"
                      required
                    />
                    {errors.password ? (
                      <span className="text-error text-xs mt-1">{errors.password}</span>
                    ) : (
                      <span className="validator-hint">Enter your password</span>
                    )}
                  </div>
                  
                  {errors.general && (
                    <div className="text-error text-sm bg-error/10 p-2 rounded">{errors.general}</div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full mt-2"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign in with Email'
                    )}
                  </button>
                </form>
                
                {/* Divider */}
                <div className="divider">Or continue with</div>
                
                {/* Social login (at the bottom) */}
                <div className="flex flex-col gap-2">
                  <LoginButton />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                Create an account
              </Link>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - simplified design */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center">
        <div className="max-w-md px-6 py-12 text-white">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect University</h2>
            <p className="text-lg">
              Get honest reviews from real students about academics, campus life, and career outcomes.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Knowledge Reviews</h3>
                <p className="text-white/80">Discover if your program truly provides valuable knowledge</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Career Prep</h3>
                <p className="text-white/80">Learn if graduates are actually landing jobs in their field</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Community</h3>
                <p className="text-white/80">Join thousands of students finding their ideal university</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}