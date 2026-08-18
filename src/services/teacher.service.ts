import { api, fetchWithFallback } from '@/lib/api';
import type { AttendanceRecord, GradeRecord, IncidentReport } from '@/types/api';

export const teacherService = {
  /**
   * Fetch aggregate classroom metrics & assigned courses
   */
  async getDashboardData(courseId = 'all') {
    const mockData = {
      enrolled_count: 124,
      class_gpa: 3.42,
      attendance_rate: 93.2,
      active_alerts: 3,
      performance_trends: [
        { name: "W1", avgScore: 82, attendance: 95 },
        { name: "W2", avgScore: 84, attendance: 93 },
        { name: "W3", avgScore: 81, attendance: 90 },
        { name: "W4", avgScore: 86, attendance: 92 },
        { name: "W5", avgScore: 88, attendance: 96 },
      ],
      grade_distribution: [
        { grade: "A", count: 14 },
        { grade: "B", count: 9 },
        { grade: "C", count: 5 },
        { grade: "D", count: 2 },
        { grade: "F", count: 1 },
      ],
    };

    return fetchWithFallback(
      () => api.get(`/teacher/dashboard`, { params: { course_id: courseId } }),
      mockData,
      'Teacher Dashboard Data'
    );
  },

  /**
   * Log bulk student attendance
   */
  async logAttendance(records: AttendanceRecord[]): Promise<{ status: string; saved_count: number }> {
    const res = await api.post('/teacher/attendance', { records });
    return res.data;
  },

  /**
   * Submit grade and assessment scores
   */
  async submitGrades(grades: GradeRecord[]): Promise<{ status: string; saved_count: number }> {
    const res = await api.post('/teacher/grades', { grades });
    return res.data;
  },

  /**
   * Report an incident or behavioral concern to advising
   */
  async reportIncident(incident: IncidentReport): Promise<IncidentReport> {
    const res = await api.post<IncidentReport>('/teacher/incidents', incident);
    return res.data;
  },

  /**
   * Export classroom reports in PDF or Excel
   */
  async exportReport(courseId: string, format: "pdf" | "excel" = "pdf"): Promise<Blob | string> {
    try {
      const res = await api.get(`/teacher/export/${courseId}`, {
        params: { format },
        responseType: 'blob',
      });
      return res.data;
    } catch (e) {
      console.info('[Export] Backend export offline, simulating client download.');
      return `report_${courseId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    }
  },
};
