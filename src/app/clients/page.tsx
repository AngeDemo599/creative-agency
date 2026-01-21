"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import StatsSectionDark from "@/components/StatsSectionDark";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string | null;
}

export default function ClientsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setTestimonialsLoading(false);
      })
      .catch(() => setTestimonialsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3F1]">

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
