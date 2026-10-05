import { Badge } from "@/components/ui/badge";
import { Activity, Radio, Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";

interface LoRaGatewayPanelProps {
  isInternetOffline: boolean;
  lang: Lang;
}

export function LoRaGatewayPanel({
  isInternetOffline,
  lang,
}: LoRaGatewayPanelProps) {
  const [lastPacketSecs, setLastPacketSecs] = useState(2);
  const [signalDbm] = useState(-87);

  // Simulate packet arrival every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastPacketSecs((prev) => {
        if (prev >= 3) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      data-ocid="lora.gateway.panel"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
    >
      {/* LoRa Active badge */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[11px] font-bold text-emerald-300 hidden sm:block">
          {t("loraActive", lang)}
        </span>
      </div>

      <div className="h-4 w-px bg-white/20 hidden sm:block" />

      {/* Radio icon + signal */}
      <div className="flex items-center gap-1 text-white/70">
        <Radio className="h-3.5 w-3.5" />
        <span className="text-[11px] font-mono hidden md:block">
          {signalDbm} dBm
        </span>
      </div>

      {/* Nodes */}
      <div className="flex items-center gap-1 text-white/70">
        <Activity className="h-3.5 w-3.5" />
        <span className="text-[11px] hidden md:block">
          17 {t("nodes", lang)}
        </span>
      </div>

      {/* Last packet */}
      <div className="flex items-center gap-1 text-white/60 hidden lg:flex">
        <span className="text-[11px] font-mono tabular-nums">
          {lastPacketSecs}s {t("secondsAgo", lang)}
        </span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      {/* Internet status */}
      <div className="flex items-center gap-1">
        {isInternetOffline ? (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-orange-400/50 text-orange-300 bg-orange-500/10"
          >
            <WifiOff className="h-2.5 w-2.5 mr-1" />
            {t("internetDisconnected", lang)}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-emerald-400/50 text-emerald-300 bg-emerald-500/10"
          >
            <Wifi className="h-2.5 w-2.5 mr-1" />
            {t("internetConnected", lang)}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
