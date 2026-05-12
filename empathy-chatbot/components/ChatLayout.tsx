"use client";

import { useEffect, useRef, useState } from "react";

import {
  saveSessions,
  loadSessions,
  saveMode,
  loadMode,
} from "@/lib/storage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Session = {
  id: number;
  title: string;
  messages: Message[];
};

export default function ChatLayout() {

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<
    "friendly" | "angry" | "professional"
  >("friendly");

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      title: "Sesi baru",
      messages: [
        {
          role: "assistant",
          content:
            "Haiii 👋 Ada apa nih yang lagi dipikirin? Cerita aja yaa 😊",
        },
      ],
    },
  ]);

  const [activeSessionId, setActiveSessionId] =
    useState(1);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const activeSession =
    sessions.find(
      (s) => s.id === activeSessionId
    ) || sessions[0];

  // AUTO LOAD
  useEffect(() => {

    const storedSessions =
      loadSessions();

    const storedMode =
      loadMode();

    if (storedSessions.length > 0) {

      setSessions(storedSessions);

      setActiveSessionId(
        storedSessions[0].id
      );
    }

    if (storedMode) {

      setMode(storedMode as any);
    }

  }, []);

  // AUTO SAVE
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveMode(mode);
  }, [mode]);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [activeSession.messages]);

  function createNewChat() {

    const newSession: Session = {
      id: Date.now(),
      title: "Sesi baru",
      messages: [
        {
          role: "assistant",
          content:
            "Haiii ✨ Cerita aja yaa, aku siap nemenin kamu.",
        },
      ],
    };

    setSessions((prev) => [
      newSession,
      ...prev,
    ]);

    setActiveSessionId(newSession.id);
  }

  async function sendMessage() {

    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    const updatedMessages = [
      ...activeSession.messages,
      userMessage,
    ];

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: updatedMessages,
              title:
                session.title === "Sesi baru"
                  ? message.slice(0, 20)
                  : session.title,
            }
          : session
      )
    );

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {

      const res = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message: currentMessage,
          style: mode,
          history: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [
                  ...updatedMessages,
                  aiMessage,
                ],
              }
            : session
        )
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  const backgroundClass =
    mode === "friendly"
      ? "bg-gradient-to-br from-[#f8e8f8] to-[#efe9ff]"
      : mode === "angry"
      ? "bg-gradient-to-br from-[#ffe3e3] to-[#fff0f0]"
      : "bg-gradient-to-br from-[#dff5e8] to-[#edfdf4]";

  return (

    <div
      className={`w-full min-h-screen overflow-hidden flex items-center justify-center p-3 transition-all duration-500 ${backgroundClass}`}
    >

      <div
        className="
        w-full
        h-[96vh]
        rounded-[26px]
        overflow-hidden
        bg-white/35
        backdrop-blur-xl
        border
        border-white/40
        shadow-2xl
        flex
      "
      >

        {/* SIDEBAR */}
        <div
          className="
          w-[240px]
          bg-[#f7f2f7]
          border-r
          border-white/40
          p-4
          flex
          flex-col
          gap-4
        "
        >

          {/* PROFILE */}
          <div className="flex flex-col items-center text-center">

            <div
              className="
              w-20
              h-20
              rounded-[24px]
              bg-gradient-to-br
              from-pink-500
              to-purple-500
              flex
              items-center
              justify-center
              text-3xl
              shadow-lg
            "
            >
              👱‍♀️
            </div>

            <h1 className="text-3xl font-bold mt-4 text-slate-900">
              VRED
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Hadir nemeninmu 🌸
            </p>

          </div>

          {/* HISTORY */}
          <div
            className="
            bg-white/70
            rounded-[22px]
            p-4
            shadow-sm
            border
            border-white/60
            flex-1
            overflow-y-auto
          "
          >

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-slate-400 font-bold uppercase text-[11px]">
                Riwayat Chat
              </h2>

              <button
                onClick={createNewChat}
                className="
                px-3
                py-1.5
                rounded-full
                bg-gradient-to-r
                from-pink-500
                to-purple-500
                text-white
                text-xs
                font-semibold
              "
              >
                ✏️ Baru
              </button>

            </div>

            <div className="space-y-2">

              {sessions.map((session) => (

                <button
                  key={session.id}
                  onClick={() =>
                    setActiveSessionId(
                      session.id
                    )
                  }
                  className={`
                  w-full
                  text-left
                  rounded-[18px]
                  p-3
                  transition
                  border

                  ${
                    session.id ===
                    activeSessionId
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent"
                      : "bg-white text-slate-700 border-[#ececec]"
                  }
                `}
                >

                  <div className="font-medium truncate text-sm">
                    💭 {session.title}
                  </div>

                  <div
                    className={`
                    text-[10px] mt-1
                    ${
                      session.id ===
                      activeSessionId
                        ? "text-white/70"
                        : "text-slate-400"
                    }
                  `}
                  >
                    4 Mei
                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* MODE */}
          <div
            className="
            bg-white/70
            rounded-[22px]
            p-4
            border
            border-white/60
          "
          >

            <h2 className="text-slate-400 font-bold uppercase text-[11px] mb-3">
              Gaya Bicara
            </h2>

            <div className="space-y-2">

              {[
                {
                  key: "friendly",
                  label: "😊 Santai",
                },
                {
                  key: "angry",
                  label: "😡 Marah",
                },
                {
                  key: "professional",
                  label: "🎓 Formal",
                },
              ].map((item) => (

                <button
                  key={item.key}
                  onClick={() =>
                    setMode(item.key as any)
                  }
                  className={`
                  w-full
                  p-3
                  rounded-[16px]
                  text-left
                  transition
                  text-sm
                  font-semibold

                  ${
                    mode === item.key
                      ? item.key ===
                        "friendly"
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : item.key ===
                          "angry"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                      : "bg-white text-slate-600"
                  }
                `}
                >
                  {item.label}
                </button>

              ))}

            </div>

          </div>

        </div>

        {/* CHAT AREA */}
        <div className="flex-1 relative overflow-hidden">

          {/* TOPBAR */}
          <div className="h-20 px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-3 h-3 bg-green-500 rounded-full"></div>

              <span className="text-slate-500 text-base">
                Online & siap dengerin
              </span>

            </div>

          </div>

          {/* CHAT */}
          <div
            className="
            h-[calc(100%-140px)]
            overflow-y-auto
            px-6
            pb-32
          "
          >

            <div className="w-full max-w-[760px] mx-auto space-y-4">

              {activeSession.messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`
                      px-5
                      py-4
                      rounded-[24px]
                      shadow-sm
                      text-[15px]
                      leading-relaxed
                      max-w-[70%]

                      ${
                        msg.role ===
                        "user"
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "bg-white text-slate-700 border border-[#ececec]"
                      }
                    `}
                    >
                      {msg.content}
                    </div>

                  </div>

                )
              )}

              {loading && (

                <div className="text-slate-400 text-sm">
                  AI sedang mengetik...
                </div>

              )}

              <div ref={messagesEndRef}></div>

            </div>

          </div>

          {/* INPUT */}
          <div
            className="
            absolute
            bottom-4
            left-1/2
            -translate-x-1/2
            w-[92%]
            max-w-[760px]
          "
          >

            <div
              className="
              bg-white
              rounded-full
              shadow-xl
              p-3
              flex
              items-center
              gap-3
            "
            >

              <input
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  sendMessage()
                }
                placeholder="Ketik pesanmu..."
                className="
                flex-1
                bg-transparent
                outline-none
                text-base
                text-slate-700
                placeholder:text-slate-400
                px-3
              "
              />

              <button
                onClick={sendMessage}
                className={`
                w-14
                h-14
                rounded-full
                text-white
                text-xl
                flex
                items-center
                justify-center
                transition

                ${
                  mode === "friendly"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
                    : mode === "angry"
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : "bg-gradient-to-r from-emerald-500 to-green-500"
                }
              `}
              >
                ➤
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}