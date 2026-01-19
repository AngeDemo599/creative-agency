"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const leftNavLinks = [
    { href: "/agence", label: "Agence" },
    { href: "/projects", label: "Projets" },
    { href: "/services", label: "Services" },
  ];

  const rightNavLinks = [
    { href: "/team", label: "Équipe" },
    { href: "/faq", label: "FAQ" },
    { href: "/clients", label: "Clients" },
  ];

  const allLinks = [...leftNavLinks, ...rightNavLinks];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "h-16 bg-[#F7F3F1]/95 shadow-md backdrop-blur-md"
          : "h-20 bg-[#F7F3F1]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[6px]"
      }`}
    >
      <div className="h-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
          {leftNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-pink-600 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button - Left side on mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-gray-900 p-2 -ml-2"
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

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_newin.png"
              alt="Newin Agency"
              width={120}
              height={40}
              className={`w-auto transition-all duration-300 ${scrolled ? "h-8" : "h-9 sm:h-10"}`}
              priority
            />
          </Link>
        </div>

        {/* Right Navigation - Desktop */}
        <div className="hidden lg:flex items-center justify-end gap-6 xl:gap-8 flex-1">
          {rightNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-pink-600 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          {/* Contact Button */}
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="hidden xl:inline">Contactez-nous</span>
            <span className="xl:hidden">Contact</span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.33 8h9.34"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 3.33L12.67 8 8 12.67"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile Contact Button - Right side */}
        <Link
          href="/contact"
          className="lg:hidden px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-sm font-semibold transition-colors"
        >
          Contact
        </Link>
      </div>

      {/* Mobile Menu - Full Screen */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-[#F7F3F1] z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto px-6 py-8">
          <div className="space-y-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-4 text-xl font-medium text-gray-900 hover:text-pink-600 transition-colors border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-4 bg-pink-600 text-white font-semibold rounded-2xl hover:bg-pink-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contactez-nous
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3.33 8h9.34"
                  stroke="currentColor"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 3.33L12.67 8 8 12.67"
                  stroke="currentColor"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
