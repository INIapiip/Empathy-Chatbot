import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRED - Empathy Chatbot",
  description:
    "VRED adalah chatbot empatik berbasis LLM yang membantu pengguna bercerita secara anonim dengan pilihan suasana hati dan nada jawaban.",
  keywords: [
    "VRED",
    "empathy chatbot",
    "chatbot empatik",
    "AI chatbot",
    "LLM chatbot",
    "mental health chatbot",
    "teman cerita online",
    "chatbot curhat",
  ],
  authors: [{ name: "VRED" }],
  openGraph: {
    title: "VRED - Empathy Chatbot",
    description:
      "Teman diskusi virtual berbasis LLM untuk bercerita secara anonim.",
    type: "website",
    locale: "id_ID",
    siteName: "VRED",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}