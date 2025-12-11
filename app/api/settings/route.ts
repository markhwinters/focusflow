import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { settings: true },
    });

    if (!user) {
      const clerkUser = await currentUser();
      const user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || "",
          settings: {
            create: {}, // Creates the linked settings record automatically
          },
        },
        include: { settings: true },
      });

      return NextResponse.json(user.settings);
    }

    if (!user.settings) {
      const settings = await prisma.settings.create({
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

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const settings = await prisma.settings.upsert({
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
