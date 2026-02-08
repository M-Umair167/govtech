"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getApiBaseUrl } from "@/utils/config";

type ChartData = {
    date: string;
    accuracy: number;
    fullDate: string;
    subject?: string;
};

export default function AnalyticsChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${getApiBaseUrl()}/api/v1/profile/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const history = await res.json();

                    // Check if history is an array
                    if (!Array.isArray(history)) {
                        console.error("API response is not an array:", history);
                        return;
                    }

                    // Process last 10 items for chart
                    const chartData = history.slice(0, 10).reverse().map((item: any) => ({
                        date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        fullDate: new Date(item.created_at).toLocaleDateString(),
                        accuracy: item.accuracy,
                        subject: item.subject
                    }));
                    setData(chartData);
                } else {
                    console.error("Failed to fetch history:", res.status, res.statusText);
                    const text = await res.text();
                    console.error("Response body:", text);
                }
            } catch (e) {
                console.error("Fetch error:", e);
            }
        };
        fetchHistory();
    }, []);

    if (data.length < 2) return (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 h-[300px] flex items-center justify-center">
            <p className="text-gray-500 text-sm">Take at least 2 tests to see your performance trend.</p>
        </div>
    );

    // SVG Dimensions
    const width = 600;
    const height = 200;
    const padding = 20;

    // Scale functions
    const getX = (index: number) => padding + (index / (data.length - 1)) * (width - padding * 2);
    const getY = (value: number) => height - padding - (value / 100) * (height - padding * 2);

    // Create Path
    const points = data.map((d, i) => `${getX(i)},${getY(d.accuracy)}`).join(" ");
    const linePath = `M ${points}`;
    const areaPath = `M ${getX(0)},${height} L ${points} L ${getX(data.length - 1)},${height} Z`;

    return (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                Performance Trend <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">Last {data.length} Tests</span>
            </h3>

            <div className="relative w-full aspect-[3/1] min-h-[200px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#007BFF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#007BFF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <g key={val}>
                            <line
                                x1={padding}
                                y1={getY(val)}
                                x2={width - padding}
                                y2={getY(val)}
                                stroke="#1E293B"
                                strokeDasharray="4 4"
                            />
                            <text x={0} y={getY(val) + 4} fontSize="10" fill="#64748B" textAnchor="start">{val}%</text>
                        </g>
                    ))}

                    {/* Area Fill */}
                    <motion.path
                        d={areaPath}
                        fill="url(#gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="#007BFF"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Data Points */}
                    {data.map((d, i) => (
                        <g key={i}
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            <circle
                                cx={getX(i)}
                                cy={getY(d.accuracy)}
                                r="5"
                                fill="#0F172A"
                                stroke="#007BFF"
                                strokeWidth="2"
                                className="cursor-pointer hover:scale-150 transition-transform origin-center"
                            />
                            {/* Invisible hit area */}
                            <circle cx={getX(i)} cy={getY(d.accuracy)} r="15" fill="transparent" className="cursor-pointer" />
                        </g>
                    ))}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredPoint !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none z-10"
                        style={{
                            left: `${(hoveredPoint / (data.length - 1)) * 100}%`,
                            top: "10%", // Approximate
                            transform: "translateX(-50%)"
                        }}
                    >
                        <p className="font-bold text-[#007BFF] mb-1">{data[hoveredPoint].subject || "Assessment"}</p>
                        <p>{data[hoveredPoint].accuracy}% Accuracy</p>
                        <p className="text-gray-400 mt-1">{data[hoveredPoint].fullDate}</p>
                    </motion.div>
                )}
            </div>

            {/* Legend / X-Axis Labels */}
            <div className="flex justify-between mt-2 px-2">
                {data.map((d, i) => (
                    <div key={i} className="text-[10px] text-gray-500 text-center" style={{ width: `${100 / data.length}%` }}>
                        {d.date}
                    </div>
                ))}
            </div>
        </div>
    );
}
