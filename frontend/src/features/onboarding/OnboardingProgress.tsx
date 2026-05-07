"use client";

interface OnboardingProgressProps {
  step: 1 | 2 | 3;
}

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
      <div className="flex items-center gap-4">
        <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
        <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>Intro</span>
      </div>
      <div className={`h-px flex-1 mx-4 ${step >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
      <div className="flex items-center gap-4">
        <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
        <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>Details</span>
      </div>
      <div className={`h-px flex-1 mx-4 ${step >= 3 ? 'bg-black' : 'bg-gray-100'}`} />
      <div className="flex items-center gap-4">
        <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
        <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>Portfolio</span>
      </div>
    </div>
  );
}
