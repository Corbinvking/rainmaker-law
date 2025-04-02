"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/hooks/useSupabase"

export default function DashboardPage() {
  const router = useRouter()
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/sign-in")
      }
    }
    checkSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Legal Practice Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards for dashboard content */}
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Recent Cases</h2>
            <p className="text-muted-foreground">No cases yet</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Active Clients</h2>
            <p className="text-muted-foreground">No clients yet</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Recent Documents</h2>
            <p className="text-muted-foreground">No documents yet</p>
          </div>
        </div>
      </div>
    </div>
  )
} 