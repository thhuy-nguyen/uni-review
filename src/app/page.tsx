'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('find-reviews');
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  useEffect(() => {
    // Detect the current theme for proper styling
    const detectTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(theme);
    };

    // Initial detection
    detectTheme();

    // Set up a mutation observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background decoration - theme aware */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-50"></div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
              The Platform for Honest University Reviews
            </div>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">UniReview</span>
                <span className="block mt-1 text-foreground">The Truth About Universities</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Find out if a degree is truly worth your time and money with honest reviews 
                from real students and alumni.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-8 w-full max-w-md">
              <Link 
                href="/search" 
                className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto"
              >
                Find Universities
              </Link>
              <Link 
                href="/login" 
                className="btn bg-card dark:bg-gray-800 text-card-foreground dark:text-white border-2 border-border font-semibold px-6 py-3 rounded-lg hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              >
                Write a Review
              </Link>
            </div>
            
            {/* Stats section */}
            <div className="w-full max-w-4xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 py-8 px-4 md:px-10 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-xl shadow-gray-100/20 dark:shadow-gray-900/20">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-primary mb-1">1,200+</span>
                <span className="text-sm text-muted-foreground">Universities</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-primary mb-1">25,000+</span>
                <span className="text-sm text-muted-foreground">Reviews</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-primary mb-1">95%</span>
                <span className="text-sm text-muted-foreground">Verified Users</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-primary mb-1">40k+</span>
                <span className="text-sm text-muted-foreground">Active Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Review Banner */}
      <section className="w-full py-14 bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            </svg>
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </div>
        </div>
      
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 md:w-2/3">
              <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                NEW FEATURE
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Resume ATS Compatibility Checker</h2>
              <p className="text-white/90 max-w-[600px] text-base md:text-lg">
                Upload your resume and job description to instantly check if you'll pass the ATS filters. 
                Get personalized recommendations to improve your chances of landing that interview.
              </p>
            </div>
            <div>
              <Link 
                href="/universities/new/review" 
                className="btn bg-white text-primary hover:bg-white/90 font-medium px-6 py-3 rounded-lg flex items-center gap-2 hover:gap-3 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                <span>Check My Resume</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-28 bg-background border-y border-border">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
              KEY BENEFITS
            </div>
            <div className="space-y-2 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Why Use UniReview?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Get the information you need to make the right choice for your education
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group flex flex-col h-full space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Knowledge-Focused Reviews</h3>
                <p className="mt-3 text-muted-foreground">
                  Discover if your program truly provides valuable knowledge or if it's just a credential mill.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group flex flex-col h-full space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Career Preparation</h3>
                <p className="mt-3 text-muted-foreground">
                  Learn if graduates are actually landing jobs in their field with reviews from industry professionals.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group flex flex-col h-full space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Verified Reviews</h3>
                <p className="mt-3 text-muted-foreground">
                  Our legitimacy section is exclusive to reviewers with verified .edu email addresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Review Feature Section */}
      <section className="w-full py-20 md:py-28 bg-card dark:bg-gray-800 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Premium Feature
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">ATS Resume Review</h2>
              <p className="text-muted-foreground text-lg">
                Did you know that over 75% of resumes are rejected by Applicant Tracking Systems 
                before a human ever sees them? Our AI-powered ATS checker helps you:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success-light p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-success">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-card-foreground">Match keywords from job descriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success-light p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-success">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-card-foreground">Identify missing skills that employers want</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success-light p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-success">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-card-foreground">Get specific suggestions to improve your resume</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success-light p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-success">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-card-foreground">Track improvements over time</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/universities/new/review" className="btn inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <span>Try Resume Review Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -right-20 -top-16 w-72 h-72 bg-primary/5 rounded-full"></div>
              <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-secondary/5 rounded-full"></div>
              
              {/* Card */}
              <div className="bg-card dark:bg-gray-900 rounded-2xl shadow-2xl border border-border p-8 relative z-10 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-indigo-900/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2"></path>
                        <path d="M18 8h4v4h-4z"></path>
                        <path d="m15 3-4 4-4-4"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Resume Analysis</h3>
                  </div>
                  <div className="bg-success-light text-success px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    85% Match
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-foreground">ATS Compatibility</p>
                      <span className="text-sm font-medium text-success">85%</span>
                    </div>
                    <div className="w-full bg-muted dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-success to-success h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-3 text-foreground">Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-success-light border border-success/20 text-success text-xs font-medium rounded-full">javascript</span>
                      <span className="px-3 py-1.5 bg-success-light border border-success/20 text-success text-xs font-medium rounded-full">react</span>
                      <span className="px-3 py-1.5 bg-success-light border border-success/20 text-success text-xs font-medium rounded-full">nextjs</span>
                      <span className="px-3 py-1.5 bg-success-light border border-success/20 text-success text-xs font-medium rounded-full">typescript</span>
                      <span className="px-3 py-1.5 bg-success-light border border-success/20 text-success text-xs font-medium rounded-full">frontend</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-3 text-foreground">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-danger-light border border-danger/20 text-danger text-xs font-medium rounded-full">redux</span>
                      <span className="px-3 py-1.5 bg-danger-light border border-danger/20 text-danger text-xs font-medium rounded-full">graphql</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-400 dark:bg-blue-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                        <div className="w-8 h-8 rounded-full bg-purple-400 dark:bg-purple-500 flex items-center justify-center text-white text-xs font-bold">TW</div>
                        <div className="w-8 h-8 rounded-full bg-pink-400 dark:bg-pink-500 flex items-center justify-center text-white text-xs font-bold">RK</div>
                      </div>
                      <span className="text-xs text-muted-foreground">34 people used this today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 md:py-28 bg-background border-y border-border">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
              SIMPLE PROCESS
            </div>
            <div className="space-y-2 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Simple steps to find the right university for you
              </p>
            </div>
          </div>
          
          <div className="mx-auto mt-12 max-w-6xl relative">
            {/* Connect line */}
            <div className="hidden md:block absolute h-0.5 bg-border top-16 left-[20%] right-[20%] z-0"></div>
            
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center relative">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10 mb-5">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-foreground">Search universities</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Find schools based on location, program, or specific criteria that matter to you.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center relative">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10 mb-5">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-foreground">Read reviews</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Get insights from current students and alumni about academics, campus life, and career prospects.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center relative">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10 mb-5">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-foreground">Make decisions</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Use real data and authentic experiences to choose the right educational path.
                </p>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center relative">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10 mb-5">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-foreground">Share experience</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Help future students by contributing your own review once you've attended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.15] to-secondary/[0.03] -z-10"></div>
        <div className="absolute -right-[10%] top-0 w-[40%] aspect-square bg-primary/[0.03] rounded-full -z-10"></div>
        <div className="absolute -left-[10%] bottom-0 w-[40%] aspect-square bg-secondary/[0.03] rounded-full -z-10"></div>
        
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center space-y-8 text-center bg-card rounded-3xl shadow-xl p-10 md:p-16 border border-border">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Ready to find your perfect university?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                Start exploring honest reviews from real students today.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/search" 
                className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                Explore Universities
              </Link>
              <Link 
                href="/login" 
                className="btn bg-card text-card-foreground dark:bg-gray-700 dark:text-white border-2 border-border font-semibold px-6 py-3 rounded-lg hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
