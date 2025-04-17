import { Metadata } from 'next';
import UniversityList from '@/components/universities/university-list';
import { getUniversities } from '@/lib/supabase-server';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, GlobeIcon } from '@/components/ui/icons';
import BackToTopButton from '@/components/ui/back-to-top-button';

export const metadata: Metadata = {
  title: 'Universities | UniReview',
  description: 'Browse and search for universities to read and write reviews.',
};

export default async function UniversitiesPage() {
  const universities = await getUniversities();
  
  // Get top rated universities for featured section
  const featuredUniversities = [...universities]
    .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
    .filter(uni => (uni.avg_rating || 0) > 3.5 && (uni.review_count || 0) > 0)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12 mb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
                Find Your Perfect University
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Explore thousands of universities worldwide, read authentic reviews from students,
                and make informed decisions about your education journey.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="#university-list" className="btn btn-primary">
                  Browse Universities
                </Link>
                <Link href="/dashboard" className="btn btn-outline">
                  My Reviews
                </Link>
              </div>
            </div>
            <div className="relative w-full max-w-sm h-64 hidden md:block">
              <Image 
                src="/images/uploads/globe.svg" 
                alt="University globe" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Universities Section */}
      {featuredUniversities.length > 0 && (
        <div className="container mx-auto px-4 max-w-7xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Featured Universities</h2>
            <p className="text-muted-foreground">Highly rated institutions based on student reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredUniversities.map((uni) => (
              <Link 
                key={uni.id} 
                href={`/universities/${uni.slug || uni.id}`}
                className="bg-base-100 rounded-xl p-4 border border-base-300 hover:border-primary hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-base-200 rounded-md flex items-center justify-center overflow-hidden">
                    {uni.logo_url ? (
                      <Image 
                        src={uni.logo_url} 
                        alt={`${uni.name} logo`} 
                        width={48} 
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xl font-bold">{uni.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-1">{uni.name}</h3>
                    <p className="text-xs text-muted-foreground">{uni.city}, {uni.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{(uni.avg_rating || 0).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({uni.review_count || 0} reviews)</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Featured</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick Stats Section */}
      <div className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="bg-base-100 rounded-xl border p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-1">{universities.length}</div>
              <div className="text-sm text-muted-foreground">Universities</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {new Set(universities.map(uni => uni.country)).size}
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {universities.reduce((sum, uni) => sum + (uni.review_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {(universities.reduce((sum, uni) => sum + (uni.avg_rating || 0) * (uni.review_count || 0), 0) / 
                  Math.max(1, universities.reduce((sum, uni) => sum + (uni.review_count || 0), 0))).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div id="university-list" className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Universities Directory</h2>
              <p className="text-muted-foreground">Browse and filter {universities.length} universities worldwide</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-outline badge-primary">{universities.length} institutions</div>
              <div className="badge badge-outline">Updated April 2025</div>
            </div>
          </div>
          
          <UniversityList universities={universities} />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 max-w-7xl mb-16">
        <div className="bg-primary/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Can't find your university?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            If you don't see your institution listed, you can suggest it to be added to our database.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Suggest a University
          </Link>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}