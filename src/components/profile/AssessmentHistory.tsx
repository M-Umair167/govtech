"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getApiBaseUrl } from "@/utils/config";

type HistoryItem = {
    id: number;
    subject: string;
    score: number;
    total_questions: number;
    accuracy: number;
    created_at: string;
};

const SUBJECT_MAP: Record<string, string> = {
    fp: "Fundamental Programming",
    ds: "Data Structures",
    db: "Database Systems",
    cn: "Computer Networks",
    se: "Software Engineering",
    os: "Operating Systems",
    oop: "Object Oriented Programming",
    disc: "Discrete Structures",
    infosec: "Information Security"
};

export default function AssessmentHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${getApiBaseUrl()}/api/v1/profile/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-gray-400 text-sm">Loading history...</div>;

    if (history.length === 0) {
        return (
            <div className="p-8 bg-[#0F172A]/50 border border-[#1E293B] rounded-xl text-center">
                <p className="text-gray-400 mb-4">You haven't taken any assessments yet.</p>
                <button className="text-[#007BFF] hover:underline text-sm font-medium">Start your first test</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#007BFF]" /> Recent Activity
            </h3>
            <div className="space-y-3">
                {history.slice(0, 5).map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-[#0F172A] rounded-xl border border-[#1E293B] hover:border-[#007BFF]/30 transition-all flex items-center justify-between group"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-white text-sm">
                                {SUBJECT_MAP[item.subject] || item.subject}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-[#007BFF] font-mono font-bold text-sm">
                                    {item.score}/{item.total_questions}
                                </div>
                                <div className={`text-xs font-bold ${item.accuracy >= 70 ? "text-emerald-400" : item.accuracy >= 40 ? "text-amber-400" : "text-rose-400"}`}>
                                    {Math.round(item.accuracy)}%
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center group-hover:bg-[#007BFF] transition-colors">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
