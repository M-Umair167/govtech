"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Network,
    Database,
    Code,
    Cpu,
    BookOpen,
    Shield,
    Terminal,
    Loader2,
    ShieldCheck,
    CheckCircle,
    Activity,
    Search,
    Layers,
    Sigma,
    Box,
    Wrench
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getApiBaseUrl } from "@/utils/config";

// Data & Types
type Subject = {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    questionCount: number;
};

const SUBJECTS: Subject[] = [
    { id: "cn", name: "Computer Network", icon: Network, description: "OSI Model, TCP/IP Protocols, and Network Architecture.", questionCount: 150 },
    { id: "db", name: "DataBase", icon: Database, description: "Relational Schemas, SQL Optimization, and ACID Properties.", questionCount: 120 },
    { id: "ds", name: "Data Structures", icon: Layers, description: "Linear & Non-linear structures, Complexity, and Sorting.", questionCount: 200 },
    { id: "disc", name: "Discrete Structure", icon: Sigma, description: "Logic, Set Theory, Graph Theory, and Combinatorics.", questionCount: 80 },
    { id: "fp", name: "Fundamental Programming", icon: Terminal, description: "Logic Building, Control Flow, and Syntax Mastery.", questionCount: 300 },
    { id: "oop", name: "OOP", icon: Box, description: "Encapsulation, Polymorphism, and Design Patterns.", questionCount: 120 },
    { id: "os", name: "Operating System", icon: Cpu, description: "Process Scheduling, Memory Management, and Concurrency.", questionCount: 140 },
    { id: "se", name: "Software Engineering", icon: Wrench, description: "SDLC Models, Agile Methodology, and Quality Assurance.", questionCount: 90 },
    { id: "infosec", name: "Infosec", icon: ShieldCheck, description: "Cryptography, Network Security, and Threat Mitigation.", questionCount: 110 },
];

type Difficulty = "Low" | "Medium" | "Hard" | "Mix";

export default function AssessmentTerminal() {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [mounted, setMounted] = useState(false);
    const [subjectData, setSubjectData] = useState<Record<string, { total: number, breakdown: Record<string, number> }>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const savedDiff = localStorage.getItem("assessment_difficulty") as Difficulty;
        const savedCount = localStorage.getItem("assessment_count");
        if (savedDiff) setDifficulty(savedDiff);
        if (savedCount) setQuestionCount(Number(savedCount));
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("assessment_difficulty", difficulty);
            localStorage.setItem("assessment_count", String(questionCount));
        }
    }, [difficulty, questionCount, mounted]);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await fetch(`${getApiBaseUrl()}/api/v1/assessment/overview`);
                if (res.ok) {
                    const data = await res.json();
                    const mapping: Record<string, { total: number, breakdown: Record<string, number> }> = {};
                    data.forEach((item: any) => {
                        mapping[item.subject] = {
                            total: item.count,
                            breakdown: item.difficulty_counts
                        };
                    });
                    setSubjectData(mapping);
                } else {
                    setError("Unable to sync live statistics. Using cached data.");
                }
            } catch (err) {
                console.error("Failed to fetch assessment stats", err);
                setError("Network error: Unable to load latest stats.");
            }
        };
        fetchOverview();
    }, []);

    const filteredSubjects = SUBJECTS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStart = () => {
        if (!selectedSubject) return;
        setIsStarting(true);
        router.push(`/assessment/test?subject=${selectedSubject}&difficulty=${difficulty}&limit=${questionCount}`);
    };

    const getPoolSize = () => {
        if (!selectedSubject) return 0;
        const data = subjectData[selectedSubject];
        if (!data) return SUBJECTS.find((s) => s.id === selectedSubject)?.questionCount || 0;

        if (difficulty === "Mix") return data.total;
        if (difficulty === "Low") return data.breakdown["Low"] || 0;
        if (difficulty === "Medium") return data.breakdown["Medium"] || 0;
        if (difficulty === "Hard") return data.breakdown["Hard"] || 0;
        return data.total;
    };

    const poolSize = getPoolSize();

    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF] selection:text-white overflow-x-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 pt-28 pb-48 flex flex-col gap-12 relative">
                {error && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-rose-500/10 border border-rose-500/50 text-rose-200 text-xs rounded-full shadow-lg backdrop-blur animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white font-inter mb-2">Architect Your Knowledge Base</h2>
                            <p className="text-[#94A3B8] max-w-xl text-sm leading-relaxed mb-6">
                                Select a specialized module to begin your technical evaluation. Our adaptive engine calibrates questions based on industry standards for engineers in Pakistan and beyond.
                            </p>
                            <div className="relative w-full max-w-md group">
                                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Find a module (e.g. Database, Networking)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007BFF] focus:bg-[#1E293B] transition-all focus:ring-1 focus:ring-[#007BFF]"
                                />
                            </div>
                        </div>
                        <div className="text-right hidden sm:flex items-center gap-2 self-start md:self-end mt-4 md:mt-0">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <p className="text-sm font-mono text-[#007BFF]">{filteredSubjects.length} MODULES ONLINE</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {mounted && filteredSubjects.map((subject, index) => (
                                <motion.div
                                    key={subject.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => setSelectedSubject(subject.id)}
                                        className={`relative w-full group flex flex-col items-start p-6 rounded-xl border transition-all duration-300 backdrop-blur-xl h-full ${selectedSubject === subject.id
                                            ? "bg-[#0F172A] border-[#007BFF] ring-2 ring-[#007BFF]/30 shadow-[0_0_20px_rgba(0,123,255,0.3)]"
                                            : "bg-[#0F172A] border-[#1E293B] hover:border-[#007BFF] hover:shadow-[0_0_15px_rgba(0,123,255,0.1)]"
                                            }`}
                                    >
                                        {selectedSubject === subject.id && (
                                            <div className="absolute top-4 right-4">
                                                <CheckCircle className="w-6 h-6 text-[#007BFF] fill-[#007BFF]/10 drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]" />
                                            </div>
                                        )}

                                        <div className={`p-3 rounded-lg mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,123,255,0.4)] ${selectedSubject === subject.id
                                            ? "bg-[#007BFF]/20 text-[#007BFF] shadow-[0_0_15px_rgba(0,123,255,0.3)]"
                                            : "bg-[#1E293B]/50 text-[#64748B] group-hover:text-[#007BFF] group-hover:bg-[#007BFF]/10"
                                            }`}>
                                            <subject.icon className="w-8 h-8 transition-colors duration-300" />
                                        </div>

                                        <h3 className={`text-lg font-semibold mb-2 transition-colors ${selectedSubject === subject.id ? "text-white" : "text-white group-hover:text-[#007BFF]"
                                            }`}>
                                            {subject.name}
                                        </h3>

                                        <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed line-clamp-2 h-10 text-left">
                                            {subject.description}
                                        </p>

                                        <p className="text-sm text-[#22D3EE] font-mono mt-auto">
                                            {subjectData[subject.id] ? subjectData[subject.id].total : subject.questionCount} Questions Available
                                        </p>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                <section className="sticky bottom-6 z-40">
                    <div className="bg-[#0F172A] border-t-2 border-[#007BFF] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#1E293B]">

                            <div className="p-6 flex flex-col justify-center">
                                <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider mb-3">
                                    Configuration // Mode
                                </label>
                                <div className="grid grid-cols-4 gap-2 bg-[#1E293B] p-1.5 rounded-lg">
                                    {(["Easy", "Medium", "Hard", "Mix"] as Difficulty[]).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level)}
                                            className={`py-2 text-xs font-bold rounded-md transition-all duration-300 ${difficulty === level
                                                ? "bg-[#007BFF] text-white shadow-lg shadow-[#007BFF]/20"
                                                : "text-[#94A3B8] hover:text-white hover:bg-[#334155]"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                                        Configuration // Volume
                                    </label>
                                    <span className="text-lg font-bold text-[#22D3EE] font-mono">{questionCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#007BFF] hover:accent-[#22D3EE] transition-all"
                                />
                                <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-2">
                                    <span>5 Qs</span>
                                    <span>25 Qs</span>
                                    <span>50 Qs</span>
                                </div>
                            </div>

                            <div className="p-6 flex items-center justify-center bg-[#0F172A]">
                                <button
                                    onClick={handleStart}
                                    disabled={!selectedSubject || isStarting}
                                    className="w-full h-full min-h-[60px] bg-[#007BFF] hover:bg-[#0062CC] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-[#007BFF]/40 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-[#007BFF]"
                                >
                                    {isStarting ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            <span className="font-mono">INITIALIZING...</span>
                                        </>
                                    ) : (
                                        <span className="tracking-wide font-bold">Start Assessment</span>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-4 border-t border-[#1E293B] pt-8">
                    <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-lg flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#22D3EE]">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-[#94A3B8]">Umair's Data Pool</h4>
                            <p className="text-lg font-bold text-white font-mono">4,500+ <span className="text-sm font-sans font-normal text-[#64748B]">Verified Questions</span></p>
                        </div>
                    </div>
                    <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-lg flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#007BFF]">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-[#94A3B8]">Hafiz's Engine</h4>
                            <p className="text-lg font-bold text-white font-mono">Real-time <span className="text-sm font-sans font-normal text-[#64748B]">Scoring Enabled</span></p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
