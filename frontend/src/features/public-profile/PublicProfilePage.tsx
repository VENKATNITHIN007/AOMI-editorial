"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { AxiosError } from "axios";
import { Mail, MapPin, Instagram, ArrowRight, ArrowLeft, Menu, X } from "lucide-react";
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
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = usePhotographerProfileQuery(username);
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError, refetch: refetchPortfolio } = usePhotographerPortfolioQuery(username);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Curate portfolio: Show featured items if any, otherwise show all
  const featuredPortfolio = useMemo(() => {
    if (!portfolio) return [];
    const featured = portfolio.filter(item => item.isFeatured);
    return featured.length > 0 ? featured : portfolio;
  }, [portfolio]);

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

  if ((profileError && !isNotFound) || portfolioError) {
    return (
      <Page className="bg-[#111] text-white">
        <Page.Body>
          <DataState.Error
            message="Unable to load complete profile data."
            actionLabel="Retry Connection"
            onRetry={() => {
              refetchProfile();
              refetchPortfolio();
            }}
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

  const email = profile?.userId?.email;
  const name = profile?.userId?.fullName || profile?.username;
  
  // CURATION LOGIC: Use specific IDs if set, otherwise fallback to index
  const heroItem = portfolio?.find(p => p._id === profile.heroImageId) || portfolio?.[0];
  const aboutItem = portfolio?.find(p => p._id === profile.aboutImageId) || portfolio?.[1] || portfolio?.[0];
  
  const heroImage = heroItem?.mediaUrl;
  const aboutImage = aboutItem?.mediaUrl;



  return (
    <div className="min-h-screen bg-[#111] text-[#f5f5f5] selection:bg-white selection:text-black font-sans">
      
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-6 flex justify-between items-center mix-blend-difference text-white">
        {/* Logo/Name */}
        {/* Back to Discover (Left) */}
        <div className="flex items-center gap-6">
           <Link href="/photographers" className="flex items-center text-[10px] uppercase tracking-[0.3em] font-black text-white hover:text-white/70 transition-colors">
             <ArrowLeft className="w-4 h-4 mr-3" /> Back to Discover
           </Link>
        </div>

        {/* Center Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-12">
          {['home', 'portfolio', 'about'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item)}
              className={cn(
                "text-[10px] uppercase tracking-[0.4em] font-bold transition-colors hover:text-white",
                item === 'home' ? "text-white border-b border-white pb-1" : "text-white/40"
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        {/* Right actions (Empty or minimal) */}
        <div className="flex items-center gap-6">
           <button className="lg:hidden text-white"><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section id="home" className="relative h-screen w-full flex items-end pb-24 sm:pb-32">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {heroImage ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-[#222]" />
          )}
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          
          {/* Editorial Badge */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left hidden lg:block">
            <span className="text-[9px] uppercase tracking-[0.8em] text-white/20 font-black whitespace-nowrap pl-12">
              Photophile Editorial Feature — {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-8 sm:px-16">
          <div className="max-w-4xl w-full flex flex-col">
            <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] leading-[1.1] font-serif font-light text-white tracking-tight mb-8">
              {profile.heroTagline || "Photography that speaks."}
            </h1>
            <div className="flex items-center gap-6 self-end">
              <span className="h-px w-12 bg-white/30" />
              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/70">
                {name}
              </h2>
            </div>
          </div>
        </div>

        {/* Vertical Socials & Scroll Text (Desktop) */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-10">
           {profile.instagram && (
             <a href={profile.instagram} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
           )}
           <div className="w-px h-16 bg-white/30 my-4" />
           <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 -rotate-90 origin-center translate-y-12 whitespace-nowrap">Scroll</span>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION ─────────────────────────────────────── */}
      <section id="portfolio" className="py-16 sm:py-24 px-8 sm:px-12 max-w-[1600px] mx-auto">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div>
                <h2 className="text-4xl sm:text-5xl font-serif font-medium text-white tracking-tighter italic">Selected Works</h2>
            </div>
            {portfolio && portfolio.length > 6 && (
              <button className="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white flex items-center gap-2 transition-colors">
                 View All Works <ArrowRight className="w-3 h-3" />
              </button>
            )}
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredPortfolio.slice(0, 8).map((item) => (
               <div 
                  key={item._id} 
                  className="group relative overflow-hidden bg-[#222] aspect-[4/5] cursor-pointer"
                  onClick={() => item.mediaType === "image" && setLightboxImg(item.mediaUrl)}
               >
                  {item.mediaType === "image" ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={item.mediaUrl} alt={item.category || "Work"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                  ) : (
                     <video src={item.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  )}
                  {/* Overlay text */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]" />
                   <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-out">
                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold">Category</span>
                        <span className="block text-lg font-serif text-white italic">{item.category || "Untitled"}</span>
                      </div>
                      <div className="size-12 rounded-full border border-white/20 flex items-center justify-center text-white">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                </div>
            ))}
         </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-24 px-8 sm:px-12 max-w-[1400px] mx-auto border-t border-white/5">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] max-w-md w-full mx-auto lg:mx-0">
               {aboutImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aboutImage} alt="About" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700" />
               ) : (
                  <div className="w-full h-full bg-[#222]" />
               )}
            </div>

            {/* Content Column */}
            <div className="max-w-xl flex flex-col justify-center">
               <div className="flex flex-col gap-4 mb-12">
                 <h2 className="text-5xl sm:text-6xl font-serif font-light text-white tracking-tighter leading-tight">{name}</h2>
                 <p className="text-lg text-white/40 font-serif italic tracking-wide max-w-md">
                    {profile.bio || "Visual Narrative"}
                 </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 border-y border-white/5 py-10 mb-10">
                 <div className="space-y-3">
                   <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">Investment</p>
                   <p className="text-lg font-serif text-white/90">Starting from ₹{profile.priceFrom || "5,000"}</p>
                 </div>
                 <div className="space-y-3">
                   <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">Specialties</p>
                   <p className="text-sm font-sans font-light text-white/60 leading-relaxed uppercase tracking-widest">
                     {profile.specialties && profile.specialties.length > 0 
                       ? profile.specialties.join(" • ") 
                       : "Wedding • Portrait • Lifestyle"}
                   </p>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 {profile.instagram && (
                   <Button asChild className="rounded-none bg-white text-black hover:bg-white/90 px-10 h-14 text-[10px] uppercase tracking-[0.3em] font-bold">
                     <a href={profile.instagram} target="_blank" rel="noreferrer">
                       Instagram
                     </a>
                   </Button>
                 )}
                 {email && (
                   <Button asChild variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/5 px-10 h-14 text-[10px] uppercase tracking-[0.3em] font-bold">
                     <a href={`mailto:${email}`}>
                       Get in Touch
                     </a>
                   </Button>
                 )}
               </div>
            </div>
         </div>
      </section>

      {/* ── FOOTER SECTION ────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/10 bg-[#0a0a0a]">
         <div className="max-w-[1800px] mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="text-2xl font-bold tracking-[0.4em] uppercase text-white">
                 [o] {name}
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                 © {new Date().getFullYear()} Photophile. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
               <Link href="/photographers" className="hover:text-white transition-colors">Directory</Link>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <button onClick={() => scrollTo('home')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                  <ArrowRight className="w-4 h-4 -rotate-90" />
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
