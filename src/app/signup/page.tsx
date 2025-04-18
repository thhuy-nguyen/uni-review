'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
    general: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
      general: ''
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, including a number, lowercase and uppercase letter';
      isValid = false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({ ...errors, general: '' });

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setErrors({ ...errors, general: error.message });
      } else if (data) {
        setSuccessMessage(
          'Registration successful! Please check your email for a confirmation link.'
        );
        // Don't redirect immediately so user can see success message
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setErrors({ ...errors, general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - information */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center">
        <div className="max-w-md px-6 py-12 text-white">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Join the UniReview Community</h2>
            <p className="text-lg">
              Create an account to share your university experience and help others find their perfect fit.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Share Your Experience</h3>
                <p className="text-white/80">Write detailed reviews about your university experience</p>
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
                <h3 className="font-semibold text-xl">Join the Community</h3>
                <p className="text-white/80">Connect with students and alumni from universities worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Rate and Review</h3>
                <p className="text-white/80">Help others by sharing honest feedback about your university</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">UniReview</span>
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold">Create an account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join UniReview to share and discover university reviews
            </p>
          </div>

          <div className="mt-8">
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              {successMessage ? (
                <div className="text-center p-4">
                  <div className="text-success text-lg mb-4">✓</div>
                  <p className="text-lg font-medium">{successMessage}</p>
                  <p className="text-sm text-muted-foreground mt-2">Redirecting to login page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Account Details</legend>

                    <div className="form-control w-full">
                      <label className="label" htmlFor="email">
                        <span className="label-text">Email Address</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        className={`input input-bordered w-full validator ${errors.email ? 'input-error' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                        required
                      />
                      {errors.email ? (
                        <span className="text-error text-xs mt-1">{errors.email}</span>
                      ) : (
                        <span className="validator-hint">Must be a valid email address</span>
                      )}
                    </div>

                    <div className="form-control w-full mt-4">
                      <label className="label" htmlFor="password">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••••"
                        className={`input input-bordered w-full validator ${errors.password ? 'input-error' : ''}`}
                        value={formData.password}
                        onChange={handleChange}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
                        required
                      />
                      {errors.password ? (
                        <span className="text-error text-xs mt-1">{errors.password}</span>
                      ) : (
                        <span className="validator-hint">
                          Must be more than 8 characters, including number, lowercase letter, uppercase letter
                        </span>
                      )}
                    </div>

                    <div className="form-control w-full mt-4">
                      <label className="label" htmlFor="confirmPassword">
                        <span className="label-text">Confirm Password</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••••"
                        className={`input input-bordered w-full validator ${errors.confirmPassword ? 'input-error' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must match the password entered above"
                        required
                      />
                      {errors.confirmPassword ? (
                        <span className="text-error text-xs mt-1">{errors.confirmPassword}</span>
                      ) : (
                        <span className="validator-hint">Passwords must match</span>
                      )}
                    </div>
                  </fieldset>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        className={`checkbox validator ${errors.agreeTerms ? 'checkbox-error' : ''}`}
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                      />
                      <span className="label-text">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeTerms ? (
                      <span className="text-error text-xs mt-1">{errors.agreeTerms}</span>
                    ) : (
                      <span className="validator-hint">Required</span>
                    )}
                  </div>

                  {errors.general && (
                    <div className="text-error text-sm mt-4 bg-error/10 p-2 rounded">{errors.general}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full mt-6"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating account...
                      </>
                    ) : (
                      'Sign up'
                    )}
                  </button>
                </form>
              )}
            </div>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}