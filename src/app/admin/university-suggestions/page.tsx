import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'University Suggestions | Admin',
  description: 'Review and manage university suggestions',
};

interface UniversitySuggestion {
  id: string;
  name: string;
  city: string | null;
  country: {
    id: string;
    name: string;
    code: string;
  };
  website: string | null;
  submitter_email: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
}

// Server component to fetch and display university suggestions
export default async function AdminUniversitySuggestionsPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated and has admin role
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login?redirectTo=/admin/university-suggestions');
  }
  
  // Verify user has admin role
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id);
  
  const isAdmin = userRoles?.some(r => r.role === 'admin');
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6 text-base-content/70">
            You don't have permission to view this page. Only administrators can access
            the university suggestions dashboard.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Fetch all university suggestions with country info
  const { data: suggestions, error } = await supabase
    .from('university_suggestions')
    .select(`
      *,
      country:country_id (
        id,
        name,
        code
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching suggestions:', error);
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">University Suggestions</h1>
        <div className="alert alert-error">
          <span>Error loading suggestions: {error.message}</span>
        </div>
      </div>
    );
  }
  
  // Group suggestions by status
  const pending = suggestions.filter(s => s.status === 'pending');
  const approved = suggestions.filter(s => s.status === 'approved');
  const rejected = suggestions.filter(s => s.status === 'rejected');
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">University Suggestions</h1>
        <p className="text-base-content/70">
          Review and manage university suggestions submitted by users.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-base-100 rounded-xl border p-6 text-center">
          <div className="stat-value text-primary">{pending.length}</div>
          <div className="stat-title">Pending</div>
        </div>
        <div className="bg-base-100 rounded-xl border p-6 text-center">
          <div className="stat-value text-success">{approved.length}</div>
          <div className="stat-title">Approved</div>
        </div>
        <div className="bg-base-100 rounded-xl border p-6 text-center">
          <div className="stat-value text-error">{rejected.length}</div>
          <div className="stat-title">Rejected</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        <a className="tab tab-bordered tab-active" data-tab="pending">
          Pending ({pending.length})
        </a>
        <a className="tab tab-bordered" data-tab="approved">
          Approved ({approved.length})
        </a>
        <a className="tab tab-bordered" data-tab="rejected">
          Rejected ({rejected.length})
        </a>
      </div>
      
      {/* Suggestions Table */}
      <div className="bg-base-100 rounded-xl border shadow-sm overflow-hidden">
        {pending.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-base-content/70">No pending suggestions to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Location</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((suggestion: UniversitySuggestion) => (
                  <tr key={suggestion.id}>
                    <td className="font-medium">
                      {suggestion.name}
                      {suggestion.website && (
                        <div className="text-xs text-base-content/60 mt-1">
                          <a href={suggestion.website} target="_blank" rel="noopener noreferrer" className="link link-hover">
                            {suggestion.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </td>
                    <td>
                      {suggestion.city && <span>{suggestion.city}, </span>}
                      <span>{suggestion.country.name}</span>
                    </td>
                    <td>
                      <a href={`mailto:${suggestion.submitter_email}`} className="link link-hover">
                        {suggestion.submitter_email}
                      </a>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/university-suggestions/${suggestion.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Client-side JS for tab switching */}
      <script id="tabs-script" dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab');
            const suggestionTable = document.querySelector('.bg-base-100.rounded-xl.border.shadow-sm');
            
            tabs.forEach(tab => {
              tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('tab-active'));
                
                // Add active class to clicked tab
                this.classList.add('tab-active');
                
                // Show relevant content - would be replaced with actual fetched data
                const tabName = this.getAttribute('data-tab');
                
                // For demo purposes, just showing a message
                if (tabName === 'pending') {
                  suggestionTable.style.display = 'block';
                } else {
                  suggestionTable.style.display = 'none';
                  // In a real implementation, you would fetch and display the appropriate data
                  // This is just a placeholder
                }
              });
            });
          });
        `
      }} />
    </div>
  );
}