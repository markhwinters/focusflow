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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    const now = new Date();
    let startDate = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        completedAt: {
          not: null,
          gte: startDate,
        },
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    const dailyData: Record<string, { focus: number; break: number }> = {};

    sessions.forEach((session) => {
      if (!session.completedAt) return;

      const date = session.completedAt.toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = { focus: 0, break: 0 };
      }

      if (session.type === "FOCUS") {
        dailyData[date].focus += session.duration / 60;
      } else {
        dailyData[date].break += session.duration / 60;
      }
    });

    const chartData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      focus: Math.round(data.focus),
      break: Math.round(data.break),
    }));

    const totalSessions = sessions.length;
    const totalFocusTime = sessions
      .filter((s) => s.type === "FOCUS")
      .reduce((sum, s) => sum + s.duration, 0);
    const totalBreakTime = sessions
      .filter((s) => s.type === "BREAK")
      .reduce((sum, s) => sum + s.duration, 0);

    const stats = {
      totalSessions,
      totalFocusTime,
      totalBreakTime,
      averageSessionTime:
        totalSessions > 0
          ? Math.round((totalFocusTime + totalBreakTime) / totalSessions)
          : 0,
      completionRate: 100,
      chartData,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
