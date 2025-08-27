import { apiService, LessonData, Lesson } from './api';

export const lessonService = {
  async getLessons(filters?: {
    tanggal?: string;
    guru?: string;
    mapel?: string;
    kelas?: string;
  }) {
    try {
      const params = new URLSearchParams();
      
      if (filters?.tanggal) params.append('tanggal', filters.tanggal);
      if (filters?.guru) params.append('guru', filters.guru);
      if (filters?.mapel) params.append('mapel', filters.mapel);
      if (filters?.kelas) params.append('kelas', filters.kelas);
      
      const queryString = params.toString();
      const url = queryString ? `/lessons?${queryString}` : '/lessons';
      
      return await apiService.get<Lesson[]>(url);
    } catch (error) {
      console.error('Error in getLessons:', error);
      throw error;
    }
  },

  async getLesson(id: number) {
    try {
      return await apiService.get<Lesson>(`/lessons/${id}`);
    } catch (error) {
      console.error('Error in getLesson:', error);
      throw error;
    }
  },

  async createLesson(data: LessonData) {
    try {
      return await apiService.post<Lesson>('/lessons', data);
    } catch (error) {
      console.error('Error in createLesson:', error);
      throw error;
    }
  },

  async updateLesson(id: number, data: Partial<LessonData>) {
    try {
      return await apiService.put<Lesson>(`/lessons/${id}`, data);
    } catch (error) {
      console.error('Error in updateLesson:', error);
      throw error;
    }
  },

  async deleteLesson(id: number) {
    try {
      return await apiService.delete<{ message: string }>(`/lessons/${id}`);
    } catch (error) {
      console.error('Error in deleteLesson:', error);
      throw error;
    }
  }
};