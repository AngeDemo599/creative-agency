import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const stat = await prisma.stat.create({
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
    console.error("Error creating stat:", error);
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
