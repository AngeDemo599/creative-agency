import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");
    const format = searchParams.get("format");

    const where = group ? { group } : {};
    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: { key: 'asc' }
    });

    // Return array for admin page, object for public pages
    if (format === "object") {
      const settingsObj: Record<string, string> = {};
      settings.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      return NextResponse.json(settingsObj);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Handle array of settings from admin page
    if (Array.isArray(data)) {
      for (const setting of data) {
        await prisma.siteSetting.update({
          where: { id: setting.id },
          data: { value: setting.value }
        });
      }
      return NextResponse.json({ success: true });
    }

    // Handle object format
    for (const [key, value] of Object.entries(data)) {
      // Determine the correct group based on the key prefix
      let group = "general";
      if (key.startsWith("maintenance_")) {
        group = "maintenance";
      } else if (key.startsWith("contact_") || key === "map_url") {
        group = "contact";
      } else if (key.startsWith("social_")) {
        group = "social";
      }

      // Try to get existing setting to preserve its group
      const existingSetting = await prisma.siteSetting.findUnique({
        where: { key },
        select: { group: true }
      });

      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          group: existingSetting?.group || group,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
