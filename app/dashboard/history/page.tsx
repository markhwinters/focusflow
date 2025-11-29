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
import { Focus, Coffee, Calendar, Clock, Star, TrendingUp } from "lucide-react";
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">History & Analytics</h1>
          <p className="text-muted-foreground mt-2">
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
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sessions
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalSessions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {period === "week" ? "This week" : "This month"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Focus Time
                </CardTitle>
                <Focus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats?.totalFocusTime || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total focused time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Break Time
                </CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats?.totalBreakTime || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total break time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Session
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats?.averageSessionTime || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average duration
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Trend</TabsTrigger>
              <TabsTrigger value="sessions">Session List</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>
                    Your focus and break sessions by day
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    <DailyChart data={stats.chartData} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trend</CardTitle>
                  <CardDescription>
                    Track your productivity trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    <WeeklyChart data={stats.chartData} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>
                    Your completed focus and break sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedSessions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No sessions yet. Start your first focus session!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                session.type === "FOCUS"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {session.type === "FOCUS" ? (
                                <Focus className="h-5 w-5" />
                              ) : (
                                <Coffee className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {session.type === "FOCUS"
                                  ? "Focus Session"
                                  : "Break"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
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
