import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    let features = [];
    try { features = JSON.parse(service.features); } catch { /* malformed JSON */ }

    return NextResponse.json({
      ...service,
      features,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

// PUT update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Get the current service to check if slug is changing
    const currentService = await prisma.service.findUnique({ where: { id } });
    if (!currentService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const newSlug = data.slug;
    const slugChanged = newSlug && newSlug !== currentService.slug;

    // Update the service and cascade slug change to projects in a transaction
    const service = await prisma.$transaction(async (tx) => {
      const updated = await tx.service.update({
        where: { id },
        data: {
          ...data,
          features: data.features ? JSON.stringify(data.features) : undefined,
        },
      });

      // If slug changed, update all projects that reference the old slug
      if (slugChanged) {
        await tx.project.updateMany({
          where: { serviceSlug: currentService.slug },
          data: { serviceSlug: newSlug },
        });
      }

      return updated;
    });

    let features = [];
    try { features = JSON.parse(service.features); } catch { /* malformed JSON */ }

    return NextResponse.json({
      ...service,
      features,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
