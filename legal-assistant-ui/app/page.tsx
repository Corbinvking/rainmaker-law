"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarDemo } from "@/components/sidebar-demo"
import { AIChat } from "@/components/ai-chat"
import { Dashboard } from "@/components/dashboard"
import { Files } from "@/components/files"
import { Messages } from "@/components/messages"
import { AIAssistantView } from "@/components/ai-assistant-view"

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>("1")
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarDemo
        selectedClient={selectedClientId}
        setSelectedClient={setSelectedClientId}
        onHomeClick={() => setShowAIAssistant(true)}
      />

      {showAIAssistant ? (
        <AIAssistantView onClose={() => setShowAIAssistant(false)} />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto py-6">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                  <Dashboard />
                </TabsContent>
                <TabsContent value="files">
                  <Files selectedClientId={selectedClientId} />
                </TabsContent>
                <TabsContent value="messages">
                  <Messages selectedClientId={selectedClientId} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
          <AIChat />
        </>
      )}
    </div>
  )
}

