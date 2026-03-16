import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all media for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const media = await prisma.projectMedia.findMany({
      where: { projectId: id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching project media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// POST add new media to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get the highest order number
    const lastMedia = await prisma.projectMedia.findFirst({
      where: { projectId: id },
      orderBy: { order: "desc" },
    });

    const media = await prisma.projectMedia.create({
      data: {
        projectId: id,
        type: body.type,
        url: body.url,
        caption: body.caption || null,
        order: (lastMedia?.order ?? -1) + 1,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error adding project media:", error);
    return NextResponse.json({ error: "Failed to add media" }, { status: 500 });
  }
}

// DELETE remove media from project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("mediaId");

    if (!mediaId) {
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });
    }

    await prisma.projectMedia.delete({
      where: { id: mediaId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

// PUT update media order or caption
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.reorder && Array.isArray(body.mediaIds)) {
      // Reorder media
      const updates = body.mediaIds.map((mediaId: string, index: number) =>
        prisma.projectMedia.update({
          where: { id: mediaId },
          data: { order: index },
        })
      );
      await Promise.all(updates);
      return NextResponse.json({ success: true });
    }

    if (body.mediaId) {
      // Update single media item
      const media = await prisma.projectMedia.update({
        where: { id: body.mediaId },
        data: {
          caption: body.caption,
          order: body.order,
        },
      });
      return NextResponse.json(media);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating project media:", error);
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
  }
}
