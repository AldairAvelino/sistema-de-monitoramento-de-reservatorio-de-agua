import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData, exportToCSV } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Droplets, Download, Calendar } from "lucide-react";

export default function Consumption() {
  const { consumptionData, consumptionPeriod, changeConsumptionPeriod } = useSystemData();

  const totalConsumption = consumptionData.reduce((sum, d) => sum + d.consumption, 0);
  const avgConsumption = Math.round(totalConsumption / consumptionData.length);
  const maxConsumption = Math.max(...consumptionData.map((d) => d.consumption));
  const minConsumption = Math.min(...consumptionData.map((d) => d.consumption));

  const periodLabels = {
    daily: "Today (Hourly)",
    weekly: "This Week",
    monthly: "This Month",
  };

  const unitLabels = {
    daily: "L/hour",
    weekly: "L/day",
    monthly: "L/day",
  };

  const handleExport = () => {
    exportToCSV(
      consumptionData.map((d) => ({
        Period: d.label,
        "Consumption (L)": d.consumption,
        Date: d.date,
      })),
      `water_consumption_${consumptionPeriod}`
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Period selector + Export */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <Button
                key={period}
                variant={consumptionPeriod === period ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs capitalize"
                onClick={() => changeConsumptionPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{totalConsumption.toLocaleString()}L</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{avgConsumption}L</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{maxConsumption}L</p>
                  <p className="text-xs text-muted-foreground">Peak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{minConsumption}L</p>
                  <p className="text-xs text-muted-foreground">Minimum</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Water Consumption — {periodLabels[consumptionPeriod]}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {unitLabels[consumptionPeriod]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}L`, "Consumption"]}
                  />
                  <Bar
                    dataKey="consumption"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usage Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Efficiency Score</p>
                <p className="text-2xl font-bold text-emerald-500">87%</p>
                <p className="text-xs text-muted-foreground mt-1">Based on pump cycles vs output</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Peak Usage Time</p>
                <p className="text-2xl font-bold">08:00</p>
                <p className="text-xs text-muted-foreground mt-1">Morning irrigation cycle</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Est. Monthly Cost</p>
                <p className="text-2xl font-bold">R$ 42</p>
                <p className="text-xs text-muted-foreground mt-1">Based on current usage rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}