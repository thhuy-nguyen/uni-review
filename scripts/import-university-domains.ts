import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define data structures
interface UniversityData {
  name: string;
  country: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  state_province?: string;
}

interface CountryMap {
  [code: string]: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a slug from university name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}

// Main function
async function importUniversities() {
  try {
    console.log('Starting university import...');
    
    // Get list of countries from database to use for mapping
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, code');
    
    if (countriesError) {
      throw new Error(`Failed to fetch countries: ${countriesError.message}`);
    }
    
    // Create map of country codes to country IDs for quick lookup
    const countryMap: Record<string, string> = {};
    countries.forEach(country => {
      countryMap[country.code] = country.id;
    });
    
    // Fetch university data from API
    console.log('Fetching university data from API...');
    const response = await fetch('http://universities.hipolabs.com/search');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const universities: UniversityData[] = await response.json();
    console.log(`Fetched ${universities.length} universities from API`);
    
    // Process universities in batches to avoid overwhelming the database
    const batchSize = 100;
    const totalBatches = Math.ceil(universities.length / batchSize);
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, universities.length);
      const batch = universities.slice(start, end);
      
      console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} universities)...`);
      
      for (const uni of batch) {
        try {
          // Skip if country code isn't in our database
          if (!countryMap[uni.alpha_two_code]) {
            console.warn(`Skipping "${uni.name}" - country code "${uni.alpha_two_code}" not found`);
            skippedCount++;
            continue;
          }
          
          // Generate a slug from university name
          const baseSlug = generateSlug(uni.name);
          
          // Insert university
          const { data: universityData, error: universityError } = await supabase
            .from('universities')
            .insert({
              name: uni.name,
              slug: baseSlug,
              country_id: countryMap[uni.alpha_two_code],
              city: uni.state_province || null, // Using state_province as city if available
              website: uni.web_pages?.[0] || null,
              type: uni.alpha_two_code === 'US' ? determineUniversityType(uni.name) : null
            })
            .select()
            .single();
          
          if (universityError) {
            // Skip duplicate universities (name conflicts) silently
            if (universityError.code === '23505') { // Unique constraint violation
              skippedCount++;
              continue;
            }
            
            console.error(`Error inserting university "${uni.name}": ${universityError.message}`);
            errorCount++;
            continue;
          }
          
          // Insert email domains if available
          if (uni.domains && uni.domains.length > 0) {
            for (const domain of uni.domains) {
              try {
                await supabase
                  .from('university_email_domains')
                  .insert({
                    university_id: universityData.id,
                    domain: domain
                  })
                  .single();
              } catch (domainError) {
                console.warn(`Couldn't insert domain "${domain}" for "${uni.name}": ${domainError}`);
                // Continue with other domains even if one fails
              }
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error processing "${uni.name}": ${error}`);
          errorCount++;
        }
      }
      
      console.log(`Completed batch ${i + 1}/${totalBatches}`);
    }
    
    console.log('Import complete!');
    console.log(`Successfully imported: ${successCount} universities`);
    console.log(`Skipped: ${skippedCount} universities (duplicates or missing country data)`);
    console.log(`Failed: ${errorCount} universities`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Helper function to determine university type based on name (US universities)
function determineUniversityType(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('community college') || 
      lowerName.includes('technical college')) {
    return 'Community College';
  } else if (lowerName.includes('state university') || 
             lowerName.includes('university of') && !lowerName.includes('private')) {
    return 'Public';
  } else {
    return 'Private';
  }
}

// Run the import
importUniversities().catch(console.error);