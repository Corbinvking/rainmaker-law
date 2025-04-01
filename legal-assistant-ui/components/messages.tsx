"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, MoreVertical } from "lucide-react"

interface Contact {
  id: string
  name: string
  initials: string
  avatar?: string
  lastMessage: string
  time: string
  unread?: boolean
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "John Smith",
    initials: "JS",
    lastMessage: "Can we schedule a meeting tomorrow?",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    initials: "SJ",
    lastMessage: "I've reviewed the contract and have some concerns.",
    time: "Yesterday",
  },
  {
    id: "3",
    name: "Michael Brown",
    initials: "MB",
    lastMessage: "Thank you for your help with the case.",
    time: "Yesterday",
  },
  {
    id: "4",
    name: "Emily Davis",
    initials: "ED",
    lastMessage: "Please send me the updated settlement agreement.",
    time: "Monday",
    unread: true,
  },
  {
    id: "5",
    name: "Robert Wilson",
    initials: "RW",
    lastMessage: "I'll be available for the deposition next week.",
    time: "Monday",
  },
  {
    id: "6",
    name: "Jennifer Taylor",
    initials: "JT",
    lastMessage: "Can you explain the terms of the agreement?",
    time: "Last week",
  },
]

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
}

const conversationMessages: Message[] = [
  {
    id: "1",
    content: "Hello, I need some advice regarding my case.",
    sender: "contact",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    content: "Of course, I'd be happy to help. What specific aspects are you concerned about?",
    sender: "user",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    content: "I'm worried about the upcoming deposition. Can we go over what to expect?",
    sender: "contact",
    timestamp: "10:35 AM",
  },
  {
    id: "4",
    content: "Absolutely. Let's schedule a meeting to prepare you thoroughly. How does tomorrow at 2 PM sound?",
    sender: "user",
    timestamp: "10:38 AM",
  },
  {
    id: "5",
    content: "That works for me. Thank you for your quick response.",
    sender: "contact",
    timestamp: "10:40 AM",
  },
  {
    id: "6",
    content: "You're welcome. I'll send you some materials to review before our meeting.",
    sender: "user",
    timestamp: "10:42 AM",
  },
  {
    id: "7",
    content: "Can we schedule a meeting tomorrow?",
    sender: "contact",
    timestamp: "10:45 AM",
  },
]

interface MessagesProps {
  selectedClientId: string | null
}

export function Messages({ selectedClientId }: MessagesProps) {
  const [messageInput, setMessageInput] = useState("")
  const selectedContact = selectedClientId
  const selectedContactData = contacts.find((c) => c.id === selectedContact)

  return (
    <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-6">
      <Card className="flex flex-col">
        {selectedContact ? (
          <>
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarFallback>{selectedContactData?.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContactData?.name}</h3>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                          : "bg-gradient-to-br from-muted to-muted/80"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-right text-xs ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setMessageInput("")
                }}
                className="flex items-center space-x-2"
              >
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
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
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium">Select a client</h3>
              <p className="text-sm text-muted-foreground">
                Choose a client from the sidebar to view your conversation.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

