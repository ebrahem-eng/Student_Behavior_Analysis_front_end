import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
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
import { getApiErrorMessage } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login(data.email, data.password);
      setAuth(response.user, response.token || response.access_token || '');
      navigate(`/${response.user.role || 'admin'}`);
    } catch (error: any) {
      console.error("[Login API Error]", error);
      const friendlyMessage = getApiErrorMessage(error, isAr);
      setErrorMessage(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Real API Error Callout Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{isAr ? "فشل تسجيل الدخول" : "Authentication Failed"}</p>
            <p className="text-[11px] leading-relaxed text-rose-500/90">{errorMessage}</p>
          </div>
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
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@sba-platform.edu"
                    {...field}
                    className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                <span>{isAr ? "جارٍ التحقق مع الخادم..." : "Verifying with server..."}</span>
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
    </div>
  );
}
