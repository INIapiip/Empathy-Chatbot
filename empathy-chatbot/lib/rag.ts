import documents from "@/data/documents.json";

type KnowledgeDocument = {
  id?: number | string;
  title?: string;
  aliases?: string[];
  keywords?: string[];
  summary?: string;
  content: string;
  priority?: number | string;
};

type RetrievedDocument = KnowledgeDocument & {
  score: number;
  normalizedContent: string;
};

const stopwords = new Set([
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
  "yang",
  "bisa",
  "saja",
  "akan",
  "mau",
  "ingin",
  "gimana",
  "apa",
  "siapa",
  "berapa",
  "kapan",
  "bagaimana",
  "seperti",
  "sangat",
  "lebih",
  "sering",
  "dapat",
  "dengan",
  "oleh",
]);

// Normalization: lowercase, unicode normalization, punctuation removal, whitespace cleanup.
function normalizeText(text: string): string[] {
  if (!text) {
    return [];
  }

  const normalized = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !stopwords.has(token));
}

function normalizeValue(text?: string): string {
  return normalizeText(text || "").join(" ");
}

// Scoring: exact phrase match receives the highest boost, then full-token overlap, then partial overlap.
function scoreSingleField(
  fieldValue: string | undefined,
  queryTokens: string[],
  queryPhrase: string,
  baseWeight: number
): number {
  if (!fieldValue) {
    return 0;
  }

  const normalizedField = normalizeValue(fieldValue);
  if (!normalizedField) {
    return 0;
  }

  if (queryPhrase && normalizedField.includes(queryPhrase)) {
    return baseWeight + 3;
  }

  const fieldTokens = normalizeText(fieldValue);
  if (fieldTokens.length === 0) {
    return 0;
  }

  const matchedTokens = queryTokens.filter((token) => fieldTokens.includes(token));

  if (matchedTokens.length === queryTokens.length && queryTokens.length > 0) {
    return baseWeight + 2;
  }

  if (matchedTokens.length > 0) {
    return baseWeight + 1;
  }

  return 0;
}

function scoreTextCollection(
  values: Array<string | undefined> | undefined,
  queryTokens: string[],
  queryPhrase: string,
  baseWeight: number
): number {
  if (!values || values.length === 0) {
    return 0;
  }

  let total = 0;

  for (const value of values) {
    total += scoreSingleField(value, queryTokens, queryPhrase, baseWeight);
  }

  return total;
}

function calculateScore(
  queryTokens: string[],
  queryPhrase: string,
  document: KnowledgeDocument
): number {
  let score = 0;

  score += scoreTextCollection(document.aliases, queryTokens, queryPhrase, 7);
  score += scoreTextCollection(document.keywords, queryTokens, queryPhrase, 6);
  score += scoreSingleField(document.title, queryTokens, queryPhrase, 5);
  score += scoreSingleField(document.summary, queryTokens, queryPhrase, 3);
  score += scoreSingleField(document.content, queryTokens, queryPhrase, 1);

  if (score === 0) {
    return 0;
  }

  const priority = Number(document.priority) || 5;
  const multiplier = priority >= 5 ? 1.5 : priority === 4 ? 1.3 : priority === 3 ? 1.1 : 1;

  return Math.round(score * multiplier * 10) / 10;
}

// Ranking: highest score first, then higher priority, then shorter content, then lower id.
function compareDocuments(left: RetrievedDocument, right: RetrievedDocument): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  const leftPriority = Number(left.priority) || 5;
  const rightPriority = Number(right.priority) || 5;

  if (rightPriority !== leftPriority) {
    return rightPriority - leftPriority;
  }

  if (left.normalizedContent.length !== right.normalizedContent.length) {
    return left.normalizedContent.length - right.normalizedContent.length;
  }

  const leftId = Number(left.id ?? Number.POSITIVE_INFINITY);
  const rightId = Number(right.id ?? Number.POSITIVE_INFINITY);

  return leftId - rightId;
}

export function retrieveContext(message: string): string {
  const queryTokens = normalizeText(message);
  const queryPhrase = queryTokens.join(" ");
  const knowledgeBase = documents as KnowledgeDocument[];

  if (!message || queryTokens.length === 0) {
    return "";
  }

  const scoredDocs: RetrievedDocument[] = knowledgeBase
    .map((doc) => ({
      ...doc,
      score: calculateScore(queryTokens, queryPhrase, doc),
      normalizedContent: normalizeValue(doc.content),
    }))
    .filter((doc) => doc.score > 0)
    .sort(compareDocuments);

  const dedupedDocs: RetrievedDocument[] = [];
  const seenContents = new Set<string>();

  // Duplicate handling: avoid returning two documents with identical content.
  for (const doc of scoredDocs) {
    if (seenContents.has(doc.normalizedContent)) {
      continue;
    }

    seenContents.add(doc.normalizedContent);
    dedupedDocs.push(doc);
  }

  const topDocs = dedupedDocs.slice(0, 3);

  if (topDocs.length === 0) {
    return "";
  }

  // Context building: title, summary, and content are presented in a structured way for the prompt builder.
  return topDocs
    .map((doc, index) => {
      const title = doc.title ? `Title: ${doc.title}` : "Title: Tidak tersedia";
      const summary = doc.summary ? `Summary: ${doc.summary}` : "Summary: Tidak tersedia";
      const content = doc.content ? `Content: ${doc.content}` : "Content: Tidak tersedia";

      return `Konteks ${index + 1}:\n${title}\n${summary}\n${content}`;
    })
    .join("\n\n---\n\n");
}