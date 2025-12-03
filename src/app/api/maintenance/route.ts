import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

// Check maintenance status
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["maintenance_enabled", "maintenance_message"]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    const cookieStore = await cookies();
    const hasAccess = cookieStore.get("maintenance_access")?.value === "granted";

    return NextResponse.json({
      enabled: settingsMap.maintenance_enabled === "true",
      message: settingsMap.maintenance_message || "Site en maintenance",
      hasAccess
    });
  } catch (error) {
    console.error("Error checking maintenance:", error);
    return NextResponse.json({ enabled: false, hasAccess: true });
  }
}

// Verify password and grant access
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const setting = await prisma.siteSetting.findUnique({
      where: { key: "maintenance_password" }
    });

    if (setting && setting.value === password) {
      const response = NextResponse.json({ success: true });

      // Set cookie for 24 hours
      response.cookies.set("maintenance_access", "granted", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
