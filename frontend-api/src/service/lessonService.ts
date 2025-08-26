import { apiService, LessonData, Lesson } from './api';

export const lessonService = {
  // Get all lessons dengan filter opsional
  async getLessons(filters?: {
    tanggal?: string;
    guru?: string;
    mapel?: string;
    kelas?: string;
  }) {
    const params = new URLSearchParams();
    
    if (filters?.tanggal) params.append('tanggal', filters.tanggal);
    if (filters?.guru) params.append('guru', filters.guru);
    if (filters?.mapel) params.append('mapel', filters.mapel);
    if (filters?.kelas) params.append('kelas', filters.kelas);
    
    const queryString = params.toString();
    const url = queryString ? `/lessons?${queryString}` : '/lessons';
    
    return apiService.get<Lesson[]>(url);
  },

  // Get single lesson by ID
  async getLesson(id: number) {
    return apiService.get<Lesson>(`/lessons/${id}`);
  },

  // Create new lesson
  async createLesson(data: LessonData) {
    return apiService.post<Lesson>('/lessons', data);
  },

  // Update lesson
  async updateLesson(id: number, data: Partial<LessonData>) {
    return apiService.put<Lesson>(`/lessons/${id}`, data);
  },

  // Delete lesson
  async deleteLesson(id: number) {
    return apiService.delete<{ message: string }>(`/lessons/${id}`);
  },

  // Get lesson history
  async getLessonHistory(id: number) {
    return apiService.get(`/lessons/${id}/history`);
  },

  // Get teacher report
  async getTeacherReport(guru: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    params.append('guru', guru);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return apiService.get<Lesson[]>(`/reports/teacher?${params.toString()}`);
  }
};