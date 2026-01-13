"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CTASection from "@/components/CTASection";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200">
      <button
        className="w-full py-6 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-neutral-900 pr-8">{question}</span>
        <div className={`w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-pink-600" : ""}`}>
          <svg className={`w-4 h-4 ${isOpen ? "text-white" : "text-pink-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}>
        <p className="text-zinc-600 leading-relaxed pr-16">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPageClient() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/faqs").then(res => res.json()),
      fetch("/api/public/categories?type=faq").then(res => res.json())
    ]).then(([faqsData, categoriesData]) => {
      setFaqs(Array.isArray(faqsData) ? faqsData : []);
      const cats = Array.isArray(categoriesData) ? categoriesData.map((c: { name: string }) => c.name) : [];
      setCategories(cats as string[]);
      if (cats.length > 0) setActiveCategory(cats[0] as string);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching FAQ data:", err);
      setFaqs([]);
      setCategories([]);
      setLoading(false);
    });
  }, []);

  const filteredFaqs = faqs.filter(f => f.category === activeCategory);

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
            <span className="text-zinc-700">FAQ</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
              Questions fréquentes
            </h1>
            <p className="text-zinc-600 text-lg">
              Trouvez les réponses aux questions les plus courantes sur nos services et notre façon de travailler.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-600"></div>
            ) : categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-pink-600 text-white"
                    : "bg-white border border-zinc-300 text-zinc-700 hover:border-pink-500 hover:text-pink-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="bg-white rounded-[32px] p-8 md:p-12">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Aucune question dans cette catégorie.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vous avez d&apos;autres questions?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors font-semibold"
            >
              Contactez-nous
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="mailto:contact@newin.dz"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-zinc-600 text-white rounded-full hover:border-white transition-colors font-semibold"
            >
              contact@newin.dz
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
