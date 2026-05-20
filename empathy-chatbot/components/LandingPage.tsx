"use client";

import { motion } from "framer-motion";

type Props = {
  onStart: () => void;
};

export default function LandingPage({ onStart }: Props) {

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center px-6 overflow-hidden relative">

      {/* BLUR CIRCLES */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-300 opacity-30 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-300 opacity-30 blur-3xl rounded-full"></div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl text-center z-10"
      >

        {/* ICON */}
        <motion.div
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3
          }}
          className="text-7xl mb-8"
        >
          🌸
        </motion.div>
        <h1>VRED - Empathy Chatbot untuk Teman Cerita Online</h1>
        <p>
          VRED adalah chatbot empatik berbasis Large Language Model yang membantu 
          pengguna bercerita secara anonim, memilih suasana hati, dan mendapatkan
          respons sesuai nada jawaban yang dipilih.
        </p>

        {/* TITLE */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">

          Feeling alone in a connected world?

        </h1>

        {/* SUBTITLE */}
        <p className="mt-8 text-lg md:text-2xl text-gray-600 leading-relaxed">

          You're not the only one — about 1 in 5 adults under 50
          often feel lonely.

          <br />

          Here, you can talk freely, anonymously.

        </p>

        {/* SMALL TEXT */}
        <p className="mt-6 text-gray-500">
          No account. No tracking.
        </p>

        {/* BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={onStart}
          className="mt-12 px-10 py-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg font-semibold shadow-2xl hover:shadow-pink-300/40 transition-all"
        >
          One tap to start ✨
        </motion.button>

      </motion.div>

    </div>
  );
}
