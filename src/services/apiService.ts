interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

class APIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle 401 - Token expired
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  // Generic HTTP methods for compatibility
  async get<T = unknown>(endpoint: string): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'LEARNER' | 'INSTRUCTOR';
  }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  async requestPasswordReset(email: string) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Instructor endpoints
  async getAllInstructors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'active' | 'inactive';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/instructors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getInstructorById(id: string) {
    return this.makeRequest(`/instructors/${id}`);
  }

  async updateInstructor(id: string, updateData: {
    vehicleType?: string;
    experience?: number;
    specializations?: string[];
    availability?: Record<string, unknown>;
    hourlyRate?: number;
    bio?: string;
    qualifications?: string;
    isActive?: boolean;
  }) {
    return this.makeRequest(`/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async getAvailableInstructors() {
    return this.makeRequest('/instructors/available');
  }

  async assignStudentToInstructor(assignmentData: {
    learnerId: string;
    instructorId: string;
    startDate?: string;
    notes?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  }) {
    return this.makeRequest('/instructors/assign', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async getInstructorAssignments(id: string, status?: string) {
    const endpoint = `/instructors/${id}/assignments${status ? `?status=${status}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async unassignStudent(assignmentId: string) {
    return this.makeRequest(`/instructors/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
  }

  async updateInstructorAvailability(id: string, availability: Record<string, unknown>) {
    return this.makeRequest(`/instructors/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }
}

export const apiService = new APIService();
export default apiService;