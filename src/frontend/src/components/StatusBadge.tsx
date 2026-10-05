import { cn } from "@/lib/utils";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";

interface StatusBadgeProps {
  status: string;
  className?: string;
  lang?: Lang;
}

export function StatusBadge({
  status,
  className,
  lang = "en",
}: StatusBadgeProps) {
  const styles =
    {
      Healthy: "status-healthy",
      Monitor: "status-monitor",
      Alert: "status-alert",
    }[status] ?? "status-healthy";

  const dots =
    {
      Healthy: "bg-green-500",
      Monitor: "bg-yellow-500",
      Alert: "bg-red-500 animate-pulse",
    }[status] ?? "bg-green-500";

  const label =
    {
      Healthy: t("statusHealthy", lang),
      Monitor: t("statusMonitor", lang),
      Alert: t("statusAlert", lang),
    }[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        styles,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dots)} />
      {label}
    </span>
  );
}
