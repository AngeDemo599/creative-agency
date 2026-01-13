"use client";

import { useState, useEffect } from "react";

interface APIEndpoint {
  name: string;
  path: string;
  cached: boolean;
  cacheTime: string;
  avgResponse?: number;
}

interface ImageOptimization {
  component: string;
  status: "optimized" | "partial" | "needs-work";
  details: string;
}

const apiEndpoints: APIEndpoint[] = [
  { name: "Services", path: "/api/public/services", cached: true, cacheTime: "5 min" },
  { name: "Projects", path: "/api/public/projects", cached: true, cacheTime: "5 min" },
  { name: "Clients", path: "/api/public/clients", cached: true, cacheTime: "5 min" },
  { name: "Testimonials", path: "/api/public/testimonials", cached: true, cacheTime: "5 min" },
  { name: "Team", path: "/api/public/team", cached: true, cacheTime: "5 min" },
  { name: "FAQs", path: "/api/public/faqs", cached: true, cacheTime: "5 min" },
  { name: "Categories", path: "/api/public/categories", cached: true, cacheTime: "5 min" },
  { name: "Settings", path: "/api/public/settings", cached: true, cacheTime: "5 min" },
  { name: "Stats", path: "/api/public/stats", cached: true, cacheTime: "5 min" },
];

const imageOptimizations: ImageOptimization[] = [
  { component: "Header Logo", status: "optimized", details: "next/image avec priority" },
  { component: "Footer Logo", status: "optimized", details: "next/image optimisé" },
  { component: "ProjectsShowcase", status: "optimized", details: "next/image avec fill et sizes" },
  { component: "ClientsSection", status: "optimized", details: "next/image avec fill et sizes" },
  { component: "Service Details", status: "optimized", details: "next/image avec priority" },
  { component: "Project Details", status: "optimized", details: "next/image avec priority" },
];

const performanceFeatures = [
  { name: "Image Optimization", enabled: true, description: "WebP/AVIF automatique" },
  { name: "Compression", enabled: true, description: "Gzip activé" },
  { name: "Static Asset Caching", enabled: true, description: "Cache 1 an" },
  { name: "API Response Caching", enabled: true, description: "Cache 5 min avec stale-while-revalidate" },
  { name: "Font Optimization", enabled: true, description: "next/font avec display swap" },
  { name: "JSON-LD Structured Data", enabled: true, description: "Schémas SEO intégrés" },
];

export default function PerformancePage() {
  const [apiResponses, setApiResponses] = useState<Record<string, number>>({});
  const [testing, setTesting] = useState(false);

  async function testApiEndpoints() {
    setTesting(true);
    const results: Record<string, number> = {};

    for (const endpoint of apiEndpoints) {
      const start = performance.now();
      try {
        await fetch(endpoint.path);
        results[endpoint.path] = Math.round(performance.now() - start);
      } catch {
        results[endpoint.path] = -1;
      }
    }

    setApiResponses(results);
    setTesting(false);
  }

  useEffect(() => {
    testApiEndpoints();
  }, []);

  const avgResponseTime = Object.values(apiResponses).filter(v => v > 0).length > 0
    ? Math.round(Object.values(apiResponses).filter(v => v > 0).reduce((a, b) => a + b, 0) / Object.values(apiResponses).filter(v => v > 0).length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Insights</h1>
          <p className="text-zinc-400 mt-1">Surveillez et optimisez les performances de votre site</p>
        </div>
        <button
          onClick={testApiEndpoints}
          disabled={testing}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {testing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Test en cours...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Relancer les tests
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgResponseTime}ms</p>
              <p className="text-zinc-400 text-sm">Temps de réponse moyen</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{apiEndpoints.filter(e => e.cached).length}/{apiEndpoints.length}</p>
              <p className="text-zinc-400 text-sm">APIs en cache</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{imageOptimizations.filter(i => i.status === "optimized").length}/{imageOptimizations.length}</p>
              <p className="text-zinc-400 text-sm">Images optimisées</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{performanceFeatures.filter(f => f.enabled).length}/{performanceFeatures.length}</p>
              <p className="text-zinc-400 text-sm">Optimisations actives</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response Times */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Temps de réponse API
          </h3>
          <div className="space-y-3">
            {apiEndpoints.map((endpoint) => {
              const responseTime = apiResponses[endpoint.path];
              const status = responseTime === undefined ? "loading" : responseTime < 0 ? "error" : responseTime < 100 ? "fast" : responseTime < 300 ? "normal" : "slow";

              return (
                <div key={endpoint.path} className="flex items-center justify-between py-2 px-3 bg-zinc-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      status === "fast" ? "bg-green-500" :
                      status === "normal" ? "bg-yellow-500" :
                      status === "slow" ? "bg-red-500" :
                      status === "error" ? "bg-red-500" : "bg-zinc-500 animate-pulse"
                    }`} />
                    <span className="text-white text-sm">{endpoint.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {endpoint.cached && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                        Cached
                      </span>
                    )}
                    <span className={`text-sm ${
                      status === "fast" ? "text-green-400" :
                      status === "normal" ? "text-yellow-400" :
                      status === "slow" ? "text-red-400" :
                      status === "error" ? "text-red-400" : "text-zinc-400"
                    }`}>
                      {responseTime === undefined ? "..." : responseTime < 0 ? "Erreur" : `${responseTime}ms`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Optimization Status */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Optimisation des images
          </h3>
          <div className="space-y-3">
            {imageOptimizations.map((img, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    img.status === "optimized" ? "bg-green-500" :
                    img.status === "partial" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <span className="text-white text-sm">{img.component}</span>
                </div>
                <span className="text-zinc-400 text-xs">{img.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Features */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Fonctionnalités de performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-zinc-900 rounded-lg">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                feature.enabled ? "bg-green-500/20" : "bg-zinc-700"
              }`}>
                {feature.enabled ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{feature.name}</p>
                <p className="text-zinc-400 text-xs mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lighthouse Tips */}
      <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-600/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Tester avec Google Lighthouse</h3>
            <p className="text-zinc-300 text-sm mb-4">
              Pour une analyse complète des performances, utilisez Google Lighthouse dans Chrome DevTools (F12 → Lighthouse) ou{" "}
              <a
                href="https://pagespeed.web.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:underline"
              >
                PageSpeed Insights
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">Performance</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">Accessibility</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">Best Practices</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">SEO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
