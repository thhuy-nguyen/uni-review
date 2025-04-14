import { Metadata } from 'next';
import UniversityList from '@/components/universities/university-list';
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
      
      <UniversityList universities={universities} />
    </div>
  );
}