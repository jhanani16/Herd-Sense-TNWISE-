export type FarmerProfile = {
  name: string;
  phone: string;
  village: string;
  district: string;
};

const DEFAULT_PROFILE: FarmerProfile = {
  name: "",
  phone: "+91-98765-43210",
  village: "",
  district: "Erode",
};

const STORAGE_KEY = "farmerProfile";

export function loadFarmerProfile(): FarmerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as Partial<FarmerProfile>;
    return {
      name: parsed.name ?? DEFAULT_PROFILE.name,
      phone: parsed.phone ?? DEFAULT_PROFILE.phone,
      village: parsed.village ?? DEFAULT_PROFILE.village,
      district: parsed.district ?? DEFAULT_PROFILE.district,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveFarmerProfile(profile: FarmerProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
