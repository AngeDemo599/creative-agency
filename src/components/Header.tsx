"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const leftNavLinks = [
    { href: "/projects", label: "Projets" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Équipe" },
  ];

  const rightNavLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/clients", label: "Clients" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full h-20 px-6 md:px-12 lg:px-48 py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[6px] bg-[#F7F3F1]/90 flex flex-col justify-center items-center">
      <div className="w-full h-14 max-w-[1536px] px-6 relative flex justify-between items-center">

        {/* Left Navigation */}
        <div className="hidden md:flex justify-start items-center">
          {leftNavLinks.map((link, index) => (
            <div key={link.href} className={index > 0 ? "pl-8" : ""}>
              <Link
                href={link.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-5 transition-colors"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Center Logo - Absolute Positioned */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_newin.png"
              alt="Newin Agency"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="hidden md:flex justify-end items-center gap-6">
          {rightNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-5 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Get Started Button */}
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <span className="text-black text-sm font-semibold leading-5">Contactez-nous</span>
            {/* Arrow Icon */}
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3.33 8h9.34" stroke="black" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 3.33L12.67 8 8 12.67" stroke="black" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-900 p-2 ml-auto"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#F7F3F1]/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            {[...leftNavLinks, ...rightNavLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-gray-900 transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-black text-sm font-semibold mt-2 shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Contactez-nous
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3.33 8h9.34" stroke="black" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33L12.67 8 8 12.67" stroke="black" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
