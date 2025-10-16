import { api } from '../api';
import type {
  InitiateUploadRequest,
  InitiateUploadResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
  UploadStatusResponse,
  VideoProcessingJob
} from '@/types/video';

/**
 * Video Upload API endpoints
 */
export const uploadApi = {
  /**
   * Initiates a chunked upload session
   */
  initiateUpload: (data: InitiateUploadRequest): Promise<InitiateUploadResponse> =>
    api.post<InitiateUploadResponse>('/uploads/initiate', data),

  /**
   * Completes a chunked upload and starts processing
   */
  completeUpload: (uploadId: string, data: CompleteUploadRequest): Promise<CompleteUploadResponse> =>
    api.post<CompleteUploadResponse>(`/uploads/${uploadId}/complete`, data),

  /**
   * Gets the status of an upload
   */
  getUploadStatus: (uploadId: string): Promise<UploadStatusResponse> =>
    api.get<UploadStatusResponse>(`/uploads/${uploadId}/status`),

  /**
   * Gets processing job status
   */
  getProcessingJob: (jobId: string): Promise<VideoProcessingJob> =>
    api.get<VideoProcessingJob>(`/processing/${jobId}`),

  /**
   * Cancels an upload
   */
  cancelUpload: (uploadId: string): Promise<void> =>
    api.delete<void>(`/uploads/${uploadId}`),

  /**
   * Gets all active uploads for the current user
   */
  getActiveUploads: (): Promise<UploadStatusResponse[]> =>
    api.get<UploadStatusResponse[]>('/uploads/active'),

  /**
   * Resumes a failed upload
   */
  resumeUpload: (uploadId: string): Promise<InitiateUploadResponse> =>
    api.post<InitiateUploadResponse>(`/uploads/${uploadId}/resume`, {}),
};