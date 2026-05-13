"use client";

import Link from "next/link";
import { MapPin, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Page } from "@/components/Page";
import type { PhotographerListItem } from "@/lib/types/photographer";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";

interface PhotographerCardProps {
  photographer: PhotographerListItem;
}

const CURRENCY_SYMBOL = "₹";

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  const name = photographer.userId?.fullName || "Anonymous";
  const avatar = photographer.userId?.avatar;
  const username = photographer.username;
  
  const thumbnail = getOptimizedImageUrl(photographer.thumbnailUrl, "thumbnail");
  const optimizedAvatar = getOptimizedImageUrl(avatar, "avatar");

  return (
    <Link 
      href={`/photographers/${username}`} 
      className="group block bg-white border border-black/[0.03] hover:border-black/10 transition-all duration-300 hover:shadow-xl"
    >
      <article className="relative">
        {/* Compact Portrait Thumbnail (4:5) */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-200">
              <ImageIcon className="size-8 opacity-10" />
            </div>
          )}
        </div>

        {/* Dense Identity Footer */}
        <div className="p-3">
          <Page.Stack className="gap-2">
            <Page.Row className="gap-2 items-center">
              <Avatar className="size-8 border border-black/[0.03] shrink-0">
                <AvatarImage src={optimizedAvatar || undefined} alt={name} className="object-cover" />
                <AvatarFallback className="text-[8px] font-black bg-neutral-50 uppercase">
                  {(name || username).charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <Page.Stack className="min-w-0 flex-1 gap-0.5">
                <Page.Row className="gap-1 items-center">
                  <h3 className="text-[10px] font-black text-black truncate uppercase tracking-tight leading-tight">
                    {name}
                  </h3>
                  <CheckCircle2 className="size-2.5 text-blue-500 shrink-0" />
                </Page.Row>
                
                <Page.Row className="gap-1 text-neutral-400 items-center">
                  <MapPin className="size-2" />
                  <span className="text-[7px] font-black uppercase tracking-widest truncate">
                    {photographer.location || "Anywhere"}
                  </span>
                </Page.Row>
              </Page.Stack>
            </Page.Row>

            {/* Price Row - Ultra Compact */}
            <div className="pt-2 border-t border-black/[0.03] flex justify-end">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-black text-black tracking-tighter">
                  {photographer.priceFrom ? `${CURRENCY_SYMBOL}${photographer.priceFrom}` : "TBD"}
                </span>
                <span className="text-[7px] font-bold text-neutral-300 uppercase tracking-widest">/ hr</span>
              </div>
            </div>
          </Page.Stack>
        </div>
      </article>
    </Link>
  );
}
