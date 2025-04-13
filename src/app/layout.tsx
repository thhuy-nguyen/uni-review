import './globals.css';
import type { Metadata } from 'next';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
