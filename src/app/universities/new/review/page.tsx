import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import ReviewForm from '@/components/universities/review-form';

export const metadata: Metadata = {
  title: 'New University Review | UniReview',
  description: 'Share your experience at a university by writing a review.',
};

export const dynamic = 'force-dynamic';

export default async function NewReviewPage() {
  const supabase = await createClient();
  
  // Get user session (authentication is already handled by middleware)
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">New University Review</h1>
      
      <div className="bg-white p-6 rounded-md shadow-sm">
        <p className="text-gray-700 mb-6">
          Share your experience at a university to help others make informed decisions.
          Rate academics, campus life, facilities, and more to provide a comprehensive review.
        </p>
        
        <ReviewForm 
          universityId="" 
          universityName="" 
        />
      </div>
    </div>
  );
}