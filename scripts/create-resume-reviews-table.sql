-- Creates the resume_reviews table to store user resume analysis data
-- The actual resume files will be stored in Supabase Storage

-- Create the table
CREATE TABLE IF NOT EXISTS resume_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  job_description TEXT NOT NULL,
  ats_score INTEGER NOT NULL,
  matched_keywords TEXT[] NOT NULL,
  missing_keywords TEXT[] NOT NULL,
  suggestions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add index for faster querying by user
CREATE INDEX IF NOT EXISTS idx_resume_reviews_user_id ON resume_reviews(user_id);

-- Set up row level security policies
ALTER TABLE resume_reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own resume reviews
CREATE POLICY "Users can view their own resume reviews" ON resume_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own resume reviews
CREATE POLICY "Users can insert their own resume reviews" ON resume_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own resume reviews
CREATE POLICY "Users can delete their own resume reviews" ON resume_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions to authenticated users and the service role
GRANT SELECT, INSERT, DELETE ON resume_reviews TO authenticated;
GRANT ALL ON resume_reviews TO service_role;

-- Next: Create the Storage bucket using the Supabase dashboard
-- 1. Go to Storage in the Supabase dashboard
-- 2. Create a new bucket named 'resume-files'
-- 3. Set the bucket's access control to private to protect resume data
-- 4. Make sure the CORS settings are properly configured to allow uploads from your domain