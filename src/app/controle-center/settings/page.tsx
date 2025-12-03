"use client";

import { useEffect, useState } from "react";

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string;
  group: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState("contact");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      setSettings(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  const groups = [...new Set(settings.map(s => s.group))];
  const groupedSettings = settings.filter(s => s.group === activeGroup);

  const groupLabels: Record<string, string> = {
    contact: "Contact Information",
    social: "Social Media Links",
    general: "General Settings",
    maintenance: "Maintenance Mode"
  };

  const groupIcons: Record<string, string> = {
    contact: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    social: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    general: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    maintenance: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage website configuration and contact information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2">
              {groups.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeGroup === group
                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={groupIcons[group] || groupIcons.general} />
                  </svg>
                  <span className="font-medium">{groupLabels[group] || group}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white">{groupLabels[activeGroup] || activeGroup}</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {activeGroup === "contact" && "Update your business contact information displayed on the website"}
                  {activeGroup === "social" && "Manage your social media profile links"}
                  {activeGroup === "general" && "General website settings and configuration"}
                </p>
              </div>
              <div className="p-6 space-y-6">
                {groupedSettings.map(setting => (
                  <div key={setting.id}>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">{setting.label}</label>
                    {setting.type === "textarea" ? (
                      <textarea
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
                        rows={3}
                      />
                    ) : setting.type === "url" ? (
                      <div className="relative">
                        <input
                          type="url"
                          value={setting.value}
                          onChange={(e) => updateSetting(setting.key, e.target.value)}
                          className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                          placeholder="https://"
                        />
                        <svg className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    ) : setting.type === "email" ? (
                      <div className="relative">
                        <input
                          type="email"
                          value={setting.value}
                          onChange={(e) => updateSetting(setting.key, e.target.value)}
                          className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                        />
                        <svg className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ) : setting.type === "tel" ? (
                      <div className="relative">
                        <input
                          type="tel"
                          value={setting.value}
                          onChange={(e) => updateSetting(setting.key, e.target.value)}
                          className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                        />
                        <svg className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">How Settings Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">1</span>
            </div>
            <p>Settings control dynamic content across your website like contact info and social links.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">2</span>
            </div>
            <p>Changes take effect immediately after saving. Make sure to review before publishing.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">3</span>
            </div>
            <p>Leave fields empty if you don&apos;t want them displayed on the website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
