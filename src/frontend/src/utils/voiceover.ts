let voiceLoadRetries = 0;

function getTamilVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "ta-IN") ??
    voices.find((v) => v.lang === "ta") ??
    null
  );
}

export function speakTamil(text: string): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const speak = () => {
    const utter = new SpeechSynthesisUtterance(text);
    const tamilVoice = getTamilVoice();
    if (tamilVoice) {
      utter.voice = tamilVoice;
    }
    utter.lang = "ta-IN";
    utter.rate = 0.85;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    window.speechSynthesis.speak(utter);
  };

  // Voices may not be loaded yet on first call
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0 && voiceLoadRetries < 3) {
    voiceLoadRetries++;
    window.speechSynthesis.addEventListener("voiceschanged", speak, {
      once: true,
    });
    // Trigger voice loading
    window.speechSynthesis.getVoices();
  } else {
    speak();
  }
}

export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return "speechSynthesis" in window;
}
