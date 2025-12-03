"use client";

import { useEffect, useState } from "react";

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

// Available icons for selection (line/outline style)
const availableIcons: { id: string; name: string; path: string }[] = [
  { id: "users", name: "Users", path: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { id: "calendar", name: "Calendar", path: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" },
  { id: "package", name: "Package", path: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" },
  { id: "map-pin", name: "Location", path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  { id: "star", name: "Star", path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { id: "award", name: "Award", path: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12" },
  { id: "trending-up", name: "Growth", path: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" },
  { id: "heart", name: "Heart", path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
  { id: "target", name: "Target", path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { id: "zap", name: "Energy", path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { id: "globe", name: "Globe", path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" },
  { id: "briefcase", name: "Business", path: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
  { id: "check-circle", name: "Check", path: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" },
  { id: "clock", name: "Clock", path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" },
  { id: "shield", name: "Shield", path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { id: "thumbs-up", name: "Like", path: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" },
];

// Get icon component by ID
const getIconPath = (iconId: string | null): string => {
  if (!iconId) return availableIcons[0].path;
  const icon = availableIcons.find(i => i.id === iconId);
  return icon ? icon.path : availableIcons[0].path;
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: 0,
    suffix: "+",
    icon: "users",
    order: 0,
    isActive: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      setStats(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingItem
        ? `/api/admin/stats/${editingItem.id}`
        : "/api/admin/stats";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    try {
      await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openModal = (item?: Stat) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        value: item.value,
        suffix: item.suffix,
        icon: item.icon || "users",
        order: item.order,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: "",
        value: 0,
        suffix: "+",
        icon: "users",
        order: stats.length,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ label: "", value: 0, suffix: "+", icon: "users", order: 0, isActive: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistics</h1>
          <p className="text-zinc-400 mt-1">Manage the statistics displayed on your website</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Stat
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`bg-zinc-950 border border-zinc-800 rounded-2xl p-6 ${!stat.isActive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={getIconPath(stat.icon)} />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(stat)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
              <div className="mt-3 text-xs text-zinc-600">Order: {stat.order}</div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">About Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">1</span>
            </div>
            <p>Stats are displayed on the homepage and clients page with animated counters.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">2</span>
            </div>
            <p>The suffix appears after the number (e.g., + for &quot;18+&quot; or % for &quot;100%&quot;).</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">3</span>
            </div>
            <p>Change the order to rearrange how stats appear on the website.</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Stat" : "Add Stat"}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  placeholder="e.g., Clients satisfaits"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Suffix</label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    placeholder="e.g., + or %"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2 p-3 bg-zinc-800 border border-zinc-700 rounded-xl max-h-[180px] overflow-y-auto">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon.id })}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        formData.icon === icon.id
                          ? 'bg-pink-500/20 ring-2 ring-pink-500'
                          : 'hover:bg-zinc-700'
                      }`}
                      title={icon.name}
                    >
                      <svg
                        className={`w-5 h-5 ${formData.icon === icon.id ? 'text-pink-400' : 'text-zinc-400'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d={icon.path} />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-zinc-500 text-xs mt-1">Selected: {availableIcons.find(i => i.id === formData.icon)?.name || 'Users'}</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500"
                />
                <label htmlFor="isActive" className="text-zinc-300">Active</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
