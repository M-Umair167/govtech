"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ShieldCheck, FileText, Scale, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function TermsContent() {
    const searchParams = useSearchParams();
    const [showBackButton, setShowBackButton] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fromSignup = searchParams.get("ref") === "signup";

        // Show only if NOT logged in AND came from signup page
        if (!token && fromSignup) {
            setShowBackButton(true);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF]/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 pt-28">

                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl mb-6 shadow-lg shadow-[#007BFF]/10"
                    >
                        <FileText className="w-8 h-8 text-[#007BFF]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4"
                    >
                        Terms & Conditions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#94A3B8] max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Please read these terms carefully before using our platform. By accessing or using the service, you agree to be bound by these terms.
                    </motion.p>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8 bg-[#0F172A]/50 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-8 md:p-12 shadow-2xl"
                >

                    <Section
                        icon={<ShieldCheck className="w-6 h-6 text-[#22D3EE]" />}
                        title="1. Account Registration"
                    >
                        To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
                    </Section>

                    <Section
                        icon={<Scale className="w-6 h-6 text-[#F59E0B]" />}
                        title="2. Acceptable Use"
                    >
                        You agree not to misuse the Service or help anyone else to do so. For example, you must not even try to do any of the following in connection with the Service:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-[#94A3B8]">
                            <li>Probe, scan, or test the vulnerability of any system or network.</li>
                            <li>Breach or otherwise circumvent any security or authentication measures.</li>
                            <li>Access, tamper with, or use non-public areas or parts of the Service, or shared areas of the Service you haven't been invited to.</li>
                            <li>interfere with or disrupt any user, host, or network, for example by sending a virus, overloading, flooding, spamming, or mail-bombing any part of the Services.</li>
                        </ul>
                    </Section>

                    <Section
                        icon={<AlertCircle className="w-6 h-6 text-[#F43F5E]" />}
                        title="3. Termination"
                    >
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                    </Section>

                    <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#64748B]">
                            Last updated: February 7, 2025
                        </p>
                        {showBackButton && (
                            <Link
                                href="/signup"
                                className="flex items-center gap-2 px-6 py-3 bg-[#007BFF] hover:bg-[#0062CC] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-[#007BFF]/30"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Signup
                            </Link>
                        )}
                    </div>

                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

export default function TermsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#091220] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007BFF]"></div>
            </div>
        }>
            <TermsContent />
        </Suspense>
    );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#1E293B] rounded-lg border border-[#334155]">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
            </div>
            <div className="text-[#94A3B8] leading-relaxed pl-1 text-sm md:text-base">
                {children}
            </div>
        </div>
    );
}
