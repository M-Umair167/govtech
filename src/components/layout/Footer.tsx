"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Github, Mail, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#060B16] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Col 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {/* Use logo.png */}
                            <div className="relative w-8 h-8">
                                <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white font-inter">
                                Gov<span className="text-[#007BFF]">Tech</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Innovate. Serve. Secure. <br />
                            Building the next generation of digital government solutions through precision testing and education.
                        </p>
                    </div>

                    {/* Col 2: Subjects */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Subjects</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "OOP", href: "/assessment?subject=oop" },
                                { label: "Data Structures", href: "/assessment?subject=ds" },
                                { label: "Networking", href: "/assessment?subject=cn" },
                                { label: "Discrete Structures", href: "/assessment?subject=disc" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Support */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Support</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Contact Us", href: "/contact" },
                                { name: "FAQ", href: "/faq" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms of Service", href: "/terms" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Connect */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#007BFF] transition-all">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#007BFF] transition-all">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#007BFF] transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#007BFF] transition-all">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; 2024 GovTech Portal. Built for Excellence.
                    </p>
                    <div className="flex gap-6">
                        {/* Optional extra footer links */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
