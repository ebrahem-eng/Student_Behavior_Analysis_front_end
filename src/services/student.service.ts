import { api, fetchWithFallback } from '@/lib/api';
import type { Course } from '@/types/api';

export const studentService = {
  /**
   * Fetch personal student dashboard metrics
   */
  async getDashboard() {
    const mockDashboard = {
      gpa: 2.90,
      attendance_rate: 82.0,
      engagement_level: "Moderate",
      pending_alerts_count: 2,
      gpa_history: [
        { term: "Fall '22", gpa: 3.2 },
        { term: "Spr '23", gpa: 3.4 },
        { term: "Fall '23", gpa: 3.1 },
        { term: "Spr '24", gpa: 2.8 },
        { term: "Current", gpa: 2.9 },
      ],
      activity_data: [
        { week: "W1", logins: 12, assignments: 4 },
        { week: "W2", logins: 15, assignments: 5 },
        { week: "W3", logins: 10, assignments: 3 },
        { week: "W4", logins: 8, assignments: 2 },
        { week: "W5", logins: 5, assignments: 1 },
      ],
    };

    return fetchWithFallback(
      () => api.get('/student/dashboard'),
      mockDashboard,
      'Student Dashboard'
    );
  },

  /**
   * Submit well-being & stress survey for NLP analysis
   */
  async submitSurvey(answers: Record<string, any>) {
    const res = await api.post('/student/surveys', { answers });
    return res.data;
  },

  /**
   * Fetch registered and available courses
   */
  async getCourses(): Promise<{ enrolled: Course[]; available: Course[] }> {
    return fetchWithFallback(
      () => api.get('/student/courses'),
      { enrolled: [], available: [] },
      'Student Courses'
    );
  },
};
