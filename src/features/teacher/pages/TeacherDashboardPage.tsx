import {
  Users,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "recharts";

// Mock Data
const performanceData = [
  { name: "Week 1", avgScore: 82, attendance: 95 },
  { name: "Week 2", avgScore: 84, attendance: 93 },
  { name: "Week 3", avgScore: 81, attendance: 90 },
  { name: "Week 4", avgScore: 86, attendance: 92 },
  { name: "Week 5", avgScore: 88, attendance: 96 },
];

const studentDistribution = [
  { grade: "A", count: 12 },
  { grade: "B", count: 8 },
  { grade: "C", count: 5 },
  { grade: "D", count: 2 },
  { grade: "F", count: 1 },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, description }: any) => (
  <Card className="bg-slate-900/50 border-white/10">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`flex items-center font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change}
        </span>
        <span className="text-slate-500 ml-2">{description}</span>
      </div>
    </CardContent>
  </Card>
);

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Classroom Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Aggregate class performance and attendance vs. school average.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10 text-white">
              <SelectItem value="all">All Courses (Aggregate)</SelectItem>
              <SelectItem value="math101">Mathematics 101</SelectItem>
              <SelectItem value="phys201">Physics 201</SelectItem>
              <SelectItem value="cs301">Computer Science 301</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-900 border-white/10 text-slate-200" align="end">
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                <FileText className="mr-2 h-4 w-4 text-rose-400" /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-400" /> Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="124"
          change="+2"
          isPositive={true}
          description="vs last semester"
          icon={Users}
        />
        <StatCard
          title="Class Avg. GPA"
          value="3.4"
          change="+0.2"
          isPositive={true}
          description="vs school avg 3.1"
          icon={GraduationCap}
        />
        <StatCard
          title="Avg. Attendance"
          value="93.2%"
          change="-1.5%"
          isPositive={false}
          description="vs school avg 95%"
          icon={BookOpen}
        />
        <StatCard
          title="At-Risk Alerts"
          value="5"
          change="+2"
          isPositive={false}
          description="needs intervention"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Class Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="avgScore" name="Avg Score" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="grade" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                    cursor={{fill: '#ffffff05'}}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
