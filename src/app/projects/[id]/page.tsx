import { Metadata } from "next";
import prisma from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true, description: true, image: true, category: true },
  });

  if (!project) {
    return {
      title: "Projet non trouvé",
      description: "Le projet demandé n'existe pas.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Newin Agency`,
      description: project.description,
      images: project.image ? [{ url: project.image }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Newin Agency`,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true },
  });

  return (
    <>
      {project && (
        <BreadcrumbJsonLd
          items={[
            { name: "Accueil", url: "https://newin.dz" },
            { name: "Projets", url: "https://newin.dz/projects" },
            { name: project.title, url: `https://newin.dz/projects/${id}` },
          ]}
        />
      )}
      <ProjectDetailClient projectId={id} />
    </>
  );
}
