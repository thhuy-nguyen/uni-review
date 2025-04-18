import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get user session (authentication is already handled by middleware)
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get user's email or name for display
  const userName = session?.user.user_metadata?.full_name || session?.user.email?.split('@')[0] || 'User';
  
  // Fetch user's recent activity
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, title, rating, created_at, university_id')
    .eq('user_id', session?.user.id)
    .order('created_at', { ascending: false })
    .limit(3);
    
  // Fetch user's recent resume reviews
  const { data: resumeReviews } = await supabase
    .from('resume_reviews')
    .select('id, ats_score, created_at')
    .eq('user_id', session?.user.id)
    .order('created_at', { ascending: false })
    .limit(3);
  
  // Check if user has admin role with error handling
  let isAdmin = false;
  try {
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session?.user.id);
    
    if (error) {
      console.error('Error fetching user roles:', error.message);
      // Continue with isAdmin = false
    } else {
      isAdmin = userRoles?.some(r => r.role === 'admin') || false;
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    // Continue with isAdmin = false
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Admin Section - Only shown to users with admin role */}
      {isAdmin && (
        <div className="admin-section mb-8 p-6 bg-primary/10 rounded-lg shadow-sm border border-primary/20">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-primary">Admin Controls</h2>
            <span className="badge badge-primary p-3">Admin</span>
          </div>
          <p className="text-gray-600 mb-4">
            Access administrative functions to manage university suggestions and site content.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/university-suggestions" className="btn btn-primary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Manage University Suggestions
            </Link>
          </div>
        </div>
      )}
      
      <div className="welcome-section mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {userName}!</h2>
        <p className="text-gray-600">
          Access your university reviews and resume checkups from one convenient place.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* University Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your University Reviews</h2>
            <Link href="/universities" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.title}</h3>
                    <div className="badge badge-primary">{review.rating}/5</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">You haven't submitted any university reviews yet.</p>
              <Link href="/universities" className="btn btn-sm btn-primary">
                Browse Universities
              </Link>
            </div>
          )}
        </div>
        
        {/* Resume Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resume Reviews</h2>
            <Link href="/dashboard/resume-reviews" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {resumeReviews && resumeReviews.length > 0 ? (
            <div className="space-y-4">
              {resumeReviews.map((review) => (
                <div key={review.id} className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Resume Analysis</h3>
                    <div className={`badge ${
                      review.ats_score >= 80 ? 'bg-green-100 text-green-800' : 
                      review.ats_score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.ats_score}% Match
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <Link 
                    href={`/dashboard/resume-reviews/${review.id}`}
                    className="text-primary text-xs hover:underline mt-1 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">No resume reviews yet. Check if your resume is ATS-friendly.</p>
              <Link href="/resume-review" className="btn btn-sm btn-primary">
                Review My Resume
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="features-section grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="mb-4 text-4xl text-primary">📝</div>
          <h3 className="text-lg font-medium mb-2">Rate Universities</h3>
          <p className="text-gray-600 mb-4">Share your experience at different universities to help others make informed decisions.</p>
          <Link href="/universities" className="btn btn-sm btn-outline">
            Write a Review
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="mb-4 text-4xl text-primary">📄</div>
          <h3 className="text-lg font-medium mb-2">Resume ATS Check</h3>
          <p className="text-gray-600 mb-4">Check if your resume is optimized for Applicant Tracking Systems (ATS).</p>
          <Link href="/resume-review" className="btn btn-sm btn-outline">
            Check My Resume
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="mb-4 text-4xl text-primary">🔍</div>
          <h3 className="text-lg font-medium mb-2">Explore Universities</h3>
          <p className="text-gray-600 mb-4">Discover and compare universities worldwide based on real student reviews.</p>
          <Link href="/universities" className="btn btn-sm btn-outline">
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  );
}