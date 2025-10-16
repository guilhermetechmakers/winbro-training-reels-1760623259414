import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transcodingApi } from '@/lib/api/transcoding';

/**
 * Hook for monitoring transcoding jobs
 */
export function useTranscodingJob(jobId: string) {
  return useQuery({
    queryKey: ['transcoding', 'jobs', jobId],
    queryFn: () => transcodingApi.getJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Stop polling if job is complete or failed
      if (query.state.data?.status === 'complete' || query.state.data?.status === 'error') {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    refetchIntervalInBackground: true
  });
}

/**
 * Hook for getting user's transcoding jobs
 */
export function useUserTranscodingJobs() {
  return useQuery({
    queryKey: ['transcoding', 'jobs', 'user'],
    queryFn: () => transcodingApi.getUserJobs(),
    refetchInterval: 10000, // Poll every 10 seconds
    refetchIntervalInBackground: true
  });
}

/**
 * Hook for transcoding queue status
 */
export function useTranscodingQueue() {
  return useQuery({
    queryKey: ['transcoding', 'queue'],
    queryFn: () => transcodingApi.getQueueStatus(),
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: true
  });
}

/**
 * Hook for transcoding statistics
 */
export function useTranscodingStats() {
  return useQuery({
    queryKey: ['transcoding', 'stats'],
    queryFn: () => transcodingApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for supported formats
 */
export function useSupportedFormats() {
  return useQuery({
    queryKey: ['transcoding', 'formats'],
    queryFn: () => transcodingApi.getSupportedFormats(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook for transcoding actions
 */
export function useTranscodingActions() {
  const queryClient = useQueryClient();

  // Cancel job mutation
  const cancelJob = useMutation({
    mutationFn: (jobId: string) => transcodingApi.cancelJob(jobId),
    onSuccess: (_, jobId) => {
      toast.success('Transcoding job cancelled');
      queryClient.invalidateQueries({ queryKey: ['transcoding', 'jobs', jobId] });
      queryClient.invalidateQueries({ queryKey: ['transcoding', 'jobs', 'user'] });
    },
    onError: (error) => {
      toast.error(`Failed to cancel job: ${error.message}`);
    }
  });

  // Retry job mutation
  const retryJob = useMutation({
    mutationFn: (jobId: string) => transcodingApi.retryJob(jobId),
    onSuccess: (_, jobId) => {
      toast.success('Transcoding job restarted');
      queryClient.invalidateQueries({ queryKey: ['transcoding', 'jobs', jobId] });
      queryClient.invalidateQueries({ queryKey: ['transcoding', 'jobs', 'user'] });
    },
    onError: (error) => {
      toast.error(`Failed to retry job: ${error.message}`);
    }
  });

  return {
    cancelJob: cancelJob.mutate,
    isCancelling: cancelJob.isPending,
    retryJob: retryJob.mutate,
    isRetrying: retryJob.isPending
  };
}

/**
 * Hook for getting transcoding result
 */
export function useTranscodingResult(jobId: string) {
  return useQuery({
    queryKey: ['transcoding', 'jobs', jobId, 'result'],
    queryFn: () => transcodingApi.getTranscodingResult(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Utility hook for processing job status
 */
export function useProcessingStatus(jobId: string) {
  const { data: job, isLoading, error } = useTranscodingJob(jobId);

  const getStatusMessage = () => {
    if (!job) return 'Unknown status';
    
    switch (job.status) {
      case 'queued':
        return 'Waiting in queue...';
      case 'processing':
        return 'Processing video...';
      case 'transcoding':
        return 'Converting to HLS format...';
      case 'transcribing':
        return 'Generating transcript...';
      case 'tagging':
        return 'Analyzing content and generating tags...';
      case 'complete':
        return 'Processing complete!';
      case 'error':
        return `Processing failed: ${job.error || 'Unknown error'}`;
      default:
        return 'Processing...';
    }
  };

  const getProgressPercentage = () => {
    if (!job) return 0;
    return Math.round(job.progress);
  };

  const isComplete = job?.status === 'complete';
  const isError = job?.status === 'error';
  const isProcessing = job?.status === 'processing' || job?.status === 'transcoding' || job?.status === 'transcribing' || job?.status === 'tagging';

  return {
    job,
    isLoading,
    error,
    statusMessage: getStatusMessage(),
    progressPercentage: getProgressPercentage(),
    isComplete,
    isError,
    isProcessing,
    estimatedCompletion: job?.estimatedCompletion
  };
}