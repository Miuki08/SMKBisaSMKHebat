const API_BASE_URL = 'http://localhost:8000/api';

// Interface untuk data yang sesuai dengan backend
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LessonData {
  nama_guru: string;
  mata_pelajaran: string;
  kelas: string;
  pokok_materi: string;
  bukti_mengajar?: string;
  tanggal_mengajar: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  catatan?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Lesson {
  id: number;
  nama_guru: string;
  mata_pelajaran: string;
  kelas: string;
  pokok_materi: string;
  bukti_mengajar: string;
  tanggal_mengajar: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  catatan: string;
  created_by_id: number;
  created_by: User;
  created_at: string;
  updated_at: string;
}

// Generic response interface
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// Type untuk data yang bisa dikirim ke API
export type ApiRequestData = LoginData | RegisterData | LessonData | Record<string, unknown>;

export const apiService = {
  async get<T = unknown>(url: string): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    return response.json() as Promise<T>;
  },

  async post<T = unknown>(url: string, data: ApiRequestData): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    const responseData: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Request failed');
    }

    return responseData as T;
  },

  async put<T = unknown>(url: string, data: ApiRequestData): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    const responseData: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Request failed');
    }

    return responseData as T;
  },

  async delete<T = unknown>(url: string): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    const responseData: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Request failed');
    }

    return responseData as T;
  },
};