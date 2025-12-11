import { auth } from "@clerk/nextjs/server";
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

    const reflections = await prisma.reflection.findMany({
      where: {
        session: {
          userId: user.id,
        },
      },
      include: {
        session: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reflections);
  } catch (error) {
    console.error("Failed to fetch reflections:", error);
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const session = await prisma.session.findUnique({
      where: { id: body.sessionId },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const reflection = await prisma.reflection.create({
      data: {
        sessionId: body.sessionId,
        rating: body.rating,
        notes: body.notes,
      },
    });

    return NextResponse.json(reflection);
  } catch (error) {
    console.error("Failed to create reflection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
