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

// ... existing interfaces ...

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

  // ... existing useEffect hooks ...

  const handleSaveSettings = () => {
    aiService.current.setApiKey(apiKey)
    aiService.current.setUseRealAI(useRealAI)
  }

  // ... rest of existing code ...

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

      {/* ... rest of existing JSX ... */}
    </div>
  )
} 