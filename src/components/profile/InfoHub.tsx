"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, Check, Save } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Schema
const profileSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    location: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    // Email is read-only usually, but we can include it for display
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface InfoHubProps {
    defaultValues: ProfileFormValues & { email: string };
    onSave: (data: ProfileFormValues) => Promise<void>;
}

const AVAILABLE_SUBJECTS = ["OOP", "Data Structures", "Computer Networks", "Discrete Structures", "Operating Systems", "Database"];

export default function InfoHub({ defaultValues, onSave }: InfoHubProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        try {
            await onSave(data);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Section A: Personal Information */}
                <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-8 border border-white/5 space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            <input
                                {...register("fullName")}
                                className="w-full bg-[#E8F0FE] text-slate-900 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all"
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Location</label>
                            <input
                                {...register("location")}
                                className="w-full bg-[#E8F0FE] text-slate-900 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all"
                                placeholder="e.g. Lahore, Pakistan"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-400">Professional Bio</label>
                            <textarea
                                {...register("bio")}
                                rows={4}
                                className="w-full bg-[#E8F0FE] text-slate-900 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all resize-none"
                                placeholder="Tell us about your tech journey..."
                            />
                            {errors.bio && <p className="text-red-400 text-xs">{errors.bio.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section B: Technical Interests */}
                <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-8 border border-white/5 space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Technical Interests</h3>

                    <Controller
                        control={control}
                        name="subjects"
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_SUBJECTS.map((subject) => {
                                    const isSelected = field.value?.includes(subject);
                                    return (
                                        <button
                                            key={subject}
                                            type="button"
                                            onClick={() => {
                                                const current = field.value || [];
                                                const createNew = isSelected
                                                    ? current.filter(s => s !== subject)
                                                    : [...current, subject];
                                                field.onChange(createNew);
                                            }}
                                            className={clsx(
                                                "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                                                isSelected
                                                    ? "bg-[#007BFF] text-white border-[#007BFF] shadow-[0_0_15px_rgba(0,123,255,0.4)] transform scale-105"
                                                    : "bg-[#1F2937] text-gray-400 border-gray-700 hover:border-[#007BFF]/50 hover:text-white"
                                            )}
                                        >
                                            {subject}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    />
                </div>

                {/* Section C: Account Security */}
                <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-8 border border-white/5 space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Account Security</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Email Address (Read Only)</label>
                            <input
                                value={defaultValues.email}
                                disabled
                                className="w-full bg-[#1F2937] text-gray-400 rounded-lg px-4 py-3 text-sm font-medium border border-gray-700 cursor-not-allowed"
                            />
                        </div>

                        <div className="pt-2">
                            <button type="button" className="text-[#007BFF] text-sm font-medium hover:underline">
                                Change Password via Email
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSaving || isSuccess}
                        className={clsx(
                            "h-14 px-10 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all min-w-[200px] justify-center",
                            isSuccess ? "bg-green-500 shadow-green-500/30" : "bg-[#007BFF] hover:bg-blue-600 shadow-[0_4px_20px_rgba(0,123,255,0.4)]"
                        )}
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" />
                        ) : isSuccess ? (
                            <>
                                <Check size={20} /> Saved!
                            </>
                        ) : (
                            <>
                                <Save size={20} /> Save Changes
                            </>
                        )}
                    </motion.button>
                </div>

            </form>
        </div>
    );
}
