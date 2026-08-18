import { api } from '@/lib/api';
import type { Institution, SystemOverviewStats, User } from '@/types/api';

export const adminService = {
  /**
   * Fetch real system stats from Laravel /admin/dashboard/stats
   */
  async getOverview(): Promise<SystemOverviewStats> {
    const res = await api.get<SystemOverviewStats>('/admin/dashboard/stats');
    return res.data;
  },

  /**
   * Get paginated users from /admin/users
   */
  async getUsers(role?: string, search?: string): Promise<User[]> {
    const res = await api.get<User[]>('/admin/users', { params: { role, search } });
    return res.data;
  },

  /**
   * Create new user in MySQL
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const res = await api.post<User>('/admin/users', userData);
    return res.data;
  },

  /**
   * Get registered institutions from /admin/institutions
   */
  async getInstitutions(): Promise<Institution[]> {
    const res = await api.get<Institution[]>('/admin/institutions');
    return res.data;
  },

  /**
   * Update institution threshold
   */
  async updateThreshold(institutionId: number | string, riskThreshold: number): Promise<void> {
    await api.put(`/admin/institutions/${institutionId}`, { risk_threshold: riskThreshold });
  },

  /**
   * Fetch audit logs from /admin/audit-logs
   */
  async getAuditLogs(page = 1) {
    const res = await api.get('/admin/audit-logs', { params: { page } });
    return res.data;
  },
};
