"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearAnalytics,
  getPerformanceOverTime,
  getRecentQueries,
  getStats,
  type QueryRecord,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [recentQueries, setRecentQueries] = useState<QueryRecord[]>([]);
  const [performance, setPerformance] = useState<ReturnType<typeof getPerformanceOverTime>>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  function loadData() {
    setStats(getStats());
    setRecentQueries(getRecentQueries(20));
    setPerformance(getPerformanceOverTime(7));
  }

  useEffect(() => {
    loadData();
    setIsHydrated(true);
  }, []);

  function handleClearAnalytics() {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      clearAnalytics();
      loadData();
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Chat
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor usage and performance metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAnalytics}
              className="gap-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Queries"
            value={stats?.totalQueries ?? 0}
            icon={Search}
            description="All time"
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats?.avgResponseTime ?? 0}ms`}
            icon={Clock}
            description="Average latency"
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate ?? 0}%`}
            icon={Activity}
            description="Successful queries"
            highlight={Boolean(stats?.successRate && stats.successRate >= 90)}
          />
          <StatCard
            title="Last 24 Hours"
            value={stats?.queriesLast24h ?? 0}
            icon={TrendingUp}
            description="Recent activity"
          />
        </div>

        {/* Performance Chart (Simple Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Performance Over Time (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performance.length > 0 && performance.some((d) => d.queries > 0) ? (
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-32">
                  {performance.map((day, i) => {
                    const maxQueries = Math.max(...performance.map((d) => d.queries), 1);
                    const height = (day.queries / maxQueries) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-full rounded-t transition-all",
                            day.queries > 0 ? "bg-primary" : "bg-muted",
                          )}
                          style={{ height: `${Math.max(height, 4)}%` }}
                          title={`${day.queries} queries`}
                        />
                        <span className="text-[10px] text-muted-foreground">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.queriesLast7d ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Queries this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {performance.filter((d) => d.queries > 0).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Active days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(
                        performance.reduce((sum, d) => sum + d.avgTime, 0) /
                          Math.max(performance.filter((d) => d.queries > 0).length, 1)
                      )}
                      ms
                    </p>
                    <p className="text-xs text-muted-foreground">Avg response time</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No data available yet. Start asking questions!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Queries & Recent Queries */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top Queries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topQueries && stats.topQueries.length > 0 ? (
                <ol className="space-y-2">
                  {stats.topQueries.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-sm text-foreground truncate max-w-[200px]">
                          {item.query}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? "time" : "times"}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No queries tracked yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Queries Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentQueries.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Query</th>
                        <th className="pb-2 font-medium text-right">Time</th>
                        <th className="pb-2 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentQueries.map((q) => (
                        <tr key={q.id} className="border-b border-border/50">
                          <td className="py-2 pr-2">
                            <span className="block truncate max-w-[180px]" title={q.query}>
                              {q.query}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(q.timestamp).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-2 text-right text-muted-foreground">
                            {q.responseTime}ms
                          </td>
                          <td className="py-2 text-center">
                            {q.success ? (
                              <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="inline h-4 w-4 text-destructive" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No queries recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  highlight,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight && "border-primary/50 bg-primary/5")}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
