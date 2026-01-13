import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(testimonials, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
