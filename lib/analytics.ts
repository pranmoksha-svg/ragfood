// Analytics tracking module using localStorage

export type QueryRecord = {
  id: string;
  query: string;
  timestamp: number;
  responseTime: number;
  success: boolean;
  model: string;
};

export type AnalyticsData = {
  queries: QueryRecord[];
};

const ANALYTICS_KEY = "food-ai-analytics";

// Get all analytics data
export function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") {
    return { queries: [] };
  }
  try {
    const saved = localStorage.getItem(ANALYTICS_KEY);
    if (saved) {
      return JSON.parse(saved) as AnalyticsData;
    }
  } catch {
    // Invalid JSON or localStorage unavailable
  }
  return { queries: [] };
}

// Save analytics data
function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    // Keep only last 500 queries to avoid localStorage limits
    const trimmed = {
      ...data,
      queries: data.queries.slice(-500),
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable or quota exceeded
  }
}

// Track a new query
export function trackQuery(record: Omit<QueryRecord, "id">): void {
  const analytics = getAnalytics();
  const newRecord: QueryRecord = {
    ...record,
    id: crypto.randomUUID(),
  };
  analytics.queries.push(newRecord);
  saveAnalytics(analytics);
}

// Get computed statistics
export function getStats() {
  const analytics = getAnalytics();
  const queries = analytics.queries;

  if (queries.length === 0) {
    return {
      totalQueries: 0,
      successRate: 0,
      avgResponseTime: 0,
      topQueries: [],
      queriesLast24h: 0,
      queriesLast7d: 0,
    };
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const week = 7 * day;

  const successfulQueries = queries.filter((q) => q.success);
  const successRate = (successfulQueries.length / queries.length) * 100;
  
  const avgResponseTime =
    queries.reduce((sum, q) => sum + q.responseTime, 0) / queries.length;

  // Count query frequency
  const queryFrequency: Record<string, number> = {};
  queries.forEach((q) => {
    const normalized = q.query.toLowerCase().trim();
    queryFrequency[normalized] = (queryFrequency[normalized] || 0) + 1;
  });

  // Get top 5 queries
  const topQueries = Object.entries(queryFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([query, count]) => ({ query, count }));

  const queriesLast24h = queries.filter((q) => now - q.timestamp < day).length;
  const queriesLast7d = queries.filter((q) => now - q.timestamp < week).length;

  return {
    totalQueries: queries.length,
    successRate: Math.round(successRate * 10) / 10,
    avgResponseTime: Math.round(avgResponseTime),
    topQueries,
    queriesLast24h,
    queriesLast7d,
  };
}

// Get recent queries (for admin table)
export function getRecentQueries(limit = 50): QueryRecord[] {
  const analytics = getAnalytics();
  return analytics.queries.slice(-limit).reverse();
}

// Clear all analytics data
export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {
    // localStorage unavailable
  }
}

// Get performance data over time (for charts)
export function getPerformanceOverTime(days = 7) {
  const analytics = getAnalytics();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const result: { date: string; queries: number; avgTime: number; successRate: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i + 1) * day;
    const dayEnd = now - i * day;
    
    const dayQueries = analytics.queries.filter(
      (q) => q.timestamp >= dayStart && q.timestamp < dayEnd
    );

    const date = new Date(dayEnd).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (dayQueries.length === 0) {
      result.push({ date, queries: 0, avgTime: 0, successRate: 0 });
    } else {
      const avgTime =
        dayQueries.reduce((sum, q) => sum + q.responseTime, 0) / dayQueries.length;
      const successRate =
        (dayQueries.filter((q) => q.success).length / dayQueries.length) * 100;
      result.push({
        date,
        queries: dayQueries.length,
        avgTime: Math.round(avgTime),
        successRate: Math.round(successRate),
      });
    }
  }

  return result;
}
