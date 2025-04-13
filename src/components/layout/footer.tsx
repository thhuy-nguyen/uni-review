import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">UniReview</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Helping students make informed decisions about their education through honest reviews.
            </p>
          </div>
          
          {/* Navigation column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/universities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Universities
              </Link>
              <Link href="/reviews/knowledge" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Knowledge Reviews
              </Link>
              <Link href="/reviews/career" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Career Reviews
              </Link>
            </nav>
          </div>
          
          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of use
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy policy
              </Link>
              <Link href="/cookie" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie policy
              </Link>
            </nav>
          </div>
          
          {/* Company column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Company</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About us
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>
          
          {/* Newsletter column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Newsletter</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter your email to get updates
              </p>
              <form className="space-y-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button type="submit" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright section */}
      <div className="border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UniReview. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://github.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://linkedin.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}