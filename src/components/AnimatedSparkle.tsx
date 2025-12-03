"use client";

import { useEffect, useState } from "react";

const icons = [
  // Sparkle/Star
  <svg key="sparkle" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 56 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.9975 7.85778C20.432 7.85787 20.8547 7.99698 21.2016 8.25407C21.5485 8.51116 21.8007 8.87223 21.92 9.28266L24.0879 16.7371C24.5547 18.3425 25.4304 19.8045 26.6322 20.9851C27.8341 22.1656 29.3225 23.0258 30.9569 23.4843L38.5458 25.6137C38.9634 25.7312 39.3306 25.9791 39.5921 26.3198C39.8535 26.6605 39.995 27.0756 39.995 27.5022C39.995 27.9289 39.8535 28.344 39.5921 28.6847C39.3306 29.0254 38.9634 29.2732 38.5458 29.3907L30.9569 31.5202C29.3225 31.9787 27.8341 32.8388 26.6322 34.0194C25.4304 35.2 24.5547 36.662 24.0879 38.2674L21.92 45.7218C21.8004 46.132 21.5481 46.4927 21.2012 46.7495C20.8544 47.0064 20.4318 47.1453 19.9975 47.1453C19.5631 47.1453 19.1406 47.0064 18.7937 46.7495C18.4468 46.4927 18.1945 46.132 18.0749 45.7218L15.907 38.2674C15.4403 36.662 14.5646 35.2 13.3627 34.0194C12.1608 32.8388 10.6724 31.9787 9.03807 31.5202L1.44915 29.3907C1.03158 29.2732 0.664313 29.0254 0.402864 28.6847C0.141415 28.344 0 27.9289 0 27.5022C0 27.0756 0.141415 26.6605 0.402864 26.3198C0.664313 25.9791 1.03158 25.7312 1.44915 25.6137L9.03807 23.4843C10.6724 23.0258 12.1608 22.1656 13.3627 20.9851C14.5646 19.8045 15.4403 18.3425 15.907 16.7371L18.0749 9.28266C18.1943 8.87223 18.4465 8.51116 18.7934 8.25407C19.1402 7.99698 19.5629 7.85787 19.9975 7.85778ZM43.9962 0C44.4423 0 44.8758 0.14606 45.2275 0.415641C45.5793 0.685221 45.8291 1.0626 45.9374 1.48774L46.6254 4.20129C47.2547 6.6634 49.2119 8.58593 51.7184 9.20408L54.4809 9.87985C54.9146 9.98536 55.2998 10.2304 55.5751 10.576C55.8504 10.9216 56 11.3478 56 11.7867C56 12.2255 55.8504 12.6517 55.5751 12.9973C55.2998 13.3429 54.9146 13.588 54.4809 13.6935L51.7184 14.3693C49.2119 14.9874 47.2547 16.9099 46.6254 19.372L45.9374 22.0856C45.83 22.5116 45.5805 22.8899 45.2286 23.1604C44.8768 23.4308 44.4429 23.5777 43.9962 23.5777C43.5494 23.5777 43.1155 23.4308 42.7637 23.1604C42.4119 22.8899 42.1624 22.5116 42.0549 22.0856L41.367 19.372C41.0593 18.1631 40.4229 17.059 39.5258 16.1778C38.6287 15.2966 37.5047 14.6715 36.2739 14.3693L33.5114 13.6935C33.0778 13.588 32.6926 13.3429 32.4173 12.9973C32.1419 12.6517 31.9923 12.2255 31.9923 11.7867C31.9923 11.3478 32.1419 10.9216 32.4173 10.576C32.6926 10.2304 33.0778 9.98536 33.5114 9.87985L36.2739 9.20408C37.5047 8.90185 38.6287 8.27673 39.5258 7.39555C40.4229 6.51437 41.0593 5.41027 41.367 4.20129L42.0549 1.48774C42.1632 1.0626 42.4131 0.685221 42.7648 0.415641C43.1166 0.14606 43.55 0 43.9962 0ZM39.9964 35.36C40.4164 35.3598 40.8258 35.4894 41.1666 35.7306C41.5074 35.9718 41.7622 36.3123 41.895 36.7037L42.9456 39.8023C43.3455 40.9731 44.2788 41.8951 45.4734 42.2853L48.6279 43.3199C49.0251 43.4509 49.3704 43.7012 49.6151 44.0353C49.8597 44.3695 49.9913 44.7707 49.9913 45.1822C49.9913 45.5938 49.8597 45.995 49.6151 46.3291C49.3704 46.6633 49.0251 46.9135 48.6279 47.0445L45.4734 48.0791C44.2815 48.472 43.3429 49.3888 42.9456 50.5622L41.8923 53.6608C41.7589 54.051 41.5042 54.3901 41.164 54.6304C40.8238 54.8707 40.4154 55 39.9964 55C39.5774 55 39.169 54.8707 38.8288 54.6304C38.4886 54.3901 38.2339 54.051 38.1005 53.6608L37.0472 50.5622C36.8508 49.9841 36.5201 49.4588 36.0814 49.0278C35.6427 48.5969 35.1079 48.2721 34.5194 48.0791L31.3649 47.0445C30.9676 46.9135 30.6223 46.6633 30.3777 46.3291C30.1331 45.995 30.0015 45.5938 30.0015 45.1822C30.0015 44.7707 30.1331 44.3695 30.3777 44.0353C30.6223 43.7012 30.9676 43.4509 31.3649 43.3199L34.5194 42.2853C35.7113 41.8924 36.6499 40.9757 37.0472 39.8023L38.1005 36.7037C38.2331 36.3127 38.4875 35.9725 38.8277 35.7314C39.168 35.4902 39.5768 35.3603 39.9964 35.36Z" fill="white"/>
  </svg>,
  // Brush
  <svg key="brush" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.37 2.63L14 7L17 10L21.37 5.63C22.21 4.79 22.21 3.47 21.37 2.63C20.53 1.79 19.21 1.79 18.37 2.63Z" fill="white"/>
    <path d="M14 7L5.91 15.09C5.5 15.5 5.18 16 5 16.54L3 22L8.46 20C9 19.82 9.5 19.5 9.91 19.09L17 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // Pen tool
  <svg key="pen" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19L19 12L22 15L15 22L12 19Z" fill="white"/>
    <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11" cy="11" r="2" fill="white"/>
  </svg>,
  // Palette
  <svg key="palette" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8284 22 13.5 21.3284 13.5 20.5C13.5 20.1 13.35 19.75 13.1 19.5C12.85 19.2 12.7 18.85 12.7 18.45C12.7 17.6216 13.3716 16.95 14.2 16.95H16C19.3137 16.95 22 14.2637 22 10.95C22 6.00329 17.5228 2 12 2Z" stroke="white" strokeWidth="2"/>
    <circle cx="7.5" cy="11.5" r="1.5" fill="white"/>
    <circle cx="12" cy="7.5" r="1.5" fill="white"/>
    <circle cx="16.5" cy="11.5" r="1.5" fill="white"/>
  </svg>,
  // Lightbulb
  <svg key="lightbulb" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 21H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 11.3869 6.14514 13.4966 7.9 14.8C8.6 15.3 9 16.1 9 17V18H15V17C15 16.1 15.4 15.3 16.1 14.8C17.8549 13.4966 19 11.3869 19 9C19 5.13401 15.866 2 12 2Z" fill="white"/>
  </svg>,
];

// Loading spinner component
const LoadingSpinner = () => (
  <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
    <div className="absolute inset-0 border-3 border-white/30 rounded-full"></div>
    <div className="absolute inset-0 border-3 border-transparent border-t-white rounded-full animate-spin"></div>
  </div>
);

export default function AnimatedSparkle() {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [phase, setPhase] = useState<'icon' | 'fadeOut' | 'loading' | 'fadeIn'>('icon');

  useEffect(() => {
    const sequence = () => {
      // Phase 1: Show icon for 2 seconds
      setPhase('icon');

      setTimeout(() => {
        // Phase 2: Fade out icon
        setPhase('fadeOut');

        setTimeout(() => {
          // Phase 3: Show loading for 1 second
          setPhase('loading');

          setTimeout(() => {
            // Phase 4: Change icon and fade in
            setCurrentIcon((prev) => (prev + 1) % icons.length);
            setPhase('fadeIn');

            setTimeout(() => {
              // Back to showing icon
              setPhase('icon');
            }, 300);
          }, 800);
        }, 300);
      }, 2000);
    };

    sequence();
    const interval = setInterval(sequence, 3400); // Total cycle time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-pink-500 rounded-full blur-xl transition-opacity duration-300 ${
        phase === 'loading' ? 'opacity-70 animate-pulse' : 'opacity-40'
      }`} />

      {/* Main container */}
      <div className="relative w-full h-full bg-gradient-to-br from-pink-700 to-pink-900 rounded-full shadow-xl flex justify-center items-center overflow-hidden">

        {/* Icon display */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          phase === 'icon' ? 'opacity-100 scale-100' :
          phase === 'fadeOut' ? 'opacity-0 scale-75' :
          phase === 'loading' ? 'opacity-0 scale-50' :
          phase === 'fadeIn' ? 'opacity-100 scale-100' : ''
        }`}>
          {icons[currentIcon]}
        </div>

        {/* Loading spinner */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          phase === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <LoadingSpinner />
        </div>
      </div>

      {/* Sparkle particles that appear on icon reveal */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full transition-all duration-300 ${
        phase === 'fadeIn' || phase === 'icon' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`} style={{ animationDelay: '100ms' }} />
      <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full transition-all duration-500 ${
        phase === 'fadeIn' || phase === 'icon' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`} style={{ animationDelay: '200ms' }} />
      <div className={`absolute top-0 -left-1 w-1 h-1 bg-white rounded-full transition-all duration-500 ${
        phase === 'fadeIn' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`} style={{ animationDelay: '150ms' }} />
    </div>
  );
}
