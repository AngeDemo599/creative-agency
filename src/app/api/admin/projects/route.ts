import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

// Generate project ID from name + random sequence
function generateProjectId(title: string): string {
  // Convert title to slug: lowercase, replace spaces/special chars with hyphens
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, 30); // Limit length

  // Generate random 6-character hex sequence
  const randomSuffix = crypto.randomBytes(3).toString("hex");

  return `${slug}-${randomSuffix}`;
}

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const serviceSlug = searchParams.get("serviceSlug");

    // Admin route: show ALL projects (including inactive)
    const where: Record<string, unknown> = {};
    if (category && category !== "Tous") where.category = category;
    if (serviceSlug) where.serviceSlug = serviceSlug;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects.map(p => {
      let tags: string[] = [];
      try { tags = JSON.parse(p.tags || "[]"); } catch { /* malformed JSON */ }
      return { ...p, tags };
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST create new project (supports single or bulk creation)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Support bulk creation
    if (Array.isArray(data)) {
      const currentCount = await prisma.project.count();
      const projects = await Promise.all(
        data.map((item, index) =>
          prisma.project.create({
            data: {
              id: generateProjectId(item.title || `project-${index}`),
              title: item.title || `Project ${currentCount + index + 1}`,
              description: item.description || "",
              image: item.image,
              category: item.category || "Branding",
              tags: JSON.stringify(item.tags || []),
              serviceSlug: item.serviceSlug || null,
              featured: item.featured || false,
              order: item.order ?? currentCount + index,
              isActive: item.isActive ?? true,
            },
          })
        )
      );
      return NextResponse.json(
        projects.map((p) => {
          let tags: string[] = [];
          try { tags = JSON.parse(p.tags || "[]"); } catch { /* malformed JSON */ }
          return { ...p, tags };
        })
      );
    }

    // Single creation
    const customId = generateProjectId(data.title || "project");

    const project = await prisma.project.create({
      data: {
        id: customId,
        ...data,
        tags: JSON.stringify(data.tags || []),
      },
    });

    let tags: string[] = [];
    try { tags = JSON.parse(project.tags || "[]"); } catch { /* malformed JSON */ }

    return NextResponse.json({
      ...project,
      tags,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
