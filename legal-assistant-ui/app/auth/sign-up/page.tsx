"use client"

import Link from "next/link"
import { AuthForm } from "@/components/auth/AuthForm"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up to start managing your legal practice
          </p>
        </div>
        
        <AuthForm mode="sign-up" onSuccess={() => {
          // Show success message after sign up
          alert("Please check your email to confirm your account.")
        }} />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 