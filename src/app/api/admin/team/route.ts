import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio || null,
        image: data.image,
        linkedin: data.linkedin || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
