"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5.83331 5.8335H14.1666V14.1668" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.83331 14.1668L14.1666 5.8335" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-12px)] xl:w-[calc(25%-12px)] h-80 sm:h-96 relative bg-zinc-900 hover:bg-pink-800 rounded-[24px] sm:rounded-[32px] overflow-hidden group cursor-pointer transition-all duration-500">
      {/* Title */}
      <div className="absolute top-6 left-6 right-6">
        <h3 className="text-pink-500 group-hover:text-white text-2xl md:text-3xl font-bold leading-tight whitespace-pre-line transition-colors duration-300">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <div className="absolute top-24 left-6 right-6">
        <p className="text-white/80 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Image */}
      <div className="absolute bottom-6 left-6 right-6 h-48 rounded-3xl overflow-hidden">
        <img
          src={service.image}
          alt={service.title.replace('\n', ' ')}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Arrow Button - Cool animation: scale + rotate + color change */}
      <div
        className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 bg-transparent flex justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.4] group-hover:rotate-[360deg] group-hover:border-transparent group-hover:bg-white group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)]"
      >
        <ArrowIcon className="text-white group-hover:text-black transition-colors duration-300" />
      </div>
    </div>
  );
}

export default function ExpertiseSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="px-5 py-6">
      <div className="relative bg-neutral-900 rounded-[48px] px-6 md:px-12 lg:px-24 py-12 md:py-20 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <img
            src="/newin_w.png"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-auto"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-12 md:gap-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Nos Services
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Branding, Stratégie, Social Media, Site web, Graphisme, Création de contenu, Mailing - nous transformons vos idées en réalité.
            </p>
          </div>

          {/* Services Grid - Adaptive */}
          <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
            {loading ? (
              <div className="flex justify-center py-16 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
              </div>
            ) : services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
