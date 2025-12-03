import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stat = await prisma.stat.findUnique({
      where: { id },
    });
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error fetching stat:", error);
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const stat = await prisma.stat.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        suffix: data.suffix || "+",
        icon: data.icon || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error updating stat:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.stat.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stat:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
