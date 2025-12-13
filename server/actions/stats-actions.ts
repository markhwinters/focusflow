"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./user-actions";

export async function getUserStats(dateRange?: { start: Date; end: Date }) {
  const user = await getCurrentUser();

  const whereClause = dateRange
    ? {
        userId: user.id, // Database user ID
        startedAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      }
    : { userId: user.id }; // Database user ID

  // Run queries in parallel for performance
  const [focusStats, breakStats, totalSessions, recentSessions] =
    await Promise.all([
      prisma.session.aggregate({
        where: { ...whereClause, type: "FOCUS" },
        _sum: { duration: true },
        _count: true,
        _avg: { duration: true },
      }),
      prisma.session.aggregate({
        where: { ...whereClause, type: "BREAK" },
        _sum: { duration: true },
        _count: true,
      }),
      prisma.session.count({
        where: whereClause,
      }),
      prisma.session.findMany({
        where: whereClause,
        orderBy: { startedAt: "desc" },
        take: 7,
        select: {
          startedAt: true,
          duration: true,
          type: true,
        },
      }),
    ]);

  return {
    totalSessions,
    focusTime: focusStats._sum.duration || 0,
    breakTime: breakStats._sum.duration || 0,
    avgFocusDuration: focusStats._avg.duration || 0,
    focusCount: focusStats._count,
    breakCount: breakStats._count,
    recentActivity: recentSessions,
  };
}

export async function getStreakData() {
  const user = await getCurrentUser();

  const sessions = await prisma.session.findMany({
    where: {
      userId: user.id, // Database user ID
      type: "FOCUS",
    },
    orderBy: { startedAt: "desc" },
    select: { startedAt: true },
  });

  // Calculate streak logic
  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  for (const session of sessions) {
    const sessionDate = new Date(session.startedAt);
    sessionDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      currentStreak = 1;
      lastDate = sessionDate;
    } else {
      const dayDiff = Math.floor(
        (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        currentStreak++;
      } else if (dayDiff > 1) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }

      lastDate = sessionDate;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
  };
}
