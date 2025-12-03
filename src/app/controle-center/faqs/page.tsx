"use client";

import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

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
      const [faqsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/faqs"),
        fetch("/api/admin/categories?type=faq")
      ]);
      setFaqs(await faqsRes.json());
      setCategories(await categoriesRes.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryNames = categories.map(c => c.name);

  const handleSave = async (item: Partial<FAQ>) => {
    const url = editingItem?.id ? `/api/admin/faqs/${editingItem.id}` : "/api/admin/faqs";
    const method = editingItem?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    if (res.ok) { fetchData(); setIsModalOpen(false); setEditingItem(null); }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete FAQ",
      message: "Are you sure you want to delete this FAQ? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
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
      title: "Delete Selected FAQs",
      message: `Are you sure you want to delete ${selectedIds.size} selected FAQ${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          await Promise.all(
            Array.from(selectedIds).map(id =>
              fetch(`/api/admin/faqs/${id}`, { method: "DELETE" })
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
    if (selectedIds.size === filteredFaqs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFaqs.map(f => f.id)));
    }
  };

  const filteredFaqs = filterCategory === "all" ? faqs : faqs.filter(f => f.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
          <p className="text-zinc-400 mt-1">Manage frequently asked questions</p>
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
            Add FAQ
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCategory("all")} className={`px-4 py-2 rounded-xl text-sm transition-colors ${filterCategory === "all" ? "bg-pink-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>All</button>
        {categoryNames.map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-xl text-sm transition-colors ${filterCategory === cat ? "bg-pink-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>{cat}</button>
        ))}
      </div>

      {/* Select All Bar */}
      {filteredFaqs.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredFaqs.length && filteredFaqs.length > 0}
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

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div></div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No FAQs found</div>
        ) : filteredFaqs.map((faq) => (
          <div key={faq.id} className={`p-6 flex items-start justify-between gap-4 ${selectedIds.has(faq.id) ? 'bg-pink-500/5' : ''}`}>
            <div className="flex items-start gap-4 flex-1">
              <input
                type="checkbox"
                checked={selectedIds.has(faq.id)}
                onChange={() => toggleSelect(faq.id)}
                className="w-4 h-4 mt-1 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded text-xs">{faq.category}</span>
                  <span className="text-zinc-600 text-xs">Order: {faq.order}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${faq.isActive ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-white font-medium mb-1">{faq.question}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2">{faq.answer}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(faq); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => handleDelete(faq.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-zinc-800 flex justify-between">
              <h2 className="text-xl font-bold text-white">{editingItem ? "Edit" : "Add"} FAQ</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleSave({
                question: fd.get('question') as string,
                answer: fd.get('answer') as string,
                category: fd.get('category') as string,
                order: parseInt(fd.get('order') as string),
                isActive: fd.get('isActive') === 'on'
              });
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Question</label>
                <input name="question" defaultValue={editingItem?.question} placeholder="Question" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Answer</label>
                <textarea name="answer" defaultValue={editingItem?.answer} placeholder="Answer" required rows={4} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white resize-none focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                  <select name="category" defaultValue={editingItem?.category || categoryNames[0]} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500">
                    {categoryNames.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Order</label>
                  <input name="order" type="number" defaultValue={editingItem?.order || 0} placeholder="Order" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input name="isActive" type="checkbox" defaultChecked={editingItem?.isActive ?? true} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-pink-500" />
                <span className="text-sm text-zinc-300">Active</span>
              </label>
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
