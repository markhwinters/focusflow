import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Rate limiting map (in production, use Redis or similar)
const exportRateLimit = new Map<string, { count: number; resetAt: number }>();

const MAX_EXPORTS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(clerkId: string): boolean {
  const now = Date.now();
  const userLimit = exportRateLimit.get(clerkId);

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or initialize rate limit
    exportRateLimit.set(clerkId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= MAX_EXPORTS_PER_HOUR) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Authenticate user with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    if (!checkRateLimit(clerkId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 5 exports per hour." },
        { status: 429 }
      );
    }

    // Look up the user by clerkId to get internal user id
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all user data from database using internal user id
    const [sessions, settings] = await Promise.all([
      prisma.session.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: "desc" },
        include: {
          reflection: true,
        },
      }),
      prisma.settings.findUnique({
        where: { userId: user.id },
      }),
    ]);

    // Construct the export data
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        userId: user.id,
        clerkId: clerkId,
        version: "1.0",
        dataTypes: ["sessions", "settings", "reflections"],
      },
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        createdAt: user.createdAt,
        exportedAt: new Date().toISOString(),
      },
      sessions: sessions.map((session) => ({
        id: session.id,
        type: session.type,
        duration: session.duration,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        reflection: session.reflection
          ? {
              id: session.reflection.id,
              rating: session.reflection.rating,
              notes: session.reflection.notes,
              createdAt: session.reflection.createdAt,
            }
          : null,
      })),
      settings: settings
        ? {
            defaultDuration: settings.defaultDuration,
            breakDuration: settings.breakDuration,
            soundEnabled: settings.soundEnabled,
            hapticEnabled: settings.hapticEnabled,
            updatedAt: settings.updatedAt,
          }
        : null,
      statistics: {
        totalSessions: sessions.length,
        totalFocusSessions: sessions.filter((s) => s.type === "FOCUS").length,
        totalBreakSessions: sessions.filter((s) => s.type === "BREAK").length,
        totalFocusTime: sessions
          .filter((s) => s.type === "FOCUS")
          .reduce((acc, s) => acc + s.duration, 0),
        totalBreakTime: sessions
          .filter((s) => s.type === "BREAK")
          .reduce((acc, s) => acc + s.duration, 0),
      },
    };

    // Log the export for audit purposes
    console.log(
      `[AUDIT] User ${clerkId} (internal: ${
        user.id
      }) exported their data at ${new Date().toISOString()}`
    );

    // Optional: Store export log in database
    // await prisma.auditLog.create({
    //   data: {
    //     userId: user.id,
    //     action: 'DATA_EXPORT',
    //     timestamp: new Date(),
    //   },
    // });

    // Return the data as a JSON file download
    const filename = `focusflow-data-${user.id}-${Date.now()}.json`;
    const jsonString = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
