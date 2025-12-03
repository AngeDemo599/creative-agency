"use client";

import { useEffect, useState, useRef } from "react";

export default function CreativeMagicBanner() {
  const [phase, setPhase] = useState<'hidden' | 'bg-reveal' | 'text-reveal' | 'complete'>('hidden');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && phase === 'hidden') {
            // Start animation sequence after delay
            setTimeout(() => {
              setPhase('bg-reveal');

              setTimeout(() => {
                setPhase('text-reveal');

                setTimeout(() => {
                  setPhase('complete');
                }, 600);
              }, 700);
            }, 550); // Initial delay to sync with other text reveals
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [phase]);

  return (
    <div ref={ref} className="relative mt-4">
      {/* Purple Background Shape */}
      <div
        className={`transition-all duration-700 ease-out ${
          phase === 'hidden'
            ? 'scale-x-0 opacity-0'
            : 'scale-x-100 opacity-100'
        }`}
        style={{
          transformOrigin: 'left center',
        }}
      >
        <svg
          className="w-[300px] md:w-[500px] lg:w-[700px] h-auto"
          viewBox="0 0 785 121"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M740.961 0L785 76V121H42.9383L3.61731 33L0 0H740.961Z"
            fill="#980468"
          />
        </svg>
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-3xl md:text-5xl lg:text-7xl font-extrabold leading-[1] inline-flex">
          {['C', 'r', 'e', 'a', 't', 'i', 'v', 'e', '\u00A0', 'M', 'a', 'g', 'i', 'c'].map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-300 ${
                phase === 'text-reveal' || phase === 'complete'
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: phase === 'text-reveal' || phase === 'complete'
                  ? `${index * 40}ms`
                  : '0ms'
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
