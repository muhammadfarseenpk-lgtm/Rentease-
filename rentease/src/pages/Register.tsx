import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sofa } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/hooks/useApp";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useHookForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login({ id: crypto.randomUUID(), name: data.name, email: data.email, role: "user" });
      toast.success("Account created! Welcome to RentEase 🎉");
      navigate("/user-dashboard");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#fdfaf8] min-h-[calc(100vh-140px)] flex flex-col pt-12 md:pt-24 container px-6 lg:px-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto relative">
        <Link to="/" className="absolute -top-8 left-0 text-sm text-gray-400 hover:text-gray-900 font-bold transition-colors">
          ← Back to Home
        </Link>
        
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Sofa className="w-6 h-6 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1">Start renting in minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Arjun Nair" {...register("name")} className="rounded-xl border-gray-200 h-11" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@email.com" {...register("email")} className="rounded-xl border-gray-200 h-11" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91 98765 43210" {...register("phone")} className="rounded-xl border-gray-200 h-11" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Min 8 characters" {...register("password")} className="rounded-xl border-gray-200 h-11" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Confirm your password" {...register("confirmPassword")} className="rounded-xl border-gray-200 h-11" />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 text-white font-bold mt-2">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-brand hover:underline font-bold">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
