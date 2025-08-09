const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface LoginResponse {
  message: string;
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
    lastLogin: string;
  };
}

export interface Project {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  description?: string;
  longDescription?: string;
  shortDescription?: string;
  category: 'web' | 'mobile' | 'game' | 'desktop';
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  technologies: string[];
  features?: string[];
  challenges?: string[];
  learnings?: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  images: string[];
  featured: boolean;
  priority: number;
  year?: string;
  startDate?: string;
  endDate?: string;
  views: number;
  likes: number;
  stars?: string;
  downloads?: string;
  isPublic: boolean;
  completionPercentage: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  teamSize: number;
  duration?: string;
  client?: string;
  awards?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArtPiece {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: 'Digital Art' | 'Character Portrait' | 'Abstract' | 'Landscape' | 'Concept Art' | 'Illustration' | 'Pixel Art';
  medium?: string;
  year: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  images: string[];
  featured: boolean;
  priority: number;
  dimensions?: string;
  tags: string[];
  views: number;
  likes: number;
  isPublic: boolean;
  createdYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  year: string;
  description?: string;
  icon: 'Award' | 'Code' | 'Palette' | 'Book' | 'Certificate' | 'GraduationCap';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location?: string;
  description?: string;
  achievements: string[];
  order: number;
  isActive: boolean;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TechStack {
  id: number;
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Game Dev' | 'Design' | 'Tools';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    // Create a more detailed error object
    const error = new Error(errorData.message || 'Request failed');
    (error as any).response = { data: errorData };
    throw error;
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  verify: async () => {
    return makeAuthenticatedRequest('/auth/verify');
  },

  logout: async () => {
    return makeAuthenticatedRequest('/auth/logout', {
      method: 'POST',
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return makeAuthenticatedRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  requestResetCode: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/request-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset code');
    }

    return response.json();
  },

  verifyResetCode: async (email: string, resetCode: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid reset code');
    }

    return response.json();
  },

  resetPassword: async (email: string, resetCode: string, newPassword: string, confirmPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetCode, newPassword, confirmPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset failed');
    }

    return response.json();
  },

  getAdminInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-info`);
    
    if (!response.ok) {
      throw new Error('Failed to get admin info');
    }
    
    return response.json();
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: {
    category?: string;
    status?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(`${API_BASE_URL}${url}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return response.json();
  },

  getBySlug: async (slug: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
    
    if (!response.ok) {
      throw new Error('Project not found');
    }
    
    return response.json();
  },

  create: async (projectData: Partial<Project>): Promise<{ message: string; project: Project }> => {
    return makeAuthenticatedRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: number, projectData: Partial<Project>): Promise<{ message: string; project: Project }> => {
    return makeAuthenticatedRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return makeAuthenticatedRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: number): Promise<{ message: string; likes: number }> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to like project');
    }
    
    return response.json();
  },

  // Admin endpoints
  getStats: async () => {
    return makeAuthenticatedRequest('/projects/admin/stats');
  },

  getAllAdmin: async (params?: {
    category?: string;
    status?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/projects/admin/all${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return makeAuthenticatedRequest(url);
  },

  bulkUpdate: async (projectIds: number[], updates: Partial<Project>) => {
    return makeAuthenticatedRequest('/projects/admin/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ projectIds, updates }),
    });
  },

  // Public endpoints
  getFeatured: async (limit?: number) => {
    const url = `/projects/featured${limit ? `?limit=${limit}` : ''}`;
    const response = await fetch(`${API_BASE_URL}${url}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured projects');
    }
    
    return response.json();
  },

  getByCategory: async (category: string, params?: {
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/projects/category/${category}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(`${API_BASE_URL}${url}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} projects`);
    }
    
    return response.json();
  },
};

// Art API
export const artAPI = {
  getAll: async (params?: {
    category?: string;
    year?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/art${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(`${API_BASE_URL}${url}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch art pieces');
    }
    
    return response.json();
  },

  getAllAdmin: async (params?: {
    category?: string;
    year?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/art/admin/all${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return makeAuthenticatedRequest(url);
  },

  getBySlug: async (slug: string): Promise<ArtPiece> => {
    const response = await fetch(`${API_BASE_URL}/art/${slug}`);
    
    if (!response.ok) {
      throw new Error('Art piece not found');
    }
    
    return response.json();
  },

  create: async (artData: Partial<ArtPiece>): Promise<{ message: string; artPiece: ArtPiece }> => {
    return makeAuthenticatedRequest('/art', {
      method: 'POST',
      body: JSON.stringify(artData),
    });
  },

  update: async (id: number, artData: Partial<ArtPiece>): Promise<{ message: string; artPiece: ArtPiece }> => {
    return makeAuthenticatedRequest(`/art/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artData),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return makeAuthenticatedRequest(`/art/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: number): Promise<{ message: string; likes: number }> => {
    const response = await fetch(`${API_BASE_URL}/art/${id}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to like art piece');
    }
    
    return response.json();
  },
};

// Upload API
export const uploadAPI = {
  deleteImage: async (imageUrl: string): Promise<{ message: string }> => {
    return makeAuthenticatedRequest('/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    });
  },

  uploadProjectImage: async (file: File): Promise<{ message: string; imageUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/upload/project`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out. Please try again with a smaller file.');
      }
      
      throw error;
    }
  },

  uploadArtImage: async (file: File): Promise<{ message: string; imageUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/upload/art`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out. Please try again with a smaller file.');
      }
      
      throw error;
    }
  },
};

// Education API
export const educationAPI = {
  getAll: async (): Promise<Education[]> => {
    const response = await fetch(`${API_BASE_URL}/education`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch education data');
    }
    
    return response.json();
  },

  getAllAdmin: async (): Promise<Education[]> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/education/admin`, {
      method: 'GET',
      headers,
    });
    
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch education data');
    }
    
    return response.json();
  },

  getById: async (id: number): Promise<Education> => {
    const response = await fetch(`${API_BASE_URL}/education/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch education entry');
    }
    
    return response.json();
  },

  create: async (educationData: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/education`, {
      method: 'POST',
      headers,
      body: JSON.stringify(educationData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create education entry' }));
      throw new Error(errorData.message || 'Failed to create education entry');
    }

    return response.json();
  },

  update: async (id: number, educationData: Partial<Omit<Education, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Education> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/education/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(educationData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update education entry' }));
      throw new Error(errorData.message || 'Failed to update education entry');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/education/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete education entry' }));
      throw new Error(errorData.message || 'Failed to delete education entry');
    }
  },

  reorder: async (educationIds: number[]): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/education/reorder`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ educationIds }),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reorder education entries' }));
      throw new Error(errorData.message || 'Failed to reorder education entries');
    }
  },
};

// Experience API
export const experienceAPI = {
  getAll: async (): Promise<Experience[]> => {
    const response = await fetch(`${API_BASE_URL}/experience`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch experience data');
    }
    
    return response.json();
  },

  getAllAdmin: async (): Promise<Experience[]> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/experience/admin`, {
      method: 'GET',
      headers,
    });
    
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch experience data');
    }
    
    return response.json();
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await fetch(`${API_BASE_URL}/experience/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch experience entry');
    }
    
    return response.json();
  },

  create: async (experienceData: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/experience`, {
      method: 'POST',
      headers,
      body: JSON.stringify(experienceData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create experience entry' }));
      throw new Error(errorData.message || 'Failed to create experience entry');
    }

    return response.json();
  },

  update: async (id: number, experienceData: Partial<Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Experience> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(experienceData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update experience entry' }));
      throw new Error(errorData.message || 'Failed to update experience entry');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete experience entry' }));
      throw new Error(errorData.message || 'Failed to delete experience entry');
    }
  },

  reorder: async (experienceIds: number[]): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/experience/reorder`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ experienceIds }),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reorder experience entries' }));
      throw new Error(errorData.message || 'Failed to reorder experience entries');
    }
  },
};

// TechStack API
export const techStackAPI = {
  getAll: async (): Promise<Record<string, TechStack[]>> => {
    const response = await fetch(`${API_BASE_URL}/techstack`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tech stack data');
    }
    
    return response.json();
  },

  getAllAdmin: async (): Promise<TechStack[]> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/techstack/admin`, {
      method: 'GET',
      headers,
    });
    
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch tech stack data');
    }
    
    return response.json();
  },

  getById: async (id: number): Promise<TechStack> => {
    const response = await fetch(`${API_BASE_URL}/techstack/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tech stack entry');
    }
    
    return response.json();
  },

  create: async (techStackData: Omit<TechStack, 'id' | 'createdAt' | 'updatedAt'>): Promise<TechStack> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/techstack`, {
      method: 'POST',
      headers,
      body: JSON.stringify(techStackData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create tech stack entry' }));
      throw new Error(errorData.message || 'Failed to create tech stack entry');
    }

    return response.json();
  },

  update: async (id: number, techStackData: Partial<Omit<TechStack, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TechStack> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/techstack/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(techStackData),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update tech stack entry' }));
      throw new Error(errorData.message || 'Failed to update tech stack entry');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/techstack/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete tech stack entry' }));
      throw new Error(errorData.message || 'Failed to delete tech stack entry');
    }
  },

  reorder: async (techStackIds: number[]): Promise<void> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/techstack/reorder`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ techStackIds }),
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reorder tech stack entries' }));
      throw new Error(errorData.message || 'Failed to reorder tech stack entries');
    }
  },
};

// Settings API
export const settingsAPI = {
  // Public settings (for frontend consumption)
  getPublicSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings/public`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch public settings');
    }
    
    return response.json();
  },

  getPublicByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/public/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} settings`);
    }
    
    return response.json();
  },

  // Admin settings
  getAllSettings: async () => {
    return makeAuthenticatedRequest('/settings/admin/all');
  },

  getByCategory: async (category: string) => {
    return makeAuthenticatedRequest(`/settings/admin/${category}`);
  },

  updateSetting: async (key: string, value: any, isPublic?: boolean) => {
    const body: any = { value };
    if (isPublic !== undefined) {
      body.isPublic = isPublic;
    }
    return makeAuthenticatedRequest(`/settings/admin/${key}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  bulkUpdateSettings: async (settings: Record<string, any>) => {
    return makeAuthenticatedRequest('/settings/admin/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  },

  createSetting: async (settingData: {
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    category: 'general' | 'social' | 'seo' | 'appearance' | 'contact' | 'portfolio';
    description?: string;
    isPublic?: boolean;
    isEditable?: boolean;
  }) => {
    return makeAuthenticatedRequest('/settings/admin', {
      method: 'POST',
      body: JSON.stringify(settingData),
    });
  },

  deleteSetting: async (key: string) => {
    return makeAuthenticatedRequest(`/settings/admin/${key}`, {
      method: 'DELETE',
    });
  },

  resetToDefault: async () => {
    return makeAuthenticatedRequest('/settings/admin/reset', {
      method: 'POST',
    });
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};