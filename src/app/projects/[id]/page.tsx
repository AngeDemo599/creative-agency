"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

function MediaItem({ item, onClick }: { item: ProjectMedia; onClick: () => void }) {
  const youtubeId = item.type === "video" ? getYouTubeId(item.url) : null;
  const vimeoId = item.type === "video" ? getVimeoId(item.url) : null;

  return (
    <div
      className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-zinc-200"
      onClick={onClick}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          alt={item.caption || ""}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : youtubeId ? (
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={item.caption || "Video thumbnail"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : vimeoId ? (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      ) : (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          muted
        />
      )}

      {/* Play button overlay for videos */}
      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-8 h-8 text-pink-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Caption overlay */}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm">{item.caption}</p>
        </div>
      )}
    </div>
  );
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
      <div className="max-w-5xl max-h-[85vh] w-full mx-6" onClick={(e) => e.stopPropagation()}>
        {item.type === "image" ? (
          <img src={item.url} alt={item.caption || ""} className="w-full h-full object-contain rounded-lg" />
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
          <video src={item.url} controls autoPlay className="w-full max-h-[85vh] rounded-lg" />
        )}

        {item.caption && (
          <p className="text-white/80 text-center mt-4">{item.caption}</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

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
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
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

          {/* Back button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-pink-600 transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux projets
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Cover Image */}
          <div
            className="aspect-[21/9] rounded-3xl overflow-hidden mb-8 cursor-pointer"
            onClick={() => setSelectedMediaIndex(0)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6">
                {project.title}
              </h1>
              <p className="text-zinc-600 text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          {project.media.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Galerie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.media.map((item, index) => (
                  <MediaItem
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedMediaIndex(index + 1)}
                  />
                ))}
              </div>
            </div>
          )}
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
