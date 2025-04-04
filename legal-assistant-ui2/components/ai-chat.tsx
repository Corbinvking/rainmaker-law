"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Send, FileText, Plus, Sparkles, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIService } from "@/lib/ai-service"
import { OpenRouterMessage } from "@/types/ai"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: Date
}

interface Conversation {
  id: string
  title: string
  matter_id: string | null
  created_at: Date
  messages: Message[]
}

interface Matter {
  id: string
  title: string
  client_id: string
}

interface AIChatProps {
  selectedMatterId: string | null
}

// Mock matters data
const matters: Matter[] = [
  { id: "1", client_id: "1", title: "Contract Negotiation" },
  { id: "2", client_id: "1", title: "Trademark Registration" },
  { id: "3", client_id: "2", title: "Employment Dispute" },
  { id: "4", client_id: "3", title: "Corporate Restructuring" },
  { id: "5", client_id: "4", title: "Real Estate Purchase" },
  { id: "6", client_id: "5", title: "Patent Application" },
  { id: "7", client_id: "6", title: "Divorce Proceedings" },
  { id: "8", client_id: "7", title: "Business Formation" },
]

// Mock conversations data
const conversations: Conversation[] = [
  {
    id: "1",
    title: "Contract Review Questions",
    matter_id: "1",
    created_at: new Date("2023-01-25T00:00:00Z"),
    messages: [
      {
        id: "1-1",
        content: "Can you help me understand the liability clause in section 5.2?",
        role: "user",
        created_at: new Date("2023-01-25T14:30:00Z"),
      },
      {
        id: "1-2",
        content:
          "Section 5.2 limits the liability of both parties to direct damages only, excluding any indirect, consequential, or punitive damages. This means that if there's a breach, you can only recover actual losses directly caused by the breach, not potential future losses or damages meant to punish the other party.",
        role: "assistant",
        created_at: new Date("2023-01-25T14:31:00Z"),
      },
    ],
  },
  {
    id: "2",
    title: "Trademark Search Assistance",
    matter_id: "2",
    created_at: new Date("2023-02-18T00:00:00Z"),
    messages: [
      {
        id: "2-1",
        content: "I need to conduct a trademark search for our new product name. What should I be looking for?",
        role: "user",
        created_at: new Date("2023-02-18T10:15:00Z"),
      },
      {
        id: "2-2",
        content:
          "When conducting a trademark search, you should look for existing trademarks that are identical or similar to your proposed name, especially in related industries. Check the USPTO database, state registrations, common law uses, and domain names. Pay attention to phonetic similarities, spelling variations, and visual resemblances that might cause consumer confusion.",
        role: "assistant",
        created_at: new Date("2023-02-18T10:16:00Z"),
      },
    ],
  },
  {
    id: "3",
    title: "General Legal Question",
    matter_id: null,
    created_at: new Date("2023-03-05T00:00:00Z"),
    messages: [
      {
        id: "3-1",
        content: "What's the difference between a copyright and a trademark?",
        role: "user",
        created_at: new Date("2023-03-05T09:45:00Z"),
      },
      {
        id: "3-2",
        content:
          "Copyrights protect original creative works like books, music, art, and software, giving the creator exclusive rights to reproduce and distribute the work. Trademarks, on the other hand, protect brand identifiers like names, logos, and slogans that distinguish one company's products or services from another. While copyright protects the expression of ideas, trademarks protect the symbols that identify the source of goods or services.",
        role: "assistant",
        created_at: new Date("2023-03-05T09:46:00Z"),
      },
    ],
  },
]

export function AIChat({ selectedMatterId }: AIChatProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [input, setInput] = useState("")
  const [activeMatterId, setActiveMatterId] = useState<string | null>(selectedMatterId)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isNewConversation, setIsNewConversation] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [useRealAI, setUseRealAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiService = useRef(new AIService())

  // Load AI settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = window.localStorage.getItem('OPENROUTER_API_KEY') || ""
      const savedUseRealAI = window.localStorage.getItem('USE_REAL_AI') === 'true'
      setApiKey(savedKey)
      setUseRealAI(savedUseRealAI)
      aiService.current.setApiKey(savedKey)
      aiService.current.setUseRealAI(savedUseRealAI)
    }
  }, [])

  // Update active matter when selectedMatterId changes
  useEffect(() => {
    if (selectedMatterId) {
      setActiveMatterId(selectedMatterId)
      // Reset conversation if matter changes
      setActiveConversationId(null)
      setMessages([])
      setIsNewConversation(true)
    }
  }, [selectedMatterId])

  // Load conversation messages when activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversations.find((c) => c.id === activeConversationId)
      if (conversation) {
        setMessages(conversation.messages)
        setIsNewConversation(false)
      }
    }
  }, [activeConversationId])

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get matter title by id
  const getMatterTitle = (matterId: string | null) => {
    if (!matterId) return "No Matter"
    const matter = matters.find((m) => m.id === matterId)
    return matter ? matter.title : "Unknown Matter"
  }

  // Filter conversations by matter
  const filteredConversations = conversations.filter((conv) => !activeMatterId || conv.matter_id === activeMatterId)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      created_at: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Prepare messages for AI service
      const messageHistory: OpenRouterMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      messageHistory.push({ role: "user", content: input })

      // Get AI response
      const response = await aiService.current.sendMessage(messageHistory)
      
      // Create AI message from response
      const aiMessage: Message = {
        id: response.id,
        content: response.choices[0].message.content,
        role: "assistant",
        created_at: new Date(),
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback to mock response in case of error
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble processing your request. Could you please try again?",
        role: "assistant",
        created_at: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsProcessing(false)
      if (isNewConversation) {
        setIsNewConversation(false)
      }
    }
  }

  const startNewConversation = () => {
    setActiveConversationId(null)
    setMessages([])
    setIsNewConversation(true)
  }

  const handleSaveSettings = async () => {
    setIsProcessing(true)
    try {
      const { isValid, error } = await aiService.current.verifyApiKey(apiKey)
      if (isValid) {
        aiService.current.setApiKey(apiKey)
        aiService.current.setUseRealAI(useRealAI)
        // Add a success message or toast here
      } else {
        // Show error message
        console.error('API key verification failed:', error)
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: `Failed to verify API key: ${error || 'Unknown error'}`,
          role: "assistant",
          created_at: new Date()
        }])
        return
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Error saving settings. Please try again.',
        role: "assistant",
        created_at: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
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
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Settings</DialogTitle>
                  <DialogDescription>
                    Configure your OpenRouter API settings for AI chat functionality.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="apiKey">OpenRouter API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenRouter API key"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="useRealAI"
                      checked={useRealAI}
                      onCheckedChange={setUseRealAI}
                    />
                    <Label htmlFor="useRealAI">Use Real AI</Label>
                  </div>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              title="Expand to AI Hub"
              onClick={() => {
                if (typeof window !== "undefined") {
                  const event = new CustomEvent("openAIHub")
                  window.dispatchEvent(event)
                }
              }}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="border-b p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Matter</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={startNewConversation}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Select value={activeMatterId || ""} onValueChange={(value) => setActiveMatterId(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select matter (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_matter_selected">No Matter</SelectItem>
                {matters.map((matter) => (
                  <SelectItem key={matter.id} value={matter.id}>
                    {matter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isNewConversation && filteredConversations.length > 0 && (
            <div className="border-b p-4">
              <h3 className="text-sm font-medium mb-2">Conversations</h3>
              <Select value={activeConversationId || ""} onValueChange={(value) => setActiveConversationId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select conversation" />
                </SelectTrigger>
                <SelectContent>
                  {filteredConversations.map((conv) => (
                    <SelectItem key={conv.id} value={conv.id}>
                      {conv.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 shadow-md",
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                          : "bg-gradient-to-br from-muted to-muted/80",
                      )}
                    >
                      {message.role === "assistant" && (
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
                          message.role === "user" ? "text-primary-foreground" : "text-foreground",
                        )}
                      >
                        {message.created_at.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">
                    {activeMatterId
                      ? `Ask me anything about ${getMatterTitle(activeMatterId)}`
                      : "Ask me anything about your legal matters"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    I can help with document drafting, legal research, and more.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
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
                disabled={isProcessing}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isProcessing}
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

