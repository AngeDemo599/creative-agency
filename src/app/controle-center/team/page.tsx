"use client";

import { useEffect, useState, useRef } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
  order: number;
  isActive: boolean;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
      const res = await fetch("/api/admin/team");
      setTeam(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setPreviewImage(data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (item: Partial<TeamMember>) => {
    const url = editingItem?.id ? `/api/admin/team/${editingItem.id}` : "/api/admin/team";
    const method = editingItem?.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, image: previewImage || item.image })
    });
    if (res.ok) {
      fetchData();
      setIsModalOpen(false);
      setEditingItem(null);
      setPreviewImage("");
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le membre",
      message: "Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ? Cette action est irréversible.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
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
      title: "Supprimer la sélection",
      message: `Êtes-vous sûr de vouloir supprimer ${selectedIds.size} membre${selectedIds.size > 1 ? 's' : ''} ? Cette action est irréversible.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          await Promise.all(
            Array.from(selectedIds).map(id =>
              fetch(`/api/admin/team/${id}`, { method: "DELETE" })
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === team.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(team.map(m => m.id)));
    }
  };

  const openEditModal = (member: TeamMember | null) => {
    setEditingItem(member);
    setPreviewImage(member?.image || "");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Équipe</h1>
          <p className="text-zinc-400 mt-1">Gérez les membres de votre équipe</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer ({selectedIds.size})
            </button>
          )}
          <button
            onClick={() => openEditModal(null)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un membre
          </button>
        </div>
      </div>

      {team.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === team.length && team.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-zinc-400 text-sm">Tout sélectionner</span>
          </label>
          {selectedIds.size > 0 && (
            <span className="text-pink-400 text-sm">{selectedIds.size} sélectionné(s)</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div>
          </div>
        ) : team.map((member) => (
          <div
            key={member.id}
            className={`bg-zinc-950 border rounded-2xl overflow-hidden group ${selectedIds.has(member.id) ? 'border-pink-500' : 'border-zinc-800'}`}
          >
            <div className="relative h-48">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <input
                  type="checkbox"
                  checked={selectedIds.has(member.id)}
                  onChange={() => toggleSelect(member.id)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className={`px-2 py-1 rounded-full text-xs ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                  {member.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <h3 className="text-white font-bold">{member.name}</h3>
                <p className="text-pink-400 text-sm">{member.role}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{member.bio || "Aucune bio"}</p>
              <div className="flex gap-2 mb-4">
                {member.linkedin && (
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">LinkedIn</span>
                )}
                {member.instagram && (
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">Instagram</span>
                )}
                {member.twitter && (
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">Twitter</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-3 shadow-xl flex items-center gap-4 z-50">
          <span className="text-white font-medium">{selectedIds.size} sélectionné(s)</span>
          <div className="w-px h-6 bg-zinc-700" />
          <button onClick={() => setSelectedIds(new Set())} className="text-zinc-400 hover:text-white transition-colors">
            Désélectionner
          </button>
          <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800 flex justify-between sticky top-0 bg-zinc-950">
              <h2 className="text-xl font-bold text-white">{editingItem ? "Modifier" : "Ajouter"} un membre</h2>
              <button onClick={() => { setIsModalOpen(false); setPreviewImage(""); }} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleSave({
                name: fd.get('name') as string,
                role: fd.get('role') as string,
                bio: fd.get('bio') as string,
                image: previewImage || (fd.get('imageUrl') as string),
                linkedin: fd.get('linkedin') as string,
                instagram: fd.get('instagram') as string,
                twitter: fd.get('twitter') as string,
                order: parseInt(fd.get('order') as string) || 0,
                isActive: fd.get('isActive') === 'on'
              });
            }} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Photo</label>
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <input
                      name="imageUrl"
                      defaultValue={editingItem?.image}
                      placeholder="ou collez une URL d'image"
                      onChange={(e) => setPreviewImage(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    />
                    <p className="text-zinc-500 text-xs mt-1">
                      {uploading ? "Téléchargement..." : "Cliquez sur l'image ou entrez une URL"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Nom</label>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom complet" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Rôle</label>
                  <input name="role" defaultValue={editingItem?.role} placeholder="Ex: Designer" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                <textarea name="bio" defaultValue={editingItem?.bio || ""} placeholder="Courte description..." rows={3} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">LinkedIn</label>
                  <input name="linkedin" defaultValue={editingItem?.linkedin || ""} placeholder="URL" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Instagram</label>
                  <input name="instagram" defaultValue={editingItem?.instagram || ""} placeholder="URL" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Twitter</label>
                  <input name="twitter" defaultValue={editingItem?.twitter || ""} placeholder="URL" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Ordre</label>
                  <input name="order" type="number" defaultValue={editingItem?.order || 0} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="isActive" type="checkbox" defaultChecked={editingItem?.isActive ?? true} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500" />
                    <span className="text-sm text-zinc-300">Membre actif</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setPreviewImage(""); }} className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        isLoading={confirmModal.isLoading}
        confirmText="Supprimer"
      />
    </div>
  );
}
