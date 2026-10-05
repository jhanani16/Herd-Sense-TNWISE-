import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Heart,
  MapPin,
  RefreshCw,
  Thermometer,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";
import type { AnimalRecord } from "../backend.d.ts";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";
import { StatusBadge } from "./StatusBadge";

interface DashboardViewProps {
  records: AnimalRecord[];
  isRefreshing: boolean;
  lastUpdated: string;
  lang?: Lang;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardView({
  records,
  isRefreshing,
  lastUpdated,
  lang = "en",
}: DashboardViewProps) {
  const total = records.length;
  const healthy = records.filter((r) => r.health_status === "Healthy").length;
  const monitor = records.filter((r) => r.health_status === "Monitor").length;
  const alert = records.filter((r) => r.health_status === "Alert").length;

  const summaryCards = [
    {
      label: t("totalAnimals", lang),
      value: total,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: t("healthy", lang),
      value: healthy,
      icon: Heart,
      color: "text-healthy",
      bg: "bg-healthy-bg",
    },
    {
      label: t("monitor", lang),
      value: monitor,
      icon: Thermometer,
      color: "text-monitor",
      bg: "bg-monitor-bg",
    },
    {
      label: t("alert", lang),
      value: alert,
      icon: Wind,
      color: "text-alert",
      bg: "bg-alert-bg",
    },
  ];

  const movementColor = {
    HIGH: "text-green-600 font-medium",
    MEDIUM: "text-yellow-600 font-medium",
    LOW: "text-red-600 font-semibold",
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {summaryCards.map((card) => (
          <motion.div key={card.label} variants={cardVariants}>
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  {card.label === "Alert" && alert > 0 && (
                    <span className="text-[10px] font-bold text-alert-fg bg-alert-bg px-1.5 py-0.5 rounded-full animate-pulse-ring">
                      LIVE
                    </span>
                  )}
                </div>
                <div
                  className={`text-3xl font-display font-bold ${card.color}`}
                >
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {card.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">
          {t("liveAnimalStatus", lang)}
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isRefreshing ? (
            <span
              className="flex items-center gap-1.5"
              data-ocid="sync.loading_state"
            >
              <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              {t("refreshing", lang)}
            </span>
          ) : (
            <span data-ocid="sync.success_state">
              {t("lastUpdated", lang)}: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Animals Table */}
      <Card className="shadow-card border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table data-ocid="dashboard.animals.table">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-display text-xs font-semibold">
                  {t("animalId", lang)}
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  {t("type", lang)}
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> {t("temp", lang)}
                  </span>
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  {t("movement", lang)}
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  {t("cough", lang)}
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {t("heartRate", lang)}
                  </span>
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {t("location", lang)}
                  </span>
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  {t("status", lang)}
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  {t("condition", lang)}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div
                      className="py-12 text-center text-muted-foreground"
                      data-ocid="dashboard.animals.empty_state"
                    >
                      <Activity className="mx-auto h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">{t("loadingAnimalData", lang)}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isRefreshing ? (
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable ID
                  <TableRow key={`skel-row-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no stable ID
                      <TableCell key={`skel-cell-${j}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                records.map((record, idx) => (
                  <TableRow
                    key={record.animal_id}
                    data-ocid={`dashboard.animals.row.${idx + 1}`}
                    className={
                      record.health_status === "Alert"
                        ? "bg-alert/5 hover:bg-alert/10"
                        : record.health_status === "Monitor"
                          ? "bg-monitor/5 hover:bg-monitor/10"
                          : "hover:bg-muted/30"
                    }
                  >
                    <TableCell className="font-mono text-sm font-semibold">
                      {record.animal_id}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {record.species === "Cow"
                          ? "🐄"
                          : record.species === "Goat"
                            ? "🐐"
                            : "🐑"}{" "}
                        {record.species}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          record.temperature > 39.5
                            ? "text-alert-fg"
                            : record.temperature > 39.0
                              ? "text-monitor-fg"
                              : "text-healthy-fg"
                        }`}
                      >
                        {record.temperature.toFixed(1)}°
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${
                          movementColor[
                            record.movement_level as keyof typeof movementColor
                          ] ?? "text-muted-foreground"
                        }`}
                      >
                        {record.movement_level}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">
                      {record.cough_count.toString()}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">
                      {record.heart_rate.toString()} bpm
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {record.location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.health_status} lang={lang} />
                    </TableCell>
                    <TableCell>
                      {record.detected_condition !== "None" ? (
                        <span className="text-xs font-semibold text-alert-fg bg-alert-bg px-2 py-0.5 rounded-md">
                          {lang === "ta"
                            ? record.detected_condition === "Infection Risk"
                              ? "தொற்று அபாயம்"
                              : record.detected_condition === "FMD Risk"
                                ? "கைக்கால் வாய் நோய்"
                                : "PPR நோய்"
                            : record.detected_condition}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
