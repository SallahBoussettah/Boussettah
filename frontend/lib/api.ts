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
  slug: string;
  description?: string;
  shortDescription?: string;
  category: 'web' | 'mobile' | 'game' | 'desktop';
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  images: string[];
  featured: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  views: number;
  likes: number;
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

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};