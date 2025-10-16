import { useState, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadApi } from '@/lib/api/upload';
import { reelsApi } from '@/lib/api/reels';
import { uploadManager } from '@/lib/utils/chunkedUpload';
import { validateVideoFile } from '@/lib/utils/videoValidation';
import type { 
  VideoUpload, 
  CreateReelRequest, 
  InitiateUploadRequest,
  CompleteUploadRequest
} from '@/types/video';

/**
 * Hook for managing video uploads
 */
export function useVideoUpload() {
  const [uploads, setUploads] = useState<VideoUpload[]>([]);
  const queryClient = useQueryClient();
  const uploadManagerRef = useRef(uploadManager);

  // Start upload mutation
  const startUpload = useMutation({
    mutationFn: async (file: File) => {
      // Validate file first
      const validation = await validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }

      // Calculate chunk count
      const chunkSize = 5 * 1024 * 1024; // 5MB
      const chunkCount = Math.ceil(file.size / chunkSize);

      // Initiate upload
      const initiateData: InitiateUploadRequest = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        chunkCount
      };

      const { uploadId, chunkUrls } = await uploadApi.initiateUpload(initiateData);

      // Create upload object
      const upload: VideoUpload = {
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading',
        chunks: [],
        uploadId
      };

      setUploads(prev => [...prev, upload]);

      // Start chunked upload
      await uploadManagerRef.current.startUpload(
        file,
        uploadId,
        chunkUrls,
        (updatedUpload) => {
          setUploads(prev => 
            prev.map(u => u.id === uploadId ? updatedUpload : u)
          );
        },
        () => {
          // Individual chunk progress could be handled here
        }
      );

      // Complete upload
      const completeData: CompleteUploadRequest = {
        uploadId,
        chunks: upload.chunks.map(chunk => ({
          chunkNumber: chunk.chunkNumber,
          etag: chunk.etag
        }))
      };

      const result = await uploadApi.completeUpload(uploadId, completeData);

      // Update upload with reel ID
      setUploads(prev => 
        prev.map(u => 
          u.id === uploadId 
            ? { ...u, status: 'processing', reelId: result.reelId }
            : u
        )
      );

      return { uploadId, reelId: result.reelId };
    },
    onSuccess: () => {
      toast.success('Video uploaded successfully! Processing will begin shortly.');
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  // Create reel mutation
  const createReel = useMutation({
    mutationFn: async (data: CreateReelRequest) => {
      return await reelsApi.createReel(data);
    },
    onSuccess: (_, variables) => {
      toast.success('Reel created successfully!');
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      
      // Remove from uploads list
      setUploads(prev => prev.filter(u => u.uploadId !== variables.uploadId));
    },
    onError: (error) => {
      toast.error(`Failed to create reel: ${error.message}`);
    }
  });

  // Abort upload
  const abortUpload = useCallback((uploadId: string) => {
    uploadManagerRef.current.abortUpload(uploadId);
    setUploads(prev => 
      prev.map(u => 
        u.id === uploadId 
          ? { ...u, status: 'error', error: 'Upload aborted' }
          : u
      )
    );
  }, []);

  // Get upload status
  const getUploadStatus = useCallback((uploadId: string) => {
    return uploadManagerRef.current.getUploadStatus(uploadId);
  }, []);

  // Cleanup upload
  const cleanupUpload = useCallback((uploadId: string) => {
    uploadManagerRef.current.cleanupUpload(uploadId);
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  }, []);

  return {
    uploads,
    startUpload: startUpload.mutate,
    isUploading: startUpload.isPending,
    createReel: createReel.mutate,
    isCreatingReel: createReel.isPending,
    abortUpload,
    getUploadStatus,
    cleanupUpload
  };
}

/**
 * Hook for monitoring upload status
 */
export function useUploadStatus(uploadId: string) {
  return useQuery({
    queryKey: ['uploads', uploadId, 'status'],
    queryFn: () => uploadApi.getUploadStatus(uploadId),
    enabled: !!uploadId,
    refetchInterval: (query) => {
      // Stop polling if upload is complete or failed
      if (query.state.data?.status === 'complete' || query.state.data?.status === 'error') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    refetchIntervalInBackground: true
  });
}

/**
 * Hook for getting active uploads
 */
export function useActiveUploads() {
  return useQuery({
    queryKey: ['uploads', 'active'],
    queryFn: () => uploadApi.getActiveUploads(),
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true
  });
}