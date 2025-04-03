"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  FileText,
  Languages,
  Database,
  PenTool,
  Download,
  Copy,
  Loader2,
  BookOpen,
  Scale,
  Briefcase,
  ArrowLeft,
  Paperclip,
  Settings,
} from "lucide-react"
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
  attachments?: string[]
}

interface AIAssistantViewProps {
  onClose: () => void
  onSelectClient?: (clientId: string) => void
  selectedTool?: string
}

// AI tools data
const aiTools = [
  {
    id: "draft-contract",
    title: "Draft Contract",
    description: "Generate legal contracts with customizable terms",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "document",
  },
  {
    id: "legal-research",
    title: "Legal Research",
    description: "Find relevant case law and legal precedents",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    category: "research",
  },
  {
    id: "translate-document",
    title: "Translate Document",
    description: "Translate legal documents while preserving terminology",
    icon: <Languages className="h-8 w-8 text-primary" />,
    category: "document",
  },
  {
    id: "case-analysis",
    title: "Case Analysis",
    description: "Analyze case strengths, weaknesses, and outcomes",
    icon: <Scale className="h-8 w-8 text-primary" />,
    category: "analysis",
  },
  {
    id: "client-intake",
    title: "Client Intake",
    description: "Generate client intake forms and questionnaires",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    category: "client",
  },
  {
    id: "database-query",
    title: "Database Query",
    description: "Search your legal database using natural language",
    icon: <Database className="h-8 w-8 text-primary" />,
    category: "research",
  },
  {
    id: "document-summary",
    title: "Document Summary",
    description: "Summarize lengthy legal documents and briefs",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "document",
  },
  {
    id: "legal-writing",
    title: "Legal Writing",
    description: "Draft legal memos, briefs, and other documents",
    icon: <PenTool className="h-8 w-8 text-primary" />,
    category: "document",
  },
]

// Mock recent queries
const recentQueries = [
  { id: "1", query: "Find all cases related to Smith v. Johnson", timestamp: "2 hours ago" },
  { id: "2", query: "Summarize the Davis contract terms", timestamp: "Yesterday" },
  { id: "3", query: "Draft a response to the Wilson cease and desist", timestamp: "3 days ago" },
  { id: "4", query: "Translate the Martinez agreement to Spanish", timestamp: "1 week ago" },
]

export function AIAssistantView({ onClose, onSelectClient, selectedTool }: AIAssistantViewProps) {
  const [activeView, setActiveView] = useState<"chat" | "tool" | "home">("home")
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("featured")
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
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

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter tools by category
  const filteredTools =
    activeCategory === "featured" ? aiTools : aiTools.filter((tool) => tool.category === activeCategory)

  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('OPENROUTER_API_KEY', apiKey)
      window.localStorage.setItem('USE_REAL_AI', useRealAI.toString())
    }
    aiService.current.setApiKey(apiKey)
    aiService.current.setUseRealAI(useRealAI)
  }

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
    }
  }

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId)
    setActiveView("tool")

    // Add welcome message for the selected tool
    const tool = aiTools.find((t) => t.id === toolId)
    if (tool) {
      setMessages([
        {
          id: "welcome",
          content: `Welcome to ${tool.title}. ${tool.description}. How can I assist you with this today?`,
          role: "assistant",
          created_at: new Date(),
        },
      ])
    }
  }

  useEffect(() => {
    if (selectedTool) {
      handleToolSelect(selectedTool)
    }
  }, [selectedTool])

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          {activeView !== "home" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView("home")}
              className="mr-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">Legal Assistant</h2>
        </div>
        <Button variant="outline" onClick={onClose}>
          Return to Dashboard
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
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
      </div>

      {activeView === "home" && (
        <div className="flex-1 flex flex-col items-center p-6 overflow-auto">
          <div className="w-full max-w-[1200px]">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-2">What can I do for you?</h1>
            </div>

            <div className="relative mb-12">
              <div className="relative max-w-[800px] mx-auto">
                <Input
                  placeholder="Ask me anything about your legal matters..."
                  className="w-full py-6 px-4 bg-card border-border rounded-lg"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      setActiveView("chat")
                      setTimeout(() => handleSendMessage(), 100)
                    }
                  }}
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent p-2"
                  onClick={() => {
                    if (input.trim()) {
                      setActiveView("chat")
                      setTimeout(() => handleSendMessage(), 100)
                    }
                  }}
                >
                  <Send className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 mb-6">
                <Button
                  variant={activeCategory === "featured" ? "secondary" : "ghost"}
                  onClick={() => setActiveCategory("featured")}
                >
                  Featured
                </Button>
                <Button
                  variant={activeCategory === "document" ? "secondary" : "ghost"}
                  onClick={() => setActiveCategory("document")}
                >
                  Documents
                </Button>
                <Button
                  variant={activeCategory === "research" ? "secondary" : "ghost"}
                  onClick={() => setActiveCategory("research")}
                >
                  Research
                </Button>
                <Button
                  variant={activeCategory === "analysis" ? "secondary" : "ghost"}
                  onClick={() => setActiveCategory("analysis")}
                >
                  Analysis
                </Button>
                <Button
                  variant={activeCategory === "client" ? "secondary" : "ghost"}
                  onClick={() => setActiveCategory("client")}
                >
                  Client
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className="bg-card hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => handleToolSelect(tool.id)}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">{tool.icon}</div>
                      <h3 className="text-lg font-medium mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-400 flex-grow">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeView === "chat" || activeView === "tool") && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-2 flex items-center">
                        <Avatar className="mr-2 h-6 w-6 bg-gray-700">
                          <AvatarFallback>LA</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">Legal Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center rounded-md border border-border p-2 bg-background"
                          >
                            <FileText className="mr-2 h-4 w-4 text-primary" />
                            <span className="text-xs font-medium flex-1">{attachment}</span>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`mt-1 text-right text-xs ${
                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.created_at.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-[#1E2530]">
                    <div className="mb-2 flex items-center">
                      <Avatar className="mr-2 h-6 w-6 bg-gray-700">
                        <AvatarFallback>LA</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">Legal Assistant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="max-w-3xl mx-auto flex items-center space-x-2"
            >
              <Button type="button" variant="ghost" size="icon" className="text-gray-400">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-card border-border"
                disabled={isProcessing}
              />
              <Button type="submit" disabled={!input.trim() || isProcessing} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

