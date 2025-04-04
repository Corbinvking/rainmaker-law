"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AIService } from "@/lib/ai-service"
import { OpenRouterMessage } from "@/types/ai"
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
} from "lucide-react"

interface AIAssistantViewProps {
  onClose: () => void
  onSelectClient?: (clientId: string) => void
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

const aiService = new AIService()

export function AIAssistantView({ onClose, onSelectClient }: AIAssistantViewProps) {
  const [activeView, setActiveView] = useState<"chat" | "tool" | "home">("home")
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("featured")
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<OpenRouterMessage[]>([])
  const [apiKey, setApiKey] = useState('')
  const [useRealAI, setUseRealAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load AI settings from localStorage
    if (typeof window !== 'undefined') {
      const savedApiKey = window.localStorage.getItem('OPENROUTER_API_KEY')
      const savedUseRealAI = window.localStorage.getItem('USE_REAL_AI') === 'true'
      if (savedApiKey) setApiKey(savedApiKey)
      setUseRealAI(savedUseRealAI)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Filter tools by category
  const filteredTools =
    activeCategory === "featured" ? aiTools : aiTools.filter((tool) => tool.category === activeCategory)

  const handleSaveSettings = async () => {
    try {
      const { isValid, error } = await aiService.verifyApiKey(apiKey)
      if (isValid) {
        aiService.setApiKey(apiKey)
        aiService.setUseRealAI(useRealAI)
        // Add a success message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'API key verified and settings saved successfully.'
        }])
      } else {
        // Show error message
        console.error('API key verification failed:', error)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Failed to verify API key: ${error || 'Unknown error'}`
        }])
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error saving settings. Please try again.'
      }])
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: input
    }

    try {
      setMessages(prev => [...prev, userMessage])
      setInput('')

      const response = await aiService.sendMessage([...messages, userMessage])
      
      if (response.choices && response.choices.length > 0) {
        const assistantMessage: OpenRouterMessage = {
          role: 'assistant',
          content: response.choices[0].message.content
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: OpenRouterMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check your settings.'
      }
      setMessages(prev => [...prev, errorMessage])
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
      const welcomeMessage: OpenRouterMessage = {
        role: "assistant",
        content: `Welcome to ${tool.title}. ${tool.description}. How can I assist you with this today?`
      }
      setMessages([welcomeMessage])
    }
  }

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
              {messages.map((message, index) => (
                <Card key={index} className={`p-4 ${message.role === 'assistant' ? 'bg-secondary' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-8 w-8">
                      <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                        {message.role === 'assistant' ? 'AI' : 'U'}
                      </div>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{message.role === 'assistant' ? 'AI Assistant' : 'You'}</p>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
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

      <div className="flex justify-between items-center p-4 border-t">
        <h2 className="text-lg font-semibold">AI Settings</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Settings</DialogTitle>
              <DialogDescription>Configure your OpenRouter API settings</DialogDescription>
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
    </div>
  )
}

