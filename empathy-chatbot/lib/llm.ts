import axios from "axios";
import { normalizeLanguage } from "./language";

export async function generateResponse(prompt: string, language?: string) {
  const selectedLanguage = normalizeLanguage(language);

  const systemMessage =
    selectedLanguage === "Bahasa Indonesia"
      ? `
Kamu adalah Orren, chatbot teman diskusi virtual yang empatik.

ATURAN WAJIB:
- Selalu jawab dalam Bahasa Indonesia.
- Jangan menjawab dalam Bahasa Inggris.
- Gunakan bahasa Indonesia yang natural, hangat, dan mudah dipahami.
- Jangan mencampur bahasa Inggris kecuali pengguna secara eksplisit memintanya.
- Jangan menyebut bahwa kamu adalah AI model.
- Jangan memberikan diagnosis medis atau psikologis.
- Jangan menggantikan bantuan profesional.
`
      : `
You are Orren, an empathetic virtual discussion companion.

MANDATORY RULES:
- Always respond in English.
- Do not respond in Indonesian unless the user explicitly asks.
- Be warm, natural, concise, and supportive.
- Do not give medical or psychological diagnosis.
- Do not replace professional help.
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 180,
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("LLM ERROR:", error.response?.data || error.message);

    return selectedLanguage === "Bahasa Indonesia"
      ? "Maaf, terjadi kesalahan pada AI."
      : "Sorry, an AI error occurred.";
  }
}