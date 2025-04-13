import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const swotRepoUrl = 'https://github.com/JetBrains/swot.git';
const tempDir = path.join(process.cwd(), 'temp-swot');
const outputFile = path.join(process.cwd(), 'university-domains.sql');
const libDir = path.join(tempDir, 'lib');

// Function to clone the repository
async function cloneSwotRepo() {
  console.log('Cloning the JetBrains/swot repository...');
  
  try {
    // Remove the directory if it exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    // Clone the repository
    execSync(`git clone --depth 1 ${swotRepoUrl} ${tempDir}`, { stdio: 'inherit' });
    console.log('Repository cloned successfully.');
  } catch (error) {
    console.error('Error cloning repository:', error);
    throw error;
  }
}

// Function to extract domains from the Swot lib directory
async function extractDomains() {
  console.log('Extracting university domains...');
  
  const domains = new Set<string>();
  
  // Walk through the lib directory
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip the test directory
        if (file === 'test') continue;
        walkDir(filePath);
      } else if (file === 'school.json' || file.endsWith('.txt')) {
        try {
          // Read the domain from the txt file or school.json
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (file === 'school.json') {
            try {
              const schoolData = JSON.parse(content);
              if (schoolData.domains && Array.isArray(schoolData.domains)) {
                schoolData.domains.forEach((domain: string) => domains.add(domain.toLowerCase()));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          } else {
            // It's a domain file
            const domain = path.basename(filePath, '.txt').toLowerCase();
            
            // Get the directory structure to construct the full domain
            let currentPath = path.dirname(filePath);
            let pathParts = [];
            
            while (currentPath !== libDir) {
              pathParts.push(path.basename(currentPath).toLowerCase());
              currentPath = path.dirname(currentPath);
            }
            
            // Reverse the path parts and join with dots to form the domain
            const fullDomain = [...pathParts.reverse(), domain].join('.');
            domains.add(fullDomain);
          }
        } catch (error) {
          console.warn(`Error reading file ${filePath}:`, error);
        }
      }
    }
  }
  
  // Start the directory walk
  walkDir(libDir);
  
  console.log(`Found ${domains.size} unique university domains.`);
  return Array.from(domains);
}

// Function to generate SQL insert statements
function generateSql(domains: string[]) {
  console.log('Generating SQL insert statements...');
  
  let sql = `-- University email domains from JetBrains/swot\n`;
  sql += `-- Generated on ${new Date().toISOString()}\n\n`;
  sql += `-- Function to check if a university exists and add it if not\n`;
  sql += `CREATE OR REPLACE FUNCTION add_university_domain(domain_text TEXT, university_name TEXT)\n`;
  sql += `RETURNS VOID AS $$\n`;
  sql += `DECLARE\n`;
  sql += `  university_id UUID;\n`;
  sql += `  country_code TEXT;\n`;
  sql += `  country_id UUID;\n`;
  sql += `BEGIN\n`;
  sql += `  -- Extract country code from domain TLD\n`;
  sql += `  country_code := UPPER(REVERSE(SPLIT_PART(REVERSE(domain_text), '.', 1)));\n`;
  sql += `  \n`;
  sql += `  -- Get country id from country code\n`;
  sql += `  SELECT id INTO country_id FROM countries WHERE code = country_code;\n`;
  sql += `  \n`;
  sql += `  -- If country not found, use default country (you may want to adjust this)\n`;
  sql += `  IF country_id IS NULL THEN\n`;
  sql += `    SELECT id INTO country_id FROM countries LIMIT 1;\n`;
  sql += `  END IF;\n`;
  sql += `  \n`;
  sql += `  -- Check if university exists with this domain\n`;
  sql += `  SELECT u.id INTO university_id\n`;
  sql += `  FROM universities u\n`;
  sql += `  JOIN university_email_domains d ON u.id = d.university_id\n`;
  sql += `  WHERE d.domain = domain_text;\n`;
  sql += `  \n`;
  sql += `  -- If university doesn't exist, create it\n`;
  sql += `  IF university_id IS NULL THEN\n`;
  sql += `    -- Check if the university with this name exists\n`;
  sql += `    SELECT id INTO university_id FROM universities WHERE name = university_name;\n`;
  sql += `    \n`;
  sql += `    -- If university with this name doesn't exist, create it\n`;
  sql += `    IF university_id IS NULL THEN\n`;
  sql += `      INSERT INTO universities (name, country_id, city, type)\n`;
  sql += `      VALUES (university_name, country_id, 'Unknown', 'Unknown')\n`;
  sql += `      RETURNING id INTO university_id;\n`;
  sql += `    END IF;\n`;
  sql += `    \n`;
  sql += `    -- Insert the domain\n`;
  sql += `    INSERT INTO university_email_domains (university_id, domain)\n`;
  sql += `    VALUES (university_id, domain_text)\n`;
  sql += `    ON CONFLICT (domain) DO NOTHING;\n`;
  sql += `  END IF;\n`;
  sql += `END;\n`;
  sql += `$$ LANGUAGE plpgsql;\n\n`;
  
  // Generate SQL for inserting domains
  for (const domain of domains) {
    // Clean up the domain
    const cleanDomain = domain.trim().toLowerCase();
    
    // Skip invalid domains
    if (!cleanDomain || !cleanDomain.includes('.')) continue;
    
    // Generate a university name from the domain
    // Take the second-level domain and make it look nice
    const parts = cleanDomain.split('.');
    let universityName = parts[parts.length - 2] || '';
    
    // Capitalize and replace hyphens/underscores with spaces
    universityName = universityName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    
    if (universityName) {
      sql += `SELECT add_university_domain('${cleanDomain}', '${universityName}');\n`;
    }
  }
  
  // Add a cleanup function call at the end
  sql += `\n-- Remove the function when done\n`;
  sql += `DROP FUNCTION add_university_domain(TEXT, TEXT);\n`;
  
  return sql;
}

// Main function to run the script
async function main() {
  try {
    await cloneSwotRepo();
    const domains = await extractDomains();
    const sql = generateSql(domains);
    
    // Write the SQL to a file
    fs.writeFileSync(outputFile, sql);
    console.log(`SQL file generated successfully: ${outputFile}`);
    
    // Clean up
    console.log('Cleaning up...');
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();