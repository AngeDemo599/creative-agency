"use client";

import { useState, useEffect } from "react";

interface PageSEO {
  path: string;
  title: string;
  description: string;
  hasOgImage: boolean;
  titleLength: number;
  descriptionLength: number;
  issues: string[];
}

interface SitemapEntry {
  url: string;
  lastmod?: string;
  priority?: number;
  changefreq?: string;
}

const staticPages: PageSEO[] = [
  {
    path: "/",
    title: "Newin Agency | Agence de Communication Créative à Alger",
    description: "Newin est une agence de communication créative et digitale basée à Alger. Branding, Stratégie, Social Media, Site web, Graphisme, Création de contenu et Mailing.",
    hasOgImage: true,
    titleLength: 54,
    descriptionLength: 156,
    issues: [],
  },
  {
    path: "/services",
    title: "Services | Newin Agency",
    description: "Découvrez nos services de communication créative: branding, création graphique, stratégie digitale, et plus encore.",
    hasOgImage: true,
    titleLength: 24,
    descriptionLength: 112,
    issues: ["Titre trop court (< 30 caractères)"],
  },
  {
    path: "/projects",
    title: "Projets | Newin Agency",
    description: "Explorez notre portfolio de projets créatifs et découvrez comment nous transformons les idées en réalité.",
    hasOgImage: true,
    titleLength: 23,
    descriptionLength: 103,
    issues: ["Titre trop court (< 30 caractères)"],
  },
  {
    path: "/contact",
    title: "Contact | Newin Agency",
    description: "Contactez Newin Agency pour discuter de votre projet. Nous sommes là pour vous accompagner dans votre stratégie de communication et marketing digital.",
    hasOgImage: true,
    titleLength: 24,
    descriptionLength: 156,
    issues: ["Titre trop court (< 30 caractères)"],
  },
  {
    path: "/team",
    title: "Notre Équipe | Newin Agency",
    description: "Découvrez l'équipe créative de Newin Agency. Des professionnels passionnés qui transforment vos idées en réalité.",
    hasOgImage: true,
    titleLength: 29,
    descriptionLength: 113,
    issues: ["Titre trop court (< 30 caractères)"],
  },
  {
    path: "/faq",
    title: "FAQ - Questions Fréquentes | Newin Agency",
    description: "Trouvez les réponses aux questions les plus courantes sur nos services de communication, branding, création graphique et marketing digital.",
    hasOgImage: true,
    titleLength: 42,
    descriptionLength: 144,
    issues: [],
  },
];

function getTitleStatus(length: number): { color: string; text: string } {
  if (length < 30) return { color: "text-orange-500", text: "Trop court" };
  if (length > 60) return { color: "text-red-500", text: "Trop long" };
  return { color: "text-green-500", text: "Optimal" };
}

function getDescriptionStatus(length: number): { color: string; text: string } {
  if (length < 120) return { color: "text-orange-500", text: "Trop court" };
  if (length > 160) return { color: "text-red-500", text: "Trop long" };
  return { color: "text-green-500", text: "Optimal" };
}

export default function SEOAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<"pages" | "sitemap" | "robots">("pages");
  const [services, setServices] = useState<{ slug: string; title: string; description: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/services").then(res => res.json()),
      fetch("/api/public/projects").then(res => res.json()),
    ]).then(([servicesData, projectsData]) => {
      setServices(servicesData || []);
      setProjects(projectsData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const dynamicServicePages: PageSEO[] = services.map(s => ({
    path: `/services/${s.slug}`,
    title: `${s.title} | Newin Agency`,
    description: s.description || "Description non définie",
    hasOgImage: true,
    titleLength: `${s.title} | Newin Agency`.length,
    descriptionLength: (s.description || "").length,
    issues: [
      ...(s.title.length + 16 < 30 ? ["Titre trop court (< 30 caractères)"] : []),
      ...(s.title.length + 16 > 60 ? ["Titre trop long (> 60 caractères)"] : []),
      ...((s.description || "").length < 120 ? ["Description trop courte (< 120 caractères)"] : []),
      ...((s.description || "").length > 160 ? ["Description trop longue (> 160 caractères)"] : []),
    ],
  }));

  const dynamicProjectPages: PageSEO[] = projects.map(p => ({
    path: `/projects/${p.id}`,
    title: `${p.title} | Newin Agency`,
    description: p.description || "Description non définie",
    hasOgImage: true,
    titleLength: `${p.title} | Newin Agency`.length,
    descriptionLength: (p.description || "").length,
    issues: [
      ...(p.title.length + 16 < 30 ? ["Titre trop court (< 30 caractères)"] : []),
      ...(p.title.length + 16 > 60 ? ["Titre trop long (> 60 caractères)"] : []),
      ...((p.description || "").length < 120 ? ["Description trop courte (< 120 caractères)"] : []),
      ...((p.description || "").length > 160 ? ["Description trop longue (> 160 caractères)"] : []),
    ],
  }));

  const allPages = [...staticPages, ...dynamicServicePages, ...dynamicProjectPages];
  const pagesWithIssues = allPages.filter(p => p.issues.length > 0);
  const totalIssues = allPages.reduce((sum, p) => sum + p.issues.length, 0);

  const sitemapEntries: SitemapEntry[] = [
    { url: "https://newin.dz/", priority: 1, changefreq: "weekly" },
    { url: "https://newin.dz/services", priority: 0.9, changefreq: "weekly" },
    { url: "https://newin.dz/projects", priority: 0.9, changefreq: "weekly" },
    { url: "https://newin.dz/team", priority: 0.8, changefreq: "monthly" },
    { url: "https://newin.dz/contact", priority: 0.8, changefreq: "monthly" },
    { url: "https://newin.dz/faq", priority: 0.7, changefreq: "monthly" },
    ...services.map(s => ({ url: `https://newin.dz/services/${s.slug}`, priority: 0.8, changefreq: "monthly" })),
    ...projects.map(p => ({ url: `https://newin.dz/projects/${p.id}`, priority: 0.7, changefreq: "monthly" })),
  ];

  const robotsContent = `User-agent: *
Allow: /
Disallow: /controle-center/
Disallow: /api/
Disallow: /_next/

Sitemap: https://newin.dz/sitemap.xml`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Analyzer</h1>
          <p className="text-zinc-400 mt-1">Analysez et optimisez le référencement de votre site</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{allPages.length}</p>
              <p className="text-zinc-400 text-sm">Pages indexées</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{allPages.length - pagesWithIssues.length}</p>
              <p className="text-zinc-400 text-sm">Pages optimisées</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pagesWithIssues.length}</p>
              <p className="text-zinc-400 text-sm">Pages avec avertissements</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalIssues}</p>
              <p className="text-zinc-400 text-sm">Problèmes détectés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-4">
        {[
          { id: "pages" as const, label: "Analyse des pages" },
          { id: "sitemap" as const, label: "Sitemap" },
          { id: "robots" as const, label: "Robots.txt" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-pink-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
        </div>
      ) : activeTab === "pages" ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">Page</th>
                  <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">Titre</th>
                  <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">Description</th>
                  <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {allPages.map((page) => (
                  <tr key={page.path} className="hover:bg-zinc-900/50">
                    <td className="px-6 py-4">
                      <code className="text-pink-400 text-sm bg-zinc-800 px-2 py-1 rounded">{page.path}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-white text-sm truncate">{page.title}</p>
                        <p className={`text-xs ${getTitleStatus(page.titleLength).color}`}>
                          {page.titleLength} caractères - {getTitleStatus(page.titleLength).text}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-zinc-400 text-sm truncate">{page.description}</p>
                        <p className={`text-xs ${getDescriptionStatus(page.descriptionLength).color}`}>
                          {page.descriptionLength} caractères - {getDescriptionStatus(page.descriptionLength).text}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {page.issues.length === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Optimal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                          </svg>
                          {page.issues.length} avertissement{page.issues.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "sitemap" ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Entrées du sitemap ({sitemapEntries.length})</h3>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="text-pink-400 text-sm hover:underline flex items-center gap-1"
            >
              Voir sitemap.xml
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sitemapEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-zinc-900 rounded-lg">
                <code className="text-pink-400 text-sm">{entry.url}</code>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span>Priority: {entry.priority}</span>
                  <span>Freq: {entry.changefreq}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Contenu robots.txt</h3>
            <a
              href="/robots.txt"
              target="_blank"
              className="text-pink-400 text-sm hover:underline flex items-center gap-1"
            >
              Voir robots.txt
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <pre className="bg-zinc-900 p-4 rounded-lg text-sm text-zinc-300 font-mono overflow-x-auto">
            {robotsContent}
          </pre>
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-400 font-medium">Configuration optimale</p>
                <p className="text-zinc-400 text-sm mt-1">
                  Le fichier robots.txt bloque correctement l&apos;accès aux pages d&apos;administration et aux routes API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tips */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Conseils SEO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Titres de page</h4>
            <p className="text-zinc-400 text-sm">La longueur optimale d&apos;un titre est entre 30 et 60 caractères. Incluez vos mots-clés principaux.</p>
          </div>
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Meta descriptions</h4>
            <p className="text-zinc-400 text-sm">Gardez vos descriptions entre 120 et 160 caractères. Elles doivent inciter au clic.</p>
          </div>
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Images</h4>
            <p className="text-zinc-400 text-sm">Utilisez des attributs alt descriptifs et optimisez la taille des images.</p>
          </div>
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Données structurées</h4>
            <p className="text-zinc-400 text-sm">Les schémas JSON-LD améliorent l&apos;affichage dans les résultats de recherche.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
