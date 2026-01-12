import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

function generateClientId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 20);
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${slug || "client"}-${randomSuffix}`;
}

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Support bulk creation
    if (Array.isArray(data)) {
      const currentCount = await prisma.client.count();
      const clients = await Promise.all(
        data.map((item, index) =>
          prisma.client.create({
            data: {
              id: generateClientId(item.name || `client-${index}`),
              name: item.name || `Client ${currentCount + index + 1}`,
              logo: item.logo,
              invert: item.invert || false,
              order: item.order ?? currentCount + index,
              isActive: item.isActive ?? true,
            }
          })
        )
      );
      return NextResponse.json(clients);
    }

    // Single creation
    const client = await prisma.client.create({
      data: {
        id: generateClientId(data.name || "client"),
        ...data
      }
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
