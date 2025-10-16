import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Play, 
  BookOpen, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Settings,
  BarChart3,
  Activity,
  AlertCircle,
  Edit
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data
const mockStats = {
  total_reels: 1247,
  total_courses: 89,
  total_users: 156,
  total_views: 15420,
  pending_qa: 23,
  active_uploads: 5,
  system_health: 98,
  storage_used: 2.4,
  storage_total: 10
};

const mockRecentActivity = [
  {
    id: "1",
    type: "reel_uploaded",
    title: "Safety Protocol - Machine Setup",
    user: "John Smith",
    timestamp: "2024-01-15T10:30:00Z",
    status: "pending_qa"
  },
  {
    id: "2",
    type: "course_completed",
    title: "Advanced Manufacturing Techniques",
    user: "Sarah Johnson",
    timestamp: "2024-01-15T09:15:00Z",
    status: "completed"
  },
  {
    id: "3",
    type: "reel_approved",
    title: "Quality Control Check",
    user: "Mike Chen",
    timestamp: "2024-01-15T08:45:00Z",
    status: "approved"
  },
  {
    id: "4",
    type: "user_registered",
    title: "New user registration",
    user: "Lisa Rodriguez",
    timestamp: "2024-01-15T08:30:00Z",
    status: "completed"
  }
];

const mockContentPipeline = [
  {
    id: "1",
    title: "Safety Protocol - Machine Setup",
    author: "John Smith",
    status: "pending_qa",
    created_at: "2024-01-15T10:30:00Z",
    priority: "high"
  },
  {
    id: "2",
    title: "Emergency Procedures",
    author: "Sarah Johnson",
    status: "pending_qa",
    created_at: "2024-01-15T09:15:00Z",
    priority: "medium"
  },
  {
    id: "3",
    title: "Maintenance Checklist",
    author: "Mike Chen",
    status: "draft",
    created_at: "2024-01-15T08:45:00Z",
    priority: "low"
  }
];

const mockUserOverview = [
  {
    role: "Operators",
    count: 89,
    active: 67,
    color: "#0B5FFF"
  },
  {
    role: "Trainers",
    count: 23,
    active: 18,
    color: "#00A676"
  },
  {
    role: "Admins",
    count: 8,
    active: 8,
    color: "#0EA5E9"
  },
  {
    role: "Curators",
    count: 12,
    active: 10,
    color: "#F59E0B"
  }
];

const mockSystemHealth = [
  { name: "CPU", value: 45, status: "good" },
  { name: "Memory", value: 67, status: "good" },
  { name: "Storage", value: 24, status: "good" },
  { name: "Network", value: 89, status: "excellent" }
];

const mockViewsData = [
  { name: "Jan", views: 1200 },
  { name: "Feb", views: 1900 },
  { name: "Mar", views: 3000 },
  { name: "Apr", views: 2800 },
  { name: "May", views: 1890 },
  { name: "Jun", views: 2390 },
  { name: "Jul", views: 3490 }
];

const mockCourseCompletions = [
  { name: "Safety Fundamentals", completions: 45, total: 50 },
  { name: "Quality Control", completions: 32, total: 40 },
  { name: "Advanced Manufacturing", completions: 28, total: 35 },
  { name: "Emergency Procedures", completions: 15, total: 20 }
];

export default function AdminDashboardPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_qa':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                System overview and operational insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                Full Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reels</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_reels.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_courses}</div>
              <p className="text-xs text-muted-foreground">
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_users}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>
                Current system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {mockSystemHealth.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm text-muted-foreground">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        metric.status === 'excellent' ? 'bg-success' :
                        metric.status === 'good' ? 'bg-primary' :
                        'bg-warning'
                      }`} />
                      <span className="text-xs text-muted-foreground capitalize">{metric.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Pending QA</p>
                    <p className="text-xs text-muted-foreground">{mockStats.pending_qa} items</p>
                  </div>
                </div>
                <Badge variant="outline">{mockStats.pending_qa}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Active Uploads</p>
                    <p className="text-xs text-muted-foreground">{mockStats.active_uploads} in progress</p>
                  </div>
                </div>
                <Badge variant="outline">{mockStats.active_uploads}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Storage Usage</p>
                    <p className="text-xs text-muted-foreground">
                      {mockStats.storage_used}GB / {mockStats.storage_total}GB
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {Math.round((mockStats.storage_used / mockStats.storage_total) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>
                Daily view count for the last 7 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#0B5FFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>
                Active users by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockUserOverview}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="active"
                  >
                    {mockUserOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {mockUserOverview.map((role) => (
                  <div key={role.role} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span>{role.role}</span>
                    </div>
                    <span className="font-medium">{role.active}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Pipeline & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Pipeline</CardTitle>
                  <CardDescription>
                    Items pending review and approval
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContentPipeline.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          by {item.author} • {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(item.priority)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system events and user actions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Completions */}
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Course Completion Progress</CardTitle>
            <CardDescription>
              Completion rates for active courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourseCompletions.map((course) => (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{course.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.completions}/{course.total} ({Math.round((course.completions / course.total) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(course.completions / course.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}