'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

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
  slug?: string;
  // Add other fields as needed
}

interface UniversityDetailTabsProps {
  university: University;
  reviewStats: ReviewStats;
}

export default function UniversityDetailTabs({ university, reviewStats }: UniversityDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isReadMore, setIsReadMore] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };

    checkAuth();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="tabs tabs-boxed bg-base-200/50 p-1 rounded-full">
          <button 
            className={`tab tab-md transition-all duration-200 rounded-full ${activeTab === 'overview' ? 'tab-active bg-primary text-primary-foreground' : 'hover:bg-base-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab tab-md transition-all duration-200 rounded-full ${activeTab === 'academics' ? 'tab-active bg-primary text-primary-foreground' : 'hover:bg-base-300'} relative`}
            onClick={() => setActiveTab('academics')}
          >
            Academics
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
          </button>
          <button 
            className={`tab tab-md transition-all duration-200 rounded-full ${activeTab === 'campus' ? 'tab-active bg-primary text-primary-foreground' : 'hover:bg-base-300'}`}
            onClick={() => setActiveTab('campus')}
          >
            Campus Life
          </button>
          <button 
            className={`tab tab-md transition-all duration-200 rounded-full ${activeTab === 'careers' ? 'tab-active bg-primary text-primary-foreground' : 'hover:bg-base-300'} relative`}
            onClick={() => setActiveTab('careers')}
          >
            Career Outcomes
            <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      <div className="bg-base-100 rounded-xl border shadow-sm overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">About {university.name}</h2>
              <div className="badge badge-primary">Overview</div>
            </div>
            
            {university.description ? (
              <div className="prose max-w-none mb-8">
                <p className={isReadMore ? '' : 'line-clamp-3'}>{university.description}</p>
                {university.description.length > 300 && (
                  <button 
                    onClick={() => setIsReadMore(!isReadMore)}
                    className="text-primary hover:underline mt-2 flex items-center text-sm font-medium"
                  >
                    {isReadMore ? 'Show less' : 'Read more'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isReadMore ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="alert mb-8 bg-base-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p>We're still gathering detailed information about this university. Want to help?</p>
                  <button className="btn btn-sm btn-outline mt-2">Contribute Info</button>
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-semibold mb-4">Key Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-200 hover:shadow-md transition-shadow">
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
                  <div className="mt-2">
                    <progress className="progress progress-primary w-full" value={reviewStats.academicRating * 20} max="100"></progress>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 hover:shadow-md transition-shadow">
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
                  <div className="mt-2">
                    <progress className="progress progress-primary w-full" value={reviewStats.supportRating * 20} max="100"></progress>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 hover:shadow-md transition-shadow">
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
                  <div className="mt-2">
                    <progress className="progress progress-primary w-full" value={reviewStats.lifeRating * 20} max="100"></progress>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 hover:shadow-md transition-shadow">
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
                  <div className="mt-2">
                    <progress className="progress progress-primary w-full" value={reviewStats.valueRating * 20} max="100"></progress>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info bg-blue-50 border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-blue-700">Information Notice</h3>
                <div className="text-sm text-blue-600">
                  We're continuously updating our university profiles. If you notice any inaccuracies, please let us know.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Academic Programs</h2>
              <div className="badge badge-primary gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Key Focus Area</span>
              </div>
            </div>
            
            {university.programs && university.programs.length > 0 ? (
              <div className="space-y-4">
                {/* Program content would go here */}
                <p>Program information will be displayed here.</p>
              </div>
            ) : (
              <div className="alert mb-8 bg-base-200 flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Academic Programs</h3>
                  <p className="mb-3">We're still collecting information about academic programs at this university.</p>
                  <button className="btn btn-sm btn-primary">Add Program Info</button>
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-semibold mt-10 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Academic Ratings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-100 border hover:shadow-md transition-shadow">
                <div className="card-body">
                  <h4 className="card-title text-lg">Academic Quality</h4>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.academicRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.academicRating.toFixed(1)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm">Based on student reviews</p>
                      <progress className="progress progress-primary w-full" value={reviewStats.academicRating * 20} max="100"></progress>
                      <div className="text-xs text-muted-foreground">
                        Teaching quality, course content, and learning outcomes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 border hover:shadow-md transition-shadow">
                <div className="card-body">
                  <h4 className="card-title text-lg">Learning Resources</h4>
                  <div className="flex items-center gap-4">
                    <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "5rem" } as any}>
                      {reviewStats.facilitiesRating.toFixed(1)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm">Libraries, labs, and online resources</p>
                      <progress className="progress progress-primary w-full" value={reviewStats.facilitiesRating * 20} max="100"></progress>
                      <div className="text-xs text-muted-foreground">
                        Access to research materials, equipment, and digital platforms
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="divider my-8">Academic Information</div>
            
            <div className="p-6 bg-base-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Academic Strengths
              </h3>
              <p className="text-muted-foreground">Academic strengths information will be displayed here as it becomes available.</p>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-base-100 rounded-lg p-3 border-l-4 border-primary">
                  <div className="font-medium">Faculty Expertise</div>
                  <div className="text-sm text-muted-foreground">Information about faculty credentials and expertise</div>
                </div>
                <div className="bg-base-100 rounded-lg p-3 border-l-4 border-primary">
                  <div className="font-medium">Research Opportunities</div>
                  <div className="text-sm text-muted-foreground">Information about research opportunities for students</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Campus Life Tab */}
        {activeTab === 'campus' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Campus Life at {university.name}</h2>
              <div className="badge badge-secondary">Student Experience</div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2">
                <div className="prose max-w-none mb-6 bg-base-100 p-4 rounded-lg border shadow-sm">
                  <p>Information about campus life, housing options, student activities, and facilities will be displayed here.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="card bg-base-100 border hover:shadow-md transition-shadow">
                    <div className="card-body">
                      <h3 className="card-title flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        Campus Experience
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="radial-progress text-primary" style={{ "--value": reviewStats.lifeRating * 20, "--size": "5rem" } as any}>
                          {reviewStats.lifeRating.toFixed(1)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-sm">Based on student reviews</p>
                          <progress className="progress progress-primary w-full" value={reviewStats.lifeRating * 20} max="100"></progress>
                          <div className="text-xs text-muted-foreground">
                            Student activities, social events, and community atmosphere
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-base-100 border hover:shadow-md transition-shadow">
                    <div className="card-body">
                      <h3 className="card-title flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Campus Facilities
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="radial-progress text-primary" style={{ "--value": reviewStats.facilitiesRating * 20, "--size": "5rem" } as any}>
                          {reviewStats.facilitiesRating.toFixed(1)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-sm">Buildings, amenities, and technology</p>
                          <progress className="progress progress-primary w-full" value={reviewStats.facilitiesRating * 20} max="100"></progress>
                          <div className="text-xs text-muted-foreground">
                            Libraries, labs, sports facilities, and student spaces
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-1">
                <div className="bg-base-100 rounded-lg border p-4 h-full">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Student Activities
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-sm">Student Clubs</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="text-sm">Sports Teams</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <div className="text-sm">Events & Festivals</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-sm">Volunteer Opportunities</div>
                    </div>
                  </div>
                  
                  <div className="divider my-4">Housing</div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Information about on-campus and off-campus housing options will be available soon.
                  </p>
                  
                  <div className="text-xs text-center text-muted-foreground mt-6">
                    Information provided by students and the university
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Career Outcomes Tab */}
        {activeTab === 'careers' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Career Outcomes</h2>
              <div className="badge badge-accent gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Coming Soon</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="prose max-w-none mb-6 bg-base-100 p-4 rounded-lg border shadow-sm">
                  <p>Detailed information about career outcomes for graduates will be available soon.</p>
                </div>
                
                <div className="card bg-base-100 border hover:shadow-md transition-shadow mb-6">
                  <div className="card-body">
                    <h3 className="card-title flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Career Prospects
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="radial-progress text-accent" style={{ "--value": reviewStats.careerRating * 20, "--size": "5rem" } as any}>
                        {reviewStats.careerRating.toFixed(1)}
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-sm">Based on student reviews</p>
                        <progress className="progress progress-accent w-full" value={reviewStats.careerRating * 20} max="100"></progress>
                        <div className="text-xs text-muted-foreground">
                          Job placement, career services, and alumni networks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Upcoming Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-base-100 p-3 rounded-lg border flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Employment Statistics</div>
                        <div className="text-xs text-muted-foreground">Data on graduate employment rates and industries</div>
                      </div>
                    </div>
                    <div className="bg-base-100 p-3 rounded-lg border flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Salary Information</div>
                        <div className="text-xs text-muted-foreground">Average starting salaries by degree program</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-base-100 rounded-lg border p-4 sticky top-20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Career Services
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm">Resume Workshops</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm">Career Fairs</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="text-sm">Alumni Network</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-sm">Internship Placement</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground mt-6">
                    Information about career services is being collected
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}