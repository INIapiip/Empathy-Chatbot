import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vredbot.my.id"),

  title: {
    default: "VRED - Chatbot Empatik Berbasis AI",
    template: "%s | VRED",
  },

  description:
    "VRED merupakan chatbot empatik berbasis Retrieval-Augmented Generation (RAG) dan Large Language Model (LLM) yang membantu pengguna berdiskusi secara anonim dengan respons yang relevan dan empatik.",

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

  authors: [
    {
      name: "Afif Putra",
    },
  ],

  creator: "Afif Putra",

  publisher: "VRED",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/icon.png",
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
      "Chatbot empatik berbasis Retrieval-Augmented Generation (RAG) dan Large Language Model (LLM).",

    images: ["/icon.png"],
  },

  alternates: {
    canonical: "https://vredbot.my.id",
  },
verification: {
  google: "UhIA6g24P4MpvGbG2kVIlMZaAK1Q074rXo5FOfescZg",
},

  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VRED",
  alternateName: "VRED Bot",
  url: "https://vredbot.my.id",
  description:
    "VRED adalah chatbot empatik berbasis Retrieval-Augmented Generation (RAG) dan Large Language Model (LLM).",
  inLanguage: "id-ID",

  publisher: {
    "@type": "Organization",
    name: "VRED",
    url: "https://vredbot.my.id",
    logo: {
      "@type": "ImageObject",
      url: "https://vredbot.my.id/icon.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}