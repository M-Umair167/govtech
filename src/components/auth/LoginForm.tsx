"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem("token", result.access_token);
                router.push("/");
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.detail || "Invalid email or password.");
            }
        } catch (error) {
            console.error(error);
            setError("Network error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Welcome back
                </h1>
                <p className="text-[#94A3B8] text-lg">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-bold text-[#00A3FF] hover:text-[#00A3FF]/80 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {registered && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm p-3 rounded-md animate-in fade-in slide-in-from-top-2">
                    Account created successfully! Please log in.
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-md mb-4 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wide"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="flex h-12 w-full rounded-md bg-[#1E293B] px-4 py-2 text-sm text-[#F1F5F9] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500 font-medium">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wide"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="flex h-12 w-full rounded-md bg-[#1E293B] px-4 py-2 text-sm text-[#F1F5F9] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all pr-10"
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#F1F5F9]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-500 font-medium">
                            {errors.password.message}
                        </p>
                    )}
                    <div className="flex justify-end pt-1">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-[#64748B] hover:text-[#64748B]/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#0077FF] text-white text-base font-semibold shadow-[0_4px_14px_0_rgba(0,119,255,0.39)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,119,255,0.23)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        "Log in"
                    )}
                </button>
            </form>
        </div>
    );
}
