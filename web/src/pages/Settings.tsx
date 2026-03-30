import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth, useSystemData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  Wifi,
  Bell,
  Shield,
  Server,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { system } = useSystemData();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    lowWater: true,
    pumpActivity: true,
    systemAlerts: true,
    dailyReport: false,
  });

  const [deviceConfig, setDeviceConfig] = useState({
    deviceId: "ESP32-AQ-001",
    apiEndpoint: "mqtt://192.168.1.100:1883",
    pollInterval: "3",
    autoReconnect: true,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Profile Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-sky-500/10 text-sky-600 text-xl font-semibold">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {user.role}
                </Badge>
              </div>
            </div>
            <Separator />
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/5 border-red-500/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* ESP32 Device Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="w-4 h-4" />
                ESP32 Device Configuration
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  system.esp32Online
                    ? "text-emerald-500 border-emerald-500/30"
                    : "text-red-500 border-red-500/30"
                }`}
              >
                {system.esp32Online ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Device ID</Label>
                <Input
                  value={deviceConfig.deviceId}
                  onChange={(e) => setDeviceConfig({ ...deviceConfig, deviceId: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">API / MQTT Endpoint</Label>
                <Input
                  value={deviceConfig.apiEndpoint}
                  onChange={(e) => setDeviceConfig({ ...deviceConfig, apiEndpoint: e.target.value })}
                  className="h-9 text-sm font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Poll Interval (seconds)</Label>
                <Input
                  type="number"
                  value={deviceConfig.pollInterval}
                  onChange={(e) => setDeviceConfig({ ...deviceConfig, pollInterval: e.target.value })}
                  className="h-9 text-sm"
                  min="1"
                  max="60"
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <Label className="text-xs text-muted-foreground">Auto Reconnect</Label>
                <Switch
                  checked={deviceConfig.autoReconnect}
                  onCheckedChange={(checked) =>
                    setDeviceConfig({ ...deviceConfig, autoReconnect: checked })
                  }
                />
              </div>
            </div>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* API Connection Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "ESP32 Device", connected: system.esp32Online, detail: `Signal: ${system.wifiStrength} dBm` },
                { label: "MQTT Broker", connected: true, detail: "mqtt://192.168.1.100:1883" },
                { label: "Database", connected: true, detail: "PostgreSQL — 142ms latency" },
                { label: "Cloud Sync", connected: false, detail: "Not configured" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {item.connected ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.connected ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    {item.connected ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: "lowWater" as const, label: "Low Water Alerts", desc: "Notify when tank level drops below threshold" },
                { key: "pumpActivity" as const, label: "Pump Activity", desc: "Notify on pump start/stop events" },
                { key: "systemAlerts" as const, label: "System Alerts", desc: "Critical system warnings and errors" },
                { key: "dailyReport" as const, label: "Daily Report", desc: "Receive daily summary via email" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm">
              Change Password
            </Button>
            <p className="text-xs text-muted-foreground">
              Last password change: 14 days ago
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}