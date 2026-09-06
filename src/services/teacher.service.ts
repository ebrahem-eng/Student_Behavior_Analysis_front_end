import { api } from '@/lib/api';
import type { AttendanceRecord, GradeRecord, IncidentReport } from '@/types/api';

export const teacherService = {
  /**
   * Fetch aggregate classroom metrics & assigned courses
   */
  async getDashboardData(courseId = 'all') {
    const res = await api.get(`/academic/courses`, { params: { course_id: courseId } });
    return res.data;
  },

  /**
   * Log student attendance to MySQL via POST /academic/attendances
   */
  async logAttendance(records: AttendanceRecord[]): Promise<{ status: string; saved_count: number }> {
    const res = await api.post('/academic/attendances', { records });
    return res.data;
  },

  /**
   * Submit grade and assessment scores via POST /academic/grades
   */
  async submitGrades(grades: GradeRecord[]): Promise<{ status: string; saved_count: number }> {
    const res = await api.post('/academic/grades', { grades });
    return res.data;
  },

  /**
   * Report an incident or behavioral concern via POST /academic/behavior-logs
   */
  async reportIncident(incident: IncidentReport): Promise<IncidentReport> {
    const res = await api.post<IncidentReport>('/academic/behavior-logs', incident);
    return res.data;
  },

  /**
   * Export classroom reports in PDF or Excel via /reports/grades
   */
  async exportReport(courseId: string, format: "pdf" | "excel" = "pdf"): Promise<Blob | string> {
    const res = await api.get(`/reports/grades`, {
      params: { course_id: courseId, format },
      responseType: 'blob',
    });
    return res.data;
  },
};
