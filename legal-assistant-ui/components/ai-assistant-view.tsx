"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  FileText,
  Languages,
  Database,
  PenTool,
  Search,
  Clock,
  Trash2,
  Download,
  Copy,
  Sparkles,
  UploadCloud,
  Loader2,
  User,
  LogOut,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/hooks/useSupabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  attachments?: string[]
}

interface AIAssistantViewProps {
  onClose: () => void
}

export function AIAssistantView({ onClose }: AIAssistantViewProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [activeTab, setActiveTab] = useState("chat")
  const [input, setInput] = useState("")
  const [draftContent, setDraftContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your AI legal assistant. I can help you draft documents, translate content, search your database, and more. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock document drafting templates
  const documentTemplates = [
    { id: "contract", name: "Contract Agreement" },
    { id: "letter", name: "Demand Letter" },
    { id: "brief", name: "Legal Brief" },
    { id: "memo", name: "Legal Memorandum" },
    { id: "settlement", name: "Settlement Agreement" },
    { id: "motion", name: "Motion to Dismiss" },
  ]

  // Mock recent queries
  const recentQueries = [
    { id: "1", query: "Find all cases related to Smith v. Johnson", timestamp: "2 hours ago" },
    { id: "2", query: "Summarize the Davis contract terms", timestamp: "Yesterday" },
    { id: "3", query: "Draft a response to the Wilson cease and desist", timestamp: "3 days ago" },
    { id: "4", query: "Translate the Martinez agreement to Spanish", timestamp: "1 week ago" },
  ]

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
    setIsProcessing(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsProcessing(false)
    }, 1500)
  }

  // Simple mock AI response generator
  const generateAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("draft") || query.toLowerCase().includes("write")) {
      return "I'd be happy to help you draft that document. Would you like me to use a specific template or create something custom? Please provide any specific details you'd like to include."
    } else if (query.toLowerCase().includes("translate")) {
      return "I can translate that for you. What language would you like me to translate it to? Once you specify, I can begin the translation process."
    } else if (query.toLowerCase().includes("search") || query.toLowerCase().includes("find")) {
      return "I'll search your database for that information. Based on your query, I found several relevant documents. Would you like me to summarize them or provide the full details?"
    } else {
      return "I understand your request. As your legal AI assistant, I can help with drafting documents, translating content, searching your database, and providing legal insights. Would you like me to elaborate on any specific aspect of your query?"
    }
  }

  const handleDraftDocument = () => {
    if (!draftContent.trim()) return

    setIsProcessing(true)

    // Simulate document generation
    setTimeout(() => {
      setIsProcessing(false)

      // Add messages about the drafted document
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `Request to draft document: ${draftContent}`,
        sender: "user",
        timestamp: new Date(),
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've drafted the document based on your requirements. You can review, edit, and download it below.",
        sender: "ai",
        timestamp: new Date(),
        attachments: ["Legal_Draft_Document.docx"],
      }

      setMessages((prev) => [...prev, userMessage, aiMessage])
      setDraftContent("")
      setActiveTab("chat") // Switch back to chat to show the result
    }, 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-background to-background/80">
      <div className="flex items-center justify-between border-b p-4 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">Legal AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 w-10 hover:bg-accent hover:text-accent-foreground" title="Profile">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground" onClick={onClose}>
            Return to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid flex-1 md:grid-cols-4">
        {/* Sidebar with AI tools */}
        <div className="border-r md:col-span-1">
          <div className="p-4">
            <h3 className="mb-4 font-medium">AI Tools</h3>
            <div className="space-y-2">
              <Button
                className={cn(
                  "w-full justify-start transition-all",
                  activeTab === "chat"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground hover:bg-gradient-to-r hover:from-muted hover:to-background"
                )}
                onClick={() => setActiveTab("chat")}
              >
                <Sparkles className={`mr-2 h-4 w-4 ${activeTab === "chat" ? "text-primary" : ""}`} />
                AI Chat
              </Button>
              <Button
                className={cn(
                  "w-full justify-start transition-all",
                  activeTab === "draft"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground hover:bg-gradient-to-r hover:from-muted hover:to-background"
                )}
                onClick={() => setActiveTab("draft")}
              >
                <PenTool className={`mr-2 h-4 w-4 ${activeTab === "draft" ? "text-primary" : ""}`} />
                Document Drafting
              </Button>
              <Button
                className={cn(
                  "w-full justify-start transition-all",
                  activeTab === "translate"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground hover:bg-gradient-to-r hover:from-muted hover:to-background"
                )}
                onClick={() => setActiveTab("translate")}
              >
                <Languages className={`mr-2 h-4 w-4 ${activeTab === "translate" ? "text-primary" : ""}`} />
                Translation
              </Button>
              <Button
                className={cn(
                  "w-full justify-start transition-all",
                  activeTab === "database"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground hover:bg-gradient-to-r hover:from-muted hover:to-background"
                )}
                onClick={() => setActiveTab("database")}
              >
                <Database className={`mr-2 h-4 w-4 ${activeTab === "database" ? "text-primary" : ""}`} />
                Database Query
              </Button>
            </div>
          </div>

          <Separator />

          <div className="p-4">
            <h3 className="mb-4 font-medium">Recent Queries</h3>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="space-y-2">
                {recentQueries.map((query) => (
                  <Card
                    key={query.id}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-accent hover:to-background transition-all shadow hover:shadow-md"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{query.query}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{query.timestamp}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:col-span-3">
          <div className={`flex-1 flex flex-col ${activeTab === "chat" ? "block" : "hidden"}`}>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-gradient-to-br from-muted to-muted/80 shadow-md"
                      }`}
                    >
                      {message.sender === "ai" && (
                        <div className="mb-2 flex items-center">
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center rounded-md border p-2 bg-background">
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
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                      <div className="mb-2 flex items-center">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">AI Assistant</span>
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
                  placeholder="Ask me anything about your legal matters..."
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          <div className={`flex-1 p-4 ${activeTab === "draft" ? "flex flex-col" : "hidden"}`}>
            <Card className="flex-1 shadow-lg border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Document Drafting</CardTitle>
                <CardDescription>Use AI to draft legal documents based on your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Document Type</label>
                  <Select defaultValue="contract">
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Document Requirements</label>
                  <Textarea
                    placeholder="Describe what you need in this document. Include parties involved, key terms, deadlines, and any specific clauses you want to include."
                    className="min-h-[200px] mt-1"
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Include precedent from:</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="firm">Firm Documents</SelectItem>
                      <SelectItem value="case">Case Law</SelectItem>
                      <SelectItem value="statutes">Statutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Jurisdiction:</label>
                  <Select defaultValue="ny">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                      <SelectItem value="federal">Federal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Upload Reference Document</Button>
                <Button
                  onClick={handleDraftDocument}
                  disabled={!draftContent.trim() || isProcessing}
                  className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Drafting...
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Draft Document
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className={`flex-1 p-4 ${activeTab === "translate" ? "flex flex-col" : "hidden"}`}>
            <Card className="flex-1 shadow-lg border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Document Translation</CardTitle>
                <CardDescription>
                  Translate legal documents between languages while preserving legal terminology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Source Language</label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select source language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Target Language</label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue placeholder="Select target language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium">Source Text</label>
                    <Textarea
                      placeholder="Enter the text you want to translate or upload a document"
                      className="min-h-[150px] mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <Button variant="outline" className="mx-auto">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Translation Result</label>
                      <Badge variant="outline">AI Translated</Badge>
                    </div>
                    <div className="min-h-[150px] mt-1 rounded-md border bg-gradient-to-br from-muted to-muted/70 p-4 shadow-inner">
                      <p className="text-sm text-muted-foreground italic">Translation will appear here...</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Translation Style:</label>
                  <Select defaultValue="legal">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal">Legal Precision</SelectItem>
                      <SelectItem value="plain">Plain Language</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="literal">Literal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Translation
                </Button>
                <Button className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all">
                  <Languages className="mr-2 h-4 w-4" />
                  Translate
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className={`flex-1 p-4 ${activeTab === "database" ? "flex flex-col" : "hidden"}`}>
            <Card className="flex-1 shadow-lg border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Database Query</CardTitle>
                <CardDescription>Search and analyze your legal database using natural language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Ask a question about your cases, clients, or documents..." className="pl-8" />
                </div>

                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Results</TabsTrigger>
                    <TabsTrigger value="cases">Cases</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <div className="rounded-md border p-4 text-center">
                      <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Search Your Database</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter a query above to search across all your legal data
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="cases" className="mt-4">
                    <div className="rounded-md border p-4 text-center">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Case Search</h3>
                      <p className="text-sm text-muted-foreground mt-1">Search specifically for case information</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="clients" className="mt-4">
                    <div className="rounded-md border p-4 text-center">
                      <Avatar className="mx-auto h-8 w-8 mb-2">
                        <AvatarFallback>CL</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-medium">Client Search</h3>
                      <p className="text-sm text-muted-foreground mt-1">Search for client information and history</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="documents" className="mt-4">
                    <div className="rounded-md border p-4 text-center">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Document Search</h3>
                      <p className="text-sm text-muted-foreground mt-1">Search through all your legal documents</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <h3 className="text-sm font-medium mb-2">Advanced Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Date Range</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="year">Past Year</SelectItem>
                          <SelectItem value="month">Past Month</SelectItem>
                          <SelectItem value="week">Past Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Document Type</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="contracts">Contracts</SelectItem>
                          <SelectItem value="briefs">Legal Briefs</SelectItem>
                          <SelectItem value="memos">Memos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all">
                  <Search className="mr-2 h-4 w-4" />
                  Search Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

