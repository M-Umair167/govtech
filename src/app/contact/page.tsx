"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, User, AtSign, FileText, Loader2, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        setIsSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset success message after 5 seconds
        setTimeout(() => setIsSent(false), 5000);
    };

    return (
        <div className="min-h-screen bg-[#091220] text-white font-sans selection:bg-[#007BFF] selection:text-white overflow-x-hidden flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 pt-32 pb-24 relative z-10 w-full">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 opacity-20 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-[600px] h-[600px] bg-[#007BFF] rounded-full blur-[120px]" />
                </div>
                <div className="absolute bottom-0 left-0 -z-10 opacity-10 transform -translate-x-1/3 translate-y-1/3">
                    <div className="w-[800px] h-[800px] bg-purple-600 rounded-full blur-[150px]" />
                </div>

                {/* Hero / Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[#007BFF] font-mono text-sm tracking-widest uppercase mb-4 inline-block bg-[#007BFF]/10 px-3 py-1 rounded-full border border-[#007BFF]/20">
                        Support & Inquiry
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-inter tracking-tight">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-blue-400">Touch</span>
                    </h1>
                    <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg leading-relaxed">
                        Have questions about the assessment platform? Need technical support?
                        We're here to help you succeed in your testing journey.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#1E293B] p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#007BFF] to-transparent opacity-50" />

                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-[#007BFF]" />
                            Send us a Message
                        </h2>

                        {isSent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-emerald-200/80">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="mt-8 text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#94A3B8] ml-1">Your Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:bg-[#1E293B] transition-all focus:ring-1 focus:ring-[#007BFF]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#94A3B8] ml-1">Email Address</label>
                                        <div className="relative group">
                                            <AtSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:bg-[#1E293B] transition-all focus:ring-1 focus:ring-[#007BFF]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#94A3B8] ml-1">Subject</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:bg-[#1E293B] transition-all focus:ring-1 focus:ring-[#007BFF]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#94A3B8] ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more about your inquiry..."
                                        className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:bg-[#1E293B] transition-all focus:ring-1 focus:ring-[#007BFF] resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-[#007BFF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-[#007BFF]/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                            {/* Card 1: Email */}
                            <div className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl flex items-start gap-5 hover:border-[#007BFF]/50 transition-colors group">
                                <div className="w-12 h-12 bg-[#1E293B] rounded-xl flex items-center justify-center text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white transition-all shadow-lg group-hover:shadow-[#007BFF]/20">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Email Us</h4>
                                    <p className="text-[#94A3B8] text-sm mb-2">Our support team is available 24/7.</p>
                                    <a href="mailto:support@govtech.com" className="text-[#007BFF] font-medium hover:underline">support@govtech.com</a>
                                </div>
                            </div>

                            {/* Card 2: Phone */}
                            <div className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl flex items-start gap-5 hover:border-[#007BFF]/50 transition-colors group">
                                <div className="w-12 h-12 bg-[#1E293B] rounded-xl flex items-center justify-center text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white transition-all shadow-lg group-hover:shadow-[#007BFF]/20">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Call Us</h4>
                                    <p className="text-[#94A3B8] text-sm mb-2">Mon-Fri from 9am to 6pm.</p>
                                    <a href="tel:+923001234567" className="text-[#007BFF] font-medium hover:underline">+92 (300) 123-4567</a>
                                </div>
                            </div>

                            {/* Card 3: Location */}
                            <div className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl flex items-start gap-5 hover:border-[#007BFF]/50 transition-colors group">
                                <div className="w-12 h-12 bg-[#1E293B] rounded-xl flex items-center justify-center text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white transition-all shadow-lg group-hover:shadow-[#007BFF]/20">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Visit Us</h4>
                                    <p className="text-[#94A3B8] text-sm mb-2">Come say hello at our HQ.</p>
                                    <p className="text-white text-sm">GovTech Tower, Blue Area,<br />Islamabad, Pakistan</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="w-full h-64 bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden relative group">
                            {/* Stylized Map Background (using CSS patterns or an image if available) */}
                            <div className="absolute inset-0 bg-[#0F172A] opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin className="w-10 h-10 text-[#007BFF] drop-shadow-lg animate-bounce" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-center text-gray-300">
                                Map View is currently loading...
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
