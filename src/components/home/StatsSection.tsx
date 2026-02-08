"use client";

import { useEffect, useState } from "react";
import { Users, Database, BookOpen } from "lucide-react";
import { getApiBaseUrl } from "@/utils/config";

type Stats = {
    users: number;
    questions: number;
    subjects: number;
};

export default function StatsSection() {
    const [stats, setStats] = useState<Stats>({ users: 0, questions: 0, subjects: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${getApiBaseUrl()}/api/v1/home/stats`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="bg-[#060B16] py-16 border-y border-white/5 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#007BFF]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Stat Card 1 */}
                    <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/50 rounded-2xl border border-white/5 hover:border-[#007BFF]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF] mb-4 group-hover:scale-110 transition-transform">
                            <Database size={24} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tabular-nums">
                            {stats.questions.toLocaleString()}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                            Questions Bank
                        </p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/50 rounded-2xl border border-white/5 hover:border-[#007BFF]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-4 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tabular-nums">
                            {stats.users.toLocaleString()}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                            Active Learners
                        </p>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/50 rounded-2xl border border-white/5 hover:border-[#007BFF]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tabular-nums">
                            {stats.subjects}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                            Topics Covered
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
