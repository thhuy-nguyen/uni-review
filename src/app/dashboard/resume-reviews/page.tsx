import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { format } from 'date-fns';

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Resume Reviews</h1>
        <Link href="/universities/new/review" className="btn bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
          New Resume Review
        </Link>
      </div>
      
      {(!reviews || reviews.length === 0) ? (
        <div className="bg-white p-6 rounded-md shadow-sm text-center">
          <p className="text-gray-500 mb-4">You haven't submitted any resume reviews yet.</p>
          <p>Use our ATS compatibility checker to see how well your resume matches job descriptions.</p>
          <Link 
            href="/universities/new/review" 
            className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Start a Resume Review
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-md shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className={`text-xl font-bold px-3 py-1 rounded-full ${
                  review.ats_score >= 80 ? 'bg-green-100 text-green-700' : 
                  review.ats_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {review.ats_score}%
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-lg">Matched Keywords</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {review.matched_keywords.slice(0, 5).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                  {review.matched_keywords.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      +{review.matched_keywords.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-lg">Missing Keywords</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {review.missing_keywords.slice(0, 5).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                  {review.missing_keywords.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      +{review.missing_keywords.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  href={`/dashboard/resume-reviews/${review.id}`}
                  className="text-primary hover:underline block text-center mt-4"
                >
                  View Full Analysis
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}