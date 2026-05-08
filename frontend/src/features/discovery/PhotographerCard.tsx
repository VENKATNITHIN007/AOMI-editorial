import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Page } from "@/components/Page";
import type { PhotographerListItem } from "@/lib/types/photographer";
import { cn } from "@/lib/utils";

interface PhotographerCardProps {
  photographer: PhotographerListItem;
}

const CURRENCY_SYMBOL = "₹";

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  const name = photographer.userId?.fullName || "Anonymous";
  const avatar = photographer.userId?.avatar;
  const username = photographer.username;

  return (
    <Link 
      href={`/photographers/${username}`} 
      className="group block h-full bg-white border border-gray-100 hover:border-black transition-all duration-500 shadow-sm hover:shadow-xl"
      data-testid="photographer-card"
    >
      <article className="h-full flex flex-col">
        {/* Header: Large Avatar + Name */}
        <div className="p-8 pb-4">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="h-32 w-32 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
              <AvatarImage src={avatar || undefined} alt={name} className="object-cover" />
              <AvatarFallback className="text-2xl font-light bg-gray-50 uppercase tracking-tighter">
                {(name || username).charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold uppercase tracking-tight text-black leading-tight">
                {name}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 group-hover:text-amber-600 transition-colors">
                @{username}
              </p>
            </div>
          </div>
        </div>

        {/* Content: Bio + Specialties */}
        <div className="px-8 flex-grow">
          <div className="space-y-6 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 text-center italic font-light">
              &ldquo;{photographer.bio || "Crafting moments into timeless visual stories."}&rdquo;
            </p>

            <div className="flex flex-wrap justify-center gap-1.5">
              {(photographer.specialties || []).slice(0, 3).map((spec) => (
                <span 
                  key={spec} 
                  className="px-2 py-0.5 border border-gray-100 text-[9px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-black group-hover:border-black transition-all"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Metadata & CTA */}
        <div className="mt-8 border-t border-gray-50 bg-gray-50/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="size-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {photographer.location || "Worldwide"}
                </span>
              </div>
              <div className="text-black">
                <span className="text-[9px] uppercase font-black tracking-widest opacity-30 mr-2">From</span>
                <span className="text-lg font-black tracking-tighter">
                  {photographer.priceFrom ? `${CURRENCY_SYMBOL}${photographer.priceFrom}` : "TBD"}
                </span>
              </div>
            </div>
            
            <div className="size-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
              <ArrowRight className="size-4 text-gray-300 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
