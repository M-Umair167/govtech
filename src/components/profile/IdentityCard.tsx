"use client";

import Image from "next/image";
import { Camera, ShieldCheck, BarChart3, Award } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface IdentityCardProps {
    avatarUrl: string;
    title: string;
    testsTaken: number;
    avgAccuracy: number;
    onUpload: (file: File) => void;
}

export default function IdentityCard({
    avatarUrl,
    title,
    testsTaken,
    avgAccuracy,
    onUpload
}: IdentityCardProps) {
    const [isHovering, setIsHovering] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-8 border border-white/5 sticky top-32"> {/* Fixed/Sticky positioned left panel */}
            <div className="flex flex-col items-center space-y-6">

                {/* Profile Picture Upload Zone */}
                <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Hidden Input */}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                        onChange={handleFileChange}
                    />

                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-[#007BFF] to-blue-600 shadow-[0_0_30px_rgba(0,123,255,0.3)] group-hover:shadow-[0_0_40px_rgba(0,123,255,0.5)] transition-all overflow-hidden relative">
                        <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden relative">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 font-bold text-3xl">
                                    ?
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isHovering ? 1 : 0 }}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center z-10"
                            >
                                <Camera className="text-white w-8 h-8" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h2 className="text-white font-bold text-xl">{title}</h2>
                    <p className="text-[#007BFF] text-sm font-medium uppercase tracking-wide">User Explorer</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 w-full gap-3 pt-6 border-t border-white/10">

                    <div className="flex items-center gap-4 bg-[#091220] p-4 rounded-xl border border-white/5 hover:border-[#007BFF]/30 transition-colors">
                        <div className="p-2 rounded-lg bg-[#007BFF]/20 text-[#007BFF]">
                            <Award size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase">Current Rank</p>
                            <p className="text-white font-bold">{title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#091220] p-4 rounded-xl border border-white/5 hover:border-[#007BFF]/30 transition-colors">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                            <BarChart3 size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase">Tests Taken</p>
                            <p className="text-white font-bold">{testsTaken}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#091220] p-4 rounded-xl border border-white/5 hover:border-[#007BFF]/30 transition-colors">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase">Avg. Accuracy</p>
                            <p className="text-white font-bold">{avgAccuracy}%</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
