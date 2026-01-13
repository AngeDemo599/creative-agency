import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import TeamPageClient from "./TeamPageClient";

export const metadata: Metadata = {
  title: "Notre Équipe",
  description: "Découvrez l'équipe créative de Newin Agency. Des professionnels passionnés qui transforment vos idées en réalité.",
  openGraph: {
    title: "Notre Équipe | Newin Agency",
    description: "Découvrez l'équipe créative de Newin Agency. Des professionnels passionnés par la communication et le design.",
    type: "website",
  },
};

export default function TeamPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://newin.dz" },
          { name: "Équipe", url: "https://newin.dz/team" },
        ]}
      />
      <TeamPageClient />
    </>
  );
}
