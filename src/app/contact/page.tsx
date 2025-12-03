"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Settings {
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_website?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_tiktok?: string;
  map_url?: string;
}

interface Service {
  id: string;
  title: string;
}

interface AvailableSlots {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });

  // Meeting booking state
  const [meetingTab, setMeetingTab] = useState<"message" | "meeting">("message");
  const [meetingForm, setMeetingForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/public/settings").then(res => res.json()),
      fetch("/api/public/services").then(res => res.json())
    ]).then(([settingsData, servicesData]) => {
      setSettings(settingsData);
      setServices(servicesData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Adresse",
      content: settings.contact_address || "Algérie",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      content: settings.contact_email || "contact@newin.dz",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Téléphone",
      content: settings.contact_phone || "0770 25 77 85",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: "Site Web",
      content: settings.contact_website || "www.newin.dz",
    },
  ];

  const serviceOptions = services.length > 0
    ? [...services.map(s => s.title), "Other"]
    : ["Branding & Identity", "Ads Production", "Social Media", "Web Development", "Packaging Design", "Market Research", "Other"];

  // Fetch available time slots when date changes
  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/public/meetings?date=${date}`);
      const data = await res.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date: string) => {
    setMeetingForm({ ...meetingForm, date, time: "" });
    if (date) {
      fetchAvailableSlots(date);
    } else {
      setAvailableSlots(null);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);
    setBookingStatus("idle");

    try {
      const res = await fetch("/api/public/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingForm),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingStatus("success");
        setBookingMessage(data.message || "Meeting booked successfully!");
        setMeetingForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          date: "",
          time: "",
          notes: "",
        });
        setAvailableSlots(null);
      } else {
        setBookingStatus("error");
        setBookingMessage(data.error || "Failed to book meeting");
      }
    } catch {
      setBookingStatus("error");
      setBookingMessage("An error occurred. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get maximum date (2 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    return maxDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Combine service and budget into subject
      const subject = `${formData.service}${formData.budget ? ` - Budget: ${formData.budget}` : ""}`;

      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          subject: subject,
          message: formData.message,
          service: formData.service,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-zinc-700">Contact</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mt-3 mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-zinc-600 text-lg">
              Prêt à transformer votre marque? Contactez-nous et discutons de vos idées.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 rounded-[32px] p-8 md:p-10">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Informations de contact
                </h2>

                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                        <p className="text-zinc-400 text-sm whitespace-pre-line">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-10 pt-8 border-t border-zinc-800">
                  <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    <a href={settings.social_facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-pink-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href={settings.social_instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-pink-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href={settings.social_linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-pink-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href={settings.social_tiktok || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-pink-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form / Meeting Booking */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[32px] p-8 md:p-10">
                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => setMeetingTab("message")}
                    className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                      meetingTab === "message"
                        ? "bg-pink-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Envoyer un message
                    </span>
                  </button>
                  <button
                    onClick={() => setMeetingTab("meeting")}
                    className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                      meetingTab === "meeting"
                        ? "bg-pink-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Réserver un rendez-vous
                    </span>
                  </button>
                </div>

                {meetingTab === "message" ? (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-zinc-500 mb-8">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Nom complet *</label>
                          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" placeholder="Votre nom" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Email *</label>
                          <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" placeholder="votre@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Téléphone</label>
                          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" placeholder="0XXX XX XX XX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Entreprise</label>
                          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" placeholder="Nom de votre entreprise" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Service souhaité *</label>
                          <select required value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all bg-white">
                            <option value="">Sélectionnez un service</option>
                            {serviceOptions.map((service) => (<option key={service} value={service}>{service}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">Budget estimé</label>
                          <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all bg-white">
                            <option value="">Sélectionnez un budget</option>
                            <option value="< 100,000 DZD">&lt; 100,000 DZD</option>
                            <option value="100,000 - 300,000 DZD">100,000 - 300,000 DZD</option>
                            <option value="300,000 - 500,000 DZD">300,000 - 500,000 DZD</option>
                            <option value="500,000 - 1,000,000 DZD">500,000 - 1,000,000 DZD</option>
                            <option value="> 1,000,000 DZD">&gt; 1,000,000 DZD</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">Message *</label>
                        <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all resize-none" placeholder="Décrivez votre projet..." />
                      </div>
                      {submitStatus === "success" && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                          Merci pour votre message! Nous vous contacterons dans les plus brefs délais.
                        </div>
                      )}
                      {submitStatus === "error" && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                          Une erreur est survenue. Veuillez réessayer plus tard.
                        </div>
                      )}
                      <button type="submit" disabled={submitting} className="w-full md:w-auto px-8 py-4 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                        {submitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      Réservez un rendez-vous
                    </h2>
                    <p className="text-zinc-500 mb-8">
                      Choisissez une date et un créneau horaire pour discuter de votre projet avec notre équipe.
                    </p>

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Nom complet *
                          </label>
                          <input
                            type="text"
                            required
                            value={meetingForm.name}
                            onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                            placeholder="Votre nom"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={meetingForm.email}
                            onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                            placeholder="votre@email.com"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={meetingForm.phone}
                            onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                            placeholder="0XXX XX XX XX"
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Entreprise
                          </label>
                          <input
                            type="text"
                            value={meetingForm.company}
                            onChange={(e) => setMeetingForm({ ...meetingForm, company: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                            placeholder="Nom de votre entreprise"
                          />
                        </div>
                      </div>

                      {/* Service */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Service souhaité
                        </label>
                        <select
                          value={meetingForm.service}
                          onChange={(e) => setMeetingForm({ ...meetingForm, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all bg-white"
                        >
                          <option value="">Sélectionnez un service</option>
                          {serviceOptions.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Date du rendez-vous *
                        </label>
                        <input
                          type="date"
                          required
                          value={meetingForm.date}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={getMinDate()}
                          max={getMaxDate()}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                        />
                      </div>

                      {/* Time Slots */}
                      {meetingForm.date && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-3">
                            Créneau horaire *
                          </label>
                          {loadingSlots ? (
                            <div className="flex items-center justify-center py-8">
                              <svg className="animate-spin h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            </div>
                          ) : availableSlots && availableSlots.availableSlots.length > 0 ? (
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                              {availableSlots.availableSlots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setMeetingForm({ ...meetingForm, time: slot })}
                                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                                    meetingForm.time === slot
                                      ? "bg-pink-600 text-white"
                                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-500 py-4 text-center bg-zinc-50 rounded-xl">
                              Aucun créneau disponible pour cette date. Veuillez choisir une autre date.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Notes (optionnel)
                        </label>
                        <textarea
                          rows={3}
                          value={meetingForm.notes}
                          onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all resize-none"
                          placeholder="Décrivez brièvement le sujet de la réunion..."
                        />
                      </div>

                      {/* Status Messages */}
                      {bookingStatus === "success" && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                          {bookingMessage}
                        </div>
                      )}

                      {bookingStatus === "error" && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                          {bookingMessage}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={bookingSubmitting || !meetingForm.time}
                        className="w-full md:w-auto px-8 py-4 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {bookingSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Réservation en cours...
                          </>
                        ) : (
                          <>
                            Réserver le rendez-vous
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-900 rounded-[32px] p-4 h-[400px] overflow-hidden">
            <iframe
              src={settings.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.086519158798!2d3.0587564!3d36.7525473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb26977ea659f%3A0x4e74f54d98e8ca26!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2s!4v1635789456789!5m2!1sen!2s"}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "24px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
