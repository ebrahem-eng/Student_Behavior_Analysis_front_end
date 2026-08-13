import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function ContactSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "admin",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", institution: "", role: "admin", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-blue-500/30 text-blue-500 text-xs uppercase tracking-wider font-semibold">
            <Mail className="w-3.5 h-3.5 mr-1" />
            {isAr ? "تواصل معنا واطلب عرضاً تجريبياً" : "Get in Touch & Request a Demo"}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr ? "جاهزون للارتقاء بمؤسستك التعليمية؟" : "Empower Your Campus with SBA"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {isAr
              ? "تواصل مع فريق الخبراء للحصول على استشارة مجانية وعرض تفاعلي مخصص لاحتياجات مدرستك أو جامعتك."
              : "Schedule a live tailored demonstration for your academic deans, counselors, and IT leadership."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left / Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-xl space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {isAr ? "معلومات التواصل المباشر" : "Direct Educational Inquiries"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {isAr
                    ? "فريقنا متواجد لتقديم الدعم الفني، الاستشارات الأكاديمية، وربط النظام مع أنظمتكم الحالية."
                    : "Our enterprise advisors are ready to assist with deployment roadmaps, SIS integrations, and faculty onboarding."}
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isAr ? "المقر الرئيسي" : "Headquarters"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAr ? "طريق الملك فهد، واحة الابتكار التقني، الرياض" : "King Fahd Road, Tech Innovation Valley, Riyadh"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isAr ? "البريد الإلكتروني المؤسسي" : "Official Email"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      partnerships@sba-analytics.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isAr ? "الخط المباشر للشراكات" : "Direct Partnership Line"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      +966 (11) 800-722-338
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isAr ? "زمن الاستجابة للطلبات" : "Demo Request Response"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAr ? "خلال أقل من 4 ساعات عمل" : "Guaranteed within 4 business hours"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 border-t border-border flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {isAr ? "بياناتك مشفرة وفق أعلى معايير الأمان السحابي" : "256-bit SSL Encrypted & FERPA compliant"}
                </span>
              </div>
            </div>
          </div>

          {/* Right / Interactive Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-xl relative overflow-hidden">
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isAr ? "تم استلام طلبكم بنجاح!" : "Thank You! Request Received"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {isAr
                      ? "سيتواصل معكم مستشار الأنظمة الأكاديمية لتنسيق جلسة العرض التفاعلي والإجابة عن استفساراتكم."
                      : "Our academic solutions specialist will contact you promptly to arrange a live interactive demo."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {isAr ? "طلب عرض تجريبي مخصص" : "Request an Institutional Demonstration"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isAr ? "يرجى تعبئة النموذج وسنعاود الاتصال بكم سريعاً." : "Fill in the details below to experience the SBA ecosystem live."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        {isAr ? "الاسم الكامل *" : "Full Name *"}
                      </label>
                      <Input
                        required
                        placeholder={isAr ? "د. محمد القحطاني" : "Dr. Alex Mitchell"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background border-border rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        {isAr ? "البريد الإلكتروني الرسمي *" : "Official Email *"}
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder={isAr ? "m.alqahtani@university.edu" : "alex@university.edu"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background border-border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        {isAr ? "اسم المؤسسة التعليمية *" : "Institution Name *"}
                      </label>
                      <Input
                        placeholder={isAr ? "جامعة / مجمع مدارس..." : "University or School District"}
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="bg-background border-border rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        {isAr ? "صفتك في المؤسسة" : "Your Role"}
                      </label>
                      <Select
                        value={formData.role}
                        onValueChange={(val) => setFormData({ ...formData, role: val })}
                      >
                        <SelectTrigger className="bg-background border-border rounded-xl">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground">
                          <SelectItem value="admin">{isAr ? "عميد / مدير مدرسة (Admin)" : "Dean / Principal (Admin)"}</SelectItem>
                          <SelectItem value="advisor">{isAr ? "مرشد أكاديمي / طلابي (Advisor)" : "Academic Advisor / Counselor"}</SelectItem>
                          <SelectItem value="faculty">{isAr ? "عضو هيئة تدريس / معلم (Faculty)" : "Faculty / Teacher"}</SelectItem>
                          <SelectItem value="it">{isAr ? "مدير تقنية المعلومات (IT Director)" : "IT / LMS Director"}</SelectItem>
                          <SelectItem value="other">{isAr ? "أخرى" : "Other Educational Leader"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      {isAr ? "رسالتكم أو استفساركم الخاص" : "Message / Specific Requirements"}
                    </label>
                    <Textarea
                      rows={4}
                      placeholder={isAr ? "أخبرنا عن عدد الطلاب والميزات التي ترغبون في تجربتها..." : "Tell us about your student cohort size and key focus areas..."}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background border-border rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold py-6 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <span>{isAr ? "إرسال طلب العرض التجريبي" : "Submit Demo Request"}</span>
                    <Send className="w-4 h-4 rtl:-scale-x-100" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
