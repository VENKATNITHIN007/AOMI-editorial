import { PageSpinner } from "@/components/Spinner";

/**
 * Global root loading indicator.
 * Provides a consistent safety net for all page transitions.
 */
export default function GlobalLoading() {
  return <PageSpinner />;
}
