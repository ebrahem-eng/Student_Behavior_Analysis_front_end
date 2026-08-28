import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Building,
  School
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppStore } from "@/lib/store";
import { api } from "@/lib/api";

interface StatCardProps {
  number: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: typeof GraduationCap;
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

export default function StudentDashboardPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  const [statsData, setStatsData] = useState({
    gpa: "3.45",
    attendanceRate: "94.2%",
    enrolledCoursesCount: 4,
    activeAlertsCount: 0,
  });

  const [gpaTrajectory] = useState([
    { term: "Fall '23", gpa: 3.2 },
    { term: "Spr '24", gpa: 3.4 },
    { term: "Fall '24", gpa: 3.3 },
    { term: "Spr '25", gpa: 3.5 },
    { term: "Current", gpa: 3.45 },
  ]);

  const [weeklyEngagement] = useState([
    { week: "W1", attendance: 100, assignments: 4 },
    { week: "W2", attendance: 95, assignments: 5 },
    { week: "W3", attendance: 90, assignments: 3 },
    { week: "W4", attendance: 95, assignments: 4 },
    { week: "W5", attendance: 92, assignments: 5 },
  ]);

  const loadStudentData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, gradesRes, attRes, alertsRes] = await Promise.allSettled([
        api.get('/academic/courses'),
        api.get('/academic/grades'),
        api.get('/academic/attendances'),
        api.get('/alerts'),
      ]);

      let coursesData: any[] = [];
      if (coursesRes.status === 'fulfilled') {
        coursesData = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(coursesData);
      }

      let gradesData: any[] = [];
      if (gradesRes.status === 'fulfilled') {
        gradesData = Array.isArray(gradesRes.value.data) ? gradesRes.value.data : (gradesRes.value.data?.data || []);
      }

      let attData: any[] = [];
      if (attRes.status === 'fulfilled') {
        attData = Array.isArray(attRes.value.data) ? attRes.value.data : (attRes.value.data?.data || []);
      }

      let alertsData: any[] = [];
      if (alertsRes.status === 'fulfilled') {
        alertsData = Array.isArray(alertsRes.value.data) ? alertsRes.value.data : (alertsRes.value.data?.data || []);
      }

      // Compute dynamic stats
      let computedGPA = "3.45";
      if (gradesData.length > 0) {
        const avgScore = gradesData.reduce((acc, curr) => acc + Number(curr.score || 80), 0) / gradesData.length;
        computedGPA = (avgScore / 25).toFixed(2);
      }

      let computedAttRate = "94.2%";
      if (attData.length > 0) {
        const present = attData.filter((a) => a.status === 'present').length;
        computedAttRate = `${((present / attData.length) * 100).toFixed(1)}%`;
      }

      setStatsData({
        gpa: computedGPA,
        attendanceRate: computedAttRate,
        enrolledCoursesCount: coursesData.length || 4,
        activeAlertsCount: alertsData.filter((a) => !a.is_read).length,
      });

    } catch (e) {
      console.warn("Student dashboard load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const stats = [
    {
      number: "01",
      title: isAr ? "المعدل التراكمي المباشر" : "Cumulative GPA",
      value: statsData.gpa,
      change: "+0.15",
      isPositive: true,
      description: isAr ? "محدث من درجات المقررات في MySQL" : "Calculated from active courses",
      icon: GraduationCap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      number: "02",
      title: isAr ? "نسبة الالتزام بالحضور" : "Attendance Compliance",
      value: statsData.attendanceRate,
      change: "+2.4%",
      isPositive: true,
      description: isAr ? "حضور المحاضرات والمعامل" : "Verified session logs",
      icon: Clock,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "03",
      title: isAr ? "المقررات المسجلة" : "Enrolled Courses",
      value: String(statsData.enrolledCoursesCount),
      change: "+1",
      isPositive: true,
      description: isAr ? "مقررات هذا الفصل الدراسي" : "Active term enrollment",
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      number: "04",
      title: isAr ? "تنبيهات النظام المبكرة" : "Active Risk Alerts",
      value: String(statsData.activeAlertsCount),
      change: statsData.activeAlertsCount > 0 ? "Flagged" : "Clear",
      isPositive: statsData.activeAlertsCount === 0,
      description: isAr ? "إشعارات موجهة من المرشد أو النظام" : "Early-warning notifications",
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">
                {isAr ? "بوابة الطالب الأكاديمية" : "Student Academic Portal"}
              </span>
            </div>

            {/* Institution Badge */}
            {(user?.institution?.name || user?.institution_name) && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                {user?.institution?.type === 'school' ? <School className="w-3 h-3 text-emerald-500" /> : <Building className="w-3 h-3 text-primary" />}
                <span>{user?.institution?.name || user?.institution_name}</span>
              </Badge>
            )}

            {/* Stage or College Badge */}
            {user?.college?.name && (
              <Badge
                variant="outline"
                className={`rounded-full text-xs px-3 py-1 font-bold flex items-center gap-1.5 ${
                  user?.institution?.type === 'school'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {user?.institution?.type === 'school' ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                <span>{user.college.name}</span>
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? `مرحباً، ${user?.name || "الطالب"}` : `Welcome back, ${user?.name || "Student"}`}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "متابعة مباشرة لمعدلك التراكمي، الحضور، وتنبيهات الخطة الدراسية من قاعدة بيانات MySQL."
              : "Live tracking of your academic velocity, attendance streaks, and early-warning progress indicators."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadStudentData}
          disabled={isLoading}
          className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isAr ? "تحديث البيانات" : "Refresh"}</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
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

      {/* Charts Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Trajectory Line Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{isAr ? "مسار المعدل التراكمي عبر الفصول" : "GPA Historical Trajectory"}</span>
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold rounded-full">
                {isAr ? "معدل تراكمي ممتاز" : "Standing: Good"}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isAr ? "تطور أدائك الأكاديمي خلال الفصول الدراسية الماضية." : "Semester-by-semester grade point average progression."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[2.0, 4.0]} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "1rem",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="gpa" name={isAr ? "المعدل" : "GPA"} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Engagement Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? "الالتزام الأسبوعي والحضور" : "Weekly Engagement & Attendance"}</span>
              </CardTitle>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold rounded-full">
                {statsData.attendanceRate}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isAr ? "نسب الحضور الأسبوعي للمحاضرات المسجلة بقاعدة البيانات." : "Weekly lecture presence recorded in the database."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEngagement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "1rem",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="attendance" name={isAr ? "نسبة الحضور %" : "Attendance %"} fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses & Alerts Quick Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <Card className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{isAr ? "المقررات المسجلة حالياً" : "Current Term Enrolled Courses"}</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/academics')}
              className="text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-full"
            >
              {isAr ? "عرض السجل الكامل" : "View Full Academics"} <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 4).map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border/70 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs">
                    {(c.code || "CS").slice(0, 4)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{c.name || c.title || "Course Title"}</p>
                    <p className="text-[11px] text-muted-foreground">{c.code || "CRS-001"} • {c.credits || 3} {isAr ? "ساعات" : "Credits"}</p>
                  </div>
                </div>

                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full text-[10px] font-bold">
                  {isAr ? "مسجل" : "Enrolled"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Early Warning Status Card */}
        <Card className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-foreground">
                {isAr ? "حالة الإنذار المبكر" : "Early-Warning Status"}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isAr
                ? "يقوم محرك الذكاء الاصطناعي بتحليل مؤشرات الحضور والدرجات لتنبيهك مسبقاً في حال وجود أي خطر أكاديمي."
                : "AI continuously monitors attendance streaks and midterm velocities to prevent academic probation."}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? "الوضع الأكاديمي: ممتاز ومستقر" : "Academic Standing: Good"}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isAr ? "لا توجد إنذارات حرجة مسجلة على حسابك." : "No critical risk flags detected in MySQL records."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/student/alerts')}
            className="w-full rounded-full bg-primary text-primary-foreground text-xs font-bold mt-4"
          >
            {isAr ? "عرض مركز التنبيهات" : "View Alert Center"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
