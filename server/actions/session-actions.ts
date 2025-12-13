"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user-actions";
import { SessionType } from "@/prisma/generated/client";

export async function createSession(data: {
  duration: number;
  plannedDuration: number;
  type: SessionType;
}) {
  const user = await getCurrentUser();

  const session = await prisma.session.create({
    data: {
      userId: user.id, // Database user ID
      duration: data.duration,
      type: data.type,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/sessions");
  return session;
}

export async function getSessions(limit?: number) {
  const user = await getCurrentUser();

  const sessions = await prisma.session.findMany({
    where: { userId: user.id }, // Database user ID
    orderBy: { startedAt: "desc" },
    take: limit,
    include: {
      reflection: true,
    },
  });

  return sessions;
}

export async function addReflection(
  sessionId: string,
  data: {
    rating: number;
    notes?: string;
  }
) {
  const user = await getCurrentUser();

  // Verify session belongs to user
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: user.id, // Database user ID
    },
  });

  if (!session) {
    throw new Error("Session not found or unauthorized");
  }

  const reflection = await prisma.reflection.create({
    data: {
      sessionId: sessionId,
      rating: data.rating,
      notes: data.notes,
    },
  });

  revalidatePath("/sessions");
  return reflection;
}

export async function deleteSession(sessionId: string) {
  const user = await getCurrentUser();

  // Verify session belongs to user
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: user.id, // Database user ID
    },
  });

  if (!session) {
    throw new Error("Session not found or unauthorized");
  }

  await prisma.session.delete({
    where: { id: sessionId },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  return { success: true };
}
