'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { StarIcon } from '@/components/ui/icons';

interface ReviewFormProps {
  universityId: string;
  universityName: string;
}

export default function ReviewForm({ universityId, universityName }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [program, setProgram] = useState('');
  const [yearAttended, setYearAttended] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for your review');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter some content for your review');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase.from('reviews').insert({
        university_id: universityId,
        title,
        content,
        rating,
        program: program.trim() || null,
        year_attended: yearAttended ? parseInt(yearAttended) : null,
      });
      
      if (error) throw error;
      
      router.push(`/universities/${universityId}`);
      router.refresh();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate year options for the dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Rate your experience at {universityName}</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <StarIcon
                  className={`w-8 h-8 ${
                    (hoverRating ? star <= hoverRating : star <= rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {rating ? `You rated this university ${rating} out of 5 stars` : 'Click to rate'}
          </p>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Summarize your experience"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Review Details
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md min-h-[150px]"
            placeholder="Share your experience at this university, including academics, campus life, facilities, etc."
            required
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="program" className="block text-sm font-medium mb-1">
              Program (Optional)
            </label>
            <input
              type="text"
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. Computer Science"
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="yearAttended" className="block text-sm font-medium mb-1">
              Year Attended (Optional)
            </label>
            <select
              id="yearAttended"
              value={yearAttended}
              onChange={(e) => setYearAttended(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 mr-2 border rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}