import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Authentication Error</h2>
        <p className="text-gray-700 mb-6">
          There was a problem signing you in. This could be due to:
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-700">
          <li>An expired or invalid session</li>
          <li>Denied permissions for Google sign-in</li>
          <li>An issue with your Supabase configuration</li>
        </ul>
        <div className="flex justify-center">
          <Link 
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}