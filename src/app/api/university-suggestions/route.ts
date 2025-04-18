import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Check if user is authenticated and has admin role
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Verify user has admin role
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id);
  
  const isAdmin = userRoles?.some(r => r.role === 'admin');
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  // Get status filter from URL params
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'all';
  
  // Query to get suggestions with country info
  let query = supabase
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
  
  // Apply status filter if specified and not 'all'
  if (status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data: suggestions, error } = await query;
  
  if (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ suggestions });
}