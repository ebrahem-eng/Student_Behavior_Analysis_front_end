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
  Activity,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AreaChart,
  Area,
} from "recharts";

// Mock Data
const attendanceData = [
  { name: "Jan", present: 95, absent: 5 },
  { name: "Feb", present: 92, absent: 8 },
  { name: "Mar", present: 88, absent: 12 },
  { name: "Apr", present: 90, absent: 10 },
  { name: "May", present: 94, absent: 6 },
  { name: "Jun", present: 96, absent: 4 },
];

const riskData = [
  { subject: "Math", atRisk: 120 },
  { subject: "Physics", atRisk: 85 },
  { subject: "Chemistry", atRisk: 65 },
  { subject: "English", atRisk: 30 },
  { subject: "History", atRisk: 15 },
];

const performanceData = [
  { term: "Term 1", score: 75 },
  { term: "Term 2", score: 78 },
  { term: "Term 3", score: 82 },
  { term: "Term 4", score: 85 },
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
    {/* Background Watermark Number */}
    <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.06] pointer-events-none select-none transition-all duration-300 font-mono">
      {number}
    </span>

    <div className="flex items-start justify-between mb-4 relative z-10">
      {/* Double-ring halo icon */}
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

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const stats = [
    {
      number: "01",
      title: isAr ? "إجمالي الطلاب" : "Total Students",
      value: "45,231",
      change: "+12.5%",
      isPositive: true,
      description: isAr ? "مقارنة بالعام الماضي" : "vs last academic year",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      number: "02",
      title: isAr ? "متوسط الحضور" : "Avg. Attendance",
      value: "92.4%",
      change: "-2.1%",
      isPositive: false,
      description: isAr ? "مقارنة بالشهر السابق" : "vs previous month",
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "03",
      title: isAr ? "الطلاب تحت المتابعة" : "At-Risk Students",
      value: "1,204",
      change: "-5.4%",
      isPositive: true,
      description: isAr ? "انخفاض حالات التعثر" : "reduced dropout risk",
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      number: "04",
      title: isAr ? "المقررات النشطة" : "Active Courses",
      value: "842",
      change: "+4.2%",
      isPositive: true,
      description: isAr ? "مقررات مفعلة بالنظام" : "active curricula",
      icon: BookOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              {isAr ? "التحكم المركزي بالمنظومة" : "Central Enterprise Console"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "نظرة عامة على أداء المؤسسات" : "Institutional System Overview"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "مؤشرات التحليل التنبؤي، نسب الحضور، ومعدلات التدخل الأكاديمي عبر كافة الكليات والمدارس."
              : "Cross-campus predictive behavioral indicators, attendance tracking, and multi-tier intervention rates."}
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-semibold text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{isAr ? "الخوارزمية نشطة: v4.2" : "AI Core: v4.2 Active"}</span>
          </div>
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
        {/* Attendance Area Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{isAr ? "مسار الحضور التراكمي السنوي" : "System-wide Attendance Trajectory"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                92.4% Avg
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminPresentGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[70, 100]} />
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
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#adminPresentGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk by Subject Bar Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>{isAr ? "الطلاب تحت المتابعة حسب التخصص" : "At-Risk Cohort by Subject"}</span>
              </CardTitle>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                {isAr ? "تحليل فوري" : "Live Triage"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
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
                  <Bar dataKey="atRisk" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Global Performance Line Chart */}
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm hover:shadow-md transition-all p-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>{isAr ? "المتوسط التراكمي للأداء الأكاديمي العام" : "Global Performance & Milestone Progression"}</span>
              </CardTitle>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                <span>{isAr ? "تحسن مستمر +13.3%" : "+13.3% Continuous Improvement"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[60, 100]} />
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
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3.5}
                    dot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
