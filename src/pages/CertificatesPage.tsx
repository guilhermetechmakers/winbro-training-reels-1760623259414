import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Download, 
  Eye, 
  Award,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const searchSchema = z.object({
//   query: z.string(),
// });

// type SearchForm = z.infer<typeof searchSchema>;

// Mock certificate data
const mockCertificates = [
  {
    id: "1",
    course: {
      id: "1",
      title: "Safety Fundamentals",
      description: "Core safety training for all employees"
    },
    issued_at: "2024-01-15T10:30:00Z",
    expires_at: "2025-01-15T10:30:00Z",
    verification_url: "https://verify.winbro.com/cert/1",
    pdf_url: "/certificates/safety-fundamentals.pdf",
    status: "active" as const,
    score: 95
  },
  {
    id: "2",
    course: {
      id: "2", 
      title: "Advanced Manufacturing Techniques",
      description: "Advanced manufacturing processes and procedures"
    },
    issued_at: "2024-01-10T14:20:00Z",
    expires_at: "2025-01-10T14:20:00Z",
    verification_url: "https://verify.winbro.com/cert/2",
    pdf_url: "/certificates/advanced-manufacturing.pdf",
    status: "active" as const,
    score: 88
  },
  {
    id: "3",
    course: {
      id: "3",
      title: "Quality Control Standards",
      description: "Quality control procedures and standards"
    },
    issued_at: "2023-12-20T09:15:00Z",
    expires_at: "2024-12-20T09:15:00Z",
    verification_url: "https://verify.winbro.com/cert/3",
    pdf_url: "/certificates/quality-control.pdf",
    status: "expired" as const,
    score: 92
  }
];

export default function CertificatesPage() {
  const [certificates] = useState(mockCertificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");

  // const form = useForm<SearchForm>({
  //   resolver: zodResolver(searchSchema),
  // });

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (certificateId: string) => {
    // Simulate download
    console.log(`Downloading certificate ${certificateId}`);
  };

  const handleView = (certificateId: string) => {
    // Simulate view
    console.log(`Viewing certificate ${certificateId}`);
  };

  const handleVerify = (verificationUrl: string) => {
    window.open(verificationUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'revoked':
        return <Badge variant="outline">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Certificates</h1>
              <p className="text-muted-foreground">
                View and manage your earned training certificates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificates..."
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
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("expired")}
              >
                Expired
              </Button>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <Card className="animate-fade-in-up">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "No certificates match your current filters."
                  : "You haven't earned any certificates yet. Complete some courses to get started!"
                }
              </p>
              {(!searchQuery && statusFilter === "all") && (
                <Button>
                  Browse Courses
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredCertificates.map((certificate, index) => (
              <Card key={certificate.id} className={`animate-fade-in-up ${isExpiringSoon(certificate.expires_at) ? 'border-warning' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{certificate.course.title}</CardTitle>
                          <CardDescription>{certificate.course.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Issued {formatDate(certificate.issued_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Expires {formatDate(certificate.expires_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Score: {certificate.score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(certificate.status)}
                      {isExpiringSoon(certificate.expires_at) && certificate.status === 'active' && (
                        <Badge variant="outline" className="border-warning text-warning">
                          Expires Soon
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(certificate.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Certificate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(certificate.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVerify(certificate.verification_url)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Verify Online
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleView(certificate.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleDownload(certificate.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleVerify(certificate.verification_url)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                  </div>
                  
                  {isExpiringSoon(certificate.expires_at) && certificate.status === 'active' && (
                    <Alert className="mt-4 border-warning">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This certificate expires soon. Consider renewing by retaking the course.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredCertificates.length > 0 && (
          <Card className="mt-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle>Certificate Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {certificates.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {Math.round(certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {certificates.filter(c => isExpiringSoon(c.expires_at) && c.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Expiring Soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}