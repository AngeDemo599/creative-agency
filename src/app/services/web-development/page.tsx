"use client";

import Link from "next/link";
import { useRef } from "react";
import CTASection from "@/components/CTASection";

const serviceData = {
  title: "Web Development",
  subtitle: "Développement Web",
  description: "Nous créons des sites web modernes, performants et optimisés pour convertir vos visiteurs en clients. Du site vitrine à l'e-commerce, nous développons des solutions sur mesure.",
  longDescription: "Notre équipe de développeurs crée des sites web qui allient esthétique et performance. Nous utilisons les technologies les plus récentes pour garantir des sites rapides, sécurisés et faciles à gérer. Que vous ayez besoin d'un site vitrine, d'une plateforme e-commerce ou d'une application web complexe, nous avons l'expertise pour réaliser votre projet.",
  features: [
    { title: "Custom Websites", description: "Sites web sur mesure et responsive" },
    { title: "E-commerce", description: "Boutiques en ligne performantes" },
    { title: "Web Applications", description: "Applications web interactives" },
    { title: "CMS Development", description: "Sites administrables facilement" },
  ],
  image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=800&fit=crop",
};

const relatedProjects = [
  {
    id: 1,
    title: "TechStart",
    description: "Site web moderne et application mobile pour une startup technologique",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["Web", "UI/UX", "Mobile"],
  },
  {
    id: 2,
    title: "FinanceApp",
    description: "Application fintech avec dashboard analytics avancé",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["App", "Dashboard", "UI/UX"],
  },
  {
    id: 3,
    title: "E-Shop Fashion",
    description: "Plateforme e-commerce pour marque de mode",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    tags: ["E-commerce", "Fashion", "Web"],
  },
  {
    id: 4,
    title: "Restaurant Online",
    description: "Site de réservation et commande en ligne",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    tags: ["Web", "Booking", "Restaurant"],
  },
  {
    id: 5,
    title: "Real Estate Platform",
    description: "Plateforme immobilière avec recherche avancée",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    tags: ["Web App", "Search", "Maps"],
  },
];

function ProjectCard({ project }: { project: typeof relatedProjects[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] group cursor-pointer">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <p className="text-white/80 text-sm mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-pink-600">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-pink-600 transition-colors">
        {project.title}
      </h3>
    </div>
  );
}

export default function WebDevelopmentServicePage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 380;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
            <Link href="/services" className="hover:text-pink-600 transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-zinc-700">Web Development</span>
          </div>

          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
                {serviceData.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
                {serviceData.title}
              </h1>
              <p className="text-zinc-600 text-lg mb-8">
                {serviceData.description}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-colors"
              >
                Démarrer un projet
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src={serviceData.image}
                  alt={serviceData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Ce que nous offrons
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              Nos prestations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceData.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#F7F3F1] hover:bg-pink-600 group transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
                  <svg className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-white mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl bg-[#F7F3F1]">
            <p className="text-zinc-600 text-lg leading-relaxed">
              {serviceData.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Carousel Section */}
      <section className="py-20 px-6 bg-neutral-900 relative overflow-hidden">
        <div className="absolute -left-40 top-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute -right-40 bottom-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <span className="text-pink-500 text-sm font-semibold uppercase tracking-wider">
                Portfolio
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                Projets Web
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/projects?category=Web Design"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-colors"
            >
              Voir tous les projets Web
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
