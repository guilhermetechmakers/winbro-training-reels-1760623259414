import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reelsApi } from '@/lib/api';
import { toast } from 'sonner';

// Query keys
export const reelKeys = {
  all: ['reels'] as const,
  lists: () => [...reelKeys.all, 'list'] as const,
  list: (filters: any) => [...reelKeys.lists(), { filters }] as const,
  details: () => [...reelKeys.all, 'detail'] as const,
  detail: (id: string) => [...reelKeys.details(), id] as const,
  search: (query: string, filters: any) => [...reelKeys.all, 'search', { query, filters }] as const,
};

// Get all reels
export const useReels = () => {
  return useQuery({
    queryKey: reelKeys.lists(),
    queryFn: () => reelsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get reel by ID
export const useReel = (id: string) => {
  return useQuery({
    queryKey: reelKeys.detail(id),
    queryFn: () => reelsApi.getById(id),
    enabled: !!id,
  });
};

// Search reels
export const useSearchReels = () => {
  return useQuery({
    queryKey: reelKeys.search('', {}),
    queryFn: () => reelsApi.search(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Create reel mutation
export const useCreateReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reelsApi.create,
    onSuccess: (newReel) => {
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      queryClient.setQueryData(reelKeys.detail(newReel.id), newReel);
      toast.success('Reel created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create reel: ${error.message}`);
    },
  });
};

// Update reel mutation
export const useUpdateReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      reelsApi.update(id, updates),
    onSuccess: (updatedReel) => {
      queryClient.setQueryData(reelKeys.detail(updatedReel.id), updatedReel);
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      toast.success('Reel updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update reel: ${error.message}`);
    },
  });
};

// Delete reel mutation
export const useDeleteReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reelsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: reelKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      toast.success('Reel deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete reel: ${error.message}`);
    },
  });
};
