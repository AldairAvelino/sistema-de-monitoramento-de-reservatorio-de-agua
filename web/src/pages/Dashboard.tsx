import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  Power,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Activity,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

function TankCard({
  name,
  level,
  capacity,
  currentVolume,
  status,
}: {
  name: string;
  level: number;
  capacity: number;
  currentVolume: number;
  status: string;
}) {
  const getStatusColor = () => {
    switch (status) {
      case "critical": return "text-red-500";
      case "low": return "text-amber-500";
      case "full": return "text-sky-500";
      default: return "text-emerald-500";
    }
  };

  const getBarColor = () => {
    if (level <= 10) return "bg-red-500";
    if (level <= 25) return "bg-amber-500";
    if (level >= 95) return "bg-sky-500";
    return "bg-sky-500";
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{name}</CardTitle>
          <Badge
            variant="outline"
            className={`text-[10px] uppercase font-semibold ${getStatusColor()} border-current/20`}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-6">
          {/* Vertical tank bar */}
          <div className="relative w-16 h-36 bg-muted rounded-lg overflow-hidden border border-border">
            <div
              className={`absolute bottom-0 left-0 right-0 ${getBarColor()} transition-all duration-1000 ease-out rounded-b-md`}
              style={{ height: `${level}%` }}
            >
              <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-transparent to-white" />
              <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
                <div className="w-[200%] h-full bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/20"
                style={{ bottom: `${mark}%` }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {Math.round(level)}
              </span>
              <span className="text-lg text-muted-foreground ml-1">%</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium tabular-nums">{currentVolume.toLocaleString()}L</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium tabular-nums">{capacity.toLocaleString()}L</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { primaryTank, secondaryTank, pump, system, alerts, predictions } = useSystemData();

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* System status bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              system.esp32Online
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {system.esp32Online ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                ESP32 Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                ESP32 Offline
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Last ping: {system.lastPing}
          </span>
          <span className="text-xs text-muted-foreground">
            Uptime: {system.uptime}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wifi className="w-3 h-3" />
            {system.wifiStrength} dBm
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <TankCard
            name={primaryTank.name}
            level={primaryTank.level}
            capacity={primaryTank.capacity}
            currentVolume={primaryTank.currentVolume}
            status={primaryTank.status}
          />
          <TankCard
            name={secondaryTank.name}
            level={secondaryTank.level}
            capacity={secondaryTank.capacity}
            currentVolume={secondaryTank.currentVolume}
            status={secondaryTank.status}
          />

          {/* Pump Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pump Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pump.status === "on"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold uppercase">{pump.status}</p>
                  <Badge variant="outline" className="text-[10px] mt-0.5">
                    {pump.mode} mode
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Runtime today
                  </span>
                  <span className="font-medium tabular-nums">{pump.runtime} min</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last active
                  </span>
                  <span className="font-medium tabular-nums">{pump.lastActivation}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                <Droplets className="w-4 h-4 text-sky-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Total Water</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {(primaryTank.currentVolume + secondaryTank.currentVolume).toLocaleString()}L
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                <Gauge className="w-4 h-4 text-amber-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Avg Level</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {Math.round((primaryTank.level + secondaryTank.level) / 2)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Active Alerts</p>
                  <p className="text-sm font-semibold tabular-nums">{unresolvedAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions + Alerts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Predictions Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Level Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.map((pred) => {
                  const TrendIcon = pred.trend === "rising" ? TrendingUp : pred.trend === "falling" ? TrendingDown : Minus;
                  const trendColor = pred.trend === "rising" ? "text-emerald-500" : pred.trend === "falling" ? "text-amber-500" : "text-muted-foreground";
                  return (
                    <div key={pred.tankName} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        <div>
                          <p className="text-sm font-medium">{pred.tankName}</p>
                          <p className="text-xs text-muted-foreground">
                            {pred.ratePerHour}%/h {pred.trend}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums">{Math.round(pred.currentLevel)}%</p>
                        <p className="text-[10px] text-muted-foreground">
                          {pred.emptyIn ? `Empty in ${pred.emptyIn}` : pred.fullIn ? `Full in ${pred.fullIn}` : "Stable"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alerts panel */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Alerts</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {unresolvedAlerts.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${
                        alert.resolved
                          ? "bg-muted/30 border-l-muted-foreground/30 opacity-60"
                          : alert.type === "critical"
                          ? "bg-red-500/5 border-l-red-500"
                          : alert.type === "warning"
                          ? "bg-amber-500/5 border-l-amber-500"
                          : "bg-sky-500/5 border-l-sky-500"
                      }`}
                    >
                      {alert.resolved ? (
                        <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      ) : alert.type === "critical" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.timestamp}</p>
                      </div>
                      {alert.resolved && (
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}