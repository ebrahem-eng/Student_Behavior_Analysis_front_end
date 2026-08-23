import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, ShieldCheck, HeartPulse, Check, AlertCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function StudentSettingsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [dataConsent, setDataConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);
  const [parentConsent, setParentConsent] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePreferences = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            {isAr ? "إعدادات الخصوصية والتقييم الدوري" : "Settings & Privacy Preferences"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "التحكم في خصوصية معالجة البيانات الأكاديمية وإجراء الاستبيان الأسبوعي."
              : "Manage your academic telemetry consent and submit your weekly check-in."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Well-being Check-in */}
        <div className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-rose-500" />
                <span>{isAr ? "التقييم الدوري للراحة الأكاديمية" : "Weekly Well-being Check-in"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {isAr
                  ? "شاركنا انطباعك عن الضغط الدراسي لمساعدتنا في تقديم التوجيه الأنسب لك."
                  : "Help us gauge academic stress levels to provide tailored support."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              {surveySubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">{isAr ? "تم إرسال التقييم بنجاح!" : "Thank you!"}</h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {isAr ? "تم تسجيل ملاحظاتك لمساعدة مرشدك الأكاديمي في توفير الدعم الملائم." : "Your feedback helps advisors tailor your guidance roadmap."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="text-xs font-bold text-foreground mb-2 block">
                      {isAr ? "كيف تقيم مستوى الضغط الدراسي هذا الأسبوع؟" : "How would you rate your stress levels this week?"}
                    </Label>
                    <RadioGroup defaultValue="moderate" className="grid grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/40 p-3 rounded-2xl border border-border">
                        <RadioGroupItem value="low" id="r1" className="text-emerald-500" />
                        <Label htmlFor="r1" className="cursor-pointer text-xs font-semibold">{isAr ? "منخفض" : "Low"}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/40 p-3 rounded-2xl border border-border">
                        <RadioGroupItem value="moderate" id="r2" className="text-amber-500" />
                        <Label htmlFor="r2" className="cursor-pointer text-xs font-semibold">{isAr ? "متوسط" : "Moderate"}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/40 p-3 rounded-2xl border border-border">
                        <RadioGroupItem value="high" id="r3" className="text-rose-500" />
                        <Label htmlFor="r3" className="cursor-pointer text-xs font-semibold">{isAr ? "مرتفع" : "High"}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-foreground">
                      {isAr ? "هل تواجه أي صعوبات أكاديمية ترغب في مشاركتها؟" : "Any academic challenges you'd like to note?"}
                    </Label>
                    <Textarea
                      placeholder={isAr ? "ملاحظات إضافية للمرشد الأكاديمي..." : "Optional notes for your academic advisor..."}
                      className="bg-secondary/40 border-border resize-none h-24 text-xs rounded-2xl"
                    />
                  </div>

                  <Button
                    onClick={() => setSurveySubmitted(true)}
                    className="w-full rounded-full bg-primary text-primary-foreground text-xs font-bold h-9 shadow-sm"
                  >
                    {isAr ? "إرسال التقييم الأسبوعي" : "Submit Check-in"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data & Privacy Consent */}
        <div className="space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>{isAr ? "خصوصية ومعالجة البيانات" : "Data & Privacy Consent"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {isAr ? "إدارة موافقتك على معالجة البيانات التحليلية والذكاء الاصطناعي." : "Control academic telemetry and AI analysis settings."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-5 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="data-consent" className="text-xs font-bold text-foreground">
                    {isAr ? "معالجة السجلات الأكاديمية" : "Academic Telemetry"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "تحليل الدرجات والغياب لحساب مؤشرات الإنذار المبكر." : "Analyze grades and absences for early-warning score calculation."}
                  </p>
                </div>
                <Switch id="data-consent" checked={dataConsent} onCheckedChange={setDataConsent} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-consent" className="text-xs font-bold text-foreground">
                    {isAr ? "التنبؤ بنماذج الذكاء الاصطناعي" : "AI Predictive Insights"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "توليد توقعات التحصيل الأكاديمي وتوصيات الاستذكار." : "Generate final performance projections and study suggestions."}
                  </p>
                </div>
                <Switch id="ai-consent" checked={aiConsent} onCheckedChange={setAiConsent} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="parent-consent" className="text-xs font-bold text-foreground">
                    {isAr ? "مشاركة التقارير مع ولي الأمر" : "Guardian Portal Access"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "السماح لولي الأمر بالاطلاع على الإشعارات وخطط التوجيه." : "Allow linked parent accounts to view risk alerts and progress."}
                  </p>
                </div>
                <Switch id="parent-consent" checked={parentConsent} onCheckedChange={setParentConsent} />
              </div>

              {(!dataConsent || !aiConsent) && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-2.5 items-start">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rose-500 leading-relaxed">
                    {isAr ? "تعطيل المعالجة يحد من قدرة المنظومة على إرسال التنبيهات المبكرة." : "Disabling AI analytics will disable proactive warning alerts."}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-0 pt-6">
              <Button
                variant="outline"
                onClick={handleSavePreferences}
                className="w-full rounded-full border-border text-xs font-semibold h-9"
              >
                {isSaved ? (
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> {isAr ? "تم حفظ التفضيلات!" : "Preferences Saved!"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> {isAr ? "حفظ التفضيلات" : "Save Preferences"}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
