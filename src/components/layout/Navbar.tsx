"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { getApiBaseUrl } from "@/utils/config";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const router = useRouter();

    const fetchUserAvatar = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            setAvatarUrl(null);
            return;
        }
        try {
            const res = await fetch(`${getApiBaseUrl()}/api/v1/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.avatar_url) {
                    const url = data.avatar_url.startsWith("http") ? data.avatar_url : `${getApiBaseUrl()}${data.avatar_url}`;
                    setAvatarUrl(url);
                }
            } else if (res.status === 401) {
                // Invalid token
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setAvatarUrl(null);
            }
        } catch (e) {
            console.error("Failed to fetch avatar", e);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        if (token) fetchUserAvatar();

        const handleProfileUpdate = () => {
            fetchUserAvatar();
        };
        window.addEventListener("profileUpdated", handleProfileUpdate);
        return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setAvatarUrl(null);
        router.push("/login"); // Or reload to clear state effectively
        window.location.reload();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#060B16]/80 backdrop-blur-md border-b border-white/10 transition-all">
            <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/logo.png" alt="GovTech Logo" width={40} height={40} className="object-contain w-auto h-10" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-inter">
                        Gov<span className="text-[#007BFF]">Tech</span>
                    </span>
                </div>

                {/* Right Side: Links & Auth */}
                <div className="flex items-center gap-8">
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-300 hover:text-[#007BFF] transition-colors text-base font-medium hover:underline hover:decoration-[#007BFF] hover:decoration-2 hover:underline-offset-4">
                            Home
                        </Link>
                        <Link href="/assessment" className="text-gray-300 hover:text-[#007BFF] transition-colors text-base font-medium hover:underline hover:decoration-[#007BFF] hover:decoration-2 hover:underline-offset-4">
                            Service
                        </Link>
                        <Link href="/contact" className="text-gray-300 hover:text-[#007BFF] transition-colors text-base font-medium hover:underline hover:decoration-[#007BFF] hover:decoration-2 hover:underline-offset-4">
                            Contact Us
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007BFF] to-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-white/10 hover:ring-[#007BFF]/50 transition-all overflow-hidden p-0.5"
                                >
                                    {avatarUrl ? (
                                        <Image
                                            src={avatarUrl}
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="w-full h-full rounded-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </button>

                                {/* Dropdown */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-gray-700 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in duration-200">
                                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                                            <User size={16} className="mr-2" /> My Profile
                                        </Link>
                                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                                            <LayoutDashboard size={16} className="mr-2" /> Dashboard
                                        </Link>
                                        <div className="h-px bg-gray-700 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        >
                                            <LogOut size={16} className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex h-10 px-6 rounded-md bg-[#007BFF] text-white text-sm font-semibold hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(0,123,255,0.3)] items-center"
                            >
                                Log In
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full min-h-screen bg-[#060B16] border-t border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 shadow-xl z-40">
                    <Link href="/" className="text-gray-300 hover:text-[#007BFF] py-3 text-lg font-medium border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/assessment" className="text-gray-300 hover:text-[#007BFF] py-3 text-lg font-medium border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                        Service
                    </Link>
                    <Link href="/dashboard" className="text-gray-300 hover:text-[#007BFF] py-3 text-lg font-medium border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                    </Link>
                    <Link href="/contact" className="text-gray-300 hover:text-[#007BFF] py-3 text-lg font-medium border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact Us
                    </Link>

                    {isLoggedIn && (
                        <Link href="/profile" className="text-gray-300 hover:text-[#007BFF] py-3 text-lg font-medium border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                            My Profile
                        </Link>
                    )}

                    {!isLoggedIn ? (
                        <Link
                            href="/login"
                            className="text-center h-12 rounded-xl bg-[#007BFF] text-white font-bold flex items-center justify-center mt-6 shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Log In
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-center h-12 rounded-xl bg-red-500/20 text-red-500 font-bold flex items-center justify-center mt-6 border border-red-500/30"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
