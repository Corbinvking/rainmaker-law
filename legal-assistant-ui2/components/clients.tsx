"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Mail, Phone, Building, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Client {
  id: string
  full_name: string
  email: string
  phone?: string
  company?: string
  status: string
  created_at: string
}

interface ClientsProps {
  selectedClientId: string | null
  setSelectedClientId: (id: string | null) => void
}

// Mock clients data - would be fetched from the database in a real app
const clients: Client[] = [
  {
    id: "1",
    full_name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    company: "Smith Enterprises",
    status: "active",
    created_at: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    full_name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    status: "active",
    created_at: "2023-02-20T00:00:00Z",
  },
  {
    id: "3",
    full_name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    company: "Brown & Associates",
    status: "active",
    created_at: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    full_name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    status: "active",
    created_at: "2023-04-05T00:00:00Z",
  },
  {
    id: "5",
    full_name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "(555) 567-8901",
    company: "Wilson Corp",
    status: "inactive",
    created_at: "2023-05-12T00:00:00Z",
  },
  {
    id: "6",
    full_name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    phone: "(555) 678-9012",
    status: "active",
    created_at: "2023-06-18T00:00:00Z",
  },
  {
    id: "7",
    full_name: "David Martinez",
    email: "david.martinez@example.com",
    phone: "(555) 789-0123",
    company: "Martinez Legal",
    status: "active",
    created_at: "2023-07-22T00:00:00Z",
  },
  {
    id: "8",
    full_name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "(555) 890-1234",
    status: "active",
    created_at: "2023-08-30T00:00:00Z",
  },
]

export function Clients({ selectedClientId, setSelectedClientId }: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false)
  const [clientDetailOpen, setClientDetailOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Filter clients based on search query and status filter
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setClientDetailOpen(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button
          className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
          onClick={() => setNewClientDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border shadow-lg">
        <Table>
          <TableHeader className="bg-gradient-to-r from-muted/50 to-background">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedClientId(client.id)
                  handleClientSelect(client)
                }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
                    </Avatar>
                    {client.full_name}
                  </div>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone || "—"}</TableCell>
                <TableCell>{client.company || "—"}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "default" : "secondary"}>
                    {client.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit client logic
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // More options logic
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* New Client Dialog */}
      <Dialog open={newClientDialogOpen} onOpenChange={setNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter the client's information below to add them to your client list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input id="full_name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select defaultValue="active">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewClientDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Detail Dialog */}
      <Dialog open={clientDetailOpen} onOpenChange={setClientDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{getInitials(selectedClient.full_name)}</AvatarFallback>
                  </Avatar>
                  {selectedClient.full_name}
                </DialogTitle>
                <Badge variant={selectedClient.status === "active" ? "default" : "secondary"} className="mt-2">
                  {selectedClient.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.email}</span>
                </div>
                {selectedClient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.phone}</span>
                  </div>
                )}
                {selectedClient.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.company}</span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Client since: {new Date(selectedClient.created_at).toLocaleDateString()}
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <div>
                  <Button variant="destructive" size="sm" className="mr-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <div>
                  <Button variant="outline" className="mr-2" onClick={() => setClientDetailOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

