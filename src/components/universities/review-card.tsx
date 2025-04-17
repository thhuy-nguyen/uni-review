'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { StarIcon } from '@/components/ui/icons';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    content: string;
    rating: number;
    academic_rating?: number | null;
    facilities_rating?: number | null;
    support_rating?: number | null;
    career_rating?: number | null;
    life_rating?: number | null;
    value_rating?: number | null;
    program?: string | null;
    year_attended?: number | null;
    created_at: string;
    profiles: {
      id: string;
      username: string;
      avatar_url?: string | null;
    } | null;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });
  
  // Determine if content is long enough to be truncated
  const isLongContent = review.content.length > 300;
  const displayContent = isLongContent && !isExpanded 
    ? `${review.content.substring(0, 300)}...` 
    : review.content;

  // Check if detailed ratings are available
  const hasDetailedRatings = 
    review.academic_rating !== undefined || 
    review.facilities_rating !== undefined || 
    review.support_rating !== undefined || 
    review.career_rating !== undefined || 
    review.life_rating !== undefined || 
    review.value_rating !== undefined;
  
  return (
    <div className="bg-base-100 rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-base-200 overflow-hidden flex items-center justify-center border shadow-sm">
            {review.profiles?.avatar_url ? (
              <Image 
                src={review.profiles.avatar_url} 
                alt={review.profiles.username || 'User'} 
                width={48} 
                height={48} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {(review.profiles?.username || 'User').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-medium">{review.profiles?.username || 'Anonymous User'}</div>
              <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center">
                {review.program && (
                  <span className="bg-base-200 px-2 py-0.5 rounded-full">{review.program}</span>
                )}
                {review.year_attended && (
                  <span className="bg-base-200 px-2 py-0.5 rounded-full">Class of {review.year_attended}</span>
                )}
                <time dateTime={review.created_at} className="text-muted-foreground">{formattedDate}</time>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-sm">{review.rating}/5</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
        <div className="prose prose-sm max-w-none mb-2">
          <p className={isExpanded ? '' : 'line-clamp-4'}>{displayContent}</p>
        </div>
        
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm flex items-center hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Detailed Ratings Section */}
      {hasDetailedRatings && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Detailed Ratings</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {review.academic_rating !== undefined && review.academic_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Academic:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.academic_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.academic_rating}</span>
                </div>
              </div>
            )}
            
            {review.facilities_rating !== undefined && review.facilities_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Facilities:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.facilities_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.facilities_rating}</span>
                </div>
              </div>
            )}
            
            {review.support_rating !== undefined && review.support_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Support:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.support_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.support_rating}</span>
                </div>
              </div>
            )}
            
            {review.career_rating !== undefined && review.career_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Career:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.career_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.career_rating}</span>
                </div>
              </div>
            )}
            
            {review.life_rating !== undefined && review.life_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Campus Life:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.life_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.life_rating}</span>
                </div>
              </div>
            )}
            
            {review.value_rating !== undefined && review.value_rating !== null && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground w-20">Value:</div>
                <div className="flex items-center gap-1">
                  <div className="bg-primary h-2 rounded" style={{ width: `${review.value_rating * 7}px` }}></div>
                  <span className="text-xs font-medium">{review.value_rating}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 pt-3">
        <div className="text-xs text-muted-foreground">
          ID: {review.id.substring(0, 8)}
        </div>
        
        <div className="flex gap-2">
          <button className="text-xs text-primary hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Helpful
          </button>
          <button className="text-xs text-muted-foreground hover:text-red-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report
          </button>
        </div>
      </div>
    </div>
  );
}