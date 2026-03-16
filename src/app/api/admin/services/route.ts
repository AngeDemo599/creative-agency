import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(services.map(s => {
      let features = [];
      try { features = JSON.parse(s.features); } catch { /* malformed JSON */ }
      return { ...s, features };
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const service = await prisma.service.create({
      data: {
        ...data,
        features: JSON.stringify(data.features || []),
      },
    });

    let features = [];
    try { features = JSON.parse(service.features); } catch { /* malformed JSON */ }

    return NextResponse.json({
      ...service,
      features,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
