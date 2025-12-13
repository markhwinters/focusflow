"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./user-actions";
import { NextResponse } from "next/server";

export async function exportUserData() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check rate limit (max 3 exports per day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const exportCount = await prisma.dataExport.count({
    where: {
      userId: user.id, // Database user ID
      createdAt: { gte: today },
    },
  });

  if (exportCount >= 3) {
    throw new Error("Export limit reached. Maximum 3 exports per day.");
  }

  // Fetch all user data using database user ID
  const [sessions, settings] = await Promise.all([
    prisma.session.findMany({
      where: { userId: user.id }, // Database user ID
      include: { reflection: true },
    }),
    prisma.settings.findUnique({
      where: { userId: user.id }, // Database user ID
    }),
  ]);

  // Log export for audit trail
  await prisma.dataExport.create({
    data: { userId: user.id }, // Database user ID
  });

  // Format export
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      userId: user.id,
      clerkId: user.clerkId,
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

  return JSON.stringify(exportData, null, 2);
}

export async function deleteUserAccount(request: Request) {
  const user = await getCurrentUser();
  const clerk = await clerkClient();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { confirmation } = body;

  if (confirmation !== "DELETE") {
    return NextResponse.json(
      { error: "Invalid confirmation. Please type DELETE to confirm." },
      { status: 400 }
    );
  }

  // Delete all database records using database user ID
  // Cascades via Prisma relations defined in schema
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

  // Delete Clerk user (user.id matches Clerk ID in your schema)
  await clerk.users.deleteUser(user.clerkId);

  // Log deletion for audit
  console.log(`User ${user.id} deleted at ${new Date().toISOString()}`);

  redirect("/");
}
