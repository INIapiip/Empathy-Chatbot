"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  onFinish: (data: any) => void;
};

export default function Onboarding({ onFinish }: Props) {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    language: "",
    name: "",
    age: "",
    gender: ""
  });

  function next() {
    setStep((prev) => prev + 1);
  }

  function update(key: string, value: string) {
    setForm({
      ...form,
      [key]: value
    });
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center px-6">

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10">

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">

          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
            style={{
              width: `${(step / 4) * 100}%`
            }}
          />

        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (

            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Which language do you prefer?
              </h1>

              <p className="mt-3 text-gray-500 text-sm md:text-base">
                Choose the language you feel most comfortable using.
              </p>

              <div className="mt-8 space-y-4">

                <button
                  onClick={() => {
                    update("language", "Bahasa Indonesia");
                    next();
                  }}
                  className="w-full p-5 rounded-3xl bg-white border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all shadow-sm text-left text-gray-800 font-medium"
                >
                  🇮🇩 Bahasa Indonesia
                </button>

                <button
                  onClick={() => {
                    update("language", "English");
                    next();
                  }}
                  className="w-full p-5 rounded-3xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all shadow-sm text-left text-gray-800 font-medium"
                >
                  🇺🇸 English
                </button>

              </div>

            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (

            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                What should we call you?
              </h1>

              <p className="mt-3 text-gray-500 text-sm md:text-base">
                Optional — you can stay anonymous.
              </p>

              <input
                type="text"
                placeholder="Your nickname..."
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-8 w-full p-5 rounded-3xl bg-white border border-gray-200 outline-none shadow-sm focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder:text-gray-400"
              />

              <button
                onClick={next}
                className="mt-6 w-full py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold hover:scale-[1.02] transition-all"
              >
                Continue
              </button>

            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (

            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                How old are you?
              </h1>

              <p className="mt-3 text-gray-500 text-sm md:text-base">
                This helps the conversation feel more natural.
              </p>

              <input
                type="number"
                placeholder="Your age..."
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                className="mt-8 w-full p-5 rounded-3xl bg-white border border-gray-200 outline-none shadow-sm focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder:text-gray-400"
              />

              <button
                onClick={next}
                className="mt-6 w-full py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold hover:scale-[1.02] transition-all"
              >
                Continue
              </button>

            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (

            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                What's your gender?
              </h1>

              <p className="mt-3 text-gray-500 text-sm md:text-base">
                Used only to personalize the experience.
              </p>

              <div className="mt-8 space-y-4">

                {["Male", "Female", "Prefer not to say"].map((g) => (

                  <button
                    key={g}
                    onClick={() => {
                      update("gender", g);

                      onFinish({
                        ...form,
                        gender: g
                      });
                    }}
                    className="w-full p-5 rounded-3xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all shadow-sm text-left text-gray-800 font-medium"
                  >
                    {g}
                  </button>

                ))}

              </div>

              <p className="mt-8 text-center text-gray-500 text-sm">
                ✨ You're safe here — we don't save this info.
              </p>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}