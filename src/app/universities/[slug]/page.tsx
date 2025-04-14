import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { StarIcon } from '@/components/ui/icons';
import ReviewCard from '@/components/universities/review-card';
import UniversityDetailTabs from '@/components/universities/university-detail-tabs';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const university = await getUniversityBySlug(params.slug);
  
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

async function getUniversityBySlug(slug: string) {
  console.log('Fetching university with slug:', slug);
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries (
          id,
          name,
          code
        ),
        reviews (
          rating
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error || !data) {
      console.error('University not found by slug:', slug, error);
      return null;
    }
    
    console.log('Successfully fetched university:', data.name);
    
    // Calculate average rating and review count
    const ratings = data.reviews?.map((review: any) => review.rating) || [];
    const avgRating = ratings.length 
      ? Number((ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length).toFixed(1)) 
      : 0;
    
    return {
      ...data,
      country: data.countries?.name || '',
      country_code: data.countries?.code || '',
      avg_rating: avgRating,
      review_count: ratings.length,
      countries: undefined,
      reviews: undefined
    };
  } catch (e) {
    console.error('Exception when fetching university:', e);
    return null;
  }
}

async function getUniversityReviews(universityId: string) {
  const supabase = await createClient();
  
  try {
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
    
    return data || [];
  } catch (e) {
    console.error('Exception when fetching university reviews:', e);
    return [];
  }
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log('Rendering university page for slug:', slug);
  
  const university = await getUniversityBySlug(slug);
  
  if (!university) {
    console.error('University not found, redirecting to 404');
    notFound();
  }
  
  const reviews = await getUniversityReviews(university.id);
  
  // Calculate review statistics
  const reviewStats = {
    academicRating: calculateAverageRating(reviews, 'academic_rating'),
    facilitiesRating: calculateAverageRating(reviews, 'facilities_rating'),
    supportRating: calculateAverageRating(reviews, 'support_rating'),
    careerRating: calculateAverageRating(reviews, 'career_rating'),
    lifeRating: calculateAverageRating(reviews, 'life_rating'),
    valueRating: calculateAverageRating(reviews, 'value_rating'),
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section with University Info */}
      <div className="mb-8">
        <Link href="/universities" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to all universities
        </Link>
        
        <div className="p-6 rounded-lg border bg-base-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-32 w-32 bg-base-200 rounded-md flex items-center justify-center overflow-hidden">
              {university.logo_url ? (
                <Image 
                  src={university.logo_url} 
                  alt={`${university.name} logo`} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-5xl font-bold">{university.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{university.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    {university.city ? `${university.city}, ` : ''}{university.country}
                    {university.type && <span className="ml-2 badge badge-outline">{university.type}</span>}
                  </p>
                </div>
                
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon 
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(university.avg_rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : i < university.avg_rating
                                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">{university.avg_rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({university.review_count} {university.review_count === 1 ? 'review' : 'reviews'})</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {university.website && (
                      <a 
                        href={university.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Visit Website
                      </a>
                    )}
                    <Link href={`/universities/${slug}/review/new`} className="btn btn-sm btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      Write a Review
                    </Link>
                  </div>
                </div>
              </div>
              
              {university.description && (
                <div className="mt-4 prose max-w-none">
                  <p className="line-clamp-3">{university.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Tabs for different sections */}
          <UniversityDetailTabs university={university} reviewStats={reviewStats} />
          
          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Student & Alumni Reviews</h2>
              <Link href={`/universities/${slug}/review/new`} className="btn btn-primary">
                Write a Review
              </Link>
            </div>
            
            {/* Review Stats Summary */}
            {reviews.length > 0 && (
              <div className="mb-8 p-4 border rounded-lg bg-base-100">
                <h3 className="font-semibold mb-4">Review Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.academicRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.academicRating.toFixed(1)}
                    </div>
                    <span>Academic Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.facilitiesRating.toFixed(1)}
                    </div>
                    <span>Facilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.supportRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.supportRating.toFixed(1)}
                    </div>
                    <span>Student Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.careerRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.careerRating.toFixed(1)}
                    </div>
                    <span>Career Prospects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.lifeRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.lifeRating.toFixed(1)}
                    </div>
                    <span>Campus Life</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.valueRating * 20, "--size": "3rem" } as any}>
                      {reviewStats.valueRating.toFixed(1)}
                    </div>
                    <span>Value for Money</span>
                  </div>
                </div>
              </div>
            )}
            
            {reviews.length === 0 ? (
              <div className="text-center py-10 border rounded-lg bg-base-100">
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your experience at this university!</p>
                <Link href={`/universities/${slug}/review/new`} className="btn btn-primary">
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
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-20 border rounded-lg p-6 bg-base-100">
            <h3 className="font-bold mb-4 text-lg">Quick Facts</h3>
            
            <div className="space-y-4 divide-y">
              <div className="pb-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Location</p>
                  {university.country_code && (
                    <span className="text-xs bg-base-200 px-2 py-1 rounded uppercase">{university.country_code}</span>
                  )}
                </div>
                <p className="font-medium">{university.city ? `${university.city}, ` : ''}{university.country}</p>
              </div>
              
              {university.established && (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Established</p>
                  <p className="font-medium">{university.established}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().getFullYear() - university.established} years old
                  </p>
                </div>
              )}
              
              {university.student_count && (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Student Population</p>
                  <p className="font-medium">{university.student_count.toLocaleString()}</p>
                </div>
              )}
              
              {university.type && (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Institution Type</p>
                  <p className="font-medium">{university.type}</p>
                </div>
              )}
              
              {university.website && (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Official Website</p>
                  <a 
                    href={university.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block"
                  >
                    {university.website.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}
              
              {university.email_domains && university.email_domains.length > 0 && (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Email Domains</p>
                  <div className="space-y-1 mt-1">
                    {university.email_domains.map((domain: string) => (
                      <div key={domain} className="badge badge-outline">{domain}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <Link href={`/universities/${slug}/review/new`} className="btn btn-primary w-full">
                Write a Review
              </Link>
              
              <div className="text-center text-xs text-muted-foreground">
                Share your experience to help future students make informed decisions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate average rating from reviews
function calculateAverageRating(reviews: any[], field: string) {
  if (!reviews || reviews.length === 0) return 0;
  
  const validReviews = reviews.filter(r => r[field] !== null && r[field] !== undefined);
  if (validReviews.length === 0) return 0;
  
  const sum = validReviews.reduce((acc, review) => acc + (review[field] || 0), 0);
  return sum / validReviews.length;
}