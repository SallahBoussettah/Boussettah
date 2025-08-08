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
    throw new Error(errorData.message || 'Request failed');
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

  resetPassword: async (email: string, newPassword: string, confirmPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
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
  uploadArtImage: async (file: File): Promise<{ message: string; imageUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/art`, {
      method: 'POST',
      headers,
      body: formData,
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
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
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

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};