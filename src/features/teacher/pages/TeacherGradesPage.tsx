import { useState } from "react";
import { BookOpen, FileText, CheckSquare, Search, Save, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const MOCK_STUDENTS = [
  { id: 1, name: "Charlie Brown", grade: 85, exam: 82, assignmentStatus: "Submitted" },
  { id: 2, name: "David Miller", grade: 92, exam: 95, assignmentStatus: "Late" },
  { id: 3, name: "Eva Green", grade: 78, exam: 70, assignmentStatus: "Missing" },
  { id: 4, name: "Frank White", grade: 88, exam: 89, assignmentStatus: "Submitted" },
  { id: 5, name: "Grace Lee", grade: 95, exam: 98, assignmentStatus: "Submitted" },
];

export default function TeacherGradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Data Entry & Grades
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage grades, exam results, and assignment submissions for your classes.
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="math101">
            <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="bg-muted border-border text-foreground">
              <SelectItem value="math101">Mathematics 101</SelectItem>
              <SelectItem value="phys201">Physics 201</SelectItem>
              <SelectItem value="cs301">Computer Science 301</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Save className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl p-4 sm:p-6 border border-border">
        <Tabs defaultValue="assignments" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-card/50 border border-white/5">
              <TabsTrigger value="assignments" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
                <CheckSquare className="w-4 h-4 mr-2" /> Assignments
              </TabsTrigger>
              <TabsTrigger value="exams" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
                <FileText className="w-4 h-4 mr-2" /> Exam Results
              </TabsTrigger>
              <TabsTrigger value="final" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
                <BookOpen className="w-4 h-4 mr-2" /> Final Grades
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9 bg-card/50 border-border text-foreground placeholder:text-slate-500 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden bg-card/30">
            <Table>
              <TableHeader className="bg-card/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Assignment Status</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Exam Score</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Current Grade</TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-border hover:bg-secondary/50 transition-colors">
                      <TableCell className="font-medium text-foreground flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {student.name}
                      </TableCell>
                      <TableCell>
                        {editingId === student.id ? (
                          <Select defaultValue={student.assignmentStatus}>
                            <SelectTrigger className="w-[130px] h-8 bg-background border-border text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-muted border-border text-foreground">
                              <SelectItem value="Submitted">Submitted</SelectItem>
                              <SelectItem value="Late">Late</SelectItem>
                              <SelectItem value="Missing">Missing</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={
                              student.assignmentStatus === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              student.assignmentStatus === 'Late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }
                          >
                            {student.assignmentStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === student.id ? (
                          <Input type="number" defaultValue={student.exam} className="w-20 h-8 bg-background border-border text-foreground" />
                        ) : (
                          <span className="text-muted-foreground font-mono">{student.exam}%</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === student.id ? (
                          <Input type="number" defaultValue={student.grade} className="w-20 h-8 bg-background border-border text-foreground" />
                        ) : (
                          <span className="text-muted-foreground font-mono font-bold">{student.grade}%</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === student.id ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground hover:bg-secondary h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(student.id)} className="text-muted-foreground hover:text-foreground hover:bg-secondary h-8 w-8 p-0">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
