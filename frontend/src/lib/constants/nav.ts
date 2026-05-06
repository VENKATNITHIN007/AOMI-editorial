/**
 * NAVIGATION CONSTANTS
 * 
 * Centralized source of truth for all primary and secondary navigation.
 */

export const NAV_PATHS = {
  HOME: "/",
  DISCOVERY: "/photographers",
  LOGIN: "/login",

  REGISTER: "/register",
  ONBOARDING: "/photographer/onboard",
  DASHBOARD: "/photographer/dashboard",
  PROFILE: "/profile",
} as const;

export const MAIN_NAV_ITEMS = [
  { label: "Home", path: NAV_PATHS.HOME },
  { label: "Explore", path: NAV_PATHS.DISCOVERY },
] as const;

export const STUDIO_CTA = {
  LABEL: "Start Studio",
  DESCRIPTION: "Create your portfolio and start getting leads.",
} as const;
