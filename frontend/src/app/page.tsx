import { Hero } from "@/features/landing/Hero";
import { CategoryGrid } from "@/features/landing/CategoryGrid";
import { StudioCTA } from "@/features/landing/StudioCTA";
import { MainHeader } from "@/components/layout/Header/MainHeader";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

/**
 * Premium Landing Page (Minimalist & High-Impact).
 * Moved to root to resolve Vercel 404 routing issues.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <StudioCTA />
      </main>

      {/* Editorial Stark Black Footer */}
      <footer className="py-20 md:py-32 bg-black text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 mb-24">
            <div className="flex flex-col gap-6 max-w-sm">
              <Logo className="text-3xl sm:text-4xl text-white" />
              <p className="text-[10px] uppercase tracking-[0.3em] font-light text-white/40 leading-relaxed">
                The world&apos;s premier editorial showcase for professional photographers and cinematic storytellers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 md:gap-16 text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">
              <Link href="/photographers" className="hover:text-white transition-colors">Photographers</Link>
              <Link href="/photographer/onboard" className="hover:text-white transition-colors">Start Studio</Link>
              <a href="mailto:hello@aomi.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black">
              © {new Date().getFullYear()} ΛOMI Editorial
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
              Connecting Creative Perspective Worldwide
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
