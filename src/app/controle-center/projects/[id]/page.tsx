"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
}

interface ProjectMedia {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  order: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [projectRes, mediaRes] = await Promise.all([
        fetch(`/api/admin/projects/${projectId}`),
        fetch(`/api/admin/projects/${projectId}/media`),
      ]);

      if (!projectRes.ok) {
        router.push("/controle-center/projects");
        return;
      }

      const projectData = await projectRes.json();
      setProject(projectData);
      setMedia(await mediaRes.json());
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`${file.name}: File size must be less than 5MB`);
        continue;
      }

      // Check file type
      const isImage = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
      const isVideo = ["video/mp4", "video/webm", "video/quicktime"].includes(file.type);

      if (!isImage && !isVideo) {
        setUploadError(`${file.name}: Invalid file type`);
        continue;
      }

      try {
        // Upload file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `projects/${projectId}`);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }

        const { url } = await uploadRes.json();

        // Add to project media
        await fetch(`/api/admin/projects/${projectId}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: isImage ? "image" : "video",
            url,
          }),
        });
      } catch (error) {
        setUploadError(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchData();
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;

    try {
      await fetch(`/api/admin/projects/${projectId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video",
          url: videoUrl.trim(),
        }),
      });

      setVideoUrl("");
      setShowVideoModal(false);
      fetchData();
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Delete this media?")) return;

    try {
      await fetch(`/api/admin/projects/${projectId}/media?mediaId=${mediaId}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleUpdateCaption = async (mediaId: string, caption: string) => {
    try {
      await fetch(`/api/admin/projects/${projectId}/media`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, caption }),
      });
    } catch (error) {
      console.error("Error updating caption:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Project not found</p>
        <Link href="/controle-center/projects" className="text-pink-500 hover:underline mt-2 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/controle-center/projects"
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-zinc-400 mt-1">{project.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {project.featured && (
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Featured</span>
          )}
        </div>
      </div>

      {/* Project Info Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="flex gap-6">
          <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-zinc-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Media Gallery</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add Video URL
            </button>
            <label className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors ${uploading ? "bg-zinc-700 text-zinc-400" : "bg-pink-600 hover:bg-pink-700 text-white"}`}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Images
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {uploadError}
          </div>
        )}

        {media.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl">
            <svg className="w-16 h-16 mx-auto text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-zinc-500 mb-2">No media added yet</p>
            <p className="text-zinc-600 text-sm">Upload images or add video URLs to showcase this project</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.caption || ""} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center relative">
                    {item.url.includes("youtube.com") || item.url.includes("youtu.be") || item.url.includes("vimeo.com") ? (
                      <div className="text-center">
                        <svg className="w-12 h-12 text-pink-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <p className="text-zinc-400 text-xs">External Video</p>
                      </div>
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === "video" ? "bg-purple-500/80" : "bg-blue-500/80"} text-white`}>
                    {item.type === "video" ? "Video" : "Image"}
                  </span>
                </div>

                {/* Caption */}
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Add caption..."
                    defaultValue={item.caption || ""}
                    onBlur={(e) => handleUpdateCaption(item.id, e.target.value)}
                    className="w-full bg-transparent text-zinc-400 text-xs placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video URL Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add Video URL</h2>
              <button onClick={() => setShowVideoModal(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                />
                <p className="text-zinc-500 text-xs mt-2">Supports YouTube, Vimeo, or direct video URLs</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVideo}
                  disabled={!videoUrl.trim()}
                  className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  Add Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
