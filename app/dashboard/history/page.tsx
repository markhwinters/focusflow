"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyChart } from "@/components/charts/daily-chart";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { Session, ChartData } from "@/types";
import { formatDuration } from "@/lib/utils";
import {
  Focus,
  Coffee,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, statsRes] = await Promise.all([
        fetch("/api/sessions?limit=50"),
        fetch(`/api/stats?period=${period}`),
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch history data:", error);
    } finally {
      setLoading(false);
    }
  };

  const completedSessions = sessions.filter((s) => s.completedAt);

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your productivity over time
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  Total Sessions
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalSessions || 0}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {period === "week" ? "This week" : "This month"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  Focus Time
                </CardTitle>
                <Focus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats?.totalFocusTime || 0)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total focused time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  Break Time
                </CardTitle>
                <Coffee className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats?.totalBreakTime || 0)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total break time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  Avg. Session
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats?.averageSessionTime || 0)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Average duration
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Trend</TabsTrigger>
              <TabsTrigger value="sessions">Session List</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Daily Activity
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your focus and break sessions by day
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    <DailyChart data={stats.chartData} />
                  ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Weekly Trend
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Track your productivity trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    <WeeklyChart data={stats.chartData} />
                  ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Recent Sessions
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your completed focus and break sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedSessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      No sessions yet. Start your first focus session!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                session.type === "FOCUS"
                                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {session.type === "FOCUS" ? (
                                <Focus className="h-5 w-5" />
                              ) : (
                                <Coffee className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {session.type === "FOCUS"
                                  ? "Focus Session"
                                  : "Break"}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {formatDuration(session.duration)}
                                {session.completedAt && (
                                  <>
                                    <span>•</span>
                                    {new Date(
                                      session.completedAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {session.reflection && (
                            <div className="flex items-center gap-1">
                              {Array.from({
                                length: session.reflection.rating,
                              }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
