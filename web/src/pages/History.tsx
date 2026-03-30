import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData, exportToCSV, type LogEntry } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Power,
  PowerOff,
  AlertTriangle,
  Monitor,
  Droplets,
  Clock,
  Filter,
  Download,
} from "lucide-react";

const typeConfig: Record<
  LogEntry["type"],
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  pump_on: { icon: Power, label: "Pump On", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  pump_off: { icon: PowerOff, label: "Pump Off", color: "text-slate-500", bg: "bg-slate-500/10" },
  alert: { icon: AlertTriangle, label: "Alert", color: "text-amber-500", bg: "bg-amber-500/10" },
  system: { icon: Monitor, label: "System", color: "text-sky-500", bg: "bg-sky-500/10" },
  level_change: { icon: Droplets, label: "Level", color: "text-violet-500", bg: "bg-violet-500/10" },
};

const filterOptions: { value: string; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "pump_on", label: "Pump On" },
  { value: "pump_off", label: "Pump Off" },
  { value: "alert", label: "Alerts" },
  { value: "system", label: "System" },
  { value: "level_change", label: "Level Changes" },
];

export default function History() {
  const { logs } = useSystemData();
  const [filter, setFilter] = useState("all");

  const filteredLogs = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  // Stats
  const pumpActivations = logs.filter((l) => l.type === "pump_on").length;
  const alertCount = logs.filter((l) => l.type === "alert").length;
  const systemEvents = logs.filter((l) => l.type === "system").length;

  const handleExportLogs = () => {
    exportToCSV(
      filteredLogs.map((l) => ({
        Type: l.type,
        Message: l.message,
        Timestamp: l.timestamp,
        Details: l.details || "",
      })),
      `event_logs_${filter}`
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Power className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{pumpActivations}</p>
                  <p className="text-xs text-muted-foreground">Pump Activations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{alertCount}</p>
                  <p className="text-xs text-muted-foreground">Alerts Triggered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{systemEvents}</p>
                  <p className="text-xs text-muted-foreground">System Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Log list */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Event Log
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                {/* Desktop filter buttons */}
                <div className="hidden md:flex items-center gap-1.5">
                  {filterOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={filter === opt.value ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFilter(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                {/* Mobile filter dropdown */}
                <div className="md:hidden">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="h-7 text-xs w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={handleExportLogs}
                >
                  <Download className="w-3 h-3" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {filteredLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No events found</p>
              ) : (
                filteredLogs.map((log) => {
                  const config = typeConfig[log.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{log.message}</p>
                          <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${config.color}`}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground tabular-nums">{log.timestamp}</span>
                          {log.details && (
                            <span className="text-xs text-muted-foreground">{log.details}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}