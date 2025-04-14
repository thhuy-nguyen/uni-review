'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Conditionally render header for non-auth pages */}
      {!isAuthPage && <Header />}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}