import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Phone, Save, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { loadFarmerProfile, saveFarmerProfile } from "../utils/farmerProfile";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";

const DISTRICTS = [
  "Erode",
  "Coimbatore",
  "Salem",
  "Tiruppur",
  "Namakkal",
  "Chennai",
  "Madurai",
  "Trichy",
  "Tirunelveli",
  "Vellore",
];

interface FarmerSettingsViewProps {
  lang: Lang;
}

export function FarmerSettingsView({ lang }: FarmerSettingsViewProps) {
  const [profile, setProfile] = useState(() => loadFarmerProfile());
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Slight delay for UX feedback
    await new Promise((r) => setTimeout(r, 400));
    saveFarmerProfile(profile);
    setIsSaving(false);
    setSaved(true);
    toast.success(t("profileSaved", lang), {
      description: t("profileSavedDesc", lang),
      duration: 3000,
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-bold text-foreground">
          {t("settingsTitle", lang)}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ta"
            ? "உங்கள் விவரங்களை நிர்வகிக்கவும் மற்றும் SMS எச்சரிக்கை தொலைபேசி எண்ணை புதுப்பிக்கவும்"
            : "Manage your details and update the SMS alert phone number"}
        </p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display text-lg">
                  {t("farmerProfile", lang)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {lang === "ta"
                    ? "உங்கள் விவசாயி கணக்கு விவரங்கள்"
                    : "Your farmer account details"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Farmer Name */}
            <div className="space-y-1.5">
              <Label htmlFor="farmer-name" className="text-sm font-semibold">
                {t("farmerName", lang)}
              </Label>
              <Input
                id="farmer-name"
                data-ocid="settings.name.input"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("namePlaceholder", lang)}
                className="bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="farmer-phone" className="text-sm font-semibold">
                {t("farmerPhone", lang)}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="farmer-phone"
                  data-ocid="settings.phone.input"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+91-XXXXX-XXXXX"
                  className="pl-9 bg-muted/30 focus:bg-background transition-colors font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Phone className="h-3 w-3 shrink-0 text-primary" />
                {t("smsPhoneNote", lang)}
              </p>
            </div>

            {/* Village */}
            <div className="space-y-1.5">
              <Label htmlFor="farmer-village" className="text-sm font-semibold">
                {t("farmerVillage", lang)}
              </Label>
              <Input
                id="farmer-village"
                data-ocid="settings.village.input"
                value={profile.village}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, village: e.target.value }))
                }
                placeholder={t("villagePlaceholder", lang)}
                className="bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <Label
                htmlFor="farmer-district"
                className="text-sm font-semibold"
              >
                {t("farmerDistrict", lang)}
              </Label>
              <Select
                value={profile.district}
                onValueChange={(val) =>
                  setProfile((prev) => ({ ...prev, district: val }))
                }
              >
                <SelectTrigger
                  id="farmer-district"
                  data-ocid="settings.district.select"
                  className="bg-muted/30 focus:bg-background transition-colors"
                >
                  <SelectValue placeholder={t("farmerDistrict", lang)} />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save button + success state */}
            <div className="pt-2 space-y-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                data-ocid="settings.save.button"
                className="w-full gap-2 font-semibold"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 animate-pulse" />
                    {lang === "ta" ? "சேமிக்கிறது..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t("saveProfile", lang)}
                  </>
                )}
              </Button>

              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    data-ocid="settings.success_state"
                  >
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                      {t("profileSaved", lang)} — {t("profileSavedDesc", lang)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        <Card className="border-dashed border-border bg-muted/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {lang === "ta" ? "SMS எச்சரிக்கைகள் பற்றி" : "About SMS Alerts"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "ta"
                    ? "மேலே உள்ள தொலைபேசி எண் கால்நடை நோய் கண்டறியப்படும்போது SMS எச்சரிக்கைகள் அனுப்ப பயன்படுத்தப்படும். MSG91 அல்லது Airtel Business SMS போன்ற SMS வழங்குனரை இணைத்தால் இது நேரடியாக உங்கள் தொலைபேசிக்கு வரும்."
                    : "The phone number above will be used to send SMS alerts when livestock disease is detected. Connect an SMS gateway like MSG91 or Airtel Business SMS to receive alerts directly on your phone."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
