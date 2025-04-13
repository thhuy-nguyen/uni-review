import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { StarIcon } from '@/components/ui/icons';
import ReviewCard from '@/components/universities/review-card';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const university = await getUniversity(params.id);
  
  if (!university) {
    return {
      title: 'University Not Found | UniReview',
    };
  }
  
  return {
    title: `${university.name} | UniReview`,
    description: `Reviews and information about ${university.name}. Learn from student experiences and share your own.`,
  };
}

async function getUniversity(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('universities')
    .select(`
      *,
      countries (
        id,
        name,
        code
      ),
      (
        select 
          avg(rating)::numeric(10,1) as avg_rating,
          count(*) as review_count
        from reviews
        where university_id = universities.id
      ) as review_stats
    `)
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching university:', error);
    return null;
  }
  
  return {
    ...data,
    country: data.countries?.name || '',
    country_code: data.countries?.code || '',
    avg_rating: data.review_stats?.avg_rating || 0,
    review_count: data.review_stats?.review_count || 0,
    countries: undefined,
    review_stats: undefined
  };
}

async function getUniversityReviews(universityId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (
        id,
        username,
        avatar_url
      )
    `)
    .eq('university_id', universityId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  
  return data;
}

export default async function UniversityPage({ params }: { params: { id: string } }) {
  const university = await getUniversity(params.id);
  
  if (!university) {
    notFound();
  }
  
  const reviews = await getUniversityReviews(params.id);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Link href="/universities" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to all universities
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-28 w-28 bg-base-200 rounded-md flex items-center justify-center overflow-hidden">
            {university.logo_url ? (
              <Image 
                src={university.logo_url} 
                alt={`${university.name} logo`} 
                width={112} 
                height={112} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl font-bold">{university.name.charAt(0)}</span>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
            <p className="text-lg text-muted-foreground mb-2">{university.city}, {university.country}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(university.avg_rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{university.avg_rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({university.review_count} {university.review_count === 1 ? 'review' : 'reviews'})</span>
            </div>
            
            {university.website && (
              <a 
                href={university.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit university website
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {university.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">About {university.name}</h2>
              <div className="prose max-w-none">
                <p>{university.description}</p>
              </div>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Reviews</h2>
              <Link href={`/universities/${params.id}/review/new`} className="btn btn-primary">
                Write a Review
              </Link>
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-10 border rounded-lg">
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your experience at this university!</p>
                <Link href={`/universities/${params.id}/review/new`} className="btn btn-primary">
                  Write a Review
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="sticky top-20 border rounded-lg p-6">
            <h3 className="font-bold mb-4">Quick facts</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{university.city}, {university.country}</p>
              </div>
              
              {university.established && (
                <div>
                  <p className="text-sm text-muted-foreground">Established</p>
                  <p>{university.established}</p>
                </div>
              )}
              
              {university.student_count && (
                <div>
                  <p className="text-sm text-muted-foreground">Student Population</p>
                  <p>{university.student_count.toLocaleString()}</p>
                </div>
              )}
              
              {university.type && (
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p>{university.type}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <Link href={`/universities/${params.id}/review/new`} className="btn btn-primary w-full">
                Write a Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}