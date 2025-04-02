import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true
    let retryTimeout: NodeJS.Timeout | null = null

    // Light initial check
    const checkSession = async () => {
      if (!mounted) return
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Session check error:', error)
          if (error.status === 429) {
            // Rate limit hit - retry after a delay
            retryTimeout = setTimeout(checkSession, 1000)
            return
          }
          setUser(null)
          setIsAuthenticated(false)
        } else if (session && session.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Session check error:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        if (mounted) {
          setIsLoading(false)
          setSessionChecked(true)
        }
      }
    }

    checkSession()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (!mounted) return

      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null)
        setIsAuthenticated(false)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setUser(session.user)
        setIsAuthenticated(true)
      }
    })

    return () => {
      mounted = false
      if (retryTimeout) clearTimeout(retryTimeout)
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.status === 429) {
          throw new Error('Too many login attempts. Please wait a moment and try again.')
        }
        throw error
      }

      setUser(data?.user ?? null)
      setIsAuthenticated(true)
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isAuthenticated,
    sessionChecked,
    user,
    signIn,
    signOut,
  }
} 