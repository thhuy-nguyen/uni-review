import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import ReviewForm from '@/components/universities/review-form';

export const metadata: Metadata = {
  title: 'Write a Review | UniReview',
  description: 'Share your experience at this university with other students.',
};

async function getUniversity(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('universities')
    .select('id, name')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching university:', error);
    return null;
  }
  
  return data;
}

export default async function NewReviewPage({ params }: { params: { id: string } }) {
  const university = await getUniversity(params.id);
  
  if (!university) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Link href={`/universities/${university.id}`} className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to {university.name}
        </Link>
      </div>
      
      <ReviewForm universityId={university.id} universityName={university.name} />
    </div>
  );
}