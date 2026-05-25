"use client";

import { motion } from "framer-motion";

type LandingPageProps = {
  onStart: () => void;
};

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-orange-50 to-purple-200">
      <section className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="mb-10 text-6xl"
          >
            🌺
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl font-black leading-tight text-slate-900 md:text-3xl"
          >
            Feeling alone in a connected world?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base"
          >
            Talk freely and anonymously. VRED listens with empathy, adapts to
            your mood, and responds in the tone you choose.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-xs text-slate-600"
          >
            No account. No tracking.
          </motion.p>

          <motion.button
            type="button"
            onClick={onStart}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-4 rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-800 shadow-lg transition hover:shadow-xl"
          >
            Start Chatting ✨
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}