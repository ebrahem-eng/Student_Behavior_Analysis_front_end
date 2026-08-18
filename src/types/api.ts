export type UserRole = "admin" | "teacher" | "advisor" | "student" | "parent";

export type RiskLevel = "Critical" | "High" | "Medium" | "Low" | "Stable";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: UserRole;
  roles?: string[];
  institution_id?: number | string;
  institution_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
}

export interface AuthResponse {
  message?: string;
  access_token?: string;
  token?: string;
  token_type?: string;
  user: User;
  expires_in?: number;
}

export interface Institution {
  id: number | string;
  name: string;
  code: string;
  mode: "school" | "university";
  risk_threshold: number;
  total_students: number;
  total_courses: number;
  created_at?: string;
}

export interface Student {
  id: number | string;
  user_id?: number | string;
  student_id: string; // e.g. STU-001
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  major: string;
  grade_level?: string;
  gpa: number;
  attendance_rate: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: string[];
  shap_values?: Record<string, number>;
  initials?: string;
}

export interface Course {
  id: number | string;
  code: string;
  title: string;
  credits: number;
  term: string;
  instructor_id?: number | string;
  instructor_name?: string;
  enrolled_count?: number;
}

export interface AttendanceRecord {
  id?: number | string;
  student_id: number | string;
  course_id: number | string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface GradeRecord {
  id?: number | string;
  student_id: number | string;
  course_id: number | string;
  assessment_name: string;
  score: number;
  max_score: number;
  weight?: number;
  term?: string;
}

export interface IncidentReport {
  id?: number | string;
  student_id: number | string;
  student_name?: string;
  reporter_id?: number | string;
  reporter_name?: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "academic" | "behavioral" | "attendance" | "wellbeing";
  description: string;
  date: string;
  status: "pending" | "reviewed" | "resolved";
}

export interface Intervention {
  id?: number | string;
  student_id: number | string;
  student_name?: string;
  advisor_id: number | string;
  advisor_name?: string;
  type: string;
  notes: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  outcome?: "improved" | "stable" | "declined" | "pending";
  scheduled_at: string;
  completed_at?: string;
}

export interface SystemAlert {
  id: number | string;
  student_id?: number | string;
  student_name?: string;
  title: string;
  title_ar?: string;
  message: string;
  message_ar?: string;
  severity: "info" | "warning" | "danger" | "critical";
  type: "attendance" | "grade" | "behavior" | "ai_risk";
  is_read: boolean;
  created_at: string;
}

export interface AcademicReport {
  id: number | string;
  student_id: number | string;
  title: string;
  title_ar?: string;
  type: string;
  type_ar?: string;
  issued_date: string;
  file_url: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: string;
  citations?: string[];
  suggestions?: string[];
}

export interface SystemOverviewStats {
  total_students: number;
  avg_attendance: number;
  at_risk_students: number;
  active_courses: number;
  attendance_trends: Array<{ name: string; present: number; absent: number }>;
  risk_by_subject: Array<{ subject: string; atRisk: number }>;
  performance_trajectory: Array<{ term: string; score: number }>;
}
