'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { STORAGE_CONFIG } from '@/lib/storage-config';

// Define proper interfaces for our analysis data
interface ATSAnalysisResult {
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  score: number;
}

export default function ResumeReviewForm() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const [savedReviewId, setSavedReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Resume file selection handler
  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check file type using storage config
    const validTypes = STORAGE_CONFIG.RESUME_FILES.ALLOWED_MIME_TYPES;
    if (!validTypes.includes(file.type)) {
      setError('Only PDF, DOCX, and TXT files are allowed for resume upload');
      return;
    }

    // Check file size using storage config
    const maxSize = STORAGE_CONFIG.RESUME_FILES.MAX_FILE_SIZE;
    if (file.size > maxSize) {
      setError('Resume file must be smaller than 5MB');
      return;
    }

    setResume(file);
    setError(null);
  };

  // ATS compatibility analysis
  const analyzeResume = async () => {
    if (!resume || !jobDescription.trim()) {
      setError('Both resume and job description are required for analysis');
      return;
    }

    setIsAnalyzing(true);
    setIsParsingFile(true);
    setError(null);
    setSavedReviewId(null);

    try {
      const formData = new FormData();
      formData.append('file', resume);
      formData.append('jobDescription', jobDescription);

      // Send both file and job description to API for AI-powered analysis
      try {
        const response = await fetch('/api/analyze-resume', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Server error occurred' }));
          const errorMessage = errorData.error || `Server error: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Set the extracted text from resume
        setResumeText(data.text);

        // Set analysis results from AI
        setAtsScore(data.analysis.score);
        setAtsAnalysis(data.analysis);
      } catch (fetchError: any) {
        // Network errors
        if (!navigator.onLine) {
          throw new Error('You appear to be offline. Please check your internet connection.');
        }

        throw fetchError;
      }
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsParsingFile(false);
      setIsAnalyzing(false);
    }
  };

  // Save resume analysis results to database
  const saveResumeAnalysis = async () => {
    if (!resume || !atsAnalysis || atsScore === null) {
      setError('Please analyze your resume before saving');
      return;
    }

    setIsSavingResults(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('You must be signed in to save resume analysis');
      }

      // Upload resume file to storage
      const timestamp = new Date().getTime();
      const fileExt = resume.name.split('.').pop();
      const cleanFileName = resume.name.replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric chars
      const filePath = `${userData.user.id}/${timestamp}_${cleanFileName}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_CONFIG.RESUME_FILES.BUCKET_NAME)
        .upload(filePath, resume, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save analysis results to database
      const { data: reviewData, error: dbError } = await supabase
        .from('resume_reviews')
        .insert({
          user_id: userData.user.id,
          storage_path: filePath,
          job_description: jobDescription,
          ats_score: atsScore,
          matched_keywords: atsAnalysis.matchedKeywords,
          missing_keywords: atsAnalysis.missingKeywords,
          suggestions: atsAnalysis.suggestions
        })
        .select('id')
        .single();

      if (dbError) {
        throw dbError;
      }

      setSavedReviewId(reviewData.id);
    } catch (err: any) {
      console.error('Error saving resume analysis:', err);
      setError(err.message || 'Failed to save resume analysis. Please try again.');
    } finally {
      setIsSavingResults(false);
    }
  };

  // Reset the resume review
  const resetResumeReview = () => {
    setResume(null);
    setJobDescription('');
    setResumeText('');
    setAtsScore(null);
    setAtsAnalysis(null);
    setSavedReviewId(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl border border-base-300">
      <div className="card-body p-6 sm:p-8">
        <h2 className="card-title font-bold text-2xl text-base-content mb-2">Resume ATS Analyzer</h2>
        <p className="text-base-content/70 mb-6">
          Upload your resume and enter a job description to check how well your resume matches the job requirements.
        </p>
        
        <div className="grid gap-6">
          {/* Resume Upload Section */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Upload Resume</span>
              <span className="label-text-alt text-base-content/70">(PDF, DOCX, or TXT)</span>
            </label>
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <input
                type="file"
                ref={resumeInputRef}
                onChange={handleResumeSelect}
                className="file-input file-input-bordered file-input-primary w-full"
                accept=".pdf,.docx,.txt"
                disabled={isParsingFile}
              />
              {resume && !isParsingFile && (
                <div className="flex items-center mt-3 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Selected: {resume.name}</span>
                </div>
              )}
              {isParsingFile && (
                <div className="flex items-center gap-2 mt-3 text-primary">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="text-sm font-medium">Parsing resume content...</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Section */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Job Description</span>
              <div className="badge badge-primary badge-outline badge-sm">Required</div>
            </label>
            <div className="bg-base-100 rounded-box border border-base-300">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="textarea w-full border-none bg-transparent min-h-40 focus:outline-none"
                placeholder="Paste the job description here..."
              />
            </div>
            <label className="label mt-1">
              <span className="label-text-alt text-base-content/70">More detailed job descriptions lead to better analysis</span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="card-actions justify-between mt-2">
            <button
              onClick={resetResumeReview}
              className="btn btn-outline btn-neutral"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reset
            </button>
            <button
              onClick={analyzeResume}
              className="btn btn-primary"
              type="button"
              disabled={isAnalyzing || isParsingFile || !resume || !jobDescription.trim()}
            >
              {isAnalyzing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {atsScore !== null && atsAnalysis && (
          <div className="mt-8 pt-6 border-t border-base-300">
            <h3 className="font-bold text-xl text-base-content mb-6">Analysis Results</h3>

            <div className="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100 border border-base-300 mb-6">
              <div className="stat">
                <div className="stat-title text-base-content/70">ATS Score</div>
                <div className={`stat-value ${
                  atsScore >= 80 ? 'text-success' : 
                  atsScore >= 50 ? 'text-warning' : 
                  'text-error'
                }`}>
                  {atsScore}%
                </div>
                <div className="stat-desc mt-1">
                  {atsScore >= 80 ? (
                    <div className="flex items-center text-success">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Great match!
                    </div>
                  ) : atsScore >= 50 ? (
                    <div className="flex items-center text-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Could use improvement
                    </div>
                  ) : (
                    <div className="flex items-center text-error">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Needs significant changes
                    </div>
                  )}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title text-base-content/70">Keywords</div>
                <div className="stat-value text-primary">{atsAnalysis.matchedKeywords.length}</div>
                <div className="stat-desc">Matched keywords</div>
              </div>

              <div className="stat">
                <div className="stat-title text-base-content/70">Missing</div>
                <div className="stat-value text-secondary">{atsAnalysis.missingKeywords.length}</div>
                <div className="stat-desc">Keywords to add</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Matched Keywords */}
              <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
                <input type="checkbox" defaultChecked /> 
                <div className="collapse-title font-medium">
                  Matched Keywords ({atsAnalysis.matchedKeywords.length})
                </div>
                <div className="collapse-content"> 
                  <div className="flex flex-wrap gap-2 pt-2">
                    {atsAnalysis.matchedKeywords.map((keyword, index) => (
                      <span key={index} className="badge badge-success">{keyword}</span>
                    ))}
                    {atsAnalysis.matchedKeywords.length === 0 && (
                      <div className="text-base-content/70 text-sm italic">No matching keywords found</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
                <input type="checkbox" defaultChecked /> 
                <div className="collapse-title font-medium">
                  Missing Keywords ({atsAnalysis.missingKeywords.length})
                </div>
                <div className="collapse-content"> 
                  <div className="flex flex-wrap gap-2 pt-2">
                    {atsAnalysis.missingKeywords.slice(0, 15).map((keyword, index) => (
                      <span key={index} className="badge badge-error">{keyword}</span>
                    ))}
                    {atsAnalysis.missingKeywords.length > 15 && (
                      <span className="badge badge-neutral">
                        +{atsAnalysis.missingKeywords.length - 15} more
                      </span>
                    )}
                    {atsAnalysis.missingKeywords.length === 0 && (
                      <div className="text-success text-sm">No missing keywords - great job!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
              <h4 className="font-semibold text-lg mb-3">Improvement Suggestions</h4>
              <ul className="space-y-3">
                {atsAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="text-base-content">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Save Results Button */}
            <div className="flex flex-col items-center mt-8">
              <button
                onClick={saveResumeAnalysis}
                className={`btn ${savedReviewId ? 'btn-success' : 'btn-accent'} btn-wide`}
                disabled={isSavingResults || savedReviewId !== null}
              >
                {isSavingResults ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving Results...
                  </>
                ) : savedReviewId ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Results Saved
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    Save These Results
                  </>
                )}
              </button>

              <p className="text-sm text-base-content/70 mt-2">
                Save your analysis to view it later in your dashboard
              </p>
            </div>

            {/* Success Message */}
            {savedReviewId && (
              <div className="alert alert-success shadow-lg mt-6 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <span className="font-bold">Success!</span> Your resume analysis has been saved.
                  <div className="mt-1">
                    <button
                      onClick={() => router.push('/dashboard/resume-reviews')}
                      className="btn btn-sm btn-ghost text-success"
                    >
                      View all your resume reviews →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}