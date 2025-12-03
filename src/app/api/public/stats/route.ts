import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
