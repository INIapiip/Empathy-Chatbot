import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vredbot.my.id"),

  title: {
    default: "VRED - Chatbot Empatik Berbasis AI",
    template: "%s | VRED",
  },

  description:
    "VRED merupakan chatbot empatik berbasis Retrieval-Augmented Generation (RAG) dan Large Language Model (LLM) yang membantu pengguna berdiskusi secara anonim dengan respons yang relevan, empatik, dan natural.",

  keywords: [
    "VRED",
    "VRED Bot",
    "Chatbot Empatik",
    "Chatbot AI",
    "AI Chatbot Indonesia",
    "Artificial Intelligence",
    "Retrieval-Augmented Generation",
    "RAG",
    "Large Language Model",
    "LLM",
    "Generative AI",
    "AI Assistant",
    "Teman Curhat AI",
    "Mental Health Chatbot",
    "Chatbot Indonesia",
  ],
// SEO UPDATE
  authors: [
    {
      name: "Nama Kamu",
    },
  ],

  creator: "Nama Kamu",

  publisher: "VRED",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "VRED - Chatbot Empatik Berbasis AI",
    description:
      "VRED merupakan chatbot empatik berbasis Retrieval-Augmented Generation (RAG) dan Large Language Model.",

    url: "https://vredbot.my.id",

    siteName: "VRED",

    locale: "id_ID",

    type: "website",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "VRED Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VRED - Chatbot Empatik Berbasis AI",
    description:
      "Chatbot empatik berbasis Retrieval-Augmented Generation dan Large Language Model.",
    images: ["/icon.png"],
  },

  alternates: {
    canonical: "https://vredbot.my.id",
  },

  category: "technology",
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