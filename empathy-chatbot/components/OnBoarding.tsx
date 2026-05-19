"use client";

import { useState } from "react";

type UserProfile = {
  language: string;
  name: string;
  age: string;
  gender: string;
  chatbotName: string;
};

type OnboardingProps = {
  onFinish: (data: UserProfile) => void;
};

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    language: "",
    name: "",
    age: "",
    gender: "",
    chatbotName: "",
  });

  const isIndonesian = profile.language === "Bahasa Indonesia";
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  function goToStep(nextStep: number) {
    setIsTransitioning(true);

    setTimeout(() => {
      setStep(nextStep);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 40);
    }, 220);
  }

  function selectLanguage(language: string) {
    setProfile((prev) => ({
      ...prev,
      language,
    }));

    goToStep(2);
  }

  function selectGender(gender: string) {
    let chatbotName = "VRED";

    if (gender === "Perempuan" || gender === "Female") {
      chatbotName = "Prince";
    }

    if (gender === "Laki-laki" || gender === "Male") {
      chatbotName = "Pricilla";
    }

    setProfile((prev) => ({
      ...prev,
      gender,
      chatbotName,
    }));
  }

  function finishOnboarding() {
    setIsTransitioning(true);

    setTimeout(() => {
      onFinish({
        language: profile.language || "Bahasa Indonesia",
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        chatbotName: profile.chatbotName || "VRED",
      });
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 overflow-hidden">
      <div
        className={`w-full max-w-md bg-white/80 backdrop-blur rounded-[2rem] shadow-2xl p-8 transition-all duration-500 ease-out ${
          isTransitioning
            ? "opacity-80 scale-[0.97] translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            isTransitioning
              ? "opacity-0 translate-x-8 scale-[0.98]"
              : "opacity-100 translate-x-0 scale-100"
          }`}
        >
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Which language do you prefer?
              </h1>

              <div className="text-3xl mb-8">🌏</div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => selectLanguage("Bahasa Indonesia")}
                  className="w-full py-4 rounded-2xl bg-white border-2 border-pink-400 text-gray-800 font-bold hover:bg-pink-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
                >
                  ID Bahasa Indonesia
                </button>

                <button
                  type="button"
                  onClick={() => selectLanguage("English")}
                  className="w-full py-4 rounded-2xl bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
                >
                  US English
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-10">
                ✨ You're safe here — we don't save this info.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {isIndonesian ? "Siapa nama kamu?" : "What should we call you?"}
              </h1>

              <p className="text-gray-500 mb-8">
                {isIndonesian
                  ? "Opsional — kamu boleh tetap anonim."
                  : "Optional — you can stay anonymous."}
              </p>

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder={
                  isIndonesian ? "Nama panggilanmu..." : "Your nickname..."
                }
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-purple-400 text-gray-900 placeholder:text-gray-400 text-lg outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 mb-8 shadow-sm transition-all"
              />

              <button
                type="button"
                onClick={() => goToStep(3)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isIndonesian ? "Lanjutkan" : "Continue"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {isIndonesian ? "Berapa usia kamu?" : "How old are you?"}
              </h1>

              <p className="text-gray-500 mb-8">
                {isIndonesian
                  ? "Data ini hanya digunakan untuk kebutuhan penelitian."
                  : "This is only used for research purposes."}
              </p>

              <input
                type="number"
                value={profile.age}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }))
                }
                placeholder={
                  isIndonesian ? "Masukkan usia kamu..." : "Enter your age..."
                }
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-purple-400 text-gray-900 placeholder:text-gray-400 text-lg outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 mb-8 shadow-sm transition-all"
              />

              <button
                type="button"
                onClick={() => goToStep(4)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isIndonesian ? "Lanjutkan" : "Continue"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {isIndonesian ? "Pilih gender kamu" : "Choose your gender"}
              </h1>

              <p className="text-gray-500 mb-8">
                {isIndonesian
                  ? "Chatbot akan menyesuaikan nama berdasarkan gender kamu."
                  : "The chatbot name will be adjusted based on your gender."}
              </p>

              <div className="space-y-4 mb-8">
                <button
                  type="button"
                  onClick={() =>
                    selectGender(isIndonesian ? "Perempuan" : "Female")
                  }
                  className={`w-full py-4 rounded-2xl border-2 text-lg font-bold transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                    profile.gender === "Perempuan" ||
                    profile.gender === "Female"
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {isIndonesian ? "Perempuan" : "Female"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectGender(isIndonesian ? "Laki-laki" : "Male")
                  }
                  className={`w-full py-4 rounded-2xl border-2 text-lg font-bold transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                    profile.gender === "Laki-laki" || profile.gender === "Male"
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {isIndonesian ? "Laki-laki" : "Male"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectGender(
                      isIndonesian
                        ? "Tidak ingin menyebutkan"
                        : "Prefer not to say"
                    )
                  }
                  className={`w-full py-4 rounded-2xl border-2 text-lg font-bold transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                    profile.gender === "Tidak ingin menyebutkan" ||
                    profile.gender === "Prefer not to say"
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {isIndonesian
                    ? "Tidak ingin menyebutkan"
                    : "Prefer not to say"}
                </button>
              </div>

              <button
                type="button"
                onClick={finishOnboarding}
                disabled={!profile.gender}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isIndonesian ? "Mulai Chat" : "Start Chat"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}