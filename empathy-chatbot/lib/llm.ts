import { normalizeLanguage } from "./language";

export async function generateResponse(prompt: string, language?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const normalizedLanguage = normalizeLanguage(language);

  if (!apiKey) {
    console.error("OPENAI_API_KEY is missing");

    return normalizedLanguage === "English"
      ? "Sorry, the AI service is not configured yet."
      : "Maaf, layanan AI belum dikonfigurasi.";
  }

  const systemPrompt =
    normalizedLanguage === "English"
      ? "You are VRED, an empathetic chatbot. Respond warmly, safely, and naturally. Do not claim to be a professional therapist."
      : "Kamu adalah VRED, chatbot empatik. Jawablah dengan hangat, aman, natural, dan jangan mengaku sebagai psikolog atau tenaga profesional.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);

      return normalizedLanguage === "English"
        ? "Sorry, the AI service is having trouble right now. Please try again in a moment."
        : "Maaf, layanan AI sedang mengalami kendala. Coba lagi sebentar ya.";
    }

    const data = await response.json();

    return (
      data?.choices?.[0]?.message?.content ||
      (normalizedLanguage === "English"
        ? "Sorry, I could not generate a response."
        : "Maaf, aku belum bisa menghasilkan jawaban.")
    );
  } catch (error) {
    console.error("generateResponse error:", error);

    return normalizedLanguage === "English"
      ? "Sorry, something went wrong while generating the response."
      : "Maaf, terjadi kesalahan saat menghasilkan respons.";
  }
}