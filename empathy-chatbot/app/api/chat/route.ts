import { NextResponse } from "next/server";
import { detectEmotion } from "../../../lib/emotion";
import { buildPrompt } from "../../../lib/promptBuilder";
import { retrieveContext } from "../../../lib/rag";
import { generateResponse } from "../../../lib/llm";
import { detectSafety, buildSafetyResponse } from "@/lib/safety";
import { normalizeLanguage } from "@/lib/language";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type UserProfile = {
  language?: string;
  name?: string;
  age?: string;
  gender?: string;
  chatbotName?: string;
};

async function sendLatencyLog(data: {
  timestamp: string;
  message: string;
  response: string;
  riskLevel: string;
  safetyCategory: string;
  matchedKeyword: string;
  tone: string;
  mood: string;
  language: string;
  responseTime: number;
}) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("GOOGLE_SHEET_WEBHOOK_URL belum diatur di .env.local");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Gagal mengirim log latency ke Google Sheets:", error);
  }
}

export async function POST(req: Request) {
  const start = performance.now();

  try {
    const body = await req.json();

    const message = body.message;
    const style = body.style || "friendly";
    const mood = body.mood || "unknown";
    const history: ChatMessage[] = body.history || [];
    const profile: UserProfile = body.profile || {};

    const language = normalizeLanguage(
      body.language || profile.language || "Bahasa Indonesia"
    );

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          answer:
            language === "Bahasa Indonesia"
              ? "Pesan tidak boleh kosong."
              : "Message cannot be empty.",
        },
        { status: 400 }
      );
    }

    const emotion = detectEmotion(message);
    const safety = detectSafety(message);
    const riskLevel = safety.riskLevel;

    if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
      const safeAnswer = buildSafetyResponse(riskLevel, language);
      const responseTime = performance.now() - start;

      await sendLatencyLog({
        timestamp: new Date().toISOString(),
        message,
        response: safeAnswer,
        riskLevel,
        safetyCategory: safety.category,
        matchedKeyword: safety.matchedKeyword || "",
        tone: style,
        mood,
        language,
        responseTime,
      });

      return NextResponse.json({
        answer: safeAnswer,
        emotion,
        riskLevel,
        safetyCategory: safety.category,
        responseTime,
      });
    }

    const context = retrieveContext(message);

    const formattedHistory = history
      .slice(-8)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = buildPrompt(
      message,
      emotion,
      style,
      context,
      formattedHistory,
      language,
      profile
    );

    const answer = await generateResponse(prompt, language);
    const responseTime = performance.now() - start;

    await sendLatencyLog({
      timestamp: new Date().toISOString(),
      message,
      response: answer,
      riskLevel,
      safetyCategory: safety.category,
      matchedKeyword: safety.matchedKeyword || "",
      tone: style,
      mood,
      language,
      responseTime,
    });

    return NextResponse.json({
      answer,
      emotion,
      riskLevel,
      safetyCategory: safety.category,
      responseTime,
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    const responseTime = performance.now() - start;

    return NextResponse.json(
      {
        answer: "Terjadi kesalahan pada sistem.",
        riskLevel: "LOW",
        responseTime,
      },
      { status: 500 }
    );
  }
}