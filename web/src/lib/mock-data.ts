import { useState, useEffect, useCallback } from "react";

// Types
export interface TankData {
  id: string;
  name: string;
  level: number; // 0-100
  capacity: number; // liters
  currentVolume: number;
  status: "normal" | "low" | "critical" | "full";
}

export interface PumpData {
  status: "on" | "off";
  mode: "auto" | "manual";
  runtime: number; // minutes today
  lastActivation: string;
  totalHours: number; // total operation hours
  nextMaintenance: string;
  healthScore: number; // 0-100
  cycleCount: number;
}

export interface SystemStatus {
  esp32Online: boolean;
  lastPing: string;
  uptime: string;
  wifiStrength: number; // -100 to 0 dBm
}

export interface AlertItem {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface LogEntry {
  id: string;
  type: "pump_on" | "pump_off" | "alert" | "system" | "level_change";
  message: string;
  timestamp: string;
  details?: string;
}

export interface ChartDataPoint {
  time: string;
  primaryLevel: number;
  secondaryLevel: number;
  pumpActive: boolean;
}

export interface ConsumptionData {
  label: string;
  consumption: number; // liters
  date: string;
}

export interface NotificationItem {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  technician: string;
}

export interface TankPrediction {
  tankName: string;
  currentLevel: number;
  trend: "rising" | "falling" | "stable";
  ratePerHour: number; // % per hour
  emptyIn: string | null;
  fullIn: string | null;
}

// Helper functions
function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function getTankStatus(level: number): TankData["status"] {
  if (level <= 10) return "critical";
  if (level <= 25) return "low";
  if (level >= 95) return "full";
  return "normal";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// Generate initial chart data (last 24 hours)
function generateChartHistory(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  let primaryLevel = 65;
  let secondaryLevel = 45;

  for (let i = 48; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000);
    primaryLevel = Math.max(5, Math.min(100, primaryLevel + randomBetween(-3, 2)));
    const pumpActive = secondaryLevel < 40 && primaryLevel > 20;
    secondaryLevel = pumpActive
      ? Math.min(100, secondaryLevel + randomBetween(1, 4))
      : Math.max(5, secondaryLevel + randomBetween(-2, 0.5));

    data.push({
      time: formatTime(time),
      primaryLevel: Math.round(primaryLevel),
      secondaryLevel: Math.round(secondaryLevel),
      pumpActive,
    });
  }
  return data;
}

// Generate log history
function generateLogHistory(): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  const types: LogEntry["type"][] = ["pump_on", "pump_off", "alert", "system", "level_change"];
  const messages: Record<LogEntry["type"], string[]> = {
    pump_on: ["Pump activated - Auto mode", "Pump started - Manual override"],
    pump_off: ["Pump deactivated - Tank full", "Pump stopped - Auto mode", "Pump stopped - Low source level"],
    alert: ["Low water level in primary tank", "Secondary tank near capacity", "System protection triggered"],
    system: ["ESP32 reconnected", "System health check passed", "WiFi signal restored"],
    level_change: ["Primary tank refilled externally", "Secondary tank level dropping", "Water consumption spike detected"],
  };

  for (let i = 0; i < 30; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const msgList = messages[type];
    logs.push({
      id: `log-${i}`,
      type,
      message: msgList[Math.floor(Math.random() * msgList.length)],
      timestamp: formatDateTime(new Date(now.getTime() - i * randomBetween(10, 60) * 60 * 1000)),
      details: Math.random() > 0.5 ? `Duration: ${Math.round(randomBetween(1, 45))}min` : undefined,
    });
  }
  return logs;
}

// Generate alerts
function generateAlerts(): AlertItem[] {
  return [
    {
      id: "alert-1",
      type: "warning",
      message: "Primary tank level below 30%",
      timestamp: formatDateTime(new Date(Date.now() - 15 * 60 * 1000)),
      resolved: false,
    },
    {
      id: "alert-2",
      type: "info",
      message: "Pump maintenance due in 3 days",
      timestamp: formatDateTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      resolved: false,
    },
    {
      id: "alert-3",
      type: "critical",
      message: "Dry run protection activated",
      timestamp: formatDateTime(new Date(Date.now() - 6 * 60 * 60 * 1000)),
      resolved: true,
    },
  ];
}

// Generate consumption data
function generateConsumptionData(period: "daily" | "weekly" | "monthly"): ConsumptionData[] {
  const data: ConsumptionData[] = [];
  const now = new Date();

  if (period === "daily") {
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        label: `${d.getHours().toString().padStart(2, "0")}:00`,
        consumption: Math.round(randomBetween(20, 180)),
        date: d.toISOString(),
      });
    }
  } else if (period === "weekly") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        label: days[d.getDay()],
        consumption: Math.round(randomBetween(800, 2500)),
        date: d.toISOString(),
      });
    }
  } else {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        consumption: Math.round(randomBetween(600, 3000)),
        date: d.toISOString(),
      });
    }
  }
  return data;
}

// Generate notifications
function generateNotifications(): NotificationItem[] {
  const now = Date.now();
  return [
    {
      id: "notif-1",
      type: "critical",
      title: "Dry Run Protection",
      message: "Pump stopped automatically — primary tank critically low (8%)",
      timestamp: formatDateTime(new Date(now - 5 * 60 * 1000)),
      read: false,
    },
    {
      id: "notif-2",
      type: "warning",
      title: "Low Water Level",
      message: "Primary tank dropped below 30% threshold",
      timestamp: formatDateTime(new Date(now - 18 * 60 * 1000)),
      read: false,
    },
    {
      id: "notif-3",
      type: "success",
      title: "Tank Refilled",
      message: "Secondary tank reached 95% — pump deactivated",
      timestamp: formatDateTime(new Date(now - 45 * 60 * 1000)),
      read: false,
    },
    {
      id: "notif-4",
      type: "info",
      title: "System Update",
      message: "ESP32 firmware v2.4.1 available for update",
      timestamp: formatDateTime(new Date(now - 2 * 60 * 60 * 1000)),
      read: true,
    },
    {
      id: "notif-5",
      type: "warning",
      title: "Maintenance Reminder",
      message: "Pump maintenance due in 3 days (1,200 hours reached)",
      timestamp: formatDateTime(new Date(now - 4 * 60 * 60 * 1000)),
      read: true,
    },
    {
      id: "notif-6",
      type: "info",
      title: "WiFi Reconnected",
      message: "ESP32 reconnected after 2min downtime",
      timestamp: formatDateTime(new Date(now - 8 * 60 * 60 * 1000)),
      read: true,
    },
  ];
}

// Generate maintenance records
function generateMaintenanceRecords(): MaintenanceRecord[] {
  return [
    { id: "m1", date: "Mar 15, 2026", type: "Preventive", description: "Impeller inspection and lubrication", technician: "Carlos M." },
    { id: "m2", date: "Feb 28, 2026", type: "Corrective", description: "Replaced worn seal ring", technician: "Ana S." },
    { id: "m3", date: "Feb 10, 2026", type: "Preventive", description: "Motor bearing check and cleaning", technician: "Carlos M." },
    { id: "m4", date: "Jan 20, 2026", type: "Preventive", description: "Full system inspection and calibration", technician: "João P." },
    { id: "m5", date: "Dec 30, 2025", type: "Corrective", description: "Replaced pressure sensor", technician: "Ana S." },
  ];
}

// Custom hooks for simulated real-time data
export function useSystemData() {
  const [primaryTank, setPrimaryTank] = useState<TankData>({
    id: "primary",
    name: "Primary Tank",
    level: 62,
    capacity: 5000,
    currentVolume: 3100,
    status: "normal",
  });

  const [secondaryTank, setSecondaryTank] = useState<TankData>({
    id: "secondary",
    name: "Secondary Tank",
    level: 44,
    capacity: 3000,
    currentVolume: 1320,
    status: "normal",
  });

  const [pump, setPump] = useState<PumpData>({
    status: "off",
    mode: "auto",
    runtime: 127,
    lastActivation: formatDateTime(new Date(Date.now() - 45 * 60 * 1000)),
    totalHours: 1187,
    nextMaintenance: "Apr 15, 2026",
    healthScore: 82,
    cycleCount: 4523,
  });

  const [system, setSystem] = useState<SystemStatus>({
    esp32Online: true,
    lastPing: formatTime(new Date()),
    uptime: "3d 14h 22m",
    wifiStrength: -42,
  });

  const [alerts] = useState<AlertItem[]>(generateAlerts());
  const [chartData, setChartData] = useState<ChartDataPoint[]>(generateChartHistory());
  const [logs] = useState<LogEntry[]>(generateLogHistory());
  const [notifications, setNotifications] = useState<NotificationItem[]>(generateNotifications());
  const [maintenanceRecords] = useState<MaintenanceRecord[]>(generateMaintenanceRecords());

  // Consumption data
  const [consumptionPeriod, setConsumptionPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>(generateConsumptionData("daily"));

  const changeConsumptionPeriod = useCallback((period: "daily" | "weekly" | "monthly") => {
    setConsumptionPeriod(period);
    setConsumptionData(generateConsumptionData(period));
  }, []);

  // Predictions
  const [predictions, setPredictions] = useState<TankPrediction[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrimaryTank((prev) => {
        const newLevel = Math.max(5, Math.min(100, prev.level + randomBetween(-1.5, 1)));
        return {
          ...prev,
          level: Math.round(newLevel * 10) / 10,
          currentVolume: Math.round((newLevel / 100) * prev.capacity),
          status: getTankStatus(newLevel),
        };
      });

      setSecondaryTank((prev) => {
        const newLevel = Math.max(5, Math.min(100, prev.level + randomBetween(-0.5, 1.5)));
        return {
          ...prev,
          level: Math.round(newLevel * 10) / 10,
          currentVolume: Math.round((newLevel / 100) * prev.capacity),
          status: getTankStatus(newLevel),
        };
      });

      setSystem((prev) => ({
        ...prev,
        lastPing: formatTime(new Date()),
        wifiStrength: Math.round(randomBetween(-55, -35)),
      }));

      // Add new chart point
      setChartData((prev) => {
        const last = prev[prev.length - 1];
        const newPoint: ChartDataPoint = {
          time: formatTime(new Date()),
          primaryLevel: Math.max(5, Math.min(100, last.primaryLevel + randomBetween(-2, 1.5))),
          secondaryLevel: Math.max(5, Math.min(100, last.secondaryLevel + randomBetween(-1, 2))),
          pumpActive: Math.random() > 0.7,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update predictions based on current data
  useEffect(() => {
    const primaryRate = -1.2; // simulated % per hour (falling)
    const secondaryRate = 0.8; // simulated % per hour (rising)

    setPredictions([
      {
        tankName: "Primary Tank",
        currentLevel: primaryTank.level,
        trend: primaryRate < -0.3 ? "falling" : primaryRate > 0.3 ? "rising" : "stable",
        ratePerHour: Math.abs(primaryRate),
        emptyIn: primaryRate < 0 ? `${Math.round(primaryTank.level / Math.abs(primaryRate))}h` : null,
        fullIn: primaryRate > 0 ? `${Math.round((100 - primaryTank.level) / primaryRate)}h` : null,
      },
      {
        tankName: "Secondary Tank",
        currentLevel: secondaryTank.level,
        trend: secondaryRate < -0.3 ? "falling" : secondaryRate > 0.3 ? "rising" : "stable",
        ratePerHour: Math.abs(secondaryRate),
        emptyIn: secondaryRate < 0 ? `${Math.round(secondaryTank.level / Math.abs(secondaryRate))}h` : null,
        fullIn: secondaryRate > 0 ? `${Math.round((100 - secondaryTank.level) / secondaryRate)}h` : null,
      },
    ]);
  }, [primaryTank.level, secondaryTank.level]);

  const togglePumpMode = useCallback((mode: "auto" | "manual") => {
    setPump((prev) => ({ ...prev, mode }));
  }, []);

  const togglePumpStatus = useCallback((status: "on" | "off") => {
    setPump((prev) => ({ ...prev, status }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return {
    primaryTank,
    secondaryTank,
    pump,
    system,
    alerts,
    chartData,
    logs,
    notifications,
    maintenanceRecords,
    consumptionData,
    consumptionPeriod,
    predictions,
    togglePumpMode,
    togglePumpStatus,
    markNotificationRead,
    markAllNotificationsRead,
    changeConsumptionPeriod,
  };
}

// Theme hook
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggle };
}

// Auth hook (simple mock)
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("iot_auth") === "true";
  });

  const [user] = useState({
    name: "Admin User",
    email: "admin@reservoir.io",
    role: "Administrator",
    avatar: "AU",
  });

  const login = useCallback((email: string, password: string): boolean => {
    if (email && password) {
      localStorage.setItem("iot_auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("iot_auth");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, user, login, logout };
}

// CSV export utility
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? "");
        return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}