import { Metadata } from "next";
import prisma from "@/lib/db";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import ServicePageClient from "./ServicePageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    select: { title: true, description: true, image: true },
  });

  if (!service) {
    return {
      title: "Service non trouvé",
      description: "Le service demandé n'existe pas.",
    };
  }

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | Newin Agency`,
      description: service.description,
      images: service.image ? [{ url: service.image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Newin Agency`,
      description: service.description,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  return (
    <>
      {service && (
        <>
          <ServiceJsonLd
            name={service.title}
            description={service.description}
            provider="Newin Agency"
            url={`https://newin.dz/services/${slug}`}
            image={service.image}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "Accueil", url: "https://newin.dz" },
              { name: "Services", url: "https://newin.dz/services" },
              { name: service.title, url: `https://newin.dz/services/${slug}` },
            ]}
          />
        </>
      )}
      <ServicePageClient slug={slug} />
    </>
  );
}
