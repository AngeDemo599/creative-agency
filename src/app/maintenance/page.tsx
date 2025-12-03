"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MaintenancePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Notre site est actuellement en maintenance. Nous serons bientôt de retour!");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if maintenance is still active and if user already has access
    fetch("/api/maintenance")
      .then(res => res.json())
      .then(data => {
        if (!data.enabled || data.hasAccess) {
          router.push("/");
        } else {
          setMessage(data.message);
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Mot de passe incorrect");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px]" />
        <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo_newin_lettre_w.png"
            alt="Newin"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <div className="w-20 h-20 mx-auto mb-6 bg-pink-600/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Maintenance en cours
        </h1>

        {/* Message */}
        <p className="text-zinc-400 text-lg mb-8">
          {message}
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-300 text-sm mb-4">
            Entrez le mot de passe pour accéder au site
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="Mot de passe"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-zinc-600 text-sm mt-8">
          &copy; {new Date().getFullYear()} Newin. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
