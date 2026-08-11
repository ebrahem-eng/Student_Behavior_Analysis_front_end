import {
  Users,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AreaChart,
  Area,
} from "recharts";

// Mock Data
const attendanceData = [
  { name: "Jan", present: 95, absent: 5 },
  { name: "Feb", present: 92, absent: 8 },
  { name: "Mar", present: 88, absent: 12 },
  { name: "Apr", present: 90, absent: 10 },
  { name: "May", present: 94, absent: 6 },
  { name: "Jun", present: 96, absent: 4 },
];

const riskData = [
  { subject: "Math", atRisk: 120 },
  { subject: "Physics", atRisk: 85 },
  { subject: "Chemistry", atRisk: 65 },
  { subject: "English", atRisk: 30 },
  { subject: "History", atRisk: 15 },
];

const performanceData = [
  { term: "Term 1", score: 75 },
  { term: "Term 2", score: 78 },
  { term: "Term 3", score: 82 },
  { term: "Term 4", score: 85 },
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

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            System Overview
          </h1>
          <p className="text-slate-400 mt-1">
            Global metrics and analytics across all institutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="45,231"
          change="+12.5%"
          isPositive={true}
          description="vs last year"
          icon={Users}
        />
        <StatCard
          title="Avg. Attendance"
          value="92.4%"
          change="-2.1%"
          isPositive={false}
          description="vs last month"
          icon={GraduationCap}
        />
        <StatCard
          title="At-Risk Students"
          value="1,204"
          change="-5.4%"
          isPositive={true}
          description="vs last term"
          icon={AlertTriangle}
        />
        <StatCard
          title="Active Courses"
          value="842"
          change="+4.2%"
          isPositive={true}
          description="new additions"
          icon={BookOpen}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">System-wide Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">At-Risk Students by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="subject" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                    cursor={{fill: '#ffffff05'}}
                  />
                  <Bar dataKey="atRisk" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Global Performance Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="term" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
