"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  logo: string;
}

export default function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-neutral-900 overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute -left-40 top-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[150px]" />
      <div className="absolute -right-40 bottom-0 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[150px]" />

      {/* Background W Logo */}
      <img
        src="/newin_w.png"
        alt=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[600px] opacity-[0.03] pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header Content */}
        <div className="flex flex-col items-center gap-6 mb-16">
          {/* Badge */}
          <div className="px-4 py-2 bg-zinc-900 rounded-full border border-gray-700 inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-pink-400 text-xs font-bold uppercase tracking-wide">
              Ils nous font confiance
            </span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Votre Confiance,
            </h2>
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Notre Priorité.
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-base md:text-lg text-center max-w-2xl leading-7">
            Nous donnons beaucoup d&apos;importance à la relation que nous entretenons avec nos clients.
            <br className="hidden md:block" />
            La disponibilité et la confiance sont primordiales pour nous.
          </p>
        </div>

        {/* Brand Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
            </div>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <div key={client.id} className="group cursor-pointer">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-14 md:h-20 w-auto max-w-[180px] object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">Aucun client pour le moment</p>
          )}
        </div>
      </div>
    </section>
  );
}
