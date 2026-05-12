export function detectEmotion(text: string): string {
  const t = text.toLowerCase();

  if (
    t.includes("capek") ||
    t.includes("sedih") ||
    t.includes("lelah") ||
    t.includes("down")
  ) {
    return "sad";
  }

  if (
    t.includes("marah") ||
    t.includes("kesal") ||
    t.includes("emosi")
  ) {
    return "angry";
  }

  if (
    t.includes("bingung") ||
    t.includes("stress") ||
    t.includes("overwhelmed")
  ) {
    return "overwhelmed";
  }

  return "neutral";
}