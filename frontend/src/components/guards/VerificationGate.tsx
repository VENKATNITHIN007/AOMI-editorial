"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, getAuthRedirect } from "@/features/auth";

const GUARDED_PATH_PREFIXES = [
  "/dashboard",
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

    const target = getAuthRedirect(user);
    const isExempt = pathname === "/photographer/onboard" || pathname.startsWith("/photographers/");
    
    if (target !== pathname && !pathname.startsWith(target) && !isExempt) {
      router.replace(target);
    }

  }, [loading, user, pathname, router]);

  const isAuthorized = user && (getAuthRedirect(user) === pathname 
    || pathname === "/photographer/onboard" 
    || pathname.startsWith("/photographers/"));

  if (!loading && isGuardedPath(pathname) && !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default VerificationGate;
