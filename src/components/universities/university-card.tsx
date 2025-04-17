'use client';

import Link from 'next/link';
import { useState } from 'react';

interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  logo_url?: string;
  established?: number;
  type?: string;
  avg_rating: number;
  review_count: number;
  description?: string;
  slug?: string;
}

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const universityUrl = university.slug 
    ? `/universities/${university.slug}` 
    : `/universities/${university.id}`;

  return (
    <Link 
      href={universityUrl}
      className="card bg-base-100 border rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-primary/20"
    >
      <div className="relative">
        {/* Card Header with Logo/Image */}
        <div className="bg-base-200/50 h-36 flex items-center justify-center overflow-hidden relative">
          {university.logo_url && !imageError ? (
            <img
              src={university.logo_url}
              alt={`${university.name} logo`}
              className="object-contain h-full w-full p-4"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-7xl font-bold text-primary/40">{university.name.charAt(0)}</span>
            </div>
          )}
          
          {/* Country Flag */}
          {university.country_code && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full overflow-hidden shadow-md border-2 border-white">
              <img 
                src={`https://flagcdn.com/w80/${university.country_code.toLowerCase()}.png`}
                alt={university.country}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        
        {/* Card Body */}
        <div className="card-body p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{university.name}</h3>
                <div className="flex items-center gap-1 bg-base-100 px-2 py-0.5 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(university.avg_rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : i < university.avg_rating
                              ? 'text-yellow-400 fill-yellow-400 opacity-60'
                              : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-medium">{university.avg_rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {university.city ? `${university.city}, ` : ''}{university.country}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {university.type && (
                <div className="badge badge-outline text-xs">
                  {university.type}
                </div>
              )}
              {university.established && (
                <div className="badge badge-outline text-xs">
                  Est. {university.established}
                </div>
              )}
              <div className="badge badge-outline text-xs">
                {university.review_count} {university.review_count === 1 ? 'review' : 'reviews'}
              </div>
            </div>
              
            {university.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{university.description}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}