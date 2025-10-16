// Video Upload Types
export interface VideoUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'transcoding' | 'complete' | 'error';
  chunks: UploadChunk[];
  error?: string;
  uploadId?: string;
  reelId?: string;
}

export interface UploadChunk {
  chunkNumber: number;
  etag: string;
  size: number;
  uploaded: boolean;
}

// Video Processing Types
export interface VideoProcessingJob {
  id: string;
  uploadId: string;
  status: 'queued' | 'processing' | 'transcoding' | 'transcribing' | 'tagging' | 'complete' | 'error';
  progress: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedCompletion?: string;
}

export interface TranscodingResult {
  hlsUrl: string;
  thumbnailUrl: string;
  duration: number;
  resolution: string;
  codec: string;
  fileSize: number;
}

// Transcript Types
export interface Transcript {
  id: string;
  text: string;
  segments: TranscriptSegment[];
  confidence: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
}

// Video Player Types
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  captionsEnabled: boolean;
  quality: string;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  toggleCaptions: () => void;
  setQuality: (quality: string) => void;
}

// Upload API Types
export interface InitiateUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  chunkCount: number;
}

export interface InitiateUploadResponse {
  uploadId: string;
  chunkUrls: string[];
  expiresAt: string;
}

export interface CompleteUploadRequest {
  uploadId: string;
  chunks: { chunkNumber: number; etag: string; }[];
}

export interface CompleteUploadResponse {
  success: boolean;
  reelId?: string;
  processingJobId?: string;
}

export interface UploadStatusResponse {
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  reelId?: string;
  error?: string;
  processingJob?: VideoProcessingJob;
}

// Reel API Types
export interface CreateReelRequest {
  uploadId: string;
  title: string;
  description?: string;
  tags: string[];
  machineModel?: string;
  processStep?: string;
  tooling: string[];
  privacy: 'internal' | 'customer' | 'public';
  customerAllocations?: string[];
}

export interface CreateReelResponse {
  reel: Reel;
  processingJob: VideoProcessingJob;
}

export interface GetReelResponse {
  reel: Reel;
  playbackUrl: string;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canShare: boolean;
}

export interface UpdateTranscriptRequest {
  transcript: string;
  segments: TranscriptSegment[];
}

export interface UpdateTranscriptResponse {
  success: boolean;
  transcript: Transcript;
}

// Enhanced Reel Type (extends existing)
export interface Reel {
  id: string;
  title: string;
  description?: string;
  duration: number;
  hlsUrl: string;
  thumbnailUrl: string;
  transcript?: Transcript;
  tags: Tag[];
  machineModel?: string;
  processStep?: string;
  tooling: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'pending_qa' | 'approved' | 'published' | 'archived';
  privacy: 'internal' | 'customer' | 'public';
  customerAllocations: string[];
  viewCount: number;
  metadata: ReelMetadata;
  processingJob?: VideoProcessingJob;
}

export interface Tag {
  id: string;
  name: string;
  category: 'process' | 'machine' | 'tooling' | 'general';
  color?: string;
  createdAt: string;
}

export interface ReelMetadata {
  resolution: string;
  codec: string;
  fileSize: number;
  uploadSource: string;
  qualityScore?: number;
  originalFilename: string;
  s3Key: string;
  hlsManifestKey: string;
  thumbnailKey: string;
}

// Video Validation Types
export interface VideoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duration?: number;
  fileSize?: number;
  resolution?: string;
  codec?: string;
}

export interface VideoValidationRules {
  maxFileSize: number; // in bytes
  maxDuration: number; // in seconds
  minDuration: number; // in seconds
  allowedFormats: string[];
  allowedCodecs: string[];
  maxResolution: string;
}

// Chunked Upload Types
export interface ChunkedUploadConfig {
  chunkSize: number;
  maxConcurrentChunks: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ChunkUploadProgress {
  chunkNumber: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Video Search Types
export interface VideoSearchFilters {
  query?: string;
  tags?: string[];
  machineModels?: string[];
  processSteps?: string[];
  durationMin?: number;
  durationMax?: number;
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: string[];
  privacy?: string[];
}

export interface VideoSearchResult {
  reels: Reel[];
  total: number;
  page: number;
  limit: number;
  facets: VideoSearchFacets;
}

export interface VideoSearchFacets {
  tags: FacetItem[];
  machineModels: FacetItem[];
  processSteps: FacetItem[];
  authors: FacetItem[];
  durations: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  label?: string;
}

// Video Analytics Types
export interface VideoAnalytics {
  reelId: string;
  views: number;
  uniqueViews: number;
  averageWatchTime: number;
  completionRate: number;
  dropOffPoints: number[];
  popularSegments: {
    start: number;
    end: number;
    views: number;
  }[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserBreakdown: Record<string, number>;
  lastUpdated: string;
}

// Video Comments and Annotations
export interface VideoComment {
  id: string;
  reelId: string;
  userId: string;
  user: User;
  text: string;
  timestamp?: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  replies: VideoComment[];
}

export interface VideoAnnotation {
  id: string;
  reelId: string;
  userId: string;
  user: User;
  startTime: number;
  endTime: number;
  text: string;
  type: 'note' | 'highlight' | 'question';
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Import existing types
import type { User } from './index';