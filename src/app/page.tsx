'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('find-reviews');

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  UniReview: The Truth About Universities
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Find out if a degree is truly worth your time and money with honest reviews 
                  from real students and alumni.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  href="/search" 
                  className="btn btn-primary"
                >
                  Find Universities
                </Link>
                <Link 
                  href="/login" 
                  className="btn btn-outline"
                >
                  Write a Review
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Use UniReview?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get the information you need to make the right choice for your education
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Knowledge-Focused Reviews</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Discover if your program truly provides valuable knowledge or if it's just a credential mill.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Career Preparation</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Learn if graduates are actually landing jobs in their field with reviews from industry professionals.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Verified Reviews</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Our legitimacy section is exclusive to reviewers with verified .edu email addresses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Simple steps to find the right university for you
                </p>
              </div>
            </div>
            
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col justify-center space-y-8">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold">Search for universities</h3>
                      <p className="text-sm text-muted-foreground">
                        Find schools based on location, program, or specific criteria that matter to you.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold">Read reviews</h3>
                      <p className="text-sm text-muted-foreground">
                        Get insights from current students and alumni about academics, campus life, and career prospects.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-8">
                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold">Make informed decisions</h3>
                      <p className="text-sm text-muted-foreground">
                        Use real data and authentic experiences to choose the right educational path.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold">Share your experience</h3>
                      <p className="text-sm text-muted-foreground">
                        Help future students by contributing your own review once you've attended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to find your perfect university?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Start exploring honest reviews from real students today.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  href="/search" 
                  className="btn btn-primary"
                >
                  Explore Universities
                </Link>
                <Link 
                  href="/login" 
                  className="btn btn-outline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
