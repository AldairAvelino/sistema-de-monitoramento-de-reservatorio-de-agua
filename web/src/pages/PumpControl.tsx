import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Power,
  AlertTriangle,
  Shield,
  Zap,
  Clock,
  Activity,
  ToggleLeft,
} from "lucide-react";

export default function PumpControl() {
  const { pump, primaryTank, secondaryTank, togglePumpMode, togglePumpStatus } = useSystemData();
  const [manualConfirmed, setManualConfirmed] = useState(false);

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? "manual" : "auto";
    togglePumpMode(newMode);
    if (newMode === "auto") {
      setManualConfirmed(false);
    }
  };

  const handlePumpToggle = (action: "on" | "off") => {
    if (pump.mode === "manual") {
      togglePumpStatus(action);
    }
  };

  const isDryRunRisk = primaryTank.level < 15;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Safety Warning */}
        {pump.mode === "manual" && (
          <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/5 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 !text-amber-500" />
            <AlertTitle className="text-amber-700 dark:text-amber-400">Manual Mode Active</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400/80">
              Automatic safety controls are disabled. The pump will not stop automatically when water levels are low.
              Monitor tank levels carefully to prevent dry running.
            </AlertDescription>
          </Alert>
        )}

        {isDryRunRisk && (
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Dry Run Risk</AlertTitle>
            <AlertDescription>
              Primary tank level is critically low ({Math.round(primaryTank.level)}%).
              Running the pump may cause damage. Auto-mode will prevent activation.
            </AlertDescription>
          </Alert>
        )}

        {/* Mode Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ToggleLeft className="w-4 h-4" />
              Operating Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {pump.mode === "auto" ? "Automatic Mode" : "Manual Mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pump.mode === "auto"
                    ? "Pump operates based on tank levels with safety protections"
                    : "Full manual control — safety protections disabled"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Auto</span>
                <Switch
                  checked={pump.mode === "manual"}
                  onCheckedChange={handleModeChange}
                />
                <span className="text-xs text-muted-foreground">Manual</span>
              </div>
            </div>

            {pump.mode === "manual" && !manualConfirmed && (
              <div className="p-4 rounded-xl border-2 border-dashed border-amber-500/30 bg-amber-500/5">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-3">
                  ⚠️ Confirm manual control
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Manual mode disables all automatic safety features. You are responsible for monitoring water levels.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-500/50 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                  onClick={() => setManualConfirmed(true)}
                >
                  I understand, enable manual control
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pump Controls */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Power className="w-4 h-4" />
                Pump Control
              </CardTitle>
              <Badge
                variant="outline"
                className={`${
                  pump.status === "on"
                    ? "text-emerald-500 border-emerald-500/30"
                    : "text-muted-foreground"
                }`}
              >
                {pump.status === "on" ? "Running" : "Stopped"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pump visual indicator */}
            <div className="flex items-center justify-center py-6">
              <div
                className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${
                  pump.status === "on"
                    ? "bg-emerald-500/10 ring-4 ring-emerald-500/20"
                    : "bg-muted ring-4 ring-border"
                }`}
              >
                {pump.status === "on" && (
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                )}
                <Power
                  className={`w-10 h-10 transition-colors ${
                    pump.status === "on" ? "text-emerald-500" : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>

            {/* Control buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={pump.mode === "auto" || (pump.mode === "manual" && !manualConfirmed) || isDryRunRisk}
                onClick={() => handlePumpToggle("on")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Pump
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14"
                disabled={pump.mode === "auto" || (pump.mode === "manual" && !manualConfirmed)}
                onClick={() => handlePumpToggle("off")}
              >
                <Power className="w-5 h-5 mr-2" />
                Stop Pump
              </Button>
            </div>

            {pump.mode === "auto" && (
              <p className="text-xs text-center text-muted-foreground">
                Switch to manual mode to enable direct pump control
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pump Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pump Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  Runtime Today
                </div>
                <p className="text-lg font-semibold tabular-nums">{pump.runtime} min</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Last Activation
                </div>
                <p className="text-sm font-semibold tabular-nums">{pump.lastActivation}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Source Level
                </div>
                <p className="text-lg font-semibold tabular-nums">{Math.round(primaryTank.level)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Target Level
                </div>
                <p className="text-lg font-semibold tabular-nums">{Math.round(secondaryTank.level)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}