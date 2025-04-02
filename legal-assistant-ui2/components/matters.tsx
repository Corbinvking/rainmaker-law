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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileText, Calendar, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Matter {
  id: string
  client_id: string
  title: string
  description: string
  status: string
  matter_type: string
  created_at: string
  updated_at: string
}

interface Client {
  id: string
  full_name: string
}

interface MattersProps {
  selectedClientId: string | null
  selectedMatterId: string | null
  setSelectedMatterId: (id: string | null) => void
}

// Mock clients data
const clients: Client[] = [
  { id: "1", full_name: "John Smith" },
  { id: "2", full_name: "Sarah Johnson" },
  { id: "3", full_name: "Michael Brown" },
  { id: "4", full_name: "Emily Davis" },
  { id: "5", full_name: "Robert Wilson" },
  { id: "6", full_name: "Jennifer Taylor" },
  { id: "7", full_name: "David Martinez" },
  { id: "8", full_name: "Lisa Anderson" },
]

// Mock matters data - would be fetched from the database in a real app
const matters: Matter[] = [
  {
    id: "1",
    client_id: "1",
    title: "Contract Negotiation",
    description: "Negotiating terms for a new business partnership agreement",
    status: "active",
    matter_type: "Contract",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-20T00:00:00Z",
  },
  {
    id: "2",
    client_id: "1",
    title: "Trademark Registration",
    description: "Filing for trademark protection for new product line",
    status: "active",
    matter_type: "Intellectual Property",
    created_at: "2023-02-10T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
  },
  {
    id: "3",
    client_id: "2",
    title: "Employment Dispute",
    description: "Representing client in wrongful termination claim",
    status: "active",
    matter_type: "Litigation",
    created_at: "2023-03-05T00:00:00Z",
    updated_at: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    client_id: "3",
    title: "Corporate Restructuring",
    description: "Advising on legal aspects of company reorganization",
    status: "active",
    matter_type: "Corporate",
    created_at: "2023-04-20T00:00:00Z",
    updated_at: "2023-04-25T00:00:00Z",
  },
  {
    id: "5",
    client_id: "4",
    title: "Real Estate Purchase",
    description: "Handling legal aspects of commercial property acquisition",
    status: "closed",
    matter_type: "Real Estate",
    created_at: "2023-05-15T00:00:00Z",
    updated_at: "2023-06-01T00:00:00Z",
  },
  {
    id: "6",
    client_id: "5",
    title: "Patent Application",
    description: "Filing patent application for new technology",
    status: "active",
    matter_type: "Intellectual Property",
    created_at: "2023-06-10T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "7",
    client_id: "6",
    title: "Divorce Proceedings",
    description: "Representing client in divorce and asset division",
    status: "active",
    matter_type: "Family Law",
    created_at: "2023-07-05T00:00:00Z",
    updated_at: "2023-07-10T00:00:00Z",
  },
  {
    id: "8",
    client_id: "7",
    title: "Business Formation",
    description: "Setting up legal structure for new business",
    status: "closed",
    matter_type: "Corporate",
    created_at: "2023-08-20T00:00:00Z",
    updated_at: "2023-09-01T00:00:00Z",
  },
]

export function Matters({ selectedClientId, selectedMatterId, setSelectedMatterId }: MattersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [newMatterDialogOpen, setNewMatterDialogOpen] = useState(false)
  const [matterDetailOpen, setMatterDetailOpen] = useState(false)
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null)

  // Filter matters based on selected client, search query, status and type filters
  const filteredMatters = matters.filter((matter) => {
    const matchesClient = !selectedClientId || matter.client_id === selectedClientId
    const matchesSearch =
      matter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || matter.status === statusFilter
    const matchesType = typeFilter === "all" || matter.matter_type === typeFilter

    return matchesClient && matchesSearch && matchesStatus && matchesType
  })

  const handleMatterSelect = (matter: Matter) => {
    setSelectedMatter(matter)
    setSelectedMatterId(matter.id)
    setMatterDetailOpen(true)
  }

  // Get unique matter types for filter
  const matterTypes = Array.from(new Set(matters.map((matter) => matter.matter_type)))

  // Get client name by id
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.full_name : "Unknown Client"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedClientId ? `Matters for ${getClientName(selectedClientId)}` : "All Matters"}
        </h2>
        <Button
          className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
          onClick={() => setNewMatterDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Matter
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matters..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Matter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {matterTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border shadow-lg">
        <Table>
          <TableHeader className="bg-gradient-to-r from-muted/50 to-background">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatters.map((matter) => (
              <TableRow
                key={matter.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleMatterSelect(matter)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {matter.title}
                  </div>
                </TableCell>
                <TableCell>{getClientName(matter.client_id)}</TableCell>
                <TableCell>{matter.matter_type}</TableCell>
                <TableCell>
                  <Badge variant={matter.status === "active" ? "default" : "secondary"}>
                    {matter.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(matter.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit matter logic
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

      {/* New Matter Dialog */}
      <Dialog open={newMatterDialogOpen} onOpenChange={setNewMatterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Matter</DialogTitle>
            <DialogDescription>Enter the matter details below to create a new legal matter.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Select defaultValue={selectedClientId || ""}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="matter_type" className="text-right">
                Type
              </Label>
              <Select defaultValue="Contract">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {matterTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMatterDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Matter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Matter Detail Dialog */}
      <Dialog open={matterDetailOpen} onOpenChange={setMatterDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedMatter && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {selectedMatter.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedMatter.status === "active" ? "default" : "secondary"}>
                    {selectedMatter.status === "active" ? "Active" : "Closed"}
                  </Badge>
                  <Badge variant="outline">{selectedMatter.matter_type}</Badge>
                </div>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm">
                  <span className="font-medium">Client: </span>
                  {getClientName(selectedMatter.client_id)}
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm">{selectedMatter.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created: {new Date(selectedMatter.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Updated: {new Date(selectedMatter.updated_at).toLocaleDateString()}
                  </div>
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
                  <Button variant="outline" className="mr-2" onClick={() => setMatterDetailOpen(false)}>
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

