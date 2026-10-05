export type Lang = "en" | "ta";

export const translations = {
  // Nav
  dashboard: { en: "Dashboard", ta: "டாஷ்போர்டு" },
  alerts: { en: "Alerts", ta: "எச்சரிக்கைகள்" },
  analytics: { en: "Analytics", ta: "பகுப்பாய்வு" },
  aiPredict: { en: "AI Predict", ta: "AI கணிப்பு" },
  gateway: { en: "Gateway", ta: "நுழைவாயில்" },

  // Header
  appTitle: { en: "Livestock Health Monitor", ta: "கால்நடை உடல்நல கண்காணிப்பு" },
  appSubtitle: {
    en: "Tamil Nadu • Real-time Disease Detection",
    ta: "தமிழ்நாடு • நேரடி நோய் கண்டறிதல்",
  },
  online: { en: "Online", ta: "இணைந்துள்ளது" },
  offline: { en: "Offline", ta: "இணைப்பு இல்லை" },

  // Dashboard
  totalAnimals: { en: "Total Animals", ta: "மொத்த கால்நடைகள்" },
  healthy: { en: "Healthy", ta: "ஆரோக்கியமான" },
  monitor: { en: "Monitor", ta: "கண்காணிப்பு" },
  alert: { en: "Alert", ta: "எச்சரிக்கை" },
  liveAnimalStatus: { en: "Live Animal Status", ta: "நேரடி கால்நடை நிலை" },
  lastUpdated: { en: "Last updated", ta: "கடைசியாக புதுப்பிக்கப்பட்டது" },
  refreshing: { en: "Refreshing...", ta: "புதுப்பிக்கிறது..." },
  animalId: { en: "Animal ID", ta: "கால்நடை ID" },
  type: { en: "Type", ta: "வகை" },
  temp: { en: "Temp (°C)", ta: "வெப்பம் (°C)" },
  movement: { en: "Movement", ta: "அசைவு" },
  cough: { en: "Cough", ta: "இருமல்" },
  heartRate: { en: "Heart Rate", ta: "இதய துடிப்பு" },
  location: { en: "Location", ta: "இடம்" },
  status: { en: "Status", ta: "நிலை" },
  condition: { en: "Condition", ta: "நோய் நிலை" },
  loadingAnimalData: {
    en: "Loading animal data...",
    ta: "கால்நடை தரவு ஏற்றுகிறது...",
  },

  // Status labels
  statusHealthy: { en: "Healthy", ta: "ஆரோக்கியம்" },
  statusMonitor: { en: "Monitor", ta: "கண்காணிப்பு" },
  statusAlert: { en: "Alert", ta: "எச்சரிக்கை" },

  // Alerts
  critical: { en: "Critical", ta: "அவசர நிலை" },
  warning: { en: "Warning", ta: "எச்சரிக்கை" },
  noAlerts: { en: "No Alerts", ta: "எச்சரிக்கைகள் இல்லை" },
  allHealthy: {
    en: "All animals are healthy. Alerts will appear here when disease risk is detected.",
    ta: "அனைத்து கால்நடைகளும் ஆரோக்கியமாக உள்ளன. நோய் அபாயம் கண்டறியப்படும்போது எச்சரிக்கைகள் இங்கே தோன்றும்.",
  },
  criticalAlerts: { en: "Critical Alerts", ta: "அவசர எச்சரிக்கைகள்" },
  warnings: { en: "Warnings", ta: "எச்சரிக்கைகள்" },
  total: { en: "Total", ta: "மொத்தம்" },
  alertHistory: { en: "Alert History Log", ta: "எச்சரிக்கை வரலாறு" },
  listenButton: { en: "🔊 Listen", ta: "🔊 கேள்" },
  sendSms: { en: "Send SMS", ta: "SMS அனுப்பு" },
  smsSent: { en: "SMS Sent!", ta: "SMS அனுப்பப்பட்டது!" },
  smsDescription: {
    en: "Message sent to registered farmer phone number.",
    ta: "பதிவு செய்யப்பட்ட விவசாயி தொலைபேசி எண்ணுக்கு செய்தி அனுப்பப்பட்டது.",
  },

  // Conditions
  infectionRisk: { en: "Infection Risk", ta: "தொற்று அபாயம்" },
  fmdRisk: { en: "FMD Risk", ta: "கைக்கால் வாய் நோய் அபாயம்" },
  pprRisk: { en: "PPR Risk", ta: "PPR நோய் அபாயம்" },
  none: { en: "None", ta: "இல்லை" },

  // Analytics
  districtOverview: {
    en: "District Overview — Tamil Nadu",
    ta: "மாவட்ட கண்ணோட்டம் — தமிழ்நாடு",
  },
  highestRisk: { en: "Highest Risk District", ta: "அதிக அபாய மாவட்டம்" },
  sevenDayTrend: { en: "7-Day Trend", ta: "7 நாள் போக்கு" },
  highRisk: { en: "High Risk", ta: "அதிக அபாயம்" },
  moderate: { en: "Moderate", ta: "மிதமான" },
  low: { en: "Low", ta: "குறைந்த" },
  highestRiskDistrict: { en: "Highest Risk District", ta: "அதிக அபாய மாவட்டம்" },
  animalsInAlert: {
    en: "animals in Alert status",
    ta: "கால்நடைகள் எச்சரிக்கை நிலையில் உள்ளன",
  },
  immediateVet: {
    en: "Immediate veterinary intervention recommended.",
    ta: "உடனடி கால்நடை மருத்துவ தலையீடு பரிந்துரைக்கப்படுகிறது.",
  },
  monitorVet: {
    en: "Monitor closely and consult a veterinarian.",
    ta: "கவனமாக கண்காணித்து கால்நடை மருத்துவரை அணுகுங்கள்.",
  },
  totalLabel: { en: "Total", ta: "மொத்தம்" },
  healthyLabel: { en: "Healthy", ta: "ஆரோக்கியம்" },
  monitorLabel: { en: "Monitor", ta: "கண்காணிப்பு" },
  alertLabel: { en: "Alert", ta: "எச்சரிக்கை" },

  // AI Prediction
  aiTitle: { en: "AI Disease Risk Prediction", ta: "AI நோய் அபாய கணிப்பு" },
  selectAnimal: { en: "Select Animal", ta: "கால்நடையை தேர்ந்தெடுக்கவும்" },
  selectAnimalPlaceholder: {
    en: "Select an animal...",
    ta: "ஒரு கால்நடையை தேர்ந்தெடுக்கவும்...",
  },
  currentReadings: { en: "Current Readings", ta: "தற்போதைய அளவீடுகள்" },
  riskAssessment: { en: "Risk Assessment", ta: "அபாய மதிப்பீடு" },
  pprRiskLabel: { en: "PPR Risk (Goat/Sheep)", ta: "PPR அபாயம் (ஆடு/செம்மறி)" },
  fmdRiskLabel: { en: "FMD Risk (Foot-and-Mouth)", ta: "கைக்கால் வாய் நோய் அபாயம்" },
  riskFactors: { en: "Risk Factor Breakdown", ta: "அபாய காரணிகள்" },
  allVitalsNormal: {
    en: "✓ All vitals within healthy range",
    ta: "✓ அனைத்து உடல் அளவீடுகளும் இயல்பு வரம்பில் உள்ளன",
  },
  allAnimalsRanking: {
    en: "All Animals — Risk Ranking",
    ta: "அனைத்து கால்நடைகள் — அபாய தரவரிசை",
  },
  highTemp: { en: "High temperature", ta: "அதிக வெப்பநிலை" },
  highCough: { en: "High cough count", ta: "அதிக இருமல் எண்ணிக்கை" },
  lowMovement: { en: "Low movement detected", ta: "குறைந்த அசைவு கண்டறியப்பட்டது" },
  highRiskLabel: { en: "HIGH RISK", ta: "அதிக அபாயம்" },
  moderateRiskLabel: { en: "MODERATE RISK", ta: "மிதமான அபாயம்" },
  lowRiskLabel: { en: "LOW RISK", ta: "குறைந்த அபாயம்" },
  animalCol: { en: "Animal", ta: "கால்நடை" },
  speciesCol: { en: "Species", ta: "வகை" },
  pprCol: { en: "PPR Risk", ta: "PPR அபாயம்" },
  fmdCol: { en: "FMD Risk", ta: "FMD அபாயம்" },
  combinedCol: { en: "Combined", ta: "மொத்தம்" },
  statusCol: { en: "Status", ta: "நிலை" },
  temperatureLabel: { en: "Temperature", ta: "வெப்பநிலை" },
  coughCountLabel: { en: "Cough Count", ta: "இருமல் எண்ணிக்கை" },
  movementLabel: { en: "Movement", ta: "அசைவு" },

  // Assessment texts
  assessCritical: {
    en: "CRITICAL — Immediate veterinary consultation required. Isolate animal.",
    ta: "அவசரம் — உடனடி கால்நடை மருத்துவ ஆலோசனை தேவை. கால்நடையை தனிமைப்படுத்தவும்.",
  },
  assessHigh: {
    en: "HIGH RISK — Recommend immediate veterinary consultation within 24 hours.",
    ta: "அதிக அபாயம் — 24 மணி நேரத்திற்குள் உடனடி கால்நடை மருத்துவ ஆலோசனை பரிந்துரைக்கப்படுகிறது.",
  },
  assessModerate: {
    en: "MODERATE RISK — Schedule veterinary check-up and monitor closely.",
    ta: "மிதமான அபாயம் — கால்நடை மருத்துவ பரிசோதனையை திட்டமிட்டு கவனமாக கண்காணிக்கவும்.",
  },
  assessLow: {
    en: "LOW RISK — Continue monitoring. Check again in 48 hours.",
    ta: "குறைந்த அபாயம் — கண்காணிப்பை தொடரவும். 48 மணி நேரத்தில் மீண்டும் சரிபார்க்கவும்.",
  },
  assessHealthy: {
    en: "HEALTHY — Animal vitals are within normal range.",
    ta: "ஆரோக்கியம் — கால்நடையின் உடல் அளவீடுகள் இயல்பு வரம்பில் உள்ளன.",
  },

  // LoRa Gateway
  loraTitle: { en: "LoRa Gateway", ta: "LoRa நுழைவாயில்" },
  loraStatus: { en: "Gateway Status", ta: "நுழைவாயில் நிலை" },
  loraOnline: { en: "Gateway Online", ta: "நுழைவாயில் இயங்குகிறது" },
  loraOffline: { en: "Gateway Offline", ta: "நுழைவாயில் நிறுத்தப்பட்டது" },
  signal: { en: "Signal", ta: "சிக்னல்" },
  lastPacket: { en: "Last Packet", ta: "கடைசி பாக்கெட்" },
  nodes: { en: "Nodes", ta: "கணுக்கள்" },
  connectedNodes: {
    en: "Connected Sensor Nodes",
    ta: "இணைக்கப்பட்ட சென்சார் கணுக்கள்",
  },
  loraDescription: {
    en: "LoRa mesh network — works without internet",
    ta: "LoRa மெஷ் நெட்வொர்க் — இணையம் இல்லாமல் செயல்படுகிறது",
  },
  loraActive: { en: "LoRa Active", ta: "LoRa செயலில்" },
  internetConnected: { en: "Internet: Connected", ta: "இணையம்: இணைக்கப்பட்டது" },
  internetDisconnected: {
    en: "Internet: Disconnected",
    ta: "இணையம்: துண்டிக்கப்பட்டது",
  },
  signalStrong: { en: "Strong", ta: "வலுவான" },
  secondsAgo: { en: "sec ago", ta: "வி முன்பு" },

  // Offline banner
  offlineBanner: {
    en: "LoRa Mode — Data captured via local gateway. Internet sync paused.",
    ta: "LoRa பயன்முறை — உள்ளூர் நுழைவாயில் மூலம் தரவு சேகரிக்கப்படுகிறது. இணைய ஒத்திசைவு நிறுத்தப்பட்டது.",
  },
  syncingBanner: {
    en: "Syncing data to server...",
    ta: "சேவையகத்திற்கு தரவு ஒத்திசைக்கிறது...",
  },
  syncSuccess: {
    en: "Synced successfully ✓",
    ta: "வெற்றிகரமாக ஒத்திசைக்கப்பட்டது ✓",
  },
  recordsSynced: {
    en: "animal records synced to server.",
    ta: "கால்நடை பதிவுகள் சேவையகத்துடன் ஒத்திசைக்கப்பட்டன.",
  },

  // Push notification
  notifTitle: { en: "New Critical Alert!", ta: "புதிய அவசர எச்சரிக்கை!" },

  // Settings
  settingsTitle: { en: "Farmer Settings", ta: "விவசாயி அமைப்புகள்" },
  farmerProfile: { en: "Farmer Profile", ta: "விவசாயி விவரங்கள்" },
  farmerName: { en: "Farmer Name", ta: "விவசாயி பெயர்" },
  farmerPhone: { en: "Phone Number", ta: "தொலைபேசி எண்" },
  farmerVillage: { en: "Village", ta: "கிராமம்" },
  farmerDistrict: { en: "District", ta: "மாவட்டம்" },
  saveProfile: { en: "Save Profile", ta: "விவரங்களை சேமி" },
  profileSaved: { en: "Profile saved!", ta: "விவரங்கள் சேமிக்கப்பட்டது!" },
  profileSavedDesc: {
    en: "Your farmer profile has been updated.",
    ta: "உங்கள் விவசாயி விவரங்கள் புதுப்பிக்கப்பட்டன.",
  },
  smsPhoneNote: {
    en: "This number will be used for SMS alerts.",
    ta: "இந்த எண் SMS எச்சரிக்கைகளுக்கு பயன்படுத்தப்படும்.",
  },
  namePlaceholder: { en: "Enter farmer name", ta: "விவசாயி பெயரை உள்ளிடவும்" },
  villagePlaceholder: {
    en: "Enter village name",
    ta: "கிராமத்தின் பெயரை உள்ளிடவும்",
  },

  // SMS modal
  smsModalTitle: { en: "SMS Alert", ta: "SMS எச்சரிக்கை" },
  smsPhone: { en: "Farmer Phone", ta: "விவசாயி தொலைபேசி" },
  smsMessage: { en: "Message", ta: "செய்தி" },
  smsClose: { en: "Close", ta: "மூடு" },
  smsSendButton: { en: "Send SMS Alert", ta: "SMS எச்சரிக்கை அனுப்பு" },
  smsSimulatedNote: {
    en: "SMS will be delivered via MSG91 to the registered number.",
    ta: "பதிவு செய்யப்பட்ட எண்ணுக்கு MSG91 மூலம் SMS வழங்கப்படும்.",
  },

  // SMS Gateway (MSG91) settings
  smsGatewayTitle: { en: "SMS Gateway (MSG91)", ta: "SMS நுழைவாயில் (MSG91)" },
  smsGatewayDesc: {
    en: "Enter your MSG91 credentials to send real SMS alerts to farmers.",
    ta: "விவசாயிகளுக்கு SMS எச்சரிக்கைகளை அனுப்ப MSG91 நற்சான்றுகளை உள்ளிடவும்.",
  },
  msg91AuthKey: { en: "MSG91 Auth Key", ta: "MSG91 அங்கீகார விசை" },
  msg91SenderId: { en: "Sender ID", ta: "அனுப்புநர் ID" },
  msg91TemplateId: { en: "Flow Template ID", ta: "Flow டெம்ப்ளேட் ID" },
  saveGateway: { en: "Save & Test SMS", ta: "சேமித்து SMS சோதி" },
  gatewaySaved: { en: "Gateway configured!", ta: "நுழைவாயில் கட்டமைக்கப்பட்டது!" },
  gatewaySavedDesc: {
    en: "MSG91 credentials saved. Test SMS sent to your number.",
    ta: "MSG91 நற்சான்றுகள் சேமிக்கப்பட்டன. சோதனை SMS உங்கள் எண்ணுக்கு அனுப்பப்பட்டது.",
  },
  gatewayError: { en: "Gateway error", ta: "நுழைவாயில் பிழை" },
  authKeyPlaceholder: {
    en: "Enter your MSG91 auth key",
    ta: "MSG91 அங்கீகார விசையை உள்ளிடவும்",
  },
  senderIdPlaceholder: { en: "e.g. LSTOCK", ta: "எ.கா. LSTOCK" },
  templateIdPlaceholder: {
    en: "Enter Flow Template ID",
    ta: "Flow டெம்ப்ளேட் IDஐ உள்ளிடவும்",
  },
  smsRealNote: {
    en: "SMS will be sent via MSG91 to the farmer's registered number.",
    ta: "MSG91 மூலம் விவசாயியின் பதிவு செய்யப்பட்ட எண்ணுக்கு SMS அனுப்பப்படும்.",
  },
  smsSending: { en: "Sending...", ta: "அனுப்புகிறது..." },
  smsGatewayHelp: {
    en: "Get your Auth Key from msg91.com → Settings → Auth Key. Create a Flow template with variable VAR1 for the alert message.",
    ta: "msg91.com → Settings → Auth Key இல் உங்கள் Auth Key பெறவும். எச்சரிக்கை செய்திக்கான VAR1 மாறியுடன் Flow டெம்ப்ளேட் உருவாக்கவும்.",
  },
};

export function t(key: keyof typeof translations, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}
