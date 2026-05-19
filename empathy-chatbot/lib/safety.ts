export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SafetyResult = {
  riskLevel: RiskLevel;
  category: string;
  matchedKeyword?: string;
};

const criticalPatterns = [
  "bunuh diri",
  "ingin bunuh diri",
  "mau bunuh diri",
  "pengen bunuh diri",
  "mengakhiri hidup",
  "akhiri hidup",
  "mati aja",
  "lebih baik mati",
  "aku mau mati",
  "aku ingin mati",
  "kill myself",
  "i want to die",
  "suicide",
  "end my life",
  "self harm",
];

const highPatterns = [
  "ingin mati",
  "pengen mati",
  "mau mati",
  "capek hidup",
  "cape hidup",
  "lelah hidup",
  "udah ga kuat hidup",
  "sudah tidak kuat hidup",
  "tidak kuat hidup",
  "nyakitin diri",
  "menyakiti diri",
  "melukai diri",
  "menyakiti diri sendiri",
  "putus asa banget",
  "tidak ada gunanya hidup",
];

const mediumPatterns = [
  "depresi",
  "stress berat",
  "stres berat",
  "cemas berlebihan",
  "anxiety",
  "panic attack",
  "panik",
  "sendirian",
  "kesepian",
  "putus asa",
  "hidupku hancur",
  "aku gagal",
  "tidak berguna",
  "overthinking",
  "capek banget",
  "lelah banget",
];

function normalizeInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchedKeyword(
  text: string,
  patterns: string[]
): string | undefined {
  return patterns.find((pattern) => text.includes(pattern));
}

export function detectSafety(text: string): SafetyResult {
  const normalizedText = normalizeInput(text);

  const criticalMatch = findMatchedKeyword(normalizedText, criticalPatterns);
  if (criticalMatch) {
    return {
      riskLevel: "CRITICAL",
      category: "self-harm or suicide risk",
      matchedKeyword: criticalMatch,
    };
  }

  const highMatch = findMatchedKeyword(normalizedText, highPatterns);
  if (highMatch) {
    return {
      riskLevel: "HIGH",
      category: "high emotional distress",
      matchedKeyword: highMatch,
    };
  }

  const mediumMatch = findMatchedKeyword(normalizedText, mediumPatterns);
  if (mediumMatch) {
    return {
      riskLevel: "MEDIUM",
      category: "emotional distress",
      matchedKeyword: mediumMatch,
    };
  }

  return {
    riskLevel: "LOW",
    category: "normal conversation",
  };
}

export function buildSafetyResponse(
  riskLevel: RiskLevel,
  language: string = "Bahasa Indonesia"
): string {
  const isIndonesian = language === "Bahasa Indonesia";

  if (riskLevel === "CRITICAL") {
    if (isIndonesian) {
      return (
        "Aku ikut prihatin kamu sedang merasa seberat ini. " +
        "Tolong jangan hadapi ini sendirian. Coba segera hubungi orang terdekat yang kamu percaya, " +
        "seperti keluarga, teman, dosen, atau tenaga profesional. " +
        "Kalau kamu merasa sedang dalam bahaya saat ini, segera cari bantuan darurat atau datang ke fasilitas kesehatan terdekat. " +
        "Kamu berharga dan layak mendapatkan bantuan."
      );
    }

    return (
      "I'm really sorry you're feeling this much pain. " +
      "Please do not face this alone. Try to contact someone you trust right now, " +
      "such as a family member, friend, teacher, or a professional. " +
      "If you feel in immediate danger, please seek emergency help or go to the nearest health facility. " +
      "You matter and deserve support."
    );
  }

  if (riskLevel === "HIGH") {
    if (isIndonesian) {
      return (
        "Aku dengar kamu sedang merasa sangat berat. " +
        "Coba berhenti sebentar, tarik napas pelan, dan jangan sendirian dulu kalau memungkinkan. " +
        "Akan lebih baik kalau kamu menghubungi orang yang kamu percaya untuk menemani atau mendengarkanmu. " +
        "Aku bisa menemani kamu bercerita, tapi untuk kondisi yang sangat berat, bantuan manusia langsung tetap penting."
      );
    }

    return (
      "I hear that things feel really heavy right now. " +
      "Try to pause for a moment, breathe slowly, and avoid being alone if possible. " +
      "It may help to contact someone you trust so they can stay with you or listen to you. " +
      "I can stay with you here, but for very serious distress, direct human support is important."
    );
  }

  return "";
}