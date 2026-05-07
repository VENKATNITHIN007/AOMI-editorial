"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { getAuthRedirect } from "@/lib/auth-navigation";

const GUARDED_PATH_PREFIXES = [
  "/profile",
  "/photographer/dashboard",
  "/photographer/onboard",
];

const isGuardedPath = (pathname: string): boolean => {
  return GUARDED_PATH_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export function VerificationGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !isGuardedPath(pathname)) {
      return;
    }

    if (!user) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const redirectTarget = search ? `${pathname}${search}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    // For verified users, we only redirect if they are on a path they shouldn't be 
    // (e.g. trying to onboard again when already a photographer).
    // Otherwise, we let them navigate between their allowed guarded paths (Profile, Dashboard, etc.)
    if (user.isEmailVerified) {
      const isPhotographer = user.role === "photographer";
      const isVisitingOnboard = pathname.startsWith("/photographer/onboard");
      
      // If already a photographer, don't let them go back to onboarding
      if (isPhotographer && isVisitingOnboard) {
        router.replace("/photographer/dashboard");
      }
      return;
    }

    // For unverified users, force them to the target (usually /verify-email/pending)
    const target = getAuthRedirect(user);
    if (target !== pathname && !pathname.startsWith(target)) {
      router.replace(target);
    }

  }, [loading, user, pathname, router]);

  const isAuthorized = user && (
    user.isEmailVerified || 
    getAuthRedirect(user) === pathname || 
    pathname.startsWith("/photographers/")
  );

  if (!loading && isGuardedPath(pathname) && !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default VerificationGate;
