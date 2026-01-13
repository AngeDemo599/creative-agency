import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get("serviceSlug");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { isActive: true };
    if (serviceSlug) where.serviceSlug = serviceSlug;
    if (category && category !== "Tous") where.category = category;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    // Parse tags JSON
    const projectsWithTags = projects.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
    }));

    return NextResponse.json(projectsWithTags, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
