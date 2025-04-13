'use client';

import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center gap-4">
        {user.user_metadata?.avatar_url && (
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
            <Image 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata.full_name || 'User'} 
              width={48} 
              height={48} 
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h3 className="font-bold">{user.user_metadata?.full_name || 'User'}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <button 
          onClick={handleSignOut} 
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}