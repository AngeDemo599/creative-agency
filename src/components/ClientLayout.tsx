"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isControlCenter = pathname?.startsWith("/controle-center");
  const isMaintenancePage = pathname === "/maintenance";
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Keyboard shortcut: Ctrl+, to open control center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        router.push("/controle-center");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Check maintenance mode
  useEffect(() => {
    // Skip check for control center and maintenance page
    if (isControlCenter || isMaintenancePage) {
      setMaintenanceChecked(true);
      return;
    }

    fetch("/api/maintenance")
      .then(res => res.json())
      .then(data => {
        if (data.enabled && !data.hasAccess) {
          setIsMaintenanceMode(true);
          router.push("/maintenance");
        } else {
          setMaintenanceChecked(true);
        }
      })
      .catch(() => {
        setMaintenanceChecked(true);
      });
  }, [pathname, isControlCenter, isMaintenancePage, router]);

  // Initial page load
  useEffect(() => {
    // Short delay then hide loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Page navigation loading
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Show loading spinner on initial load
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Redirect to maintenance page
  if (isMaintenanceMode) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  // Wait for maintenance check on public pages
  if (!maintenanceChecked && !isControlCenter && !isMaintenancePage) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Control center pages
  if (isControlCenter) {
    return <>{children}</>;
  }

  // Maintenance page (no header/footer)
  if (isMaintenancePage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Navigation loading indicator */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-[#E84C89] to-[#D63384] animate-pulse"
            style={{
              width: "100%",
              animation: "loadingBar 0.5s ease-in-out",
            }}
          />
        </div>
      )}
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />

      <style jsx>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
