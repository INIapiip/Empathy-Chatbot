export type AppLanguage = "Bahasa Indonesia" | "English";

export function normalizeLanguage(language?: string): AppLanguage {
  if (!language) return "Bahasa Indonesia";

  const value = language.toLowerCase().trim();

  if (
    value === "bahasa indonesia" ||
    value === "indonesia" ||
    value === "indonesian" ||
    value === "id"
  ) {
    return "Bahasa Indonesia";
  }

  return "English";
}

export function isIndonesian(language?: string): boolean {
  return normalizeLanguage(language) === "Bahasa Indonesia";
}