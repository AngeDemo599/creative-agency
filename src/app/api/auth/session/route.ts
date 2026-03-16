import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, role: true, permissions: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Update last login
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: (() => { try { return JSON.parse(user.permissions || "[]"); } catch { return []; } })(),
      }
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
