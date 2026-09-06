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
  Activity,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { api } from "@/lib/api";

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
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<{
    total_students: number;
    total_teachers: number;
    active_high_risk_alerts: number;
    total_active_enrollments: number;
  }>({
    total_students: 0,
    total_teachers: 0,
    active_high_risk_alerts: 0,
    total_active_enrollments: 0,
  });

  const attendanceTrends = [
    { name: "Jan", present: 95, absent: 5 },
    { name: "Feb", present: 92, absent: 8 },
    { name: "Mar", present: 88, absent: 12 },
    { name: "Apr", present: 90, absent: 10 },
    { name: "May", present: 94, absent: 6 },
    { name: "Jun", present: 96, absent: 4 },
  ];

  const riskBySubject = [
    { subject: "Math", atRisk: 12 },
    { subject: "Physics", atRisk: 8 },
    { subject: "Chemistry", atRisk: 6 },
    { subject: "English", atRisk: 3 },
    { subject: "History", atRisk: 1 },
  ];

  const performanceData = [
    { term: "Term 1", score: 75 },
    { term: "Term 2", score: 78 },
    { term: "Term 3", score: 82 },
    { term: "Term 4", score: 85 },
  ];

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live admin stats from Laravel /admin/dashboard/stats
      const statsRes = await api.get('/admin/dashboard/stats');
      if (statsRes.data) {
        setStatsData({
          total_students: statsRes.data.total_students ?? 0,
          total_teachers: statsRes.data.total_teachers ?? 0,
          active_high_risk_alerts: statsRes.data.active_high_risk_alerts ?? 0,
          total_active_enrollments: statsRes.data.total_active_enrollments ?? 0,
        });
      }
    } catch (e) {
      console.warn('[Admin Dashboard] Live stats fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    {
      number: "01",
      title: isAr ? "إجمالي الطلاب" : "Total Students",
      value: statsData.total_students.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      description: isAr ? "مسجلون في قاعدة البيانات" : "enrolled in database",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      number: "02",
      title: isAr ? "أعضاء هيئة التدريس" : "Total Faculty",
      value: statsData.total_teachers.toLocaleString(),
      change: "+4.2%",
      isPositive: true,
      description: isAr ? "معلمون ومحاضرون نشطون" : "active faculty staff",
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      number: "03",
      title: isAr ? "إنذارات الخطر الحرج" : "High-Risk Alerts",
      value: statsData.active_high_risk_alerts.toLocaleString(),
      change: "-5.4%",
      isPositive: true,
      description: isAr ? "تنبيهات حرجة نشطة" : "active unread critical alerts",
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      number: "04",
      title: isAr ? "التسجيلات الدراسية النشطة" : "Active Enrollments",
      value: statsData.total_active_enrollments.toLocaleString(),
      change: "+8.1%",
      isPositive: true,
      description: isAr ? "شُعب ومقررات نشطة" : "active student enrollments",
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
              ? "مؤشرات حية متصلة بقاعدة البيانات MySQL لتحليل نسب الحضور والتعثر الأكاديمي عبر المؤسسات."
              : "Live analytics connected directly to your MySQL database for real-time institutional intelligence."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث البيانات" : "Refresh Live Data"}</span>
          </Button>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-secondary/80 border border-border text-xs font-semibold text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{isAr ? "متصل بقاعدة MySQL" : "Live MySQL API"}</span>
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
                <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <BarChart data={riskBySubject} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
