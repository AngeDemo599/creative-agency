"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import CTASection from "@/components/CTASection";

interface ProjectMedia {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  media: ProjectMedia[];
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

function MediaModal({
  item,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: {
  item: ProjectMedia;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const youtubeId = item.type === "video" ? getYouTubeId(item.url) : null;
  const vimeoId = item.type === "video" ? getVimeoId(item.url) : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Close button */}
      <button
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasPrev && (
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Media content */}
      <div className="max-w-6xl max-h-[90vh] w-full mx-6" onClick={(e) => e.stopPropagation()}>
        {item.type === "image" ? (
          <div className="relative w-full h-[90vh]">
            <Image src={item.url} alt={item.caption || ""} fill className="object-contain" sizes="100vw" />
          </div>
        ) : youtubeId ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : vimeoId ? (
          <div className="aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video src={item.url} controls autoPlay className="w-full max-h-[90vh] rounded-lg" />
        )}

        {item.caption && (
          <p className="text-white/80 text-center mt-4">{item.caption}</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/public/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F7F3F1] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Projet non trouvé</h1>
        <Link href="/projects" className="text-pink-600 hover:underline">
          Retour aux projets
        </Link>
      </div>
    );
  }

  const allMedia: ProjectMedia[] = [
    { id: "cover", type: "image", url: project.image, caption: null, order: -1 },
    ...project.media,
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Cover Image - Full Width */}
      <section className="relative w-full">
        <div
          className="w-full cursor-pointer"
          onClick={() => setSelectedMediaIndex(0)}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[80vh] object-contain bg-zinc-100"
          />
        </div>
      </section>

      {/* Case Study Header */}
      <section className="py-16 px-6 bg-[#F7F3F1]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-pink-600 transition-colors">
              Projets
            </Link>
            <span>/</span>
            <span className="text-zinc-700">{project.title}</span>
          </div>

          {/* Title & Category */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-pink-600 text-white rounded-full text-sm font-semibold mb-6">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white text-zinc-700 rounded-full text-sm font-medium shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <p className="text-zinc-600 text-xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Media Gallery - Case Study Style */}
      {project.media.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Galerie du projet
            </h2>

            {/* Full-width images stacked */}
            <div className="space-y-8">
              {project.media.map((item, index) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedMediaIndex(index + 1)}
                >
                  {item.type === "image" ? (
                    <div className="relative bg-zinc-100 rounded-2xl overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.caption || `Image ${index + 1}`}
                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                          <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden">
                      {(() => { const ytId = getYouTubeId(item.url); return ytId ? (
                        <Image
                          src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                          alt={item.caption || "Video thumbnail"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ); })()}
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg className="w-10 h-10 text-pink-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caption */}
                  {item.caption && (
                    <p className="text-center text-zinc-500 text-sm mt-4 italic">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Projects */}
      <section className="py-12 px-6 bg-[#F7F3F1]">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voir tous les projets
          </Link>
        </div>
      </section>

      {/* Media Modal */}
      {selectedMediaIndex !== null && (
        <MediaModal
          item={allMedia[selectedMediaIndex]}
          onClose={() => setSelectedMediaIndex(null)}
          onNext={() => setSelectedMediaIndex((prev) => Math.min((prev ?? 0) + 1, allMedia.length - 1))}
          onPrev={() => setSelectedMediaIndex((prev) => Math.max((prev ?? 0) - 1, 0))}
          hasNext={selectedMediaIndex < allMedia.length - 1}
          hasPrev={selectedMediaIndex > 0}
        />
      )}

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
