"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getApiBaseUrl } from "@/utils/config";

import { useEffect, useState } from "react";

export default function HeroSection() {
    const [user, setUser] = useState<{ full_name: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${getApiBaseUrl()}/api/v1/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => setUser(data))
                .catch(() => { });
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Image/Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Tech Background"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                {/* Gradient Overlay for Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B16] via-[#060B16]/80 to-[#060B16]/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl px-6 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
                {user && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007BFF]/10 border border-[#007BFF]/30 text-[#007BFF] text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                        <Sparkles size={14} /> Welcome back, {user.full_name.split(' ')[0]}
                    </div>
                )}



                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-poppins leading-tight drop-shadow-lg">
                    Precision Testing for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#00A3FF]">
                        Future Engineers
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-inter font-light leading-relaxed">
                    Master OOP, DSA, and Computer Networks with our curated MCQ engine.
                    Designed to challenge your logic and elevate your technical depth.
                </p>

                <div className="pt-4">
                    <Link
                        href="/assessment" // Redirect to the Assessment / Service page
                        className="inline-flex h-14 px-10 rounded-full bg-[#007BFF] text-white text-lg font-semibold items-center gap-2 hover:bg-blue-600 transition-all shadow-[0_4px_15px_rgba(0,123,255,0.4)] hover:shadow-[0_6px_20px_rgba(0,123,255,0.6)] hover:-translate-y-1"
                    >
                        {user ? "Continue Assessment" : "Let's Start"} <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
