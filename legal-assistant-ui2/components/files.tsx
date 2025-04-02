import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Filter, Download, Share2, MoreHorizontal } from "lucide-react"

interface File {
  id: string
  name: string
  client: string
  type: string
  size: string
  modified: string
}

// Add this after the File interface
const contacts = [
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

interface FilesProps {
  selectedClientId: string | null
}

const files: File[] = [
  {
    id: "1",
    name: "Smith_Contract_v2.pdf",
    client: "John Smith",
    type: "PDF",
    size: "2.4 MB",
    modified: "Today",
  },
  {
    id: "2",
    name: "Johnson_Case_Brief.docx",
    client: "Sarah Johnson",
    type: "DOCX",
    size: "1.8 MB",
    modified: "Yesterday",
  },
  {
    id: "3",
    name: "Brown_Deposition.pdf",
    client: "Michael Brown",
    type: "PDF",
    size: "5.2 MB",
    modified: "2 days ago",
  },
  {
    id: "4",
    name: "Davis_Settlement_Agreement.pdf",
    client: "Emily Davis",
    type: "PDF",
    size: "3.1 MB",
    modified: "3 days ago",
  },
  {
    id: "5",
    name: "Wilson_Evidence_Photos.zip",
    client: "Robert Wilson",
    type: "ZIP",
    size: "15.7 MB",
    modified: "1 week ago",
  },
  {
    id: "6",
    name: "Taylor_Witness_Statement.docx",
    client: "Jennifer Taylor",
    type: "DOCX",
    size: "1.2 MB",
    modified: "1 week ago",
  },
  {
    id: "7",
    name: "Martinez_Financial_Records.xlsx",
    client: "David Martinez",
    type: "XLSX",
    size: "4.5 MB",
    modified: "2 weeks ago",
  },
]

export function Files({ selectedClientId }: FilesProps) {
  // Filter files by selected client if one is selected
  const filteredFiles = selectedClientId
    ? files.filter((file) => file.client === contacts.find((c) => c.id === selectedClientId)?.name)
    : files

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedClientId ? `Files for ${contacts.find((c) => c.id === selectedClientId)?.name}` : "All Files"}
        </h2>
        <Button className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all">
          <FileText className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Rest of the component remains the same, but use filteredFiles instead of files */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border shadow-lg">
        <Table>
          <TableHeader className="bg-gradient-to-r from-muted/50 to-background">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>{file.client}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.modified}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

