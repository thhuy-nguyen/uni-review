'use client';

import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { themeChange } from 'theme-change';
import Image from 'next/image';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [userData, setUserData] = useState<{ email: string; avatar_url: string | null } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reviewsMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initialize theme-change
    themeChange(false);
    
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        setUserData({
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url || null
        });
      }
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

  // Get the first letter of the user's email for the avatar fallback
  const getInitial = () => {
    return userData?.email ? userData.email[0].toUpperCase() : 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                    {userData?.avatar_url ? (
                      <Image 
                        src={userData.avatar_url} 
                        alt="User avatar" 
                        width={32} 
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>{getInitial()}</span>
                    )}
                  </div>
                </div>
                <div tabIndex={0} className="dropdown-content z-[60] menu p-2 shadow bg-base-100 rounded-box w-52">
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
                    className="btn btn-ghost w-full justify-start text-left"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary"
              >
                Sign in
              </Link>
            )}
            
            {/* Theme toggle - moved next to sign in button */}
            <label className="flex cursor-pointer gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input type="checkbox" value="synthwave" className="toggle theme-controller" data-toggle-theme="dark,light" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </label>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="btn btn-square btn-ghost"
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
          <div className="container mx-auto p-4 space-y-3 max-w-7xl">
            <Link
              href="/universities"
              className="block px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Universities
            </Link>
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
                    className="btn btn-ghost w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="btn btn-ghost w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-ghost w-full justify-start"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="btn btn-primary btn-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
              )}
              
              {/* Mobile theme toggle */}
              <div className="mt-4 flex items-center">
                <label className="flex cursor-pointer gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path
                      d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                  <input type="checkbox" value="synthwave" className="toggle theme-controller" data-toggle-theme="dark,light" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
