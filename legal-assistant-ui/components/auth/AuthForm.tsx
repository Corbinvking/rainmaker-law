"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/useSupabase"

// Form validation schema
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

type AuthFormValues = z.infer<typeof authSchema>

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
  onSuccess?: () => void
}

// Exponential backoff configuration
const INITIAL_RETRY_DELAY = 2000 // Start with 2 seconds
const MAX_RETRY_DELAY = 10000 // Max delay of 10 seconds
const MAX_RETRIES = 3

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development'

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [retryDelay, setRetryDelay] = useState(INITIAL_RETRY_DELAY)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const retryWithBackoff = async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof Error && 
          (error.message.includes("rate limit") || error.message.includes("Too many")) && 
          retryCount < MAX_RETRIES) {
        
        // Calculate next retry delay with exponential backoff
        const nextDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY)
        setRetryDelay(nextDelay)
        setRetryCount(prev => prev + 1)
        
        // Show retry message
        setError(`Rate limit reached. Retrying in ${Math.ceil(nextDelay / 1000)} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`)
        
        // Wait for the delay
        await sleep(nextDelay)
        
        // Clear error before retry
        setError(null)
        
        // Retry the operation
        return retryWithBackoff(fn)
      }
      throw error
    }
  }

  const onSubmit = async (data: AuthFormValues) => {
    setError(null)
    setLoading(true)
    setSuccess(false)
    setRetryCount(0)
    setRetryDelay(INITIAL_RETRY_DELAY)

    try {
      if (mode === "sign-up") {
        const signUp = async () => {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })

          if (signUpError) {
            if (signUpError.message.includes("rate limit")) {
              throw new Error("Rate limit reached")
            }
            throw signUpError
          }

          if (signUpData.user && signUpData.user.identities?.length === 0) {
            throw new Error("An account with this email already exists.")
          }

          // Create user record in the users table
          if (signUpData.user) {
            const { error: profileError } = await supabase
              .from('users')
              .insert([
                {
                  id: signUpData.user.id,
                  email: signUpData.user.email,
                  full_name: signUpData.user.email?.split('@')[0] || 'New User',
                  role: 'attorney'
                }
              ])

            if (profileError) {
              console.error('Error creating user profile:', profileError)
              throw new Error("Failed to create user profile. Please try again.")
            }
          }

          return signUpData
        }

        await retryWithBackoff(signUp)
        setSuccess(true)
        onSuccess?.()
      } else {
        // Sign in logic
        const signIn = async () => {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          })

          if (signInError) {
            if (signInError.message.includes("rate limit")) {
              throw new Error("Rate limit reached")
            }
            throw signInError
          }

          if (!signInData.session) {
            throw new Error("Failed to create session. Please try again.")
          }

          return signInData
        }

        await retryWithBackoff(signIn)

        // Wait a moment for the session to be properly set
        await sleep(500)

        // Redirect to dashboard on successful sign in
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error('Auth error:', err)
      let errorMessage = "An error occurred. Please try again."
      
      if (err instanceof Error) {
        if (err.message.includes("rate limit") || err.message.includes("Too many")) {
          if (retryCount >= MAX_RETRIES) {
            errorMessage = "Maximum retry attempts reached. Please try again in a few minutes."
          }
        } else if (err.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please try again."
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDevLogin = async () => {
    setLoading(true)
    setError(null)

    const devEmail = 'development.user@rainmaker.law'
    const devPassword = 'Development123!'

    try {
      // Use the retry mechanism for sign in
      const signIn = async () => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: devEmail,
          password: devPassword,
        })
        
        if (signInError) throw signInError
        return signInData
      }

      try {
        // First try to sign in with retry
        await retryWithBackoff(signIn)
        
        // If successful, wait for session and redirect
        await sleep(500)
        router.push("/dashboard")
        router.refresh()
        return
      } catch (signInError) {
        // If sign in fails, try to create the account
        console.log('Sign in failed, attempting to create dev account:', signInError)
      }

      // Sign up with retry
      const signUp = async () => {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: devEmail,
          password: devPassword,
          options: {
            data: {
              full_name: 'Development User',
              role: 'attorney'
            }
          }
        })

        if (signUpError) throw signUpError

        // If sign up successful, create the user profile
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: signUpData.user.id,
                email: signUpData.user.email,
                full_name: 'Development User',
                role: 'attorney'
              }
            ])
            .select()
            .single()

          if (profileError) {
            console.error('Failed to create dev user profile:', profileError)
            // Don't throw the error - the user was created, we can proceed
          }
        }

        return signUpData
      }

      const signUpData = await retryWithBackoff(signUp)

      if (!signUpData.user) {
        throw new Error('Failed to create development user account')
      }

      // Try final sign in with retry
      await retryWithBackoff(signIn)
      
      // Wait for session to be set
      await sleep(500)

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error('Dev login error:', err)
      if (err instanceof Error) {
        setError(`Development login failed: ${err.message}`)
      } else {
        setError('Development login failed. Please check console for details.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "sign-in" ? "Sign In" : "Create Account"}</CardTitle>
        <CardDescription>
          {mode === "sign-in"
            ? "Sign in to access your legal dashboard"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {error && (
            <Alert variant={error.includes("Retrying") ? "default" : "destructive"}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && mode === "sign-up" && (
            <Alert>
              <AlertDescription>
                Please check your email to confirm your account.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : mode === "sign-in" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
          {isDevelopment && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDevLogin}
              disabled={loading}
            >
              Development Login
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
} 