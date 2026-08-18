import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock Data
const performanceData = [
  { name: "W1", avgScore: 82, attendance: 95 },
  { name: "W2", avgScore: 84, attendance: 93 },
  { name: "W3", avgScore: 81, attendance: 90 },
  { name: "W4", avgScore: 86, attendance: 92 },
  { name: "W5", avgScore: 88, attendance: 96 },
];

const studentDistribution = [
  { grade: "A", count: 14, color: "#10b981" },
  { grade: "B", count: 9, color: "#3b82f6" },
  { grade: "C", count: 5, color: "#8b5cf6" },
  { grade: "D", count: 2, color: "#f59e0b" },
  { grade: "F", count: 1, color: "#f43f5e" },
];

interface StatCardProps {
  number: string;
  title: string;
  value: string;
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

  const stats = [
    {
      number: "01",
      title: isAr ? "إجمالي طلاب الشعبة" : "Total Enrolled",
      value: "124",
      change: "+4",
      isPositive: true,
      description: isAr ? "نشطون في الفصول الحالية" : "active classroom roster",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      number: "02",
      title: isAr ? "المعدل العام للشعبة" : "Class Avg. GPA",
      value: "3.42",
      change: "+0.24",
      isPositive: true,
      description: isAr ? "أعلى من متوسط الكلية (3.10)" : "above school average (3.10)",
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "03",
      title: isAr ? "نسبة الحضور التراكمي" : "Class Attendance",
      value: "93.2%",
      change: "-1.5%",
      isPositive: false,
      description: isAr ? "مقارنة بالأسبوع الماضي" : "vs previous week target",
      icon: BookOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      number: "04",
      title: isAr ? "تنبيهات التعثر السلوكي" : "Behavioral Alerts",
      value: "3",
      change: "-2",
      isPositive: true,
      description: isAr ? "تمت إحالتها للمرشد" : "assigned to counseling",
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
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              {isAr ? "لوحة المعلم وإدارة الفصول" : "Faculty Instructional Portal"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "تحليل أداء الفصول والأنشطة" : "Classroom Performance Analytics"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "متابعة تطور تحصيل الطلاب، رصد الغياب، وتوليد التوصيات الذكية لتعزيز الاستيعاب."
              : "Track learning velocity, log daily attendance, and generate AI guidance tailored to course cohorts."}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] h-10 rounded-full bg-secondary/80 border-border text-xs font-semibold focus:ring-primary/30">
              <SelectValue placeholder={isAr ? "اختر المقرر الدراسي" : "Select Course"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground rounded-2xl">
              <SelectItem value="all">{isAr ? "جميع المقررات (تجميعي)" : "All Courses (Aggregate)"}</SelectItem>
              <SelectItem value="math101">{isAr ? "الرياضيات 101" : "Mathematics 101"}</SelectItem>
              <SelectItem value="phys201">{isAr ? "الفيزياء العامة 201" : "Physics 201"}</SelectItem>
              <SelectItem value="cs301">{isAr ? "علوم الحاسب 301" : "Computer Science 301"}</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg h-10 px-5 flex items-center gap-2">
                <Download className="h-3.5 w-3.5" />
                <span>{isAr ? "تصدير التقرير" : "Export Report"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card border-border text-foreground rounded-2xl p-1.5 shadow-xl" align="end">
              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-rose-500" />
                <span>{isAr ? "تصدير بصيغة PDF" : "Export as PDF"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                <span>{isAr ? "تصدير بصيغة Excel" : "Export as Excel"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        {/* Class Performance Trend */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>{isAr ? "تطور متوسط الدرجات والحضور الأسبوعي" : "Weekly Score & Attendance Velocity"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                5 Weeks Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[60, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[70, 100]} />
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
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgScore"
                    name={isAr ? "متوسط الدرجات" : "Avg Score"}
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendance"
                    name={isAr ? "نسبة الحضور %" : "Attendance %"}
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span>{isAr ? "توزيع تقديرات الطلاب الحالية" : "Cohort Grade Distribution"}</span>
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? "74% بتقدير جيد فما فوق" : "74% Above B Grade"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
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
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
