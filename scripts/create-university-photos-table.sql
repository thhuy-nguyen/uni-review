-- Creates the university_photos table to store metadata about uploaded photos
-- The actual files are stored in Supabase Storage

-- Create the table
CREATE TABLE IF NOT EXISTS university_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add index for faster querying by university
CREATE INDEX IF NOT EXISTS idx_university_photos_university_id ON university_photos(university_id);
CREATE INDEX IF NOT EXISTS idx_university_photos_user_id ON university_photos(user_id);

-- Set up row level security policies
ALTER TABLE university_photos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all photos
CREATE POLICY "Anyone can view university photos" ON university_photos
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Allow authenticated users to insert their own photos
CREATE POLICY "Users can upload their own photos" ON university_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos" ON university_photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions to authenticated users and the service role
GRANT SELECT ON university_photos TO anon, authenticated;
GRANT INSERT, DELETE ON university_photos TO authenticated;
GRANT ALL ON university_photos TO service_role;

-- Next: Create the Storage bucket using the Supabase dashboard
-- 1. Go to Storage in the Supabase dashboard
-- 2. Create a new bucket named 'university-photos'
-- 3. Set the bucket's access control to public (or restrict as needed)
-- 4. Make sure the CORS settings are properly configured to allow uploads from your domain