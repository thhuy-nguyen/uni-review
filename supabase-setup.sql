-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create universities table with reference to countries
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_id UUID NOT NULL REFERENCES countries(id),
  city TEXT, -- Just a text field for city name
  logo_url TEXT,
  description TEXT,
  website TEXT,
  established INT,
  student_count INT,
  type TEXT, -- e.g., 'Public', 'Private', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create university email domains table
CREATE TABLE IF NOT EXISTS university_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table with proper fields including university information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  graduation_year INT,
  program TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  program TEXT,
  years_attended TEXT, -- e.g., '2018-2022'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Countries can be viewed by anyone
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  USING (true);

-- Universities can be viewed by anyone
CREATE POLICY "Universities are viewable by everyone"
  ON universities FOR SELECT
  USING (true);

-- University email domains are viewable by everyone
CREATE POLICY "University email domains are viewable by everyone"
  ON university_email_domains FOR SELECT
  USING (true);

-- Only admin can insert/update/delete countries and universities
-- Replace '00000000-0000-0000-0000-000000000000' with your admin user ID when implementing
CREATE POLICY "Only admin can insert countries"
  ON countries FOR INSERT
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can update countries"
  ON countries FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can delete countries"
  ON countries FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));

CREATE POLICY "Only admin can insert universities"
  ON universities FOR INSERT
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can update universities"
  ON universities FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can delete universities"
  ON universities FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));

CREATE POLICY "Only admin can insert university email domains"
  ON university_email_domains FOR INSERT
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can update university email domains"
  ON university_email_domains FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));
  
CREATE POLICY "Only admin can delete university email domains"
  ON university_email_domains FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));

-- Reviews are viewable by everyone
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

-- Users can only create reviews when logged in
CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Profiles are viewable by everyone
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Add indexes for performance
CREATE INDEX ON universities (name);
CREATE INDEX ON universities (country_id);
CREATE INDEX ON university_email_domains (domain);
CREATE INDEX ON university_email_domains (university_id);
CREATE INDEX ON reviews (university_id);
CREATE INDEX ON reviews (user_id);

-- Insert actual countries from Wikipedia
INSERT INTO countries (name, code)
VALUES 
  ('Afghanistan', 'AF'),
  ('Albania', 'AL'),
  ('Algeria', 'DZ'),
  ('Andorra', 'AD'),
  ('Angola', 'AO'),
  ('Antigua and Barbuda', 'AG'),
  ('Argentina', 'AR'),
  ('Armenia', 'AM'),
  ('Australia', 'AU'),
  ('Austria', 'AT'),
  ('Azerbaijan', 'AZ'),
  ('Bahamas', 'BS'),
  ('Bahrain', 'BH'),
  ('Bangladesh', 'BD'),
  ('Barbados', 'BB'),
  ('Belarus', 'BY'),
  ('Belgium', 'BE'),
  ('Belize', 'BZ'),
  ('Benin', 'BJ'),
  ('Bhutan', 'BT'),
  ('Bolivia', 'BO'),
  ('Bosnia and Herzegovina', 'BA'),
  ('Botswana', 'BW'),
  ('Brazil', 'BR'),
  ('Brunei', 'BN'),
  ('Bulgaria', 'BG'),
  ('Burkina Faso', 'BF'),
  ('Burundi', 'BI'),
  ('Cambodia', 'KH'),
  ('Cameroon', 'CM'),
  ('Canada', 'CA'),
  ('Cape Verde', 'CV'),
  ('Central African Republic', 'CF'),
  ('Chad', 'TD'),
  ('Chile', 'CL'),
  ('China', 'CN'),
  ('Colombia', 'CO'),
  ('Comoros', 'KM'),
  ('Congo', 'CG'),
  ('Costa Rica', 'CR'),
  ('Croatia', 'HR'),
  ('Cuba', 'CU'),
  ('Cyprus', 'CY'),
  ('Czech Republic', 'CZ'),
  ('Democratic Republic of the Congo', 'CD'),
  ('Denmark', 'DK'),
  ('Djibouti', 'DJ'),
  ('Dominica', 'DM'),
  ('Dominican Republic', 'DO'),
  ('East Timor', 'TL'),
  ('Ecuador', 'EC'),
  ('Egypt', 'EG'),
  ('El Salvador', 'SV'),
  ('Equatorial Guinea', 'GQ'),
  ('Eritrea', 'ER'),
  ('Estonia', 'EE'),
  ('Eswatini', 'SZ'),
  ('Ethiopia', 'ET'),
  ('Fiji', 'FJ'),
  ('Finland', 'FI'),
  ('France', 'FR'),
  ('Gabon', 'GA'),
  ('Gambia', 'GM'),
  ('Georgia', 'GE'),
  ('Germany', 'DE'),
  ('Ghana', 'GH'),
  ('Greece', 'GR'),
  ('Grenada', 'GD'),
  ('Guatemala', 'GT'),
  ('Guinea', 'GN'),
  ('Guinea-Bissau', 'GW'),
  ('Guyana', 'GY'),
  ('Haiti', 'HT'),
  ('Honduras', 'HN'),
  ('Hungary', 'HU'),
  ('Iceland', 'IS'),
  ('India', 'IN'),
  ('Indonesia', 'ID'),
  ('Iran', 'IR'),
  ('Iraq', 'IQ'),
  ('Ireland', 'IE'),
  ('Israel', 'IL'),
  ('Italy', 'IT'),
  ('Ivory Coast', 'CI'),
  ('Jamaica', 'JM'),
  ('Japan', 'JP'),
  ('Jordan', 'JO'),
  ('Kazakhstan', 'KZ'),
  ('Kenya', 'KE'),
  ('Kiribati', 'KI'),
  ('Kuwait', 'KW'),
  ('Kyrgyzstan', 'KG'),
  ('Laos', 'LA'),
  ('Latvia', 'LV'),
  ('Lebanon', 'LB'),
  ('Lesotho', 'LS'),
  ('Liberia', 'LR'),
  ('Libya', 'LY'),
  ('Liechtenstein', 'LI'),
  ('Lithuania', 'LT'),
  ('Luxembourg', 'LU'),
  ('Madagascar', 'MG'),
  ('Malawi', 'MW'),
  ('Malaysia', 'MY'),
  ('Maldives', 'MV'),
  ('Mali', 'ML'),
  ('Malta', 'MT'),
  ('Marshall Islands', 'MH'),
  ('Mauritania', 'MR'),
  ('Mauritius', 'MU'),
  ('Mexico', 'MX'),
  ('Micronesia', 'FM'),
  ('Moldova', 'MD'),
  ('Monaco', 'MC'),
  ('Mongolia', 'MN'),
  ('Montenegro', 'ME'),
  ('Morocco', 'MA'),
  ('Mozambique', 'MZ'),
  ('Myanmar', 'MM'),
  ('Namibia', 'NA'),
  ('Nauru', 'NR'),
  ('Nepal', 'NP'),
  ('Netherlands', 'NL'),
  ('New Zealand', 'NZ'),
  ('Nicaragua', 'NI'),
  ('Niger', 'NE'),
  ('Nigeria', 'NG'),
  ('North Korea', 'KP'),
  ('North Macedonia', 'MK'),
  ('Norway', 'NO'),
  ('Oman', 'OM'),
  ('Pakistan', 'PK'),
  ('Palau', 'PW'),
  ('Panama', 'PA'),
  ('Papua New Guinea', 'PG'),
  ('Paraguay', 'PY'),
  ('Peru', 'PE'),
  ('Philippines', 'PH'),
  ('Poland', 'PL'),
  ('Portugal', 'PT'),
  ('Qatar', 'QA'),
  ('Romania', 'RO'),
  ('Russia', 'RU'),
  ('Rwanda', 'RW'),
  ('Saint Kitts and Nevis', 'KN'),
  ('Saint Lucia', 'LC'),
  ('Saint Vincent and the Grenadines', 'VC'),
  ('Samoa', 'WS'),
  ('San Marino', 'SM'),
  ('Sao Tome and Principe', 'ST'),
  ('Saudi Arabia', 'SA'),
  ('Senegal', 'SN'),
  ('Serbia', 'RS'),
  ('Seychelles', 'SC'),
  ('Sierra Leone', 'SL'),
  ('Singapore', 'SG'),
  ('Slovakia', 'SK'),
  ('Slovenia', 'SI'),
  ('Solomon Islands', 'SB'),
  ('Somalia', 'SO'),
  ('South Africa', 'ZA'),
  ('South Korea', 'KR'),
  ('South Sudan', 'SS'),
  ('Spain', 'ES'),
  ('Sri Lanka', 'LK'),
  ('Sudan', 'SD'),
  ('Suriname', 'SR'),
  ('Sweden', 'SE'),
  ('Switzerland', 'CH'),
  ('Syria', 'SY'),
  ('Taiwan', 'TW'),
  ('Tajikistan', 'TJ'),
  ('Tanzania', 'TZ'),
  ('Thailand', 'TH'),
  ('Togo', 'TG'),
  ('Tonga', 'TO'),
  ('Trinidad and Tobago', 'TT'),
  ('Tunisia', 'TN'),
  ('Turkey', 'TR'),
  ('Turkmenistan', 'TM'),
  ('Tuvalu', 'TV'),
  ('Uganda', 'UG'),
  ('Ukraine', 'UA'),
  ('United Arab Emirates', 'AE'),
  ('United Kingdom', 'GB'),
  ('United States', 'US'),
  ('Uruguay', 'UY'),
  ('Uzbekistan', 'UZ'),
  ('Vanuatu', 'VU'),
  ('Vatican City', 'VA'),
  ('Venezuela', 'VE'),
  ('Vietnam', 'VN'),
  ('Yemen', 'YE'),
  ('Zambia', 'ZM'),
  ('Zimbabwe', 'ZW')
ON CONFLICT (name) DO NOTHING;

-- Insert sample universities
INSERT INTO universities (name, country_id, city, description, website, established, type)
VALUES 
  (
    'Harvard University', 
    (SELECT id FROM countries WHERE code = 'US'), 
    'Cambridge',
    'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher learning in the United States.',
    'https://www.harvard.edu', 
    1636, 
    'Private'
  ),
  (
    'University of Oxford', 
    (SELECT id FROM countries WHERE code = 'GB'), 
    'Oxford',
    'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world.',
    'https://www.ox.ac.uk', 
    1096, 
    'Public'
  ),
  (
    'Stanford University', 
    (SELECT id FROM countries WHERE code = 'US'), 
    'Stanford',
    'Stanford University is a private research university in Stanford, California. The university was founded in 1885 by Leland and Jane Stanford in memory of their only child.',
    'https://www.stanford.edu', 
    1885, 
    'Private'
  ),
  (
    'Massachusetts Institute of Technology', 
    (SELECT id FROM countries WHERE code = 'US'), 
    'Cambridge',
    'The Massachusetts Institute of Technology (MIT) is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a significant role in the development of modern technology and science.',
    'https://www.mit.edu', 
    1861, 
    'Private'
  ),
  (
    'University of Cambridge', 
    (SELECT id FROM countries WHERE code = 'GB'), 
    'Cambridge',
    'The University of Cambridge is a collegiate research university in Cambridge, United Kingdom. Founded in 1209, it is the second-oldest university in the English-speaking world.',
    'https://www.cam.ac.uk', 
    1209, 
    'Public'
  ),
  (
    'National University of Singapore', 
    (SELECT id FROM countries WHERE code = 'SG'), 
    'Singapore',
    'The National University of Singapore is the oldest autonomous university in Singapore. Founded in 1905, it consistently ranks as one of the top universities in Asia.',
    'https://www.nus.edu.sg', 
    1905, 
    'Public'
  ),
  (
    'FPT University',
    (SELECT id FROM countries WHERE code = 'VN'),
    'Hanoi',
    'FPT University is a private university in Vietnam. Established in 2006, it is operated by the FPT Corporation, a major technology company in Vietnam.',
    'https://fpt.edu.vn',
    2006,
    'Private'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample email domains
INSERT INTO university_email_domains (university_id, domain)
VALUES 
  (
    (SELECT id FROM universities WHERE name = 'Harvard University'),
    'harvard.edu'
  ),
  (
    (SELECT id FROM universities WHERE name = 'University of Oxford'),
    'ox.ac.uk'
  ),
  (
    (SELECT id FROM universities WHERE name = 'Stanford University'),
    'stanford.edu'
  ),
  (
    (SELECT id FROM universities WHERE name = 'Massachusetts Institute of Technology'),
    'mit.edu'
  ),
  (
    (SELECT id FROM universities WHERE name = 'University of Cambridge'),
    'cam.ac.uk'
  ),
  (
    (SELECT id FROM universities WHERE name = 'National University of Singapore'),
    'u.nus.edu'
  ),
  (
    (SELECT id FROM universities WHERE name = 'FPT University'),
    'fpt.edu.vn'
  )
ON CONFLICT (domain) DO NOTHING;

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_countries_updated_at
BEFORE UPDATE ON countries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_universities_updated_at
BEFORE UPDATE ON universities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_university_email_domains_updated_at
BEFORE UPDATE ON university_email_domains
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create a function to verify user's university based on email domain
CREATE OR REPLACE FUNCTION check_university_email_domain() 
RETURNS TRIGGER AS $$
DECLARE
  domain TEXT;
  matching_university_id UUID;
BEGIN
  -- Extract the domain from email
  domain := split_part(NEW.email, '@', 2);
  
  -- Look for matching university
  SELECT university_id INTO matching_university_id
  FROM university_email_domains
  WHERE domain = domain;
  
  -- If we found a match
  IF matching_university_id IS NOT NULL THEN
    -- Set the university_id
    NEW.university_id := matching_university_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  new_profile profiles%ROWTYPE;
BEGIN
  -- Insert the basic profile info
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  RETURNING * INTO new_profile;
  
  -- Now try to match with university
  PERFORM check_university_email_domain() FROM profiles WHERE id = new.id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  
-- Add a trigger to update university association when email changes
CREATE TRIGGER on_profile_email_update
  BEFORE UPDATE OF email ON profiles
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION check_university_email_domain();