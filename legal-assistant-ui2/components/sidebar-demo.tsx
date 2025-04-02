"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Settings, User, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { ProfileDialog } from "@/components/profile-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import { Input } from "@/components/ui/input"

interface Client {
  id: string
  full_name: string
  email: string
  company?: string
  status: string
}

interface SidebarDemoProps {
  selectedClient: string | null
  setSelectedClient: Dispatch<SetStateAction<string | null>>
  onHomeClick?: () => void
}

// Mock clients data - would be fetched from the database in a real app
const clients: Client[] = [
  {
    id: "1",
    full_name: "John Smith",
    email: "john.smith@example.com",
    company: "Smith Enterprises",
    status: "active",
  },
  {
    id: "2",
    full_name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    status: "active",
  },
  {
    id: "3",
    full_name: "Michael Brown",
    email: "michael.brown@example.com",
    company: "Brown & Associates",
    status: "active",
  },
  {
    id: "4",
    full_name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "active",
  },
  {
    id: "5",
    full_name: "Robert Wilson",
    email: "robert.wilson@example.com",
    company: "Wilson Corp",
    status: "inactive",
  },
  {
    id: "6",
    full_name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    status: "active",
  },
  {
    id: "7",
    full_name: "David Martinez",
    email: "david.martinez@example.com",
    company: "Martinez Legal",
    status: "active",
  },
  {
    id: "8",
    full_name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    status: "active",
  },
]

export function SidebarDemo({ selectedClient, setSelectedClient, onHomeClick }: SidebarDemoProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col border-r bg-gradient-to-b from-background to-background/90 shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-lg font-semibold">Legal Assistant</h2>}
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="flex justify-center space-x-2 py-4">
        <Button
          variant="ghost"
          size="icon"
          title="Dashboard"
          onClick={() => {
            // Clear any selected client
            setSelectedClient(null)
            // Dispatch an event to return to dashboard view
            if (typeof window !== "undefined") {
              const event = new CustomEvent("returnToDashboard")
              window.dispatchEvent(event)
            }
          }}
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Profile" onClick={() => setProfileOpen(true)}>
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Settings" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {!collapsed && (
        <div className="px-4 mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="px-4 py-2">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Clients</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {filteredClients.map((client) => (
            <Button
              key={client.id}
              variant={selectedClient === client.id ? "secondary" : "ghost"}
              className="w-full justify-start px-2 py-1 h-auto mb-1"
              onClick={() => {
                setSelectedClient(client.id)
                // Dispatch an event to return to dashboard view if in AI assistant
                if (typeof window !== "undefined") {
                  const event = new CustomEvent("returnToDashboard")
                  window.dispatchEvent(event)
                }
              }}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate w-full text-left">{client.full_name}</span>
                {client.company && (
                  <span className="text-xs text-muted-foreground truncate w-full text-left">{client.company}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Profile Dialog */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

