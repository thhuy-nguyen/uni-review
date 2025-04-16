'use client';

import ResumeReviewForm from '@/components/resume-review/resume-review-form';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function ResumeReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center py-10">
          <div className="spinner">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Resume Review</h1>
      <p className="text-gray-600 mb-6">
        Analyze your resume against job descriptions to improve your chances of getting past Applicant Tracking Systems (ATS).
      </p>
      
      {!isAuthenticated ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-amber-800 mb-2">Sign in required</h3>
          <p className="text-amber-700 mb-4">
            Please sign in to analyze and save your resume reviews. This helps you track your progress over time.
          </p>
          <a href="/login?returnUrl=/resume-review" className="btn btn-primary">
            Sign in to continue
          </a>
        </div>
      ) : (
          <ResumeReviewForm />
      )}
      
      <div className="mt-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Why Resume ATS Analysis Matters</h2>
        <div className="prose max-w-none">
          <p>
            Many companies use Applicant Tracking Systems (ATS) to filter resumes before they reach human recruiters.
            These systems scan for keywords and qualifications that match the job description.
          </p>
          <p className="mt-4">
            Our ATS review tool helps you:
          </p>
          <ul className="mt-2">
            <li>Match your resume to specific job descriptions</li>
            <li>Identify missing keywords and skills</li>
            <li>Improve your chances of getting past automated filters</li>
            <li>Track your resume improvements over time</li>
          </ul>
          <p className="mt-4">
            After analysis, you can save your results and access them later from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}