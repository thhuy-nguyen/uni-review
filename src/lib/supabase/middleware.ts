import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/dashboard/resume-reviews',
    '/profile',
    '/resume-review' // New dedicated path for resume reviews
  ]
  
  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  )
  
  // If no user and trying to access protected route, redirect to login
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    // Add the original URL as a return URL after login
    const returnUrl = encodeURIComponent(request.nextUrl.pathname)
    url.pathname = '/login'
    url.searchParams.set('returnUrl', returnUrl)
    return NextResponse.redirect(url)
  }
  
  // If user is trying to access login/signup pages but is already logged in, redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}