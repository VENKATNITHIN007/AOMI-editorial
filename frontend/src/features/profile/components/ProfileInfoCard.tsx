"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, User as UserIcon, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Page } from "@/components/Page";
import { useAuth } from "@/features/auth";
import { ProfileForm } from "./ProfileForm";

export function ProfileInfoCard() {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Page.Surface 
      tabIndex={0}
      className="w-full overflow-hidden bg-white rounded-none border-black/10 hover:border-black/30 active:border-black active:scale-[0.99] transition-all duration-300 cursor-default group/card"
    >
      <div className="p-6 sm:p-12">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8">
          <div className="flex flex-row items-center sm:items-start gap-6 w-full">
            {/* COMPACT ROUND AVATAR */}
            <div className="size-20 sm:size-28 rounded-full border border-black/5 p-1 bg-white shrink-0 transition-all duration-700 group-hover/card:border-black/10 group-hover/card:scale-105">
              <div className="relative w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <Image src={user.avatar} alt={user.name || "User avatar"} fill className="object-cover" />
                ) : (
                  <UserIcon className="size-10 sm:size-14 text-gray-200" strokeWidth={1} />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-left pt-2 sm:pt-6 min-w-0">
               <h3 className="text-xl sm:text-3xl font-medium text-black tracking-tight uppercase truncate transition-colors group-hover/card:text-black">
                 {user?.name || "ANONYMOUS"}
               </h3>
               <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 flex items-center justify-start gap-2 tracking-[0.1em] uppercase truncate transition-colors group-hover/card:text-gray-500">
                 <Mail className="size-3.5 shrink-0" /> <span className="truncate">{user?.email}</span>
               </p>
            </div>
          </div>

          <div className="pt-2 w-full sm:w-auto flex sm:block justify-end">
            <Button 
              onClick={() => setIsEditDialogOpen(true)}
              className="h-10 px-8 w-full sm:w-auto rounded-none bg-black hover:bg-neutral-800 text-white border-none shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Edit Profile
            </Button>

            <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <SheetContent side="right" className="w-full sm:max-w-md border-l border-black shadow-2xl bg-white p-6 sm:p-10 overflow-y-auto rounded-none">
                <SheetHeader className="mb-6 border-b border-gray-50 pb-6 text-left">
                  <SheetTitle className="text-xl font-bold tracking-tighter uppercase text-black">Modify Identity</SheetTitle>
                  <SheetDescription className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
                    Update your professional account core attributes
                  </SheetDescription>
                </SheetHeader>
                <ProfileForm onSuccess={() => setIsEditDialogOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* COLLECTIVE HOVER DATA LIST */}
        <div className="mt-8 sm:mt-12 space-y-0 border-t border-black/5">
          {/* Phone Number Item */}
          <div className="flex items-center justify-between py-5 sm:py-6 border-b border-black/[0.03] px-2 sm:px-4 transition-colors">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-2.5 bg-gray-50 rounded-none text-gray-400 transition-all duration-500 group-hover/card:bg-black group-hover/card:text-white">
                <Phone className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 transition-colors duration-500 group-hover/card:text-black">Contact / Mobile</p>
                <p className="text-sm sm:text-base font-light text-black tracking-widest">{user?.phoneNumber || "NOT_SPECIFIED"}</p>
              </div>
            </div>
          </div>

          {/* Role Item */}
          <div className="flex items-center justify-between py-5 sm:py-6 px-2 sm:px-4 transition-colors">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-2.5 bg-gray-50 rounded-none text-gray-400 transition-all duration-500 group-hover/card:bg-black group-hover/card:text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 transition-colors duration-500 group-hover/card:text-black">Access Permission</p>
                <div className="pt-1">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 border border-black/5 text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
                    {user?.role || "USER"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page.Surface>
  );
}
