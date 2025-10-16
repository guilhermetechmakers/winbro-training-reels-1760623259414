import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileVideo, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProcessingStatus } from '@/hooks/useTranscoding';

interface ProcessingStatusProps {
  jobId: string;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function ProcessingStatus({ 
  jobId, 
  onRetry, 
  onCancel,
  className 
}: ProcessingStatusProps) {
  const {
    job,
    isLoading,
    error,
    statusMessage,
    progressPercentage,
    isComplete,
    isError,
    isProcessing,
    estimatedCompletion
  } = useProcessingStatus(jobId);

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (isError) return <AlertCircle className="h-5 w-5 text-destructive" />;
    if (isComplete) return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (isProcessing) return <FileVideo className="h-5 w-5 text-primary" />;
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };


  const getStatusBadgeVariant = () => {
    if (isError) return 'destructive';
    if (isComplete) return 'default';
    if (isProcessing) return 'secondary';
    return 'outline';
  };

  const formatEstimatedTime = (estimatedCompletion?: string) => {
    if (!estimatedCompletion) return null;
    
    try {
      const completionTime = new Date(estimatedCompletion);
      const now = new Date();
      const diffMs = completionTime.getTime() - now.getTime();
      
      if (diffMs <= 0) return 'Almost done...';
      
      const diffMinutes = Math.ceil(diffMs / (1000 * 60));
      
      if (diffMinutes < 1) return 'Less than a minute';
      if (diffMinutes === 1) return 'About 1 minute';
      if (diffMinutes < 60) return `About ${diffMinutes} minutes`;
      
      const diffHours = Math.ceil(diffMinutes / 60);
      if (diffHours === 1) return 'About 1 hour';
      return `About ${diffHours} hours`;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading processing status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">Failed to load processing status</span>
        </div>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">Processing job not found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium">Processing Video</h3>
            <p className="text-sm text-muted-foreground">
              {statusMessage}
            </p>
          </div>
        </div>
        
        <Badge variant={getStatusBadgeVariant()}>
          {job.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Estimated Time */}
      {isProcessing && estimatedCompletion && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatEstimatedTime(estimatedCompletion)}</span>
        </div>
      )}

      {/* Processing Steps */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Processing Steps</h4>
        <div className="space-y-2">
          {[
            { key: 'queued', label: 'Queued for processing' },
            { key: 'processing', label: 'Initial processing' },
            { key: 'transcoding', label: 'Converting to HLS format' },
            { key: 'transcribing', label: 'Generating transcript' },
            { key: 'tagging', label: 'Analyzing content and generating tags' },
            { key: 'complete', label: 'Processing complete' }
          ].map((step) => {
            const isActive = job.status === step.key;
            const isCompleted = (job.status as string) === 'complete' || 
              (step.key === 'queued' && job.status !== 'queued') ||
              (step.key === 'processing' && ['transcoding', 'transcribing', 'tagging', 'complete'].includes(job.status as string)) ||
              (step.key === 'transcoding' && ['transcribing', 'tagging', 'complete'].includes(job.status as string)) ||
              (step.key === 'transcribing' && ['tagging', 'complete'].includes(job.status as string)) ||
              (step.key === 'tagging' && (job.status as string) === 'complete');

            return (
              <div
                key={step.key}
                className={cn(
                  'flex items-center space-x-3 text-sm',
                  isCompleted && 'text-success',
                  isActive && !isCompleted && 'text-primary',
                  !isActive && !isCompleted && 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  isCompleted && 'bg-success',
                  isActive && !isCompleted && 'bg-primary',
                  !isActive && !isCompleted && 'bg-muted'
                )} />
                <span>{step.label}</span>
                {isActive && !isCompleted && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {isError && job.error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">Error Details</p>
          <p className="text-sm text-destructive mt-1">{job.error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {isError && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        )}
        
        {isProcessing && onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
        )}
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">
              Video processing completed successfully!
            </span>
          </div>
          <p className="text-sm text-success/80 mt-1">
            Your reel is now ready for viewing and sharing.
          </p>
        </div>
      )}
    </Card>
  );
}