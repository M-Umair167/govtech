"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left Side - Visuals (White Background) */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex bg-white text-slate-900 border-r border-slate-200">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-lg px-8">
                    <Image
                        src="/logo.png"
                        alt="GovTech Logo"
                        width={300}
                        height={300}
                        className="w-40 md:w-64 h-auto object-contain drop-shadow-xl"
                        priority
                    />

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                            GovTech
                        </h1>
                        <p className="text-lg md:text-xl font-medium text-blue-600 tracking-wide">
                            Innovate. Serve. Secure.
                        </p>
                    </div>

                    <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed">
                        Join GovTech and be part of building tomorrow's digital government solutions.
                    </p>
                </div>

                <div className="absolute bottom-8 text-xs text-slate-400 z-10">
                    © 2024 GovTech Portal. All rights reserved.
                </div>
            </div>

            {/* Right Side - Forms (Dark Background) */}
            {/* We add the 'dark' class here to force Shadcn/Tailwind components inside to use dark mode variables (white text, dark inputs) */}
            <div className="flex w-full flex-col justify-center items-center lg:w-1/2 relative bg-[#0B1222] text-white dark">

                {/* Mobile Logo Header */}
                <div className="lg:hidden absolute top-8 left-0 w-full flex flex-col items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="GovTech Logo"
                        width={60}
                        height={60}
                        className="w-16 h-16 object-contain"
                    />
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        GovTech
                    </h1>
                </div>

                <div className="w-full max-w-[420px] px-8 py-12 mt-16 lg:mt-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
