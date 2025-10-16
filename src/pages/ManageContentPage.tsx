import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Tag,
  Users,
  AlertCircle,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const searchSchema = z.object({
//   query: z.string(),
// });

// type SearchForm = z.infer<typeof searchSchema>;

// Mock content data
const mockContent = [
  {
    id: "1",
    title: "Safety Protocol - Machine Setup",
    description: "Essential safety procedures for machine operation",
    thumbnail_url: "/api/placeholder/300/200",
    duration: 25,
    status: "pending_qa" as const,
    tags: ["safety", "machine-setup"],
    author: { full_name: "John Smith", id: "1" },
    created_at: "2024-01-15T10:30:00Z",
    view_count: 45,
    customer_allocations: ["TechCorp", "Global Manufacturing"],
    metadata: {
      resolution: "1920x1080",
      codec: "H.264",
      file_size: 15728640,
      quality_score: 95
    }
  },
  {
    id: "2",
    title: "Quality Control Check",
    description: "Step-by-step quality inspection process",
    thumbnail_url: "/api/placeholder/300/200",
    duration: 30,
    status: "approved" as const,
    tags: ["quality", "inspection"],
    author: { full_name: "Sarah Johnson", id: "2" },
    created_at: "2024-01-14T14:20:00Z",
    view_count: 32,
    customer_allocations: ["TechCorp"],
    metadata: {
      resolution: "1920x1080",
      codec: "H.264",
      file_size: 20971520,
      quality_score: 88
    }
  },
  {
    id: "3",
    title: "Maintenance Schedule",
    description: "Weekly maintenance routine for equipment",
    thumbnail_url: "/api/placeholder/300/200",
    duration: 28,
    status: "published" as const,
    tags: ["maintenance", "schedule"],
    author: { full_name: "Mike Chen", id: "3" },
    created_at: "2024-01-13T09:15:00Z",
    view_count: 28,
    customer_allocations: ["Global Manufacturing", "Industrial Solutions"],
    metadata: {
      resolution: "1920x1080",
      codec: "H.264",
      file_size: 18350080,
      quality_score: 92
    }
  },
  {
    id: "4",
    title: "Emergency Shutdown Procedure",
    description: "Critical emergency shutdown steps",
    thumbnail_url: "/api/placeholder/300/200",
    duration: 35,
    status: "draft" as const,
    tags: ["emergency", "safety"],
    author: { full_name: "Lisa Rodriguez", id: "4" },
    created_at: "2024-01-12T16:45:00Z",
    view_count: 0,
    customer_allocations: [],
    metadata: {
      resolution: "1920x1080",
      codec: "H.264",
      file_size: 25165824,
      quality_score: 85
    }
  }
];

export default function ManageContentPage() {
  const [content] = useState(mockContent);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "pending_qa" | "approved" | "published" | "archived">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // const [showBulkActions, setShowBulkActions] = useState(false);

  // const form = useForm<SearchForm>({
  //   resolver: zodResolver(searchSchema),
  // });

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending_qa':
        return <Badge className="bg-warning text-warning-foreground">Pending QA</Badge>;
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'published':
        return <Badge className="bg-primary text-primary-foreground">Published</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'pending_qa':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'published':
        return <Play className="h-4 w-4" />;
      case 'archived':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredContent.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    setSelectedItems([]);
    // setShowBulkActions(false);
  };

  const handleItemAction = (itemId: string, action: string) => {
    console.log(`Action: ${action} on item:`, itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Content</h1>
              <p className="text-muted-foreground">
                Review, approve, and manage training content
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''}
              </Badge>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending_qa" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending_qa")}
              >
                Pending QA
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("published")}
              >
                Published
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card className="mb-6 animate-fade-in-up">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('tag')}>
                      <Tag className="mr-2 h-4 w-4" />
                      Add Tags
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('assign')}>
                      <Users className="mr-2 h-4 w-4" />
                      Assign Customers
                    </Button>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Table */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Allocations</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            <Play className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {item.duration}s
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(item.metadata.file_size)}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                Quality: {item.metadata.quality_score}%
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.author.full_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(item.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {item.view_count.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.customer_allocations.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.customer_allocations.slice(0, 2).map((customer) => (
                                <Badge key={customer} variant="outline" className="text-xs">
                                  {customer}
                                </Badge>
                              ))}
                              {item.customer_allocations.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.customer_allocations.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleItemAction(item.id, 'view')}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleItemAction(item.id, 'edit')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleItemAction(item.id, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleItemAction(item.id, 'reject')}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleItemAction(item.id, 'delete')}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <Card className="animate-fade-in-up">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "No content matches your current filters."
                  : "No content has been uploaded yet."
                }
              </p>
              {(!searchQuery && statusFilter === "all") && (
                <Button>
                  Upload Content
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}