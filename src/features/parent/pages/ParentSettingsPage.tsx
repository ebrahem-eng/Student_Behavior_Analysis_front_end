import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Settings, ShieldCheck, BellRing, UserCheck, CreditCard, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

export default function ParentSettingsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  const [dataConsent, setDataConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    api.get('/admin/users?role=student')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const students = data.filter((u: any) => {
          const r = (u.role || '').toLowerCase();
          const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
          return r === 'student' || roles.includes('student');
        });
        const list = students.length > 0 ? students : data;
        setChildren(list);
        if (list.length > 0) setSelectedChildId(String(list[0].id));
      })
      .catch((e) => console.warn("Parent settings students load error:", e));
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const activeChild = children.find((c) => String(c.id) === String(selectedChildId)) || children[0];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            {isAr ? "إعدادات حساب ولي الأمر والخصوصية" : "Family Settings & Consent"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إدارة قنوات الإشعارات وموافقات معالجة البيانات الأكاديمية للأبناء."
              : "Manage notification channels and academic data processing consents for your children."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-card/80 border border-border p-1 rounded-2xl mb-6">
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <BellRing className="w-4 h-4 mr-2" />
            <span>{isAr ? "تفضيلات الإشعارات" : "Notifications"}</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span>{isAr ? "الموافقات الأكاديمية" : "Consent Management"}</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>{isAr ? "الرسوم والخدمات" : "Tuition & Fees"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-5">
              <CardTitle className="text-base font-bold text-foreground">
                {isAr ? "قنوات استلام التنبيهات" : "Alert Preferences & Channels"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isAr ? "اختر كيفية وتوقيت وصول الإشعارات الأكاديمية الخاصة بالأبناء." : "Choose how and when you receive updates about your children."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-5 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="push" className="text-xs font-bold text-foreground">
                    {isAr ? "إشعارات التطبيق الفورية (Push)" : "Mobile Push Notifications"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "استلام تنبيهات لحظية عبر التطبيق." : "Instant alerts via the browser / PWA."}
                  </p>
                </div>
                <Switch id="push" checked={pushEnabled} onCheckedChange={setPushEnabled} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs font-bold text-foreground">
                    {isAr ? "البريد الإلكتروني" : "Email Reports"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "استلام التقارير الشهرية والإنذارات عبر البريد." : "Receive periodic reports and summary alerts via email."}
                  </p>
                </div>
                <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sms" className="text-xs font-bold text-foreground">
                    {isAr ? "رسائل SMS القصيرة" : "SMS Text Alerts"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "استلام التنبيهات الطارئة عبر الرسائل النصية." : "Receive critical alerts via SMS message."}
                  </p>
                </div>
                <Switch id="sms" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>
            </CardContent>
            <CardFooter className="p-0 pt-6">
              <Button onClick={handleSave} className="rounded-full bg-primary text-primary-foreground text-xs font-bold h-9 px-5">
                {isSaved ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <Check className="w-4 h-4" /> {isAr ? "تم الحفظ!" : "Saved!"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> {isAr ? "حفظ الإعدادات" : "Save Settings"}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 2: Consent */}
        <TabsContent value="consent" className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {isAr ? "إدارة موافقات البيانات الأكاديمية" : "Data Consent Management"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isAr ? "التحكم في معالجة البيانات التحليلية نيابة عن الطالب." : "Manage permissions on behalf of your enrolled child."}
                  </CardDescription>
                </div>

                {children.length > 0 && (
                  <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                    <SelectTrigger className="w-[180px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                      <SelectValue placeholder="Select child" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                      {children.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)} className="text-xs font-semibold">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-5 pt-2">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-foreground font-medium">
                  {isAr
                    ? `بصفتك ولي الأمر المسجل، تسري هذه الخيارات مباشرة على حساب الطالب: ${activeChild?.name || ""}`
                    : `As the registered guardian, settings apply directly to student: ${activeChild?.name || ""}`}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="c-data" className="text-xs font-bold text-foreground">
                    {isAr ? "معالجة السجلات الأكاديمية" : "Academic Records Processing"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "السماح بتحليل الدرجات والغياب لحساب مؤشرات الإنذار المبكر." : "Allow calculation of risk scores from grades and attendance."}
                  </p>
                </div>
                <Switch id="c-data" checked={dataConsent} onCheckedChange={setDataConsent} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="c-ai" className="text-xs font-bold text-foreground">
                    {isAr ? "نماذج الذكاء الاصطناعي التنبؤية" : "Predictive AI Insights"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "تمكين الذكاء الاصطناعي من تقديم توصيات استذكار موجهة." : "Allow AI models to generate early-warning recommendations."}
                  </p>
                </div>
                <Switch id="c-ai" checked={aiConsent} onCheckedChange={setAiConsent} />
              </div>
            </CardContent>

            <CardFooter className="p-0 pt-6">
              <Button onClick={handleSave} className="rounded-full bg-primary text-primary-foreground text-xs font-bold h-9 px-5">
                {isSaved ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <Check className="w-4 h-4" /> {isAr ? "تم الحفظ!" : "Saved!"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> {isAr ? "حفظ خيارات الموافقة" : "Save Consent"}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 3: Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground">
                {isAr ? "الرسوم والالتزامات المالية" : "Tuition & Fee Status"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-secondary/30">
                <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <h3 className="text-xs font-bold text-foreground">{isAr ? "لا توجد مستحقات مالية متأخرة" : "No balances due"}</h3>
                <p className="text-[11px] text-muted-foreground mt-1">{isAr ? "جميع الرسوم مسددة ومحدثة بنجاح." : "All tuition and institutional fee accounts are in good standing."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
