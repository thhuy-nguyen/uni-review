import './globals.css';
import type { Metadata } from 'next';
import PageLayout from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'UniReview',
  description: 'Find out if a degree is truly worth your time and money with honest reviews from real students and alumni.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen bg-background transition-colors duration-300">
        <PageLayout>
          {children}
        </PageLayout>
      </body>
    </html>
  );
}
