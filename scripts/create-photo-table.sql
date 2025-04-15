-- Create the university_photos table
CREATE TABLE IF NOT EXISTS university_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an RLS policy for photo viewing (anyone can view)
CREATE POLICY "Anyone can view university photos" 
  ON university_photos 
  FOR SELECT 
  USING (true);

-- Create an RLS policy for photo uploading (authenticated users only)
CREATE POLICY "Authenticated users can upload photos" 
  ON university_photos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create an RLS policy for photo deletion (only by uploader or admin)
CREATE POLICY "Only photo uploader or admin can delete photos" 
  ON university_photos 
  FOR DELETE 
  USING (
    auth.uid() = uploaded_by OR 
    auth.uid() IN (SELECT id FROM auth.users WHERE auth_role = 'admin')
  );

-- Enable RLS on the table
ALTER TABLE university_photos ENABLE ROW LEVEL SECURITY;