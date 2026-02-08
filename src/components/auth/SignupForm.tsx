"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

const signupSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(7, "Password must be at least 7 characters")
        .regex(/[a-zA-Z]/, "Password must contain letters")
        .regex(/[0-9]/, "Password must contain numbers")
        .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain special characters"
        ),
    terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setError("");
        try {
            const fullName = `${data.firstName} ${data.lastName}`;
            const response = await authService.signup({
                full_name: fullName,
                email: data.email,
                password: data.password,
            });

            if (response.ok) {
                router.push("/login?registered=true");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Signup failed. Please try again.");
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
                    Create an account
                </h1>
                <p className="text-[#94A3B8] text-lg">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-[#00A3FF] hover:text-[#00A3FF]/80 transition-colors"
                    >
                        Log in
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-md animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="firstName"
                            className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wide"
                        >
                            First name
                        </label>
                        <input
                            id="firstName"
                            placeholder="John"
                            className="flex h-12 w-full rounded-md bg-[#1E293B] px-4 py-2 text-sm text-[#F1F5F9] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-red-500 font-medium">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="lastName"
                            className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wide"
                        >
                            Last name
                        </label>
                        <input
                            id="lastName"
                            placeholder="Doe"
                            className="flex h-12 w-full rounded-md bg-[#1E293B] px-4 py-2 text-sm text-[#F1F5F9] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-500 font-medium">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

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
                    <label
                        htmlFor="password"
                        className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wide"
                    >
                        Password
                    </label>
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
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 rounded border-gray-600 bg-[#1E293B] text-[#0077FF] focus:ring-[#0077FF]"
                        {...register("terms")}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none text-[#94A3B8]"
                    >
                        I agree to the{" "}
                        <Link href="/terms?ref=signup" className="text-[#00A3FF] hover:underline">
                            Terms & Conditions
                        </Link>
                    </label>
                </div>
                {errors.terms && (
                    <p className="text-sm text-red-500 font-medium">
                        {errors.terms.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#0077FF] text-white text-base font-semibold shadow-[0_4px_14px_0_rgba(0,119,255,0.39)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,119,255,0.23)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        "Create account"
                    )}
                </button>
            </form>
        </div>
    );
}
