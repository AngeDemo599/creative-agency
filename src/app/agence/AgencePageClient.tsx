"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CTASection from "@/components/CTASection";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
}

// Gallery images for carousel
const galleryImages = [
  "/gallery/agency-1.jpg",
  "/gallery/agency-2.jpg",
  "/gallery/agency-3.jpg",
  "/gallery/agency-4.jpg",
  "/gallery/agency-5.jpg",
  "/gallery/agency-6.jpg",
];

export default function AgencePageClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch team members from API
  useEffect(() => {
    fetch("/api/public/team")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamMembers(data);
        }
        setTeamLoading(false);
      })
      .catch(() => setTeamLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section - Centered Text */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-8">
            Notre équipe <em className="font-normal text-zinc-500">de</em> talentueux graphistes <em className="font-normal text-zinc-500">&</em> experts <em className="font-normal text-zinc-500">en</em> communication digitale partage <em className="font-normal text-zinc-500">une</em> passion commune <em className="font-normal text-zinc-500">pour</em> l&apos;esthétique <em className="font-normal text-zinc-500">&</em> l&apos;innovation.
          </h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-zinc-600 leading-relaxed">
              Notre expertise s&apos;étend à tous les domaines du <em className="text-pink-600 not-italic font-medium">graphisme</em>, de la conception de <em className="text-pink-600 not-italic font-medium">logos</em> et d&apos;<em className="text-pink-600 not-italic font-medium">identités visuelles</em> percutantes à la réalisation de supports de communication imprimés et numériques.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              Nous sommes également spécialisés dans la création de <em className="text-pink-600 not-italic font-medium">stratégies digitales</em> percutantes pour propulser votre marque, en intégrant des outils tels que les <em className="text-pink-600 not-italic font-medium">réseaux sociaux</em>, les <em className="text-pink-600 not-italic font-medium">newsletters</em> et les <em className="text-pink-600 not-italic font-medium">campagnes publicitaires</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Mantra Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                <Image
                  src="/logo_newin.png"
                  alt="Newin Agency"
                  fill
                  className="object-contain p-12"
                />
              </div>
            </div>

            {/* Right - Mantra List */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-8">
                (NOTRE MANTRA)
              </p>
              <ol className="space-y-8">
                <li className="border-b border-zinc-200 pb-8">
                  <p className="text-lg font-semibold text-neutral-900 mb-3">
                    <span className="text-pink-600 mr-2">01.</span>
                    <em className="not-italic">Nous sommes toujours à votre écoute.</em>
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    Ce qui compte pour nous? Que votre projet reflète votre image. Nous mettons notre expertise à votre service pour rendre vos projets exceptionnels !
                  </p>
                </li>
                <li className="border-b border-zinc-200 pb-8">
                  <p className="text-lg font-semibold text-neutral-900 mb-3">
                    <span className="text-pink-600 mr-2">02.</span>
                    <em className="not-italic">Chez Newin la qualité est une priorité.</em>
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    Tout est mis en oeuvre pour rendre votre business qualitatif dès le premier coup d&apos;oeil.
                  </p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-neutral-900 mb-3">
                    <span className="text-pink-600 mr-2">03.</span>
                    <em className="not-italic">Petite ou grande entreprise, Newin s&apos;occupe de vous.</em>
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    Nous soutenons les business qui souhaitent grandir et se démarquer. Mais nous accompagnons également les grandes entreprises qui souhaitent innover.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      <section className="py-16 bg-[#F7F3F1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (280 + 20)}px)` }}
            >
              {/* Duplicate images for infinite effect */}
              {[...galleryImages, ...galleryImages].map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px] aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-200"
                >
                  <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                    <span className="text-zinc-400 text-sm">Photo {(index % galleryImages.length) + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors"
                aria-label="Précédent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors"
                aria-label="Suivant"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider with curve */}
      <div className="relative h-24 bg-[#F7F3F1]">
        <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none">
          <path d="M0 96L1440 96L1440 0C1440 0 1080 48 720 48C360 48 0 0 0 0L0 96Z" fill="#171717" />
        </svg>
      </div>

      {/* Team Section */}
      <section className="bg-neutral-900 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
              (NOTRE ÉQUIPE)
            </p>
          </div>

          {/* Team Grid */}
          {teamLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center">
                  {/* Circular Photo */}
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-zinc-800 mb-6 border-2 border-zinc-700">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                        <span className="text-4xl text-zinc-500">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-sm text-pink-500 uppercase tracking-wider mb-4">
                    {member.role}
                  </p>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-zinc-400 leading-relaxed max-w-sm">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {(member.linkedin || member.instagram || member.twitter) && (
                    <div className="flex gap-4 mt-4">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {member.instagram && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">Aucun membre d&apos;équipe pour le moment.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
