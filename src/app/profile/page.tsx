"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import IdentityCard from "@/components/profile/IdentityCard";
import InfoHub from "@/components/profile/InfoHub";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/utils/config";

const API_URL = `${getApiBaseUrl()}/api/v1/profile`;

// Helper functions using API_BASE_URL
const updateProfile = async (data: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            full_name: data.fullName,
            bio: data.bio,
            location: data.location,
            subjects_interested: data.subjects
        })
    });
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
};

const uploadAvatar = async (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Content-Type is auto-set with boundary by browser
        body: formData
    });

    if (!res.ok) throw new Error("Failed to upload avatar");
    return res.json();
};

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        throw new Error("Unauthorized");
                    }
                    throw new Error("Failed to fetch");
                }
                const data = await res.json();

                // Ensure avatar URL is absolute
                if (data.avatar_url && !data.avatar_url.startsWith("http")) {
                    data.avatar_url = `${getApiBaseUrl()}${data.avatar_url}`;
                }

                setProfileData(data);
            } catch (error: any) {
                if (error.message === "Unauthorized") {
                    router.push("/login");
                } else {
                    console.error("Profile load error:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleSave = async (data: any) => {
        try {
            const updated = await updateProfile(data);
            if (updated.avatar_url && !updated.avatar_url.startsWith("http")) {
                updated.avatar_url = `${process.env.NEXT_PUBLIC_API_URL}${updated.avatar_url}`;
            }
            setProfileData(updated);

            // Trigger custom event for Navbar to refresh avatar
            window.dispatchEvent(new Event("profileUpdated"));

            // Redirect to home after short delay to show success
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpload = async (file: File) => {
        try {
            // Optimistic preview
            const url = URL.createObjectURL(file);
            setProfileData((prev: any) => ({ ...prev, avatarUrl: url }));

            // Actual upload
            const updated = await uploadAvatar(file);
            if (updated.avatar_url && !updated.avatar_url.startsWith("http")) {
                updated.avatar_url = `${process.env.NEXT_PUBLIC_API_URL}${updated.avatar_url}`;
            }
            setProfileData(updated);

            // Trigger custom event for Navbar
            window.dispatchEvent(new Event("profileUpdated"));
        } catch (e) {
            console.error("Upload failed", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091220] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#007BFF] w-12 h-12" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#091220] font-sans selection:bg-[#007BFF] selection:text-white pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12">

                {/* Header */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-poppins">
                        Command <span className="text-[#007BFF]">Center</span>
                    </h1>
                    <p className="text-gray-400">Manage your identity and track your technical journey.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Col: Identity (4 cols) */}
                    <div className="lg:col-span-4 animate-in slide-in-from-left duration-700 delay-100">
                        <IdentityCard
                            avatarUrl={profileData?.avatar_url || profileData?.avatarUrl || ""}
                            title={profileData?.title}
                            testsTaken={profileData?.tests_taken || 0}
                            avgAccuracy={profileData?.avg_accuracy || 0}
                            onUpload={handleUpload}
                        />
                    </div>

                    {/* Right Col: Info Hub (8 cols) */}
                    <div className="lg:col-span-8 animate-in slide-in-from-right duration-700 delay-200">
                        <InfoHub
                            defaultValues={{
                                fullName: profileData?.fullName || profileData?.full_name || "",
                                bio: profileData?.bio || "",
                                location: profileData?.location || "",
                                subjects: profileData?.subjects_interested || profileData?.subjects || [],
                                email: profileData?.email || ""
                            }}
                            onSave={handleSave}
                        />
                    </div>

                </div>

            </div>

            <Footer />
        </main>
    );
}
