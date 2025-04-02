import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import type { User } from '@/lib/supabase'

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error fetching session:', sessionError.message)
          setLoading(false)
          return
        }

        if (session?.user?.id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError) {
            if (userError.message === 'JSON object requested, multiple (or no) rows returned') {
              // Create user record if it doesn't exist
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.email?.split('@')[0] || 'New User',
                    role: 'attorney'
                  }
                ])
                .select()
                .single()

              if (createError) {
                console.error('Error creating user record:', createError.message)
              } else {
                setUser(newUser)
              }
            } else {
              console.error('Error fetching user data:', userError.message)
            }
          } else {
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError) {
            if (userError.message === 'JSON object requested, multiple (or no) rows returned') {
              // Create user record if it doesn't exist
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.email?.split('@')[0] || 'New User',
                    role: 'attorney'
                  }
                ])
                .select()
                .single()

              if (createError) {
                console.error('Error creating user record:', createError.message)
              } else {
                setUser(newUser)
              }
            } else {
              console.error('Error fetching user data:', userError.message)
            }
          } else {
            setUser(userData)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, user, loading }
} 