import { api } from '@/lib/api';
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
   * Fetch linked children profiles from Laravel API
   */
  async getChildren(): Promise<ChildSummary[]> {
    const res = await api.get<ChildSummary[]>('/academic/students');
    return res.data;
  },

  /**
   * Fetch live alert feed from /alerts
   */
  async getAlerts(childId: string): Promise<SystemAlert[]> {
    const res = await api.get<SystemAlert[]>(`/alerts`, { params: { student_id: childId } });
    return res.data;
  },

  /**
   * Fetch official periodic reports
   */
  async getReports(childId: string): Promise<AcademicReport[]> {
    const res = await api.get<AcademicReport[]>(`/reports/students/${childId}/risk-profile`);
    return res.data;
  },

  /**
   * Send a direct message / note to the assigned academic advisor
   */
  async sendMessage(childId: string, message: string) {
    const res = await api.post('/academic/recommendations', {
      student_id: childId,
      notes: message,
    });
    return res.data;
  },
};
