"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function AIChat() {
  const [collapsed, setCollapsed] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI legal assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help with your legal questions and navigate the platform. What would you like to know?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col border-l bg-gradient-to-b from-background to-background/90 shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-80",
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        {!collapsed && <h2 className="text-lg font-semibold">AI Assistant</h2>}
      </div>

      {!collapsed && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 shadow-md",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                        : "bg-gradient-to-br from-muted to-muted/80",
                    )}
                  >
                    {message.sender === "ai" && (
                      <div className="mb-1 flex items-center">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div
                      className={cn(
                        "mt-1 text-right text-xs opacity-70",
                        message.sender === "user" ? "text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

