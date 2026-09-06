import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Search, CheckCircle2, CalendarDays, GraduationCap, RefreshCw, Loader2, PlusCircle, Trash2, Building, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function StudentRegistrationPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, enrollRes] = await Promise.allSettled([
        api.get('/academic/courses'),
        api.get('/academic/enrollments'),
      ]);

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
      }

      if (enrollRes.status === 'fulfilled') {
        const data = Array.isArray(enrollRes.value.data) ? enrollRes.value.data : (enrollRes.value.data?.data || []);
        setEnrollments(data);
      }
    } catch (e) {
      console.warn("Student registration load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (courseId: number | string) => {
    setActionLoadingId(courseId);
    try {
      await api.post('/academic/enrollments', { course_id: courseId });
      loadData();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDrop = async (enrollmentId: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف المقرر من جدولك؟" : "Are you sure you want to drop this course?")) return;
    setActionLoadingId(enrollmentId);
    try {
      await api.delete(`/academic/enrollments/${enrollmentId}`);
      loadData();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const name = c.name || c.title || "";
    const code = c.code || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || code.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id || e.course?.id));

  const totalCreditsCompleted = 75;
  const totalCreditsRequired = 120;
  const overallProgress = Math.round((totalCreditsCompleted / totalCreditsRequired) * 100);

  const gradRequirements = [
    { category: isAr ? "المتطلبات الإجبارية" : "Core Major Requirements", required: 45, completed: 30 },
    { category: isAr ? "متطلبات الجامعة العامة" : "General Education", required: 30, completed: 30 },
    { category: isAr ? "المقررات الاختيارية" : "Electives", required: 45, completed: 15 },
  ];

  const currentUser = useAppStore((state) => state.user);
  const isSchool = currentUser?.institution?.type === 'school';

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              {isAr ? (isSchool ? "تسجيل المواد والجدول الدراسي" : "تسجيل المقررات والخطة الدراسية") : (isSchool ? "Course Registration & Timetable" : "Course Registration & Degree Progress")}
            </h1>
            {(currentUser?.institution?.name || currentUser?.institution_name) && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                {isSchool ? <School className="w-3 h-3 text-emerald-500" /> : <Building className="w-3 h-3 text-primary" />}
                <span>{currentUser?.institution?.name || currentUser?.institution_name}</span>
              </Badge>
            )}
            {currentUser?.college?.name && (
              <Badge
                variant="outline"
                className={`rounded-full text-xs px-3 py-1 font-bold flex items-center gap-1.5 ${
                  isSchool
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {isSchool ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                <span>{currentUser.college.name}</span>
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? (isSchool ? "إدارة جدولك الأسبوعي ومتابعة إنجاز متطلبات المرحلة الدراسية عبر MySQL." : "إدارة جدولك الفصلي ومتابعة التقدم نحو متطلبات التخرج عبر MySQL.")
              : "Manage your class schedule and track your educational milestones."}
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

      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="bg-card/80 border border-border p-1 rounded-2xl mb-6">
          <TabsTrigger value="registration" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <CalendarDays className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{isAr ? (isSchool ? "تسجيل المواد والجدول" : "تسجيل المقررات") : "Course Registration"}</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            {isSchool ? <School className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> : <GraduationCap className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />}
            <span>{isAr ? (isSchool ? "مخطط المرحلة الدراسية" : "مخطط التخرج") : (isSchool ? "Stage Progress" : "Degree Progress")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Courses Table */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-bold text-foreground">
                    {isAr ? "المقررات المتاحة للتسجيل" : "Available Courses for Registration"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isAr ? "ابحث وسجل في المقررات المفتوحة في قاعدة البيانات." : "Search and register for active term classes in MySQL."}
                  </CardDescription>
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isAr ? "بحث برمز المقرر أو الاسم..." : "Search by course code or name..."}
                      className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
                    <Table>
                      <TableHeader className="bg-secondary/40">
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground text-xs">{isAr ? "المقرر" : "Course"}</TableHead>
                          <TableHead className="text-muted-foreground text-xs">{isAr ? "الساعات" : "Credits"}</TableHead>
                          <TableHead className="text-right text-muted-foreground text-xs">{isAr ? "الإجراء" : "Action"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-xs text-muted-foreground">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                              {isAr ? "جارٍ جلب المقررات من MySQL..." : "Loading courses from MySQL..."}
                            </TableCell>
                          </TableRow>
                        ) : filteredCourses.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-xs text-muted-foreground">
                              {isAr ? "لا توجد مقررات متوفرة مطابقة للبحث." : "No courses matching your search."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCourses.map((course) => {
                            const isEnrolled = enrolledCourseIds.has(course.id);
                            return (
                              <TableRow key={course.id} className="border-border hover:bg-secondary/40 transition-colors">
                                <TableCell>
                                  <p className="font-bold text-foreground text-xs">{course.name || course.title}</p>
                                  <p className="text-[11px] text-primary font-mono">{course.code || `CRS-${course.id}`}</p>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-mono">{course.credits || 3}</TableCell>
                                <TableCell className="text-right">
                                  {isEnrolled ? (
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold rounded-full">
                                      <CheckCircle2 className="w-3 h-3 mr-1" /> {isAr ? "مسجل مسبقاً" : "Enrolled"}
                                    </Badge>
                                  ) : (
                                    <Button
                                      size="sm"
                                      disabled={actionLoadingId === course.id}
                                      onClick={() => handleRegister(course.id)}
                                      className="rounded-full bg-primary text-primary-foreground text-xs font-bold h-7 px-3"
                                    >
                                      {actionLoadingId === course.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <>
                                          <PlusCircle className="w-3.5 h-3.5 mr-1" />
                                          <span>{isAr ? "تسجيل" : "Register"}</span>
                                        </>
                                      )}
                                    </Button>
                                  )}
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

            {/* Active Registered Schedule */}
            <div className="space-y-6">
              <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-bold text-foreground">
                    {isAr ? "جدولك الفصلي الحالي" : "Your Registered Schedule"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {isAr ? "المقررات المعتمدة في سجلك لهذا الفصل." : "Active courses in your current semester plan."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {enrollments.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-secondary/30 text-center text-xs text-muted-foreground border border-border">
                      {isAr ? "لم تقم بتسجيل أي مقررات بعد." : "No enrolled courses yet."}
                    </div>
                  ) : (
                    enrollments.map((enr) => {
                      const courseName = enr.course?.name || enr.course?.title || `Course #${enr.course_id || enr.id}`;
                      const courseCode = enr.course?.code || "CRS";
                      return (
                        <div key={enr.id} className="p-3.5 bg-secondary/40 border border-border/70 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-foreground text-xs">{courseName}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">{courseCode} • {enr.course?.credits || 3} {isAr ? "ساعات" : "Credits"}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDrop(enr.id)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-base font-bold text-foreground">
                {isAr ? "مخطط الساعات ومتطلبات التخرج" : "Degree Milestone Tracker"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {isAr ? "متابعة الساعات المكتملة والمتبقية للحصول على الدرجة العلمية." : "Track your pathway to academic graduation."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="p-6 bg-secondary/40 rounded-2xl border border-border">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{isAr ? "إجمالي الساعات المكتملة" : "Overall Credits Completed"}</h3>
                    <p className="text-xs text-muted-foreground">{totalCreditsCompleted} / {totalCreditsRequired} {isAr ? "ساعة معتمدة" : "Credits Completed"}</p>
                  </div>
                  <span className="text-2xl font-black text-primary font-mono">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2.5 bg-secondary" indicatorColor="bg-primary" />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isAr ? "تفصيل الفئات الأكاديمية" : "Requirement Categories"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gradRequirements.map((req, idx) => {
                    const percent = Math.round((req.completed / req.required) * 100);
                    return (
                      <div key={idx} className="p-4 bg-secondary/30 rounded-2xl border border-border/70 space-y-2">
                        <h5 className="font-bold text-foreground text-xs">{req.category}</h5>
                        <p className="text-[11px] text-muted-foreground">{req.completed} / {req.required} {isAr ? "ساعة" : "Credits"}</p>
                        <Progress value={percent} className="h-1.5 bg-secondary" indicatorColor="bg-primary" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
