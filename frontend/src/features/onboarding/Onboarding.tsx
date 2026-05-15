"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Sparkles, Camera, Rocket, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OnboardingDetailsForm } from "./components/OnboardingDetailsForm";
import { useOnboarding } from "./useOnboarding";

/**
 * Simplified Onboarding Feature.
 * Direct path to studio creation.
 */
export function Onboarding() {
  const { handleDetailsSubmit, isSavingDetails } = useOnboarding();

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-6 pt-6 sm:pt-10 pb-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="w-full max-w-5xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="space-y-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-gray-400">
            Professional Program
          </p>
          <h1 className="text-5xl sm:text-7xl font-serif italic text-black leading-[1.1]">
            Your Vision, <br />
            <span className="font-bold not-italic text-4xl sm:text-6xl">Professionalized.</span>
          </h1>
          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-xl">
            Join an elite community of photographers. Set up your digital studio and reach clients who value art.
          </p>
        </div>

        {/* Simplified Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
          <div className="space-y-4">
            <h3 className="text-lg font-serif italic flex items-center gap-3">
              <Sparkles className="size-4 text-black" />
              Identity
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Set your unique professional handle and editorial biography.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif italic flex items-center gap-3">
              <Camera className="size-4 text-black" />
              Showcase
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Your portfolio is served in high-resolution magazine layouts.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif italic flex items-center gap-3">
              <Rocket className="size-4 text-black" />
              Launch
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Go live instantly with a premium micro-website built to convert.</p>
          </div>
        </div>

        {/* Direct CTA */}
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
                <DialogHeader className="mb-10">
                  <DialogTitle className="text-3xl font-serif italic">Studio Setup</DialogTitle>
                </DialogHeader>
                
                <OnboardingDetailsForm 
                  onSubmit={handleDetailsSubmit} 
                  isPending={isSavingDetails} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
