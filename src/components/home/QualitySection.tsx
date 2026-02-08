"use client";

import Image from "next/image";
import { CheckCircle2, Layers, Crosshair } from "lucide-react";

export default function QualitySection() {
    return (
        <section className="py-24 bg-[#060B16] relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Content */}
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-white font-poppins">
                                Standardized Testing, <br />
                                <span className="text-[#007BFF]">Refined.</span>
                            </h2>
                            <p className="text-lg text-gray-400 font-inter leading-relaxed">
                                Our platform doesn't just provide questions; it provides a structured journey.
                                Every test is categorized into <span className="text-white font-semibold">Low</span>, <span className="text-white font-semibold">Medium</span>, and <span className="text-white font-semibold">Hard</span> difficulty levels.
                                This allows learners to build a solid foundation before tackling architectural-level challenges.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-[#007BFF]/10 text-[#007BFF]">
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">Subject Focused</h3>
                                    <p className="text-gray-500">Deep dives into Discrete Structures and Networking.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-[#007BFF]/10 text-[#007BFF]">
                                    <Crosshair size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">Industry Aligned</h3>
                                    <p className="text-gray-500">Questions designed to mimic top-tier technical interviews.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image/Visual */}
                    <div className="relative h-[500px] w-full bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-right duration-700 group">
                        {/* Placeholder for the "Sleek UI Mockup" or Dashboard */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[url('/grid-pattern.svg')] opacity-50">
                            {/* Create a mock UI using CSS/Divs if no image is present */}

                            <div className="w-full max-w-sm bg-[#0B1222] rounded-xl border border-white/10 shadow-lg p-6 space-y-4 transform group-hover:scale-105 transition-transform duration-500">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="h-3 w-24 bg-gray-700 rounded-full"></div>
                                    <div className="h-3 w-8 bg-green-500/20 rounded-full"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-gray-800 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-gray-800 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-gray-800 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="h-10 bg-[#007BFF]/20 border border-[#007BFF]/50 rounded text-center flex items-center justify-center text-[#007BFF] text-xs font-mono">Option A</div>
                                    <div className="h-10 bg-gray-800 rounded border border-white/5"></div>
                                    <div className="h-10 bg-gray-800 rounded border border-white/5"></div>
                                    <div className="h-10 bg-gray-800 rounded border border-white/5"></div>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#007BFF] rounded-full blur-[100px] -z-10 opacity-20"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
