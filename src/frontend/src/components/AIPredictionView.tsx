import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Brain, Thermometer, TrendingUp, Wind } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { AnimalRecord } from "../backend.d.ts";
import { computeRiskScores } from "../utils/simulation";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";
import { StatusBadge } from "./StatusBadge";

interface AIPredictionViewProps {
  records: AnimalRecord[];
  lang?: Lang;
}

function getRiskLevel(
  score: number,
  lang: Lang = "en",
): {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (score >= 60)
    return {
      label: t("highRiskLabel", lang),
      color: "oklch(0.58 0.22 28)",
      bgColor: "bg-alert-bg",
      textColor: "text-alert-fg",
    };
  if (score >= 30)
    return {
      label: t("moderateRiskLabel", lang),
      color: "oklch(0.72 0.17 75)",
      bgColor: "bg-monitor-bg",
      textColor: "text-monitor-fg",
    };
  return {
    label: t("lowRiskLabel", lang),
    color: "oklch(0.55 0.16 155)",
    bgColor: "bg-healthy-bg",
    textColor: "text-healthy-fg",
  };
}

function RiskBar({
  label,
  value,
  color,
  lang = "en",
}: {
  label: string;
  value: number;
  color: string;
  lang?: Lang;
}) {
  const level = getRiskLevel(value, lang);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className={`font-bold tabular-nums text-lg ${level.textColor}`}>
          {value}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span
        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${level.bgColor} ${level.textColor}`}
      >
        {level.label}
      </span>
    </div>
  );
}

export function AIPredictionView({
  records,
  lang = "en",
}: AIPredictionViewProps) {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(
    records[0]?.animal_id ?? "",
  );

  const selected =
    records.find((r) => r.animal_id === selectedAnimalId) ?? records[0];

  const rankedAnimals = useMemo(() => {
    return [...records]
      .map((r) => {
        const { pprRisk, fmdRisk } = computeRiskScores(
          r.temperature,
          Number(r.cough_count),
          r.movement_level,
        );
        const combinedRisk = Math.round((pprRisk + fmdRisk) / 2);
        return { ...r, pprRisk, fmdRisk, combinedRisk };
      })
      .sort((a, b) => b.combinedRisk - a.combinedRisk);
  }, [records]);

  const selectedScores = selected
    ? computeRiskScores(
        selected.temperature,
        Number(selected.cough_count),
        selected.movement_level,
      )
    : { pprRisk: 0, fmdRisk: 0 };

  const primaryRisk = Math.max(selectedScores.pprRisk, selectedScores.fmdRisk);
  const primaryLevel = getRiskLevel(primaryRisk);

  // Risk factor breakdown
  const tempContrib = selected
    ? Math.round((selected.temperature - 38) * 20)
    : 0;
  const coughContrib = selected
    ? Math.round(Number(selected.cough_count) * 8)
    : 0;
  const movContrib = selected?.movement_level === "LOW" ? 20 : 0;

  const getAssessmentText = (score: number): string => {
    if (score >= 75) return t("assessCritical", lang);
    if (score >= 60) return t("assessHigh", lang);
    if (score >= 40) return t("assessModerate", lang);
    if (score >= 20) return t("assessLow", lang);
    return t("assessHealthy", lang);
  };

  return (
    <div className="space-y-6" data-ocid="prediction.risk.panel">
      {/* Animal Selector */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            {t("aiTitle", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="animal-select"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {t("selectAnimal", lang)}
            </Label>
            <Select
              value={selectedAnimalId}
              onValueChange={setSelectedAnimalId}
            >
              <SelectTrigger
                id="animal-select"
                className="w-full max-w-xs"
                data-ocid="prediction.animal.select"
              >
                <SelectValue placeholder={t("selectAnimalPlaceholder", lang)} />
              </SelectTrigger>
              <SelectContent>
                {records.map((r) => (
                  <SelectItem key={r.animal_id} value={r.animal_id}>
                    <span className="flex items-center gap-2">
                      <span>
                        {r.species === "Cow"
                          ? "🐄"
                          : r.species === "Goat"
                            ? "🐐"
                            : "🐑"}
                      </span>
                      <span className="font-mono">{r.animal_id}</span>
                      <span className="text-muted-foreground">
                        — {r.location}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <motion.div
          key={selected.animal_id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Current Readings */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm text-muted-foreground">
                Current Readings —{" "}
                <span className="font-mono text-foreground">
                  {selected.animal_id}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Thermometer className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="text-lg font-display font-bold tabular-nums">
                      {selected.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("temperatureLabel", lang)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Activity className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="text-lg font-display font-bold tabular-nums">
                      {selected.heart_rate.toString()} bpm
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("heartRate", lang)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Wind className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="text-lg font-display font-bold tabular-nums">
                      {selected.cough_count.toString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("coughCountLabel", lang)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div
                      className={`text-sm font-display font-bold ${
                        selected.movement_level === "LOW"
                          ? "text-alert-fg"
                          : selected.movement_level === "MEDIUM"
                            ? "text-monitor-fg"
                            : "text-healthy-fg"
                      }`}
                    >
                      {selected.movement_level}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("movementLabel", lang)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Scores */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm">
                {t("riskAssessment", lang)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <RiskBar
                label={t("pprRiskLabel", lang)}
                value={selectedScores.pprRisk}
                color="oklch(0.58 0.22 28)"
                lang={lang}
              />
              <RiskBar
                label={t("fmdRiskLabel", lang)}
                value={selectedScores.fmdRisk}
                color="oklch(0.5 0.14 270)"
                lang={lang}
              />

              {/* Factor Breakdown */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {t("riskFactors", lang)}
                </p>
                <div className="space-y-2">
                  {tempContrib > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        {t("highTemp", lang)} ({selected.temperature.toFixed(1)}
                        °C)
                      </span>
                      <span className="font-mono font-semibold text-alert-fg">
                        +{tempContrib} pts
                      </span>
                    </div>
                  )}
                  {coughContrib > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Wind className="h-3 w-3" />
                        {t("highCough", lang)} (
                        {selected.cough_count.toString()})
                      </span>
                      <span className="font-mono font-semibold text-alert-fg">
                        +{coughContrib} pts
                      </span>
                    </div>
                  )}
                  {movContrib > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {t("lowMovement", lang)}
                      </span>
                      <span className="font-mono font-semibold text-alert-fg">
                        +{movContrib} pts
                      </span>
                    </div>
                  )}
                  {tempContrib === 0 &&
                    coughContrib === 0 &&
                    movContrib === 0 && (
                      <p className="text-sm text-healthy-fg">
                        {t("allVitalsNormal", lang)}
                      </p>
                    )}
                </div>
              </div>

              {/* Assessment */}
              <div
                className={`p-3 rounded-lg ${primaryLevel.bgColor} border border-current/10`}
              >
                <p
                  className={`text-sm font-semibold ${primaryLevel.textColor}`}
                >
                  {getAssessmentText(primaryRisk)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("status", lang)}:{" "}
                  <StatusBadge
                    status={selected.health_status}
                    className="ml-1"
                    lang={lang}
                  />
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bulk Ranking Table */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("allAnimalsRanking", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("animalCol", lang)}
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("speciesCol", lang)}
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("pprCol", lang)}
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("fmdCol", lang)}
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("combinedCol", lang)}
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    {t("statusCol", lang)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedAnimals.map((animal, idx) => {
                  const combinedLevel = getRiskLevel(animal.combinedRisk, lang);
                  return (
                    <TableRow
                      key={animal.animal_id}
                      className={
                        animal.animal_id === selectedAnimalId
                          ? "bg-primary/5"
                          : "hover:bg-muted/30"
                      }
                      data-ocid={`prediction.animals.row.${idx + 1}`}
                    >
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold">
                        {animal.animal_id}
                      </TableCell>
                      <TableCell className="text-sm">
                        {animal.species === "Cow"
                          ? "🐄"
                          : animal.species === "Goat"
                            ? "🐐"
                            : "🐑"}{" "}
                        {animal.species}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${animal.pprRisk}%`,
                                backgroundColor: "oklch(0.58 0.22 28)",
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums">
                            {animal.pprRisk}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${animal.fmdRisk}%`,
                                backgroundColor: "oklch(0.5 0.14 270)",
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums">
                            {animal.fmdRisk}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm font-bold tabular-nums ${combinedLevel.textColor}`}
                        >
                          {animal.combinedRisk}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={animal.health_status}
                          lang={lang}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
