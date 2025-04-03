import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

// ... existing interfaces and mock data ...

export function AIAssistantView({ onClose, onSelectClient }: AIAssistantViewProps) {
  const [activeView, setActiveView] = useState<"chat" | "tool" | "home">("home")
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("featured")
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiService = useRef(new AIService())

  // Load AI settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = window.localStorage.getItem('OPENROUTER_API_KEY') || ""
      const savedUseRealAI = window.localStorage.getItem('USE_REAL_AI') === 'true'
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
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble processing your request. Could you please try again?",
        role: "assistant",
        created_at: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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

  // ... rest of the component code ...
} 