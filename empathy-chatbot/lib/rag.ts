import documents from "@/data/documents.json";

export function retrieveContext(message: string): string {

  const msg = message.toLowerCase();

  const matched = (documents as { content: string }[]).filter((doc) =>
    msg.split(" ").some((word) =>
      doc.content.toLowerCase().includes(word)
    )
  );

  return matched.map((d) => d.content).join(" ");
}