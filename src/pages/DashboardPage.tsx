import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Search,
  Bell,
  Settings,
  Menu,
  ArrowRight,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats, useActivity, useRecentReels, useAssignedCourses } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: stats } = useDashboardStats();
  const { data: activity } = useActivity(5);
  const { data: recentReels } = useRecentReels(6);
  const { data: assignedCourses } = useAssignedCourses();

  // Mock data for demonstration
  const mockStats = {
    total_reels: 1247,
    total_courses: 89,
    total_users: 156,
    total_views: 15420,
    courses_assigned: 12,
    reels_watched_today: 23,
    certificates_earned: 8,
    completion_rate: 87
  };

  const mockActivity = [
    {
      id: "1",
      type: "reel_viewed",
      title: "Safety Protocol - Machine Setup",
      description: "Completed viewing safety procedures",
      created_at: "2024-01-15T10:30:00Z",
      user: { full_name: "John Smith" }
    },
    {
      id: "2", 
      type: "course_completed",
      title: "Advanced Manufacturing Techniques",
      description: "Successfully completed course",
      created_at: "2024-01-15T09:15:00Z",
      user: { full_name: "Sarah Johnson" }
    },
    {
      id: "3",
      type: "certificate_earned", 
      title: "Quality Control Certification",
      description: "Earned new certificate",
      created_at: "2024-01-15T08:45:00Z",
      user: { full_name: "Mike Chen" }
    }
  ];

  const mockRecentReels = [
    {
      id: "1",
      title: "Safety Protocol - Machine Setup",
      description: "Essential safety procedures for machine operation",
      thumbnail_url: "/api/placeholder/300/200",
      duration: 25,
      tags: ["safety", "machine-setup"],
      view_count: 45,
      author: { full_name: "Safety Team" }
    },
    {
      id: "2", 
      title: "Quality Control Check",
      description: "Step-by-step quality inspection process",
      thumbnail_url: "/api/placeholder/300/200",
      duration: 30,
      tags: ["quality", "inspection"],
      view_count: 32,
      author: { full_name: "QC Team" }
    },
    {
      id: "3",
      title: "Maintenance Schedule",
      description: "Weekly maintenance routine for equipment",
      thumbnail_url: "/api/placeholder/300/200", 
      duration: 28,
      tags: ["maintenance", "schedule"],
      view_count: 28,
      author: { full_name: "Maintenance Team" }
    }
  ];

  const mockAssignedCourses = [
    {
      id: "1",
      title: "Safety Fundamentals",
      description: "Core safety training for all employees",
      progress: 75,
      total_reels: 8,
      completed_reels: 6,
      estimated_time: "2 hours"
    },
    {
      id: "2",
      title: "Advanced Manufacturing",
      description: "Advanced techniques and procedures",
      progress: 30,
      total_reels: 12,
      completed_reels: 4,
      estimated_time: "4 hours"
    }
  ];

  const displayStats = stats || mockStats;
  const displayActivity = activity || mockActivity;
  const displayRecentReels = recentReels || mockRecentReels;
  const displayAssignedCourses = assignedCourses || mockAssignedCourses;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Winbro Training</span>
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search reels, courses..."
                    className="pl-10 pr-4 py-2 w-64 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your training today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Assigned</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.courses_assigned}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reels Watched Today</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.reels_watched_today}</div>
              <p className="text-xs text-muted-foreground">
                +5 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.certificates_earned}</div>
              <p className="text-xs text-muted-foreground">
                +1 this month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.completion_rate}%</div>
              <p className="text-xs text-muted-foreground">
                +3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assigned Courses */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assigned Courses</CardTitle>
                    <CardDescription>
                      Continue your learning journey
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/courses">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayAssignedCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{course.completed_reels}/{course.total_reels} reels</span>
                          <span>•</span>
                          <span>{course.estimated_time}</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={course.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {course.progress}% complete
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        {course.progress > 0 ? "Resume" : "Start"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayActivity.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.user.full_name} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Reels */}
        <div className="mt-8">
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reels</CardTitle>
                  <CardDescription>
                    Latest training content available
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/search">Browse All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayRecentReels.map((reel) => (
                  <div key={reel.id} className="group cursor-pointer">
                    <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {reel.duration}s
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {reel.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{reel.author.full_name}</span>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-3 w-3" />
                        <span>{reel.view_count}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {reel.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
