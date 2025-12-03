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
  { id: "1", label: "Clients satisfaits", value: 76, suffix: "+", icon: "users", order: 0 },
  { id: "2", label: "Années d'expérience", value: 18, suffix: "+", icon: "calendar", order: 1 },
  { id: "3", label: "Projets Réalisés", value: 1000, suffix: "+", icon: "package", order: 2 },
  { id: "4", label: "Satisfaction", value: 100, suffix: "%", icon: "check-circle", order: 3 },
];

export default function StatsSectionDark() {
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
    <section className="py-20 px-6 bg-neutral-900 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute -left-40 top-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
      <div className="absolute -right-40 bottom-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-pink-500 text-sm font-semibold uppercase tracking-wider">
            Nos Chiffres
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Des résultats qui parlent
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.slice(0, 4).map((stat) => (
            <div key={stat.id} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-600/20 rounded-3xl flex items-center justify-center group-hover:bg-pink-600/30 group-hover:scale-110 transition-all duration-300">
                <svg
                  className="w-10 h-10 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d={getIconPath(stat.icon)} />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <AnimatedCounter
                  end={stat.value}
                  duration={stat.value > 500 ? 2500 : 2000}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-zinc-400 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
