import { api } from '@/lib/api';
import type { Student, Intervention, SystemAlert } from '@/types/api';

export const advisorService = {
  /**
   * Fetch at-risk students from live API
   */
  async getAtRiskStudents(riskLevel?: string, search?: string): Promise<Student[]> {
    const res = await api.get<Student[]>('/academic/students', { params: { risk_level: riskLevel, search } });
    return res.data;
  },

  /**
   * Fetch 360-degree comprehensive profile of a specific student
   */
  async getStudent360(studentId: number | string): Promise<Student> {
    const res = await api.get<Student>(`/academic/students/${studentId}/progress`);
    return res.data;
  },

  /**
   * Schedule or log an academic intervention
   */
  async scheduleIntervention(payload: Partial<Intervention>): Promise<Intervention> {
    const res = await api.post<Intervention>('/academic/recommendations', payload);
    return res.data;
  },

  /**
   * Fetch live alerts from /alerts
   */
  async getInboxAlerts(): Promise<SystemAlert[]> {
    const res = await api.get<SystemAlert[]>('/alerts');
    return res.data;
  },
};
