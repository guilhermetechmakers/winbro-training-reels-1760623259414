import type { VideoValidationResult, VideoValidationRules } from '@/types/video';

// Default validation rules for Winbro Training Reels
export const DEFAULT_VIDEO_RULES: VideoValidationRules = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxDuration: 30, // 30 seconds
  minDuration: 5, // 5 seconds
  allowedFormats: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  allowedCodecs: ['h264', 'h265', 'vp8', 'vp9'],
  maxResolution: '1920x1080'
};

/**
 * Validates a video file against the specified rules
 */
export async function validateVideoFile(
  file: File,
  rules: VideoValidationRules = DEFAULT_VIDEO_RULES
): Promise<VideoValidationResult> {
  const result: VideoValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check file type
  if (!rules.allowedFormats.includes(file.type)) {
    result.errors.push(`Unsupported file format. Allowed formats: ${rules.allowedFormats.join(', ')}`);
    result.isValid = false;
  }

  // Check file size
  if (file.size > rules.maxFileSize) {
    result.errors.push(`File too large. Maximum size: ${formatFileSize(rules.maxFileSize)}`);
    result.isValid = false;
  }

  result.fileSize = file.size;

  // If file type is valid, check video properties
  if (result.isValid && file.type.startsWith('video/')) {
    try {
      const videoInfo = await getVideoInfo(file);
      result.duration = videoInfo.duration;
      result.resolution = videoInfo.resolution;
      result.codec = videoInfo.codec;

      // Check duration
      if (videoInfo.duration > rules.maxDuration) {
        result.errors.push(`Video too long. Maximum duration: ${rules.maxDuration}s`);
        result.isValid = false;
      }

      if (videoInfo.duration < rules.minDuration) {
        result.errors.push(`Video too short. Minimum duration: ${rules.minDuration}s`);
        result.isValid = false;
      }

      // Check resolution
      if (videoInfo.resolution && !isValidResolution(videoInfo.resolution, rules.maxResolution)) {
        result.warnings.push(`High resolution video. Recommended: ${rules.maxResolution} or lower`);
      }

      // Check codec
      if (videoInfo.codec && !rules.allowedCodecs.includes(videoInfo.codec)) {
        result.warnings.push(`Unsupported codec: ${videoInfo.codec}. Recommended: ${rules.allowedCodecs.join(', ')}`);
      }

    } catch (error) {
      result.errors.push('Unable to read video file. Please ensure it\'s a valid video file.');
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Gets video information from a file
 */
async function getVideoInfo(file: File): Promise<{
  duration: number;
  resolution: string;
  codec: string;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      const resolution = `${video.videoWidth}x${video.videoHeight}`;
      
      // Try to detect codec from file type
      let codec = 'unknown';
      if (file.type === 'video/mp4') {
        codec = 'h264'; // Assume H.264 for MP4
      } else if (file.type === 'video/webm') {
        codec = 'vp8'; // Assume VP8 for WebM
      }

      URL.revokeObjectURL(url);
      resolve({ duration, resolution, codec });
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video metadata'));
    });

    video.src = url;
    video.load();
  });
}

/**
 * Checks if resolution is valid (not exceeding max)
 */
function isValidResolution(resolution: string, maxResolution: string): boolean {
  const [width, height] = resolution.split('x').map(Number);
  const [maxWidth, maxHeight] = maxResolution.split('x').map(Number);
  
  return width <= maxWidth && height <= maxHeight;
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Validates video file name
 */
export function validateFileName(fileName: string): {
  isValid: boolean;
  errors: string[];
  sanitizedName: string;
} {
  const errors: string[] = [];
  let sanitizedName = fileName;

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/g;
  if (invalidChars.test(fileName)) {
    errors.push('File name contains invalid characters');
    sanitizedName = fileName.replace(invalidChars, '_');
  }

  // Check length
  if (fileName.length > 255) {
    errors.push('File name too long (max 255 characters)');
    sanitizedName = fileName.substring(0, 255);
  }

  // Check for reserved names
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    errors.push('File name is reserved');
    sanitizedName = `_${fileName}`;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedName
  };
}

/**
 * Generates a unique file name to prevent conflicts
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
}

/**
 * Checks if browser supports video upload features
 */
export function checkBrowserSupport(): {
  supportsFileAPI: boolean;
  supportsChunkedUpload: boolean;
  supportsVideoPreview: boolean;
  supportsDragDrop: boolean;
} {
  return {
    supportsFileAPI: typeof File !== 'undefined' && typeof FileReader !== 'undefined',
    supportsChunkedUpload: typeof Blob !== 'undefined' && 'slice' in Blob.prototype,
    supportsVideoPreview: typeof HTMLVideoElement !== 'undefined',
    supportsDragDrop: 'draggable' in document.createElement('div')
  };
}