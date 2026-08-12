import { useState } from "react";
import { GraduationCap, BookOpen, CheckCircle, Clock, AlertCircle, Edit2, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

// Mock Data
const studentInfo = {
  name: "Eva Green",
  id: "STU-003",
  major: "Computer Science",
  year: "Junior",
  gpa: 2.1,
  creditsCompleted: 75,
  creditsRequired: 120,
};

const graduationRequirements = [
  { category: "Core Major", required: 45, completed: 30, status: "In Progress" },
  { category: "General Education", required: 30, completed: 30, status: "Complete" },
  { category: "Electives", required: 45, completed: 15, status: "In Progress" },
];

const currentRegistration = [
  { id: "CS301", name: "Data Structures", credits: 4, section: "A2", status: "Enrolled" },
  { id: "MATH201", name: "Calculus II", credits: 4, section: "B1", status: "Waitlisted" },
  { id: "PHYS101", name: "Physics I", credits: 3, section: "C4", status: "Enrolled" },
];

export default function AdvisorStudentViewPage() {
  const [searchQuery, setSearchQuery] = useState("Eva Green");
  
  const progressPercent = Math.round((studentInfo.creditsCompleted / studentInfo.creditsRequired) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-8 w-8 text-emerald-400" />
            Student 360 View
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage graduation progress and course registration for individual students.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student..."
            className="pl-9 bg-card border-border text-foreground placeholder:text-slate-500 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl font-bold mb-4">
              EG
            </div>
            <h2 className="text-xl font-bold text-foreground">{studentInfo.name}</h2>
            <p className="text-muted-foreground font-mono text-sm">{studentInfo.id}</p>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground text-sm">Major</span>
                <span className="text-foreground text-sm font-medium">{studentInfo.major}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground text-sm">Year</span>
                <span className="text-foreground text-sm font-medium">{studentInfo.year}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Current GPA</span>
                <span className="text-rose-400 text-sm font-bold font-mono">{studentInfo.gpa}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border md:col-span-3">
          <Tabs defaultValue="progress" className="w-full h-full flex flex-col">
            <CardHeader className="border-b border-border pb-0 pt-4 px-6 flex flex-row justify-between items-end">
              <TabsList className="bg-transparent border-b-0 h-auto p-0 mb-0">
                <TabsTrigger 
                  value="progress" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2 pb-3"
                >
                  <GraduationCap className="w-4 h-4 mr-2" /> Graduation Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="registration" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-2 pb-3"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Registration Review
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <TabsContent value="progress" className="m-0 space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Overall Degree Progress</h3>
                      <p className="text-sm text-muted-foreground">{studentInfo.creditsCompleted} / {studentInfo.creditsRequired} Credits Completed</p>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-muted" indicatorColor="bg-emerald-500" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Requirement Breakdown</h4>
                  <div className="grid gap-3">
                    {graduationRequirements.map((req, idx) => (
                      <div key={idx} className="bg-background/50 p-4 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-1/3">
                          {req.status === "Complete" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-500" />
                          )}
                          <span className="font-medium text-foreground">{req.category}</span>
                        </div>
                        <div className="w-full sm:w-1/2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{req.completed} / {req.required} Credits</span>
                            <span className="text-muted-foreground">{Math.round((req.completed / req.required) * 100)}%</span>
                          </div>
                          <Progress value={(req.completed / req.required) * 100} className="h-1.5 bg-muted" indicatorColor={req.status === "Complete" ? "bg-emerald-500" : "bg-amber-500"} />
                        </div>
                        <Badge variant="outline" className={req.status === "Complete" ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}>
                          {req.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="registration" className="m-0 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Current Semester Registration</h3>
                    <p className="text-sm text-muted-foreground">Total Registered Credits: 11</p>
                  </div>
                  <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                    <Edit2 className="w-4 h-4 mr-2" /> Adjust Registration
                  </Button>
                </div>

                <div className="rounded-md border border-border overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader className="bg-card/50">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-semibold">Course Code</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Course Name</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Credits</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Section</TableHead>
                        <TableHead className="text-right text-muted-foreground font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRegistration.map((course) => (
                        <TableRow key={course.id} className="border-border hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-mono text-indigo-400">{course.id}</TableCell>
                          <TableCell className="text-foreground font-medium">{course.name}</TableCell>
                          <TableCell className="text-muted-foreground">{course.credits}</TableCell>
                          <TableCell className="text-muted-foreground">{course.section}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={course.status === "Enrolled" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
                              {course.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-amber-400">Waitlist Alert</h4>
                    <p className="text-sm text-amber-200/80">Student needs MATH201 to stay on track for graduation. Consider overriding the section capacity or enrolling them in section B2.</p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
