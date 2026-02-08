"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnalyticsChart from "@/components/profile/AnalyticsChart";
import AssessmentHistory from "@/components/profile/AssessmentHistory";
import { useEffect, useState } from "react";
import { Loader2, Zap, Trophy, Target, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getApiBaseUrl } from "@/utils/config";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }
            try {
                const res = await fetch(`${getApiBaseUrl()}/api/v1/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091220] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#007BFF] w-12 h-12" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#091220] font-sans selection:bg-[#007BFF] selection:text-white pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-400">
                            Welcome back, <span className="text-white font-semibold">{profile?.full_name || "User"}</span>
                        </p>
                    </div>

                    <Link
                        href="/assessment"
                        className="flex items-center gap-2 px-6 py-3 bg-[#007BFF] hover:bg-[#0062CC] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-[#007BFF]/30 group"
                    >
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Take New Test
                    </Link>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">

                    {/* Stat Card 1 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="w-24 h-24 text-[#007BFF]" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                                <Trophy className="w-4 h-4 text-[#007BFF]" />
                                Tests Completed
                            </div>
                            <div className="text-4xl font-bold text-white font-mono">
                                {profile?.tests_taken || 0}
                            </div>
                        </div>
                    </motion.div>

                    {/* Stat Card 2 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                                <Target className="w-4 h-4 text-emerald-500" />
                                Avg. Accuracy
                            </div>
                            <div className="text-4xl font-bold text-white font-mono">
                                {profile?.avg_accuracy || 0}%
                            </div>
                        </div>
                    </motion.div>

                    {/* Stat Card 3 (Placeholder or Rank) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ArrowUpRight className="w-24 h-24 text-purple-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                                <ArrowUpRight className="w-4 h-4 text-purple-500" />
                                Current Title
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {profile?.title || "Novice"}
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Charts & History Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

                    {/* Main Chart (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnalyticsChart />
                    </div>

                    {/* Recent History (1 col) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <AssessmentHistory />
                        </div>
                    </div>

                </div>

            </div>

            <Footer />
        </main>
    );
}
