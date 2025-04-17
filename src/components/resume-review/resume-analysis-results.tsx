'use client';

import { useRouter } from 'next/navigation';

// Define proper interfaces for our analysis data
export interface ATSAnalysisResult {
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  score: number;
  sectionScores?: {
    skills: number;
    experience: number;
    education: number;
    overall: number;
  };
  keywordImportance?: Record<string, number>; // 1-10 rating of importance
  actionVerbs?: {
    strong: string[];
    weak: string[];
  };
  readabilityScore?: number; // 0-100 score for resume readability
  contentGaps?: string[]; // Major content areas missing from resume
  industryKeywords?: string[]; // Industry-specific keywords that might help
}

interface ResumeAnalysisResultsProps {
  atsScore: number;
  atsAnalysis: ATSAnalysisResult;
  savedReviewId: string | null;
  isSavingResults: boolean;
  onSaveResults: () => void;
  resumeText: string;
}

export default function ResumeAnalysisResults({
  atsScore,
  atsAnalysis,
  savedReviewId,
  isSavingResults,
  onSaveResults,
  resumeText
}: ResumeAnalysisResultsProps) {
  const router = useRouter();

  return (
    <div className="mt-8 pt-6 border-t border-base-300">
      <h3 className="font-bold text-xl text-base-content mb-6">Analysis Results</h3>

      {/* Main Stats */}
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
        
        {atsAnalysis.readabilityScore !== undefined && (
          <div className="stat">
            <div className="stat-title text-base-content/70">Readability</div>
            <div className={`stat-value ${
              atsAnalysis.readabilityScore >= 80 ? 'text-success' : 
              atsAnalysis.readabilityScore >= 60 ? 'text-warning' : 
              'text-error'
            }`}>
              {atsAnalysis.readabilityScore}%
            </div>
            <div className="stat-desc">For both ATS & humans</div>
          </div>
        )}
      </div>
      
      {/* Section Score Analysis */}
      {atsAnalysis.sectionScores && (
        <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
          <h4 className="font-semibold text-lg mb-4">Section Score Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Skills Match</span>
                <span className={`text-sm ${
                  atsAnalysis.sectionScores.skills >= 80 ? 'text-success' : 
                  atsAnalysis.sectionScores.skills >= 50 ? 'text-warning' : 
                  'text-error'
                }`}>
                  {atsAnalysis.sectionScores.skills}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    atsAnalysis.sectionScores.skills >= 80 ? 'bg-success' : 
                    atsAnalysis.sectionScores.skills >= 50 ? 'bg-warning' : 
                    'bg-error'
                  }`}
                  style={{ width: `${atsAnalysis.sectionScores.skills}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Experience Match</span>
                <span className={`text-sm ${
                  atsAnalysis.sectionScores.experience >= 80 ? 'text-success' : 
                  atsAnalysis.sectionScores.experience >= 50 ? 'text-warning' : 
                  'text-error'
                }`}>
                  {atsAnalysis.sectionScores.experience}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    atsAnalysis.sectionScores.experience >= 80 ? 'bg-success' : 
                    atsAnalysis.sectionScores.experience >= 50 ? 'bg-warning' : 
                    'bg-error'
                  }`}
                  style={{ width: `${atsAnalysis.sectionScores.experience}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Education Match</span>
                <span className={`text-sm ${
                  atsAnalysis.sectionScores.education >= 80 ? 'text-success' : 
                  atsAnalysis.sectionScores.education >= 50 ? 'text-warning' : 
                  'text-error'
                }`}>
                  {atsAnalysis.sectionScores.education}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    atsAnalysis.sectionScores.education >= 80 ? 'bg-success' : 
                    atsAnalysis.sectionScores.education >= 50 ? 'bg-warning' : 
                    'bg-error'
                  }`}
                  style={{ width: `${atsAnalysis.sectionScores.education}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Content Match</span>
                <span className={`text-sm ${
                  atsAnalysis.sectionScores.overall >= 80 ? 'text-success' : 
                  atsAnalysis.sectionScores.overall >= 50 ? 'text-warning' : 
                  'text-error'
                }`}>
                  {atsAnalysis.sectionScores.overall}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    atsAnalysis.sectionScores.overall >= 80 ? 'bg-success' : 
                    atsAnalysis.sectionScores.overall >= 50 ? 'bg-warning' : 
                    'bg-error'
                  }`}
                  style={{ width: `${atsAnalysis.sectionScores.overall}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-base-content/70">
            <p className="mb-1"><span className="font-semibold">What this means:</span> These scores show how well each section of your resume matches the job description.</p>
            <p>Focus your improvements on the sections with lower scores to increase your chances of getting past ATS filters.</p>
          </div>
        </div>
      )}

      {/* Keywords Analysis */}
      <h4 className="font-semibold text-lg mb-4">Keywords Analysis</h4>
      
      {/* Matched Keywords */}
      <div className="mb-4">
        <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
          <input type="checkbox" id="matched-keywords-collapse" className="collapse-checkbox" defaultChecked /> 
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
      </div>

      {/* Missing Keywords */}
      <div className="mb-6">
        <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
          <input type="checkbox" id="missing-keywords-collapse" className="collapse-checkbox" defaultChecked /> 
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
      
      {/* Keyword Importance Analysis */}
      {atsAnalysis.keywordImportance && Object.keys(atsAnalysis.keywordImportance).length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
          <h4 className="font-semibold text-lg mb-4">Keyword Importance Analysis</h4>
          <p className="text-sm text-base-content/70 mb-4">
            These keywords are ranked by importance in the job description. Focus on including the high-importance keywords 
            that are currently missing from your resume.
          </p>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Importance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(atsAnalysis.keywordImportance)
                  .sort(([, importanceA], [, importanceB]) => importanceB - importanceA)
                  .slice(0, 10)
                  .map(([keyword, importance]) => (
                    <tr key={keyword}>
                      <td className="font-medium">{keyword}</td>
                      <td>
                        <div className="flex items-center">
                          <div className="rating rating-xs rating-half">
                            {[...Array(10)].map((_, i) => (
                              <input 
                                key={i} 
                                type="radio" 
                                name={`rating-${keyword}`} 
                                className={`bg-primary mask ${i < importance ? 'mask-star-2 opacity-100' : 'mask-star-2 opacity-30'}`} 
                                disabled
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs">{importance}/10</span>
                        </div>
                      </td>
                      <td>
                        {atsAnalysis.matchedKeywords.includes(keyword) ? (
                          <span className="badge badge-success badge-sm">Found</span>
                        ) : (
                          <span className="badge badge-error badge-sm">Missing</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Verb Analysis */}
      {atsAnalysis.actionVerbs && (
        <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
          <h4 className="font-semibold text-lg mb-3">Action Verb Analysis</h4>
          <p className="text-sm text-base-content/70 mb-4">
            Strong action verbs make your resume more impactful and can help you stand out from other candidates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strong Verbs Used
              </h5>
              <div className="flex flex-wrap gap-2">
                {atsAnalysis.actionVerbs.strong && atsAnalysis.actionVerbs.strong.length > 0 ? (
                  atsAnalysis.actionVerbs.strong.map((verb, idx) => (
                    <span key={idx} className="badge badge-success">{verb}</span>
                  ))
                ) : (
                  <span className="text-sm text-base-content/70">No strong action verbs detected</span>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Weak Verbs to Replace
              </h5>
              <div className="flex flex-wrap gap-2">
                {atsAnalysis.actionVerbs.weak && atsAnalysis.actionVerbs.weak.length > 0 ? (
                  atsAnalysis.actionVerbs.weak.map((verb, idx) => (
                    <span key={idx} className="badge badge-outline badge-error">{verb}</span>
                  ))
                ) : (
                  <span className="text-sm text-success">No weak action verbs detected - great job!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Gap Analysis */}
      {atsAnalysis.contentGaps && atsAnalysis.contentGaps.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
          <h4 className="font-semibold text-lg mb-3">Content Gap Analysis</h4>
          <p className="text-sm text-base-content/70 mb-4">
            These are important content areas that appear to be missing or underdeveloped in your resume.
            Adding these sections or details could significantly improve your match with this job.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {atsAnalysis.contentGaps.map((gap, index) => (
              <div key={index} className="alert alert-warning shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Industry-Specific Keywords */}
      {atsAnalysis.industryKeywords && atsAnalysis.industryKeywords.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-box p-6 mb-6">
          <h4 className="font-semibold text-lg mb-3">Industry-Specific Keywords</h4>
          <p className="text-sm text-base-content/70 mb-4">
            These industry-specific keywords are relevant to the role but might be missing from your resume.
            Consider incorporating them where appropriate.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {atsAnalysis.industryKeywords.map((keyword, idx) => (
              <div key={idx} className="badge badge-info badge-lg">{keyword}</div>
            ))}
          </div>
        </div>
      )}

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
          onClick={onSaveResults}
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
  );
}