
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Calendar, Trophy, ArrowLeft, Target, Award, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getApiBaseUrl } from "@/utils/config";
import { motion } from "framer-motion";

type QuestionDetail = {
    id: number;
    question: string;
    options: string[];
    selected_answer: string;
    correct_answer: string;
    explanation: string;
};

type ResultData = {
    id: number;
    subject: string;
    score: number;
    total_questions: number;
    accuracy: number;
    created_at: string;
    questions?: QuestionDetail[];
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

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const resultId = Array.isArray(params?.id) ? params.id[0] : params?.id;

                if (!resultId) {
                    setError("Invalid Result ID");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${getApiBaseUrl()}/api/v1/assessment/result/${resultId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setResult(data);
                } else {
                    setError("Result not found or access denied.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load result.");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [params, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091220] flex items-center justify-center text-white">
                <Loader2 className="animate-spin w-10 h-10 text-[#007BFF]" />
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen bg-[#091220] flex flex-col items-center justify-center text-white gap-4">
                <XCircle className="w-12 h-12 text-rose-500" />
                <h1 className="text-xl font-bold">{error || "Something went wrong"}</h1>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2 bg-[#007BFF] rounded-lg hover:bg-[#0062CC] transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const subjectName = SUBJECT_MAP[result.subject] || result.subject;
    const percentage = Math.round(result.accuracy);

    let gradeColor = "text-rose-500";
    let gradeText = "Needs Improvement";
    if (percentage >= 80) {
        gradeColor = "text-emerald-400";
        gradeText = "Excellent!";
    } else if (percentage >= 60) {
        gradeColor = "text-amber-400";
        gradeText = "Good Job";
    }

    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Score Card */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl mb-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#007BFF]/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[#1E293B] flex items-center justify-center mb-6 shadow-xl border border-[#334155]">
                            <Award className={`w-10 h-10 ${gradeColor}`} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {subjectName}
                        </h1>
                        <p className={`text-xl font-mono ${gradeColor} font-bold mb-8`}>
                            {gradeText}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mb-10">
                            <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-4 flex flex-col items-center">
                                <Trophy className="w-6 h-6 text-[#007BFF] mb-2" />
                                <span className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">Score</span>
                                <span className="text-2xl font-bold font-mono">
                                    {result.score} <span className="text-sm text-gray-500">/ {result.total_questions}</span>
                                </span>
                            </div>
                            <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-4 flex flex-col items-center">
                                <Target className="w-6 h-6 text-emerald-400 mb-2" />
                                <span className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">Accuracy</span>
                                <span className="text-2xl font-bold font-mono">
                                    {percentage}%
                                </span>
                            </div>
                            <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-4 flex flex-col items-center">
                                <Calendar className="w-6 h-6 text-purple-400 mb-2" />
                                <span className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">Date</span>
                                <span className="text-lg font-bold font-mono pt-1">
                                    {new Date(result.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Questions */}
                {result.questions && result.questions.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Detailed Review</h2>
                        {result.questions.map((q, idx) => {
                            const isCorrect = q.selected_answer === q.correct_answer;
                            return (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`rounded-2xl p-6 md:p-8 shadow-xl border transition-colors duration-500
                                        ${isCorrect
                                            ? "bg-[#064E3B]/20 border-emerald-500/50"
                                            : "bg-[#450A0A]/20 border-rose-500/50"
                                        }
                                    `}
                                >
                                    <div className="flex gap-4">
                                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded-lg
                                            ${isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}
                                        `}>
                                            {idx + 1}
                                        </div>
                                        <h2 className="text-lg font-medium leading-relaxed text-white pt-0.5">
                                            {q.question}
                                        </h2>
                                    </div>

                                    <div className="h-px w-full bg-[#1E293B] my-6"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((option, optIdx) => {
                                            const isSelected = q.selected_answer === option;
                                            const isOptionCorrect = q.correct_answer === option;
                                            const label = String.fromCharCode(65 + optIdx);

                                            let containerClass = "bg-[#091220] border-[#1E293B] text-[#94A3B8]";
                                            let icon = null;

                                            if (isOptionCorrect) {
                                                containerClass = "bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                                                icon = <CheckCircle className="w-5 h-5 text-emerald-500 absolute top-4 right-4" />;
                                            } else if (isSelected && !isOptionCorrect) {
                                                containerClass = "bg-rose-500/10 border-rose-500 text-white";
                                                icon = <XCircle className="w-5 h-5 text-rose-500 absolute top-4 right-4" />;
                                            } else {
                                                containerClass = "bg-[#091220]/50 border-[#1E293B] opacity-50";
                                            }

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={`relative group p-4 rounded-xl border text-left transition-all duration-200 outline-none flex items-start gap-3 ${containerClass}`}
                                                >
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono transition-colors flex-shrink-0 mt-0.5
                                                        ${isOptionCorrect ? "bg-emerald-500 text-white" :
                                                            (isSelected && !isOptionCorrect) ? "bg-rose-500 text-white" :
                                                                "bg-[#1E293B] text-[#64748B]"}
                                                    `}>
                                                        {label}
                                                    </div>
                                                    <span className="text-sm leading-relaxed pr-6">
                                                        {option}
                                                    </span>
                                                    {icon}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {q.explanation && (
                                        <div className="mt-6 p-4 rounded-lg bg-[#1E293B]/50 border-l-4 border-[#007BFF]">
                                            <h4 className="text-[#007BFF] font-bold text-sm mb-1 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Explanation
                                            </h4>
                                            <p className="text-sm text-[#94A3B8] leading-relaxed">
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
