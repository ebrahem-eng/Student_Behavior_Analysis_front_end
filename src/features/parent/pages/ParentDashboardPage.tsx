import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Bell,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const childrenList = [
  { id: "STU-001", name: "Alice Johnson", grade: "10th Grade", gpa: 3.40, attendance: 92, status: "Good Standing" },
  { id: "STU-002", name: "Bob Johnson", grade: "8th Grade", gpa: 3.65, attendance: 96, status: "Honor Roll" },
];

const mockAlerts = [
  { id: 1, studentId: "STU-001", type: "warning", titleEn: "Attendance Notice", titleAr: "إشعار تأخر عن الحضور", messageEn: "Alice has missed 2 morning sessions this week.", messageAr: "سُجّل غياب أليس في جلستين صباحيتين هذا الأسبوع.", dateEn: "Today at 09:30 AM", dateAr: "اليوم 09:30 ص", isRead: false },
  { id: 2, studentId: "STU-001", type: "danger", titleEn: "Mathematics Grade Alert", titleAr: "تنبيه درجات مادة الرياضيات", messageEn: "Math homework score has dropped below 70%. Advisor support suggested.", messageAr: "انخفاض درجات واجبات الرياضيات عن 70%، مقترح جلسة دعم إرشادي.", dateEn: "Yesterday", dateAr: "أمس", isRead: true },
  { id: 3, studentId: "STU-002", type: "info", titleEn: "Positive Feedback: Science Expo", titleAr: "إشادة صفية متميزة في العلوم", messageEn: "Bob showed remarkable leadership during the STEM science workshop.", messageAr: "أظهر بوب تفاعلاً وقيادة متميزة خلال ورشة العلوم والتكنولوجيا.", dateEn: "2 days ago", dateAr: "منذ يومين", isRead: true },
];

const mockReports = [
  { id: "R-101", titleEn: "October Monthly Holistic Report", titleAr: "التقرير الشهري الشامل لشهر أكتوبر", date: "Nov 1, 2024", typeEn: "Monthly Progress", typeAr: "تقرير شهري" },
  { id: "R-102", titleEn: "Mid-Term Academic Behavioral Summary", titleAr: "ملخص السلوك والتحصيل النصفي", date: "Oct 15, 2024", typeEn: "Academic Summary", typeAr: "ملخص أكاديمي" },
  { id: "R-103", titleEn: "September Welcome & Baseline Analysis", titleAr: "تقرير التقييم المبدئي لشهر سبتمبر", date: "Oct 1, 2024", typeEn: "Baseline Metric", typeAr: "تقييم أولي" },
];

export default function ParentDashboardPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [selectedChildId, setSelectedChildId] = useState(childrenList[0].id);

  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];
  const activeChildAlerts = mockAlerts.filter((a) => a.studentId === selectedChildId);
  const unreadAlertsCount = activeChildAlerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full px-3.5 py-1">
            <Users className="w-3.5 h-3.5 text-fuchsia-500" />
            <span className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 tracking-wide uppercase">
              {isAr ? "بوابة الأسرة وأولياء الأمور" : "Guardian & Family Portal"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "لوحة متابعة الأبناء الأكاديمية" : "Family Academic Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "متابعة الحضور، الإشعارات السلوكية اللحظية، والتقارير الدورية الصادرة من المدرسة."
              : "Real-time attendance tracking, early behavioral alerts, and official institution milestone reports."}
          </p>
        </div>

        {/* Child Selector Pill */}
        <div className="flex items-center gap-2 bg-secondary/80 border border-border/80 p-1.5 rounded-full shadow-xs">
          <span className="text-xs text-muted-foreground font-semibold px-2.5">
            {isAr ? "الطالب المعروض:" : "Child:"}
          </span>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[190px] h-9 rounded-full bg-card border-border text-xs font-bold text-foreground focus:ring-primary/30">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground rounded-2xl">
              {childrenList.map((child) => (
                <SelectItem key={child.id} value={child.id} className="text-xs font-semibold">
                  {child.name} ({child.grade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left / Main Alerts & Reports Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Alerts Feed Card */}
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6">
            <CardHeader className="p-0 pb-4 border-b border-border/70 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <span>
                    {isAr
                      ? `الإشعارات والتنبيهات الحديثة — ${activeChild.name.split(" ")[0]}`
                      : `Recent Alerts for ${activeChild.name.split(" ")[0]}`}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isAr ? "إشعارات مباشرة من المرشدين ومعلمي الفصول" : "Direct alerts dispatched from faculty and academic counselors"}
                </CardDescription>
              </div>

              {unreadAlertsCount > 0 ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {unreadAlertsCount} {isAr ? "غير مقروء" : "Unread"}
                </span>
              ) : (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? "محدث بالكامل" : "All Caught Up"}</span>
                </span>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4">
              <div className="space-y-3">
                {activeChildAlerts.length > 0 ? (
                  activeChildAlerts.map((alert) => {
                    const isDanger = alert.type === "danger";
                    const isWarning = alert.type === "warning";
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${!alert.isRead
                            ? "bg-secondary/70 border-primary/20 shadow-xs"
                            : "bg-secondary/40 border-border/70 hover:bg-secondary/60"
                          }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isDanger
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                : isWarning
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              }`}
                          >
                            {isDanger ? (
                              <AlertTriangle className="w-5 h-5" />
                            ) : isWarning ? (
                              <Clock className="w-5 h-5" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-bold ${!alert.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                {isAr ? alert.titleAr : alert.titleEn}
                              </h4>
                              {!alert.isRead && (
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {isAr ? alert.messageAr : alert.messageEn}
                            </p>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {isAr ? alert.dateAr : alert.dateEn}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-xs font-semibold hover:bg-card border border-transparent hover:border-border h-8 shrink-0 self-end sm:self-center"
                        >
                          <span>{isAr ? "التفاصيل" : "Details"}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 ml-1" />
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-muted-foreground space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                    <p className="text-sm font-semibold">{isAr ? "لا توجد تنبيهات معلقة حالياً." : "No pending alerts for this student."}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Periodic Reports Table Card */}
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6">
            <CardHeader className="p-0 pb-4 border-b border-border/70 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-fuchsia-500" />
                  <span>{isAr ? "التقارير الأكاديمية والسلوكية الرسمية" : "Official Periodic Reports"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isAr ? "تحميل الملخصات الشهرية والتقارير التراكمية المعتمدة" : "Download approved monthly and semester grade transcripts"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/40">
                    <TableRow className="border-border">
                      <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "عنوان التقرير" : "Report Title"}</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "النوع" : "Type"}</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "تاريخ الإصدار" : "Issued Date"}</TableHead>
                      <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "التحميل" : "Action"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id} className="border-border hover:bg-secondary/40 transition-colors">
                        <TableCell className="font-bold text-xs text-foreground py-3.5">
                          {isAr ? report.titleAr : report.titleEn}
                        </TableCell>
                        <TableCell>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                            {isAr ? report.typeAr : report.typeEn}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {report.date}
                        </TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <Button size="sm" variant="outline" className="h-8 rounded-full border-border text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right / Status Capsule Area (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Active Child Summary Card */}
          <div className="relative bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm overflow-hidden space-y-6">
            <span className="absolute -bottom-3 -right-1 text-7xl font-black text-foreground/[0.03] pointer-events-none select-none font-mono">
              360
            </span>

            <div className="flex items-center gap-3.5 pb-4 border-b border-border/70 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-500 flex items-center justify-center font-black text-lg shadow-xs">
                {activeChild.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{activeChild.name}</h3>
                <p className="text-xs text-muted-foreground">{activeChild.grade} • {activeChild.status}</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{isAr ? "المعدل التراكمي (GPA)" : "Overall GPA"}</p>
                  <p className="text-2xl font-extrabold text-foreground font-mono mt-0.5">{activeChild.gpa}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+0.20</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{isAr ? "نسبة الحضور والالتزام" : "Attendance Rate"}</p>
                  <p className="text-2xl font-extrabold text-foreground font-mono mt-0.5">{activeChild.attendance}%</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {isAr ? "ممتاز" : "Optimal"}
                </span>
              </div>
            </div>

            {/* Direct Advisor Comms Link */}
            <div className="pt-2 relative z-10">
              <Button
                asChild
                className="w-full rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg py-5 flex items-center justify-center gap-2"
              >
                <a href="#comms">
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? "مراسلة المرشد الأكاديمي" : "Message Assigned Advisor"}</span>
                </a>
              </Button>
            </div>
          </div>

          {/* FERPA Compliance Guarantee */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              {isAr
                ? "بيانات أبنائك مشفرة ومحمية وفق أعلى معايير الخصوصية التعليمية."
                : "Student records are 256-bit encrypted and FERPA student privacy compliant."}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
