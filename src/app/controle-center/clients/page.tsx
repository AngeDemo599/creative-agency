"use client";

import { useEffect, useState } from "react";
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
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSave = async (item: Partial<Client>) => {
    const url = editingItem?.id ? `/api/admin/clients/${editingItem.id}` : "/api/admin/clients";
    const method = editingItem?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    if (res.ok) { fetchData(); setIsModalOpen(false); setEditingItem(null); }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Client",
      message: "Are you sure you want to delete this client? This action cannot be undone.",
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
      title: "Delete Selected Clients",
      message: `Are you sure you want to delete ${selectedIds.size} selected client${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-zinc-400 mt-1">Manage client logos displayed on the website</p>
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
              Delete ({selectedIds.size})
            </button>
          )}
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Client
          </button>
        </div>
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
            <span className="text-zinc-400 text-sm">Select all</span>
          </label>
          {selectedIds.size > 0 && (
            <span className="text-pink-400 text-sm">{selectedIds.size} selected</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div></div>
        ) : clients.map((client) => (
          <div key={client.id} className={`bg-zinc-950 border rounded-2xl p-6 group ${selectedIds.has(client.id) ? 'border-pink-500' : 'border-zinc-800'}`}>
            {/* Selection checkbox */}
            <div className="flex justify-between items-start mb-4">
              <input
                type="checkbox"
                checked={selectedIds.has(client.id)}
                onChange={() => toggleSelect(client.id)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className={`px-2 py-1 rounded-full text-xs ${client.isActive ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                {client.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className={`h-16 flex items-center justify-center mb-4 ${client.invert ? 'invert' : ''}`}>
              <img src={client.logo} alt={client.name} className="max-h-full max-w-full object-contain" />
            </div>
            <p className="text-white font-medium text-center mb-1">{client.name}</p>
            <p className="text-zinc-500 text-xs text-center mb-4">Order: {client.order}</p>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(client); setIsModalOpen(true); }} className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm">Edit</button>
              <button onClick={() => handleDelete(client.id)} className="px-3 py-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
            Clear selection
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-zinc-800 flex justify-between">
              <h2 className="text-xl font-bold text-white">{editingItem ? "Edit" : "Add"} Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleSave({
                name: fd.get('name') as string,
                logo: fd.get('logo') as string,
                invert: fd.get('invert') === 'on',
                order: parseInt(fd.get('order') as string),
                isActive: fd.get('isActive') === 'on'
              });
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Client Name</label>
                <input name="name" defaultValue={editingItem?.name} placeholder="Client name" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Logo URL</label>
                <input name="logo" defaultValue={editingItem?.logo} placeholder="https://..." required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Order</label>
                  <input name="order" type="number" defaultValue={editingItem?.order || 0} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <label className="flex items-center gap-2">
                    <input name="invert" type="checkbox" defaultChecked={editingItem?.invert} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500" />
                    <span className="text-sm text-zinc-300">Invert colors</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input name="isActive" type="checkbox" defaultChecked={editingItem?.isActive ?? true} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500" />
                    <span className="text-sm text-zinc-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
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
