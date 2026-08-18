import { api, fetchWithFallback } from '@/lib/api';
import type { ChatMessage } from '@/types/api';

export const aiService = {
  /**
   * Send question or prompt to the AI Student Behavior Intelligence assistant
   */
  async sendMessage(prompt: string, studentId?: string | number): Promise<ChatMessage> {
    const mockReply: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      message: `Based on current behavioral indicators, the student shows positive improvement in attendance (+8%), while Calculus quiz scores require targeted reinforcement. Would you like to schedule an intervention or review the study roadmap?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Schedule tutoring session",
        "Generate progress report",
        "View attendance breakdown"
      ],
    };

    return fetchWithFallback(
      async () => {
        const res = await api.post<ChatMessage>('/ai/chat', {
          prompt,
          student_id: studentId,
        });
        return res;
      },
      mockReply,
      'AI Chat Assistant'
    );
  },

  /**
   * Fetch SHAP factor contribution values
   */
  async getShapExplanation(studentId: string | number) {
    return fetchWithFallback(
      () => api.get(`/ai/explain/${studentId}`),
      {
        student_id: studentId,
        base_value: 0.15,
        risk_score: 0.78,
        factors: [
          { feature: "Attendance Drop", contribution: +0.34 },
          { feature: "Midterm Score < 70%", contribution: +0.22 },
          { feature: "Late Assignment Submissions", contribution: +0.11 },
          { feature: "Active LMS Logins", contribution: -0.09 },
        ],
      },
      'AI SHAP Explanation'
    );
  },
};
