import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnimalRecord } from "../backend.d.ts";
import {
  type DistrictStats,
  computeDistrictStats,
  generateDistrictTrend,
} from "../utils/simulation";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";

interface RegionalAnalyticsViewProps {
  records: AnimalRecord[];
  lang?: Lang;
}

const DISTRICT_INFO: Record<string, { tamil: string; emoji: string }> = {
  Erode: { tamil: "ஈரோடு", emoji: "🌾" },
  Coimbatore: { tamil: "கோயம்புத்தூர்", emoji: "🏙️" },
  Salem: { tamil: "சேலம்", emoji: "⛰️" },
  Tiruppur: { tamil: "திருப்பூர்", emoji: "🧵" },
  Namakkal: { tamil: "நாமக்கல்", emoji: "🐓" },
};

function getRiskColor(risk: string) {
  if (risk === "High Risk") return "text-alert-fg bg-alert-bg";
  if (risk === "Moderate") return "text-monitor-fg bg-monitor-bg";
  return "text-healthy-fg bg-healthy-bg";
}

function DistrictCard({
  stats,
  index,
  isHighlighted,
  ocid,
  lang = "en",
}: {
  stats: DistrictStats;
  index: number;
  isHighlighted: boolean;
  ocid: string;
  lang?: Lang;
}) {
  const info = DISTRICT_INFO[stats.district] ?? {
    tamil: stats.district,
    emoji: "📍",
  };
  const trend = generateDistrictTrend(stats.district);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      data-ocid={ocid}
    >
      <Card
        className={`shadow-card border-0 overflow-hidden ${
          isHighlighted ? "ring-2 ring-alert/40" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{info.emoji}</span>
                <CardTitle className="font-display text-base">
                  {stats.district}
                </CardTitle>
                {isHighlighted && (
                  <span className="text-[10px] font-bold text-alert-fg bg-alert-bg px-1.5 py-0.5 rounded-full">
                    HIGHEST RISK
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{info.tamil}</p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-lg ${getRiskColor(stats.outbreakRisk)}`}
            >
              {stats.outbreakRisk === "High Risk"
                ? t("highRisk", lang)
                : stats.outbreakRisk === "Moderate"
                  ? t("moderate", lang)
                  : t("low", lang)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-display font-bold text-foreground">
                {stats.total}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("totalLabel", lang)}
              </div>
            </div>
            <div>
              <div className="text-xl font-display font-bold text-healthy-fg">
                {stats.healthy}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("healthyLabel", lang)}
              </div>
            </div>
            <div>
              <div className="text-xl font-display font-bold text-monitor-fg">
                {stats.monitor}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("monitorLabel", lang)}
              </div>
            </div>
            <div>
              <div
                className={`text-xl font-display font-bold ${
                  stats.alert > 0 ? "text-alert-fg" : "text-muted-foreground"
                }`}
              >
                {stats.alert}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("alertLabel", lang)}
              </div>
            </div>
          </div>

          {/* 7-day trend */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {t("sevenDayTrend", lang)}
            </p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart
                data={trend}
                margin={{ top: 2, right: 4, left: -24, bottom: 0 }}
              >
                <Line
                  type="monotone"
                  dataKey="alert"
                  stroke="oklch(0.58 0.22 28)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="monitor"
                  stroke="oklch(0.72 0.17 75)"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, padding: "4px 8px" }}
                  labelStyle={{ fontWeight: 600 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function RegionalAnalyticsView({
  records,
  lang = "en",
}: RegionalAnalyticsViewProps) {
  const districtStats = computeDistrictStats(records);
  const maxAlertDistrict = districtStats.reduce(
    (prev, curr) => (curr.alert > prev.alert ? curr : prev),
    districtStats[0],
  );

  const barData = districtStats.map((d) => ({
    name: d.district,
    Healthy: d.healthy,
    Monitor: d.monitor,
    Alert: d.alert,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <Card className="shadow-card border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {t("districtOverview", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={barData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0.02 155)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontFamily: "General Sans" }}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.88 0.02 155)",
                  fontFamily: "General Sans",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="Healthy"
                fill="oklch(0.55 0.16 155)"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="Monitor"
                fill="oklch(0.72 0.17 75)"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="Alert"
                fill="oklch(0.58 0.22 28)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Outbreak Summary */}
      {maxAlertDistrict && maxAlertDistrict.alert > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 bg-alert/5 ring-1 ring-alert/20 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-alert-fg shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-alert-fg">
                    {t("highestRiskDistrict", lang)}:{" "}
                    {maxAlertDistrict.district}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {maxAlertDistrict.alert} {t("animalsInAlert", lang)}.{" "}
                    {maxAlertDistrict.outbreakRisk === "High Risk"
                      ? t("immediateVet", lang)
                      : t("monitorVet", lang)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {districtStats.map((stats, i) => (
          <DistrictCard
            key={stats.district}
            stats={stats}
            index={i}
            isHighlighted={
              stats.district === maxAlertDistrict?.district && stats.alert > 0
            }
            ocid={`analytics.district.card.${i + 1}`}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
