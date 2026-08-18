import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data
const gpaHistory = [
  { term: "Fall '22", gpa: 3.2 },
  { term: "Spr '23", gpa: 3.4 },
  { term: "Fall '23", gpa: 3.1 },
  { term: "Spr '24", gpa: 2.8 },
  { term: "Current", gpa: 2.9 },
];

const activityData = [
  { week: "W1", logins: 12, assignments: 4 },
  { week: "W2", logins: 15, assignments: 5 },
  { week: "W3", logins: 10, assignments: 3 },
  { week: "W4", logins: 8, assignments: 2 },
  { week: "W5", logins: 5, assignments: 1 },
];

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

  const stats = [
    {
      number: "01",
      title: isAr ? "المعدل التراكمي الحالي" : "Current GPA",
      value: "2.90",
      change: "-0.20",
      isPositive: false,
      description: isAr ? "المستهدف الفصلي: 3.20" : "Target goal: 3.20 GPA",
      icon: GraduationCap,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      number: "02",
      title: isAr ? "نسبة الحضور الإجمالية" : "Attendance Rate",
      value: "82.0%",
      change: "+3.5%",
      isPositive: true,
      description: isAr ? "الحد الأدنى المطلوب 90%" : "Required threshold: 90%",
      icon: Clock,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "03",
      title: isAr ? "مستوى التفاعل الأكاديمي" : "Engagement Level",
      value: isAr ? "متوسط" : "Moderate",
      change: "-40%",
      isPositive: false,
      description: isAr ? "انخفاض وتيرة تسجيل الدخول" : "Portal logins down this week",
      icon: Activity,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      number: "04",
      title: isAr ? "تنبيهات الاستجابة" : "Pending Alerts",
      value: "02",
      change: isAr ? "مطلوب إجراء" : "Action Req",
      isPositive: false,
      description: isAr ? "الفيزياء 1 وهياكل البيانات" : "Physics I & Data Structures",
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
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3.5 py-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wide uppercase">
              {isAr ? "بوابة الطالب الأكاديمية والذكية" : "Student Academic & AI Hub"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "مرحباً بك، أليكس جونسون" : "Welcome Back, Alex"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "متابعة أدائك الفصلي، خطط التقوية المقترحة من المرشد، وجدول المهام القادمة."
              : "Track your semester performance trajectory, AI-recommended study milestones, and upcoming tasks."}
          </p>
        </div>

        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 py-2 px-4 rounded-full text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{isAr ? "لديك تنبيهان بحاجة للمتابعة" : "2 Academic Alerts Pending"}</span>
        </Badge>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Trajectory Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>{isAr ? "المسار التراكمي للمعدل (GPA)" : "GPA Historical Trajectory"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                {isAr ? "الهدف: 3.20" : "Target: 3.20"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentGpaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 4]} stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '1rem',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#studentGpaGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Bar Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span>{isAr ? "مستوى التفاعل وتسليم الواجبات" : "Weekly Portal Logins vs Submitted Work"}</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> {isAr ? "دخول" : "Logins"}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {isAr ? "واجبات" : "Work"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '1rem',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                    cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                  />
                  <Bar dataKey="logins" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="assignments" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Requirements Card */}
      <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6">
        <CardHeader className="p-0 pb-4 border-b border-border/70 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground">
              {isAr ? "المهام والمواعيد الهامة القادمة" : "Upcoming Milestones & Advising Tasks"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {isAr ? "إجراءات مطلوبة لضمان استقرار مسارك الأكاديمي" : "Complete pending steps to stay on track for semester goals"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-secondary/50 border border-border/80 rounded-2xl hover:bg-secondary/70 transition-colors gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">{isAr ? "اختبار منتصف الفصل: الفيزياء العامة I" : "Physics I Midterm Exam"}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "متبقي يومان — قاعة 102B" : "Due in 2 days — Room 102B"}</p>
              </div>
            </div>
            <Button size="sm" className="rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 h-8 shadow-xs">
              <span>{isAr ? "عرض التفاصيل" : "View Syllabus"}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 ml-1" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-secondary/50 border border-border/80 rounded-2xl hover:bg-secondary/70 transition-colors gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">{isAr ? "جلسة الإرشاد الأكاديمي الفردية" : "1-on-1 Academic Advising Check-in"}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "مطلوبة قبل اعتماد جدول الفصل القادم" : "Required before next semester registration"}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-full border-border text-xs font-semibold px-4 h-8">
              <span>{isAr ? "حجز موعد" : "Schedule Slot"}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
