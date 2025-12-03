import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Parse features JSON - ensure proper parsing
    const servicesWithFeatures = services.map(s => {
      let features = s.features;
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features);
        } catch {
          features = [];
        }
      }
      return {
        ...s,
        features: features || []
      };
    });

    return NextResponse.json(servicesWithFeatures);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
