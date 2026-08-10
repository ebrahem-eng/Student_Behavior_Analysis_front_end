import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";


export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <Card className="glass border-0">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
               {/* Placeholder Logo */}
              <div className="w-8 h-8 bg-primary rounded-lg rotate-45" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your portal to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
