import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Activity, Droplets, TrendingUp, TrendingDown } from "lucide-react";

export default function Monitoring() {
  const { primaryTank, secondaryTank, chartData, pump } = useSystemData();

  // Pump activity from chart data
  const pumpTimeline = chartData.map((d, i) => ({
    time: d.time,
    active: d.pumpActive ? 1 : 0,
    index: i,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Tank level overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Tank Full View */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  Primary Tank
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  {primaryTank.level > 50 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className="text-3xl font-bold tabular-nums">{Math.round(primaryTank.level)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Horizontal bar */}
              <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${primaryTank.level}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{primaryTank.currentVolume.toLocaleString()}L</span>
                <span>{primaryTank.capacity.toLocaleString()}L capacity</span>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Tank Full View */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-500" />
                  Secondary Tank
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  {secondaryTank.level > 50 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className="text-3xl font-bold tabular-nums">{Math.round(secondaryTank.level)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${secondaryTank.level}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{secondaryTank.currentVolume.toLocaleString()}L</span>
                <span>{secondaryTank.capacity.toLocaleString()}L capacity</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Water Level Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Water Level History (24h)
              </CardTitle>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Primary
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Secondary
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="primaryLevel"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#primaryGrad)"
                    name="Primary"
                    dot={false}
                    animationDuration={300}
                  />
                  <Area
                    type="monotone"
                    dataKey="secondaryLevel"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#secondaryGrad)"
                    name="Secondary"
                    dot={false}
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pump Activity Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pump Activity Timeline
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {pump.status === "on" ? "Currently Running" : "Idle"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pumpTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pumpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide domain={[0, 1.2]} />
                  <Area
                    type="stepAfter"
                    dataKey="active"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    fill="url(#pumpGrad)"
                    name="Pump"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-1 rounded bg-amber-500" />
                Pump Active
              </div>
              <span>Total runtime today: {pump.runtime} min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}