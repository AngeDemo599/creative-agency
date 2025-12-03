"use client";

import Image from "next/image";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({
  fullScreen = true,
  size = "md",
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  const logoSizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 72, height: 72 },
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Logo with spinning ring */}
      <div className="relative">
        {/* Spinning ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 border-t-[#E84C89] animate-spin`}
          style={{ animationDuration: "1s" }}
        />

        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo_newin_lettre_w.png"
            alt="Newin"
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F7F3F1] flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}
