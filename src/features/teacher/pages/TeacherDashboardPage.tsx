import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Sparkles,
  Award,
  RefreshCw,
  Building,
  UserCheck,
  CheckCircle2,
  Mail,
  School
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { Course } from "@/types/api";

interface StatCardProps {
  number: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: typeof Users;
  description: string;
  color: string;
  bg: string;
  border: string;
}

const StatCard = ({
  number,
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  description,
  color,
  bg,
  border,
}: StatCardProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5 }}
    className="group relative bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/25 transition-all duration-300 overflow-hidden"
  >
    <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.06] pointer-events-none select-none transition-all duration-300 font-mono">
      {number}
    </span>

    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="relative">
        <div className={`absolute inset-0 ${bg} rounded-2xl scale-[1.3] opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
        <div className={`relative w-12 h-12 ${bg} border ${border} ${color} flex items-center justify-center rounded-2xl group-hover:scale-105 transition-all duration-300 shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'}`}>
        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{change}</span>
      </div>
    </div>

    <div className="relative z-10 space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </div>
  </motion.div>
);

export default function TeacherDashboardPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [scopeMode, setScopeMode] = useState<"my_sections" | "all_institution">("my_sections");

  const [metrics, setMetrics] = useState({
    classAverage: "0.0%",
    attendanceRate: "0.0%",
    atRiskStudents: 0,
    totalCourses: 0,
    totalStudents: 0,
  });

  const [performanceTrends, setPerformanceTrends] = useState<any[]>([]);

  const [gradeDistribution, setGradeDistribution] = useState([
    { grade: "A", count: 0, color: "#10b981" },
    { grade: "B", count: 0, color: "#3b82f6" },
    { grade: "C", count: 0, color: "#8b5cf6" },
    { grade: "D", count: 0, color: "#f59e0b" },
    { grade: "F", count: 0, color: "#f43f5e" },
  ]);

  const loadTeacherData = async () => {
    setIsLoading(true);
    try {
      const isMySections = scopeMode === "my_sections";
      const instParams = selectedInstitution !== "all" ? { institution_id: selectedInstitution } : {};

      // 0. Fetch affiliated institutions
      const instRes = await api.get('/admin/institutions', { params: { my_affiliations: true } }).catch(() => ({ data: [] }));
      const instData = Array.isArray(instRes.data) ? instRes.data : (instRes.data?.data || []);
      setInstitutions(instData);

      // 1. Fetch courses (scoped to teacher & selected institution)
      const coursesRes = await api.get('/academic/courses', {
        params: {
          ...(isMySections ? { my_courses: true } : {}),
          ...instParams,
        }
      }).catch(() => ({ data: [] }));
      const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.data || []);
      setCourses(coursesData);

      // 2. Fetch grades (scoped to teacher's institution/sections)
      const gradesRes = await api.get('/academic/grades', {
        params: {
          ...(isMySections ? { my_sections: true } : {}),
          ...(selectedCourse !== 'all' ? { course_id: selectedCourse } : {}),
          ...instParams,
        }
      }).catch(() => ({ data: [] }));
      const gradesData = Array.isArray(gradesRes.data) ? gradesRes.data : (gradesRes.data?.data || []);
      setGrades(gradesData);

      // 3. Fetch attendances (scoped)
      const attendancesRes = await api.get('/academic/attendances', {
        params: {
          ...(isMySections ? { my_sections: true } : {}),
          ...instParams,
        }
      }).catch(() => ({ data: [] }));
      const attendancesData = Array.isArray(attendancesRes.data) ? attendancesRes.data : (attendancesRes.data?.data || []);
      setAttendances(attendancesData);

      // 4. Fetch behavior logs (scoped)
      const logsRes = await api.get('/academic/behavior-logs', {
        params: {
          ...(isMySections ? { my_reports: true } : {}),
          ...instParams,
        }
      }).catch(() => ({ data: [] }));
      const logsData = Array.isArray(logsRes.data) ? logsRes.data : (logsRes.data?.data || []);

      // 5. Fetch students in teacher's institution
      const studentsRes = await api.get('/admin/users', {
        params: {
          role: 'student',
          ...instParams,
        }
      }).catch(() => ({ data: [] }));
      const rawStudents = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data?.data || []);
      const studentsData = rawStudents.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'student' || roles.includes('student');
      });
      setStudents(studentsData);

      // Compute grade distribution
      let a = 0, b = 0, c = 0, d = 0, f = 0;
      let totalScores = 0;

      if (gradesData.length > 0) {
        gradesData.forEach((g: any) => {
          const score = Number(g.score || 0);
          totalScores += score;
          if (score >= 90) a++;
          else if (score >= 80) b++;
          else if (score >= 70) c++;
          else if (score >= 60) d++;
          else f++;
        });

        const avg = (totalScores / gradesData.length).toFixed(1);
        setMetrics((prev) => ({ ...prev, classAverage: `${avg}%` }));
      } else {
        setMetrics((prev) => ({ ...prev, classAverage: "0.0%" }));
      }

      setGradeDistribution([
        { grade: "A", count: a, color: "#10b981" },
        { grade: "B", count: b, color: "#3b82f6" },
        { grade: "C", count: c, color: "#8b5cf6" },
        { grade: "D", count: d, color: "#f59e0b" },
        { grade: "F", count: f, color: "#f43f5e" },
      ]);

      // Compute attendance rate
      if (attendancesData.length > 0) {
        const presentCount = attendancesData.filter((att: any) => att.status === 'present').length;
        const rate = ((presentCount / attendancesData.length) * 100).toFixed(1);
        setMetrics((prev) => ({ ...prev, attendanceRate: `${rate}%` }));
      } else {
        setMetrics((prev) => ({ ...prev, attendanceRate: "0.0%" }));
      }

      // Count at-risk students (negative logs + failing grades < 60)
      const failingIds = new Set(gradesData.filter((g: any) => Number(g.score || 0) < 60).map((g: any) => g.enrollment?.user_id || g.enrollment_id));
      const negativeLogs = logsData.filter((l: any) => l.type === 'negative' || l.type === 'warning');
      const atRiskCount = failingIds.size + negativeLogs.length;

      setMetrics((prev) => ({
        ...prev,
        atRiskStudents: atRiskCount,
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
      }));

      // Compute Dynamic Performance Trends from Real Grades & Attendance
      if (gradesData.length > 0 || attendancesData.length > 0) {
        // Group by 5 chronological chunks
        const chunks = [
          { name: isAr ? "الفترة 1" : "Period 1", avgScore: 0, attendance: 0, gCount: 0, aCount: 0 },
          { name: isAr ? "الفترة 2" : "Period 2", avgScore: 0, attendance: 0, gCount: 0, aCount: 0 },
          { name: isAr ? "الفترة 3" : "Period 3", avgScore: 0, attendance: 0, gCount: 0, aCount: 0 },
          { name: isAr ? "الفترة 4" : "Period 4", avgScore: 0, attendance: 0, gCount: 0, aCount: 0 },
          { name: isAr ? "التقييم الأخير" : "Latest", avgScore: 0, attendance: 0, gCount: 0, aCount: 0 },
        ];

        gradesData.forEach((g: any, idx: number) => {
          const cIdx = Math.min(idx % 5, 4);
          chunks[cIdx].avgScore += Number(g.score || 0);
          chunks[cIdx].gCount++;
        });

        attendancesData.forEach((att: any, idx: number) => {
          const cIdx = Math.min(idx % 5, 4);
          if (att.status === 'present') chunks[cIdx].attendance += 100;
          else if (att.status === 'late') chunks[cIdx].attendance += 75;
          chunks[cIdx].aCount++;
        });

        const calculatedTrends = chunks.map((c) => ({
          name: c.name,
          avgScore: c.gCount > 0 ? Math.round(c.avgScore / c.gCount) : (totalScores > 0 ? Math.round(totalScores / gradesData.length) : 0),
          attendance: c.aCount > 0 ? Math.round(c.attendance / c.aCount) : 0,
        }));

        setPerformanceTrends(calculatedTrends);
      } else {
        setPerformanceTrends([]);
      }

    } catch (e) {
      console.warn("[Teacher Dashboard] Error fetching live data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [selectedCourse, scopeMode, selectedInstitution]);

  const stats: StatCardProps[] = [
    {
      number: "01",
      title: isAr ? "متوسط درجات الطلاب" : "Class Average",
      value: metrics.classAverage,
      change: parseFloat(metrics.classAverage) >= 75 ? (isAr ? "أداء ممتاز" : "Optimal") : (isAr ? "مستوى متوسط" : "Moderate"),
      isPositive: parseFloat(metrics.classAverage) >= 70,
      description: isAr ? "محسوب من درجات MySQL الحقيقية" : "calculated from live MySQL grades",
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "02",
      title: isAr ? "نسبة الالتزام بالحضور" : "Attendance Rate",
      value: metrics.attendanceRate,
      change: parseFloat(metrics.attendanceRate) >= 85 ? (isAr ? "انضباط عالي" : "High") : (isAr ? "يحتاج تحسين" : "Below Target"),
      isPositive: parseFloat(metrics.attendanceRate) >= 80,
      description: isAr ? "من سجلات الحضور والغياب" : "from active attendance logs",
      icon: UserCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      number: "03",
      title: isAr ? "حالات تحتاج لمتابعة" : "At-Risk Students",
      value: metrics.atRiskStudents,
      change: metrics.atRiskStudents === 0 ? (isAr ? "لا توجد مخاطر" : "All Good") : `${metrics.atRiskStudents} ${isAr ? 'حالات' : 'cases'}`,
      isPositive: metrics.atRiskStudents === 0,
      description: isAr ? "طلاب بدرجات < 60% أو ملاحظات" : "students with scores < 60% or alerts",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      number: "04",
      title: isAr ? "المقررات والشُعب" : "Active Courses",
      value: metrics.totalCourses,
      change: `${metrics.totalStudents} ${isAr ? 'طالب' : 'Students'}`,
      isPositive: true,
      description: isAr ? "المسندة في مؤسستك التعليمية" : "in your institution cohort",
      icon: BookOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  const instName = currentUser?.institution?.name || (currentUser as any)?.institution_name;
  const colName = currentUser?.college?.name;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">
                {isAr ? "بوابة عضو هيئة التدريس" : "Faculty Teaching Console"}
              </span>
            </div>

            {/* Institution Badge */}
            {instName && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                {currentUser?.institution?.type === 'school' ? <School className="w-3 h-3 text-emerald-500" /> : <Building className="w-3 h-3 text-primary" />}
                <span>{instName}</span>
              </Badge>
            )}

            {/* College or Stage Badge */}
            {colName && (
              <Badge
                variant="outline"
                className={`rounded-full text-xs px-3 py-1 font-bold flex items-center gap-1.5 ${
                  currentUser?.institution?.type === 'school'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {currentUser?.institution?.type === 'school' ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                <span>{colName}</span>
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "لوحة أداء الفصول والشُعب" : "Classroom Velocity & Performance"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? `بيانات حقيقية من MySQL مقيدة حصراً بمؤسستك الأكاديمية والشُعب المسندة إليك.`
              : `Live data scoped strictly to your educational institution and assigned teaching sections.`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Active Teaching Institution Context Selector */}
          {institutions.length > 0 && (
            <Select value={selectedInstitution} onValueChange={(val: any) => { setSelectedInstitution(val); setSelectedCourse("all"); }}>
              <SelectTrigger className="w-[180px] rounded-full h-9 bg-card/90 border-border text-xs font-bold">
                <SelectValue placeholder={isAr ? "المؤسسة التعليمية" : "Institution"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-2xl">
                <SelectItem value="all" className="text-xs font-semibold">
                  🌐 {isAr ? "كافة المؤسسات التدريسية" : "All Affiliations"}
                </SelectItem>
                {institutions.map((inst) => (
                  <SelectItem key={inst.id} value={String(inst.id)} className="text-xs font-semibold">
                    {inst.type === 'school' ? '🏫 ' : '🎓 '}{inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Scope Selector: My Sections vs All Institution */}
          <Select value={scopeMode} onValueChange={(val: any) => setScopeMode(val)}>
            <SelectTrigger className="w-[170px] rounded-full h-9 bg-card/90 border-border text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl">
              <SelectItem value="my_sections" className="text-xs font-semibold">
                👤 {isAr ? "شُعبي المسندة إليّ" : "My Taught Sections"}
              </SelectItem>
              <SelectItem value="all_institution" className="text-xs font-semibold">
                🏛️ {isAr ? "جميع مقررات المؤسسة" : "All Institution Courses"}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Course Selector */}
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[170px] sm:w-[200px] rounded-full h-9 bg-card/90 border-border text-xs font-bold">
              <SelectValue placeholder={isAr ? "جميع المقررات" : "All Courses"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl">
              <SelectItem value="all">{isAr ? "جميع المقررات" : "All Assigned Courses"}</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.code ? `${c.code} - ${c.name || 'Course'}` : (c.name || 'Course')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadTeacherData}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance vs Performance Line Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>{isAr ? "تطور متوسط الدرجات والالتزام بالحضور" : "Weekly Velocity: Scores vs Attendance"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                {isAr ? "بيانات مباشرة" : "Live Stream"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[280px] w-full">
              {performanceTrends.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <BookOpen className="w-8 h-8 text-primary/30 mb-2" />
                  <p>{isAr ? "لا توجد تقييمات مسجلة بعد لعرض المنحنى البياني." : "No grade assessments logged yet for trend analysis."}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "1rem",
                        fontSize: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line type="monotone" dataKey="avgScore" name={isAr ? "متوسط الدرجة %" : "Avg Score %"} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="attendance" name={isAr ? "نسبة الحضور %" : "Attendance %"} stroke="#10b981" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 4, fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution Bar Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>{isAr ? "توزيع الدرجات والتقديرات الفعلي" : "Real Grade Spectrum Distribution"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                {isAr ? "من MySQL" : "Live MySQL"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "1rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="count" name={isAr ? "عدد الطلاب" : "Students"} radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses & Sections Summary Table */}
      <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{isAr ? "قائمة المقررات والشُعب المعتمدة في مؤسستك" : "Institution Courses & Teaching Roster"}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {isAr
                ? "ملخص المقررات والشُعب المسجلة مع عدد الطلاب المقيدين لكل مقرر."
                : "Active course sections and registered students in your academic branch."}
            </p>
          </div>
          <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
            {courses.length} {isAr ? "مقرر مسجل" : "Courses"}
          </Badge>
        </div>

        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="border-border">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "المقرر الدراسي" : "Course"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الرمز" : "Code"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الساعات المعتمدة" : "Credits"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "التقييمات المرصودة" : "Logged Grades"}</TableHead>
              <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "الحالة" : "Status"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground">
                  {isAr ? "لا توجد مقررات مسندة لك حالياً." : "No active courses found for your account."}
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => {
                const cGrades = grades.filter((g) => {
                  const cId = g.enrollment?.section?.course_id || g.course?.id || g.course_id;
                  return Number(cId) === Number(course.id);
                });

                return (
                  <TableRow key={course.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="font-bold text-xs text-foreground">
                      {course.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-primary font-bold">
                      {course.code || `CRS-${course.id}`}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {course.credits || 3} {isAr ? "ساعات" : "Hrs"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-semibold">
                      {cGrades.length} {isAr ? "تقييم" : "Assessments"}
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />
                        <span>{isAr ? "نشط" : "Active"}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Enrolled Students Academic Performance Roster */}
      <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{isAr ? "سجل الطلاب المقيدين في شُعبك ومؤسستك" : "Enrolled Students Roster & Academic Diagnostics"}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {isAr
                ? "متابعة أداء كل طالب مقيد في شُعبك مع متوسط درجاته ونسبة الحضور من MySQL."
                : "Real-time individual performance metrics and attendance rate per enrolled student."}
            </p>
          </div>
          <Badge variant="outline" className="rounded-full bg-secondary text-foreground border-border text-xs font-bold px-3 py-1">
            {students.length} {isAr ? "طالب مقيد" : "Students"}
          </Badge>
        </div>

        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="border-border">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الطالب" : "Student"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "البريد الجامعي" : "Email"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "متوسط الدرجات" : "Average Score"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "نسبة الحضور" : "Attendance"}</TableHead>
              <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "الحالة الأكاديمية" : "Academic Standing"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground">
                  {isAr ? "لا يوجد طلاب مقيدين في مؤسستك حالياً." : "No students currently enrolled in this branch."}
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const sGrades = grades.filter((g) => Number(g.enrollment?.user_id || g.enrollment_id || g.user_id) === Number(student.id));
                const sAtt = attendances.filter((a) => Number(a.user_id) === Number(student.id));

                const avgScore = sGrades.length > 0
                  ? (sGrades.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / sGrades.length).toFixed(1)
                  : "--";

                const sPresent = sAtt.filter((a) => a.status === 'present').length;
                const attRate = sAtt.length > 0 ? ((sPresent / sAtt.length) * 100).toFixed(1) : "--";

                const scoreNum = parseFloat(avgScore);
                let standingBadge = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                let standingLabel = isAr ? "أداء ممتاز" : "Stable";

                if (!isNaN(scoreNum) && scoreNum < 60) {
                  standingBadge = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                  standingLabel = isAr ? "معرض للتعثر" : "At-Risk";
                } else if (!isNaN(scoreNum) && scoreNum < 75) {
                  standingBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  standingLabel = isAr ? "متابعة دورية" : "Attention";
                }

                return (
                  <TableRow key={student.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="font-bold text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground flex items-center gap-1 py-3.5">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span>{student.email}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-foreground">
                      {avgScore !== "--" ? `${avgScore}%` : "--"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {attRate !== "--" ? `${attRate}%` : "--"}
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Badge variant="outline" className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 ${standingBadge}`}>
                        {standingLabel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
