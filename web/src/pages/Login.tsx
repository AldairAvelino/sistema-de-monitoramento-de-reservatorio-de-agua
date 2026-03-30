import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Droplets, Sun, Moon, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@reservoir.io");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url(https://mgx-backend-cdn.metadl.com/generate/images/115140/2026-03-30/b9af3b20-feca-436d-8440-957436243825.png)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="absolute top-4 right-4 z-10 h-9 w-9"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      {/* Login card */}
      <Card className="relative z-10 w-full max-w-sm mx-4 border-border/50 shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/25">
            <Droplets className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AquaGuard</h1>
          <p className="text-sm text-muted-foreground mt-1">IoT Water Reservoir Monitor</p>
        </CardHeader>
        <CardContent className="pt-4 pb-8 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@reservoir.io"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-10 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Demo: use any email & password
          </p>
        </CardContent>
      </Card>
    </div>
  );
}