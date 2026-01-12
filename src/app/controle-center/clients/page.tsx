"use client";

import { useEffect, useState, useCallback } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Client {
  id: string;
  name: string;
  logo: string;
  invert: boolean;
  order: number;
  isActive: boolean;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/clients");
      setClients(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please select image files only");
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading 0/${imageFiles.length}...`);

    try {
      const uploadedClients: { name: string; logo: string }[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgress(`Uploading ${i + 1}/${imageFiles.length}...`);

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "clients");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          uploadedClients.push({
            name: fileName,
            logo: url,
          });
        }
      }

      // Save all clients to database
      if (uploadedClients.length > 0) {
        setUploadProgress("Saving to database...");
        const res = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadedClients),
        });

        if (res.ok) {
          fetchData();
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Client Logo",
      message: "Are you sure you want to delete this logo?",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchData();
            setSelectedIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }
        } catch (error) {
          console.error("Error:", error);
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
      title: "Delete Selected Logos",
      message: `Delete ${selectedIds.size} selected logo${selectedIds.size > 1 ? 's' : ''}?`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          await Promise.all(
            Array.from(selectedIds).map(id =>
              fetch(`/api/admin/clients/${id}`, { method: "DELETE" })
            )
          );
          fetchData();
          setSelectedIds(new Set());
        } catch (error) {
          console.error("Error:", error);
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
    if (selectedIds.size === clients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(clients.map(c => c.id)));
    }
  };

  const toggleInvert = async (client: Client) => {
    try {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, invert: !client.invert }),
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Logos</h1>
          <p className="text-zinc-400 mt-1">Upload client logos (images only)</p>
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Upload Zone */}
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
          onChange={handleFileInput}
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
              <p className="text-zinc-500 text-sm mt-1">PNG, JPG, WebP, GIF - Multiple files allowed</p>
            </div>
          </div>
        )}
      </div>

      {/* Select All Bar */}
      {clients.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === clients.length && clients.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-zinc-400 text-sm">Select all ({clients.length})</span>
          </label>
          {selectedIds.size > 0 && (
            <span className="text-pink-400 text-sm">{selectedIds.size} selected</span>
          )}
        </div>
      )}

      {/* Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="col-span-full p-8 text-center text-zinc-500">
            No logos uploaded yet. Drag and drop images above to add client logos.
          </div>
        ) : clients.map((client) => (
          <div
            key={client.id}
            className={`
              relative bg-zinc-950 border rounded-xl p-4 group transition-all
              ${selectedIds.has(client.id) ? 'border-pink-500 ring-1 ring-pink-500' : 'border-zinc-800 hover:border-zinc-700'}
            `}
          >
            {/* Selection checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedIds.has(client.id)}
                onChange={() => toggleSelect(client.id)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            {/* Logo Image */}
            <div
              className={`h-20 flex items-center justify-center ${client.invert ? 'invert' : ''}`}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Actions - visible on hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <button
                onClick={() => toggleInvert(client)}
                title={client.invert ? "Remove invert" : "Invert colors"}
                className={`p-2 rounded-lg transition-colors ${client.invert ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                title="Delete"
                className="p-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
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
