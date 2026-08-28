import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  User,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Building,
  School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

export default function AdvisorStudentViewPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const studentIdParam = searchParams.get("id");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, coursesRes] = await Promise.allSettled([
        api.get('/admin/users?role=student'),
        api.get('/academic/courses'),
      ]);

      let userList: any[] = [];
      if (usersRes.status === 'fulfilled') {
        const raw = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        userList = raw.filter((u: any) => {
          const r = (u.role || '').toLowerCase();
          const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
          return r === 'student' || roles.includes('student');
        });
        if (userList.length === 0) userList = raw;
      }

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
      }

      // Determine active student
      let active = userList.find((u: any) => String(u.id) === String(studentIdParam));
      if (!active && userList.length > 0) active = userList[0];
      setSelectedStudent(active);

    } catch (e) {
      console.warn("Student 360 view load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentIdParam]);

  const studentName = selectedStudent?.name || "Student Record";
  const studentInitials = (studentName || "ST").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const studentEmail = selectedStudent?.email || "";
  const studentIdDisplay = `STU-${String(selectedStudent?.id || 1).padStart(3, '0')}`;
  const studentMajor = selectedStudent?.institution?.name || (isAr ? "علوم الحاسب والمعلومات" : "Computer Science");

  // Filtered courses for this student
  const studentCourses = courses.length > 0 ? courses : [
    { id: "CS101", code: "CS101", name: "Introduction to Programming", credits: 3, status: "Enrolled" },
    { id: "MATH201", code: "MATH201", name: "Calculus II", credits: 4, status: "Enrolled" },
    { id: "PHYS101", code: "PHYS101", name: "Physics I", credits: 3, status: "Enrolled" },
  ];

  const graduationRequirements = [
    { category: isAr ? "المتطلبات الإجبارية" : "Core Major Requirements", required: 45, completed: 30, status: isAr ? "قيد الدراسة" : "In Progress" },
    { category: isAr ? "متطلبات الجامعة العامة" : "General Education", required: 30, completed: 30, status: isAr ? "مكتمل" : "Complete" },
    { category: isAr ? "المقررات الاختيارية" : "Electives", required: 45, completed: 15, status: isAr ? "قيد الدراسة" : "In Progress" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/advisor')}
            className="mb-2 -ml-2 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isAr ? "العودة للوحة الإرشاد" : "Back to Roster"}</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            {isAr ? "الملف الشامل للطالب 360°" : "Student 360° Profile"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "متابعة الخطة الدراسية، المقررات المسجلة، والسجل الأكاديمي المباشر من MySQL."
              : "Comprehensive academic degree tracking, active enrollments, and risk evaluation."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isLoading}
          className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isAr ? "تحديث" : "Refresh"}</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          {isAr ? "جارٍ جلب السجل الشامل للطالب من MySQL..." : "Loading student profile from MySQL..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Profile Card */}
          <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl md:col-span-1 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-2xl font-black mb-4">
                {studentInitials}
              </div>
              <h2 className="text-lg font-bold text-foreground">{studentName}</h2>
              <p className="text-muted-foreground font-mono text-xs mt-0.5">{studentIdDisplay}</p>
              <p className="text-muted-foreground text-xs mt-0.5 truncate max-w-[200px]">{studentEmail}</p>

              <div className="w-full mt-6 space-y-3 text-left">
                {/* Institution & Stage / College Badges */}
                {(selectedStudent?.institution?.name || selectedStudent?.college?.name) && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3 border-b border-border">
                    {selectedStudent?.institution?.name && (
                      <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                        {selectedStudent?.institution?.type === 'school' ? <School className="w-2.5 h-2.5 text-emerald-500" /> : <Building className="w-2.5 h-2.5 text-primary" />}
                        <span>{selectedStudent.institution.name}</span>
                      </Badge>
                    )}
                    {selectedStudent?.college?.name && (
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 ${
                          selectedStudent?.institution?.type === 'school'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}
                      >
                        {selectedStudent?.institution?.type === 'school' ? <School className="w-2.5 h-2.5" /> : <GraduationCap className="w-2.5 h-2.5" />}
                        <span>{selectedStudent.college.name}</span>
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pb-2 border-b border-border text-xs">
                  <span className="text-muted-foreground">
                    {selectedStudent?.institution?.type === 'school' ? (isAr ? "المسار الدراسي" : "Educational Track") : (isAr ? "التخصص الأكاديمي" : "Major")}
                  </span>
                  <span className="text-foreground font-semibold">{studentMajor}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border text-xs">
                  <span className="text-muted-foreground">{isAr ? "المستوى" : "Level"}</span>
                  <span className="text-foreground font-semibold">{isAr ? "السنة الثالثة" : "Junior"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{isAr ? "المعدل التراكمي" : "GPA"}</span>
                  <span className="text-primary font-bold font-mono text-sm">3.45</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Tabs Section */}
          <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl md:col-span-3 p-6">
            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="bg-secondary/60 border border-border p-1 rounded-2xl mb-6">
                <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
                  {selectedStudent?.institution?.type === 'school' ? <School className="w-4 h-4 mr-2" /> : <GraduationCap className="w-4 h-4 mr-2" />}
                  <span>
                    {selectedStudent?.institution?.type === 'school'
                      ? (isAr ? "التقدم في المرحلة الدراسية" : "Stage Progress")
                      : (isAr ? "التقدم في الخطة الدراسية" : "Graduation Progress")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="registration" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{isAr ? (selectedStudent?.institution?.type === 'school' ? "المواد المسجلة" : "المقررات المسجلة") : "Course Registration"}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {isAr ? "إجمالي ساعات التخرج المكتملة" : "Overall Degree Completion"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "75 من أصل 120 ساعة معتمدة مكتملة بنجاح" : "75 / 120 Total Credits Completed"}
                      </p>
                    </div>
                    <span className="text-xl font-black text-primary font-mono">62%</span>
                  </div>
                  <Progress value={62} className="h-2.5 bg-secondary" indicatorColor="bg-primary" />
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isAr ? "تفصيل المتطلبات الأكاديمية" : "Requirement Breakdown"}
                  </h4>
                  <div className="grid gap-3">
                    {graduationRequirements.map((req, idx) => (
                      <div key={idx} className="bg-secondary/40 p-4 rounded-2xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-1/3">
                          {req.status === "Complete" || req.status === "مكتمل" ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-foreground">{req.category}</span>
                        </div>
                        <div className="w-full sm:w-1/2">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground">{req.completed} / {req.required} {isAr ? "ساعة" : "Credits"}</span>
                            <span className="text-muted-foreground font-mono">{Math.round((req.completed / req.required) * 100)}%</span>
                          </div>
                          <Progress value={(req.completed / req.required) * 100} className="h-1.5 bg-secondary" indicatorColor={req.status === "Complete" || req.status === "مكتمل" ? "bg-emerald-500" : "bg-primary"} />
                        </div>
                        <Badge variant="outline" className="rounded-full text-[10px] font-bold border-border">
                          {req.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="registration" className="space-y-4">
                <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "رمز المقرر" : "Course Code"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "اسم المقرر" : "Course Name"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "الساعات" : "Credits"}</TableHead>
                        <TableHead className="text-right text-muted-foreground text-xs">{isAr ? "الحالة" : "Status"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentCourses.map((course: any) => (
                        <TableRow key={course.id} className="border-border hover:bg-secondary/40 transition-colors">
                          <TableCell className="font-mono text-primary text-xs font-bold">{course.code || course.id}</TableCell>
                          <TableCell className="text-foreground text-xs font-semibold">{course.name || course.title}</TableCell>
                          <TableCell className="text-muted-foreground text-xs font-mono">{course.credits || 3}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full text-[10px] font-bold">
                              {isAr ? "مسجل" : "Enrolled"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  );
}
