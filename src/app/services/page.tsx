"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CTASection from "@/components/CTASection";

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: { title: string; description: string }[];
  slug: string;
}

const process = [
  {
    id: "01",
    title: "Discovery",
    description: "We start by understanding your brand, goals, and target audience through in-depth research and consultation.",
    tag: "Research First",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Strategy",
    description: "Based on our findings, we develop a comprehensive strategy tailored to your specific needs and objectives.",
    tag: "Data Driven",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Creation",
    description: "Our creative team brings the strategy to life with compelling designs and content that resonate with your audience.",
    tag: "Pixel Perfect",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Delivery",
    description: "We deliver the final product and provide ongoing support to ensure your continued success.",
    tag: "Ongoing Support",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5.83331 5.8335H14.1666V14.1668" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.83331 14.1668L14.1666 5.8335" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ServiceCardLight({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="w-full md:w-[calc(33.333%-12px)] lg:w-[calc(33.333%-12px)] xl:w-[calc(25%-12px)] h-[420px] relative bg-[#F7F3F1] hover:bg-pink-800 rounded-[32px] overflow-hidden group cursor-pointer transition-all duration-500 border border-zinc-200 hover:border-pink-800 block">
      {/* Title */}
      <div className="absolute top-6 left-6 right-6">
        <h3 className="text-pink-600 group-hover:text-white text-2xl md:text-3xl font-bold leading-tight whitespace-pre-line transition-colors duration-300">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <div className="absolute top-28 left-6 right-6">
        <p className="text-zinc-600 group-hover:text-white/90 text-sm leading-relaxed transition-colors duration-300">
          {service.description}
        </p>
        {/* Features */}
        <ul className="mt-3 space-y-1">
          {service.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-zinc-500 group-hover:text-white/70 transition-colors duration-300">
              <svg className="w-3 h-3 text-pink-500 group-hover:text-white/80 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Image */}
      <div className="absolute bottom-6 left-6 right-6 h-36 rounded-3xl overflow-hidden">
        <img
          src={service.image}
          alt={service.title.replace('\n', ' ')}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Arrow Button */}
      <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-zinc-300 group-hover:border-white/30 bg-transparent flex justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.4] group-hover:rotate-[360deg] group-hover:border-transparent group-hover:bg-white group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)]">
        <ArrowIcon className="text-zinc-600 group-hover:text-black transition-colors duration-300" />
      </div>
    </Link>
  );
}

function ProcessCard({ step, index, activeStep, setActiveStep }: {
  step: typeof process[0];
  index: number;
  activeStep: number;
  setActiveStep: (index: number) => void;
}) {
  const isActive = activeStep === index;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setActiveStep(index)}
    >
      {/* Card Content */}
      <div
        className={`
          relative h-full p-6 rounded-3xl border transition-all duration-500
          flex flex-col justify-between overflow-hidden
          ${isActive
            ? 'bg-zinc-900/80 border-zinc-700 shadow-2xl shadow-pink-500/10 -translate-y-2'
            : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700/80'
          }
        `}
      >
        {/* Gradient Blob inside card */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-pink-800/20 blur-[60px] rounded-full -mr-10 -mt-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`} />

        {/* Top Section */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Step {step.id}</span>
            <div className={`p-3 rounded-2xl bg-neutral-950/50 border border-zinc-800 text-pink-500 transition-transform duration-500 ${isActive ? 'scale-110 rotate-3' : ''}`}>
              {step.icon}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
            {step.title}
          </h3>

          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            {step.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-950/80 border border-zinc-800 text-pink-400">
            {step.tag}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-pink-600 text-white rotate-0' : 'bg-zinc-800 text-zinc-400 -rotate-45'}`}>
            {isActive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Connector Arrow (Desktop Only) */}
      {index < process.length - 1 && (
        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-500 shadow-xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      )}

      {/* Connector Line (Mobile Only) */}
      {index < process.length - 1 && (
        <div className="lg:hidden h-8 w-0.5 bg-gradient-to-b from-zinc-800 to-transparent mx-auto my-2 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-800" />
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-zinc-700">Nos Services</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Nos Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
              Ce que nous faisons
            </h1>
            <p className="text-zinc-600 text-lg">
              Des solutions créatives complètes pour transformer votre vision en réalité et propulser votre marque vers de nouveaux sommets.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Light Theme */}
      <section className="px-5 py-6">
        <div className="relative bg-white rounded-[48px] px-6 md:px-12 lg:px-24 py-12 md:py-20 overflow-hidden border border-zinc-200">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-[0.03]">
            <img
              src="/newin_w.png"
              alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-auto"
            />
          </div>

          {/* Pink blur effects */}
          <div className="absolute -left-40 top-0 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute -right-40 bottom-0 w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[150px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-12 md:gap-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8">
              <h2 className="text-neutral-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Our Services
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed max-w-md">
                Transform ideas into reality by combining creativity, strategy, and expertise. We build digital products that people love.
              </p>
            </div>

            {/* Services Grid - Adaptive */}
            <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
              {loading ? (
                <div className="flex justify-center py-16 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
                </div>
              ) : services.map((service) => (
                <ServiceCardLight key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - New Design */}
      <section className="py-20 px-6 bg-neutral-900 relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-800/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm font-medium text-zinc-400">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Notre Processus</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Comment nous travaillons
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
              De la conception initiale au lancement final, notre processus garantit que votre vision est réalisée avec précision et créativité.
            </p>
          </div>

          {/* Steps Container */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
            {process.map((step, index) => (
              <ProcessCard
                key={step.id}
                step={step}
                index={index}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>

          {/* Bottom CTA Area */}
          <div className="mt-16 text-center relative z-10">
            <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800">
              <div className="bg-neutral-950 rounded-full px-8 py-4">
                <p className="text-sm text-zinc-300 font-medium">
                  Prêt à commencer votre projet?
                  <Link href="/contact" className="text-pink-400 hover:underline ml-1">
                    Contactez-nous
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Notre processus est itératif et collaboratif. Nous valorisons votre contribution à chaque étape pour garantir un résultat qui dépasse vos attentes.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
