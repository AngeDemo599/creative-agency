import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import AgencePageClient from "./AgencePageClient";

export const metadata: Metadata = {
  title: "Notre Agence",
  description: "Découvrez Newin Agency, une agence créative passionnée par l'innovation et l'excellence. Notre mission est de transformer vos idées en expériences digitales mémorables.",
  openGraph: {
    title: "Notre Agence | Newin Agency",
    description: "Découvrez Newin Agency, une agence créative passionnée par l'innovation et l'excellence.",
    type: "website",
  },
};

export default function AgencePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://newin.dz" },
          { name: "Agence", url: "https://newin.dz/agence" },
        ]}
      />
      <AgencePageClient />
    </>
  );
}
