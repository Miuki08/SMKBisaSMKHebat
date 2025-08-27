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
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`);
      }

      // Handle berbagai format response
      if (Array.isArray(result)) {
        return result as T;
      } else if (result && typeof result === 'object' && 'data' in result) {
        return result.data as T;
      } else {
        return result as T;
      }
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post<T = unknown>(url: string, data: ApiRequestData): Promise<T> {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Request failed');
      }

      // Handle berbagai format response
      if (result && typeof result === 'object') {
        // Jika response memiliki properti 'data'
        if ('data' in result) {
          return result.data as T;
        }
        // Jika response langsung berisi data yang diinginkan (seperti {token: '', user: {}})
        if ('token' in result || 'user' in result) {
          return result as T;
        }
      }
      
      return result as T;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put<T = unknown>(url: string, data: ApiRequestData): Promise<T> {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Request failed');
      }

      // Handle berbagai format response
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data as T;
      } else {
        return result as T;
      }
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete<T = unknown>(url: string): Promise<T> {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Data tidak ditemukan atau sudah dihapus');
        }
        throw new Error(result.error || result.message || 'Request failed');
      }

      // Handle berbagai format response
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data as T;
      } else if (result && typeof result === 'object' && 'message' in result) {
        return result.message as unknown as T;
      } else {
        return result as T;
      }
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};