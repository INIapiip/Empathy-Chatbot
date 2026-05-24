"use client";

import { useEffect, useRef, useState } from "react";

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

type Tone = "friendly" | "angry" | "professional";

type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  moodId: string | null;
  tone: Tone;
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

function createSession(): ChatSession {
  const now = new Date().toISOString();

  return {
    id: `session-${Date.now()}`,
    title: "Sesi baru",
    createdAt: now,
    updatedAt: now,
    messages: [],
    moodId: null,
    tone: "friendly",
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

  const sessionsKey = `vred-chat-sessions-${storageName}`;
  const activeSessionKey = `vred-active-session-${storageName}`;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Tone>("friendly");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const theme = getTheme(mode);

  useEffect(() => {
    const savedSessions = localStorage.getItem(sessionsKey);
    const savedActiveId = localStorage.getItem(activeSessionKey);

    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions) as ChatSession[];

        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);

          const targetSession =
            parsedSessions.find((session) => session.id === savedActiveId) ||
            parsedSessions[0];

          setActiveSessionId(targetSession.id);
          setMessages(targetSession.messages || []);
          setMode(targetSession.tone || "friendly");

          const mood = moods.find((item) => item.id === targetSession.moodId);
          setSelectedMood(mood || null);
        }
      } catch (error) {
        console.error("Gagal membaca riwayat chat:", error);
      }
    }
  }, [sessionsKey, activeSessionKey]);

  useEffect(() => {
    if (!selectedMood) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, selectedMood]);

  function saveSessions(nextSessions: ChatSession[]) {
    setSessions(nextSessions);
    localStorage.setItem(sessionsKey, JSON.stringify(nextSessions));
  }

  function saveActiveSessionId(sessionId: string | null) {
    setActiveSessionId(sessionId);

    if (sessionId) {
      localStorage.setItem(activeSessionKey, sessionId);
    } else {
      localStorage.removeItem(activeSessionKey);
    }
  }

  function updateActiveSession(data: Partial<ChatSession>) {
    if (!activeSessionId) return;

    const nextSessions = sessions.map((session) => {
      if (session.id !== activeSessionId) return session;

      return {
        ...session,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    });

    saveSessions(nextSessions);
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString(isIndonesian ? "id-ID" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatLastUsed(dateString: string) {
    return new Date(dateString).toLocaleString(isIndonesian ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function startNewChat() {
    const newSession = createSession();
    const nextSessions = [newSession, ...sessions];

    saveSessions(nextSessions);
    saveActiveSessionId(newSession.id);

    setMessages([]);
    setSelectedMood(null);
    setMode("friendly");
    setInput("");
    setMenuOpen(false);
  }

  function openSession(sessionId: string) {
    const session = sessions.find((item) => item.id === sessionId);

    if (!session) return;

    saveActiveSessionId(session.id);
    setMessages(session.messages || []);
    setMode(session.tone || "friendly");

    const mood = moods.find((item) => item.id === session.moodId);
    setSelectedMood(mood || null);

    setInput("");
    setMenuOpen(false);
  }

  function clearSession() {
    if (!activeSessionId) {
      setMessages([]);
      setInput("");
      setMenuOpen(false);
      return;
    }

    const nextSessions = sessions.map((session) => {
      if (session.id !== activeSessionId) return session;

      return {
        ...session,
        title: "Sesi baru",
        messages: [],
        moodId: null,
        updatedAt: new Date().toISOString(),
      };
    });

    saveSessions(nextSessions);
    setMessages([]);
    setSelectedMood(null);
    setInput("");
    setMenuOpen(false);
  }

  function resetAllSessions() {
    localStorage.removeItem(sessionsKey);
    localStorage.removeItem(activeSessionKey);

    setSessions([]);
    setActiveSessionId(null);
    setMessages([]);
    setSelectedMood(null);
    setMode("friendly");
    setInput("");
    setMenuOpen(false);
  }

  function selectMood(mood: Mood) {
    let currentSessionId = activeSessionId;
    let nextSessions = [...sessions];

    if (!currentSessionId) {
      const newSession = createSession();
      currentSessionId = newSession.id;
      nextSessions = [newSession, ...nextSessions];
      saveActiveSessionId(newSession.id);
    }

    const greeting: Message = {
      role: "assistant",
      content: isIndonesian
        ? `Hai ${safeProfile.name || "teman"}, aku ${chatbotName}. Aku lihat kamu sedang merasa ${mood.labelId}. Cerita pelan-pelan ya, aku dengerin.`
        : `Hi ${safeProfile.name || "there"}, I'm ${chatbotName}. I see you're feeling ${mood.labelEn}. Take your time, I'm listening.`,
      time: getCurrentTime(),
    };

    const updatedSessions = nextSessions.map((session) => {
      if (session.id !== currentSessionId) return session;

      return {
        ...session,
        title: isIndonesian
          ? `Sesi ${mood.labelId}`
          : `${mood.labelEn} session`,
        messages: [greeting],
        moodId: mood.id,
        tone: mode,
        updatedAt: new Date().toISOString(),
      };
    });

    saveSessions(updatedSessions);
    setSelectedMood(mood);
    setMessages([greeting]);
  }

  async function sendMessage() {
    const currentMessage = input.trim();

    if (!currentMessage || loading || !selectedMood) return;

    let currentSessionId = activeSessionId;
    let nextSessions = [...sessions];

    if (!currentSessionId) {
      const newSession = createSession();
      currentSessionId = newSession.id;
      nextSessions = [newSession, ...nextSessions];
      saveActiveSessionId(newSession.id);
    }

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
      time: getCurrentTime(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const titleFromMessage =
      currentMessage.length > 24
        ? `${currentMessage.slice(0, 24)}...`
        : currentMessage;

    saveSessions(
      nextSessions.map((session) => {
        if (session.id !== currentSessionId) return session;

        return {
          ...session,
          title:
            session.title === "Sesi baru" ||
            session.title.startsWith("Sesi ") ||
            session.title.endsWith("session")
              ? titleFromMessage
              : session.title,
          messages: updatedMessages,
          moodId: selectedMood.id,
          tone: mode,
          updatedAt: new Date().toISOString(),
        };
      })
    );

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

      const finalMessages = [...updatedMessages, botMessage];

      setMessages(finalMessages);

      saveSessions(
        nextSessions.map((session) => {
          if (session.id !== currentSessionId) return session;

          return {
            ...session,
            title:
              session.title === "Sesi baru" ||
              session.title.startsWith("Sesi ") ||
              session.title.endsWith("session")
                ? titleFromMessage
                : session.title,
            messages: finalMessages,
            moodId: selectedMood.id,
            tone: mode,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } catch (error) {
      console.error("CHAT ERROR:", error);

      const errorMessage: Message = {
        role: "assistant",
        content: isIndonesian
          ? "Maaf, terjadi kesalahan pada sistem. Coba lagi sebentar ya."
          : "Sorry, something went wrong. Please try again in a moment.",
        time: getCurrentTime(),
      };

      const finalMessages = [...updatedMessages, errorMessage];

      setMessages(finalMessages);

      updateActiveSession({
        messages: finalMessages,
        moodId: selectedMood.id,
        tone: mode,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  function changeTone(value: Tone) {
    setMode(value);
    updateActiveSession({ tone: value });
  }

  function ToneButton({
    value,
    emoji,
    label,
  }: {
    value: Tone;
    emoji: string;
    label: string;
  }) {
    const active = mode === value;

    return (
      <button
        type="button"
        onClick={() => changeTone(value)}
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
      className="h-[100dvh] overflow-hidden px-3 py-3 transition-all duration-500 sm:px-5 sm:py-5"
      style={{ background: theme.pageBg }}
    >
      <div
        className="relative mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-[1.4rem] border border-white/70 backdrop-blur-xl sm:rounded-[1.6rem]"
        style={{
          background: theme.mainBg,
          boxShadow: theme.shadow,
        }}
      >
        <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/60 px-4 sm:px-5">
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

            <aside className="relative z-10 h-full w-[84%] max-w-xs overflow-y-auto bg-white/90 px-5 py-5 shadow-2xl backdrop-blur-xl sm:w-80">
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

                <div className="max-h-52 space-y-2 overflow-y-auto pr-2">
                  {sessions.length === 0 && (
                    <div className="rounded-xl bg-white px-3 py-3 text-xs font-bold text-slate-400 shadow-sm">
                      {isIndonesian
                        ? "Belum ada riwayat"
                        : "No history yet"}
                    </div>
                  )}

                  {sessions.map((session) => {
                    const mood = moods.find((item) => item.id === session.moodId);
                    const isActive = session.id === activeSessionId;

                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => openSession(session.id)}
                        className="flex w-[calc(100%-4px)] items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                        style={{
                          outline: isActive
                            ? `2px solid ${theme.primary}`
                            : "none",
                          outlineOffset: "-1px",
                          marginRight: "4px",
                        }}
                      >
                        <span className="shrink-0 text-base text-pink-400">
                          {mood ? mood.emoji : "♡"}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold text-slate-700">
                            {session.title || "Sesi baru"}
                          </p>

                          <p className="truncate text-[10px] text-slate-300">
                            Terakhir dipakai: {formatLastUsed(session.updatedAt)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                    onClick={resetAllSessions}
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

        <section className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
          {!selectedMood && (
            <div className="flex min-h-0 flex-1 items-center justify-center">
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
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-3 pb-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[82%] sm:max-w-[64%]">
                      <div
                        className="rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm sm:text-sm"
                        style={{
                          background:
                            msg.role === "user" ? theme.userBubble : "#ffffff",
                          color:
                            msg.role === "user" ? theme.userText : "#334155",
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
                    <div className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-400 shadow-sm sm:text-sm">
                      {isIndonesian
                        ? `${chatbotName} sedang mengetik...`
                        : `${chatbotName} is typing...`}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="shrink-0 pt-3">
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
                className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed sm:text-sm"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedMood || loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base transition disabled:opacity-50"
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