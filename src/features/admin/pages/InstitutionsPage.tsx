import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Building, Plus, Search, MapPin, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function InstitutionsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"school" | "university">("university");
  const [address, setAddress] = useState("");

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
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذه المؤسسة؟" : "Are you sure you want to delete this institution?")) return;
    try {
      await api.delete(`/admin/institutions/${id}`);
      loadInstitutions();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  const filteredInstitutions = institutions.filter((inst) =>
    (inst.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inst.address || inst.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            {isAr ? "إدارة المؤسسات التعليمية" : "Institution Management"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إنشاء وإدارة المدارس والجامعات المرتبطة بقاعدة البيانات وضبط هيكليتها."
              : "Create and configure schools and universities live from MySQL."}
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
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-2 h-4 w-4" /> {isAr ? "إضافة مؤسسة جديدة" : "Add Institution"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء مؤسسة تعليمية جديدة" : "Create New Institution"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "سيتم حفظ بيانات المؤسسة مباشرة في جدول institutions في MySQL." : "Save a new educational organization into MySQL."}
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
                    placeholder="E.g. King Saud University"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inst-type" className="text-xs font-semibold">{isAr ? "نوع المؤسسة" : "Type"}</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="school">{isAr ? "مدرسة (K-12)" : "K-12 School"}</SelectItem>
                      <SelectItem value="university">{isAr ? "جامعة / كلية" : "University / College"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold">{isAr ? "الموقع / العنوان" : "Location"}</Label>
                  <Input
                    id="location"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Riyadh, Saudi Arabia"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full text-xs"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-primary text-primary-foreground text-xs font-bold"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "إنشاء المؤسسة" : "Create")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-border">
        <div className="relative w-full sm:w-96 mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isAr ? "بحث بالاسم أو الموقع..." : "Search by name or location..."}
            className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            {isAr ? "جارٍ جلب المؤسسات من MySQL..." : "Loading institutions from MySQL..."}
          </div>
        ) : filteredInstitutions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs">
            {isAr ? "لم يتم العثور على أي مؤسسات مسجلة." : "No registered institutions found in MySQL."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInstitutions.map((inst) => (
              <Card key={inst.id} className="bg-card/90 border-border rounded-3xl p-5 hover:border-primary/40 transition-all group">
                <CardHeader className="p-0 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="rounded-full uppercase bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]">
                      {inst.type || "university"}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {inst.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <MapPin className="w-3 h-3" /> {inst.address || inst.location || "Main Campus"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-3 border-t border-border/60">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(inst.id)}
                      className="rounded-full text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> {isAr ? "حذف" : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
