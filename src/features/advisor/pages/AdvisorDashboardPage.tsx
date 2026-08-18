import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  AlertTriangle,
  Filter,
  MoreHorizontal,
  User,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  MessageCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_AT_RISK_STUDENTS = [
  { id: 1, name: "Eva Green", idNumber: "STU-003", major: "Computer Science", riskScore: 92, riskLevel: "Critical", gpa: 2.1, attendance: 65, flags: ["Attendance", "Grades"], initials: "EG", color: "bg-rose-500" },
  { id: 2, name: "David Miller", idNumber: "STU-002", major: "Physics", riskScore: 78, riskLevel: "High", gpa: 2.4, attendance: 75, flags: ["Grades"], initials: "DM", color: "bg-amber-500" },
  { id: 3, name: "Charlie Brown", idNumber: "STU-001", major: "Mathematics", riskScore: 65, riskLevel: "Medium", gpa: 2.8, attendance: 82, flags: ["Behavior"], initials: "CB", color: "bg-blue-500" },
  { id: 4, name: "Alice Smith", idNumber: "STU-004", major: "English", riskScore: 45, riskLevel: "Low", gpa: 3.2, attendance: 88, flags: ["Lateness"], initials: "AS", color: "bg-emerald-500" },
];

export default function AdvisorDashboardPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  const filteredStudents = MOCK_AT_RISK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "All" || s.riskLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return { label: isAr ? "حرج جداً" : "Critical", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" };
      case 'High':
        return { label: isAr ? "مرتفع" : "High Risk", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
      case 'Medium':
        return { label: isAr ? "متوسط" : "Medium Watch", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
      case 'Low':
        return { label: isAr ? "منخفض" : "Low Risk", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
      default:
        return { label: level, bg: "bg-secondary text-muted-foreground border-border" };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3.5 py-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tracking-wide uppercase">
              {isAr ? "نظام الرصد والتدخل الطلابي" : "Early-Warning & Intervention Roster"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "قائمة الطلاب تحت المتابعة الأكاديمية" : "At-Risk Student Roster"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "مراقبة مؤشرات السلوك والغياب للطلاب المسندين إليك، وتنسيق خطط الدعم الاستباقية فوراً."
              : "Track behavioral alerts, attendance dips, and GPA trajectories to coordinate multi-disciplinary support."}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Monitored */}
        <div className="group relative bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/25 transition-all duration-300 overflow-hidden">
          <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.06] pointer-events-none select-none font-mono">
            01
          </span>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl scale-[1.3] opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center rounded-2xl shadow-xs">
                <User className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {isAr ? "نشط" : "Assigned"}
            </span>
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isAr ? "إجمالي الطلاب المتابعين" : "Total Monitored Students"}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">156</p>
            <p className="text-xs text-muted-foreground pt-1">
              {isAr ? "تحت إشرافك المباشر" : "Assigned under your caseload"}
            </p>
          </div>
        </div>

        {/* Card 2: Critical High Risk */}
        <div className="group relative bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-500/30 transition-all duration-300 overflow-hidden">
          <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.06] pointer-events-none select-none font-mono">
            02
          </span>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/10 rounded-2xl scale-[1.3] opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center rounded-2xl shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {isAr ? "أولوية عاجلة" : "Urgent Action"}
            </span>
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isAr ? "حالات الخطر الحرج / المرتفع" : "Critical / High Risk Cases"}
            </p>
            <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-500 tracking-tight">14</p>
            <p className="text-xs text-muted-foreground pt-1">
              {isAr ? "تحتاج تدخلاً خلال 24 ساعة" : "Require intervention within 24h"}
            </p>
          </div>
        </div>

        {/* Card 3: Avg Monitored GPA */}
        <div className="group relative bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden">
          <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.06] pointer-events-none select-none font-mono">
            03
          </span>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl scale-[1.3] opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-2xl shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {isAr ? "+0.3 تحسن" : "+0.3 Growth"}
            </span>
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isAr ? "متوسط المعدل التراكمي (GPA)" : "Avg. Monitored GPA"}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">2.70</p>
            <p className="text-xs text-muted-foreground pt-1">
              {isAr ? "تحسن بعد جلسات الدعم" : "Recovering post-intervention"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Roster Card */}
      <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              {isAr ? "سجل تقييم المخاطر الشامل" : "Risk Assessment & Triage Roster"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {isAr ? "تصفية وفرز الطلاب حسب مستوى الخطر ومؤشرات التعثر" : "Filter and prioritize students requiring proactive counseling support"}
            </CardDescription>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? "بحث بالاسم أو الرقم الأكاديمي..." : "Search by name or ID..."}
                className="pl-9 rtl:pr-9 rtl:pl-3 bg-secondary/60 border-border rounded-full text-xs font-medium focus-visible:ring-primary/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 bg-secondary/60 border border-border rounded-full p-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-2 rtl:mr-2 rtl:ml-0" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[120px] h-8 border-0 bg-transparent text-xs font-semibold focus:ring-0">
                  <SelectValue placeholder={isAr ? "مستوى الخطر" : "Risk Level"} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  <SelectItem value="All">{isAr ? "الكل" : "All Levels"}</SelectItem>
                  <SelectItem value="Critical">{isAr ? "حرج (Critical)" : "Critical"}</SelectItem>
                  <SelectItem value="High">{isAr ? "مرتفع (High)" : "High"}</SelectItem>
                  <SelectItem value="Medium">{isAr ? "متوسط (Medium)" : "Medium"}</SelectItem>
                  <SelectItem value="Low">{isAr ? "منخفض (Low)" : "Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow className="border-border">
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
                    {isAr ? "الطالب" : "Student"}
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "التخصص / البرنامج" : "Major / Program"}
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "مؤشر الخطر" : "AI Risk Score"}
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "المعدل / الحضور" : "GPA & Attendance"}
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "مؤشرات التنبيه" : "Flags"}
                  </TableHead>
                  <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "الإجراء" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={6} className="text-center h-40 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-muted-foreground/40" />
                        <span>{isAr ? "لا توجد سجلات مطابقة لمعايير البحث." : "No at-risk students found matching your criteria."}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => {
                    const riskBadge = getRiskBadge(student.riskLevel);
                    return (
                      <TableRow key={student.id} className="border-border hover:bg-secondary/40 transition-colors">
                        {/* Student Name & Avatar */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${student.color} text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0`}>
                              {student.initials}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-foreground">{student.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{student.idNumber}</div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Major */}
                        <TableCell className="text-xs font-medium text-muted-foreground">
                          {student.major}
                        </TableCell>

                        {/* Risk Score */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-base text-foreground">{student.riskScore}%</span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${riskBadge.bg}`}>
                              {riskBadge.label}
                            </span>
                          </div>
                        </TableCell>

                        {/* GPA / Attd */}
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className={`font-mono font-semibold ${student.gpa < 2.5 ? 'text-rose-500 font-bold' : 'text-foreground'}`}>
                              GPA: {student.gpa}
                            </span>
                            <span className={`font-mono ${student.attendance < 80 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                              {isAr ? "الحضور:" : "Attd:"} {student.attendance}%
                            </span>
                          </div>
                        </TableCell>

                        {/* Flags */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.flags.map((flag) => (
                              <span key={flag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                                {flag}
                              </span>
                            ))}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right rtl:text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border text-foreground rounded-2xl p-1.5 shadow-xl">
                              <DropdownMenuLabel className="text-xs font-bold px-3 py-1.5">{isAr ? "الإجراءات المتاحة" : "Actions"}</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                <span>{isAr ? "عرض الملف الشامل" : "View 360 Profile"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{isAr ? "جدولة جلسة إرشاد" : "Schedule Session"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                                <span>{isAr ? "إشعار ولي الأمر" : "Message Parent"}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
