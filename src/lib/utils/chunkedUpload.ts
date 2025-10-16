import type { 
  ChunkedUploadConfig, 
  VideoUpload 
} from '@/types/video';

// Default configuration for chunked uploads
export const DEFAULT_CHUNK_CONFIG: ChunkedUploadConfig = {
  chunkSize: 5 * 1024 * 1024, // 5MB chunks
  maxConcurrentChunks: 3,
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
};

/**
 * Chunked upload manager for large video files
 */
export class ChunkedUploadManager {
  private config: ChunkedUploadConfig;
  private activeUploads: Map<string, VideoUpload> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: ChunkedUploadConfig = DEFAULT_CHUNK_CONFIG) {
    this.config = config;
  }

  /**
   * Starts a chunked upload for a video file
   */
  async startUpload(
    file: File,
    uploadId: string,
    chunkUrls: string[],
    onProgress?: (upload: VideoUpload) => void,
    onChunkProgress?: (chunkNumber: number, progress: number) => void
  ): Promise<VideoUpload> {
    const chunks = this.createChunks(file);
    const upload: VideoUpload = {
      id: uploadId,
      file,
      progress: 0,
      status: 'uploading',
      chunks: chunks.map((_, index) => ({
        chunkNumber: index + 1,
        etag: '',
        size: chunks[index].size,
        uploaded: false
      }))
    };

    this.activeUploads.set(uploadId, upload);
    
    const abortController = new AbortController();
    this.abortControllers.set(uploadId, abortController);

    try {
      await this.uploadChunks(upload, chunks, chunkUrls, onProgress, onChunkProgress);
      
      upload.status = 'complete';
      upload.progress = 100;
      onProgress?.(upload);
      
      return upload;
    } catch (error) {
      upload.status = 'error';
      upload.error = error instanceof Error ? error.message : 'Upload failed';
      onProgress?.(upload);
      throw error;
    } finally {
      this.abortControllers.delete(uploadId);
    }
  }

  /**
   * Aborts an active upload
   */
  abortUpload(uploadId: string): void {
    const controller = this.abortControllers.get(uploadId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(uploadId);
    }

    const upload = this.activeUploads.get(uploadId);
    if (upload) {
      upload.status = 'error';
      upload.error = 'Upload aborted by user';
    }
  }

  /**
   * Gets the current status of an upload
   */
  getUploadStatus(uploadId: string): VideoUpload | undefined {
    return this.activeUploads.get(uploadId);
  }

  /**
   * Cleans up completed uploads
   */
  cleanupUpload(uploadId: string): void {
    this.activeUploads.delete(uploadId);
    this.abortControllers.delete(uploadId);
  }

  /**
   * Creates chunks from a file
   */
  private createChunks(file: File): Blob[] {
    const chunks: Blob[] = [];
    let offset = 0;

    while (offset < file.size) {
      const end = Math.min(offset + this.config.chunkSize, file.size);
      chunks.push(file.slice(offset, end));
      offset = end;
    }

    return chunks;
  }

  /**
   * Uploads all chunks with concurrency control
   */
  private async uploadChunks(
    upload: VideoUpload,
    chunks: Blob[],
    chunkUrls: string[],
    onProgress?: (upload: VideoUpload) => void,
    onChunkProgress?: (chunkNumber: number, progress: number) => void
  ): Promise<void> {
    const semaphore = new Semaphore(this.config.maxConcurrentChunks);
    const uploadPromises: Promise<void>[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkUrl = chunkUrls[i];
      const chunkNumber = i + 1;

      const uploadPromise = semaphore.acquire().then(async (release) => {
        try {
          await this.uploadChunk(
            chunk,
            chunkUrl,
            chunkNumber,
            upload.id,
            onChunkProgress
          );
          
          // Update chunk status
          const chunkData = upload.chunks.find(c => c.chunkNumber === chunkNumber);
          if (chunkData) {
            chunkData.uploaded = true;
          }

          // Update overall progress
          const uploadedChunks = upload.chunks.filter(c => c.uploaded).length;
          upload.progress = Math.round((uploadedChunks / chunks.length) * 100);
          onProgress?.(upload);

        } finally {
          release();
        }
      });

      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);
  }

  /**
   * Uploads a single chunk with retry logic
   */
  private async uploadChunk(
    chunk: Blob,
    chunkUrl: string,
    chunkNumber: number,
    uploadId: string,
    onChunkProgress?: (chunkNumber: number, progress: number) => void
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = this.abortControllers.get(uploadId);
        if (controller?.signal.aborted) {
          throw new Error('Upload aborted');
        }

        const response = await fetch(chunkUrl, {
          method: 'PUT',
          body: chunk,
          signal: controller?.signal,
          headers: {
            'Content-Type': 'application/octet-stream',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const etag = response.headers.get('ETag');
        if (!etag) {
          throw new Error('No ETag received from server');
        }

        // Update chunk with ETag
        const upload = this.activeUploads.get(uploadId);
        if (upload) {
          const chunkData = upload.chunks.find(c => c.chunkNumber === chunkNumber);
          if (chunkData) {
            chunkData.etag = etag;
          }
        }

        onChunkProgress?.(chunkNumber, 100);
        return;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.config.retryAttempts) {
          // Wait before retry
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * attempt)
          );
        }
      }
    }

    throw lastError || new Error('Upload failed after all retries');
  }
}

/**
 * Semaphore for controlling concurrent operations
 */
class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve(() => this.release());
      } else {
        this.waitQueue.push(() => {
          this.permits--;
          resolve(() => this.release());
        });
      }
    });
  }

  private release(): void {
    this.permits++;
    const next = this.waitQueue.shift();
    if (next) {
      next();
    }
  }
}

/**
 * Utility function to calculate optimal chunk size based on file size
 */
export function calculateOptimalChunkSize(fileSize: number): number {
  // For files under 10MB, use 1MB chunks
  if (fileSize < 10 * 1024 * 1024) {
    return 1024 * 1024;
  }
  
  // For files under 100MB, use 5MB chunks
  if (fileSize < 100 * 1024 * 1024) {
    return 5 * 1024 * 1024;
  }
  
  // For larger files, use 10MB chunks
  return 10 * 1024 * 1024;
}

/**
 * Utility function to estimate upload time
 */
export function estimateUploadTime(
  fileSize: number,
  uploadSpeed: number = 1024 * 1024 // 1MB/s default
): number {
  return Math.ceil(fileSize / uploadSpeed);
}

/**
 * Utility function to format upload speed
 */
export function formatUploadSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond} B/s`;
  }
  
  const kbps = bytesPerSecond / 1024;
  if (kbps < 1024) {
    return `${kbps.toFixed(1)} KB/s`;
  }
  
  const mbps = kbps / 1024;
  return `${mbps.toFixed(1)} MB/s`;
}

// Global upload manager instance
export const uploadManager = new ChunkedUploadManager();