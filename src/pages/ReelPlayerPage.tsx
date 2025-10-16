import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Volume2, Settings, Bookmark, Share, Download, Flag } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ReelPlayerPage() {
  const { id } = useParams();
  console.log('Reel ID:', id); // Use the id variable to avoid unused warning

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="w-16 h-16 rounded-full">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded px-3 py-2 text-white text-sm">
                      <div className="flex items-center justify-between">
                        <span>0:00 / 0:25</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold mb-2">Safety Protocol - Machine Setup</h1>
              <p className="text-muted-foreground mb-4">
                Essential safety procedures for machine operation and setup. This video covers the critical steps 
                that must be followed before starting any manufacturing equipment.
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">By:</span>
                  <span className="text-sm font-medium">Safety Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm font-medium">25 seconds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Views:</span>
                  <span className="text-sm font-medium">45</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Button size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">safety</Badge>
                <Badge variant="secondary">machine-setup</Badge>
                <Badge variant="secondary">protocols</Badge>
                <Badge variant="secondary">manufacturing</Badge>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transcript */}
            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>
                  Click on any timestamp to jump to that part of the video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transcript" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="search">Search</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcript" className="mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-muted-foreground font-mono text-xs">0:00</span>
                        <span>Before starting any machine, ensure all safety equipment is properly worn.</span>
                      </div>
                      <div className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-muted-foreground font-mono text-xs">0:05</span>
                        <span>Check that emergency stops are accessible and functioning.</span>
                      </div>
                      <div className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-muted-foreground font-mono text-xs">0:10</span>
                        <span>Verify all guards and safety devices are in place.</span>
                      </div>
                      <div className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-muted-foreground font-mono text-xs">0:15</span>
                        <span>Confirm the work area is clear of obstructions.</span>
                      </div>
                      <div className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-muted-foreground font-mono text-xs">0:20</span>
                        <span>Only then may you proceed with machine startup.</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="search" className="mt-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Search in transcript..."
                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      />
                      <div className="text-sm text-muted-foreground">
                        Search results will appear here
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Machine Model:</span>
                  <p className="text-sm text-muted-foreground">CNC-2000 Series</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Process Step:</span>
                  <p className="text-sm text-muted-foreground">Pre-Operation Setup</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Tooling:</span>
                  <p className="text-sm text-muted-foreground">Safety Equipment, Emergency Stops</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Upload Date:</span>
                  <p className="text-sm text-muted-foreground">January 15, 2024</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Quality Score:</span>
                  <p className="text-sm text-muted-foreground">95/100</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Reels */}
            <Card>
              <CardHeader>
                <CardTitle>Related Reels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 cursor-pointer hover:bg-muted p-2 rounded">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Play className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Machine Shutdown Procedures</p>
                      <p className="text-xs text-muted-foreground">20s • 32 views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer hover:bg-muted p-2 rounded">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Play className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Emergency Response Protocol</p>
                      <p className="text-xs text-muted-foreground">30s • 28 views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer hover:bg-muted p-2 rounded">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Play className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Daily Maintenance Checklist</p>
                      <p className="text-xs text-muted-foreground">35s • 41 views</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
