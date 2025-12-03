"use client";

import { useEffect, useState } from "react";

interface MaintenanceSettings {
  maintenance_enabled: string;
  maintenance_password: string;
  maintenance_message: string;
}

export default function MaintenancePage() {
  const [settings, setSettings] = useState<MaintenanceSettings>({
    maintenance_enabled: "false",
    maintenance_password: "",
    maintenance_message: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings?group=maintenance");
      const data = await res.json();
      const settingsObj: MaintenanceSettings = {
        maintenance_enabled: "false",
        maintenance_password: "",
        maintenance_message: ""
      };
      data.forEach((s: { key: string; value: string }) => {
        if (s.key in settingsObj) {
          settingsObj[s.key as keyof MaintenanceSettings] = s.value;
        }
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error("Error fetching settings:", error);
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
        alert("Paramètres sauvegardés!");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // Toggle maintenance mode and save immediately
  const toggleMaintenance = async () => {
    const newValue = settings.maintenance_enabled === "true" ? "false" : "true";
    const newSettings = { ...settings, maintenance_enabled: newValue };

    setToggling(true);
    setSettings(newSettings);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) {
        // Revert on failure
        setSettings(settings);
      }
    } catch (error) {
      console.error("Error toggling:", error);
      setSettings(settings);
    } finally {
      setToggling(false);
    }
  };

  const isEnabled = settings.maintenance_enabled === "true";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mode Maintenance</h1>
          <p className="text-zinc-400 mt-1">Activez le mode maintenance pour restreindre l&apos;accès au site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Toggle Card */}
          <div className="lg:col-span-1">
            <div className={`bg-zinc-950 border rounded-2xl p-6 ${isEnabled ? 'border-orange-500/50' : 'border-zinc-800'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                  <svg className={`w-6 h-6 ${isEnabled ? 'text-orange-500' : 'text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <button
                  onClick={toggleMaintenance}
                  disabled={toggling}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isEnabled ? 'bg-orange-500' : 'bg-zinc-700'} ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {toggling ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  )}
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Mode Maintenance
              </h3>
              <p className={`text-sm ${isEnabled ? 'text-orange-400' : 'text-zinc-500'}`}>
                {isEnabled ? 'Activé - Le site est en maintenance' : 'Désactivé - Le site est accessible'}
              </p>

              {isEnabled && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-orange-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Les visiteurs doivent entrer le mot de passe
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white">Configuration</h2>
                <p className="text-zinc-500 text-sm mt-1">Personnalisez les paramètres du mode maintenance</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Mot de passe d&apos;accès
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.maintenance_password}
                      onChange={(e) => setSettings({ ...settings, maintenance_password: e.target.value })}
                      className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                      placeholder="Mot de passe"
                    />
                    <svg className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-zinc-600 text-xs mt-1">Ce mot de passe permet aux visiteurs d&apos;accéder au site pendant la maintenance</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Message de maintenance
                  </label>
                  <textarea
                    value={settings.maintenance_message}
                    onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
                    rows={3}
                    placeholder="Message affiché aux visiteurs..."
                  />
                  <p className="text-zinc-600 text-xs mt-1">Ce message sera affiché sur la page de maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Comment ça marche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">1</span>
            </div>
            <p>Activez le mode maintenance pour bloquer l&apos;accès public au site.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">2</span>
            </div>
            <p>Les visiteurs verront une page de maintenance avec un formulaire de mot de passe.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">3</span>
            </div>
            <p>Le tableau de bord reste toujours accessible pour les administrateurs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
