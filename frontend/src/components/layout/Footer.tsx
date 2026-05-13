import React from "react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="py-12 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <Logo className="text-[10px] opacity-40" variant="minimal" />
        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
          &copy; {new Date().getFullYear()} ΛOMI Editorial. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
