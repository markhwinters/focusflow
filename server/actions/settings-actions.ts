"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user-actions";
import { NextResponse } from "next/server";

export async function getUserSettings() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({
    where: { id: user.id }, // Database user ID
  });

  // Create default settings if none exist
  if (!settings) {
    return await prisma.settings.create({
      data: {
        userId: user.id, // Database user ID
        defaultDuration: 1500,
        breakDuration: 300,
        soundEnabled: true,
        hapticEnabled: true,
      },
    });
  }

  return settings;
}

export async function updateUserSettings(data: {
  defaultDuration?: number;
  breakDuration?: number;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await prisma.settings.upsert({
    where: { userId: user.id }, // Database user ID
    update: data,
    create: {
      userId: user.id, // Database user ID
      ...data,
    },
  });

  revalidatePath("/settings");
  return updated;
}
