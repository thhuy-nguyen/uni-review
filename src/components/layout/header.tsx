'use client';

import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reviewsMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    }
    checkSession();

    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (reviewsMenuRef.current && !reviewsMenuRef.current.contains(event.target as Node)) {
        setIsReviewsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold flex items-center gap-2">
              <span className="text-primary font-bold">UniReview</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/universities"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Universities
            </Link>
            <div ref={reviewsMenuRef} className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                aria-expanded={isReviewsOpen}
              >
                <span>Reviews</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${isReviewsOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isReviewsOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 rounded-md border bg-background shadow-md">
                  <div className="p-2">
                    <Link 
                      href="/reviews/knowledge" 
                      className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      Knowledge Reviews
                    </Link>
                    <Link 
                      href="/reviews/career" 
                      className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      Career Reviews
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>

          {/* Login/User profile */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span>U</span>
                  </div>
                </button>
                {isMenuOpen && (
                  <div ref={menuRef} className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-md">
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path d="M18 6 6 18 M6 6 18 18" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container p-4 space-y-3">
            <Link
              href="/universities"
              className="block px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Universities
            </Link>
            <div>
              <button
                className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsReviewsOpen(!isReviewsOpen)}
              >
                <span>Reviews</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${isReviewsOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isReviewsOpen && (
                <div className="ml-4 mt-1 space-y-2">
                  <Link
                    href="/reviews/knowledge"
                    className="block px-2 py-1.5 text-sm transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Knowledge Reviews
                  </Link>
                  <Link
                    href="/reviews/career"
                    className="block px-2 py-1.5 text-sm transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Reviews
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="block px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <div className="pt-4 border-t">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="block w-full text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}