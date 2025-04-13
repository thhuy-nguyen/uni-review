import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground mb-4">
          Last Updated: April 13, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          At UniReview, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>
          We collect several types of information from and about users of our website, including:
        </p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>Personal information such as name, email address, and academic information provided during registration or when submitting content</li>
          <li>Usage data including how you interact with our website, pages visited, time spent on pages</li>
          <li>Device information such as IP address, browser type, operating system</li>
          <li>Cookies and similar tracking technologies to enhance your experience on our site</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>To provide, maintain, and improve our services</li>
          <li>To create and manage your account</li>
          <li>To respond to your requests or inquiries</li>
          <li>To send you administrative messages, updates, and security alerts</li>
          <li>To personalize your experience and deliver content relevant to your interests</li>
          <li>To analyze usage patterns and improve our website</li>
          <li>To detect, prevent, and address technical issues or fraudulent activities</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclosure of Your Information</h2>
        <p>
          We may disclose your personal information:
        </p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>To comply with legal obligations</li>
          <li>To protect and defend our rights or property</li>
          <li>To prevent or investigate possible wrongdoing in connection with our service</li>
          <li>To protect the personal safety of users of our service or the public</li>
          <li>With your consent or at your direction</li>
          <li>To our service providers who perform services on our behalf</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, such as:
        </p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate or incomplete information</li>
          <li>The right to deletion of your personal information in certain circumstances</li>
          <li>The right to restrict or object to processing of your personal information</li>
          <li>The right to data portability</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
        <p>
          Our service is not intended for individuals under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mt-4">
          privacy@unireview.com
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