"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import StatsSectionDark from "@/components/StatsSectionDark";

interface Client {
  id: string;
  name: string;
  logo: string;
  invert: boolean;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-zinc-700">Nos Clients</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Nos Clients
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
              Ils nous font confiance
            </h1>
            <p className="text-zinc-600 text-lg">
              Nous sommes fiers de collaborer avec des marques innovantes du monde entier.
            </p>
          </div>
        </div>
      </section>

      {/* Logos Section - Simple Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 md:gap-16 items-center justify-items-center">
              {clients.map((client) => (
                <div key={client.id} className="group cursor-pointer">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`h-10 md:h-12 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                      client.invert ? "invert hover:invert-0" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section with Icons and Animation */}
      <StatsSectionDark />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
