export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

const criticalWords = [
  "bunuh diri",
  "kill myself",
  "suicide",
  "mati aja",
  "self harm",
];

const highWords = [
  "udah ga kuat hidup",
  "nyakitin diri",
  "ingin mati",
  "cape hidup",
];

const mediumWords = [
  "depresi",
  "stress berat",
  "sendirian",
  "putus asa",
];

export function detectRiskLevel(
  text: string
): RiskLevel {

  const lower = text.toLowerCase();

  if (
    criticalWords.some((w) =>
      lower.includes(w))
  ) {
    return "CRITICAL";
  }

  if (
    highWords.some((w) =>
      lower.includes(w))
  ) {
    return "HIGH";
  }

  if (
    mediumWords.some((w) =>
      lower.includes(w))
  ) {
    return "MEDIUM";
  }

  return "LOW";
}