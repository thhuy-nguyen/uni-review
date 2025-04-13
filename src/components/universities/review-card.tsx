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
  
  return (
    <div className="border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-base-200 overflow-hidden flex items-center justify-center">
            {review.profiles?.avatar_url ? (
              <Image 
                src={review.profiles.avatar_url} 
                alt={review.profiles.username || 'User'} 
                width={48} 
                height={48} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-lg font-bold">
                {(review.profiles?.username || 'User').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        
        <div>
          <div className="font-medium">{review.profiles?.username || 'Anonymous User'}</div>
          <div className="text-sm text-muted-foreground">
            {review.program && <span className="mr-2">{review.program}</span>}
            {review.year_attended && <span className="mr-2">Class of {review.year_attended}</span>}
            <time dateTime={review.created_at}>{formattedDate}</time>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <StarIcon 
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{review.rating}/5</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p>{displayContent}</p>
      </div>
      
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary text-sm mt-2 hover:underline"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}