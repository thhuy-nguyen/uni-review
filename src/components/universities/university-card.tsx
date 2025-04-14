import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@/components/ui/icons';

type University = {
  id: string;
  name: string;
  slug?: string;
  country: string;
  city: string;
  country_code?: string;
  logo_url?: string;
  avg_rating?: number;
  review_count?: number;
};

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  const { id, name, slug, country, city, logo_url, avg_rating = 0, review_count = 0 } = university;
  
  // Use slug if available, otherwise fall back to ID
  const linkPath = slug ? `/universities/${slug}` : `/universities/${encodeURIComponent(id)}`;
  
  return (
    <Link href={linkPath}>
      <div className="card bg-base-100 border hover:shadow-md transition-shadow">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-base-200 rounded-md flex items-center justify-center overflow-hidden">
              {logo_url ? (
                <Image 
                  src={logo_url} 
                  alt={`${name} logo`} 
                  width={64} 
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-2xl font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="card-title text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{city}, {country}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(avg_rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{avg_rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{review_count} {review_count === 1 ? 'review' : 'reviews'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}