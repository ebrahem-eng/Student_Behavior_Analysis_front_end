import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setAuth = useAppStore((state) => state.setAuth);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@sba-platform.edu",
      password: "password123",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login(data.email, data.password);
      setAuth(response.user, response.token);
      navigate(`/${response.user.role || 'admin'}`);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message ||
        (isAr ? "فشل تسجيل الدخول. يرجى التحقق من البريد وكلمة المرور." : "Login failed. Please verify your credentials.")
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Quick switch role buttons for instant testing
  const setDemoRole = (role: string) => {
    form.setValue("email", `${role}@sba-platform.edu`);
    form.setValue("password", "password123");
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-foreground">
                  {isAr ? "البريد الإلكتروني المؤسسي" : "Institutional Email"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@sba-platform.edu"
                    {...field}
                    className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-bold text-foreground">
                    {isAr ? "كلمة المرور" : "Password"}
                  </FormLabel>
                  <a href="#forgot" className="text-[11px] font-semibold text-primary hover:underline">
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isAr ? "جارٍ التحقق..." : "Authenticating..."}</span>
              </>
            ) : (
              <>
                <span>{isAr ? "تسجيل الدخول" : "Sign In to Portal"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Quick Demo Role Switcher Chips */}
      <div className="pt-2 border-t border-border/70 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{isAr ? "اختيار حساب تجريبي سريع:" : "Quick Demo Role Accounts:"}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { role: "admin", label: isAr ? "مدير" : "Admin" },
            { role: "teacher", label: isAr ? "معلم" : "Teacher" },
            { role: "advisor", label: isAr ? "مرشد" : "Advisor" },
            { role: "student", label: isAr ? "طالب" : "Student" },
            { role: "parent", label: isAr ? "ولي أمر" : "Parent" },
          ].map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => setDemoRole(item.role)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-primary/15 hover:text-primary border border-border/80 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
