import { useState } from "react";
import { BookOpen, Search, CheckCircle2, AlertCircle, CalendarDays, GraduationCap } from "lucide-react";
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

const availableCourses = [
  { id: "CS401", name: "Operating Systems", credits: 4, seats: 5, total: 30, preReqsMet: true },
  { id: "CS402", name: "Computer Networks", credits: 4, seats: 0, total: 25, preReqsMet: true },
  { id: "MATH301", name: "Linear Algebra", credits: 3, seats: 12, total: 40, preReqsMet: true },
  { id: "PHYS202", name: "Physics II", credits: 3, seats: 8, total: 35, preReqsMet: false },
];

const registeredCourses = [
  { id: "CS301", name: "Data Structures", credits: 4, status: "Registered" },
  { id: "MATH201", name: "Calculus II", credits: 4, status: "Waitlisted (Pos: 2)" },
];

const gradRequirements = [
  { category: "Core Major", required: 45, completed: 30 },
  { category: "General Education", required: 30, completed: 24 },
  { category: "Electives", required: 45, completed: 15 },
];

export default function StudentRegistrationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalCreditsCompleted = 69;
  const totalCreditsRequired = 120;
  const overallProgress = Math.round((totalCreditsCompleted / totalCreditsRequired) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-400" />
            Registration & Progress
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your course schedule and track graduation requirements.
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1.5 px-3">
          Spring 2024 Registration Open
        </Badge>
      </div>

      <Tabs defaultValue="registration" className="w-full space-y-6">
        <TabsList className="bg-slate-900/50 border border-white/10 p-1">
          <TabsTrigger value="registration" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <CalendarDays className="w-4 h-4 mr-2" /> Course Registration
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <GraduationCap className="w-4 h-4 mr-2" /> Degree Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration" className="space-y-6 m-0 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Available Courses</CardTitle>
                  <CardDescription className="text-slate-400">Search and register for upcoming term classes.</CardDescription>
                  <div className="mt-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by course code or name..."
                      className="pl-9 bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-950/50">
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-slate-300 font-semibold">Course</TableHead>
                          <TableHead className="text-slate-300 font-semibold">Credits</TableHead>
                          <TableHead className="text-slate-300 font-semibold">Seats</TableHead>
                          <TableHead className="text-right text-slate-300 font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableCourses.map((course) => (
                          <TableRow key={course.id} className="border-white/10 hover:bg-white/5 transition-colors">
                            <TableCell>
                              <p className="font-medium text-white">{course.id}</p>
                              <p className="text-sm text-slate-400">{course.name}</p>
                            </TableCell>
                            <TableCell className="text-slate-300">{course.credits}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${course.seats > 0 ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
                                {course.seats}/{course.total}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {!course.preReqsMet ? (
                                <Button variant="outline" disabled className="border-white/5 text-slate-500 bg-transparent">
                                  Prereq Missing
                                </Button>
                              ) : course.seats === 0 ? (
                                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                                  Join Waitlist
                                </Button>
                              ) : (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                  Register
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Your Schedule</CardTitle>
                  <CardDescription className="text-slate-400">Spring 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registeredCourses.map(course => (
                    <div key={course.id} className="p-4 bg-slate-950 rounded-lg border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-white">{course.id}</p>
                          <p className="text-sm text-slate-400">{course.name}</p>
                        </div>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300">{course.credits} cr</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {course.status.includes('Waitlisted') ? (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className={`text-sm ${course.status.includes('Waitlisted') ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-slate-300">
                    <span>Total Credits:</span>
                    <span className="font-bold text-white">8</span>
                  </div>
                  
                  <Button variant="outline" className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500/10 mt-4">
                    Drop Classes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Degree Progress Tracker</CardTitle>
              <CardDescription className="text-slate-400">Track your path to graduation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8 p-6 bg-slate-950 rounded-xl border border-white/5 text-center">
                <div className="flex justify-between items-end mb-4">
                  <div className="text-left">
                    <h3 className="text-lg font-medium text-slate-200">Overall Completion</h3>
                    <p className="text-sm text-slate-400">{totalCreditsCompleted} of {totalCreditsRequired} Credits Completed</p>
                  </div>
                  <span className="text-4xl font-bold text-blue-400">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-4 bg-slate-800" indicatorColor="bg-blue-500" />
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Requirement Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {gradRequirements.map(req => {
                    const percent = Math.round((req.completed / req.required) * 100);
                    const isComplete = percent >= 100;
                    return (
                      <div key={req.category} className="p-5 bg-slate-950 rounded-xl border border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'} opacity-50`} />
                        <h5 className="font-medium text-white mb-1 ml-2">{req.category}</h5>
                        <p className="text-sm text-slate-400 mb-4 ml-2">{req.completed} / {req.required} Credits</p>
                        
                        <div className="flex items-center gap-3 ml-2">
                          <Progress value={percent} className="flex-1 h-2 bg-slate-800" indicatorColor={isComplete ? "bg-emerald-500" : "bg-blue-500"} />
                          <span className={`text-sm font-bold ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {percent}%
                          </span>
                        </div>
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
