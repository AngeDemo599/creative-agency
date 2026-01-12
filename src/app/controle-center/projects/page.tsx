"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  serviceSlug: string | null;
  featured: boolean;
  order: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Bulk upload state
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [baseName, setBaseName] = useState("poste");
  const [bulkCategory, setBulkCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/categories?type=project")
      ]);
      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();
      setProjects(projectsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !bulkCategory) {
        setBulkCategory(categoriesData[0].name);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get category names for checking "other"
  const categoryNames = categories.map(c => c.name);

  // Projects with categories not in the list
  const otherProjects = projects.filter(p => !categoryNames.includes(p.category));

  // Filtered projects based on category
  const filteredProjects = filterCategory === "all"
    ? projects
    : filterCategory === "other"
    ? otherProjects
    : projects.filter(p => p.category === filterCategory);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSave = async (project: Partial<Project>) => {
    try {
      const url = editingProject?.id
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/admin/projects";
      const method = editingProject?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        fetchProjects();
        setIsModalOpen(false);
        setEditingProject(null);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchProjects();
            setSelectedIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }
        } catch (error) {
          console.error("Error deleting project:", error);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    setConfirmModal({
      isOpen: true,
      title: "Delete Selected Projects",
      message: `Are you sure you want to delete ${selectedIds.size} selected project${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          await Promise.all(
            Array.from(selectedIds).map(id =>
              fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
            )
          );
          fetchProjects();
          setSelectedIds(new Set());
        } catch (error) {
          console.error("Error deleting projects:", error);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === projects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(projects.map(p => p.id)));
    }
  };

  // Bulk category change
  const [categoryChangeOpen, setCategoryChangeOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [changingCategory, setChangingCategory] = useState(false);

  const handleBulkCategoryChange = async () => {
    if (selectedIds.size === 0 || !newCategory) return;

    setChangingCategory(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/admin/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: newCategory }),
          })
        )
      );
      fetchData();
      setCategoryChangeOpen(false);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error changing category:", error);
    } finally {
      setChangingCategory(false);
    }
  };

  // Bulk upload functions
  const uploadBulkFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please select image files only");
      return;
    }

    if (!baseName.trim()) {
      alert("Please enter a base name for the projects");
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading 0/${imageFiles.length}...`);

    try {
      const uploadedProjects: { title: string; image: string; category: string }[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgress(`Uploading ${i + 1}/${imageFiles.length}...`);

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "projects");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          uploadedProjects.push({
            title: `${baseName.trim()} - #${i + 1}`,
            image: url,
            category: bulkCategory || categories[0]?.name || "Branding",
          });
        }
      }

      // Save all projects to database
      if (uploadedProjects.length > 0) {
        setUploadProgress("Saving to database...");
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadedProjects),
        });

        if (res.ok) {
          fetchData();
          setBulkUploadOpen(false);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload some files");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadBulkFiles(e.dataTransfer.files);
    }
  };

  const handleBulkFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadBulkFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-zinc-400 mt-1">Manage your portfolio projects</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={() => {
                  setNewCategory(categories[0]?.name || "");
                  setCategoryChangeOpen(true);
                }}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category ({selectedIds.size})
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete ({selectedIds.size})
              </button>
            </>
          )}
          <button
            onClick={() => setBulkUploadOpen(true)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Bulk Upload
          </button>
          <button
            onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Project
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {bulkUploadOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Bulk Upload Projects</h2>
              <button onClick={() => setBulkUploadOpen(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Base Name Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Base Name (e.g., &quot;poste&quot; creates &quot;poste - #1&quot;, &quot;poste - #2&quot;, etc.)
                </label>
                <input
                  type="text"
                  value={baseName}
                  onChange={(e) => setBaseName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter base name..."
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center transition-all
                  ${dragActive
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                  }
                  ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBulkFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />

                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500"></div>
                    <p className="text-pink-400 font-medium">{uploadProgress}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Drop images here or click to upload</p>
                      <p className="text-zinc-500 text-sm mt-1">Multiple files allowed - Each image becomes a project</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-zinc-500 text-sm text-center">
                Upload multiple images at once. Each image will create a new project with the title &quot;{baseName || "name"} - #1&quot;, &quot;{baseName || "name"} - #2&quot;, etc.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Change Modal */}
      {categoryChangeOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Change Category</h2>
              <button onClick={() => setCategoryChangeOpen(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-sm">
                Change category for {selectedIds.size} selected project{selectedIds.size > 1 ? 's' : ''}
              </p>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">New Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCategoryChangeOpen(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkCategoryChange}
                  disabled={changingCategory || !newCategory}
                  className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {changingCategory ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterCategory === "all"
                ? "bg-pink-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            All ({projects.length})
          </button>
          {categories.map((cat) => {
            const count = projects.filter(p => p.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterCategory === cat.name
                    ? "bg-pink-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
          {otherProjects.length > 0 && (
            <button
              onClick={() => setFilterCategory("other")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterCategory === "other"
                  ? "bg-orange-600 text-white"
                  : "bg-zinc-800 text-orange-400 hover:bg-zinc-700 hover:text-orange-300"
              }`}
            >
              Other ({otherProjects.length})
            </button>
          )}
        </div>
      )}

      {/* Select All Bar */}
      {projects.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredProjects.length && filteredProjects.length > 0}
              onChange={() => {
                if (selectedIds.size === filteredProjects.length) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(filteredProjects.map(p => p.id)));
                }
              }}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-zinc-400 text-sm">
              Select all {filterCategory !== "all" ? `in ${filterCategory}` : ""} ({filteredProjects.length})
            </span>
          </label>
          {selectedIds.size > 0 && (
            <span className="text-pink-400 text-sm">{selectedIds.size} selected</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full p-8 text-center text-zinc-500">
            {filterCategory === "other"
              ? "No projects with uncategorized categories"
              : filterCategory !== "all"
              ? `No projects in "${filterCategory}"`
              : "No projects found"}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className={`bg-zinc-950 border rounded-2xl overflow-hidden group ${selectedIds.has(project.id) ? 'border-pink-500' : 'border-zinc-800'}`}>
              <div className="aspect-video relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                {/* Selection checkbox overlay */}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(project.id)}
                    onChange={() => toggleSelect(project.id)}
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-800/80 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-pink-500 rounded-lg text-white text-xs">Featured</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{project.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 text-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/controle-center/projects/${project.id}`}
                    className="flex-1 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Media
                  </Link>
                  <button
                    onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                    className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selection info bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-3 shadow-xl flex items-center gap-4 z-50">
          <span className="text-white font-medium">{selectedIds.size} selected</span>
          <div className="w-px h-6 bg-zinc-700" />
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              setNewCategory(categories[0]?.name || "");
              setCategoryChangeOpen(true);
            }}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Category
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          categories={categories.map(c => c.name)}
          onSave={handleSave}
          onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        isLoading={confirmModal.isLoading}
        confirmText="Delete"
      />
    </div>
  );
}

function ProjectModal({
  project,
  categories,
  onSave,
  onClose,
}: {
  project: Project | null;
  categories: string[];
  onSave: (project: Partial<Project>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    category: project?.category || categories[0] || "",
    tags: project?.tags || [],
    serviceSlug: project?.serviceSlug || "",
    featured: project?.featured || false,
    order: project?.order || 0,
    isActive: project?.isActive ?? true,
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    setUploadError(null);
    setUploading(true);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload file
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "projects");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setFormData({ ...formData, image: data.url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      setImagePreview(project?.image || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950">
          <h2 className="text-xl font-bold text-white">{project ? "Edit Project" : "Add New Project"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cover Image (max 5MB)</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="project-image-upload"
                />
                <label
                  htmlFor="project-image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                    uploading ? "bg-zinc-700 text-zinc-400" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Image
                    </>
                  )}
                </label>
                <p className="text-zinc-500 text-xs mt-2">JPEG, PNG, WebP or GIF</p>
                {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 text-sm"
                placeholder="Add tag..."
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300 text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-zinc-300">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-zinc-300">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.image}
              className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
