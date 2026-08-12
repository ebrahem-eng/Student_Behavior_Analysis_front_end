import { useState } from "react";
import { 
  Settings, AlertTriangle, Shield, Activity, Database, Key, 
  DownloadCloud, Lock, FileText, MonitorPlay, Save, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SystemSettingsPage() {
  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [criticalThreshold, setCriticalThreshold] = useState([90]);

  // Mock Audit Logs
  const MOCK_AUDIT_LOGS = [
    { id: 1, action: "User Role Updated", user: "Admin (alice@)", timestamp: "2024-05-20 14:32:01", ip: "192.168.1.42", status: "Success" },
    { id: 2, action: "API Key Generated", user: "System", timestamp: "2024-05-20 12:15:00", ip: "10.0.0.1", status: "Success" },
    { id: 3, action: "Failed Login Attempt", user: "Unknown (bob@)", timestamp: "2024-05-19 23:45:12", ip: "45.22.19.8", status: "Warning" },
    { id: 4, action: "Data Export", user: "Admin (alice@)", timestamp: "2024-05-18 09:00:21", ip: "192.168.1.42", status: "Success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Global configuration, security policies, and system monitoring.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-foreground shadow-lg shadow-primary/20">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="bg-card/50 border border-white/5 flex flex-wrap h-auto">
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <AlertTriangle className="w-4 h-4 mr-2" /> Risk & Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <Shield className="w-4 h-4 mr-2" /> Security & Policy
          </TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <Key className="w-4 h-4 mr-2" /> API & Integrations
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <Activity className="w-4 h-4 mr-2" /> System Health
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <FileText className="w-4 h-4 mr-2" /> Audit Logs
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* RISK & ALERTS TAB */}
          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Risk Thresholds</CardTitle>
                <CardDescription className="text-muted-foreground">Configure global parameters that trigger at-risk notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-base text-card-foreground">At-Risk Threshold ({riskThreshold}%)</Label>
                    <span className="text-sm text-muted-foreground">Medium severity</span>
                  </div>
                  <Slider 
                    value={riskThreshold} 
                    onValueChange={setRiskThreshold} 
                    max={100} 
                    step={1} 
                    className="[&_[role=slider]]:bg-amber-500"
                  />
                  <p className="text-sm text-muted-foreground">Students dropping below this attendance or grade percentage will be flagged as at-risk.</p>
                </div>
                <Separator className="bg-secondary" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-base text-card-foreground">Critical Alert Tier ({criticalThreshold}%)</Label>
                    <span className="text-sm text-muted-foreground">High severity</span>
                  </div>
                  <Slider 
                    value={criticalThreshold} 
                    onValueChange={setCriticalThreshold} 
                    max={100} 
                    step={1} 
                    className="[&_[role=slider]]:bg-rose-500"
                  />
                  <p className="text-sm text-muted-foreground">Absence percentage triggering immediate escalation to Admins and Parents.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY & POLICY TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Lock className="w-5 h-5"/> Data Policy</CardTitle>
                <CardDescription className="text-muted-foreground">Manage data retention, encryption, and privacy rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base text-card-foreground">Strict Anonymization Mode</Label>
                    <p className="text-sm text-muted-foreground">Obscure PII for users without strict clearance.</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator className="bg-secondary" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base text-card-foreground">Enforce End-to-End Encryption</Label>
                    <p className="text-sm text-muted-foreground">Requires client-side decryption keys.</p>
                  </div>
                  <Switch checked={false} />
                </div>
                <Separator className="bg-secondary" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base text-card-foreground">Automatic Data Purging</Label>
                    <p className="text-sm text-muted-foreground">Delete inactive accounts after 5 years.</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Database className="w-5 h-5"/> Disaster Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-foreground">
                    <DownloadCloud className="w-4 h-4 mr-2" /> Trigger Manual Backup
                  </Button>
                  <span className="text-sm text-muted-foreground">Last backup: 2 hours ago (Auto)</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API & INTEGRATIONS TAB */}
          <TabsContent value="integration" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">API Keys</CardTitle>
                <CardDescription className="text-muted-foreground">Manage keys for 3rd party integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-card-foreground font-medium">LMS Integration Token</p>
                    <p className="text-muted-foreground font-mono text-sm mt-1">sk_live_**********************89ab</p>
                  </div>
                  <Button variant="destructive" size="sm" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">Revoke</Button>
                </div>
                <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                  <Plus className="w-4 h-4 mr-2" /> Generate New Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SYSTEM HEALTH TAB */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><MonitorPlay className="w-5 h-5"/> Operational Monitoring</CardTitle>
                <CardDescription className="text-muted-foreground">Live Grafana Dashboard Embed Placeholder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-black/50 border border-border rounded-lg flex items-center justify-center flex-col gap-4">
                  <Activity className="w-12 h-12 text-primary animate-pulse" />
                  <p className="text-muted-foreground">Grafana Node Health & Scalability Metrics</p>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">All Systems Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUDIT LOGS TAB */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Security Audit Log</CardTitle>
                <CardDescription className="text-muted-foreground">Immutable record of critical administrative actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden bg-card/30">
                  <Table>
                    <TableHeader className="bg-card/50">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Timestamp</TableHead>
                        <TableHead className="text-muted-foreground">Action</TableHead>
                        <TableHead className="text-muted-foreground">User</TableHead>
                        <TableHead className="text-muted-foreground">IP Address</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_AUDIT_LOGS.map((log) => (
                        <TableRow key={log.id} className="border-border hover:bg-secondary/50 transition-colors">
                          <TableCell className="text-muted-foreground text-xs font-mono">{log.timestamp}</TableCell>
                          <TableCell className="text-foreground font-medium">{log.action}</TableCell>
                          <TableCell className="text-muted-foreground">{log.user}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{log.ip}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
