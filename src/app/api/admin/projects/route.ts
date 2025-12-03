import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const serviceSlug = searchParams.get("serviceSlug");

    const where: Record<string, unknown> = { isActive: true };
    if (category && category !== "Tous") where.category = category;
    if (serviceSlug) where.serviceSlug = serviceSlug;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags),
    })));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags || []),
      },
    });

    return NextResponse.json({
      ...project,
      tags: JSON.parse(project.tags),
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
