import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground mb-4">
          Last Updated: April 13, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
        <p>
          By accessing or using UniReview, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
        <p>
          UniReview provides a platform for users to share, read, and discuss reviews and information about universities, colleges, and academic programs.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <p>
          To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <p className="mt-4">
          You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
        <p>
          Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post, including its legality, reliability, and appropriateness.
        </p>
        <p className="mt-4">
          By posting content on UniReview, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Prohibited Activities</h2>
        <p>
          You may not engage in any of the following prohibited activities:
        </p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>Posting false, misleading, or defamatory content</li>
          <li>Harassing, threatening, or intimidating other users</li>
          <li>Using the service for any illegal purpose</li>
          <li>Attempting to compromise the security of the platform</li>
          <li>Impersonating another person or entity</li>
          <li>Interfering with the proper working of the service</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
        <p>
          The service and its original content, features, and functionality are owned by UniReview and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
        <p>
          In no event shall UniReview, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-4">
          terms@unireview.com
        </p>
      </div>
      
      <div className="mt-12 border-t pt-6">
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
}