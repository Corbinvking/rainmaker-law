"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarDemo } from "@/components/sidebar-demo"
import { AIChat } from "@/components/ai-chat"
import { Dashboard } from "@/components/dashboard"
import { Documents } from "@/components/documents"
import { Matters } from "@/components/matters"
import { Messages } from "@/components/messages"
import { AIAssistantView } from "@/components/ai-assistant-view"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { isLoading, isAuthenticated, user } = useAuth()
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    const handleOpenAIHub = () => {
      setShowAIAssistant(true)
    }

    const handleReturnToDashboard = () => {
      setShowAIAssistant(false)
      // Force the tabs to show dashboard
      const dashboardTab = document.querySelector('[data-value="dashboard"]')
      if (dashboardTab) {
        ;(dashboardTab as HTMLElement).click()
      }
    }

    window.addEventListener("openAIHub", handleOpenAIHub)
    window.addEventListener("returnToDashboard", handleReturnToDashboard)

    return () => {
      window.removeEventListener("openAIHub", handleOpenAIHub)
      window.removeEventListener("returnToDashboard", handleReturnToDashboard)
    }
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.replace('/login')
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarDemo
        selectedClient={selectedClientId}
        setSelectedClient={setSelectedClientId}
        onHomeClick={() => {
          setSelectedClientId(null)
          setShowAIAssistant(false)
        }}
      />

      {showAIAssistant ? (
        <AIAssistantView
          onClose={() => setShowAIAssistant(false)}
          onSelectClient={(clientId) => {
            console.log("Selecting client:", clientId)
            setSelectedClientId(clientId)
            setShowAIAssistant(false)
          }}
        />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto py-6">
              {selectedClientId ? (
                <Tabs defaultValue="messages" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="matters">Matters</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  <TabsContent value="messages">
                    <Messages selectedClientId={selectedClientId} />
                  </TabsContent>
                  <TabsContent value="matters">
                    <Matters
                      selectedClientId={selectedClientId}
                      selectedMatterId={selectedMatterId}
                      setSelectedMatterId={setSelectedMatterId}
                    />
                  </TabsContent>
                  <TabsContent value="documents">
                    <Documents selectedClientId={selectedClientId} selectedMatterId={selectedMatterId} />
                  </TabsContent>
                </Tabs>
              ) : (
                <Dashboard />
              )}
            </div>
          </main>
          <AIChat selectedMatterId={selectedMatterId} />
        </>
      )}
    </div>
  )
}

