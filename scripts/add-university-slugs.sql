-- Add slug column to universities table
ALTER TABLE universities ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Generate initial slugs based on university names
UPDATE universities 
SET slug = LOWER(
  -- Replace spaces and special characters with hyphens
  REGEXP_REPLACE(
    -- Remove any character that's not alphanumeric, space, or hyphen
    REGEXP_REPLACE(name, '[^a-zA-Z0-9 -]', '', 'g'),
    '[ ]+', '-', 'g'
  )
) 
WHERE slug IS NULL;

-- Add trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION generate_university_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base slug from name
  base_slug := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9 -]', '', 'g'),
      '[ ]+', '-', 'g'
    )
  );
  
  final_slug := base_slug;
  
  -- Check if slug exists, if so, append a counter
  WHILE EXISTS(SELECT 1 FROM universities WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER university_slug_trigger
BEFORE INSERT OR UPDATE ON universities
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION generate_university_slug();

-- Create an index on the slug column for faster lookups
CREATE INDEX IF NOT EXISTS idx_universities_slug ON universities(slug);