import { useColorScheme } from "react-native";
import { Colors, ThemeColors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const { theme } = useApp();
  const systemScheme = useColorScheme();

  const scheme =
    theme === "system" ? (systemScheme ?? "light") : theme;

  const isDark = scheme === "dark";

  return {
    colors: Colors[scheme],
    isDark,
  };
}
