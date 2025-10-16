import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

// Query keys
export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
  activity: ['dashboard', 'activity'] as const,
  recentReels: ['dashboard', 'recent-reels'] as const,
  assignedCourses: ['dashboard', 'assigned-courses'] as const,
};

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: dashboardApi.getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get activity feed
export const useActivity = (limit?: number) => {
  return useQuery({
    queryKey: [...dashboardKeys.activity, { limit }],
    queryFn: () => dashboardApi.getActivity(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get recent reels
export const useRecentReels = (limit?: number) => {
  return useQuery({
    queryKey: [...dashboardKeys.recentReels, { limit }],
    queryFn: () => dashboardApi.getRecentReels(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get assigned courses
export const useAssignedCourses = () => {
  return useQuery({
    queryKey: dashboardKeys.assignedCourses,
    queryFn: dashboardApi.getAssignedCourses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
