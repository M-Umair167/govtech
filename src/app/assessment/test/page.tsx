"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/utils/config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Type definitions
type Option = string;
type Question = {
    id: number;
    subject: string;
    difficulty_level: number;
    question: string;
    options: Option[];
    correct_answer?: string;
    explanation?: string;
};

const SUBJECT_MAP: Record<string, string> = {
    cn: "Computer Network",
    db: "Database Systems",
    ds: "Data Structures",
    disc: "Discrete Structures",
    fp: "Fundamental Programming",
    oop: "Object Oriented Programming",
    os: "Operating Systems",
    se: "Software Engineering",
    infosec: "Information Security"
};

export default function TestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Params
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const count = parseInt(searchParams.get("limit") || "10");

    // State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    // Prompt before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isSubmitted) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitted]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSubmitted || isSubmitting) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
                document.getElementById(`question-${Math.min(activeQuestionIndex + 1, questions.length - 1)}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveQuestionIndex(prev => Math.max(prev - 1, 0));
                document.getElementById(`question-${Math.max(activeQuestionIndex - 1, 0)}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
                const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
                const idx = map[e.key.toLowerCase()];
                if (questions[activeQuestionIndex]) {
                    handleOptionSelect(questions[activeQuestionIndex].id, questions[activeQuestionIndex].options[idx]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSubmitted, isSubmitting, activeQuestionIndex, questions]);


    // Fetch Questions
    useEffect(() => {
        if (!subject) return;

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams({
                    subject: subject,
                    diff: difficulty || "Medium",
                    count: count.toString()
                });

                const res = await fetch(`${getApiBaseUrl()}/api/v1/assessment/questions?${query}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data);
                    setTimeLeft(data.length * 60);
                } else {
                    console.error("Failed to fetch");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [subject, difficulty, count]);

    // Timer
    useEffect(() => {
        if (loading || questions.length === 0 || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, questions, isSubmitted]);

    // Handlers
    const handleOptionSelect = (questionId: number, option: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async (force: boolean = false) => {
        if (isSubmitted || isSubmitting) return;

        // Validate that all questions are answered (unless forced by timer)
        if (!force && Object.keys(answers).length !== questions.length) {
            setErrorMessage(
                `You must answer all ${questions.length} questions. You have only answered ${Object.keys(answers).length} question(s).`
            );
            // Clear error after 5 seconds
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(""); // Clear any previous errors
        const calculatedScore = questions.reduce((acc, q) => {
            return acc + (answers[q.id] === q.correct_answer ? 1 : 0);
        }, 0);

        // Simulate a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        setScore(calculatedScore);

        // Submit to backend
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const response = await fetch(`${getApiBaseUrl()}/api/v1/assessment/submit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        subject: subject || "Unknown",
                        score: calculatedScore,
                        total_questions: questions.length,
                        answers: answers
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Failed to submit assessment");
                }
            }
        } catch (e) {
            console.error("Failed to submit assessment", e);
            setErrorMessage("Error submitting assessment. Please try again.");
            setTimeout(() => setErrorMessage(""), 5000);
            setIsSubmitting(false);
            return;
        }

        setIsSubmitted(true);
        setIsSubmitting(false);

        // Scroll to top to show results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Utils
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = questions.length > 0 ? ((Object.keys(answers).length) / questions.length) * 100 : 0;
    const subjectName = subject ? (SUBJECT_MAP[subject] || subject) : "Assessment";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091220] flex items-center justify-center text-white">
                <Navbar />
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007BFF]"></div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#091220] flex items-center justify-center text-white flex-col gap-4">
                <Navbar />
                <p>No questions found for this configuration.</p>
                <button onClick={() => router.back()} className="text-[#007BFF] hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF]/30">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 pt-24">

                {/* Error Message Banner */}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-rose-500/10 border border-rose-500 rounded-lg flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <p className="text-sm text-rose-400 font-medium">{errorMessage}</p>
                    </motion.div>
                )}

                {/* Loading Overlay */}
                {isSubmitting && (
                    <div className="fixed inset-0 z-50 bg-[#091220]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <Loader2 className="w-12 h-12 text-[#007BFF] animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Calculating Results...</h2>
                        <p className="text-gray-400">Please wait while we record your performance.</p>
                    </div>
                )}

                {/* Header: Progress & Timer */}
                <div className="sticky top-20 z-40 bg-[#091220]/95 backdrop-blur py-4 border-b border-[#1E293B]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="w-full md:w-auto">
                            <h1 className="text-xl font-bold font-mono text-white mb-2">
                                {subjectName} <span className="text-[#64748B] text-sm">// {difficulty}</span>
                            </h1>
                            {!isSubmitted ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-full md:w-64 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#007BFF] transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-mono text-[#007BFF]">{Math.round(progress)}% Answered</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Score: {score} / {questions.length}</span>
                                </div>
                            )}
                        </div>

                        {!isSubmitted ? (
                            <div className="flex items-center gap-3 bg-[#0F172A] border border-[#1E293B] px-4 py-2 rounded-lg">
                                <Clock className="w-5 h-5 text-[#22D3EE]" />
                                <span className="font-mono text-xl font-bold tracking-widest text-white">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push("/assessment")}
                                className="px-6 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#007BFF] text-[#007BFF] rounded-lg font-bold transition-all"
                            >
                                Start New Assessment
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                    {/* LEFT: Questions List */}
                    <div className="lg:col-span-8 flex flex-col gap-8 pb-32">
                        {questions.map((q, idx) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`rounded-2xl p-6 md:p-8 shadow-xl border transition-colors duration-500
                                    ${isSubmitted
                                        ? answers[q.id] === q.correct_answer
                                            ? "bg-[#064E3B]/20 border-emerald-500/50" // Correct
                                            : "bg-[#450A0A]/20 border-rose-500/50" // Wrong or Unanswered
                                        : "bg-[#0F172A] border-[#1E293B]"
                                    }
                                `}
                            >
                                {/* Question Header */}
                                <div className="flex gap-4">
                                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded-lg
                                        ${isSubmitted
                                            ? answers[q.id] === q.correct_answer
                                                ? "bg-emerald-500 text-white"
                                                : "bg-rose-500 text-white"
                                            : "bg-[#1E293B] text-[#94A3B8]"
                                        }
                                    `}>
                                        {idx + 1}
                                    </div>
                                    <h2 className="text-lg font-medium leading-relaxed text-white pt-0.5">
                                        {q.question}
                                    </h2>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-[#1E293B] my-6"></div>

                                {/* Options Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((option, optIdx) => {
                                        const isSelected = answers[q.id] === option;
                                        const isCorrect = q.correct_answer === option;
                                        const label = String.fromCharCode(65 + optIdx);

                                        // Styles for review mode
                                        let containerClass = "bg-[#091220] border-[#1E293B] text-[#94A3B8]";
                                        let icon = null;

                                        if (isSubmitted) {
                                            if (isCorrect) {
                                                containerClass = "bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                                                icon = <CheckCircle className="w-5 h-5 text-emerald-500 absolute top-4 right-4" />;
                                            } else if (isSelected && !isCorrect) {
                                                containerClass = "bg-rose-500/10 border-rose-500 text-white";
                                                icon = <XCircle className="w-5 h-5 text-rose-500 absolute top-4 right-4" />;
                                            } else {
                                                containerClass = "bg-[#091220]/50 border-[#1E293B] opacity-50";
                                            }
                                        } else {
                                            if (isSelected) {
                                                containerClass = "bg-[#007BFF]/10 border-[#007BFF] shadow-[0_0_15px_rgba(0,123,255,0.15)] text-white";
                                            } else {
                                                containerClass = "bg-[#091220] border-[#1E293B] hover:border-[#007BFF]/50 hover:bg-[#1E293B] hover:text-white";
                                            }
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleOptionSelect(q.id, option)}
                                                disabled={isSubmitted}
                                                className={`relative group p-4 rounded-xl border text-left transition-all duration-200 outline-none flex items-start gap-3 disabled:cursor-default
                                                    ${containerClass}
                                                `}
                                            >
                                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono transition-colors flex-shrink-0 mt-0.5
                                                    ${isSubmitted && isCorrect ? "bg-emerald-500 text-white" :
                                                        isSubmitted && isSelected ? "bg-rose-500 text-white" :
                                                            isSelected ? "bg-[#007BFF] text-white" :
                                                                "bg-[#1E293B] text-[#64748B]"}
                                                `}>
                                                    {label}
                                                </div>
                                                <span className="text-sm leading-relaxed pr-6">
                                                    {option}
                                                </span>
                                                {icon}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation Panel */}
                                {isSubmitted && q.explanation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-6 p-4 rounded-lg bg-[#1E293B]/50 border-l-4 border-[#007BFF]"
                                    >
                                        <h4 className="text-[#007BFF] font-bold text-sm mb-1 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Explanation
                                        </h4>
                                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                                            {q.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}

                        {!isSubmitted && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => handleSubmit(false)}
                                    disabled={Object.keys(answers).length !== questions.length}
                                    className={`w-full md:w-auto px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${Object.keys(answers).length !== questions.length
                                        ? "bg-[#64748B] hover:bg-[#64748B] cursor-not-allowed opacity-60"
                                        : "bg-[#22C55E] hover:bg-[#16A34A] hover:shadow-[#22C55E]/20"
                                        }`}
                                >
                                    <span>
                                        {Object.keys(answers).length !== questions.length
                                            ? `Answer all questions (${Object.keys(answers).length}/${questions.length})`
                                            : "Submit Assessment"}
                                    </span>
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar Info */}
                    <div className="lg:col-span-4 pl-0 lg:pl-8 hidden lg:block">
                        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 sticky top-48">
                            <h3 className="text-sm font-mono text-[#64748B] uppercase tracking-wider mb-4">
                                Assessment Info
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-[#1E293B]/30 rounded-lg border border-[#1E293B]">
                                    <span className="text-sm text-[#94A3B8]">Subject</span>
                                    <span className="font-mono font-bold text-white text-right text-xs max-w-[150px]">{subjectName}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-[#1E293B]/30 rounded-lg border border-[#1E293B]">
                                    <span className="text-sm text-[#94A3B8]">Total Questions</span>
                                    <span className="font-mono font-bold text-white">{questions.length}</span>
                                </div>
                                {!isSubmitted && (
                                    <>
                                        <div className="flex items-center justify-between p-3 bg-[#1E293B]/30 rounded-lg border border-[#1E293B]">
                                            <span className="text-sm text-[#94A3B8]">Answered</span>
                                            <span className="font-mono font-bold text-[#007BFF]">{Object.keys(answers).length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#1E293B]/30 rounded-lg border border-[#1E293B]">
                                            <span className="text-sm text-[#94A3B8]">Remaining</span>
                                            <span className="font-mono font-bold text-[#64748B]">{questions.length - Object.keys(answers).length}</span>
                                        </div>
                                    </>
                                )}
                                {isSubmitted && (
                                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/50">
                                        <span className="text-sm text-emerald-400">Final Score</span>
                                        <span className="font-mono font-bold text-emerald-400 text-lg">{score} / {questions.length}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 p-4 bg-[#1E293B]/30 rounded-lg border border-[#1E293B]">
                                <h4 className="flex items-center gap-2 text-[#F59E0B] text-sm font-bold mb-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Terminal Info
                                </h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    {isSubmitted
                                        ? "Review your answers. Green indicates correct, Red indicates incorrect. Explanations are provided below each question."
                                        : "Assessments are timed. Closing this window may result in lost progress. Submit before the timer reaches zero."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
