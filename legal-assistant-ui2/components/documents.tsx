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
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Share2, MoreHorizontal, Upload, Clock, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  matter_id: string | null
  client_id: string
  user_id: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  content_type: string
  created_at: string
  updated_at: string
}

interface Client {
  id: string
  full_name: string
}

interface Matter {
  id: string
  client_id: string
  title: string
}

interface DocumentsProps {
  selectedClientId: string | null
  selectedMatterId: string | null
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

// Mock matters data
const matters: Matter[] = [
  { id: "1", client_id: "1", title: "Contract Negotiation" },
  { id: "2", client_id: "1", title: "Trademark Registration" },
  { id: "3", client_id: "2", title: "Employment Dispute" },
  { id: "4", client_id: "3", title: "Corporate Restructuring" },
  { id: "5", client_id: "4", title: "Real Estate Purchase" },
  { id: "6", client_id: "5", title: "Patent Application" },
  { id: "7", client_id: "6", title: "Divorce Proceedings" },
  { id: "8", client_id: "7", title: "Business Formation" },
]

// Mock documents data - would be fetched from the database in a real app
const documents: Document[] = [
  {
    id: "1",
    matter_id: "1",
    client_id: "1",
    user_id: "user1",
    name: "Partnership Agreement Draft.docx",
    file_path: "/documents/partnership_agreement_draft.docx",
    file_type: "docx",
    file_size: 245000,
    content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    created_at: "2023-01-20T00:00:00Z",
    updated_at: "2023-01-22T00:00:00Z",
  },
  {
    id: "2",
    matter_id: "2",
    client_id: "1",
    user_id: "user1",
    name: "Trademark Application.pdf",
    file_path: "/documents/trademark_application.pdf",
    file_type: "pdf",
    file_size: 1250000,
    content_type: "application/pdf",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
  },
  {
    id: "3",
    matter_id: "3",
    client_id: "2",
    user_id: "user1",
    name: "Employment Contract.pdf",
    file_path: "/documents/employment_contract.pdf",
    file_type: "pdf",
    file_size: 890000,
    content_type: "application/pdf",
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    matter_id: "3",
    client_id: "2",
    user_id: "user1",
    name: "Termination Letter.docx",
    file_path: "/documents/termination_letter.docx",
    file_type: "docx",
    file_size: 125000,
    content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    created_at: "2023-03-12T00:00:00Z",
    updated_at: "2023-03-15T00:00:00Z",
  },
  {
    id: "5",
    matter_id: "4",
    client_id: "3",
    user_id: "user1",
    name: "Restructuring Plan.pptx",
    file_path: "/documents/restructuring_plan.pptx",
    file_type: "pptx",
    file_size: 3500000,
    content_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    created_at: "2023-04-25T00:00:00Z",
    updated_at: "2023-04-28T00:00:00Z",
  },
  {
    id: "6",
    matter_id: "5",
    client_id: "4",
    user_id: "user1",
    name: "Property Deed.pdf",
    file_path: "/documents/property_deed.pdf",
    file_type: "pdf",
    file_size: 1800000,
    content_type: "application/pdf",
    created_at: "2023-05-30T00:00:00Z",
    updated_at: "2023-05-30T00:00:00Z",
  },
  {
    id: "7",
    matter_id: "6",
    client_id: "5",
    user_id: "user1",
    name: "Patent Drawings.pdf",
    file_path: "/documents/patent_drawings.pdf",
    file_type: "pdf",
    file_size: 4200000,
    content_type: "application/pdf",
    created_at: "2023-06-15T00:00:00Z",
    updated_at: "2023-06-18T00:00:00Z",
  },
  {
    id: "8",
    matter_id: null,
    client_id: "1",
    user_id: "user1",
    name: "Client Intake Form.pdf",
    file_path: "/documents/client_intake_form.pdf",
    file_type: "pdf",
    file_size: 350000,
    content_type: "application/pdf",
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2023-01-10T00:00:00Z",
  },
]

export function Documents({ selectedClientId, selectedMatterId }: DocumentsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewDocumentDialogOpen, setViewDocumentDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Filter documents based on selected client, matter, search query, and file type
  const filteredDocuments = documents.filter((doc) => {
    const matchesClient = !selectedClientId || doc.client_id === selectedClientId
    const matchesMatter = !selectedMatterId || doc.matter_id === selectedMatterId
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFileType = fileTypeFilter === "all" || doc.file_type === fileTypeFilter

    return matchesClient && matchesMatter && matchesSearch && matchesFileType
  })

  // Get unique file types for filter
  const fileTypes = Array.from(new Set(documents.map((doc) => doc.file_type)))

  // Get client name by id
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.full_name : "Unknown Client"
  }

  // Get matter title by id
  const getMatterTitle = (matterId: string | null) => {
    if (!matterId) return "No Matter"
    const matter = matters.find((m) => m.id === matterId)
    return matter ? matter.title : "Unknown Matter"
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
    setViewDocumentDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedClientId && selectedMatterId
            ? `Documents for ${getMatterTitle(selectedMatterId)}`
            : selectedClientId
              ? `Documents for ${getClientName(selectedClientId)}`
              : "All Documents"}
        </h2>
        <Button
          className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {fileTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border shadow-lg">
        <Table>
          <TableHeader className="bg-gradient-to-r from-muted/50 to-background">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Matter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow
                key={doc.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleDocumentSelect(doc)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>{getClientName(doc.client_id)}</TableCell>
                <TableCell>{getMatterTitle(doc.matter_id)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.file_type.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                <TableCell>{new Date(doc.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Download document logic
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Share document logic
                      }}
                    >
                      <Share2 className="h-4 w-4" />
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

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document and associate it with a client and matter.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Document File</Label>
              <Input id="file" type="file" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name</Label>
              <Input id="name" placeholder="Enter document name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select defaultValue={selectedClientId || ""}>
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label htmlFor="matter">Matter</Label>
              <Select defaultValue={selectedMatterId || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select matter (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Matter</SelectItem>
                  {matters
                    .filter((m) => !selectedClientId || m.client_id === selectedClientId)
                    .map((matter) => (
                      <SelectItem key={matter.id} value={matter.id}>
                        {matter.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={viewDocumentDialogOpen} onOpenChange={setViewDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {selectedDocument.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedDocument.file_type.toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">{formatFileSize(selectedDocument.file_size)}</span>
                </div>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm">
                  <span className="font-medium">Client: </span>
                  {getClientName(selectedDocument.client_id)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Matter: </span>
                  {getMatterTitle(selectedDocument.matter_id)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Uploaded: {new Date(selectedDocument.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Updated: {new Date(selectedDocument.updated_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Document preview placeholder */}
                <div className="border rounded-md h-64 flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Document Preview</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Eye className="h-4 w-4 mr-1" />
                    View Versions
                  </Button>
                </div>
                <div>
                  <Button variant="outline" className="mr-2">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-1" />
                    Download
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

