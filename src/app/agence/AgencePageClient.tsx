"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CTASection from "@/components/CTASection";

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface Settings {
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  map_url?: string;
}

export default function AgencePageClient() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    // Fetch stats from API
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data.slice(0, 4));
        }
      })
      .catch(console.error);

    // Fetch services from API
    fetch("/api/public/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data.slice(0, 4));
        }
      })
      .catch(console.error);

    // Fetch settings for map
    fetch("/api/public/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-zinc-700">Agence</span>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div>
              <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
                Agence Créative & Digitale
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6 leading-tight">
                NEWIN AGENCY™
              </h1>
              <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
                Une agence de communication créative & digitale basée à <span className="text-pink-600 font-medium">Bir Khadem</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors"
                >
                  Voir nos projets
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-full border border-zinc-200 hover:border-pink-300 transition-colors"
                >
                  Contactez-nous
                </Link>
              </div>
            </div>

            {/* Right - Logo Card */}
            <div className="relative">
              <div className="bg-white rounded-[32px] p-8 md:p-12 border border-zinc-200 shadow-xl">
                <Image
                  src="/logo_newin.png"
                  alt="Newin Agency"
                  width={400}
                  height={133}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-zinc-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <p className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-2">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-zinc-500 text-sm uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-900 rounded-[32px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Logo */}
            <img
              src="/newin_w.png"
              alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] opacity-10 pointer-events-none"
            />

            <div className="relative z-10 max-w-3xl">
              <span className="text-pink-500 text-sm font-semibold uppercase tracking-wider">
                Qui sommes-nous
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-8">
                Notre expertise à votre service
              </h2>

              <div className="space-y-6">
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Notre équipe de talentueux graphistes & experts en communication digitale partage une passion commune pour l&apos;esthétique & l&apos;innovation.
                </p>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  Notre expertise s&apos;étend à tous les domaines du graphisme, de la conception de logos et d&apos;identités visuelles percutantes à la réalisation de supports de communication imprimés et numériques.
                </p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  Nous sommes également spécialisés dans la création de stratégies digitales percutantes pour propulser votre marque, en intégrant les réseaux sociaux et les campagnes publicitaires.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
                Nos Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-3 mb-4">
                Ce que nous faisons
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Branding, Stratégie, Social Media, Site web, Graphisme, Création de contenu, Mailing - nous transformons vos idées en réalité.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href="/services"
                  className="group bg-white rounded-[24px] overflow-hidden border border-zinc-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-neutral-900 group-hover:text-pink-600 transition-colors">
                      {service.title.replace('\n', ' ')}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Link to Services */}
            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors"
              >
                Voir tous nos services
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Card */}
            <div className="bg-neutral-900 rounded-[32px] p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-8">
                Nous trouver
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Adresse</h3>
                    <p className="text-zinc-400 text-sm">{settings.contact_address || "Bir Khadem, Algérie"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-zinc-400 text-sm">{settings.contact_email || "contact@newin.dz"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Téléphone</h3>
                    <p className="text-zinc-400 text-sm">{settings.contact_phone || "0770 25 77 85"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <Link
                href="/contact"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors"
              >
                Nous contacter
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 bg-neutral-900 rounded-[32px] p-4 h-[400px] lg:h-auto overflow-hidden">
              <iframe
                src={settings.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.9876543210!2d3.0450000!3d36.7100000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBir+Khadem%2C+Algiers%2C+Algeria!5e0!3m2!1sen!2s!4v1635789456789!5m2!1sen!2s"}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "24px", minHeight: "350px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-[32px] p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Notre équipe
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Des talents passionnés qui donnent vie à vos projets et transforment vos idées en réalité.
              </p>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-semibold rounded-full hover:bg-zinc-100 transition-colors"
              >
                Rencontrer l&apos;équipe
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
