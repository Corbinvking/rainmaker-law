"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Settings, User, ChevronLeft, ChevronRight } from "lucide-react"
import { ProfileDialog } from "@/components/profile-dialog"
import { SettingsDialog } from "@/components/settings-dialog"

interface Client {
  id: string
  name: string
  initials: string
  avatar?: string
}

interface SidebarDemoProps {
  selectedClient: string | null
  setSelectedClient: Dispatch<SetStateAction<string | null>>
  onHomeClick?: () => void
}

const clients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    initials: "JS",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    initials: "SJ",
  },
  {
    id: "3",
    name: "Michael Brown",
    initials: "MB",
  },
  {
    id: "4",
    name: "Emily Davis",
    initials: "ED",
  },
  {
    id: "5",
    name: "Robert Wilson",
    initials: "RW",
  },
  {
    id: "6",
    name: "Jennifer Taylor",
    initials: "JT",
  },
  {
    id: "7",
    name: "David Martinez",
    initials: "DM",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    initials: "LA",
  },
  {
    id: "9",
    name: "James Thomas",
    initials: "JT",
  },
  {
    id: "10",
    name: "Patricia White",
    initials: "PW",
  },
  {
    id: "11",
    name: "Richard Harris",
    initials: "RH",
  },
  {
    id: "12",
    name: "Elizabeth Clark",
    initials: "EC",
  },
]

export function SidebarDemo({ selectedClient, setSelectedClient, onHomeClick }: SidebarDemoProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
        <Button variant="ghost" size="icon" title="AI Assistant" onClick={onHomeClick}>
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Profile" onClick={() => setProfileOpen(true)}>
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Settings" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-2">{!collapsed && <h3 className="mb-2 text-sm font-medium">Clients</h3>}</div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {clients.map((client) => (
            <Button
              key={client.id}
              variant={selectedClient === client.id ? "secondary" : "ghost"}
              className={cn(
                "mb-1 w-full justify-start transition-all",
                collapsed ? "px-2" : "px-3",
                selectedClient === client.id
                  ? "bg-gradient-to-r from-secondary to-secondary/80 shadow-md"
                  : "hover:bg-gradient-to-r hover:from-muted hover:to-background",
              )}
              onClick={() => setSelectedClient(client.id)}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={client.avatar} />
                <AvatarFallback>{client.initials}</AvatarFallback>
              </Avatar>
              {!collapsed && <span>{client.name}</span>}
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

