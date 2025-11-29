import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.settings) {
      const settings = await db.settings.create({
        data: {
          userId: user.id,
        },
      });
      return NextResponse.json(settings);
    }

    return NextResponse.json(user.settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const settings = await db.settings.upsert({
      where: { userId: user.id },
      update: {
        defaultDuration: body.defaultDuration,
        breakDuration: body.breakDuration,
        soundEnabled: body.soundEnabled,
        hapticEnabled: body.hapticEnabled,
      },
      create: {
        userId: user.id,
        defaultDuration: body.defaultDuration,
        breakDuration: body.breakDuration,
        soundEnabled: body.soundEnabled,
        hapticEnabled: body.hapticEnabled,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
