-- Script to remove university photos functionality
-- Drop policies first to avoid dependency issues
DROP POLICY IF EXISTS "Anyone can view university photos" ON university_photos;
DROP POLICY IF EXISTS "Users can upload their own photos" ON university_photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON university_photos;

-- Drop indexes
DROP INDEX IF EXISTS idx_university_photos_university_id;
DROP INDEX IF EXISTS idx_university_photos_user_id;

-- Drop the table itself
DROP TABLE IF EXISTS university_photos;

-- Note: You will also need to manually remove the 'university-photos' 
-- storage bucket from the Supabase dashboard if it exists