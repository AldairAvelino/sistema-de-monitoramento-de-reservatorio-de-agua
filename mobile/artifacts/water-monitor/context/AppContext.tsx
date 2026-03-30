import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface TankReading {
  timestamp: number;
  level: number;
}

export interface SystemEvent {
  id: string;
  type:
    | "pump_on"
    | "pump_off"
    | "refill"
    | "alert_low"
    | "alert_empty"
    | "system_online"
    | "system_offline"
    | "mode_change";
  message: string;
  timestamp: number;
  severity: "info" | "warning" | "critical";
}

export interface User {
  name: string;
  email: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  esp32Online: boolean;
  primaryTankLevel: number;
  secondaryTankLevel: number;
  pumpStatus: boolean;
  autoMode: boolean;
  primaryHistory: TankReading[];
  secondaryHistory: TankReading[];
  events: SystemEvent[];
  notificationsEnabled: boolean;
  lowLevelThreshold: number;
  criticalLevelThreshold: number;
  autoTransferThreshold: number;
  theme: "light" | "dark" | "system";
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  togglePump: () => void;
  setAutoMode: (value: boolean) => void;
  setTheme: (value: "light" | "dark" | "system") => void;
  setNotificationsEnabled: (value: boolean) => void;
  setLowLevelThreshold: (value: number) => void;
  setCriticalLevelThreshold: (value: number) => void;
  setAutoTransferThreshold: (value: number) => void;
  simulateRefill: () => void;
}

const defaultHistory = (): TankReading[] => {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => ({
    timestamp: now - (11 - i) * 3600000,
    level: Math.round(40 + Math.random() * 50),
  }));
};

const generateEventId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const initialEvents: SystemEvent[] = [
  {
    id: generateEventId(),
    type: "system_online",
    message: "ESP32 device came online",
    timestamp: Date.now() - 86400000 * 2,
    severity: "info",
  },
  {
    id: generateEventId(),
    type: "pump_on",
    message: "Pump activated — auto transfer started",
    timestamp: Date.now() - 86400000,
    severity: "info",
  },
  {
    id: generateEventId(),
    type: "refill",
    message: "Primary tank refilled to 95%",
    timestamp: Date.now() - 43200000,
    severity: "info",
  },
  {
    id: generateEventId(),
    type: "alert_low",
    message: "Secondary tank level dropped below 25%",
    timestamp: Date.now() - 21600000,
    severity: "warning",
  },
  {
    id: generateEventId(),
    type: "pump_on",
    message: "Pump activated — secondary tank low",
    timestamp: Date.now() - 21500000,
    severity: "info",
  },
  {
    id: generateEventId(),
    type: "pump_off",
    message: "Pump deactivated — secondary tank filled",
    timestamp: Date.now() - 18000000,
    severity: "info",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    esp32Online: true,
    primaryTankLevel: 78,
    secondaryTankLevel: 42,
    pumpStatus: false,
    autoMode: true,
    primaryHistory: defaultHistory(),
    secondaryHistory: defaultHistory(),
    events: initialEvents,
    notificationsEnabled: true,
    lowLevelThreshold: 25,
    criticalLevelThreshold: 10,
    autoTransferThreshold: 20,
    theme: "system",
  });

  useEffect(() => {
    loadPersistedState();
    const interval = setInterval(simulateLiveData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadPersistedState = async () => {
    try {
      const saved = await AsyncStorage.getItem("aquaguard_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          isAuthenticated: parsed.isAuthenticated ?? false,
          user: parsed.user ?? null,
          autoMode: parsed.autoMode ?? true,
          notificationsEnabled: parsed.notificationsEnabled ?? true,
          lowLevelThreshold: parsed.lowLevelThreshold ?? 25,
          criticalLevelThreshold: parsed.criticalLevelThreshold ?? 10,
          autoTransferThreshold: parsed.autoTransferThreshold ?? 20,
          theme: parsed.theme ?? "system",
        }));
      }
    } catch {}
  };

  const persistState = async (newState: Partial<AppState>) => {
    try {
      const toSave = {
        isAuthenticated: newState.isAuthenticated ?? state.isAuthenticated,
        user: newState.user ?? state.user,
        autoMode: newState.autoMode ?? state.autoMode,
        notificationsEnabled:
          newState.notificationsEnabled ?? state.notificationsEnabled,
        lowLevelThreshold:
          newState.lowLevelThreshold ?? state.lowLevelThreshold,
        criticalLevelThreshold:
          newState.criticalLevelThreshold ?? state.criticalLevelThreshold,
        autoTransferThreshold:
          newState.autoTransferThreshold ?? state.autoTransferThreshold,
        theme: newState.theme ?? state.theme,
      };
      await AsyncStorage.setItem("aquaguard_state", JSON.stringify(toSave));
    } catch {}
  };

  const simulateLiveData = () => {
    setState((prev) => {
      const now = Date.now();
      const newPrimaryLevel = Math.min(
        100,
        Math.max(0, prev.primaryTankLevel + (Math.random() - 0.5) * 3)
      );
      const pumpDrain = prev.pumpStatus ? 2 : 0;
      const newSecondaryLevel = Math.min(
        100,
        Math.max(
          0,
          prev.secondaryTankLevel +
            pumpDrain * 1.5 +
            (Math.random() - 0.6) * 1.5
        )
      );

      const shouldActivatePump =
        prev.autoMode &&
        !prev.pumpStatus &&
        newSecondaryLevel < prev.autoTransferThreshold &&
        newPrimaryLevel > 20;

      const shouldDeactivatePump =
        prev.autoMode &&
        prev.pumpStatus &&
        (newSecondaryLevel > 85 || newPrimaryLevel < 15);

      let newEvents = [...prev.events];
      let newPumpStatus = prev.pumpStatus;

      if (shouldActivatePump) {
        newPumpStatus = true;
        newEvents = [
          {
            id: generateEventId(),
            type: "pump_on",
            message: `Pump activated — secondary tank at ${Math.round(newSecondaryLevel)}%`,
            timestamp: now,
            severity: "info",
          },
          ...newEvents,
        ];
      } else if (shouldDeactivatePump) {
        newPumpStatus = false;
        newEvents = [
          {
            id: generateEventId(),
            type: "pump_off",
            message: `Pump deactivated — secondary tank at ${Math.round(newSecondaryLevel)}%`,
            timestamp: now,
            severity: "info",
          },
          ...newEvents,
        ];
      }

      const newPrimaryHistory = [
        ...prev.primaryHistory.slice(-23),
        { timestamp: now, level: Math.round(newPrimaryLevel) },
      ];
      const newSecondaryHistory = [
        ...prev.secondaryHistory.slice(-23),
        { timestamp: now, level: Math.round(newSecondaryLevel) },
      ];

      return {
        ...prev,
        primaryTankLevel: Math.round(newPrimaryLevel),
        secondaryTankLevel: Math.round(newSecondaryLevel),
        pumpStatus: newPumpStatus,
        primaryHistory: newPrimaryHistory,
        secondaryHistory: newSecondaryHistory,
        events: newEvents.slice(0, 50),
      };
    });
  };

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (email.includes("@") && password.length >= 6) {
        const user = {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email,
        };
        const newState = { isAuthenticated: true, user };
        setState((prev) => ({ ...prev, ...newState }));
        await persistState(newState);
        return true;
      }
      return false;
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      if (name.length > 0 && email.includes("@") && password.length >= 6) {
        const user = { name, email };
        const newState = { isAuthenticated: true, user };
        setState((prev) => ({ ...prev, ...newState }));
        await persistState(newState);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(async () => {
    const newState = { isAuthenticated: false, user: null };
    setState((prev) => ({ ...prev, ...newState }));
    await persistState(newState);
  }, []);

  const togglePump = useCallback(() => {
    setState((prev) => {
      const newStatus = !prev.pumpStatus;
      const now = Date.now();
      const event: SystemEvent = {
        id: generateEventId(),
        type: newStatus ? "pump_on" : "pump_off",
        message: newStatus
          ? "Pump manually activated"
          : "Pump manually deactivated",
        timestamp: now,
        severity: "info",
      };
      return {
        ...prev,
        pumpStatus: newStatus,
        events: [event, ...prev.events].slice(0, 50),
      };
    });
  }, []);

  const setAutoMode = useCallback(async (value: boolean) => {
    setState((prev) => ({ ...prev, autoMode: value }));
    await persistState({ autoMode: value });
  }, []);

  const setTheme = useCallback(async (value: "light" | "dark" | "system") => {
    setState((prev) => ({ ...prev, theme: value }));
    await persistState({ theme: value });
  }, []);

  const setNotificationsEnabled = useCallback(async (value: boolean) => {
    setState((prev) => ({ ...prev, notificationsEnabled: value }));
    await persistState({ notificationsEnabled: value });
  }, []);

  const setLowLevelThreshold = useCallback(async (value: number) => {
    setState((prev) => ({ ...prev, lowLevelThreshold: value }));
    await persistState({ lowLevelThreshold: value });
  }, []);

  const setCriticalLevelThreshold = useCallback(async (value: number) => {
    setState((prev) => ({ ...prev, criticalLevelThreshold: value }));
    await persistState({ criticalLevelThreshold: value });
  }, []);

  const setAutoTransferThreshold = useCallback(async (value: number) => {
    setState((prev) => ({ ...prev, autoTransferThreshold: value }));
    await persistState({ autoTransferThreshold: value });
  }, []);

  const simulateRefill = useCallback(() => {
    setState((prev) => {
      const now = Date.now();
      const event: SystemEvent = {
        id: generateEventId(),
        type: "refill",
        message: "Primary tank refilled to 95%",
        timestamp: now,
        severity: "info",
      };
      return {
        ...prev,
        primaryTankLevel: 95,
        events: [event, ...prev.events].slice(0, 50),
      };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        togglePump,
        setAutoMode,
        setTheme,
        setNotificationsEnabled,
        setLowLevelThreshold,
        setCriticalLevelThreshold,
        setAutoTransferThreshold,
        simulateRefill,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useThemeColors() {
  const { theme } = useApp();
  const { Colors } = require("@/constants/colors");
  return Colors[theme === "system" ? "light" : theme];
}
