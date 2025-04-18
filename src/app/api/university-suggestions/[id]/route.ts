import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  try {
    const { id } = params;
    const { status, notes } = await request.json();
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    // Update suggestion status
    const { data, error } = await supabase
      .from('university_suggestions')
      .update({
        status,
        notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id
      })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating suggestion:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, suggestion: data[0] });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  try {
    const { id } = params;
    
    // Get suggestion by ID
    const { data, error } = await supabase
      .from('university_suggestions')
      .select(`
        *,
        country:country_id (
          id,
          name,
          code
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching suggestion:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ suggestion: data });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}