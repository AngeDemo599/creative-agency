"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string | null;
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const items = [...testimonials, ...testimonials];

  return (
    <section className="bg-[#F7F3F1] rounded-b-[10px] overflow-hidden">
      {/* Dots Pattern Image - Top */}
      <div className="w-full mb-8">
        <img src="/backgorund_testimo.png" alt="" className="w-full h-auto" />
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
            Ce que disent nos clients
          </h2>
        </div>
        <Link
          href="/testimonials"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          Voir tous
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Single Row - Scrolling Cards */}
      <div className="flex animate-scroll-left">
        {loading ? (
          <div className="flex justify-center py-16 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
          </div>
        ) : items.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-[340px] md:w-[400px] mx-4"
          >
            {/* Card with content inside */}
            <div className="h-[350px] rounded-[30px] border-4 border-zinc-300 bg-white/50 p-6 flex flex-col">
              {/* Quote */}
              <p className="text-zinc-700 text-xl md:text-2xl font-medium leading-snug tracking-tight flex-grow">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-200">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                )}
                <div>
                  <p className="text-zinc-700 text-base font-semibold tracking-wide">
                    {testimonial.name}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Link */}
      <div className="md:hidden text-center mt-8 mb-8">
        <Link
          href="/testimonials"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          Voir tous les témoignages
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Dots Pattern Image - Bottom */}
      <div className="w-full mt-8">
        <img src="/backgorund_testimo.png" alt="" className="w-full h-auto" />
      </div>
    </section>
  );
}
