"use client";

import { OnboardForm } from "./components/OnboardForm";

export function OnboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-16 sm:py-24">
      <div className="w-full max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-300">
            Professional Program
          </p>
          <h1 className="text-4xl font-light uppercase tracking-[0.1em] text-black">
            Create Your <span className="font-bold italic">Studio</span>
          </h1>
          <p className="text-sm text-gray-400 font-light tracking-wider max-w-md mx-auto">
            Set up your profile and start showcasing your work in minutes.
          </p>
        </div>

        <div className="border border-gray-100 bg-white">
          <OnboardForm />
        </div>
      </div>
    </div>
  );
}
