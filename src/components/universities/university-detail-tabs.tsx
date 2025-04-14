'use client';

import { useState } from 'react';

interface ReviewStats {
  academicRating: number;
  facilitiesRating: number;
  supportRating: number;
  careerRating: number;
  lifeRating: number;
  valueRating: number;
}

interface University {
  id: string;
  name: string;
  description?: string;
  programs?: any[];
  // Add other fields as needed
}

interface UniversityDetailTabsProps {
  university: University;
  reviewStats: ReviewStats;
}

export default function UniversityDetailTabs({ university, reviewStats }: UniversityDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <div className="tabs tabs-bordered mb-6">
        <button 
          className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'academics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('academics')}
        >
          Academics
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'campus' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('campus')}
        >
          Campus Life
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'careers' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('careers')}
        >
          Career Outcomes
        </button>
      </div>
      
      <div className="p-6 border rounded-lg bg-base-100">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">About {university.name}</h2>
            
            {university.description ? (
              <div className="prose max-w-none mb-8">
                <p>{university.description}</p>
              </div>
            ) : (
              <div className="alert mb-8">
                <p>We're still gathering detailed information about this university. Want to help?</p>
                <button className="btn btn-sm btn-outline ml-2">Contribute Info</button>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="card-title text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Academic Excellence
                  </h4>
                  <p className="text-sm">
                    {reviewStats.academicRating > 4 
                      ? `Students consistently rate ${university.name}'s academic quality highly at ${reviewStats.academicRating.toFixed(1)}/5.` 
                      : reviewStats.academicRating > 0 
                        ? `Students rate the academic quality at ${reviewStats.academicRating.toFixed(1)}/5.`
                        : 'Help future students by rating the academic quality.'}
                  </p>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="card-title text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Student Support
                  </h4>
                  <p className="text-sm">
                    {reviewStats.supportRating > 4 
                      ? `Excellent student support services rated ${reviewStats.supportRating.toFixed(1)}/5 by students.` 
                      : reviewStats.supportRating > 0 
                        ? `Student support services are rated ${reviewStats.supportRating.toFixed(1)}/5.`
                        : 'No ratings yet for student support services.'}
                  </p>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="card-title text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Campus Life
                  </h4>
                  <p className="text-sm">
                    {reviewStats.lifeRating > 4 
                      ? `Exceptional campus experience rated ${reviewStats.lifeRating.toFixed(1)}/5 by students.` 
                      : reviewStats.lifeRating > 0 
                        ? `Campus life is rated ${reviewStats.lifeRating.toFixed(1)}/5 by students.`
                        : 'No ratings yet for campus life experience.'}
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="card-title text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Value for Money
                  </h4>
                  <p className="text-sm">
                    {reviewStats.valueRating > 4 
                      ? `Students find exceptional value for their investment, rated ${reviewStats.valueRating.toFixed(1)}/5.` 
                      : reviewStats.valueRating > 0 
                        ? `Value for money is rated ${reviewStats.valueRating.toFixed(1)}/5 by students.`
                        : 'No value for money ratings available yet.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Information Notice</h3>
                <div className="text-sm">
                  We're continuously updating our university profiles. If you notice any inaccuracies, please let us know.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Academic Programs</h2>
            
            {university.programs && university.programs.length > 0 ? (
              <div className="space-y-4">
                {/* Program content would go here */}
                <p>Program information will be displayed here.</p>
              </div>
            ) : (
              <div className="alert mb-8">
                <p>We're still collecting information about academic programs at this university.</p>
                <button className="btn btn-sm btn-outline ml-2">Add Program Info</button>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mt-8 mb-4">Academic Ratings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title text-lg">Academic Quality</h4>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.academicRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.academicRating.toFixed(1)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Based on student reviews</p>
                      <progress className="progress progress-primary w-56" value={reviewStats.academicRating * 20} max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title text-lg">Learning Resources</h4>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.facilitiesRating.toFixed(1)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Libraries, labs, and online resources</p>
                      <progress className="progress progress-primary w-56" value={reviewStats.facilitiesRating * 20} max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Academic Strengths</h3>
              <p>Academic strengths information will be displayed here as it becomes available.</p>
            </div>
          </div>
        )}
        
        {/* Campus Life Tab */}
        {activeTab === 'campus' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Campus Life at {university.name}</h2>
            
            <div className="prose max-w-none mb-8">
              <p>Information about campus life, housing options, student activities, and facilities will be displayed here.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">Campus Experience</h3>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.lifeRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.lifeRating.toFixed(1)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Based on student reviews</p>
                      <progress className="progress progress-primary w-56" value={reviewStats.lifeRating * 20} max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">Campus Facilities</h3>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.facilitiesRating.toFixed(1)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Buildings, amenities, and technology</p>
                      <progress className="progress progress-primary w-56" value={reviewStats.facilitiesRating * 20} max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Campus Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="aspect-video bg-base-200 flex items-center justify-center rounded-lg">
                  <span className="text-sm text-muted-foreground">No photos yet</span>
                </div>
                <div className="aspect-video bg-base-200 flex items-center justify-center rounded-lg">
                  <span className="text-sm text-muted-foreground">No photos yet</span>
                </div>
                <div className="aspect-video bg-base-200 flex items-center justify-center rounded-lg">
                  <span className="text-sm text-muted-foreground">No photos yet</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-outline btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Photos
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Career Outcomes Tab */}
        {activeTab === 'careers' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Career Outcomes</h2>
            
            <div className="prose max-w-none mb-8">
              <p>Information about graduate employment rates, average salaries, and career services will be displayed here.</p>
            </div>
            
            <div className="card bg-base-200 mb-8">
              <div className="card-body">
                <h3 className="card-title">Career Prospects Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="radial-progress text-primary" style={{ "--value": reviewStats.careerRating * 20, "--size": "5rem" } as any}>
                    {reviewStats.careerRating.toFixed(1)}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Based on student and alumni reviews</p>
                    <progress className="progress progress-primary w-56" value={reviewStats.careerRating * 20} max="100"></progress>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="alert mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 stroke-info">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Career Data</h3>
                <div className="text-sm">
                  We're currently collecting detailed career outcome data for graduates of this university.
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Alumni Insights</h3>
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground mb-4">No alumni insights available yet</p>
              <button className="btn btn-outline btn-sm">Share Your Experience</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}