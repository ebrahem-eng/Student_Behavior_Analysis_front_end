import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Building,
  Plus,
  Search,
  MapPin,
  Trash2,
  Loader2,
  RefreshCw,
  GraduationCap,
  School,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";

interface SubUnitItem {
  id: number | string;
  institution_id: number | string;
  name: string;
  code?: string;
  dean_name?: string;
  supervisor_name?: string;
  description?: string;
  users_count?: number;
}

export default function InstitutionsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state for new institution
  const [name, setName] = useState("");
  const [type, setType] = useState<"school" | "university">("university");
  const [address, setAddress] = useState("");

  // Sub-Units Management Dialog State (Colleges for Universities, Stages for Schools)
  const [activeInstitution, setActiveInstitution] = useState<any>(null);
  const [subUnitsList, setSubUnitsList] = useState<SubUnitItem[]>([]);
  const [isLoadingSubUnits, setIsLoadingSubUnits] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitCode, setNewUnitCode] = useState("");
  const [newUnitHead, setNewUnitHead] = useState("");
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [unitError, setUnitError] = useState<string | null>(null);

  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/institutions');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setInstitutions(data);
    } catch (e) {
      console.warn('[Institutions] Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/admin/institutions', {
        name,
        type,
        address,
      });
      setIsDialogOpen(false);
      setName("");
      setAddress("");
      loadInstitutions();
    } catch (err: any) {
      setFormError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذه المؤسسة التعليمية؟" : "Are you sure you want to delete this institution?")) return;
    try {
      await api.delete(`/admin/institutions/${id}`);
      loadInstitutions();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  // Open Sub-Units (Colleges or Stages) Modal
  const handleOpenSubUnitsModal = async (inst: any) => {
    setActiveInstitution(inst);
    setIsLoadingSubUnits(true);
    setUnitError(null);
    setNewUnitName("");
    setNewUnitCode("");
    setNewUnitHead("");
    try {
      const res = await api.get('/admin/colleges', { params: { institution_id: inst.id } });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSubUnitsList(data);
    } catch (e) {
      console.warn('[SubUnits] Fetch error:', e);
    } finally {
      setIsLoadingSubUnits(false);
    }
  };

  // Add College or Educational Stage
  const handleAddSubUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstitution || !newUnitName.trim()) return;
    setIsAddingUnit(true);
    setUnitError(null);

    try {
      await api.post('/admin/colleges', {
        institution_id: activeInstitution.id,
        name: newUnitName.trim(),
        code: newUnitCode.trim() || undefined,
        dean_name: newUnitHead.trim() || undefined,
      });
      setNewUnitName("");
      setNewUnitCode("");
      setNewUnitHead("");
      // Reload sub-units
      const res = await api.get('/admin/colleges', { params: { institution_id: activeInstitution.id } });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSubUnitsList(data);
      loadInstitutions();
    } catch (err: any) {
      setUnitError(getApiErrorMessage(err, isAr));
    } finally {
      setIsAddingUnit(false);
    }
  };

  // Delete a Sub-Unit
  const handleDeleteSubUnit = async (unitId: number | string) => {
    const isSchool = activeInstitution?.type === 'school';
    const msg = isSchool
      ? (isAr ? "هل أنت متأكد من حذف هذه المرحلة الدراسية؟" : "Are you sure you want to delete this school stage?")
      : (isAr ? "هل أنت متأكد من حذف هذه الكلية الجامعية؟" : "Are you sure you want to delete this college?");
    if (!confirm(msg)) return;

    try {
      await api.delete(`/admin/colleges/${unitId}`);
      setSubUnitsList((prev) => prev.filter((c) => c.id !== unitId));
      loadInstitutions();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  const filteredInstitutions = institutions.filter((inst) =>
    (inst.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inst.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isModalSchool = activeInstitution?.type === 'school';

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            {isAr ? "الهيكل الإداري للمؤسسات التعليمية" : "Educational Institutions Hierarchy"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إدارة الجامعات والكليات الأكاديمية التابعة لها، وإدارة المدارس ومراحلها وصفوفها الدراسية."
              : "Configure universities with academic colleges, and schools with educational stages and tracks."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadInstitutions}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-1.5 h-4 w-4" /> {isAr ? "إضافة مؤسسة جديدة" : "Add Institution"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء مؤسسة تعليمية جديدة" : "Create New Institution"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "حدد نوع المؤسسة (جامعة تحتوي على كليات أو مدرسة تحتوي على مراحل دراسية)." : "Select whether this is a university (with colleges) or a school (with stages)."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateInstitution} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="inst-name" className="text-xs font-semibold">{isAr ? "اسم المؤسسة" : "Institution Name"}</Label>
                  <Input
                    id="inst-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={type === 'university' ? (isAr ? "مثال: جامعة الملك سعود" : "E.g. King Saud University") : (isAr ? "مثال: مدارس الرواد الأهلية" : "E.g. Al-Rowad International School")}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inst-type" className="text-xs font-semibold">{isAr ? "نوع الهيكل التعليمي" : "Structure Type"}</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl">
                      <SelectItem value="university" className="text-xs font-semibold">
                        🎓 {isAr ? "جامعة (تحتوي على كليات وأقسام أكاديمية)" : "University (with colleges & departments)"}
                      </SelectItem>
                      <SelectItem value="school" className="text-xs font-semibold">
                        🏫 {isAr ? "مدرسة / مجمع تعليمي (يحتوي على مراحل وصفوف دراسية)" : "School (with educational stages & grade levels)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inst-addr" className="text-xs font-semibold">{isAr ? "الموقع أو العنوان" : "Address / Location"}</Label>
                  <Input
                    id="inst-addr"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "حفظ المؤسسة" : "Create Institution"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3.5" />
        <Input
          placeholder={isAr ? "بحث في الجامعات والمدارس..." : "Search universities or schools..."}
          className="pl-10 rtl:pl-3 rtl:pr-10 h-10 rounded-full bg-secondary/60 border-border text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Institutions Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          {isAr ? "جارٍ جلب المؤسسات التعليمية من MySQL..." : "Loading educational institutions..."}
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-12 text-center text-muted-foreground text-xs">
          <Building className="w-10 h-10 text-primary/30 mx-auto mb-2" />
          <p className="font-bold text-foreground text-sm">{isAr ? "لا توجد مؤسسات تعليمية مطابقة" : "No institutions found"}</p>
          <p className="mt-1">{isAr ? "أضف جامعة أو مدرسة جديدة لبدء إدارة الكليات والمراحل الدراسية." : "Create an institution to manage colleges, stages, and students."}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => {
            const isUni = (inst.type || inst.mode) === 'university';
            const subUnitsCount = inst.colleges_count || (inst.colleges ? inst.colleges.length : 0);
            const usersCount = inst.users_count || 0;

            return (
              <Card key={inst.id} className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all group">
                <CardHeader className="p-0 pb-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-xs border ${
                      isUni
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isUni ? <GraduationCap className="w-5 h-5" /> : <School className="w-5 h-5" />}
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 ${
                        isUni
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {isUni ? (isAr ? "🎓 جامعة" : "University") : (isAr ? "🏫 مدرسة / مجمع" : "School")}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {inst.name}
                    </CardTitle>
                    {inst.address && (
                      <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{inst.address}</span>
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 py-3 border-y border-border/70 my-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {isUni
                        ? (isAr ? "الكليات والأقسام الأكاديمية:" : "Colleges & Faculties:")
                        : (isAr ? "المراحل والصفوف الدراسية:" : "Stages & Grade Tracks:")}
                    </span>
                    <span className="font-bold text-foreground font-mono bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {subUnitsCount} {isUni ? (isAr ? "كلية" : "Colleges") : (isAr ? "مراحل" : "Stages")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{isAr ? "الحسابات المقيدة بالمؤسسة:" : "Enrolled Accounts:"}</span>
                    <span className="font-bold text-foreground font-mono bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {usersCount} {isAr ? "مستخدم" : "Users"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-0 pt-4 flex justify-between items-center gap-2">
                  {/* Manage Button contextual to University vs School */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenSubUnitsModal(inst)}
                    className={`rounded-full text-xs font-bold h-8 px-3 border-border bg-secondary/50 flex items-center gap-1.5 transition-all flex-1 ${
                      isUni
                        ? "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        : "hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                    }`}
                  >
                    {isUni ? <GraduationCap className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                    <span>
                      {isUni
                        ? (isAr ? "إدارة الكليات الجامعية" : "Manage Colleges")
                        : (isAr ? "إدارة المراحل الدراسية" : "Manage School Stages")}
                    </span>
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(inst.id)}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIERARCHICAL MANAGEMENT MODAL (COLLEGES FOR UNIS, STAGES FOR SCHOOLS)    */}
      {/* ========================================================================= */}
      <Dialog open={!!activeInstitution} onOpenChange={(open) => !open && setActiveInstitution(null)}>
        <DialogContent className="sm:max-w-[580px] bg-card border-border text-foreground rounded-3xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0 pb-2 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold border ${
                isModalSchool
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                {isModalSchool ? <Layers className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {isModalSchool
                    ? (isAr ? `المراحل والصفوف الدراسية لـ ${activeInstitution?.name}` : `Educational Stages of ${activeInstitution?.name}`)
                    : (isAr ? `الكليات الجامعية التابعة لـ ${activeInstitution?.name}` : `Colleges of ${activeInstitution?.name}`)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isModalSchool
                    ? (isAr ? "إدارة المراحل التعليمية (الابتدائية، المتوسطة، الثانوية) وتوزيع الفصول والمسارات." : "Configure school stages (Elementary, Middle, High School) and academic tracks.")
                    : (isAr ? "إدارة الكليات والأقسام الأكاديمية وتعيين العمداء وتوزيع أعضاء التدريس والطلاب." : "Manage university faculties, dean assignments, and academic departments.")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {unitError && (
            <div className="p-3 my-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {unitError}
            </div>
          )}

          {/* Quick Preset Template Buttons */}
          <div className="pt-2 px-1 space-y-1 shrink-0">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{isAr ? "قوالب سريعة مقترحة:" : "Quick Templates:"}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {isModalSchool ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "المرحلة الابتدائية" : "Elementary Stage (Grades 1-6)");
                      setNewUnitCode("PRI");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    🏫 {isAr ? "المرحلة الابتدائية" : "Elementary"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "المرحلة المتوسطة" : "Middle School (Grades 7-9)");
                      setNewUnitCode("MID");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    🏫 {isAr ? "المرحلة المتوسطة" : "Middle School"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "المرحلة الثانوية - المسار العلمي" : "High School - Science Track");
                      setNewUnitCode("SEC-SCI");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    🔬 {isAr ? "الثانوية (علمي)" : "High School (Science)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "المرحلة الثانوية - المسار الإنساني" : "High School - Arts Track");
                      setNewUnitCode("SEC-ART");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    📚 {isAr ? "الثانوية (إنساني/أدبي)" : "High School (Arts)"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "كلية علوم الحاسب والمعلومات" : "College of Computer Science");
                      setNewUnitCode("CCIS");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    💻 {isAr ? "علوم الحاسب" : "Computer Science"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "كلية الهندسة" : "College of Engineering");
                      setNewUnitCode("COE");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    ⚙️ {isAr ? "الهندسة" : "Engineering"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "كلية الطب البشري" : "College of Medicine");
                      setNewUnitCode("MED");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    🩺 {isAr ? "الطب" : "Medicine"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUnitName(isAr ? "كلية إدارة الأعمال" : "College of Business Administration");
                      setNewUnitCode("CBA");
                    }}
                    className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                  >
                    💼 {isAr ? "إدارة الأعمال" : "Business"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Add Sub-Unit Form */}
          <form onSubmit={handleAddSubUnit} className="p-4 bg-secondary/30 rounded-2xl border border-border my-2 space-y-3 shrink-0">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>
                {isModalSchool
                  ? (isAr ? "إضافة مرحلة / مسار دراسي جديد" : "Add Educational Stage / Track")
                  : (isAr ? "إضافة كلية / قسم أكاديمي جديد" : "Add College / Faculty")}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[11px] font-semibold">
                  {isModalSchool
                    ? (isAr ? "اسم المرحلة / المسار التعليمي" : "Stage / Track Name")
                    : (isAr ? "اسم الكلية الجامعية" : "College Name")}
                </Label>
                <Input
                  required
                  placeholder={
                    isModalSchool
                      ? (isAr ? "مثال: المرحلة الثانوية - مسار علوم الحاسب" : "E.g. High School - STEM Track")
                      : (isAr ? "مثال: كلية علوم الحاسب والمعلومات" : "E.g. College of Computer Science")
                  }
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">{isAr ? "الرمز (Code)" : "Code"}</Label>
                <Input
                  placeholder={isModalSchool ? "SEC / MID" : "CS / ENG"}
                  value={newUnitCode}
                  onChange={(e) => setNewUnitCode(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder={
                    isModalSchool
                      ? (isAr ? "مشرف المرحلة / مدير القسم (اختياري)" : "Stage Supervisor / Principal (Optional)")
                      : (isAr ? "اسم عميد الكلية (اختياري)" : "Dean / Head Name (Optional)")
                  }
                  value={newUnitHead}
                  onChange={(e) => setNewUnitHead(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={isAddingUnit || !newUnitName.trim()}
                className="h-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold px-4"
              >
                {isAddingUnit ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                <span>{isAr ? "إضافة" : "Add"}</span>
              </Button>
            </div>
          </form>

          {/* Sub-Units List */}
          <div className="flex-1 min-h-0 flex flex-col pt-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 shrink-0">
              {isModalSchool
                ? (isAr ? "المراحل والصفوف المسجلة بالمدرسة:" : "Registered Stages:")
                : (isAr ? "الكليات والأقسام المعتمدة بالجامعة:" : "Registered Colleges:")}
            </h4>

            {isLoadingSubUnits ? (
              <div className="py-8 text-center text-muted-foreground text-xs">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                {isAr ? "جارٍ التحميل..." : "Loading..."}
              </div>
            ) : subUnitsList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl bg-secondary/20">
                {isModalSchool ? <School className="w-8 h-8 mx-auto mb-1.5 text-primary/30" /> : <GraduationCap className="w-8 h-8 mx-auto mb-1.5 text-primary/30" />}
                <p className="font-bold text-foreground">
                  {isModalSchool
                    ? (isAr ? "لا توجد مراحل دراسية مضافة بعد" : "No school stages configured yet")
                    : (isAr ? "لا توجد كليات مضافة بعد" : "No colleges added yet")}
                </p>
                <p className="mt-0.5 text-[11px]">
                  {isModalSchool
                    ? (isAr ? "استخدم القوالب أعلاه أو أدخل اسم المرحلة التعليمية." : "Use templates above to add elementary, middle, or high school stages.")
                    : (isAr ? "أضف كليات هذه الجامعة لتوزيع الطلبة والأساتذة عليها." : "Add university colleges to assign faculty and students.")}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {subUnitsList.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3 bg-secondary/40 border border-border/80 rounded-2xl flex justify-between items-center hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{unit.name}</span>
                        {unit.code && (
                          <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 bg-background/80">
                            {unit.code}
                          </Badge>
                        )}
                      </div>
                      {(unit.dean_name || unit.supervisor_name) && (
                        <p className="text-[11px] text-muted-foreground">
                          {isModalSchool ? (isAr ? "المشرف: " : "Supervisor: ") : (isAr ? "العميد: " : "Dean: ")}
                          <span className="font-medium text-foreground">{unit.dean_name || unit.supervisor_name}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {unit.users_count || 0} {isAr ? "مستخدم" : "users"}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteSubUnit(unit.id)}
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
