import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Wifi, Cpu, Droplets, Zap } from "lucide-react";

export default function SystemMap() {
  const { primaryTank, secondaryTank, pump, system } = useSystemData();

  const getPumpColor = () => (pump.status === "on" ? "text-emerald-500" : "text-muted-foreground");
  const getTankColor = (level: number) => {
    if (level <= 10) return "text-red-500";
    if (level <= 25) return "text-amber-500";
    return "text-sky-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Map className="w-4 h-4" />
                System Diagram
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-[10px] ${system.esp32Online ? "text-emerald-500" : "text-red-500"}`}
              >
                {system.esp32Online ? "All Systems Online" : "Connection Issue"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Interactive System Diagram */}
            <div className="relative w-full min-h-[420px] bg-muted/30 rounded-xl border border-border p-6 overflow-hidden">
              {/* Grid pattern background */}
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                  backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* ESP32 Controller - Top Center */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 ${
                  system.esp32Online
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}>
                  <Cpu className={`w-5 h-5 ${system.esp32Online ? "text-emerald-500" : "text-red-500"}`} />
                  <div>
                    <p className="text-xs font-semibold">ESP32 Controller</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {system.esp32Online && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {system.esp32Online ? "Online" : "Offline"} • {system.wifiStrength} dBm
                      </span>
                    </div>
                  </div>
                  <Wifi className={`w-3.5 h-3.5 ml-2 ${system.esp32Online ? "text-emerald-500" : "text-red-400"}`} />
                </div>
              </div>

              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {/* ESP32 to Primary Tank */}
                <line x1="35%" y1="80" x2="20%" y2="160" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" />
                {/* ESP32 to Secondary Tank */}
                <line x1="65%" y1="80" x2="80%" y2="160" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" />
                {/* Primary to Pump */}
                <line x1="30%" y1="310" x2="50%" y2="350" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" />
                {/* Pump to Secondary */}
                <line x1="50%" y1="350" x2="70%" y2="310" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 4" />
                {/* Animated flow when pump is on */}
                {pump.status === "on" && (
                  <>
                    <line x1="30%" y1="310" x2="50%" y2="350" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4">
                      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                    </line>
                    <line x1="50%" y1="350" x2="70%" y2="310" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4">
                      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                    </line>
                  </>
                )}
              </svg>

              {/* Primary Tank - Left */}
              <div className="absolute left-[5%] top-[38%] z-10 w-[38%] max-w-[220px]">
                <div className="p-4 rounded-xl border-2 border-border bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className={`w-5 h-5 ${getTankColor(primaryTank.level)}`} />
                    <div>
                      <p className="text-xs font-semibold">Primary Tank</p>
                      <p className="text-[10px] text-muted-foreground">Water Source</p>
                    </div>
                  </div>
                  {/* Mini tank visualization */}
                  <div className="relative w-full h-20 bg-muted rounded-lg overflow-hidden border border-border">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-sky-500/80 transition-all duration-1000 rounded-b-md"
                      style={{ height: `${primaryTank.level}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold tabular-nums drop-shadow-sm">
                        {Math.round(primaryTank.level)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>{primaryTank.currentVolume.toLocaleString()}L</span>
                    <span>{primaryTank.capacity.toLocaleString()}L</span>
                  </div>
                </div>
              </div>

              {/* Secondary Tank - Right */}
              <div className="absolute right-[5%] top-[38%] z-10 w-[38%] max-w-[220px]">
                <div className="p-4 rounded-xl border-2 border-border bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className={`w-5 h-5 ${getTankColor(secondaryTank.level)}`} />
                    <div>
                      <p className="text-xs font-semibold">Secondary Tank</p>
                      <p className="text-[10px] text-muted-foreground">Storage Tank</p>
                    </div>
                  </div>
                  <div className="relative w-full h-20 bg-muted rounded-lg overflow-hidden border border-border">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 transition-all duration-1000 rounded-b-md"
                      style={{ height: `${secondaryTank.level}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold tabular-nums drop-shadow-sm">
                        {Math.round(secondaryTank.level)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>{secondaryTank.currentVolume.toLocaleString()}L</span>
                    <span>{secondaryTank.capacity.toLocaleString()}L</span>
                  </div>
                </div>
              </div>

              {/* Pump - Bottom Center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 ${
                  pump.status === "on"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-muted/50 border-border"
                }`}>
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                    pump.status === "on" ? "bg-emerald-500/20" : "bg-muted"
                  }`}>
                    {pump.status === "on" && (
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    )}
                    <Zap className={`w-5 h-5 ${getPumpColor()}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Electric Pump</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={`text-[9px] h-4 ${
                        pump.status === "on" ? "text-emerald-500 border-emerald-500/30" : ""
                      }`}>
                        {pump.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] h-4">
                        {pump.mode.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow direction labels */}
              {pump.status === "on" && (
                <>
                  <div className="absolute left-[32%] bottom-[28%] z-10">
                    <span className="text-[9px] font-medium text-sky-500 bg-card/80 px-1.5 py-0.5 rounded">
                      ← Water In
                    </span>
                  </div>
                  <div className="absolute right-[32%] bottom-[28%] z-10">
                    <span className="text-[9px] font-medium text-emerald-500 bg-card/80 px-1.5 py-0.5 rounded">
                      Water Out →
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Component status grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "ESP32",
              status: system.esp32Online ? "Online" : "Offline",
              detail: `Uptime: ${system.uptime}`,
              ok: system.esp32Online,
            },
            {
              label: "Primary Sensor",
              status: "Active",
              detail: `Reading: ${Math.round(primaryTank.level)}%`,
              ok: true,
            },
            {
              label: "Secondary Sensor",
              status: "Active",
              detail: `Reading: ${Math.round(secondaryTank.level)}%`,
              ok: true,
            },
            {
              label: "Pump Relay",
              status: pump.status === "on" ? "Energized" : "Idle",
              detail: `Mode: ${pump.mode}`,
              ok: true,
            },
          ].map((comp) => (
            <Card key={comp.label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${comp.ok ? "bg-emerald-500" : "bg-red-500"}`} />
                  <p className="text-xs font-semibold">{comp.label}</p>
                </div>
                <p className={`text-sm font-bold ${comp.ok ? "text-emerald-500" : "text-red-500"}`}>
                  {comp.status}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{comp.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}