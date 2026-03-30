import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Clock,
  Activity,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export default function Maintenance() {
  const { pump, maintenanceRecords, predictions } = useSystemData();

  const maxHours = 1500; // maintenance interval
  const hoursProgress = Math.min((pump.totalHours / maxHours) * 100, 100);
  const hoursRemaining = maxHours - pump.totalHours;

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Pump Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Health Score */}
          <Card>
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="relative w-28 h-28 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={pump.healthScore >= 80 ? "#10b981" : pump.healthScore >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${pump.healthScore * 2.64} 264`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${getHealthColor(pump.healthScore)}`}>
                    {pump.healthScore}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className="text-sm font-semibold">Health Score</p>
              <p className="text-xs text-muted-foreground">
                {pump.healthScore >= 80 ? "Good condition" : pump.healthScore >= 60 ? "Needs attention" : "Critical"}
              </p>
            </CardContent>
          </Card>

          {/* Operation Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Operation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Total Hours</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{pump.totalHours.toLocaleString()}h</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Cycle Count</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{pump.cycleCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Today Runtime</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{pump.runtime} min</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Maintenance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-2">
                <p className="text-2xl font-bold">{pump.nextMaintenance}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {hoursRemaining > 0 ? `${hoursRemaining}h remaining` : "Overdue!"}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Hours until service</span>
                  <span className="font-medium">{pump.totalHours} / {maxHours}h</span>
                </div>
                <Progress
                  value={hoursProgress}
                  className="h-2"
                />
              </div>
              {hoursRemaining <= 100 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <p className="text-[10px]">Maintenance approaching — schedule service soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tank Predictions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Tank Level Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred) => (
                <div key={pred.tankName} className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">{pred.tankName}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        pred.trend === "rising"
                          ? "text-emerald-500 border-emerald-500/30"
                          : pred.trend === "falling"
                          ? "text-amber-500 border-amber-500/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pred.trend === "rising" ? "↑" : pred.trend === "falling" ? "↓" : "→"} {pred.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold tabular-nums">{Math.round(pred.currentLevel)}%</p>
                      <p className="text-[10px] text-muted-foreground">Current</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold tabular-nums">{pred.ratePerHour}%/h</p>
                      <p className="text-[10px] text-muted-foreground">Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold tabular-nums">
                        {pred.emptyIn || pred.fullIn || "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {pred.emptyIn ? "Until Empty" : pred.fullIn ? "Until Full" : "Stable"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {maintenanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    record.type === "Preventive" ? "bg-sky-500/10" : "bg-amber-500/10"
                  }`}>
                    {record.type === "Preventive" ? (
                      <CheckCircle className="w-4 h-4 text-sky-500" />
                    ) : (
                      <Wrench className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{record.description}</p>
                      <Badge variant="outline" className={`text-[10px] ${
                        record.type === "Preventive" ? "text-sky-500" : "text-amber-500"
                      }`}>
                        {record.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{record.date}</span>
                      <span>Tech: {record.technician}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}