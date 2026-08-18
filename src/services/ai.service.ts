import { api } from '@/lib/api';
import type { ChatMessage } from '@/types/api';

export const aiService = {
  /**
   * Send question or prompt to the AI Student Behavior Intelligence assistant
   */
  async sendMessage(prompt: string, studentId?: string | number): Promise<ChatMessage> {
    const res = await api.post<ChatMessage>('/academic/students/1/project', {
      prompt,
      student_id: studentId,
    });
    return res.data;
  },

  /**
   * Fetch ML model metrics and SHAP explanations from /admin/ml/metrics
   */
  async getShapExplanation(studentId?: string | number) {
    const res = await api.get('/admin/ml/metrics', { params: { student_id: studentId } });
    return res.data;
  },
};
