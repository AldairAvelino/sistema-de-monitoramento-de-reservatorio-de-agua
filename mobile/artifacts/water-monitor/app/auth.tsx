import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

type Tab = "login" | "register";

export default function AuthScreen() {
  const { login, register } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setEmailError("");
    setPasswordError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }
    if (activeTab === "register" && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      let success = false;
      if (activeTab === "login") {
        success = await login(email, password);
      } else {
        success = await register(name, email, password);
      }

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)/dashboard");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Authentication Failed",
          activeTab === "login"
            ? "Invalid email or password."
            : "Could not create account. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPad },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: botPad + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.logoMini,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="droplet" size={26} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>AquaGuard</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {activeTab === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </Text>
        </View>

        <View
          style={[
            styles.tabBar,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
        >
          {(["login", "register"] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && {
                  backgroundColor: colors.surface,
                  shadowColor: colors.shadowDark,
                },
              ]}
              onPress={() => switchTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab ? colors.text : colors.textSecondary,
                    fontFamily:
                      activeTab === tab
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                  },
                ]}
              >
                {tab === "login" ? "Sign In" : "Register"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          {activeTab === "register" && (
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Full Name
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="user" size={16} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Email Address
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: emailError ? colors.danger : colors.border,
                },
              ]}
            >
              <Feather name="mail" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError ? (
              <Text style={[styles.fieldError, { color: colors.danger }]}>
                {emailError}
              </Text>
            ) : null}
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: passwordError ? colors.danger : colors.border,
                },
              ]}
            >
              <Feather name="lock" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setPasswordError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={[styles.fieldError, { color: colors.danger }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>

          {activeTab === "register" && (
            <View style={styles.fieldWrapper}>
              <Text
                style={[styles.fieldLabel, { color: colors.textSecondary }]}
              >
                Confirm Password
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: passwordError ? colors.danger : colors.border,
                  },
                ]}
              >
                <Feather name="lock" size={16} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: colors.primary },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {activeTab === "login" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  logoMini: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
  },
  form: { gap: 16 },
  fieldWrapper: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  eyeBtn: { padding: 2 },
  fieldError: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
