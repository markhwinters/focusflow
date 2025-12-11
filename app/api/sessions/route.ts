import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        ...(type && { type: type as any }),
      },
      include: {
        reflection: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
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
    });

    if (!user) {
      const clerkUser = await currentUser();
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || "",
          settings: {
            create: {},
          },
        },
      });

      const body = await request.json();
      const session = await prisma.session.create({
        data: {
          userId: newUser.id,
          type: body.type,
          duration: body.duration,
        },
      });

      return NextResponse.json(session);
    }

    const body = await request.json();
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        type: body.type,
        duration: body.duration,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
