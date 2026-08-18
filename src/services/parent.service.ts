import { api, fetchWithFallback } from '@/lib/api';
import type { AcademicReport, SystemAlert } from '@/types/api';

export interface ChildSummary {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  attendance: number;
  status: string;
}

export const parentService = {
  /**
   * Fetch linked children profiles
   */
  async getChildren(): Promise<ChildSummary[]> {
    const mockChildren: ChildSummary[] = [
      { id: "STU-001", name: "Alice Johnson", grade: "10th Grade", gpa: 3.40, attendance: 92, status: "Good Standing" },
      { id: "STU-002", name: "Bob Johnson", grade: "8th Grade", gpa: 3.65, attendance: 96, status: "Honor Roll" },
    ];

    return fetchWithFallback(
      () => api.get<ChildSummary[]>('/parent/children'),
      mockChildren,
      'Parent Children'
    );
  },

  /**
   * Fetch alert feed for a specific dependent
   */
  async getAlerts(childId: string): Promise<SystemAlert[]> {
    return fetchWithFallback(
      () => api.get<SystemAlert[]>(`/parent/children/${childId}/alerts`),
      [],
      `Parent Child Alerts (${childId})`
    );
  },

  /**
   * Fetch official periodic reports
   */
  async getReports(childId: string): Promise<AcademicReport[]> {
    return fetchWithFallback(
      () => api.get<AcademicReport[]>(`/parent/children/${childId}/reports`),
      [],
      `Parent Child Reports (${childId})`
    );
  },

  /**
   * Send a direct message to the assigned academic advisor
   */
  async sendMessage(childId: string, message: string) {
    const res = await api.post('/parent/communications/messages', {
      student_id: childId,
      message,
    });
    return res.data;
  },
};
