"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

function MarqueeRow({ projects, speed, reverse = false }: { projects: Project[]; speed: number; reverse?: boolean }) {
  // Duplicate projects for seamless loop
  const duplicatedProjects = [...projects, ...projects, ...projects];

  return (
    <div className="relative overflow-hidden py-3">
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedProjects.map((project, index) => (
          <Link
            key={`${project.id}-${index}`}
            href={`/projects/${project.id}`}
            className="group relative flex-shrink-0 w-[300px] md:w-[400px] h-[200px] md:h-[250px] rounded-2xl overflow-hidden"
          >
            <Image
              src={project.image || "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop"}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="inline-block px-3 py-1 bg-pink-600 rounded-full text-white text-xs font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.category}
              </span>
              <h3 className="text-white text-lg md:text-xl font-bold leading-tight">
                {project.title}
              </h3>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-pink-500 rounded-2xl transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative h-[85vh] min-h-[600px] bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </section>
    );
  }

  // Create different arrangements for rows
  const row1Projects = [...projects];
  const row2Projects = [...projects].reverse();
  const row3Projects = [...projects].sort(() => Math.random() - 0.5);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-neutral-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-neutral-900 to-black/50" />

      {/* Animated pink glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" />

      {/* Header */}
      <div className="relative z-20 pt-12 pb-8 px-8 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-pink-500 text-sm font-medium uppercase tracking-widest mb-2 block">Portfolio</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Nos Projets
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-pink-600 transition-all duration-300 border border-white/20 hover:border-pink-600"
          >
            <span>Voir tous</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="relative z-10 flex flex-col justify-center h-[calc(100%-180px)]">
        {/* Row 1 - Left to Right */}
        <MarqueeRow projects={row1Projects} speed={40} />

        {/* Row 2 - Right to Left */}
        <MarqueeRow projects={row2Projects} speed={35} reverse />

        {/* Row 3 - Left to Right (slower) */}
        <MarqueeRow projects={row3Projects} speed={45} />
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

      {/* Top fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />

      {/* Side fade gradients */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

      {/* CSS for marquee animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee {
          animation: marquee linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse linear infinite;
        }

        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
