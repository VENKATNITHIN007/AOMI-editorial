"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { Mail, MapPin, Instagram, Globe, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { usePhotographerPortfolioQuery, usePhotographerProfileQuery } from "./public-profile.queries";
import { cn } from "@/lib/utils";

interface PublicProfilePageProps {
  username: string;
}

const CURRENCY_SYMBOL = "₹";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { data: profile, isLoading: profileLoading, error: profileError } = usePhotographerProfileQuery(username);
  const { data: portfolio, isLoading: portfolioLoading } = usePhotographerPortfolioQuery(username);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Loading
  if (profileLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <DataState.Loading className="text-white/40" />
      </div>
    );
  }

  // Error states
  const isNotFound =
    profileError &&
    typeof profileError === "object" &&
    "response" in profileError &&
    (profileError as AxiosError).response?.status === 404;

  if (profileError && !isNotFound) {
    return (
      <Page className="bg-[#111] text-white">
        <Page.Body>
          <DataState.Empty
            title="Unable to load profile"
            description="Please try again later."
            action={<Button asChild variant="outline" className="text-black"><Link href="/photographers">Back to directory</Link></Button>}
          />
        </Page.Body>
      </Page>
    );
  }

  if (!profile || isNotFound) {
    return (
      <Page className="bg-[#111] text-white">
        <Page.Body>
          <DataState.Empty
            title="Photographer not found"
            description="This profile does not exist anymore."
            action={<Button asChild variant="outline" className="text-black"><Link href="/photographers">Back to directory</Link></Button>}
          />
        </Page.Body>
      </Page>
    );
  }

  const email = profile.userId.email;
  const name = profile.userId.fullName;
  const heroImage = portfolio?.[0]?.mediaUrl;
  const aboutImage = portfolio?.[1]?.mediaUrl || heroImage; // Use second image for about, or fallback to hero

  return (
    <div className="min-h-screen bg-[#111] text-[#f5f5f5] selection:bg-white selection:text-black font-sans">
      
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-6 flex justify-between items-center mix-blend-difference text-white">
        {/* Logo/Name */}
        <div className="flex items-center gap-4">
           <div className="text-lg font-bold tracking-[0.2em] uppercase">
             [o] {name}
             <span className="block text-[8px] tracking-[0.3em] font-light text-white/70 mt-1">Photographer</span>
           </div>
        </div>

        {/* Center Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-12">
          {['home', 'portfolio', 'about', 'contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item)}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-white",
                item === 'home' ? "text-white border-b border-white pb-1" : "text-white/60"
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-6">
           <Link href="/photographers" className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors">Directory</Link>
           <button className="lg:hidden text-white"><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section id="home" className="relative h-screen w-full flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {heroImage ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-[#222]" />
          )}
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#111]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium text-white/80 mb-6">
              Capturing moments. Creating stories.
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] leading-[1.1] font-serif text-white mb-8 tracking-tight">
              Photography<br/>that speaks.
            </h1>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-md mb-12">
              {profile.bio || `I'm ${name}, a photographer passionate about capturing real moments and telling stories through visuals.`}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollTo('portfolio')} className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-between group hover:bg-white/90 transition-colors w-48">
                View Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo('about')} className="px-8 py-4 bg-transparent border border-white/30 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors w-48">
                About Me
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Socials & Scroll Text (Desktop) */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-10">
           <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
           <a href="#" className="text-white/60 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
           <div className="w-px h-16 bg-white/30 my-4" />
           <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 -rotate-90 origin-center translate-y-12 whitespace-nowrap">Scroll</span>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION ─────────────────────────────────────── */}
      <section id="portfolio" className="py-24 sm:py-32 px-6 sm:px-12 max-w-[1800px] mx-auto">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div>
               <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 flex items-center gap-4 mb-4">
                 Portfolio <span className="w-12 h-px bg-white/20" />
               </p>
               <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">Selected Works</h2>
            </div>
            {portfolio && portfolio.length > 6 && (
              <button className="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white flex items-center gap-2 transition-colors">
                 View All Works <ArrowRight className="w-3 h-3" />
              </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio?.slice(0, 6).map((item) => (
               <div 
                  key={item._id} 
                  className="group relative overflow-hidden bg-[#222] aspect-[4/3] cursor-pointer"
                  onClick={() => item.mediaType === "image" && setLightboxImg(item.mediaUrl)}
               >
                  {item.mediaType === "image" ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={item.mediaUrl} alt={item.category || "Work"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                  ) : (
                     <video src={item.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  )}
                  {/* Overlay text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                     <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-white">{item.category || "General"}</span>
                     <ArrowRight className="w-4 h-4 text-white" />
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────────── */}
      <section id="about" className="py-24 sm:py-32 px-6 sm:px-12 max-w-[1800px] mx-auto border-t border-white/5">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="relative aspect-[3/4] max-w-md w-full mx-auto lg:mx-0">
               {aboutImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aboutImage} alt="About" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700" />
               ) : (
                  <div className="w-full h-full bg-[#222]" />
               )}
            </div>

            {/* Content */}
            <div className="max-w-xl">
               <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 flex items-center gap-4 mb-8">
                 About Me <span className="w-12 h-px bg-white/20" />
               </p>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-8">
                 Turning moments<br/>into timeless memories.
               </h2>
               <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed mb-10">
                 Photography is more than just pictures to me. It&apos;s about emotion, connection, and the beauty in everyday moments. I strive to create images that you&apos;ll cherish for a lifetime. My approach is natural, unobtrusive, and focused on capturing genuine expressions.
               </p>
               <button className="px-8 py-4 bg-transparent border border-white/30 text-white text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-4 group hover:bg-white/10 transition-colors">
                  Get To Know Me <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </section>

      {/* ── CONTACT/FOOTER SECTION ────────────────────────────────── */}
      <section id="contact" className="py-12 border-t border-white/10 bg-[#0a0a0a]">
         <div className="max-w-[1800px] mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
               © {new Date().getFullYear()} {name} Photography
            </p>
            <div className="text-xl font-bold tracking-[0.2em] uppercase text-white/80">
               [o]
            </div>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
               <button onClick={() => scrollTo('home')} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors ml-4">
                  <ArrowRight className="w-3 h-3 -rotate-90" />
               </button>
            </div>
         </div>
      </section>

      {/* ── LIGHTBOX ──────────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-300"
          onClick={() => setLightboxImg(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImg}
            alt="Full view"
            className="max-w-full max-h-[95vh] object-contain animate-in zoom-in-95 duration-500"
          />
          <button className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PublicProfilePage;
