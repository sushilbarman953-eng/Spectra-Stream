export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  badge: string;
  isIndian: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "hi", label: "Hindi", native: "हिन्दी", badge: "HIN", isIndian: true },
  { code: "ta", label: "Tamil", native: "தமிழ்", badge: "TAM", isIndian: true },
  { code: "te", label: "Telugu", native: "తెలుగు", badge: "TEL", isIndian: true },
  { code: "ml", label: "Malayalam", native: "മലയാളം", badge: "MAL", isIndian: true },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", badge: "KAN", isIndian: true },
  { code: "bn", label: "Bengali", native: "বাংলা", badge: "BEN", isIndian: true },
  { code: "en", label: "English", native: "English", badge: "ENG", isIndian: false },
  { code: "ja", label: "Japanese", native: "日本語", badge: "JAP", isIndian: false },
];

export const getLanguageBadge = (code?: string): string => {
  if (!code) return "HIN";
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code.toLowerCase());
  return found ? found.badge : code.toUpperCase().slice(0, 3);
};
