import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Building, Plus, Search, MapPin, Trash2, Loader2, RefreshCw, GraduationCap, School, FolderPlus } from "lucide-react";
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

interface CollegeItem {
  id: number | string;
  institution_id: number | string;
  name: string;
  code?: string;
  dean_name?: string;
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

  // Colleges Management Dialog State
  const [activeInstitutionForColleges, setActiveInstitutionForColleges] = useState<any>(null);
  const [collegesList, setCollegesList] = useState<CollegeItem[]>([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeCode, setNewCollegeCode] = useState("");
  const [newCollegeDean, setNewCollegeDean] = useState("");
  const [isAddingCollege, setIsAddingCollege] = useState(false);
  const [collegeError, setCollegeError] = useState<string | null>(null);

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
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذه المؤسسة؟ سيتم حذف الكليات التابعة لها تلقائياً." : "Are you sure you want to delete this institution? All child colleges will be deleted.")) return;
    try {
      await api.delete(`/admin/institutions/${id}`);
      loadInstitutions();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  // Open Colleges Modal & Load Colleges
  const handleOpenCollegesModal = async (inst: any) => {
    setActiveInstitutionForColleges(inst);
    setIsLoadingColleges(true);
    setCollegeError(null);
    try {
      const res = await api.get('/admin/colleges', { params: { institution_id: inst.id } });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setCollegesList(data);
    } catch (e) {
      console.warn('[Colleges] Fetch error:', e);
    } finally {
      setIsLoadingColleges(false);
    }
  };

  // Add College to Active University
  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstitutionForColleges || !newCollegeName.trim()) return;
    setIsAddingCollege(true);
    setCollegeError(null);

    try {
      await api.post('/admin/colleges', {
        institution_id: activeInstitutionForColleges.id,
        name: newCollegeName.trim(),
        code: newCollegeCode.trim() || undefined,
        dean_name: newCollegeDean.trim() || undefined,
      });
      setNewCollegeName("");
      setNewCollegeCode("");
      setNewCollegeDean("");
      // Reload colleges
      const res = await api.get('/admin/colleges', { params: { institution_id: activeInstitutionForColleges.id } });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setCollegesList(data);
      loadInstitutions();
    } catch (err: any) {
      setCollegeError(getApiErrorMessage(err, isAr));
    } finally {
      setIsAddingCollege(false);
    }
  };

  // Delete a College
  const handleDeleteCollege = async (collegeId: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذه الكلية؟" : "Are you sure you want to delete this college?")) return;
    try {
      await api.delete(`/admin/colleges/${collegeId}`);
      setCollegesList((prev) => prev.filter((c) => c.id !== collegeId));
      loadInstitutions();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  const filteredInstitutions = institutions.filter((inst) =>
    (inst.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inst.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            {isAr ? "إدارة المؤسسات التعليمية والكليات" : "Institution & College Hierarchy"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إنشاء وإدارة الجامعات والمدارس والتحكم في الكليات والأقسام الأكاديمية التابعة لها."
              : "Configure universities, schools, and manage associated academic faculties and colleges in MySQL."}
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
                  {isAr ? "سيتم حفظ بيانات المؤسسة في قاعدة بيانات MySQL." : "Save a new educational organization into MySQL."}
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
                    placeholder={isAr ? "مثال: جامعة الملك سعود" : "E.g. King Saud University"}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inst-type" className="text-xs font-semibold">{isAr ? "نوع المؤسسة" : "Type"}</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl">
                      <SelectItem value="university" className="text-xs font-semibold">
                        🎓 {isAr ? "جامعة (تحتوي على كليات)" : "University (with colleges)"}
                      </SelectItem>
                      <SelectItem value="school" className="text-xs font-semibold">
                        🏫 {isAr ? "مدرسة / مجمع تعليمي" : "School"}
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
          placeholder={isAr ? "بحث في المؤسسات التعليمية..." : "Search institutions..."}
          className="pl-10 rtl:pl-3 rtl:pr-10 h-10 rounded-full bg-secondary/60 border-border text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Institutions Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          {isAr ? "جارٍ جلب المؤسسات والكليات من MySQL..." : "Loading institutions & colleges..."}
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-12 text-center text-muted-foreground text-xs">
          <Building className="w-10 h-10 text-primary/30 mx-auto mb-2" />
          <p className="font-bold text-foreground text-sm">{isAr ? "لا توجد مؤسسات تعليمية مطابقة" : "No institutions found"}</p>
          <p className="mt-1">{isAr ? "أضف مؤسسة جديدة لبدء إدارة الكليات والمستخدمين." : "Create an institution to manage colleges and assign students."}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => {
            const isUni = (inst.type || inst.mode) === 'university';
            const collegesCount = inst.colleges_count || (inst.colleges ? inst.colleges.length : 0);
            const usersCount = inst.users_count || 0;

            return (
              <Card key={inst.id} className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all group">
                <CardHeader className="p-0 pb-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shadow-xs">
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
                      {isUni ? (isAr ? "جامعة" : "University") : (isAr ? "مدرسة" : "School")}
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
                    <span className="text-muted-foreground">{isAr ? "الكليات / الأقسام:" : "Colleges / Faculties:"}</span>
                    <span className="font-bold text-foreground font-mono bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {collegesCount} {isAr ? "كلية" : "Colleges"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{isAr ? "الحسابات المرتبطة:" : "Enrolled Accounts:"}</span>
                    <span className="font-bold text-foreground font-mono bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {usersCount} {isAr ? "مستخدم" : "Users"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-0 pt-4 flex justify-between items-center gap-2">
                  {/* Manage Colleges Button (especially for universities) */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenCollegesModal(inst)}
                    className="rounded-full text-xs font-bold h-8 px-3 border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center gap-1.5 transition-all flex-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>{isAr ? "إدارة الكليات" : "Manage Colleges"}</span>
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
      {/* COLLEGES MANAGEMENT MODAL                                                 */}
      {/* ========================================================================= */}
      <Dialog open={!!activeInstitutionForColleges} onOpenChange={(open) => !open && setActiveInstitutionForColleges(null)}>
        <DialogContent className="sm:max-w-[560px] bg-card border-border text-foreground rounded-3xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0 pb-2 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {isAr ? `الكليات التابعة لـ ${activeInstitutionForColleges?.name}` : `Colleges of ${activeInstitutionForColleges?.name}`}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isAr ? "إضافة وحذف الكليات والأقسام الأكاديمية وربط الطلاب والأساتذة بها." : "Add and manage colleges & departments under this institution."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {collegeError && (
            <div className="p-3 my-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {collegeError}
            </div>
          )}

          {/* Add College Form */}
          <form onSubmit={handleAddCollege} className="p-4 bg-secondary/30 rounded-2xl border border-border my-2 space-y-3 shrink-0">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>{isAr ? "إضافة كلية / قسم جديد" : "Add New College / Faculty"}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[11px] font-semibold">{isAr ? "اسم الكلية" : "College Name"}</Label>
                <Input
                  required
                  placeholder={isAr ? "مثال: كلية علوم الحاسب والمعلومات" : "E.g. College of Computer Science"}
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">{isAr ? "الرمز (Code)" : "Code"}</Label>
                <Input
                  placeholder="CS / ENG"
                  value={newCollegeCode}
                  onChange={(e) => setNewCollegeCode(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder={isAr ? "اسم العميد / المشرف (اختياري)" : "Dean / Head Name (Optional)"}
                  value={newCollegeDean}
                  onChange={(e) => setNewCollegeDean(e.target.value)}
                  className="h-8 rounded-xl bg-card border-border text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={isAddingCollege || !newCollegeName.trim()}
                className="h-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold px-4"
              >
                {isAddingCollege ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                <span>{isAr ? "إضافة" : "Add"}</span>
              </Button>
            </div>
          </form>

          {/* Colleges List */}
          <div className="flex-1 min-h-0 flex flex-col pt-2">
            <h4 className="text-xs font-bold text-foreground mb-2">
              {isAr ? `الكليات المسجلة (${collegesList.length})` : `Registered Colleges (${collegesList.length})`}
            </h4>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[220px]">
              {isLoadingColleges ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-primary" />
                  {isAr ? "جارٍ جلب الكليات..." : "Loading colleges..."}
                </div>
              ) : collegesList.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-secondary/20">
                  <GraduationCap className="w-7 h-7 text-primary/30 mx-auto mb-1" />
                  <p>{isAr ? "لم تتم إضافة كليات لهذه المؤسسة بعد." : "No colleges added yet for this institution."}</p>
                </div>
              ) : (
                collegesList.map((col) => (
                  <div
                    key={col.id}
                    className="p-3 rounded-2xl bg-secondary/40 border border-border flex justify-between items-center gap-3 hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground truncate">{col.name}</span>
                        {col.code && (
                          <Badge variant="outline" className="text-[9px] font-mono rounded-md px-1.5 py-0 bg-secondary">
                            {col.code}
                          </Badge>
                        )}
                      </div>
                      {col.dean_name && (
                        <p className="text-[10px] text-muted-foreground">
                          {isAr ? `العميد: ${col.dean_name}` : `Dean: ${col.dean_name}`}
                        </p>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCollege(col.id)}
                      className="h-7 w-7 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
