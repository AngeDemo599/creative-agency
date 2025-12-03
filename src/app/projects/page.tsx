"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CTASection from "@/components/CTASection";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200 last:border-b-0">
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group cursor-pointer block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-lg shadow-black/5">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
          <p className="text-white/80 text-sm mb-3 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-neutral-900 text-xs font-semibold shadow-lg">
            {project.category}
          </span>
        </div>
        {/* Arrow Button */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-pink-600 group-hover:rotate-45">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      {/* Content */}
      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-pink-600 transition-colors">
        {project.title}
      </h3>
    </Link>
  );
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [projects, setProjects] = useState<Project[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["Tous"]);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/projects").then(res => res.json()),
      fetch("/api/public/faqs").then(res => res.json()),
      fetch("/api/public/categories?type=project").then(res => res.json())
    ]).then(([projectsData, faqsData, categoriesData]) => {
      setProjects(projectsData);
      setFaqs(faqsData.slice(0, 4));
      const cats = ["Tous", ...categoriesData.map((c: { name: string }) => c.name)];
      setCategories(cats as string[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-zinc-900">Projets</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
              Nos Projets
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Découvrez une sélection de nos réalisations les plus marquantes,
              créées avec passion et innovation pour des marques ambitieuses.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/25"
                    : "bg-white text-zinc-700 hover:bg-pink-100 hover:text-pink-600 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-lg mb-4">
                Aucun projet trouvé dans cette catégorie.
              </p>
              <button
                onClick={() => setActiveCategory("Tous")}
                className="text-pink-600 font-semibold hover:underline"
              >
                Voir tous les projets
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              Questions fréquentes
            </h2>
          </div>

          {/* FAQ List */}
          <div className="bg-[#F7F3F1] rounded-[32px] p-8 md:p-12">
            {faqs.map((item) => (
              <FAQItem key={item.id} question={item.question} answer={item.answer} />
            ))}
          </div>

          {/* Link to full FAQ */}
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors"
            >
              Voir toutes les questions
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
