import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Clock, 
  Eye, 
  Tag, 
  Settings,
  Share2,
  Bookmark,
  Download,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/videoValidation';
import type { Reel } from '@/types/video';

interface MetadataSidebarProps {
  reel: Reel;
  onBookmark?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onReport?: () => void;
  onAddToCourse?: () => void;
  className?: string;
}

export function MetadataSidebar({
  reel,
  onBookmark,
  onShare,
  onDownload,
  onReport,
  onAddToCourse,
  className
}: MetadataSidebarProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className={cn('space-y-4', className)}>
      {/* Basic Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold line-clamp-2">{reel.title}</h2>
          
          {reel.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {reel.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(reel.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{reel.viewCount} views</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
              className="flex items-center space-x-1"
            >
              <Bookmark className="h-4 w-4" />
              <span>Bookmark</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex items-center space-x-1"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddToCourse}
              className="flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span>Add to Course</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tags */}
      {reel.tags.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {reel.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Machine & Process Info */}
      {(reel.machineModel || reel.processStep || reel.tooling.length > 0) && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Technical Details</h3>
            
            {reel.machineModel && (
              <div>
                <label className="text-xs text-muted-foreground">Machine Model</label>
                <p className="text-sm font-medium">{reel.machineModel}</p>
              </div>
            )}

            {reel.processStep && (
              <div>
                <label className="text-xs text-muted-foreground">Process Step</label>
                <p className="text-sm font-medium">{reel.processStep}</p>
              </div>
            )}

            {reel.tooling.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground">Tooling Used</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {reel.tooling.map((tool, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Author Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Author</h3>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {reel.author.full_name || reel.author.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {reel.author.role}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(reel.createdAt)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDate(reel.updatedAt)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={
                  reel.status === 'published' ? 'default' :
                  reel.status === 'approved' ? 'default' :
                  reel.status === 'pending_qa' ? 'secondary' :
                  'outline'
                }
                className="text-xs"
              >
                {reel.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Privacy</span>
              <Badge
                variant="outline"
                className="text-xs"
              >
                {reel.privacy.toUpperCase()}
              </Badge>
            </div>

            {reel.metadata && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span>{reel.metadata.resolution}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Size</span>
                  <span>
                    {reel.metadata.fileSize > 1024 * 1024
                      ? `${(reel.metadata.fileSize / (1024 * 1024)).toFixed(1)} MB`
                      : `${(reel.metadata.fileSize / 1024).toFixed(1)} KB`
                    }
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Customer Allocations */}
      {reel.customerAllocations.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Customer Access</h3>
            <div className="space-y-1">
              {reel.customerAllocations.map((allocation, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                >
                  {allocation}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Report Button */}
      <Card className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onReport}
          className="w-full text-destructive hover:text-destructive"
        >
          <Flag className="h-4 w-4 mr-1" />
          Report Issue
        </Button>
      </Card>
    </div>
  );
}