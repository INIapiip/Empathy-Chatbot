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
            animate={{
              y: [0, -10, 0],
              rotate: [0, 6, -6, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-10 text-6xl drop-shadow-sm"
          >
            🌸
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
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 10px 25px rgba(15, 23, 42, 0.14)",
                "0 16px 35px rgba(236, 72, 153, 0.28)",
                "0 10px 25px rgba(15, 23, 42, 0.14)",
              ],
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              opacity: { duration: 0.7, delay: 0.5 },
              y: { duration: 0.7, delay: 0.5 },
              scale: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
              boxShadow: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="mt-4 rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-800 transition"
          >
            One tap to start ✨
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}