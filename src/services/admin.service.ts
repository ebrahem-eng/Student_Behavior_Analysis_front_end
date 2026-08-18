import { api, fetchWithFallback } from '@/lib/api';
import type { Institution, SystemOverviewStats, User } from '@/types/api';

export const adminService = {
  /**
   * Fetch global system overview metrics and chart series
   */
  async getOverview(): Promise<SystemOverviewStats> {
    const mockOverview: SystemOverviewStats = {
      total_students: 45231,
      avg_attendance: 92.4,
      at_risk_students: 1204,
      active_courses: 842,
      attendance_trends: [
        { name: "Jan", present: 95, absent: 5 },
        { name: "Feb", present: 92, absent: 8 },
        { name: "Mar", present: 88, absent: 12 },
        { name: "Apr", present: 90, absent: 10 },
        { name: "May", present: 94, absent: 6 },
        { name: "Jun", present: 96, absent: 4 },
      ],
      risk_by_subject: [
        { subject: "Math", atRisk: 120 },
        { subject: "Physics", atRisk: 85 },
        { subject: "Chemistry", atRisk: 65 },
        { subject: "English", atRisk: 30 },
        { subject: "History", atRisk: 15 },
      ],
      performance_trajectory: [
        { term: "Term 1", score: 75 },
        { term: "Term 2", score: 78 },
        { term: "Term 3", score: 82 },
        { term: "Term 4", score: 85 },
      ],
    };

    return fetchWithFallback(
      () => api.get<SystemOverviewStats>('/admin/overview'),
      mockOverview,
      'Admin Overview'
    );
  },

  /**
   * Get paginated users list with role filter
   */
  async getUsers(role?: string, search?: string): Promise<User[]> {
    return fetchWithFallback(
      () => api.get<User[]>('/admin/users', { params: { role, search } }),
      [],
      'Admin Users'
    );
  },

  /**
   * Create or provision a new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const res = await api.post<User>('/admin/users', userData);
    return res.data;
  },

  /**
   * Get all registered institutions
   */
  async getInstitutions(): Promise<Institution[]> {
    return fetchWithFallback(
      () => api.get<Institution[]>('/admin/institutions'),
      [],
      'Admin Institutions'
    );
  },

  /**
   * Update institution threshold configurations
   */
  async updateThreshold(institutionId: number | string, riskThreshold: number): Promise<void> {
    await api.put(`/admin/institutions/${institutionId}/threshold`, { risk_threshold: riskThreshold });
  },

  /**
   * Fetch audit logs
   */
  async getAuditLogs(page = 1) {
    return fetchWithFallback(
      () => api.get('/admin/audit-logs', { params: { page } }),
      [],
      'Admin Audit Logs'
    );
  },
};
