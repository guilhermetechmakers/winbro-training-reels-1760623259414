import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Play, Settings, Save, Eye } from "lucide-react";

export default function CourseBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Builder</h1>
          <p className="text-muted-foreground">
            Create and organize training courses with drag-and-drop reels
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Configure your course details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" placeholder="Enter course title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter course description" />
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input id="audience" placeholder="e.g., All employees, Safety team" />
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Drag and drop reels to build your course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Module 1 */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Module 1: Safety Fundamentals</h3>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded bg-muted/50">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Safety Protocol - Machine Setup</p>
                          <p className="text-xs text-muted-foreground">25s • Required</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded bg-muted/50">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Emergency Response Protocol</p>
                          <p className="text-xs text-muted-foreground">30s • Required</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 2 */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Module 2: Quality Control</h3>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded bg-muted/50">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Quality Control Check</p>
                          <p className="text-xs text-muted-foreground">30s • Required</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Module Button */}
                  <Button variant="outline" className="w-full h-20 border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
