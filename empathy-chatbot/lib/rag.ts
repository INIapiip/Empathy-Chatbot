import documents from "@/data/documents.json";

type KnowledgeDocument = {
  id?: number | string;
  title?: string;
  content: string;
};

type RetrievedDocument = KnowledgeDocument & {
  score: number;
};

const stopwords = [
  "aku",
  "saya",
  "kamu",
  "anda",
  "yang",
  "dan",
  "atau",
  "di",
  "ke",
  "dari",
  "ini",
  "itu",
  "apa",
  "bagaimana",
  "kenapa",
  "mengapa",
  "untuk",
  "dengan",
  "karena",
  "jadi",
  "adalah",
  "dalam",
  "pada",
  "the",
  "is",
  "are",
  "a",
  "an",
  "of",
  "to",
  "in",
  "and",
  "or",
];

function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopwords.includes(word));
}

function calculateScore(queryWords: string[], documentContent: string): number {
  const documentWords = normalizeText(documentContent);
  const documentText = documentContent.toLowerCase();

  let score = 0;

  for (const word of queryWords) {
    if (documentWords.includes(word)) {
      score += 2;
    }

    if (documentText.includes(word)) {
      score += 1;
    }
  }

  return score;
}

export function retrieveContext(message: string): string {
  const queryWords = normalizeText(message);
  const knowledgeBase = documents as KnowledgeDocument[];

  if (!message || queryWords.length === 0) {
    return "";
  }

  const retrievedDocs: RetrievedDocument[] = knowledgeBase
    .map((doc) => ({
      ...doc,
      score: calculateScore(queryWords, doc.content),
    }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (retrievedDocs.length === 0) {
    return "";
  }

  return retrievedDocs
    .map((doc, index) => {
      const title = doc.title ? `Judul: ${doc.title}\n` : "";
      return `Konteks ${index + 1}:\n${title}Isi: ${doc.content}`;
    })
    .join("\n\n");
}