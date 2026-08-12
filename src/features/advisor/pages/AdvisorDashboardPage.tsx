import { useState } from "react";
import { Search, AlertTriangle, Filter, ArrowUpDown, MoreHorizontal, User, ShieldAlert, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  { id: 1, name: "Eva Green", idNumber: "STU-003", major: "Computer Science", riskScore: 92, riskLevel: "Critical", gpa: 2.1, attendance: 65, flags: ["Attendance", "Grades"] },
  { id: 2, name: "David Miller", idNumber: "STU-002", major: "Physics", riskScore: 78, riskLevel: "High", gpa: 2.4, attendance: 75, flags: ["Grades"] },
  { id: 3, name: "Charlie Brown", idNumber: "STU-001", major: "Mathematics", riskScore: 65, riskLevel: "Medium", gpa: 2.8, attendance: 82, flags: ["Behavior"] },
  { id: 4, name: "Alice Smith", idNumber: "STU-004", major: "English", riskScore: 45, riskLevel: "Low", gpa: 3.2, attendance: 88, flags: ["Lateness"] },
];

export default function AdvisorDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  const filteredStudents = MOCK_AT_RISK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "All" || s.riskLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-rose-500" />
            At-Risk Students
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor students assigned to you and identify those needing immediate academic intervention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Monitored Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" /> 156
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Critical / High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" /> 14
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Avg. Monitored GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" /> 2.7
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div>
            <CardTitle className="text-lg text-slate-200">Risk Assessment Roster</CardTitle>
            <CardDescription className="text-slate-400">Sort and filter to prioritize interventions.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-9 bg-slate-950 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-md p-1">
              <Filter className="h-4 w-4 text-slate-400 ml-2" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[120px] h-8 border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border border-white/10 overflow-hidden bg-slate-900/30">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors">
                    <div className="flex items-center gap-1">Student <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold">Major / Program</TableHead>
                  <TableHead className="text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors">
                    <div className="flex items-center gap-1">Risk Score <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold">GPA / Attd.</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Flags</TableHead>
                  <TableHead className="text-right text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={6} className="text-center h-32 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-slate-500 opacity-50" />
                        No at-risk students found matching your criteria.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium text-white border-b-0">
                        <div>
                          {student.name}
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{student.idNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{student.major}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg">{student.riskScore}</span>
                          <Badge variant="outline" className={getRiskColor(student.riskLevel)}>
                            {student.riskLevel}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span className={`font-mono font-medium ${student.gpa < 2.5 ? 'text-rose-400' : 'text-slate-300'}`}>GPA: {student.gpa}</span>
                          <span className={`font-mono ${student.attendance < 80 ? 'text-rose-400' : 'text-slate-400'}`}>Attd: {student.attendance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.flags.map(flag => (
                            <Badge key={flag} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs py-0">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                              Log Intervention
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                              Message Parent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  );
}
