import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Brain,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Alert, AnimalRecord } from "./backend.d.ts";
import { AIPredictionView } from "./components/AIPredictionView";
import { AlertsView } from "./components/AlertsView";
import { DashboardView } from "./components/DashboardView";
import { FarmerSettingsView } from "./components/FarmerSettingsView";
import { LoRaGatewayPanel } from "./components/LoRaGatewayPanel";
import { RegionalAnalyticsView } from "./components/RegionalAnalyticsView";
import { useActor } from "./hooks/useActor";
import {
  requestNotificationPermission,
  sendPushNotification,
} from "./utils/notifications";
import {
  generateAlerts,
  generateAnimalRecords,
  generateTamilAlertMessage,
} from "./utils/simulation";
import type { Lang } from "./utils/translations";
import { t } from "./utils/translations";

type View = "dashboard" | "alerts" | "analytics" | "prediction" | "settings";

function getTimeString(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function App() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(getTimeString());
  const [records, setRecords] = useState<AnimalRecord[]>(() =>
    generateAnimalRecords(Math.floor(Math.random() * 1000)),
  );
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) ?? "en",
  );
  const intervalRef = useRef<number | null>(null);

  const { actor } = useActor();

  // Request push notification permission on mount
  useEffect(() => {
    requestNotificationPermission().catch(() => {});
  }, []);

  // Sync language preference
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Submit to backend when online
  const syncToBackend = useCallback(
    async (newRecords: AnimalRecord[], newAlerts: Alert[]) => {
      if (!actor || isOffline) return;
      try {
        await Promise.all([
          ...newRecords.map((r) => actor.submitRecord(r).catch(() => {})),
          ...newAlerts.map((a) => actor.submitAlert(a).catch(() => {})),
        ]);
      } catch {
        // silent fallback — app works without backend
      }
    },
    [actor, isOffline],
  );

  // Core refresh logic — always runs even in offline/LoRa mode
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const newSeed = Math.floor(Math.random() * 10000);

    const newRecords = generateAnimalRecords(newSeed);
    const newAlerts = generateAlerts(newRecords);

    // Simulate brief loading delay
    await new Promise((r) => setTimeout(r, 600));

    setRecords(newRecords);
    setAlertHistory((prev) => {
      const combined = [...newAlerts, ...prev];
      // Dedupe by animal_id keeping latest
      const seen = new Set<string>();
      const deduped = combined.filter((a) => {
        if (seen.has(a.animal_id)) return false;
        seen.add(a.animal_id);
        return true;
      });
      return deduped.slice(0, 50); // cap history
    });

    setLastUpdated(getTimeString());
    setIsRefreshing(false);

    // Send push notifications for critical alerts
    const criticalAlerts = newAlerts.filter((a) => a.severity === "critical");
    if (criticalAlerts.length > 0) {
      const firstCritical = criticalAlerts[0];
      // Find the matching record for Tamil message
      const record = newRecords.find(
        (r) => r.animal_id === firstCritical.animal_id,
      );
      const tamilMsg = record
        ? generateTamilAlertMessage(record)
        : firstCritical.message;
      sendPushNotification(t("notifTitle", lang), tamilMsg);
    }

    // Only sync to backend when internet is available (LoRa mode: data stays local)
    if (!isOffline) {
      syncToBackend(newRecords, newAlerts);
    }
  }, [isOffline, syncToBackend, lang]);

  // Auto-refresh every 8 seconds — ALWAYS runs (LoRa gateway simulation)
  // This intentionally does NOT depend on isOffline — sensors keep ticking
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      refresh();
    }, 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  // Initial data load — intentionally runs once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time init
  useEffect(() => {
    const seed = Math.floor(Math.random() * 1000);
    const initial = generateAnimalRecords(seed);
    const initialAlerts = generateAlerts(initial);
    setRecords(initial);
    setAlertHistory(initialAlerts);
    syncToBackend(initial, initialAlerts);
  }, []);

  // Handle offline toggle — only affects backend sync, NOT the sensor refresh
  const handleOfflineToggle = async (checked: boolean) => {
    const goingOnline = isOffline && !checked;
    setIsOffline(!checked);

    if (goingOnline) {
      // Going back online — sync buffered data
      setIsSyncing(true);
      await new Promise((r) => setTimeout(r, 2000));
      setIsSyncing(false);
      syncToBackend(records, alertHistory);
      toast.success(t("syncSuccess", lang), {
        description: `${records.length} ${t("recordsSynced", lang)}`,
      });
    }
  };

  // Language toggle
  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  };

  // SMS handler
  const handleSmsSent = (alert: Alert) => {
    toast.success(t("smsSent", lang), {
      description: t("smsDescription", lang),
      duration: 3000,
    });
    // Simulate background alert log
    console.info("SMS alert dispatched for:", alert.animal_id);
  };

  // Helper to get Tamil message for any alert
  const getTamilMessage = useCallback(
    (alert: Alert): string => {
      const record = records.find((r) => r.animal_id === alert.animal_id);
      if (record) return generateTamilAlertMessage(record);
      // Fallback if record not found
      return `எச்சரிக்கை: ${alert.animal_id} - ${alert.message}`;
    },
    [records],
  );

  const alertCount = alertHistory.filter(
    (a) => a.severity === "critical",
  ).length;

  const navItems = [
    {
      id: "dashboard" as View,
      label: t("dashboard", lang),
      icon: LayoutDashboard,
      ocid: "nav.dashboard.link",
    },
    {
      id: "alerts" as View,
      label: t("alerts", lang),
      icon: Bell,
      ocid: "nav.alerts.link",
    },
    {
      id: "analytics" as View,
      label: t("analytics", lang),
      icon: MapPin,
      ocid: "nav.analytics.link",
    },
    {
      id: "prediction" as View,
      label: t("aiPredict", lang),
      icon: Brain,
      ocid: "nav.prediction.link",
    },
    {
      id: "settings" as View,
      label: t("settingsTitle", lang),
      icon: Settings,
      ocid: "nav.settings.link",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="gradient-hero sticky top-0 z-40 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/assets/generated/livestock-logo-transparent.dim_80x80.png"
                alt="Livestock Monitor"
                className="h-9 w-9 object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="font-display text-white text-base font-bold leading-tight truncate">
                  {t("appTitle", lang)}
                </h1>
                <p className="text-white/60 text-[11px] hidden sm:block">
                  {t("appSubtitle", lang)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {/* LoRa Gateway Panel */}
              <div className="hidden lg:block">
                <LoRaGatewayPanel isInternetOffline={isOffline} lang={lang} />
              </div>

              {/* Language Toggle */}
              <button
                type="button"
                onClick={toggleLang}
                data-ocid="header.lang.toggle"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 transition-colors"
                title={lang === "en" ? "Switch to Tamil" : "ஆங்கிலத்திற்கு மாறு"}
              >
                <span
                  className={`text-xs font-bold transition-opacity ${lang === "en" ? "text-white" : "text-white/50"}`}
                >
                  EN
                </span>
                <span className="text-white/40 text-xs">|</span>
                <span
                  className={`text-xs font-bold transition-opacity ${lang === "ta" ? "text-white" : "text-white/50"}`}
                >
                  தமிழ்
                </span>
              </button>

              {/* Refresh button */}
              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                data-ocid="dashboard.refresh.button"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                title="Refresh now"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>

              {/* Internet Offline Toggle */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="offline-toggle"
                  className="text-white/80 text-xs hidden sm:block cursor-pointer"
                >
                  {isOffline ? t("offline", lang) : t("online", lang)}
                </Label>
                <Switch
                  id="offline-toggle"
                  checked={!isOffline}
                  onCheckedChange={handleOfflineToggle}
                  data-ocid="dashboard.offline.toggle"
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                />
                {isOffline ? (
                  <WifiOff className="h-4 w-4 text-orange-300" />
                ) : (
                  <Wifi className="h-4 w-4 text-green-300" />
                )}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 mt-3">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.id === "alerts" && alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {alertCount}
                  </span>
                )}
              </button>
            ))}

            {/* LoRa panel on smaller desktops in nav row */}
            <div className="ml-auto lg:hidden">
              <LoRaGatewayPanel isInternetOffline={isOffline} lang={lang} />
            </div>
          </nav>
        </div>
      </header>

      {/* ── Status Banners ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-offline text-white text-sm font-medium text-center py-2 overflow-hidden"
          >
            <span className="flex items-center justify-center gap-2">
              <WifiOff className="h-4 w-4" />
              {t("offlineBanner", lang)}
            </span>
          </motion.div>
        )}
        {isSyncing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/90 text-white text-sm font-medium text-center py-2 overflow-hidden"
            data-ocid="sync.loading_state"
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-sync" />
              {t("syncingBanner", lang)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeView === "dashboard" && (
              <DashboardView
                records={records}
                isRefreshing={isRefreshing}
                lastUpdated={lastUpdated}
                lang={lang}
              />
            )}
            {activeView === "alerts" && (
              <AlertsView
                alerts={alertHistory}
                lang={lang}
                getTamilMessage={getTamilMessage}
                onSmsSent={handleSmsSent}
              />
            )}
            {activeView === "analytics" && (
              <RegionalAnalyticsView records={records} lang={lang} />
            )}
            {activeView === "prediction" && (
              <AIPredictionView records={records} lang={lang} />
            )}
            {activeView === "settings" && <FarmerSettingsView lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ───────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg">
        <div className="flex">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => setActiveView(item.id)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                activeView === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.id === "alerts" && alertCount > 0 && (
                <span className="absolute top-1.5 right-1/4 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
