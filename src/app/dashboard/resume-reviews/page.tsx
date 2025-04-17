'use client';

import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default async function ResumeReviewsPage() {
  const supabase = await createClient();
  
  // Get user session (authentication is already handled by middleware)
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch user's resume reviews
  const { data: reviews, error } = await supabase
    .from('resume_reviews')
    .select('*')
    .eq('user_id', session?.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching resume reviews:', error);
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Your Resume Reviews</h1>
            <p className="text-muted-foreground mt-2">Track your resume performance and ATS compatibility</p>
          </div>
          <Link 
            href="/universities/new/review" 
            className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Resume Review
          </Link>
        </div>
      </div>
      
      {(!reviews || reviews.length === 0) ? (
        <div className="bg-card p-8 rounded-xl shadow-md text-center border border-border max-w-2xl mx-auto">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No Resume Reviews Yet</h3>
          <p className="text-muted-foreground mb-6">Use our ATS compatibility checker to see how well your resume matches job descriptions and get personalized recommendations.</p>
          <Link 
            href="/universities/new/review" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Start a Resume Review
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <span>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} found</span>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <Link 
                key={review.id}
                href={`/dashboard/resume-reviews/${review.id}`}
                className="group block"
              >
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className={`text-xl font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                      review.ats_score >= 80 ? 'bg-success-light text-success' : 
                      review.ats_score >= 50 ? 'bg-warning-light text-warning' : 
                      'bg-danger-light text-danger'
                    }`}>
                      {review.ats_score >= 80 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : review.ats_score >= 50 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {review.ats_score}%
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <h3 className="font-medium text-base flex items-center gap-2 text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Matched Keywords
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.matched_keywords.slice(0, 5).map((keyword, index) => (
                        <span key={index} className="px-2.5 py-1 bg-success-light text-success text-xs font-medium rounded-full border border-success/20">
                          {keyword}
                        </span>
                      ))}
                      {review.matched_keywords.length > 5 && (
                        <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full border border-border">
                          +{review.matched_keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <h3 className="font-medium text-base flex items-center gap-2 text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.missing_keywords.slice(0, 5).map((keyword, index) => (
                        <span key={index} className="px-2.5 py-1 bg-danger-light text-danger text-xs font-medium rounded-full border border-danger/20">
                          {keyword}
                        </span>
                      ))}
                      {review.missing_keywords.length > 5 && (
                        <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full border border-border">
                          +{review.missing_keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border flex justify-end">
                    <span 
                      className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                    >
                      View Full Analysis
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}