"use client";

import Link from "next/link";

const tags = ["Search", "Ads Production", "Branding Strategies", "Social Media", "Packaging"];

export default function CTASection() {
  return (
    <section className="px-5 py-6">
      <div className="cta-container w-full max-w-[1536px] mx-auto p-8 md:p-12 lg:p-20 relative rounded-3xl border border-black overflow-hidden bg-[#F7F3F1] has-[.cta-button:hover]:bg-neutral-900 transition-colors duration-500">
        {/* Background Blur */}
        <div className="absolute -right-40 -top-40 w-[800px] h-[800px] opacity-10 bg-pink-800 rounded-full blur-[100px] transition-opacity duration-500" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 flex flex-col justify-start items-start gap-4">
            {/* Label */}
            <span className="cta-label text-pink-400 text-sm font-semibold uppercase leading-5 tracking-wider transition-colors duration-500">
              Commencez l&apos;aventure maintenant !
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase leading-tight">
              <span className="cta-title text-zinc-800 transition-colors duration-500">ET CREEZ UNE</span>
              <br />
              <span className="cta-title text-zinc-800 transition-colors duration-500">MARQUE FORTE</span>
              <br />
              <span className="cta-brand text-pink-800 transition-colors duration-500">QUI MARQUE LES ESPRITS.</span>
            </h2>

            {/* Tags */}
            <div className="pt-4 flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="cta-tag px-4 py-2 rounded-full border border-gray-700 text-black text-sm font-normal hover:bg-pink-800 hover:border-pink-800 hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Circular Button */}
          <Link href="/contact" className="cta-button group w-48 h-48 md:w-56 md:h-56 relative flex justify-center items-center cursor-pointer">
            {/* Outer Circle Border */}
            <div className="absolute inset-0 rounded-full border border-gray-700 group-hover:border-pink-500 transition-colors duration-500" />

            {/* Rotating Text */}
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                />
              </defs>
              <text className="fill-gray-600 group-hover:fill-pink-500 text-[11px] uppercase tracking-[0.3em] transition-colors duration-500">
                <textPath href="#circlePath">
                  Contact Us Now • Let&apos;s Work Together • Contact Us Now • Let&apos;s Work •
                </textPath>
              </text>
            </svg>

            {/* Center Button */}
            <div className="w-20 h-20 bg-pink-800 group-hover:bg-pink-600 group-hover:scale-110 rounded-full flex justify-center items-center transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-45 transition-transform duration-300">
                <path d="M9.33333 9.3335H22.6667V22.6668" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33333 22.6668L22.6667 9.3335" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
