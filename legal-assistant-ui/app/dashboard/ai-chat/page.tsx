"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSupabase } from "@/hooks/useSupabase"
import { MessageSquare, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIChatPage() {
  const { supabase } = useSupabase()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      // TODO: Implement AI chat functionality
      // For now, just echo the message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "This is a placeholder response. AI chat functionality will be implemented soon.",
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Legal Assistant</h1>
        <p className="text-muted-foreground">
          Chat with your AI assistant about legal matters
        </p>
      </div>

      <Card className="flex-1 flex flex-col p-4 mb-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {message.role === "user" ? "U" : <MessageSquare className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
} 