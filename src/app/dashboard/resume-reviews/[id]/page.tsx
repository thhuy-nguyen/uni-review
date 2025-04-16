import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { STORAGE_CONFIG } from '@/lib/storage-config';

interface ResumeReviewDetailProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ResumeReviewDetailPage({ params }: ResumeReviewDetailProps) {
  const { id } = params;
  const supabase = await createClient();
  
  // Get user session (authentication is already handled by middleware)
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch the specific review
  const { data: review, error } = await supabase
    .from('resume_reviews')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !review) {
    console.error('Error fetching resume review:', error);
    notFound();
  }
  
  // Verify that the user owns this review
  if (review.user_id !== session?.user.id) {
    redirect('/dashboard/resume-reviews');
  }
  
  // Get the resume file URL
  const { data: fileData } = await supabase.storage
    .from(STORAGE_CONFIG.RESUME_FILES.BUCKET_NAME)
    .createSignedUrl(review.storage_path, 60 * 60); // 1 hour expiry
  
  const resumeUrl = fileData?.signedUrl || null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard/resume-reviews" className="text-primary hover:underline flex items-center">
          ← Back to Resume Reviews
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <div className="flex items-center mt-2 md:mt-0">
            <p className="text-sm text-gray-500 mr-4">
              {format(new Date(review.created_at), 'MMMM d, yyyy')}
            </p>
            <div className={`text-xl font-bold px-4 py-1 rounded-full ${
              review.ats_score >= 80 ? 'bg-green-100 text-green-700' : 
              review.ats_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}>
              ATS Score: {review.ats_score}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Resume</h2>
            {resumeUrl ? (
              <div className="border rounded-md p-4">
                <p className="mb-2">Your uploaded resume:</p>
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Download Resume
                </a>
              </div>
            ) : (
              <p className="text-gray-500">Resume file not available</p>
            )}
            
            <h2 className="text-xl font-medium mt-8 mb-4">Job Description</h2>
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="whitespace-pre-wrap">{review.job_description}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Analysis Results</h2>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Score Breakdown</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className={`h-2.5 rounded-full ${
                    review.ats_score >= 80 ? 'bg-green-600' : 
                    review.ats_score >= 50 ? 'bg-yellow-500' : 
                    'bg-red-600'
                  }`} 
                  style={{ width: `${review.ats_score}%` }}
                ></div>
              </div>
              <p className="mb-4">
                {review.ats_score >= 80 ? 
                  'Your resume matches this job description very well!' : 
                  review.ats_score >= 50 ? 
                  'Your resume partially matches this job description. Some improvements could help.' : 
                  'Your resume needs significant improvements to match this job description.'}
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Matched Keywords ({review.matched_keywords.length})</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {review.matched_keywords.length > 0 ? (
                  review.matched_keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No matching keywords found</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Missing Keywords ({review.missing_keywords.length})</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {review.missing_keywords.length > 0 ? (
                  review.missing_keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No missing keywords found</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Suggestions</h3>
              <ul className="list-disc pl-5 space-y-2">
                {review.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700">{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/universities/new/review"
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                Create New Resume Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}