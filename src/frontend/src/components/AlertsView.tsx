import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BellOff,
  Clock,
  MessageSquare,
  Siren,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Alert } from "../backend.d.ts";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";
import { speakTamil } from "../utils/voiceover";
import { SMSModal } from "./SMSModal";

interface AlertsViewProps {
  alerts: Alert[];
  lang: Lang;
  getTamilMessage: (alert: Alert) => string;
  onSmsSent?: (alert: Alert) => void;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  const d = new Date(ms);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDate(ts: bigint): string {
  const ms = Number(ts);
  const d = new Date(ms);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

interface AlertCardProps {
  alert: Alert;
  index: number;
  lang: Lang;
  tamilMessage: string;
  onSmsClick: (alert: Alert, tamilMsg: string) => void;
}

function AlertCard({
  alert,
  index,
  lang,
  tamilMessage,
  onSmsClick,
}: AlertCardProps) {
  const isCritical = alert.severity === "critical";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = () => {
    setIsSpeaking(true);
    speakTamil(tamilMessage);
    // Reset speaking state after estimated duration
    const estimatedDuration = tamilMessage.length * 80 + 1000;
    setTimeout(() => setIsSpeaking(false), estimatedDuration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`alerts.item.${index + 1}`}
    >
      <Card
        className={`border-0 shadow-xs overflow-hidden ${
          isCritical
            ? "bg-alert/5 ring-1 ring-alert/20"
            : "bg-monitor/5 ring-1 ring-monitor/20"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div
              className={`flex-shrink-0 p-2 rounded-lg ${
                isCritical ? "bg-alert-bg" : "bg-monitor-bg"
              }`}
            >
              {isCritical ? (
                <Siren className="h-5 w-5 text-alert-fg" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-monitor-fg" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    isCritical
                      ? "bg-alert-bg text-alert-fg"
                      : "bg-monitor-bg text-monitor-fg"
                  }`}
                >
                  {isCritical ? t("critical", lang) : t("warning", lang)}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {alert.animal_id}
                </span>
                <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(alert.timestamp)}{" "}
                  {formatTimestamp(alert.timestamp)}
                </span>
              </div>

              {/* English message */}
              <p className="text-sm text-foreground leading-relaxed">
                {alert.message}
              </p>

              {/* Tamil message */}
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed bg-muted/40 px-2 py-1.5 rounded-md border-l-2 border-primary/30">
                {tamilMessage}
              </p>

              <p className="text-xs text-muted-foreground mt-1 font-mono">
                ID: {alert.alert_id.split("-").slice(0, 3).join("-")}...
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleListen}
                  disabled={isSpeaking}
                  data-ocid={`alerts.listen.button.${index + 1}`}
                  className={`h-7 text-xs gap-1.5 ${isCritical ? "border-alert/30 text-alert-fg hover:bg-alert-bg" : "border-monitor/30 text-monitor-fg hover:bg-monitor-bg"}`}
                >
                  <Volume2
                    className={`h-3.5 w-3.5 ${isSpeaking ? "animate-pulse" : ""}`}
                  />
                  {isSpeaking ? "🔊 ..." : t("listenButton", lang)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSmsClick(alert, tamilMessage)}
                  data-ocid={`alerts.sms.button.${index + 1}`}
                  className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t("sendSms", lang)}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AlertsView({
  alerts,
  lang,
  getTamilMessage,
  onSmsSent,
}: AlertsViewProps) {
  const critical = alerts.filter((a) => a.severity === "critical");
  const warnings = alerts.filter((a) => a.severity === "warning");

  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsAlert, setSmsAlert] = useState<Alert | null>(null);
  const [smsTamilMessage, setSmsTamilMessage] = useState("");

  const handleSmsClick = (alert: Alert, tamilMsg: string) => {
    setSmsAlert(alert);
    setSmsTamilMessage(tamilMsg);
    setSmsModalOpen(true);
  };

  const handleSmsSend = () => {
    if (smsAlert && onSmsSent) {
      onSmsSent(smsAlert);
    }
    setSmsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-display font-bold text-alert-fg">
              {critical.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("critical", lang)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-display font-bold text-monitor-fg">
              {warnings.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("warnings", lang)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-display font-bold text-foreground">
              {alerts.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("total", lang)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="alerts.history.empty_state"
        >
          <div className="p-4 rounded-full bg-muted mb-4">
            <BellOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            {t("noAlerts", lang)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t("allHealthy", lang)}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {critical.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-semibold text-alert-fg flex items-center gap-1.5">
                <Siren className="h-4 w-4" />
                {t("criticalAlerts", lang)} ({critical.length})
              </h3>
              <AnimatePresence>
                {critical.map((alert, i) => (
                  <AlertCard
                    key={alert.alert_id}
                    alert={alert}
                    index={i}
                    lang={lang}
                    tamilMessage={getTamilMessage(alert)}
                    onSmsClick={handleSmsClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-semibold text-monitor-fg flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                {t("warnings", lang)} ({warnings.length})
              </h3>
              <AnimatePresence>
                {warnings.map((alert, i) => (
                  <AlertCard
                    key={alert.alert_id}
                    alert={alert}
                    index={critical.length + i}
                    lang={lang}
                    tamilMessage={getTamilMessage(alert)}
                    onSmsClick={handleSmsClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* History Log */}
          {alerts.length > 5 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-semibold text-muted-foreground">
                {t("alertHistory", lang)}
              </h3>
              <ScrollArea
                className="h-64 rounded-lg border bg-muted/30"
                data-ocid="alerts.history.list"
              >
                <div className="p-3 space-y-1.5">
                  {alerts.slice(5).map((alert) => (
                    <div
                      key={alert.alert_id}
                      className="flex items-start gap-2 text-xs py-1.5 border-b border-border/50 last:border-0"
                    >
                      <span
                        className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-alert"
                            : "bg-monitor"
                        }`}
                      />
                      <span className="text-muted-foreground flex-1 leading-relaxed">
                        {lang === "ta" ? getTamilMessage(alert) : alert.message}
                      </span>
                      <span className="text-muted-foreground/70 shrink-0 tabular-nums">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* SMS Modal */}
      <SMSModal
        open={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        alert={smsAlert}
        tamilMessage={smsTamilMessage}
        lang={lang}
        onSend={handleSmsSend}
      />
    </div>
  );
}
