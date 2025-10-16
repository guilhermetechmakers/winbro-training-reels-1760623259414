import { api } from '../api';
import type {
  CreateReelRequest,
  CreateReelResponse,
  GetReelResponse,
  UpdateTranscriptRequest,
  UpdateTranscriptResponse,
  Reel,
  VideoSearchFilters,
  VideoSearchResult,
  VideoAnalytics,
  VideoComment,
  VideoAnnotation
} from '@/types/video';

/**
 * Reels API endpoints
 */
export const reelsApi = {
  /**
   * Creates a new reel from an upload
   */
  createReel: (data: CreateReelRequest): Promise<CreateReelResponse> =>
    api.post<CreateReelResponse>('/reels', data),

  /**
   * Gets a reel by ID with playback URL
   */
  getReel: (id: string): Promise<GetReelResponse> =>
    api.get<GetReelResponse>(`/reels/${id}`),

  /**
   * Updates reel metadata
   */
  updateReel: (id: string, updates: Partial<CreateReelRequest>): Promise<Reel> =>
    api.put<Reel>(`/reels/${id}`, updates),

  /**
   * Deletes a reel
   */
  deleteReel: (id: string): Promise<void> =>
    api.delete<void>(`/reels/${id}`),

  /**
   * Updates reel transcript
   */
  updateTranscript: (id: string, data: UpdateTranscriptRequest): Promise<UpdateTranscriptResponse> =>
    api.put<UpdateTranscriptResponse>(`/reels/${id}/transcript`, data),

  /**
   * Gets reel transcript
   */
  getTranscript: (id: string): Promise<{ transcript: string; segments: any[] }> =>
    api.get<{ transcript: string; segments: any[] }>(`/reels/${id}/transcript`),

  /**
   * Searches reels with filters
   */
  searchReels: (filters: VideoSearchFilters = {}): Promise<VideoSearchResult> =>
    api.post<VideoSearchResult>('/reels/search', filters),

  /**
   * Gets reel analytics
   */
  getAnalytics: (id: string): Promise<VideoAnalytics> =>
    api.get<VideoAnalytics>(`/reels/${id}/analytics`),

  /**
   * Records a view
   */
  recordView: (id: string, timestamp?: number): Promise<void> =>
    api.post<void>(`/reels/${id}/view`, { timestamp }),

  /**
   * Bookmarks a reel
   */
  bookmarkReel: (id: string): Promise<void> =>
    api.post<void>(`/reels/${id}/bookmark`, {}),

  /**
   * Removes bookmark
   */
  removeBookmark: (id: string): Promise<void> =>
    api.delete<void>(`/reels/${id}/bookmark`),

  /**
   * Gets bookmarked reels
   */
  getBookmarks: (): Promise<Reel[]> =>
    api.get<Reel[]>('/reels/bookmarks'),

  /**
   * Shares a reel
   */
  shareReel: (id: string, permissions: { canDownload: boolean; expiresAt?: string }): Promise<{ shareUrl: string }> =>
    api.post<{ shareUrl: string }>(`/reels/${id}/share`, permissions),

  /**
   * Gets reel comments
   */
  getComments: (id: string): Promise<VideoComment[]> =>
    api.get<VideoComment[]>(`/reels/${id}/comments`),

  /**
   * Adds a comment
   */
  addComment: (id: string, comment: { text: string; timestamp?: number; isPrivate: boolean }): Promise<VideoComment> =>
    api.post<VideoComment>(`/reels/${id}/comments`, comment),

  /**
   * Updates a comment
   */
  updateComment: (id: string, commentId: string, updates: { text: string }): Promise<VideoComment> =>
    api.put<VideoComment>(`/reels/${id}/comments/${commentId}`, updates),

  /**
   * Deletes a comment
   */
  deleteComment: (id: string, commentId: string): Promise<void> =>
    api.delete<void>(`/reels/${id}/comments/${commentId}`),

  /**
   * Gets reel annotations
   */
  getAnnotations: (id: string): Promise<VideoAnnotation[]> =>
    api.get<VideoAnnotation[]>(`/reels/${id}/annotations`),

  /**
   * Adds an annotation
   */
  addAnnotation: (id: string, annotation: {
    startTime: number;
    endTime: number;
    text: string;
    type: 'note' | 'highlight' | 'question';
    isPrivate: boolean;
  }): Promise<VideoAnnotation> =>
    api.post<VideoAnnotation>(`/reels/${id}/annotations`, annotation),

  /**
   * Updates an annotation
   */
  updateAnnotation: (id: string, annotationId: string, updates: {
    text?: string;
    startTime?: number;
    endTime?: number;
  }): Promise<VideoAnnotation> =>
    api.put<VideoAnnotation>(`/reels/${id}/annotations/${annotationId}`, updates),

  /**
   * Deletes an annotation
   */
  deleteAnnotation: (id: string, annotationId: string): Promise<void> =>
    api.delete<void>(`/reels/${id}/annotations/${annotationId}`),

  /**
   * Gets related reels
   */
  getRelatedReels: (id: string, limit: number = 5): Promise<Reel[]> =>
    api.get<Reel[]>(`/reels/${id}/related?limit=${limit}`),

  /**
   * Gets reel tags suggestions
   */
  getTagSuggestions: (query: string): Promise<string[]> =>
    api.get<string[]>(`/reels/tags/suggestions?q=${encodeURIComponent(query)}`),

  /**
   * Gets machine models
   */
  getMachineModels: (): Promise<string[]> =>
    api.get<string[]>('/reels/machine-models'),

  /**
   * Gets process steps
   */
  getProcessSteps: (): Promise<string[]> =>
    api.get<string[]>('/reels/process-steps'),

  /**
   * Gets tooling options
   */
  getToolingOptions: (): Promise<string[]> =>
    api.get<string[]>('/reels/tooling-options'),
};