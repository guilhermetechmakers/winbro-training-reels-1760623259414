// Simple fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// API utilities
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Auth API
export const authApi = {
  signIn: (credentials: { email: string; password: string }) =>
    api.post<{ user: any; token: string }>('/auth/login', credentials),
  
  signUp: (userData: any) =>
    api.post<{ user: any; token: string }>('/auth/register', userData),
  
  signOut: () => api.post<any>('/auth/logout', {}),
  
  refreshToken: () =>
    api.post<{ token: string }>('/auth/refresh', {}),
  
  resetPassword: (email: string) =>
    api.post<any>('/auth/forgot-password', { email }),
  
  updatePassword: (token: string, newPassword: string) =>
    api.post<any>('/auth/reset-password', { token, password: newPassword }),
};

// Reels API
export const reelsApi = {
  getAll: () =>
    api.get<any[]>('/reels'),
  
  getById: (id: string) =>
    api.get<any>(`/reels/${id}`),
  
  create: (reelData: any) =>
    api.post<any>('/reels', reelData),
  
  update: (id: string, updates: any) =>
    api.put<any>(`/reels/${id}`, updates),
  
  delete: (id: string) =>
    api.delete<any>(`/reels/${id}`),
  
  search: () =>
    api.get<any>('/reels/search'),
  
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/reels/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });
  },
};

// Courses API
export const coursesApi = {
  getAll: () =>
    api.get<any[]>('/courses'),
  
  getById: (id: string) =>
    api.get<any>(`/courses/${id}`),
  
  create: (courseData: any) =>
    api.post<any>('/courses', courseData),
  
  update: (id: string, updates: any) =>
    api.put<any>(`/courses/${id}`, updates),
  
  delete: (id: string) =>
    api.delete<any>(`/courses/${id}`),
  
  enroll: (courseId: string) =>
    api.post<any>(`/courses/${courseId}/enroll`, {}),
  
  getProgress: (courseId: string) =>
    api.get<any>(`/courses/${courseId}/progress`),
};

// Users API
export const usersApi = {
  getCurrent: () =>
    api.get<any>('/users/me'),
  
  updateProfile: (updates: any) =>
    api.put<any>('/users/me', updates),
  
  getById: (id: string) =>
    api.get<any>(`/users/${id}`),
  
  getAll: () =>
    api.get<any[]>('/users'),
};

// Search API
export const searchApi = {
  search: () =>
    api.get<any>('/search'),
  
  getSuggestions: () =>
    api.get<string[]>('/search/suggestions'),
  
  getFacets: () =>
    api.get<any>('/search/facets'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    api.get<any>('/dashboard/stats'),
  
  getActivity: (limit?: number) =>
    api.get<any[]>(`/dashboard/activity?limit=${limit || 10}`),
  
  getRecentReels: (limit?: number) =>
    api.get<any[]>(`/dashboard/recent-reels?limit=${limit || 5}`),
  
  getAssignedCourses: () =>
    api.get<any[]>('/dashboard/assigned-courses'),
};

export default api;
