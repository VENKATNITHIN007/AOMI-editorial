import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NAV_PATHS } from "@/lib/constants/nav";
import { Page } from "@/components/Page";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

/**
 * Reusable shell for all Authentication pages.
 * Provides a centered card layout with branding, navigation back to home,
 * and consistent editorial styling across all auth flows.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  icon: Icon,
  className,
}: AuthShellProps) {
  return (
    <Page className="items-center justify-center bg-white relative">
      {/* Back to Home — Always visible, responsive positioning */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
        <Link
          href={NAV_PATHS.HOME}
          className="group flex items-center gap-3 transition-all hover:opacity-70"
        >
          <ArrowLeft className="size-4 text-gray-400 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
            Photophile
          </span>
        </Link>
      </div>

      <Page.Body className={cn("max-w-[480px] w-full py-24 sm:py-20 px-6", className)}>
        <div className="space-y-10">
          {/* Header Section */}
          <header className="space-y-5 text-center">
            {Icon && (
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-black">
                <Icon className="h-6 w-6 text-black" />
              </div>
            )}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-black">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 max-w-[320px] mx-auto leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <div className="border-t border-gray-200 pt-10">
            {children}
          </div>

          {/* Footer Section */}
          {footer && (
            <footer className="pt-6 text-center">
              <div className="text-xs uppercase tracking-[0.15em] text-gray-400 [&_a]:text-black [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-gray-600">
                {footer}
              </div>
            </footer>
          )}
        </div>
      </Page.Body>
    </Page>
  );
}
