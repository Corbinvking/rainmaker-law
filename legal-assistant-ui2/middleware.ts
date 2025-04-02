import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password']

export async function middleware(req: NextRequest) {
  // Create a response and a Supabase client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const path = req.nextUrl.pathname
    
    // Check if the current path is a public path
    const isPublicPath = publicPaths.includes(path)

    // If on a public path and no session, allow access
    if (isPublicPath && !session) {
      return res
    }

    // If on a public path and has session, redirect to home
    if (isPublicPath && session) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If not on a public path and no session, redirect to login
    if (!isPublicPath && !session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If we have a session and not on a public path, allow access
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // If we're already on a public path, don't redirect
    if (publicPaths.includes(req.nextUrl.pathname)) {
      return res
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Protect all routes except public assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 