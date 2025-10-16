import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reelsApi } from '@/lib/api/reels';
import type { 
  VideoSearchFilters, 
  CreateReelRequest,
  UpdateTranscriptRequest
} from '@/types/video';

/**
 * Hook for getting a single reel
 */
export function useReel(id: string) {
  return useQuery({
    queryKey: ['reels', id],
    queryFn: () => reelsApi.getReel(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for searching reels
 */
export function useReelSearch(filters: VideoSearchFilters = {}) {
  return useQuery({
    queryKey: ['reels', 'search', filters],
    queryFn: () => reelsApi.searchReels(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for reel analytics
 */
export function useReelAnalytics(id: string) {
  return useQuery({
    queryKey: ['reels', id, 'analytics'],
    queryFn: () => reelsApi.getAnalytics(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for bookmarked reels
 */
export function useBookmarkedReels() {
  return useQuery({
    queryKey: ['reels', 'bookmarks'],
    queryFn: () => reelsApi.getBookmarks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for related reels
 */
export function useRelatedReels(id: string, limit: number = 5) {
  return useQuery({
    queryKey: ['reels', id, 'related', limit],
    queryFn: () => reelsApi.getRelatedReels(id, limit),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for reel comments
 */
export function useReelComments(id: string) {
  return useQuery({
    queryKey: ['reels', id, 'comments'],
    queryFn: () => reelsApi.getComments(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for reel annotations
 */
export function useReelAnnotations(id: string) {
  return useQuery({
    queryKey: ['reels', id, 'annotations'],
    queryFn: () => reelsApi.getAnnotations(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for reel actions
 */
export function useReelActions() {
  const queryClient = useQueryClient();

  // Update reel mutation
  const updateReel = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateReelRequest> }) =>
      reelsApi.updateReel(id, updates),
    onSuccess: (_, { id }) => {
      toast.success('Reel updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reels', id] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'search'] });
    },
    onError: (error) => {
      toast.error(`Failed to update reel: ${error.message}`);
    }
  });

  // Delete reel mutation
  const deleteReel = useMutation({
    mutationFn: (id: string) => reelsApi.deleteReel(id),
    onSuccess: () => {
      toast.success('Reel deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'search'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete reel: ${error.message}`);
    }
  });

  // Update transcript mutation
  const updateTranscript = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTranscriptRequest }) =>
      reelsApi.updateTranscript(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Transcript updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reels', id] });
    },
    onError: (error) => {
      toast.error(`Failed to update transcript: ${error.message}`);
    }
  });

  // Record view mutation
  const recordView = useMutation({
    mutationFn: ({ id, timestamp }: { id: string; timestamp?: number }) =>
      reelsApi.recordView(id, timestamp),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'analytics'] });
    }
  });

  // Bookmark mutations
  const bookmarkReel = useMutation({
    mutationFn: (id: string) => reelsApi.bookmarkReel(id),
    onSuccess: (_, id) => {
      toast.success('Reel bookmarked');
      queryClient.invalidateQueries({ queryKey: ['reels', id] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'bookmarks'] });
    },
    onError: (error) => {
      toast.error(`Failed to bookmark reel: ${error.message}`);
    }
  });

  const removeBookmark = useMutation({
    mutationFn: (id: string) => reelsApi.removeBookmark(id),
    onSuccess: (_, id) => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['reels', id] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'bookmarks'] });
    },
    onError: (error) => {
      toast.error(`Failed to remove bookmark: ${error.message}`);
    }
  });

  // Share reel mutation
  const shareReel = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: { canDownload: boolean; expiresAt?: string } }) =>
      reelsApi.shareReel(id, permissions),
    onSuccess: (data) => {
      toast.success('Share link generated');
      return data;
    },
    onError: (error) => {
      toast.error(`Failed to generate share link: ${error.message}`);
    }
  });

  return {
    updateReel: updateReel.mutate,
    isUpdating: updateReel.isPending,
    deleteReel: deleteReel.mutate,
    isDeleting: deleteReel.isPending,
    updateTranscript: updateTranscript.mutate,
    isUpdatingTranscript: updateTranscript.isPending,
    recordView: recordView.mutate,
    bookmarkReel: bookmarkReel.mutate,
    isBookmarking: bookmarkReel.isPending,
    removeBookmark: removeBookmark.mutate,
    isRemovingBookmark: removeBookmark.isPending,
    shareReel: shareReel.mutate,
    isSharing: shareReel.isPending
  };
}

/**
 * Hook for reel comments actions
 */
export function useReelCommentsActions() {
  const queryClient = useQueryClient();

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: { text: string; timestamp?: number; isPrivate: boolean } }) =>
      reelsApi.addComment(id, comment),
    onSuccess: (_, { id }) => {
      toast.success('Comment added');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'comments'] });
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    }
  });

  // Update comment mutation
  const updateComment = useMutation({
    mutationFn: ({ id, commentId, updates }: { id: string; commentId: string; updates: { text: string } }) =>
      reelsApi.updateComment(id, commentId, updates),
    onSuccess: (_, { id }) => {
      toast.success('Comment updated');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'comments'] });
    },
    onError: (error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    }
  });

  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: ({ id, commentId }: { id: string; commentId: string }) =>
      reelsApi.deleteComment(id, commentId),
    onSuccess: (_, { id }) => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'comments'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    }
  });

  return {
    addComment: addComment.mutate,
    isAddingComment: addComment.isPending,
    updateComment: updateComment.mutate,
    isUpdatingComment: updateComment.isPending,
    deleteComment: deleteComment.mutate,
    isDeletingComment: deleteComment.isPending
  };
}

/**
 * Hook for reel annotations actions
 */
export function useReelAnnotationsActions() {
  const queryClient = useQueryClient();

  // Add annotation mutation
  const addAnnotation = useMutation({
    mutationFn: ({ id, annotation }: { id: string; annotation: {
      startTime: number;
      endTime: number;
      text: string;
      type: 'note' | 'highlight' | 'question';
      isPrivate: boolean;
    }}) => reelsApi.addAnnotation(id, annotation),
    onSuccess: (_, { id }) => {
      toast.success('Annotation added');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'annotations'] });
    },
    onError: (error) => {
      toast.error(`Failed to add annotation: ${error.message}`);
    }
  });

  // Update annotation mutation
  const updateAnnotation = useMutation({
    mutationFn: ({ id, annotationId, updates }: { id: string; annotationId: string; updates: {
      text?: string;
      startTime?: number;
      endTime?: number;
    }}) => reelsApi.updateAnnotation(id, annotationId, updates),
    onSuccess: (_, { id }) => {
      toast.success('Annotation updated');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'annotations'] });
    },
    onError: (error) => {
      toast.error(`Failed to update annotation: ${error.message}`);
    }
  });

  // Delete annotation mutation
  const deleteAnnotation = useMutation({
    mutationFn: ({ id, annotationId }: { id: string; annotationId: string }) =>
      reelsApi.deleteAnnotation(id, annotationId),
    onSuccess: (_, { id }) => {
      toast.success('Annotation deleted');
      queryClient.invalidateQueries({ queryKey: ['reels', id, 'annotations'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete annotation: ${error.message}`);
    }
  });

  return {
    addAnnotation: addAnnotation.mutate,
    isAddingAnnotation: addAnnotation.isPending,
    updateAnnotation: updateAnnotation.mutate,
    isUpdatingAnnotation: updateAnnotation.isPending,
    deleteAnnotation: deleteAnnotation.mutate,
    isDeletingAnnotation: deleteAnnotation.isPending
  };
}

/**
 * Hook for reel metadata
 */
export function useReelMetadata() {
  // Get tag suggestions
  const tagSuggestions = useQuery({
    queryKey: ['reels', 'metadata', 'tags'],
    queryFn: () => reelsApi.getTagSuggestions(''),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Get machine models
  const machineModels = useQuery({
    queryKey: ['reels', 'metadata', 'machine-models'],
    queryFn: () => reelsApi.getMachineModels(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Get process steps
  const processSteps = useQuery({
    queryKey: ['reels', 'metadata', 'process-steps'],
    queryFn: () => reelsApi.getProcessSteps(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Get tooling options
  const toolingOptions = useQuery({
    queryKey: ['reels', 'metadata', 'tooling-options'],
    queryFn: () => reelsApi.getToolingOptions(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    tagSuggestions: tagSuggestions.data || [],
    isTagSuggestionsLoading: tagSuggestions.isLoading,
    machineModels: machineModels.data || [],
    isMachineModelsLoading: machineModels.isLoading,
    processSteps: processSteps.data || [],
    isProcessStepsLoading: processSteps.isLoading,
    toolingOptions: toolingOptions.data || [],
    isToolingOptionsLoading: toolingOptions.isLoading
  };
}