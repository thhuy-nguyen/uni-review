import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { StarIcon, GlobeIcon } from '@/components/ui/icons';
import ReviewCard from '@/components/universities/review-card';
import UniversityDetailTabs from '@/components/universities/university-detail-tabs';
import BackToTopButton from '@/components/ui/back-to-top-button';

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
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* Breadcrumb Navigation */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <nav className="flex items-center text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/universities" className="text-muted-foreground hover:text-primary transition-colors">
              Universities
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-base-content font-medium truncate max-w-[200px]">
              {university.name}
            </span>
          </nav>
        </div>
      </div>
      
      {/* Hero Section with University Info */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-primary/5 rounded-xl p-6 mb-8 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-32 w-32 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md relative">
              {university.logo_url ? (
                <Image 
                  src={university.logo_url} 
                  alt={`${university.name} logo`} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-4xl font-bold text-primary">{university.name.charAt(0)}</span>
                </div>
              )}
              {university.country_code && (
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image 
                    src={`https://flagcdn.com/w40/${university.country_code.toLowerCase()}.png`}
                    alt={university.country}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{university.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2 flex items-center gap-2">
                    <GlobeIcon className="w-4 h-4" />
                    {university.city ? `${university.city}, ` : ''}{university.country}
                    {university.type && (
                      <span className="ml-2 badge badge-outline">{university.type}</span>
                    )}
                    {university.established && (
                      <span className="ml-1 text-xs text-muted-foreground">Est. {university.established}</span>
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-2 mb-2 bg-base-100 px-3 py-1 rounded-lg shadow-sm">
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
                    <span className="text-muted-foreground">
                      ({university.review_count} {university.review_count === 1 ? 'review' : 'reviews'})
                    </span>
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
                <div className="mt-4 prose max-w-none bg-base-100 p-4 rounded-lg border shadow-sm">
                  <p className="line-clamp-3">{university.description}</p>
                  <button className="text-primary hover:underline text-sm">Read more</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Academic Quality</div>
            <div className="text-xl font-bold text-primary">{reviewStats.academicRating.toFixed(1)}</div>
          </div>
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Facilities</div>
            <div className="text-xl font-bold text-primary">{reviewStats.facilitiesRating.toFixed(1)}</div>
          </div>
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Support</div>
            <div className="text-xl font-bold text-primary">{reviewStats.supportRating.toFixed(1)}</div>
          </div>
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Career</div>
            <div className="text-xl font-bold text-primary">{reviewStats.careerRating.toFixed(1)}</div>
          </div>
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Campus Life</div>
            <div className="text-xl font-bold text-primary">{reviewStats.lifeRating.toFixed(1)}</div>
          </div>
          <div className="bg-base-100 rounded-lg shadow-sm p-3 text-center border">
            <div className="text-xs text-muted-foreground mb-1">Value</div>
            <div className="text-xl font-bold text-primary">{reviewStats.valueRating.toFixed(1)}</div>
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
                <div>
                  <h2 className="text-2xl font-bold">Student & Alumni Reviews</h2>
                  <p className="text-muted-foreground">
                    {university.review_count} authentic experiences shared by students and alumni
                  </p>
                </div>
                <Link href={`/universities/${slug}/review/new`} className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Write a Review
                </Link>
              </div>
              
              {/* Review Stats Summary */}
              {reviews.length > 0 && (
                <div className="mb-8 p-6 border rounded-lg bg-base-100 shadow-sm">
                  <h3 className="font-semibold mb-4 text-lg">Review Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.academicRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.academicRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Academic Quality</div>
                        <div className="text-xs text-muted-foreground">Course content & teaching</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.facilitiesRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Facilities</div>
                        <div className="text-xs text-muted-foreground">Libraries, labs & resources</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.supportRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.supportRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Student Support</div>
                        <div className="text-xs text-muted-foreground">Advising & assistance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.careerRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.careerRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Career Prospects</div>
                        <div className="text-xs text-muted-foreground">Job opportunities & preparation</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.lifeRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.lifeRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Campus Life</div>
                        <div className="text-xs text-muted-foreground">Activities & social scene</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="radial-progress text-primary" style={{ "--value": reviewStats.valueRating * 20, "--size": "3.5rem" } as any}>
                        {reviewStats.valueRating.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-medium">Value for Money</div>
                        <div className="text-xs text-muted-foreground">Cost vs. quality of education</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Filter & Sort Options for Reviews */}
              {reviews.length > 0 && (
                <div className="mb-6 flex flex-wrap justify-between items-center gap-4 bg-base-200/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Filter by:</span>
                    <select className="select select-sm select-bordered max-w-xs">
                      <option value="">All Reviews</option>
                      <option value="recent">Most Recent</option>
                      <option value="positive">Highest Rated</option>
                      <option value="critical">Critical Reviews</option>
                    </select>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              )}
              
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-base-100 rounded-lg border shadow-sm">
                  <div className="mb-4 w-16 h-16 mx-auto bg-base-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Be the first to share your experience at {university.name} and help future students make informed decisions!
                  </p>
                  <Link href={`/universities/${slug}/review/new`} className="btn btn-primary">
                    Write a Review
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  
                  {reviews.length > 5 && (
                    <div className="text-center mt-6">
                      <button className="btn btn-outline">
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-20 space-y-6">
              <div className="border rounded-lg p-6 bg-base-100 shadow-sm">
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Facts
                </h3>
                
                <div className="space-y-4 divide-y">
                  <div className="pb-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Location</p>
                      {university.country_code && (
                        <div className="flex items-center space-x-1">
                          <Image 
                            src={`https://flagcdn.com/w20/${university.country_code.toLowerCase()}.png`}
                            alt={university.country}
                            width={20}
                            height={15}
                            className="rounded"
                          />
                          <span className="text-xs font-medium">{university.country_code}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium">{university.city ? `${university.city}, ` : ''}{university.country}</p>
                  </div>
                  
                  {university.established && (
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">Established</p>
                      <p className="font-medium">{university.established}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date().getFullYear() - university.established} years old
                      </p>
                    </div>
                  )}
                  
                  {university.student_count && (
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">Student Population</p>
                      <p className="font-medium">{university.student_count.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {university.type && (
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">Institution Type</p>
                      <p className="font-medium">{university.type}</p>
                    </div>
                  )}
                  
                  {university.website && (
                    <div className="py-3">
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
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">Email Domains</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {university.email_domains.map((domain: string) => (
                          <div key={domain} className="badge badge-outline">{domain}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-primary/5 shadow-sm">
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Share Your Experience
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Your review helps prospective students make informed decisions and contributes to university transparency.
                </p>
                
                <Link href={`/universities/${slug}/review/new`} className="btn btn-primary w-full">
                  Write a Review
                </Link>
                
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  All reviews are moderated to ensure quality and authenticity
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-base-100 shadow-sm">
                <h3 className="font-bold mb-4 text-lg">Similar Universities</h3>
                <p className="text-sm text-muted-foreground">
                  Coming soon - we'll show you similar universities based on location, programs, and student ratings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTopButton />
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