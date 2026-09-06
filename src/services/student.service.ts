import { api } from '@/lib/api';
import type { Course } from '@/types/api';

export const studentService = {
  /**
   * Fetch student's live academic progress
   */
  async getDashboard() {
    const res = await api.get('/academic/students/me/progress');
    return res.data;
  },

  /**
   * Submit well-being & stress survey
   */
  async submitSurvey(answers: Record<string, any>) {
    const res = await api.post('/consent', { answers });
    return res.data;
  },

  /**
   * Fetch registered and available courses
   */
  async getCourses(): Promise<{ enrolled: Course[]; available: Course[] }> {
    const res = await api.get('/academic/courses');
    return res.data;
  },
};
