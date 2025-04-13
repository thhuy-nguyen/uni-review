import { Metadata } from 'next';
import Link from 'next/link';
import UniversityCard from '@/components/universities/university-card';
import { getUniversities } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Universities | UniReview',
  description: 'Browse and search for universities to read and write reviews.',
};

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Universities</h1>
      <p className="text-muted-foreground mb-8">Browse and search for universities to read and write reviews.</p>
      
      {/* Search and filters - can be implemented later */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search universities..."
            className="input input-bordered flex-1"
          />
          <button className="btn btn-primary">
            Search
          </button>
        </div>
      </div>
      
      {universities.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No universities found</h3>
          <p className="text-muted-foreground">Try changing your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}
    </div>
  );
}