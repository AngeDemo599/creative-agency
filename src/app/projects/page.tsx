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
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180 bg-pink-600" : "bg-pink-100"}`}>
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group cursor-pointer block mb-6 break-inside-avoid"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto block transition-all duration-500 group-hover:scale-[1.02]"
        />
        {/* Overlay - appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">{project.category}</span>
              {project.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
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
      {/* Filter Section */}
      <section className="pt-8 pb-6 px-4 md:px-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/25"
                    : "bg-white text-zinc-600 hover:bg-pink-50 hover:text-pink-600 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Masonry Grid */}
      <section className="py-6 px-4 md:px-6">
        <div className="max-w-[1800px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-lg mb-4">
                Aucun projet trouvé dans cette catégorie.
              </p>
              <button
                onClick={() => setActiveCategory("Tous")}
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
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
