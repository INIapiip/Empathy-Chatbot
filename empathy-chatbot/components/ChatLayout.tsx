"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  language?: string;
  name?: string;
  age?: string;
  gender?: string;
  chatbotName?: string;
};

type ChatLayoutProps = {
  profile?: UserProfile;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  emotion?: string;
  riskLevel?: string;
  responseTime?: number;
  time?: string;
};

type Mood = {
  id: string;
  labelId: string;
  labelEn: string;
  emoji: string;
};

const moods: Mood[] = [
  { id: "good", labelId: "Baik", labelEn: "Good", emoji: "😊" },
  { id: "sad", labelId: "Sedih", labelEn: "Sad", emoji: "😔" },
  { id: "angry", labelId: "Marah", labelEn: "Angry", emoji: "😤" },
  { id: "anxious", labelId: "Cemas", labelEn: "Anxious", emoji: "😰" },
  { id: "empty", labelId: "Hampa", labelEn: "Empty", emoji: "😶" },
];

function normalizeLanguage(language?: string) {
  if (!language) return "Bahasa Indonesia";

  const value = language.toLowerCase().trim();

  if (
    value === "bahasa indonesia" ||
    value === "indonesia" ||
    value === "indonesian" ||
    value === "id"
  ) {
    return "Bahasa Indonesia";
  }

  return "English";
}

function getStyleLabel(style: string, isIndonesian: boolean) {
  if (style === "friendly") return isIndonesian ? "Santai" : "Friendly";
  if (style === "angry") return isIndonesian ? "Marah" : "Angry";
  if (style === "professional") {
    return isIndonesian ? "Profesional" : "Professional";
  }

  return isIndonesian ? "Santai" : "Friendly";
}

function getTheme(style: string) {
  if (style === "angry") {
    return {
      pageBg:
        "linear-gradient(135deg, #fff4f4 0%, #ffe1e1 50%, #f8caca 100%)",
      mainBg:
        "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,238,238,0.70))",
      primary: "#c11a1a",
      primarySoft: "rgba(193, 26, 26, 0.12)",
      titleColor: "#c11a1a",
      userBubble: "#c11a1a",
      userText: "#ffffff",
      shadow: "0 20px 55px rgba(130, 35, 35, 0.18)",
    };
  }

  if (style === "professional") {
    return {
      pageBg:
        "linear-gradient(135deg, #f1fcff 0%, #ddf7fc 50%, #c7edf7 100%)",
      mainBg:
        "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(228,248,253,0.72))",
      primary: "#1fadd1",
      primarySoft: "rgba(31, 173, 209, 0.12)",
      titleColor: "#1fadd1",
      userBubble: "#1fadd1",
      userText: "#ffffff",
      shadow: "0 20px 55px rgba(35, 110, 130, 0.18)",
    };
  }

  return {
    pageBg:
      "linear-gradient(135deg, #f1fff8 0%, #dcfff0 50%, #c5f6de 100%)",
    mainBg:
      "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(229,255,241,0.72))",
    primary: "#5becb4",
    primarySoft: "rgba(91, 236, 180, 0.16)",
    titleColor: "#d56bd9",
    userBubble: "#5becb4",
    userText: "#18392d",
    shadow: "0 20px 55px rgba(39, 126, 84, 0.18)",
  };
}

export default function ChatLayout({ profile }: ChatLayoutProps) {
  const safeProfile: UserProfile = {
    language: normalizeLanguage(profile?.language),
    name: profile?.name || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    chatbotName: profile?.chatbotName || "VRED",
  };

  const isIndonesian = safeProfile.language === "Bahasa Indonesia";
  const chatbotName = safeProfile.chatbotName || "VRED";

  const storageName = safeProfile.name || "anonymous";
  const storageKey = `vred-chat-history-${storageName}`;
  const moodStorageKey = `vred-selected-mood-${storageName}`;
  const toneStorageKey = `vred-selected-tone-${storageName}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"friendly" | "angry" | "professional">(
    "friendly"
  );
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = getTheme(mode);

  useEffect(() => {
    const savedMessages = localStorage.getItem(storageKey);
    const savedMood = localStorage.getItem(moodStorageKey);
    const savedTone = localStorage.getItem(toneStorageKey);

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error("Gagal membaca riwayat chat:", error);
      }
    }

    if (savedMood) {
      const mood = moods.find((item) => item.id === savedMood);
      if (mood) {
        setSelectedMood(mood);
      }
    }

    if (
      savedTone === "friendly" ||
      savedTone === "angry" ||
      savedTone === "professional"
    ) {
      setMode(savedTone);
    }
  }, [storageKey, moodStorageKey, toneStorageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    if (selectedMood) {
      localStorage.setItem(moodStorageKey, selectedMood.id);
    }
  }, [selectedMood, moodStorageKey]);

  useEffect(() => {
    localStorage.setItem(toneStorageKey, mode);
  }, [mode, toneStorageKey]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString(isIndonesian ? "id-ID" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function startNewChat() {
    setMessages([]);
    setSelectedMood(null);
    setInput("");
    setMenuOpen(false);

    localStorage.removeItem(storageKey);
    localStorage.removeItem(moodStorageKey);
  }

  function clearSession() {
    setMessages([]);
    setInput("");
    setMenuOpen(false);

    localStorage.removeItem(storageKey);
  }

  function selectMood(mood: Mood) {
    setSelectedMood(mood);

    const greeting: Message = {
      role: "assistant",
      content: isIndonesian
        ? `Hai ${safeProfile.name || "teman"}, aku ${chatbotName}. Aku lihat kamu sedang merasa ${mood.labelId}. Cerita pelan-pelan ya, aku dengerin.`
        : `Hi ${safeProfile.name || "there"}, I'm ${chatbotName}. I see you're feeling ${mood.labelEn}. Take your time, I'm listening.`,
      time: getCurrentTime(),
    };

    setMessages([greeting]);
  }

  async function sendMessage() {
    const currentMessage = input.trim();

    if (!currentMessage || loading || !selectedMood) return;

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
      time: getCurrentTime(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          style: mode,
          mood: selectedMood.id,
          history: updatedMessages,
          language: safeProfile.language,
          profile: safeProfile,
          chatbotName,
        }),
      });

      const result = await response.json();

      const botMessage: Message = {
        role: "assistant",
        content:
          result.answer ||
          (isIndonesian
            ? "Maaf, aku belum bisa menjawab saat ini."
            : "Sorry, I can't answer right now."),
        emotion: result.emotion,
        riskLevel: result.riskLevel,
        responseTime: result.responseTime,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isIndonesian
            ? "Maaf, terjadi kesalahan pada sistem. Coba lagi sebentar ya."
            : "Sorry, something went wrong. Please try again in a moment.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  function ToneButton({
    value,
    emoji,
    label,
  }: {
    value: "friendly" | "angry" | "professional";
    emoji: string;
    label: string;
  }) {
    const active = mode === value;

    return (
      <button
        type="button"
        onClick={() => setMode(value)}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition"
        style={{
          background: active ? theme.primary : "rgba(255,255,255,0.65)",
          color: active ? theme.userText : "#64748b",
          boxShadow: active ? `0 8px 18px ${theme.primary}44` : "none",
        }}
      >
        {emoji} {label}
      </button>
    );
  }

  return (
    <div
      className="min-h-screen px-3 py-3 transition-all duration-500 sm:px-5 sm:py-5"
      style={{ background: theme.pageBg }}
    >
      <div
        className="relative mx-auto flex h-[calc(100vh-24px)] max-w-5xl flex-col overflow-hidden rounded-[1.4rem] border border-white/70 backdrop-blur-xl sm:h-[calc(100vh-40px)] sm:rounded-[1.6rem]"
        style={{
          background: theme.mainBg,
          boxShadow: theme.shadow,
        }}
      >
        <header className="flex h-14 items-center justify-between border-b border-white/60 px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/75 text-lg font-bold text-slate-600 shadow-sm"
            >
              ☰
            </button>

            <div>
              <h1
                className="text-lg font-black tracking-[0.16em] sm:text-xl"
                style={{ color: theme.titleColor }}
              >
                VRED <span className="text-base">💗</span>
              </h1>

              <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
                {isIndonesian
                  ? "Hadir menemanimu 🌸"
                  : "Here whenever you need 💜"}
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 sm:text-xs">
            <p className="font-bold text-slate-500">{chatbotName} online</p>
            <p>
              {getStyleLabel(mode, isIndonesian)}
              {selectedMood
                ? ` • ${selectedMood.emoji} ${
                    isIndonesian ? selectedMood.labelId : selectedMood.labelEn
                  }`
                : ""}
            </p>
          </div>
        </header>

        {menuOpen && (
          <div className="absolute inset-0 z-50 flex">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            />

            <aside className="relative z-10 h-full w-[84%] max-w-xs bg-white/90 px-5 py-5 shadow-2xl backdrop-blur-xl sm:w-80">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2
                    className="text-2xl font-black tracking-[0.18em]"
                    style={{ color: theme.titleColor }}
                  >
                    VRED 💗
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {isIndonesian ? "Menu pengaturan chat" : "Chat settings"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500"
                >
                  ✕
                </button>
              </div>

              <div className="mb-5 rounded-2xl bg-white/75 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    {isIndonesian ? "Riwayat Chat" : "Chat History"}
                  </p>

                  <button
                    type="button"
                    onClick={startNewChat}
                    className="rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #f05abf 0%, #9b6df0 100%)",
                    }}
                  >
                    ✎ {isIndonesian ? "Baru" : "New"}
                  </button>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-3 text-left shadow-sm transition hover:bg-slate-50"
                >
                  <span className="text-base text-pink-400">♡</span>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {messages.length > 0
                        ? isIndonesian
                          ? "Sesi tersimpan"
                          : "Saved session"
                        : isIndonesian
                        ? "Belum ada riwayat"
                        : "No history yet"}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {messages.length > 0
                        ? `${messages.length} pesan`
                        : isIndonesian
                        ? "Mulai percakapan baru"
                        : "Start a new conversation"}
                    </p>
                  </div>
                </button>
              </div>

              <div className="mb-5 rounded-2xl bg-white/75 p-4 shadow-sm">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                  {isIndonesian ? "Nada Jawaban" : "Response Tone"}
                </p>

                <div className="space-y-2">
                  <ToneButton
                    value="friendly"
                    emoji="😊"
                    label={isIndonesian ? "Santai" : "Friendly"}
                  />

                  <ToneButton
                    value="angry"
                    emoji="😤"
                    label={isIndonesian ? "Marah" : "Angry"}
                  />

                  <ToneButton
                    value="professional"
                    emoji="🎓"
                    label={isIndonesian ? "Profesional" : "Professional"}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white/75 p-4 shadow-sm">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                  {isIndonesian ? "Pengaturan Sesi" : "Session Settings"}
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={clearSession}
                    className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-3 text-left text-xs font-bold text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                  >
                    <span>🗑</span>
                    <span>
                      {isIndonesian ? "Hapus chat ini" : "Delete this chat"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={startNewChat}
                    className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-3 text-left text-xs font-bold text-slate-600 shadow-sm transition hover:bg-purple-50 hover:text-purple-600"
                  >
                    <span>↺</span>
                    <span>
                      {isIndonesian
                        ? "Mulai ulang dari awal"
                        : "Restart from start"}
                    </span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        <section className="relative flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
          {!selectedMood && (
            <div className="flex flex-1 items-center justify-center pb-24">
              <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-5 text-center shadow-xl backdrop-blur sm:p-6">
                <h2 className="text-base font-bold text-slate-700">
                  {isIndonesian
                    ? "Gimana perasaan kamu sekarang? 💭"
                    : "How are you feeling right now? 💭"}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  {isIndonesian
                    ? "Ceritain ke aku, kamu lagi..."
                    : "Tell me, you're feeling..."}
                </p>

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => selectMood(mood)}
                      className="rounded-2xl border-2 border-white bg-white/95 px-2 py-3 text-slate-600 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="text-xl sm:text-2xl">{mood.emoji}</div>
                      <div className="mt-1 text-[10px] font-bold sm:text-[11px]">
                        {isIndonesian ? mood.labelId : mood.labelEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedMood && (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-28 sm:pb-32">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[82%] sm:max-w-[64%]">
                    <div
                      className="rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm"
                      style={{
                        background:
                          msg.role === "user" ? theme.userBubble : "#ffffff",
                        color: msg.role === "user" ? theme.userText : "#334155",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.07)",
                      }}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {msg.time && (
                      <p
                        className={`mt-1 text-[10px] text-slate-300 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-400 shadow-sm">
                    {isIndonesian
                      ? `${chatbotName} sedang mengetik...`
                      : `${chatbotName} is typing...`}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
            <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl bg-white/92 p-2.5 shadow-lg backdrop-blur">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!selectedMood || loading}
                placeholder={
                  !selectedMood
                    ? isIndonesian
                      ? "Pilih kondisi kamu dulu..."
                      : "Choose your mood first..."
                    : isIndonesian
                    ? "Ketik pesanmu..."
                    : "Type your message..."
                }
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedMood || loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-base transition disabled:opacity-50"
                style={{
                  background: selectedMood ? theme.primarySoft : "#f1f5f9",
                  color: selectedMood ? theme.primary : "#cbd5e1",
                }}
              >
                ➤
              </button>
            </div>

            <div className="mt-2 flex flex-col items-center gap-1">
              {selectedMood && (
                <p className="text-center text-[11px] font-medium text-slate-400">
                  {isIndonesian ? "Suasana hati:" : "Mood:"}{" "}
                  <span
                    className="font-semibold"
                    style={{ color: theme.primary }}
                  >
                    {selectedMood.emoji}{" "}
                    {isIndonesian ? selectedMood.labelId : selectedMood.labelEn}
                  </span>
                </p>
              )}

              <p className="text-center text-[10px] text-slate-300">
                VRED bukan pengganti bantuan profesional.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}