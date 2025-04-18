-- Grant permissions for the user_roles table to authenticated users
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own roles
CREATE POLICY "Users can read their own roles" 
ON user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select permission on the user_roles table
GRANT SELECT ON user_roles TO authenticated;