import { NextRequest, NextResponse } from 'next/server';
// Use dynamic imports only when actually needed

export async function POST(request: NextRequest) {
  // Main entry point for resume parsing API
  try {
    // Get form data with file and job description
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;
    
    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }
    
    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }
    
    // Get basic file info
    const fileType = file.type;
    // Extract text based on file type
    let resumeText = '';
    try {
      if (fileType.includes('pdf')) {
        // Handle PDF file format
        resumeText = await parsePDF(file);
      } 
      else if (fileType.includes('wordprocessingml') || fileType.includes('docx') || fileType.includes('msword')) {
        // Handle Word document formats
        resumeText = await parseDocx(file);
      }
      else if (fileType.includes('text/plain')) {
        // For text files, use text decoder directly without additional libraries
        const buffer = await file.arrayBuffer();
        resumeText = new TextDecoder().decode(buffer);
      }
      else {
        return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
      }
    } catch (parseError: any) {
      return NextResponse.json({ 
        error: `Failed to parse file: ${parseError.message}` 
      }, { status: 500 });
    }
    
    // Clean up extracted text
    resumeText = cleanResumeText(resumeText);
    
    // Ensure we have enough content to analyze
    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the provided resume' },
        { status: 400 }
      );
    }
    
    // Only perform AI-based analysis, no fallback to basic keyword matching
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service is not configured. Please set the OPENAI_API_KEY environment variable.' 
      }, { status: 500 });
    }
    
    try {
      // Use AI-powered analysis
      const analysis = await analyzeResumeWithAI(resumeText, jobDescription);
      
      // Return final result
      return NextResponse.json({
        text: resumeText,
        analysis
      });
    } catch (analysisError: any) {
      return NextResponse.json({ 
        error: `AI analysis failed: ${analysisError.message}` 
      }, { status: 500 });
    }
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to parse resume. Please try again with a different file.' },
      { status: 500 }
    );
  }
}

/**
 * Parse PDF files with optimized memory usage
 */
async function parsePDF(file: File): Promise<string> {
  try {
    // Convert file to buffer using smaller chunks to avoid memory issues
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use require instead of dynamic import for pdf-parse
    // @ts-ignore - Suppress TypeScript error for require
    const pdfParse = require('pdf-parse');
    
    // Use memory-efficient options
    const options = {
      pagerender: undefined,  // Don't render page images
      max: 5,                 // Only process first 5 pages for serverless efficiency
      version: 'v1.10.100'    // Use specific version
    };
    
    const pdfData = await pdfParse(buffer, options);
    return pdfData.text;
  } catch (error: any) {
    // Just return the error message
    throw new Error(error.message || "Error parsing PDF file");
  }
}

/**
 * Parse DOCX files
 */
async function parseDocx(file: File): Promise<string> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamically import mammoth
    const mammoth = await import('mammoth');
    
    // For DOCX files, use mammoth with simplified options
    const result = await mammoth.extractRawText({
      buffer: buffer
    });
    
    return result.value;
  } catch (error) {
    throw new Error("Could not parse DOCX file. The file may be corrupted or in an unsupported format.");
  }
}

/**
 * Analyze resume against job description using AI
 */
async function analyzeResumeWithAI(resumeText: string, jobDescription: string): Promise<any> {
  try {
    // Use EdgeRuntime compatible OpenAI fetch API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Using GPT-4o Mini for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS (Applicant Tracking System) analyzer that evaluates resumes against job descriptions. Your analysis should be thorough but focused on actionable insights.'
          },
          {
            role: 'user',
            content: `Analyze this resume against the job description. Extract key skills, experience, and qualifications from both. Determine match percentage based on critical requirements and provide specific improvement suggestions.
            
            RESUME:
            ${resumeText.slice(0, 6000)} 
            
            JOB DESCRIPTION:
            ${jobDescription.slice(0, 3000)}
            
            Respond with a JSON object containing:
            1. matchedKeywords: Array of keywords/skills found in both the resume and job description (focus on the most relevant ones)
            2. missingKeywords: Array of important keywords/skills from the job description missing in the resume (prioritize by importance)
            3. score: Numeric score from 0-100 representing match percentage
            4. suggestions: Array of 3-5 specific improvement suggestions that would make the resume more competitive for this position
            `
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      console.log(response)
      throw new Error(`AI service error: ${response.status}`);
    }
    
    // Get and parse the AI response
    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('Empty response from AI service');
    }
    
    // Parse the JSON response
    return JSON.parse(analysisText);
    
  } catch (error) {
    throw error;
  }
}

/**
 * Extract important keywords from text
 */
function extractKeywords(text: string): string[] {
  // Filter out common words
  const stopWords = ['and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are'];
  
  // Split text into words, remove punctuation, filter stop words, and keep words with 3+ characters
  return text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
}

/**
 * Cleans and formats raw text extracted from a resume
 */
function cleanResumeText(text: string): string {
  return text
    .replace(/[\r\n]+/g, '\n')       // Normalize line endings
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Reduce multiple blank lines to max two
    .replace(/[^\S\r\n]+/g, ' ')      // Replace multiple spaces with single space (preserve line breaks)
    .replace(/\s+\./g, '.')           // Fix spacing before periods
    .replace(/\s+,/g, ',')            // Fix spacing before commas
    .trim();                          // Remove leading/trailing whitespace
}