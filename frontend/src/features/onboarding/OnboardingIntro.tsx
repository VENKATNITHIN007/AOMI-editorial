"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingIntroProps {
  onNext: () => void;
}

export function OnboardingIntro({ onNext }: OnboardingIntroProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-black">
          Own Your <span className="font-bold italic">Creative</span>
        </h2>
        <p className="text-sm text-gray-400 font-light tracking-wider leading-relaxed max-w-lg mx-auto">
          Join Photophile's exclusive network of professional photographers. 
          Get a beautiful public portfolio, connect directly with clients, and manage your bookings—all with 0% commission.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
        <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
          <p className="text-xl font-bold uppercase tracking-widest text-black">0%</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Commission</p>
        </div>
        <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
          <p className="text-xl font-bold uppercase tracking-widest text-black">100%</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Control</p>
        </div>
        <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
          <p className="text-xl font-bold uppercase tracking-widest text-black">∞</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Reach</p>
        </div>
      </div>

      <Button 
        onClick={onNext} 
        className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
      >
        Start Setup <ChevronRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}
