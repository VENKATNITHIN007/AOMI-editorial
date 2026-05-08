/**
 * Bare layout for photographer public profiles.
 * No global header or footer — the profile page renders its own branded bar.
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
