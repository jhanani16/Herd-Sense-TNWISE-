import type { Alert, AnimalRecord } from "../backend.d.ts";

// ── Stable Animal Registry ────────────────────────────────────────────
export interface AnimalDef {
  animal_id: string;
  species: "Cow" | "Goat" | "Sheep";
  farm_id: string;
  location: string;
}

const LOCATIONS = ["Erode", "Coimbatore", "Salem", "Tiruppur", "Namakkal"];
const FARM_IDS = [
  "FARM-TN-01",
  "FARM-TN-02",
  "FARM-TN-03",
  "FARM-TN-04",
  "FARM-TN-05",
];

export const STABLE_ANIMALS: AnimalDef[] = [
  {
    animal_id: "COW-001",
    species: "Cow",
    farm_id: "FARM-TN-01",
    location: "Erode",
  },
  {
    animal_id: "COW-002",
    species: "Cow",
    farm_id: "FARM-TN-01",
    location: "Erode",
  },
  {
    animal_id: "COW-003",
    species: "Cow",
    farm_id: "FARM-TN-02",
    location: "Coimbatore",
  },
  {
    animal_id: "COW-004",
    species: "Cow",
    farm_id: "FARM-TN-02",
    location: "Coimbatore",
  },
  {
    animal_id: "COW-005",
    species: "Cow",
    farm_id: "FARM-TN-03",
    location: "Salem",
  },
  {
    animal_id: "GOAT-001",
    species: "Goat",
    farm_id: "FARM-TN-01",
    location: "Erode",
  },
  {
    animal_id: "GOAT-002",
    species: "Goat",
    farm_id: "FARM-TN-02",
    location: "Coimbatore",
  },
  {
    animal_id: "GOAT-003",
    species: "Goat",
    farm_id: "FARM-TN-03",
    location: "Salem",
  },
  {
    animal_id: "GOAT-004",
    species: "Goat",
    farm_id: "FARM-TN-04",
    location: "Tiruppur",
  },
  {
    animal_id: "GOAT-005",
    species: "Goat",
    farm_id: "FARM-TN-05",
    location: "Namakkal",
  },
  {
    animal_id: "GOAT-006",
    species: "Goat",
    farm_id: "FARM-TN-05",
    location: "Namakkal",
  },
  {
    animal_id: "SHP-001",
    species: "Sheep",
    farm_id: "FARM-TN-01",
    location: "Erode",
  },
  {
    animal_id: "SHP-002",
    species: "Sheep",
    farm_id: "FARM-TN-03",
    location: "Salem",
  },
  {
    animal_id: "SHP-003",
    species: "Sheep",
    farm_id: "FARM-TN-04",
    location: "Tiruppur",
  },
  {
    animal_id: "SHP-004",
    species: "Sheep",
    farm_id: "FARM-TN-04",
    location: "Tiruppur",
  },
  {
    animal_id: "SHP-005",
    species: "Sheep",
    farm_id: "FARM-TN-05",
    location: "Namakkal",
  },
  {
    animal_id: "COW-021",
    species: "Cow",
    farm_id: "FARM-TN-03",
    location: "Salem",
  },
  {
    animal_id: "GOAT-021",
    species: "Goat",
    farm_id: "FARM-TN-02",
    location: "Coimbatore",
  },
];

// Simple seeded pseudo-random (deterministic per seed)
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function randRange(min: number, max: number, seed: number): number {
  return min + seededRand(seed) * (max - min);
}

// ── Disease Detection Rules ───────────────────────────────────────────
export function detectCondition(
  temperature: number,
  cough_count: number,
  movement_level: string,
  species: string,
): { health_status: string; detected_condition: string } {
  const cough = Number(cough_count);

  // Priority: Alert > Monitor > Healthy
  if (temperature > 39.5 && movement_level === "LOW") {
    return {
      health_status: "Alert",
      detected_condition: "Infection Risk",
    };
  }
  if (cough > 3 && temperature > 39) {
    const condition = species === "Cow" ? "FMD Risk" : "PPR Risk";
    return {
      health_status: "Alert",
      detected_condition: condition,
    };
  }
  if (temperature > 39.0 && temperature <= 39.5) {
    return {
      health_status: "Monitor",
      detected_condition: "None",
    };
  }
  return {
    health_status: "Healthy",
    detected_condition: "None",
  };
}

// ── AI Risk Scores ────────────────────────────────────────────────────
export function computeRiskScores(
  temperature: number,
  cough_count: number,
  movement_level: string,
): { pprRisk: number; fmdRisk: number } {
  const cough = Number(cough_count);
  const movPenalty = movement_level === "LOW" ? 1 : 0;
  const pprRisk = Math.min(
    100,
    Math.round((temperature - 38) * 20 + cough * 8 + movPenalty * 20),
  );
  const fmdRisk = Math.min(
    100,
    Math.round((temperature - 38) * 15 + cough * 5 + movPenalty * 25),
  );
  return { pprRisk: Math.max(0, pprRisk), fmdRisk: Math.max(0, fmdRisk) };
}

// ── Refresh Cycle Simulation ──────────────────────────────────────────
export function generateAnimalRecords(cycleSeed: number): AnimalRecord[] {
  return STABLE_ANIMALS.map((def, idx) => {
    // ~30% chance diseased per cycle
    const diseasedRoll = seededRand(cycleSeed * 100 + idx * 7);
    const isDiseased = diseasedRoll < 0.3;

    let temperature: number;
    let heart_rate: number;
    let cough_count: number;
    let movement_level: string;

    if (isDiseased) {
      temperature = Number.parseFloat(
        randRange(39.6, 41.5, cycleSeed * 13 + idx).toFixed(1),
      );
      heart_rate = Math.round(randRange(90, 130, cycleSeed * 17 + idx));
      cough_count = Math.round(randRange(3, 8, cycleSeed * 19 + idx));
      const movRoll = seededRand(cycleSeed * 23 + idx);
      movement_level = movRoll < 0.7 ? "LOW" : "MEDIUM";
    } else {
      temperature = Number.parseFloat(
        randRange(37.8, 39.0, cycleSeed * 11 + idx).toFixed(1),
      );
      heart_rate = Math.round(randRange(60, 80, cycleSeed * 13 + idx));
      cough_count = Math.round(randRange(0, 1, cycleSeed * 31 + idx));
      const movRoll = seededRand(cycleSeed * 37 + idx);
      movement_level = movRoll < 0.5 ? "HIGH" : "MEDIUM";
    }

    const { health_status, detected_condition } = detectCondition(
      temperature,
      cough_count,
      movement_level,
      def.species,
    );

    return {
      animal_id: def.animal_id,
      farm_id: def.farm_id,
      species: def.species,
      location: def.location,
      temperature,
      heart_rate: BigInt(heart_rate),
      cough_count: BigInt(cough_count),
      movement_level,
      health_status,
      detected_condition,
      timestamp: BigInt(Date.now()),
    };
  });
}

// ── Tamil Alert Message Generator ────────────────────────────────────
export function generateTamilAlertMessage(record: AnimalRecord): string {
  const temp = record.temperature.toFixed(1);
  const species =
    record.species === "Cow"
      ? "மாடு"
      : record.species === "Goat"
        ? "ஆடு"
        : "செம்மறி ஆடு";

  if (record.detected_condition === "Infection Risk") {
    return `எச்சரிக்கை: ${species} ${record.animal_id} - ${temp}°C காய்ச்சல் மற்றும் குறைந்த அசைவு கண்டறியப்பட்டது. தொற்று அபாயம் உள்ளது. நோய்: தொற்று. ஆபத்து: மிக அதிகம். உடனடியாக கால்நடை மருத்துவரை தொடர்பு கொள்ளவும்.`;
  }
  if (record.detected_condition === "FMD Risk") {
    return `எச்சரிக்கை: ${species} ${record.animal_id} - ${temp}°C காய்ச்சல் மற்றும் ${record.cough_count} இருமல் நிகழ்வுகள். நோய்: கைக்கால் வாய் நோய். ஆபத்து: மிக அதிகம். கால்நடையை உடனடியாக தனிமைப்படுத்தவும். மற்ற கால்நடைகளுக்கு பரவும் அபாயம் உள்ளது.`;
  }
  if (record.detected_condition === "PPR Risk") {
    return `எச்சரிக்கை: ${species} ${record.animal_id} - ${temp}°C காய்ச்சல் மற்றும் ${record.cough_count} இருமல் நிகழ்வுகள். நோய்: PPR ஆடு நோய். ஆபத்து: அதிகம். கால்நடை மருத்துவரை உடனே அழைக்கவும். தனிமைப்படுத்தல் அவசியம்.`;
  }
  return `எச்சரிக்கை: ${species} ${record.animal_id} - ${record.location} இல் உடனடி கவனம் தேவை. வெப்பநிலை: ${temp}°C. கால்நடை மருத்துவரை தொடர்பு கொள்ளவும்.`;
}

// ── Alert Generation ─────────────────────────────────────────────────
export function generateAlerts(records: AnimalRecord[]): Alert[] {
  return records
    .filter((r) => r.health_status === "Alert")
    .map((r) => {
      const temp = r.temperature.toFixed(1);
      const isCritical = r.temperature > 40.5 || Number(r.cough_count) > 6;
      let message = "";

      if (r.detected_condition === "Infection Risk") {
        message = `ALERT: ${r.species} ${r.animal_id} shows fever (${temp}°C) and low movement. Possible infection risk. Contact veterinary doctor immediately.`;
      } else if (r.detected_condition === "FMD Risk") {
        message = `ALERT: ${r.species} ${r.animal_id} shows fever (${temp}°C) with ${r.cough_count} cough episodes. Possible Foot-and-Mouth Disease. Isolate animal immediately.`;
      } else if (r.detected_condition === "PPR Risk") {
        message = `ALERT: ${r.species} ${r.animal_id} shows fever (${temp}°C) with ${r.cough_count} cough episodes. Possible Peste des Petits Ruminants. Contact veterinary doctor.`;
      } else {
        message = `ALERT: ${r.species} ${r.animal_id} at ${r.location} requires immediate attention. Temperature: ${temp}°C.`;
      }

      return {
        alert_id: `ALRT-${r.animal_id}-${Date.now()}`,
        animal_id: r.animal_id,
        message,
        severity: isCritical ? "critical" : "warning",
        timestamp: BigInt(Date.now()),
      };
    });
}

// ── Regional Analytics ────────────────────────────────────────────────
export interface DistrictStats {
  district: string;
  total: number;
  healthy: number;
  monitor: number;
  alert: number;
  outbreakRisk: "High Risk" | "Moderate" | "Low";
}

export function computeDistrictStats(records: AnimalRecord[]): DistrictStats[] {
  return LOCATIONS.map((district) => {
    const districtRecords = records.filter((r) => r.location === district);
    const healthy = districtRecords.filter(
      (r) => r.health_status === "Healthy",
    ).length;
    const monitor = districtRecords.filter(
      (r) => r.health_status === "Monitor",
    ).length;
    const alert = districtRecords.filter(
      (r) => r.health_status === "Alert",
    ).length;

    let outbreakRisk: "High Risk" | "Moderate" | "Low";
    if (alert > 2) outbreakRisk = "High Risk";
    else if (alert >= 1) outbreakRisk = "Moderate";
    else outbreakRisk = "Low";

    return {
      district,
      total: districtRecords.length,
      healthy,
      monitor,
      alert,
      outbreakRisk,
    };
  });
}

// ── 7-Day Historical Trend Simulation ───────────────────────────────
export interface TrendDay {
  day: string;
  alert: number;
  monitor: number;
  healthy: number;
}

export function generateDistrictTrend(district: string): TrendDay[] {
  const seed = district.charCodeAt(0) + district.charCodeAt(1);
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"];
  const totalAnimals = STABLE_ANIMALS.filter(
    (a) => a.location === district,
  ).length;

  return days.map((day, i) => {
    const alertCount = Math.round(
      seededRand(seed * 3 + i * 7) * Math.min(totalAnimals, 4),
    );
    const monitorCount = Math.round(
      seededRand(seed * 5 + i * 11) * Math.min(totalAnimals - alertCount, 3),
    );
    const healthyCount = Math.max(0, totalAnimals - alertCount - monitorCount);
    return {
      day,
      alert: alertCount,
      monitor: monitorCount,
      healthy: healthyCount,
    };
  });
}

export { FARM_IDS };
