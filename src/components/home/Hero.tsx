"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900 overflow-hidden font-sans">
            {/* Navbar */}
            <nav className="flex items-center justify-between p-6 md:px-12 z-20">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="GovTech Logo"
                        width={40}
                        height={40}
                        className="h-10 w-auto object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Gov<span className="text-[#00A3FF]">Tech</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-600 hover:text-[#00A3FF] transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-full bg-[#00A3FF] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#0077FF] shadow-lg shadow-blue-500/20"
                    >
                        Sign up
                    </Link>
                </div>
            </nav >

            {/* Hero Section */}
            < main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 relative z-10 max-w-7xl mx-auto gap-12 lg:gap-20" >
                {/* Background decorative elements */}
                < div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] -z-10" ></div >

                {/* Hero Logo (Left on LG) */}
                < div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-[400px] lg:h-[400px] animate-in zoom-in duration-700" >
                    <Image
                        src="/logo.png"
                        alt="GovTech Large Logo"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div >

                {/* Hero Text (Right on LG) */}
                < div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-2xl animate-in slide-in-from-right duration-700" >
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-tight">
                            Gov<span className="text-[#00A3FF]">Tech</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00A3FF] to-[#0077FF] mt-2">
                            Innovate. Serve. Secure.
                        </h2>
                    </div>

                    <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
                        Empowering government agencies with next-generation digital solutions.
                        Secure, efficient, and built for the people.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center lg:justify-start">
                        <Link
                            href="/signup"
                            className="h-12 px-8 rounded-full bg-[#00A3FF] text-white font-bold flex items-center gap-2 hover:bg-[#0077FF] transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            Get Started <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/login"
                            className="h-12 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-2 hover:bg-slate-50 hover:border-blue-200 hover:text-[#00A3FF] transition-all shadow-sm"
                        >
                            Access Portal
                        </Link>
                    </div>
                </div >
            </main >

            <footer className="p-8 text-center text-sm text-gray-500 relative z-10 w-full">
                &copy; 2024 GovTech Solutions. All rights reserved.
            </footer>
        </div>
    );
}
