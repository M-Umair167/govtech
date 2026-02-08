"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        question: "How are the assessment scores calculated?",
        answer: "Scores are calculated based on the number of correct answers. Each question carries equal weight. Your accuracy is determined by the percentage of correct answers against the total questions attempted. We also track 'speed' as a secondary metric for tie-breaking in leaderboards."
    },
    {
        question: "Can I retake an assessment?",
        answer: "Yes, you can retake assessments as many times as you like. We believe in continuous improvement. Your history will show all attempts, allowing you to track your progress over time."
    },
    {
        question: "Is this platform free to use?",
        answer: "Currently, the GovTech Portal is free for all candidates preparing for technical evaluations. We aim to democratize access to quality engineering resources."
    },
    {
        question: "What subjects are covered?",
        answer: "We cover core computer science disciplines including Object Oriented Programming (OOP), Data Structures, Computer Networks, Database Systems, Operating Systems, and Software Engineering."
    },
    {
        question: "How do I edit my profile information?",
        answer: "You can update your personal details, avatar, and bio from the 'Profile' page. Click on your avatar in the top right corner and select 'Profile' to access the editing tools."
    },
    {
        question: "Is my data shared with recruiters?",
        answer: "Your assessment results are private by default. In the future, we may introduce features allowing you to share your verified profile with potential employers or government agencies."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF]/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 pt-28">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl mb-6 shadow-lg shadow-[#007BFF]/10"
                    >
                        <HelpCircle className="w-8 h-8 text-[#007BFF]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg leading-relaxed">
                        Everything you need to know about the GovTech Assessment Portal.
                    </p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <FAQItem key={idx} question={faq.question} answer={faq.answer} index={idx} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border transition-all duration-300 overflow-hidden
                ${isOpen ? "bg-[#0F172A]/80 border-[#007BFF]/50 shadow-lg" : "bg-[#0F172A]/40 border-[#1E293B] hover:border-[#334155]"}
            `}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className={`font-bold text-lg transition-colors ${isOpen ? "text-[#007BFF]" : "text-white"}`}>
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#007BFF]" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-[#64748B]" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 text-[#94A3B8] leading-relaxed border-t border-[#1E293B]/50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
