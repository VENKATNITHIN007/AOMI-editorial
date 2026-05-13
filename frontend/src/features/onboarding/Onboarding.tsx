"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft, Sparkles, Camera, Rocket, ArrowRight } from "lucide-react";
import { NAV_PATHS } from "@/lib/constants/nav";
import { OnboardingWizard } from "./OnboardingWizard";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Onboarding Page Component.
 * 
 * High-quality modular architecture:
 * 1. Business Logic -> useOnboarding hook (via OnboardingWizard)
 * 2. Visual Layout -> Onboarding (this file)
 * 3. Wizard Orchestration -> OnboardingWizard
 */
export function Onboarding() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-6 py-20 sm:py-32 overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-gray-50 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Back to Home Branding */}
      <header className="absolute top-6 left-6 sm:top-10 sm:left-10">
        <Link
          href={NAV_PATHS.HOME}
          className="group flex items-center gap-3 transition-all hover:opacity-70"
        >
          <ArrowLeft className="size-4 text-gray-400 transition-transform group-hover:-translate-x-1" />
          <Logo className="text-[12px] sm:text-[14px]" />
        </Link>
      </header>

      <div className="w-full max-w-5xl mx-auto space-y-24">
        {/* Page Header */}
        <div className="space-y-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-gray-400">
            Professional Program
          </p>
          <h1 className="text-6xl sm:text-8xl font-serif italic text-black leading-[1.1]">
            Your Vision, <br />
            <span className="font-bold not-italic">Professionalized.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl">
            Join an elite community of photographers. Set up your digital studio and reach clients who value art.
          </p>
        </div>

        {/* Process Details (Initial Details) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
          <div className="space-y-4">
            <div className="size-12 bg-gray-50 flex items-center justify-center">
              <Sparkles className="size-5 text-black" />
            </div>
            <h3 className="text-lg font-serif">1. Brand Identity</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">Set your unique handle, professional specialties, and editorial biography.</p>
          </div>

          <div className="space-y-4">
            <div className="size-12 bg-gray-50 flex items-center justify-center">
              <Camera className="size-5 text-black" />
            </div>
            <h3 className="text-lg font-serif">2. Portfolio Curation</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">Upload your best works. Our high-resolution gallery makes your art stand out.</p>
          </div>

          <div className="space-y-4">
            <div className="size-12 bg-gray-50 flex items-center justify-center">
              <Rocket className="size-5 text-black" />
            </div>
            <h3 className="text-lg font-serif">3. Studio Launch</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">Go live with a premium micro-website designed to convert leads into bookings.</p>
          </div>
        </div>

        {/* Call to Action (Opens Form in Dialog) */}
        <div className="pt-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="group h-20 px-12 bg-black hover:bg-gray-900 text-white rounded-none text-xs uppercase tracking-[0.4em] font-bold shadow-2xl transition-all active:scale-95">
                Launch My Studio
                <ArrowRight className="size-4 ml-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border-none p-0">
              <div className="p-8 sm:p-16">
                <DialogHeader className="mb-12">
                  <DialogTitle className="text-4xl font-serif italic">Studio Setup</DialogTitle>
                </DialogHeader>
                <OnboardingWizard />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
