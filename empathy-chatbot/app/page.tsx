"use client";

import { useState } from "react";

import LandingPage from "../components/LandingPage";
import Onboarding from "../components/OnBoarding";
import ChatLayout from "../components/ChatLayout";
export default function Home() {

  const [started, setStarted] = useState(false);

  const [onboarded, setOnboarded] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  return (

    <main>

      {!started && (
        <LandingPage
          onStart={() => setStarted(true)}
        />
      )}

      {started && !onboarded && (

        <Onboarding
          onFinish={(data) => {
            setProfile(data);
            setOnboarded(true);

            console.log(data);
          }}
        />

      )}

      {started && onboarded && (

        <div className="min-h-screen flex items-center justify-center bg-black text-white text-4xl">

          <ChatLayout profile={profile} />

        </div>

      )}

    </main>
  );
}