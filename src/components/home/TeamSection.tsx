"use client";

import Image from "next/image";
import { Linkedin, Github, Globe, Code2, Database, Server, Terminal, Cpu, Layers } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

function TeamCard({
    name,
    role,
    description,
    image,
    initials,
    techStack,
    delay,
}: {
    name: string;
    role: string;
    description: string;
    image: string;
    initials: string;
    techStack: string[];
    delay: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: delay < 0.2 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative group bg-[#111827]/80 backdrop-blur-md rounded-2xl p-8 border border-[#007BFF]/20 hover:border-[#007BFF]/60 transition-colors duration-300 w-full max-w-lg mx-auto"
        >
            {/* Glow Follow Effect - Simplified */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(0,123,255,0.15),transparent_50%)] z-0" />

            <div className="relative z-10 flex flex-col items-center text-center transform translate-z-10">
                {/* Profile Image popping out */}
                <div className="relative w-32 h-32 -mt-16 mb-6 rounded-full p-1 bg-gradient-to-br from-[#007BFF] to-blue-400 shadow-[0_0_20px_rgba(0,123,255,0.4)]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 relative">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                        {/* Fallback if image fails (using opacity to hide if loaded) */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white font-bold text-2xl -z-10">
                            {initials}
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00A3FF] transition-colors">{name}</h3>
                <p className="text-[#007BFF] font-medium text-sm tracking-wide uppercase mb-6">{role}</p>

                <p className="text-gray-300 leading-relaxed mb-8 min-h-[80px]">
                    {description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-[#007BFF]/10 text-blue-200 text-xs font-semibold border border-[#007BFF]/20 group-hover:bg-[#007BFF]/20 transition-all">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Socials */}
                <div className="flex gap-5 pt-4 border-t border-white/10 w-full justify-center">
                    <a href="#" className="text-gray-400 hover:text-[#007BFF] hover:scale-110 transition-all"><Linkedin size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-[#007BFF] hover:scale-110 transition-all"><Github size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-[#007BFF] hover:scale-110 transition-all"><Globe size={20} /></a>
                </div>
            </div>
        </motion.div>
    );
}

export default function TeamSection() {
    return (
        <section className="py-32 bg-[#0B1222] overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#007BFF]/10 rounded-full blur-[128px] -translate-y-1/2 -ml-20" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#007BFF]/5 rounded-full blur-[128px]" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                <div className="text-center mb-24 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-poppins">
                        Behind the <span className="text-[#007BFF]">Platform</span>
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto font-inter text-lg leading-relaxed">
                        GovTech isn't just a website; it's a partnership of technical precision and data integrity.
                        While <span className="text-white font-semibold">Hafiz Umair</span> engineered the seamless user experience and robust system architecture,
                        <span className="text-white font-semibold">Umair Baloch</span> built the foundation of knowledge, curating and managing the vast database of assessments that challenge and grow your skills.
                        Together, we’ve created Pakistan’s premier destination for mastering Computer Science.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">

                    {/* Connection Line (Desktop Only) */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-[2px] bg-gradient-to-r from-transparent via-[#007BFF]/50 to-transparent z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#007BFF]/10 rounded-full blur-lg" />
                    </div>

                    <TeamCard
                        name="Hafiz Umair"
                        role="Full Stack Developer"
                        image="/team/hafiz.png"
                        initials="HU"
                        description="The architect of the GovTech engine. Hafiz transformed a complex vision into a high-performance reality, coding the entire frontend and backend infrastructure."
                        techStack={["React", "Node.js", "Tailwind", "Next.js"]}
                        delay={0}
                    />

                    <TeamCard
                        name="Umair Baloch"
                        role="Data & Database Engineer"
                        image="/team/umair.png"
                        initials="UB"
                        description="The brain behind the data. Umair meticulously curated thousands of MCQs and engineered the database architecture to ensure every test is accurate and fast."
                        techStack={["PostgreSQL", "MongoDB", "Python", "Data Structure"]}
                        delay={0.2}
                    />

                </div>
            </div>
        </section>
    );
}
