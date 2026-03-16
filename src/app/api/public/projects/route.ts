import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

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

    // Parse tags JSON safely
    const projectsWithTags = projects.map(p => {
      let tags: string[] = [];
      try { tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []); } catch { /* malformed JSON */ }
      return { ...p, tags };
    });

    return NextResponse.json(projectsWithTags, {
      headers: {
        'Cache-Control': 'public, s-maxage=0, stale-while-revalidate=0',
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
