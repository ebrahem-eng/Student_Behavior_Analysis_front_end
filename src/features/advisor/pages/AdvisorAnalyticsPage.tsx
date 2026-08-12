import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from "recharts";
import { Sparkles, Network, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Data
const accuracyData = [
  { month: "Jan", predicted: 12, actual: 14, falsePositive: 2, accuracy: 85 },
  { month: "Feb", predicted: 18, actual: 17, falsePositive: 3, accuracy: 88 },
  { month: "Mar", predicted: 25, actual: 26, falsePositive: 1, accuracy: 92 },
  { month: "Apr", predicted: 20, actual: 19, falsePositive: 2, accuracy: 90 },
  { month: "May", predicted: 15, actual: 15, falsePositive: 0, accuracy: 95 },
];

const patternsData = [
  { pattern: "Skipped Lab -> Failed Midterm", frequency: 84 },
  { pattern: "Late HW -> Dropped Class", frequency: 62 },
  { pattern: "High library usage -> A Grade", frequency: 95 },
  { pattern: "Missed Mon classes -> B- Average", frequency: 45 },
];

export default function AdvisorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Network className="h-8 w-8 text-fuchsia-400" />
            Predictive Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Review discovered behavioral patterns and track the AI's predictive accuracy over time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-400" />
              <CardTitle className="text-xl text-foreground">Discovered Patterns</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Recurring correlations found by the AI engine across all cohorts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternsData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="pattern" stroke="#64748b" tick={{fill: '#cbd5e1', fontSize: 12}} axisLine={false} tickLine={false} width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                    cursor={{fill: '#ffffff05'}}
                  />
                  <Bar dataKey="frequency" fill="#d946ef" radius={[0, 4, 4, 0]} name="Confidence %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-xl text-foreground">Retrospective Accuracy Dashboard</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Comparing past AI predictions vs. actual student outcomes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-background/50 p-4 rounded-lg border border-white/5 w-full mr-4">
                <p className="text-sm text-muted-foreground">Average Model Accuracy</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-3xl font-bold text-emerald-400">90.0%</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 mb-1">+2% vs last semester</Badge>
                </div>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="predicted" name="Predicted At-Risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPredicted)" />
                  <Area type="monotone" dataKey="actual" name="Actual Interventions" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
