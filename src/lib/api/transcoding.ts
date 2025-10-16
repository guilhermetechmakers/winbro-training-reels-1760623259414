import { api } from '../api';
import type { VideoProcessingJob, TranscodingResult } from '@/types/video';

/**
 * Video Transcoding API endpoints
 */
export const transcodingApi = {
  /**
   * Gets processing job status
   */
  getJobStatus: (jobId: string): Promise<VideoProcessingJob> =>
    api.get<VideoProcessingJob>(`/transcoding/jobs/${jobId}`),

  /**
   * Gets all processing jobs for the current user
   */
  getUserJobs: (): Promise<VideoProcessingJob[]> =>
    api.get<VideoProcessingJob[]>('/transcoding/jobs'),

  /**
   * Cancels a processing job
   */
  cancelJob: (jobId: string): Promise<void> =>
    api.delete<void>(`/transcoding/jobs/${jobId}`),

  /**
   * Retries a failed job
   */
  retryJob: (jobId: string): Promise<VideoProcessingJob> =>
    api.post<VideoProcessingJob>(`/transcoding/jobs/${jobId}/retry`, {}),

  /**
   * Gets transcoding result
   */
  getTranscodingResult: (jobId: string): Promise<TranscodingResult> =>
    api.get<TranscodingResult>(`/transcoding/jobs/${jobId}/result`),

  /**
   * Gets processing queue status
   */
  getQueueStatus: (): Promise<{
    queueLength: number;
    estimatedWaitTime: number;
    activeJobs: number;
  }> =>
    api.get<{
      queueLength: number;
      estimatedWaitTime: number;
      activeJobs: number;
    }>('/transcoding/queue/status'),

  /**
   * Gets supported formats and codecs
   */
  getSupportedFormats: (): Promise<{
    inputFormats: string[];
    outputFormats: string[];
    codecs: string[];
    maxResolution: string;
    maxDuration: number;
  }> =>
    api.get<{
      inputFormats: string[];
      outputFormats: string[];
      codecs: string[];
      maxResolution: string;
      maxDuration: number;
    }>('/transcoding/formats'),

  /**
   * Gets transcoding statistics
   */
  getStats: (): Promise<{
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
  }> =>
    api.get<{
      totalJobs: number;
      completedJobs: number;
      failedJobs: number;
      averageProcessingTime: number;
      totalProcessingTime: number;
    }>('/transcoding/stats'),
};