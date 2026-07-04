import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/hooks/useApp";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sofa } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await api.auth.login(data);
      login(res.user, res.token);
      
      toast.success("Logged in successfully!");
      
      if (res.user.role === "admin") navigate("/admin-dashboard");
      else if (res.user.role === "vendor") navigate("/vendor-dashboard");
      else navigate("/user-dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Password reset link sent to your email!");
  };

  return (
    <div className="container min-h-[calc(100vh-140px)] flex flex-col pt-12 md:pt-24">
      <div className="w-full max-w-sm mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand/10 text-brand mb-4">
            <Sofa className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              {...register("email")} 
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              {...register("password")} 
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 text-white font-bold mt-2">
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          <div className="text-center mt-6 space-y-4">
            <div>
              <button 
                onClick={handleForgotPassword}
                type="button"
                className="text-sm text-brand hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              New to RentEase?{" "}
              <Link to="/register" className="text-brand font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
