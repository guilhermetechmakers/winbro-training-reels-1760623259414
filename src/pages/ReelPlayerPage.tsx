import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HLSPlayer } from '@/components/VideoPlayer/HLSPlayer';
import { TranscriptPanel } from '@/components/VideoPlayer/TranscriptPanel';
import { MetadataSidebar } from '@/components/VideoPlayer/MetadataSidebar';
import { useReel, useReelActions, useReelComments, useReelCommentsActions } from '@/hooks/useReel';

export default function ReelPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isViewRecorded, setIsViewRecorded] = useState(false);

  const { data: reelData, isLoading, error } = useReel(id!);
  const { recordView, bookmarkReel, shareReel } = useReelActions();
  const { data: comments } = useReelComments(id!);
  const { } = useReelCommentsActions();

  // Record view when video starts playing
  useEffect(() => {
    if (reelData && !isViewRecorded) {
      recordView({ id: id!, timestamp: currentTime });
      setIsViewRecorded(true);
    }
  }, [reelData, isViewRecorded, recordView, id, currentTime]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleBookmark = () => {
    if (reelData) {
      // This would need to be implemented based on bookmark state
      bookmarkReel(id!);
    }
  };

  const handleShare = () => {
    if (reelData) {
      shareReel({
        id: id!,
        permissions: { canDownload: false }
      });
    }
  };

  const handleDownload = () => {
    // Download logic would go here
    console.log('Download requested');
  };

  const handleReport = () => {
    // Report logic would go here
    console.log('Report requested');
  };

  const handleAddToCourse = () => {
    // Add to course logic would go here
    console.log('Add to course requested');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading reel...</p>
        </div>
      </div>
    );
  }

  if (error || !reelData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Reel Not Found</h2>
          <p className="text-muted-foreground">
            The reel you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { reel, playbackUrl } = reelData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold line-clamp-1">{reel.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {reel.author.full_name || reel.author.email} • {reel.viewCount} views
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <HLSPlayer
              src={playbackUrl}
              poster={reel.thumbnailUrl}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => {
                if (!isViewRecorded) {
                  recordView({ id: id!, timestamp: currentTime });
                  setIsViewRecorded(true);
                }
              }}
              className="w-full"
            />

            {/* Video Description */}
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{reel.title}</h2>
                
                {reel.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {reel.description}
                  </p>
                )}

                {/* Tags */}
                {reel.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reel.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Comments Section */}
            {comments && comments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">
                          {comment.user.full_name?.[0] || comment.user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {comment.user.full_name || comment.user.email}
                          </span>
                          {comment.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(comment.timestamp / 60)}:{(comment.timestamp % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transcript */}
            {reel.transcript && (
              <TranscriptPanel
                transcript={reel.transcript}
                currentTime={currentTime}
                onSeek={handleSeek}
                className="h-96"
              />
            )}

            {/* Metadata */}
            <MetadataSidebar
              reel={reel}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onDownload={handleDownload}
              onReport={handleReport}
              onAddToCourse={handleAddToCourse}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
