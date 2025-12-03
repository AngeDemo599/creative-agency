"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string | null;
  order: number;
}

// Icon paths mapping (same as in the admin panel)
const iconPaths: Record<string, string> = {
  "users": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  "calendar": "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  "package": "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "award": "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  "trending-up": "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  "heart": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  "target": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  "zap": "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  "globe": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  "briefcase": "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
  "clock": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  "shield": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "thumbs-up": "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
};

// Get icon path by ID
const getIconPath = (iconId: string | null): string => {
  if (!iconId) return iconPaths["users"];
  return iconPaths[iconId] || iconPaths["users"];
};

// Default fallback stats if API fails
const defaultStats: Stat[] = [
  { id: "1", label: "Clients satisfaits", value: 76, suffix: "", icon: "users", order: 0 },
  { id: "2", label: "Années d'expérience", value: 18, suffix: "+", icon: "calendar", order: 1 },
  { id: "3", label: "Packaging créés", value: 1000, suffix: "+", icon: "package", order: 2 },
  { id: "4", label: "Territoire National", value: 100, suffix: "%", icon: "map-pin", order: 3 },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full max-w-4xl px-4 mt-0 flex flex-wrap justify-center items-start gap-8 md:gap-12">
      {stats.slice(0, 4).map((stat) => (
        <div key={stat.id} className="flex-1 min-w-[140px] max-w-[200px] flex flex-col items-center">
          <div className="w-14 h-14 mb-3 bg-pink-400/20 rounded-2xl flex justify-center items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#980468"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={getIconPath(stat.icon)} />
            </svg>
          </div>
          <span className="text-center text-neutral-900 text-4xl font-extrabold leading-10 mb-1">
            <AnimatedCounter
              end={stat.value}
              duration={stat.value > 500 ? 2500 : 2000}
              suffix={stat.suffix}
            />
          </span>
          <span className="text-center text-gray-500 text-xs font-medium uppercase leading-4 tracking-wide">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
