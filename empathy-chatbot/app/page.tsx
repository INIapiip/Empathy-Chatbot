"use client";

import { useState } from "react";
import LandingPage from "../components/LandingPage";
import Onboarding from "../components/OnBoarding";
import ChatLayout from "../components/ChatLayout";

type UserProfile = {
  language?: string;
  name?: string;
  age?: string;
  gender?: string;
  chatbotName?: string;
};

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

export default function Home() {
  const [started, setStarted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  return (
    <>
      {!started && <LandingPage onStart={() => setStarted(true)} />}

      {started && !onboarded && (
        <Onboarding
          onFinish={(data: UserProfile) => {
            const fixedProfile: UserProfile = {
              language: normalizeLanguage(data.language),
              name: data.name || "",
              age: data.age || "",
              gender: data.gender || "",
              chatbotName: data.chatbotName || "VRED",
            };

            console.log("PROFILE FROM ONBOARDING:", fixedProfile);

            setProfile(fixedProfile);
            setOnboarded(true);
          }}
        />
      )}

      {started && onboarded && (
        <ChatLayout
          profile={
            profile || {
              language: "Bahasa Indonesia",
              name: "",
              age: "",
              gender: "",
              chatbotName: "VRED",
            }
          }
        />
      )}
    </>
  );
}