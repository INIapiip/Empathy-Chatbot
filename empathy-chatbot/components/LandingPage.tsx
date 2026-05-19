"use client";

import { motion } from "framer-motion";

type Props = {
  onStart: () => void;
};

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center px-6 overflow-hidden relative">
      {/* BLUR CIRCLES */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-pink-300 opacity-30 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-purple-300 opacity-30 blur-3xl rounded-full" />

      {/* SOFT GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 bg-white/30 blur-3xl rounded-full" />

      <motion.main
        initial={{ opacity: 0, y: 45, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        className="max-w-3xl text-center z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
          className="text-7xl mb-8"
          aria-hidden="true"
        >
          🌸
        </motion.div>

        <p className="mb-5 inline-flex items-center rounded-full bg-white/60 px-5 py-2 text-sm font-semibold text-purple-500 shadow-sm backdrop-blur">
          VRED • chatbot empatik
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
          Merasa sendiri di dunia
          <br />
          yang ramai?
        </h1>

        <p className="mt-8 text-lg md:text-2xl text-gray-600 leading-relaxed">
          Kamu tidak harus memendam semuanya sendirian.
          <br />
          Di sini, kamu bisa bercerita dengan bebas dan anonim.
        </p>

        <p className="mt-6 mx-auto max-w-2xl text-sm md:text-base text-gray-500 leading-relaxed">
          VRED adalah teman cerita online berbasis Large Language Model yang
          membantu pengguna memilih suasana hati dan mendapatkan respons sesuai
          nada jawaban yang dipilih.
        </p>

        <p className="mt-5 text-sm text-gray-400">
          Tanpa akun. Tanpa pelacakan. Mulai saat kamu siap.
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="mt-10 px-10 py-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg font-bold shadow-2xl hover:shadow-pink-300/40 transition-all"
        >
          Mulai cerita ✨
        </motion.button>
      </motion.main>
    </div>
  );
}