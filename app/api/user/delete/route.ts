import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Rate limiting map (in production, use Redis or similar)
const deleteRateLimit = new Map<
  string,
  { attempts: number; resetAt: number }
>();

const MAX_DELETE_ATTEMPTS_PER_DAY = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkRateLimit(clerkId: string): boolean {
  const now = Date.now();
  const userLimit = deleteRateLimit.get(clerkId);

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or initialize rate limit
    deleteRateLimit.set(clerkId, {
      attempts: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.attempts >= MAX_DELETE_ATTEMPTS_PER_DAY) {
    return false;
  }

  userLimit.attempts++;
  return true;
}

export async function DELETE(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(clerkId)) {
      return NextResponse.json(
        { error: "Too many deletion attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { confirmation } = body;

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Invalid confirmation. Please type DELETE to confirm." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(
      `[AUDIT] User ${clerkId} (internal: ${
        user.id
      }) initiated account deletion at ${new Date().toISOString()}`
    );

    // Delete all database data
    await prisma.reflection.deleteMany({
      where: {
        session: {
          userId: user.id,
        },
      },
    });

    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    await prisma.settings.deleteMany({
      where: { userId: user.id },
    });

    await prisma.user.delete({
      where: { id: user.id },
    });

    deleteRateLimit.delete(clerkId);

    console.log(
      `[AUDIT] User ${clerkId} database deletion completed at ${new Date().toISOString()}`
    );

    // Return success - the frontend will handle Clerk sign out and deletion
    return NextResponse.json(
      {
        success: true,
        message: "Account data deleted successfully",
        clerkId: clerkId, // Return clerkId so frontend can delete from Clerk
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      {
        error: "Failed to delete account. Please contact support.",
        success: false,
      },
      { status: 500 }
    );
  }
}
