import { api, fetchWithFallback } from '@/lib/api';
import type { Student, Intervention, SystemAlert } from '@/types/api';

export const advisorService = {
  /**
   * Fetch at-risk students roster sorted by AI risk score
   */
  async getAtRiskStudents(riskLevel?: string, search?: string): Promise<Student[]> {
    const mockStudents: Student[] = [
      {
        id: 1,
        name: "Eva Green",
        student_id: "STU-003",
        major: "Computer Science",
        risk_score: 92,
        risk_level: "Critical",
        gpa: 2.1,
        attendance_rate: 65,
        risk_factors: ["Attendance", "Grades"],
        initials: "EG",
      },
      {
        id: 2,
        name: "David Miller",
        student_id: "STU-002",
        major: "Physics",
        risk_score: 78,
        risk_level: "High",
        gpa: 2.4,
        attendance_rate: 75,
        risk_factors: ["Grades"],
        initials: "DM",
      },
      {
        id: 3,
        name: "Charlie Brown",
        student_id: "STU-001",
        major: "Mathematics",
        risk_score: 65,
        risk_level: "Medium",
        gpa: 2.8,
        attendance_rate: 82,
        risk_factors: ["Behavior"],
        initials: "CB",
      },
      {
        id: 4,
        name: "Alice Smith",
        student_id: "STU-004",
        major: "English",
        risk_score: 45,
        risk_level: "Low",
        gpa: 3.2,
        attendance_rate: 88,
        risk_factors: ["Lateness"],
        initials: "AS",
      },
    ];

    return fetchWithFallback(
      () => api.get<Student[]>('/advisor/students', { params: { risk_level: riskLevel, search } }),
      mockStudents,
      'Advisor At-Risk Roster'
    );
  },

  /**
   * Fetch 360-degree comprehensive profile of a specific student
   */
  async getStudent360(studentId: number | string): Promise<Student> {
    return fetchWithFallback(
      () => api.get<Student>(`/advisor/students/${studentId}`),
      {
        id: studentId,
        name: "Eva Green",
        student_id: "STU-003",
        major: "Computer Science",
        risk_score: 92,
        risk_level: "Critical",
        gpa: 2.1,
        attendance_rate: 65,
        risk_factors: ["Attendance Drop (-25%)", "Calculus II Quiz 1 Failure"],
        shap_values: { "Absence": 0.42, "Quiz Scores": 0.35, "LMS Logins": 0.23 },
      },
      `Advisor Student 360 (#${studentId})`
    );
  },

  /**
   * Schedule or log an academic counseling intervention
   */
  async scheduleIntervention(payload: Partial<Intervention>): Promise<Intervention> {
    const res = await api.post<Intervention>('/advisor/interventions', payload);
    return res.data;
  },

  /**
   * Fetch early warning alerts inbox for advisor
   */
  async getInboxAlerts(): Promise<SystemAlert[]> {
    return fetchWithFallback(
      () => api.get<SystemAlert[]>('/advisor/inbox'),
      [],
      'Advisor Inbox Alerts'
    );
  },
};
