import { createClient } from '@/lib/supabase-server';
import LoginButton from '@/components/auth/login-button';
import UserProfile from '@/components/auth/user-profile';

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            University Review Platform
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Helping students make informed decisions about their education.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          {!session ? (
            <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h2>
              <UserProfile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
