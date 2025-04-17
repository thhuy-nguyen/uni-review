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
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service is not configured. Please set the GEMINI_API_KEY environment variable.' 
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
    // Initialize Google Generative AI client
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Gemini API key. Please set the GEMINI_API_KEY environment variable.');
    }
    
    // Create Gemini AI client with correct API version (v1, not v1beta)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the correct model version available in the current API
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", // Updated model name to gemini-1.5-pro which is the current version
      generationConfig: {
        temperature: 0.2,
      }
    });
    
    // Limit text size to avoid token limits
    const resumeExcerpt = resumeText.slice(0, 6000);
    const jobDescriptionExcerpt = jobDescription.slice(0, 3000);
    
    // Create parts for the Gemini model
    const parts = [
      {text: `
      You are an expert ATS (Applicant Tracking System) analyzer and resume consultant.
      Analyze the provided resume against the job description below.
      Provide a comprehensive evaluation with detailed statistics and actionable feedback.
      
      RESUME:
      ${resumeExcerpt} 
      
      JOB DESCRIPTION:
      ${jobDescriptionExcerpt}
      
      Generate a detailed analysis in JSON format with the following structure:
      {
        "matchedKeywords": ["keyword1", "keyword2", ...],
        "missingKeywords": ["keyword1", "keyword2", ...],
        "score": 75, // overall match percentage (0-100)
        "suggestions": ["suggestion1", "suggestion2", ...],
        "sectionScores": {
          "skills": 80,
          "experience": 70,
          "education": 90,
          "overall": 75
        },
        "keywordImportance": {
          "keyword1": 8, // importance on scale of 1-10
          "keyword2": 6,
          ...
        },
        "actionVerbs": {
          "strong": ["achieved", "implemented", ...],
          "weak": ["responsible for", "helped with", ...]
        },
        "readabilityScore": 85, // 0-100
        "contentGaps": ["missing section1", "missing section2", ...],
        "industryKeywords": ["industry term1", "industry term2", ...]
      }
      
      Return valid JSON only, with no additional text or explanations outside the JSON structure.
      `}
    ];
    
    // Generate content with Gemini using the structured content format
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.2,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini AI service');
    }
    
    // Extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Gemini response');
    }
    
    // Parse the JSON response
    const analysis = JSON.parse(jsonMatch[0]);
    
    // Ensure the required fields exist
    if (!analysis.matchedKeywords || !analysis.missingKeywords || !analysis.score || !analysis.suggestions) {
      throw new Error('Incomplete analysis data from Gemini AI');
    }
    
    return analysis;
    
  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes('JSON')) {
      throw new Error('Failed to parse Gemini AI response: Invalid JSON format');
    } else if (error.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your billing details.');
    } else if (error.message?.includes('429')) {
      throw new Error('Gemini AI rate limit reached. Please try again later.');
    } else if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your environment variables.');
    } else {
      // Pass through the original error with additional context
      throw new Error(`Gemini AI error: ${error.message || 'Unknown error'}`);
    }
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