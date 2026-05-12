import { NextResponse } from "next/server";

import { detectEmotion }
from "../../../lib/emotion";

import { buildPrompt }
from "../../../lib/promptBuilder";

import { retrieveContext }
from "../../../lib/rag";

import { generateResponse }
from "../../../lib/llm";

import {
  detectRiskLevel
} from "@/lib/safety";

export async function POST(
  req: Request
) {

  try {

    // START TIMER
    const start =
      performance.now();

    const body =
      await req.json();

    const message =
      body.message;

    const style =
      body.style || "friendly";

    const history =
      body.history || [];

    // DETECT EMOTION
    const emotion =
      detectEmotion(message);

    // DETECT RISK
    const riskLevel =
      detectRiskLevel(message);

    console.log(
      "RISK LEVEL:",
      riskLevel
    );

    // RETRIEVE CONTEXT
    const context =
      retrieveContext(message);

    // CHAT HISTORY
    const formattedHistory =
      history
        .slice(-8)
        .map((msg: any) => {

          return `
${msg.role}: ${msg.content}
`;

        })
        .join("\n");

    // BUILD PROMPT
    const prompt =
      buildPrompt(
        message,
        emotion,
        style,
        context,
        formattedHistory
      );

    // SAFETY LAYER
    if (
      riskLevel === "CRITICAL" ||
      riskLevel === "HIGH"
    ) {

      const safeAnswer =
        "Aku benar-benar minta kamu jangan menghadapi ini sendirian ya ❤️ Coba hubungi orang terpercaya atau bantuan profesional di dekatmu. Kamu tetap berharga dan pantas dibantu.";

      const latency =
        performance.now() - start;

      console.log(
        "LATENCY:",
        latency
      );

      // SEND TO GOOGLE SHEETS
      await fetch(

        "https://script.google.com/macros/s/AKfycbzp1yJRSZyY4upmmjF61kBlfeNAAgP6oFp7UsA57mGhwBMWRbMsgbQORUvVMIfD1O2t/exec",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            timestamp:
              new Date()
                .toISOString(),

            message,

            riskLevel,

            tone: style,

            latency,

          }),

        }
      );

      return NextResponse.json({

        answer: safeAnswer,

        emotion,

        riskLevel,

        latency,

      });
    }

    // GENERATE AI RESPONSE
    const answer =
      await generateResponse(
        prompt
      );

    // TOTAL LATENCY
    const latency =
      performance.now() - start;

    console.log(
      "LATENCY:",
      latency
    );

    // SEND TO GOOGLE SHEETS
    await fetch(

      "https://script.google.com/macros/s/AKfycbzp1yJRSZyY4upmmjF61kBlfeNAAgP6oFp7UsA57mGhwBMWRbMsgbQORUvVMIfD1O2t/exec",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          timestamp:
            new Date()
              .toISOString(),

          message,

          riskLevel,

          tone: style,

          latency,

        }),

      }
    );

    return NextResponse.json({

      answer,

      emotion,

      riskLevel,

      latency,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({

      answer:
        "Terjadi kesalahan pada sistem.",

    });
  }
}