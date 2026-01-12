import AnimatedSparkle from "@/components/AnimatedSparkle";
import TextReveal from "@/components/TextReveal";
import CreativeMagicBanner from "@/components/CreativeMagicBanner";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ExpertiseSection from "@/components/ExpertiseSection";
import ClientsSection from "@/components/ClientsSection";
import CTASection from "@/components/CTASection";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F3F1]">
      {/* Hero Section */}
      <section className="py-12 flex flex-col justify-center items-center gap-0 overflow-hidden bg-[#F7F3F1]">
        <div className="w-full flex flex-col justify-start items-center gap-2.5 px-4">
          {/* Subtitle */}
          <TextReveal delay={0}>
            <p className="text-center text-gray-500 text-xs font-medium uppercase leading-4 tracking-tight">
              Crafting Experiences that Inspire
            </p>
          </TextReveal>

          {/* Heading Area */}
          <div className="relative w-full max-w-6xl h-[350px] md:h-[380px] lg:h-[420px] mt-4">
            {/* Gradient Blurs */}
            <div className="hidden md:block absolute w-28 h-56 -right-10 bottom-0 -rotate-45 opacity-80 bg-gradient-to-bl from-pink-300 to-pink-800 rounded-full blur-lg" />
            <div className="hidden md:block absolute w-32 h-60 -left-10 -top-10 rotate-45 opacity-80 bg-gradient-to-bl from-pink-300 to-pink-800 rounded-full blur-lg" />

            {/* Main Heading */}
            <div className="relative z-10 flex flex-col items-center pt-8 md:pt-12">
              <TextReveal delay={100}>
                <h1 className="text-center text-neutral-900 text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1] mb-2">
                  Elevate Your
                </h1>
              </TextReveal>

              <div className="flex items-center justify-center gap-3 md:gap-6 mb-2">
                <TextReveal delay={250}>
                  <span className="text-neutral-900 text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1]">
                    Brand
                  </span>
                </TextReveal>

                {/* Animated Sparkle Icon */}
                <AnimatedSparkle />

                <TextReveal delay={400}>
                  <span className="text-neutral-900 text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1]">
                    with Our
                  </span>
                </TextReveal>
              </div>

              {/* Creative Magic Banner */}
              <CreativeMagicBanner />
            </div>

            {/* Decorative Circles - Hidden on mobile */}
            {/* Left side */}
            <div className="hidden lg:block absolute w-56 h-56 -left-10 -top-16 rotate-12 rounded-full overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=300&fit=crop" alt="" className="w-full h-full object-cover -rotate-12 scale-125" />
            </div>
            <div className="hidden lg:block absolute w-44 h-44 left-20 top-56 rotate-12 rounded-full overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:block absolute w-20 h-20 left-0 bottom-10 rotate-12 bg-pink-800 rounded-full shadow-xl" />

            {/* Right side */}
            <div className="hidden lg:block absolute w-56 h-56 -right-10 -top-16 rotate-12 rounded-full overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop" alt="" className="w-full h-full object-cover -rotate-12 scale-125" />
            </div>
            <div className="hidden lg:block absolute w-20 h-20 right-32 top-56 rotate-12 bg-pink-800 rounded-full shadow-xl" />
            <div className="hidden lg:block absolute w-36 h-36 right-0 bottom-10 rotate-12 rounded-full overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover -rotate-12 scale-125" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection />
      </section>

      {/* Team Section - Notre Équipe */}
      <section className="relative min-h-[585px] bg-neutral-900 rounded-b-[10px] overflow-hidden">
        {/* Main Image - Left Side */}
        <div className="absolute left-0 top-0 w-full lg:w-[55%] h-full">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1110&h=585&fit=crop"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-900/70 to-neutral-900" />
        </div>

        {/* Grid Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 min-h-[585px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full py-16 lg:py-24">
            {/* Left side - Empty on desktop (image shows through) */}
            <div className="hidden lg:block"></div>

            {/* Right side - Content */}
            <div className="relative">
              {/* newin_w.png as background element */}
              <img
                src="/newin_w.png"
                alt=""
                className="absolute -right-10 md:-right-20 lg:-right-32 top-1/2 -translate-y-1/2 w-[280px] md:w-[400px] lg:w-[500px] opacity-15 pointer-events-none"
              />

              {/* Text Content */}
              <div className="relative z-10 flex flex-col gap-6">
                {/* Heading */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-4xl md:text-5xl font-extrabold uppercase leading-[1.1]">
                    NEWIN AGENCY™
                  </h2>
                  <span className="text-pink-600 text-xl md:text-2xl font-light">
                    Agence Créative & Digitale
                  </span>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-4 max-w-[550px]">
                  <p className="text-white text-base md:text-lg font-normal leading-7">
                    <span className="text-pink-500 font-semibold">NEWIN AGENCY™</span> est une agence de communication créative & digitale basée à <span className="text-pink-400">Bir Khadem</span>.
                  </p>
                  <p className="text-white/90 text-sm md:text-base font-normal leading-7">
                    Notre équipe de talentueux graphistes & experts en communication digitale partage une passion commune pour l&apos;esthétique & l&apos;innovation.
                  </p>
                  <p className="text-white/80 text-sm md:text-base font-normal leading-7">
                    Notre expertise s&apos;étend à tous les domaines du graphisme, de la conception de logos et d&apos;identités visuelles percutantes à la réalisation de supports de communication imprimés et numériques.
                  </p>
                  <p className="text-white/70 text-sm md:text-base font-normal leading-7">
                    Nous sommes également spécialisés dans la création de stratégies digitales percutantes pour propulser votre marque, en intégrant les réseaux sociaux et les campagnes publicitaires.
                  </p>
                </div>

                {/* Button */}
                <a
                  href="/team"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors w-fit mt-2"
                >
                  <span className="text-black text-sm font-semibold underline">
                    Notre équipe
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33334 8H12.6667" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                {/* Animated Hashtag Marquee - Two rows with opposite directions */}
                <div className="mt-8 space-y-3 overflow-hidden w-full max-w-[550px]">
                  {/* First row - left to right */}
                  <div className="flex animate-marquee whitespace-nowrap">
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#MARKETING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#AGENCY</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#DESIGN</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#BRANDING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#CREATIVE</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#MARKETING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#AGENCY</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#DESIGN</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#BRANDING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>#CREATIVE</span>
                  </div>
                  {/* Second row - right to left */}
                  <div className="flex animate-marquee-reverse whitespace-nowrap">
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#SOCIAL MEDIA</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#PACKAGING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#IDENTITY</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#NEWIN</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#DIGITAL</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#SOCIAL MEDIA</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#PACKAGING</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#IDENTITY</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#NEWIN</span>
                    <span className="text-transparent text-lg md:text-xl font-bold uppercase tracking-wider mx-3" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>#DIGITAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <ProjectsShowcase />

      {/* Brands Section - Ils nous font confiance */}
      <ClientsSection />

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Expertise Section */}
      <ExpertiseSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
