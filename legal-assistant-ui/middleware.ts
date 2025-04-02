import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Separate rate limits for different route types
const apiRateLimit = new Map()
const authRateLimit = new Map()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const API_MAX_REQUESTS = 500 // 500 requests per 15 minutes for API routes
const AUTH_MAX_REQUESTS = 20 // 20 requests per minute for auth routes
const AUTH_WINDOW = 60 * 1000 // 1 minute window for auth routes

// Clean up old rate limit entries
const cleanupRateLimits = () => {
  const now = Date.now()
  for (const [key, value] of apiRateLimit.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      apiRateLimit.delete(key)
    }
  }
  for (const [key, value] of authRateLimit.entries()) {
    if (now - value.timestamp > AUTH_WINDOW) {
      authRateLimit.delete(key)
    }
  }
}

// Run cleanup every minute
setInterval(cleanupRateLimits, 60 * 1000)

const checkRateLimit = (
  map: Map<string, { count: number; timestamp: number }>,
  clientIp: string,
  window: number,
  maxRequests: number
): boolean => {
  const now = Date.now()
  const rateData = map.get(clientIp) || { count: 0, timestamp: now }

  if (now - rateData.timestamp > window) {
    rateData.count = 1
    rateData.timestamp = now
  } else {
    rateData.count++
  }

  map.set(clientIp, rateData)
  return rateData.count <= maxRequests
}

export async function middleware(request: NextRequest) {
  try {
    // Create a response object that we'll modify and return
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Skip rate limiting for static assets and public routes
    if (request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/)) {
      return res
    }

    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
    const isRootRoute = request.nextUrl.pathname === '/'

    // Apply different rate limits based on route type
    if (isAuthRoute) {
      if (!checkRateLimit(authRateLimit, clientIp, AUTH_WINDOW, AUTH_MAX_REQUESTS)) {
        return new NextResponse('Too Many Auth Attempts', { status: 429 })
      }
    } else if (isApiRoute || isDashboardRoute) {
      if (!checkRateLimit(apiRateLimit, clientIp, RATE_LIMIT_WINDOW, API_MAX_REQUESTS)) {
        return new NextResponse('Too Many API Requests', { status: 429 })
      }
    }

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Handle expired sessions
    if (session?.expires_at) {
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)
      
      // If session is expired or about to expire in the next minute
      if (expiresAt <= now + 60) {
        try {
          const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError || !newSession) {
            // Clear invalid session and redirect to sign in
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/auth/sign-in', request.url))
          }
        } catch (refreshError) {
          // If refresh fails, sign out and redirect
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/auth/sign-in', request.url))
        }
      }
    }

    // Route protection logic
    if (!session) {
      // If not authenticated, only allow access to public routes and auth routes
      if (isDashboardRoute || isRootRoute) {
        const signInUrl = new URL('/auth/sign-in', request.url)
        // Preserve the original URL to redirect back after sign in
        signInUrl.searchParams.set('redirectTo', request.url)
        return NextResponse.redirect(signInUrl)
      }
    } else {
      // If authenticated, redirect auth routes to dashboard
      if (isAuthRoute || isRootRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return res
  } catch (error: unknown) {
    console.error('Middleware error:', error)
    
    // Handle JWT errors by signing out and redirecting
    if (error instanceof Error && 
       (error.message?.includes('JWT') || error.message?.includes('token'))) {
      const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
    
    // For other errors, continue with the request
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 