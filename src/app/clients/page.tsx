"use client";

import { useEffect, useState } from "react";
import CTASection from "@/components/CTASection";
import StatsSectionDark from "@/components/StatsSectionDark";

interface Client {
  id: string;
  name: string;
  logo: string;
  invert: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string | null;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setClientsLoading(false);
      })
      .catch(() => setClientsLoading(false));

    fetch("/api/public/testimonials")
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setTestimonialsLoading(false);
      })
      .catch(() => setTestimonialsLoading(false));
  }, []);

  // Duplicate clients for seamless loop
  const duplicatedClients = [...clients, ...clients];

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
            Nos Clients
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
            Ils nous font confiance
          </h1>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
            Nous sommes fiers de collaborer avec des marques innovantes qui partagent notre vision de l&apos;excellence.
          </p>
        </div>
      </section>

      {/* Logos Carousel Section */}
      <section className="py-12 overflow-hidden">
        {clientsLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
          </div>
        ) : clients.length > 0 ? (
          <div className="relative">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F7F3F1] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F7F3F1] to-transparent z-10 pointer-events-none" />

            {/* Scrolling logos */}
            <div className="flex animate-scroll-left hover:pause">
              {duplicatedClients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`h-10 md:h-14 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                      client.invert ? "invert" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-3 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Découvrez les retours de nos clients sur leur expérience avec Newin Agency.
            </p>
          </div>

          {/* Testimonials Grid */}
          {testimonialsLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-[#F7F3F1] rounded-3xl p-8 border border-zinc-200 hover:border-pink-300 transition-colors"
                >
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="w-10 h-10 text-pink-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <p className="text-zinc-700 text-lg leading-relaxed mb-8">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-200">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center text-white text-xl font-bold">
                        {testimonial.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-neutral-900 font-bold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        {testimonial.role} {testimonial.company && `chez ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
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
