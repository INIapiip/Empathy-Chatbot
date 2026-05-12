import axios from "axios";

export async function generateResponse(prompt: string) {

  try {

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 120,
        temperature: 0.8
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error: any) {

    console.error(
      "LLM ERROR:",
      error.response?.data || error.message
    );

    return "Maaf, terjadi kesalahan pada AI.";
  }
}