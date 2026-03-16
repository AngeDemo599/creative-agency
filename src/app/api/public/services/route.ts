import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Parse features JSON - ensure proper parsing
    const servicesWithFeatures = services.map(s => {
      let parsedFeatures: string[] = [];
      if (typeof s.features === 'string' && s.features) {
        try {
          parsedFeatures = JSON.parse(s.features);
        } catch {
          parsedFeatures = [];
        }
      }
      return {
        ...s,
        features: parsedFeatures
      };
    });

    return NextResponse.json(servicesWithFeatures, {
      headers: {
        'Cache-Control': 'public, s-maxage=0, stale-while-revalidate=0',
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
