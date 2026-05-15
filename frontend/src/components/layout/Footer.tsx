import React from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Unified Thin Footer.
 * Minimalist design with light/dark variants.
 */
export function Footer({ variant = "light", className }: FooterProps) {
  const isDark = variant === "dark";

  return (
    <footer 
      className={cn(
        "py-12 border-t transition-colors duration-500",
        isDark ? "bg-black border-white/5 text-white" : "bg-white border-gray-50 text-black",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo 
          className={cn("text-[10px] opacity-40", isDark && "text-white")} 
          variant="minimal" 
        />
        
        <p className={cn(
          "text-[9px] uppercase tracking-[0.2em] font-bold",
          isDark ? "text-white/20" : "text-gray-400"
        )}>
          &copy; {new Date().getFullYear()} ΛOMI Editorial. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
