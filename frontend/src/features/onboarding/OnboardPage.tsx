"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NAV_PATHS } from "@/lib/constants/nav";
import { OnboardForm } from "./components/OnboardForm";

/**
 * Onboarding page shell.
 * Provides branding, navigation back to home, and the onboarding form.
 */
export function OnboardPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-4 py-20 sm:py-24">
      {/* Back to Home */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
        <Link
          href={NAV_PATHS.HOME}
          className="group flex items-center gap-3 transition-all hover:opacity-70"
        >
          <ArrowLeft className="size-4 text-gray-400 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
            Photophile
          </span>
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-300">
            Professional Program
          </p>
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-[0.1em] text-black">
            Create Your <span className="font-bold italic">Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-light tracking-wider max-w-md mx-auto">
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
