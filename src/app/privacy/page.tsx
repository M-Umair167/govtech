"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Lock, Mail, Server, Eye, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF]/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 pt-28">

                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl mb-6 shadow-lg shadow-[#10B981]/10"
                    >
                        <Lock className="w-8 h-8 text-[#10B981]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4"
                    >
                        Privacy Policy
                    </motion.h1>
                    <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg leading-relaxed">
                        Your data security is our priority. Learn how GovTech Portal protects your information.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 bg-[#0F172A]/50 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-8 md:p-12 shadow-2xl">

                    <Section
                        icon={<Database className="w-6 h-6 text-[#007BFF]" />}
                        title="1. Information We Collect"
                    >
                        We collect information you provide directly to us, such as when you create an account, update your profile, or participate in assessments. This may include:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-[#94A3B8]">
                            <li><strong>Account Information:</strong> Name, email address, password hash, and professional title.</li>
                            <li><strong>Assessment Data:</strong> Scores, accuracy metrics, time taken, and specific answers submitted during tests.</li>
                            <li><strong>Profile Details:</strong> Bio, location, avatar image, and subjects of interest.</li>
                        </ul>
                    </Section>

                    <Section
                        icon={<Server className="w-6 h-6 text-[#8B5CF6]" />}
                        title="2. How We Use Your Information"
                    >
                        We use the information we collect to:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-[#94A3B8]">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Calculate your performance metrics and generate personalized analytics.</li>
                            <li>Process your requests and send you related information, including confirmations and technical notices.</li>
                            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities on the platform.</li>
                        </ul>
                    </Section>

                    <Section
                        icon={<Eye className="w-6 h-6 text-[#F59E0B]" />}
                        title="3. Data Sharing and Disclosure"
                    >
                        We do <strong>not</strong> sell your personal data. We may share information only in the following circumstances:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-[#94A3B8]">
                            <li>With your consent or at your direction (e.g., if you choose to make your profile public).</li>
                            <li>To comply with any applicable law, regulation, legal process, or governmental request.</li>
                            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
                        </ul>
                    </Section>

                    <Section
                        icon={<Mail className="w-6 h-6 text-[#EC4899]" />}
                        title="4. Communication Preferences"
                    >
                        You may opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
                    </Section>

                    <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#64748B]">
                            Last updated: February 7, 2025
                        </p>
                        <div className="flex gap-4">
                            <Link href="/terms" className="text-sm text-[#007BFF] hover:underline">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="text-sm text-[#007BFF] hover:underline">
                                Contact Us
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#1E293B] rounded-lg border border-[#334155]">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
            </div>
            <div className="text-[#94A3B8] leading-relaxed pl-1 text-sm md:text-base">
                {children}
            </div>
        </motion.div>
    );
}
