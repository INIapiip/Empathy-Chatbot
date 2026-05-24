type LogChatParams = {
  profile?: {
    name?: string;
    age?: string;
    gender?: string;
    language?: string;
    chatbotName?: string;
  };
  message: string;
  response: string;
  riskLevel?: string;
  safetyCategory?: string;
  matchedKeyword?: string;
  tone?: string;
  style?: string;
  mood?: string;
  language?: string;
  responseTime?: number;
};

export async function logChatToSheet({
  profile,
  message,
  response,
  riskLevel = "LOW",
  safetyCategory = "normal conversation",
  matchedKeyword = "",
  tone,
  style,
  mood = "",
  language,
  responseTime = 0,
}: LogChatParams) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("GOOGLE_SHEET_WEBHOOK_URL belum dikonfigurasi.");
    return;
  }

  const name = profile?.name?.trim() || "unknown_user";
  const age = profile?.age?.trim() || "";
  const finalLanguage = language || profile?.language || "";
  const finalTone = tone || style || "";

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name,
        userName: name,
        age,
        gender: profile?.gender || "",
        chatbotName: profile?.chatbotName || "",
        message,
        response,
        answer: response,
        riskLevel,
        safetyCategory,
        matchedKeyword,
        tone: finalTone,
        style: finalTone,
        mood,
        language: finalLanguage,
        responseTime,
      }),
    });
  } catch (error) {
    console.error("Gagal mencatat log ke Google Spreadsheet:", error);
  }
}