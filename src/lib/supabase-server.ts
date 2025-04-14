import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUniversities() {
  const supabase = await createClient();
  
  const { data: universities, error } = await supabase
    .from('universities')
    .select(`
      id, 
      name,
      slug,
      city,
      logo_url,
      established,
      type,
      countries:country_id (
        id,
        name,
        code
      ),
      review_stats:reviews (
        rating
      )
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
  
  // Process the data to calculate average ratings and review counts
  return universities.map((uni: any) => {
    const ratings = uni.review_stats?.map((review: any) => review.rating) || [];
    const avgRating = ratings.length 
      ? Number((ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length).toFixed(1)) 
      : 0;
    
    return {
      ...uni,
      country: uni.countries?.name || '',
      country_code: uni.countries?.code || '',
      avg_rating: avgRating,
      review_count: ratings.length,
      countries: undefined, // Remove the nested object
      review_stats: undefined // Remove the nested object
    };
  });
}