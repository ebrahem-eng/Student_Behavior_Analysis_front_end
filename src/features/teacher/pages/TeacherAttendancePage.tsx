import { useState } from "react";
import { UserCheck, Search, Save, Calendar as CalendarIcon, Clock, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const MOCK_ATTENDANCE = [
  { id: 1, name: "Charlie Brown", status: "Present", lateness: "On Time", participation: "High" },
  { id: 2, name: "David Miller", status: "Absent", lateness: "N/A", participation: "None" },
  { id: 3, name: "Eva Green", status: "Present", lateness: "10 mins late", participation: "Medium" },
  { id: 4, name: "Frank White", status: "Present", lateness: "On Time", participation: "Low" },
  { id: 5, name: "Grace Lee", status: "Excused", lateness: "N/A", participation: "N/A" },
];

export default function TeacherAttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("2024-05-21");

  const filteredStudents = MOCK_ATTENDANCE.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Attendance & Behavior
          </h1>
          <p className="text-slate-400 mt-1">
            Log daily attendance, lateness, and class participation levels.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-md px-3">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="border-0 bg-transparent text-white focus-visible:ring-0 w-[140px]" 
            />
          </div>
          <Select defaultValue="math101">
            <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10 text-white">
              <SelectItem value="math101">Mathematics 101</SelectItem>
              <SelectItem value="phys201">Physics 201</SelectItem>
              <SelectItem value="cs301">Computer Science 301</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Save className="mr-2 h-4 w-4" /> Save Roster
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-white/10 md:col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Daily Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-slate-300">Total Students</span>
              <span className="text-white font-bold text-xl">32</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400">Present</span>
              <span className="text-emerald-400 font-bold text-xl">28</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <span className="text-rose-400">Absent</span>
              <span className="text-rose-400 font-bold text-xl">3</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <span className="text-amber-400">Excused</span>
              <span className="text-amber-400 font-bold text-xl">1</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 md:col-span-3 lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center pb-4">
            <CardTitle className="text-lg text-slate-200">Class Roster</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="rounded-md border border-white/10 overflow-hidden bg-slate-900/30">
              <Table>
                <TableHeader className="bg-slate-900/50">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-300 font-semibold">Student Name</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">Status</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">
                      <div className="flex items-center justify-center gap-2"><Clock className="w-4 h-4"/> Lateness</div>
                    </TableHead>
                    <TableHead className="text-slate-300 font-semibold text-center">
                      <div className="flex items-center justify-center gap-2"><MessageSquareText className="w-4 h-4"/> Participation</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={4} className="text-center h-24 text-slate-400">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium text-white flex items-center gap-3 border-b-0">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {student.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Select defaultValue={student.status}>
                            <SelectTrigger className={`w-[120px] mx-auto h-8 border-white/20 text-white ${
                              student.status === 'Present' ? 'bg-emerald-500/20' : 
                              student.status === 'Absent' ? 'bg-rose-500/20' : 
                              'bg-amber-500/20'
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Present">Present</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="Excused">Excused</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <Input 
                            defaultValue={student.lateness} 
                            disabled={student.status !== "Present"}
                            className="w-32 h-8 mx-auto bg-slate-950 border-white/20 text-white text-center disabled:opacity-50" 
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Select defaultValue={student.participation} disabled={student.status === "Absent"}>
                            <SelectTrigger className="w-[110px] mx-auto h-8 bg-slate-950 border-white/20 text-white disabled:opacity-50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="N/A">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
